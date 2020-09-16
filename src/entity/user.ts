import { Entity, Column, PrimaryColumn, Index, OneToMany } from 'typeorm'
import { Base } from './base'
import { TelegramLog } from './telegram-log'
import { Transaction } from './transaction'
import { Payment } from './payment'
import { createHmac, randomBytes } from 'crypto'
import { base64 } from 'ethers/lib/utils'

@Entity()
export class User extends Base {
    @PrimaryColumn()
    id: number

    @Column()
    first_name: string

    @Column({ nullable: true })
    last_name?: string

    @Column()
    @Index()
    is_bot: boolean

    @Column({ nullable: true })
    secret?: string

    @Column({ nullable: true })
    @Index({ sparse: true })
    username?: string

    @Column({ nullable: true })
    language_code?: string

    @OneToMany(_ => TelegramLog, l => l.user)
    logs: TelegramLog[]

    @OneToMany(_ => Transaction, l => l.user)
    txs: Transaction[]

    @OneToMany(_ => Payment, p => p.user)
    payments: Payment[]

    getSecret() {
        if (this.secret) return this.secret
        this.secret = randomBytes(32).toString('hex')
        return this.secret
    }

    sign(m: string) {
        const secret = this.getSecret()
        return createHmac('sha1', secret).update(m).digest('hex')
    }

    signMessage(m: string) {
        const s = this.sign(m)
        return base64.encode(Buffer.from(JSON.stringify({ s, m })))
    }

    checkMessage(payload: string): { m: string; s: string; valid: boolean } {
        try {
            const data = base64.decode(payload).toString()
            const { m, s } = JSON.parse(data)
            const sign = this.sign(m)
            return { m, s, valid: sign === s }
        } catch (e) {
            console.error(e)
            throw e
        }
    }

    check(m: string, s: string) {
        const sign = this.sign(m)
        return sign === s
    }
}
