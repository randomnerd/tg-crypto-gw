import { Entity, Column, PrimaryColumn, Index } from 'typeorm'
import BN from 'bn.js'
import { Base } from './base'
import { PaymentStatus } from '../lib/capusta'

@Entity()
export class Payment extends Base {
    @PrimaryColumn()
    id: string

    @Column({ nullable: true })
    @Index({ sparse: true })
    foreign_id?: string

    @Column({ type: 'decimal', transformer: { to: (v: BN) => v.toString(10, 20), from: v => new BN(v) } })
    amount: BN

    @Column({ default: 'RUB' })
    currency: string

    @Column()
    @Index()
    user_id: number

    @Column({ type: 'timestamp without time zone' })
    expire: Date

    @Column({ default: false })
    user_notified: boolean

    @Column()
    pay_url: string

    @Column('enum', { enum: PaymentStatus, default: PaymentStatus.CREATED })
    @Index()
    status: PaymentStatus
}
