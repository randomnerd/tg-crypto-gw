import {
    Entity,
    Column,
    Index,
    PrimaryGeneratedColumn,
    ManyToOne,
    ViewColumn,
    ViewEntity,
    Connection,
} from 'typeorm'
import { Base } from './base'
import { Block } from './block'
import { User } from './user'
import { BigNumber as BN } from 'ethers'
import { tfBN } from '../lib/transformers'

@Entity()
// @Index('cur_height_idx', ['currency', 'height'], { unique: true })
@Index('tx_blk_hash_to_idx', ['block_id', 'hash', 'to'], { unique: true })
// @Index('cur_prevhash_idx', ['currency', 'prevhash'], { unique: true })
export class Transaction extends Base {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    hash: string

    @Column()
    @Index()
    to: string

    @Column({
        type: 'decimal',
        transformer: tfBN,
    })
    value: BN

    @ManyToOne(_ => Block, b => b.txs)
    block: Block

    @Column()
    @Index()
    block_id: number

    @Column({ nullable: true })
    @Index({ sparse: true })
    user_id?: number

    @ManyToOne(_ => User, u => u.txs)
    user: User
}

@ViewEntity({
    expression: (c: Connection) =>
        c
            .createQueryBuilder(Transaction, 'tx')
            .select('tx.id', 'id')
            .addSelect('tx.hash', 'hash')
            .addSelect('tx.user_id', 'user_id')
            .addSelect('tx.created_at', 'created_at')
            .addSelect('tx.updated_at', 'updated_at')
            .leftJoin(Block, 'blk', 'blk.id = tx.block_id')
            .addSelect('blk.currency', 'currency')
            .addSelect(
                qb =>
                    qb
                        .subQuery()
                        .select('MAX(block.height) - blk.height + 1')
                        .from(Block, 'block')
                        .where('block.currency = blk.currency'),
                'confirmations'
            ),
})
export class ViewTransaction {
    @ViewColumn()
    id: number

    @ViewColumn()
    hash: string

    @ViewColumn()
    currency: string

    @ViewColumn()
    confirmations: number

    @ViewColumn()
    user_id?: number

    @ViewColumn()
    created_at: Date

    @ViewColumn()
    updated_at: Date
}
