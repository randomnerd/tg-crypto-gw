import { Entity, Column, PrimaryColumn, Index, ManyToOne } from 'typeorm'
import BN from 'bn.js'
import { Base } from './base'
import { PaymentStatus } from '../lib/capusta'
import { User } from './user'

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

    @Column({ default: false })
    crypto: boolean

    @Column()
    @Index()
    user_id: number

    @ManyToOne(_ => User, u => u.payments)
    user: User

    @Column({ type: 'timestamp without time zone' })
    expire: Date

    @Column({ default: false })
    user_notified: boolean

    @Column()
    @Index({ where: 'crypto=true' })
    pay_addr: string

    @Column({ nullable: true })
    addr_height?: number

    @Column('enum', { enum: PaymentStatus, default: PaymentStatus.CREATED })
    @Index()
    status: PaymentStatus

    get idNumber() {
        return parseInt(this.id, 16)
    }
}
