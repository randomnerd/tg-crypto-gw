import { Entity, Column, PrimaryColumn } from 'typeorm'
import { Base } from './base'
import { Update, UpdateType } from 'telegraf/typings/telegram-types'

@Entity()
export class TelegramLog extends Base {
    @PrimaryColumn()
    id: number

    @Column({ nullable: true })
    user_id?: number

    @Column()
    updateType: UpdateType

    @Column({ type: 'jsonb' })
    update: Update
}
