import { Entity, Column, Index, PrimaryGeneratedColumn, OneToMany, ViewEntity, ViewColumn } from 'typeorm'
import { Base } from './base'
import { Transaction } from './transaction'

@Entity()
@Index('blk_cur_height_idx', ['currency', 'height'], { unique: true })
@Index('blk_cur_hash_idx', ['currency', 'hash'], { unique: true })
@Index('blk_cur_prevhash_idx', ['currency', 'prevhash'], { unique: true })
export class Block extends Base {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ default: 'ETH' })
    currency: string

    @Column()
    hash: string

    @Column()
    prevhash: string

    @Column()
    height: number

    @Column()
    tx_count: number

    @OneToMany(_ => Transaction, t => t.block)
    txs: Transaction[]
}

@ViewEntity({
    expression: c =>
        c
            .createQueryBuilder(Block, 'b')
            .select(['id', 'currency', 'hash', 'height', 'tx_count', 'created_at'])
            .addSelect(
                q =>
                    q
                        .subQuery()
                        .select('count(tx.id) = b.tx_count')
                        .from(Transaction, 'tx')
                        .where('tx.block_id=b.id'),
                'parsed'
            )
            .addSelect(
                q =>
                    q
                        .subQuery()
                        .select(
                            `case count(tx.id) = b.tx_count
                                when true then
                                    COALESCE(MAX(tx.created_at), b.created_at)
                                else
                                    null
                            end`
                        )
                        // .select('MAX(tx.created_at)')
                        .from(Transaction, 'tx')
                        .where('tx.block_id=b.id'),
                'parsed_at'
            )
            .addSelect(
                q =>
                    q
                        .subQuery()
                        .select(
                            `case count(tx.id) = b.tx_count
                                when true then
                                    COALESCE(MAX(tx.created_at), b.updated_at) - b.created_at
                                else
                                    null
                            end`
                        )
                        // .select('MAX(tx.created_at)')
                        .from(Transaction, 'tx')
                        .where('tx.block_id=b.id'),
                'parse_time'
            ),
})
export class ViewBlock {
    @ViewColumn()
    id: number

    @ViewColumn()
    currency: string

    @ViewColumn()
    hash: string

    @ViewColumn()
    height: number

    @ViewColumn()
    parsed: boolean

    @ViewColumn()
    created_at: Date

    @ViewColumn()
    parsed_at: Date

    @ViewColumn()
    parse_time: number
}
