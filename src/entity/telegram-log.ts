import { Entity, Column, PrimaryColumn } from 'typeorm'
import { ExtendedContext } from '../telegram/context'
import { Base } from './base'
import { UpdateType, MessageSubTypes } from 'telegraf/typings/telegram-types'

@Entity()
export class TelegramLog extends Base {
    @PrimaryColumn()
    id: number

    @Column({ nullable: true })
    user_id?: number

    @Column()
    type: UpdateType

    @Column({ type: 'jsonb' })
    update: ExtendedContext['update']
}
