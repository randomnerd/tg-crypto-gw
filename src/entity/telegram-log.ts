import { Entity, Column, PrimaryColumn, Index } from 'typeorm'
import { Base } from './base'
import { Update, UpdateType } from 'telegraf/typings/telegram-types'

@Entity()
export class TelegramLog extends Base {
    @PrimaryColumn()
    id: number

    @Column({ nullable: true })
    @Index({ sparse: true })
    user_id?: number

    @Column()
    @Index()
    updateType: UpdateType

    @Column({ type: 'jsonb' })
    update: Update
}
