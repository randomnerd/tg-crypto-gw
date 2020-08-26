import { BaseEntity, CreateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm'

export class Base extends BaseEntity {
    @CreateDateColumn({ nullable: false, type: 'timestamp without time zone' })
    created_at?: Date

    @CreateDateColumn({ nullable: false, type: 'timestamp without time zone' })
    updated_at?: Date

    @BeforeInsert()
    beforeInsert() {
        this.created_at = this.updated_at = new Date()
    }

    @BeforeUpdate()
    beforeUpdate() {
        this.updated_at = new Date()
    }
}
