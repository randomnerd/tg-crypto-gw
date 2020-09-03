import { Entity, Column, PrimaryColumn, Index, OneToMany } from 'typeorm'
import { Base } from './base'
import { TelegramLog } from './telegram-log'
import { Transaction } from './transaction'
import { Payment } from './payment';

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
}
