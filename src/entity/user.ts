import { Entity, Column, PrimaryColumn, Index } from 'typeorm'
import { Base } from './base'

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
}
