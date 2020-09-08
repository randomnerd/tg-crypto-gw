import { Service, Event, Action, Method } from 'moleculer-decorators'
import { User } from '../entity/user'
import { getDbMixin, DbService } from '../lib/dbmixin'
import { Payment } from '../entity/payment'
import { Capusta, CapustaConfig, PaymentStatus } from '../lib/capusta'
import config from 'config'
import { after, minutes } from '../lib/time'
import { makeId } from '../lib/tmp'
import { EthereumPaymentInfo } from './ethereum.service'

@Service({ name: 'payment', mixins: [getDbMixin(Payment)], dependencies: ['telegram'] })
export default class PaymentService extends DbService<Payment> {
    private readonly capusta = new Capusta(config.get<CapustaConfig>('capusta'))
    private updateTimer: NodeJS.Timeout
    private updating = false

    async started() {
        this.updatePayments().catch(this.logger.error)
    }

    async stopped() {
        clearTimeout(this.updateTimer)
    }

    @Action({ params: { user_id: 'number', amount: 'number', currency: 'string' } })
    async create({ params: { user_id, amount, currency } }) {
        return await this.createPayment(user_id, amount, currency)
    }

    @Method
    async createPayment(user_id: number, amount: number, currency: string, expire = after(minutes(30))) {
        const user = await this.connection.getRepository(User).findOne(user_id)
        if (!user) throw new Error('User not found')
        const id = makeId('string')
        const payment = this.repo.create({ id, amount, expire, currency, user_id, crypto: false })
        switch (currency) {
            case 'RUB':
                const cPayment = await this.capusta.createPayment(payment.id, amount, expire)
                payment.foreign_id = cPayment.payUrl.split('bill')[1]
                payment.pay_addr = cPayment.payUrl
                break
            case 'ETH':
                if (!this.broker.services.find(s => s.name === 'ethereum')) {
                    throw new Error('ethereum service not found')
                }
                payment.crypto = true
                const info = await this.broker.call<EthereumPaymentInfo, any>('ethereum.paymentInfo', { id })
                this.logger.info(info)
                Object.assign(payment, info)
                break
            default:
                throw new Error('Invalid currency')
        }
        await this.connection.getRepository(Payment).save(payment)
        await this.broker.broadcast('payment.created', payment)
        return payment
    }

    @Method
    async updatePayments() {
        try {
            if (this.updating) return
            this.updating = true
            const payments = await this.repo.find({ where: { status: PaymentStatus.CREATED } })
            await Promise.all(payments.map(p => this.processPayment(p)))
            this.updateTimer = setTimeout(() => void this.updatePayments(), 10 * 1000)
        } catch (e) {
            this.logger.error(e)
        } finally {
            this.updating = false
        }
    }

    @Method
    async processPayment(payment: Payment) {
        try {
            if (payment.crypto) return console.dir(payment)
            const rawPayment = await this.capusta.paymentStatus(payment.id)
            if (!rawPayment) {
                this.logger.error(`Payment not found`, rawPayment)
                return
            }
            if (payment.status === rawPayment.paymentStatus) return
            let event
            switch (rawPayment.paymentStatus) {
                case PaymentStatus.EXPIRED:
                    event = 'payment.expired'
                    break
                case PaymentStatus.SUCCESS:
                    event = 'payment.success'
                    break
                case PaymentStatus.FAIL:
                    event = 'payment.failed'
                    break
                default:
                    return
            }
            if (!payment.user_notified) await this.broker.broadcast(event, payment)
            payment.user_notified = true
            payment.status = rawPayment.paymentStatus
            // await this.repo.update(payment.id, { status: rawPayment.paymentStatus, user_notified: true })
            await this.repo.save(payment)
            this.logger.info(payment)
        } catch (e) {
            this.logger.error(e)
        }
    }

    @Event()
    async 'payment.success'({ id, user_id, amount, currency }: Payment) {
        const msg = `Your ${amount.toString()} ${currency} payment (ID: ${id}) has been processed!`
        await this.broker.call('telegram.sendMessage', { chat: user_id, msg })
    }

    @Event()
    async 'payment.failed'({ id, user_id, amount, currency }: Payment) {
        const msg = `Your ${amount.toString()} ${currency} payment (ID: ${id}) has failed!`
        await this.broker.call('telegram.sendMessage', { chat: user_id, msg })
    }

    @Event()
    async 'payment.expired'({ id, user_id, amount, currency }: Payment) {
        const msg = `Your ${amount.toString()} ${currency} payment (ID: ${id}) has expired!`
        await this.broker.call('telegram.sendMessage', { chat: user_id, msg })
    }

    @Event()
    async 'payment.created'({ id, user_id, amount, currency, pay_addr: pay_url }: Payment) {
        const msg = `Make your ${amount.toString()} ${currency} payment [here](${pay_url}) (ID: ${id})`
        await this.broker.call('telegram.sendMessage', { chat: user_id, msg })
    }
}
