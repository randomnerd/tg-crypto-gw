import { WizardScene } from 'telegraf'
import { ExtendedContext } from '../../context'
import { Message } from 'telegraf/typings/telegram-types'

export const createProductScene = new WizardScene<ExtendedContext>(
    'createPayment',
    async ctx => {
        try {
            if (!ctx.dbUser) throw new Error('User not identified')
            await ctx.reply('Enter payment currency (RUB/ETH)')
            return void ctx.wizard.next()
        } catch (e) {
            await ctx.reply(e.message)
            await ctx.scene.leave()
        }
    },
    async ctx => {
        try {
            // const amount: number = ctx.wizard.state.amount
            const currency = (ctx.message as Message.TextMessage).text.toUpperCase()
            if (!['RUB', 'ETH'].includes(currency)) throw new Error('Invalid currency (should be RUB/ETH)')
            ctx.wizard.state.currency = currency
            await ctx.reply('Enter payment amount')

            return void ctx.wizard.next()
        } catch (e) {
            await ctx.reply(`${e.message as string}, try again`)
        }
    },
    async ctx => {
        try {
            if (!ctx.dbUser) throw new Error('User not identified')
            const currency = ctx.wizard.state.currency
            const amount = Number((ctx.message as Message.TextMessage).text)
            if (isNaN(amount)) throw new Error('Amount is not a number')
            if (currency === 'RUB' && amount < 10) throw new Error('Amount should be at least 10 RUB')

            await ctx.broker.call('payment.create', { amount, user_id: ctx.dbUser.id, currency })
            return void ctx.wizard.next()
        } catch (e) {
            ctx.logger.error(e)
            await ctx.reply(`${e.message as string}, try again`)
        }
    }
)
