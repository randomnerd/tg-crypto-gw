/* eslint-disable @typescript-eslint/no-unused-vars */
// import path from 'path'
import config from 'config'
import { ConnectionManager, ConnectionOptions, Connection } from 'typeorm'
import { EventEmitter } from 'events'
import { User } from '../entity/user'
import { Block, ViewBlock } from '../entity/block'
import { Transaction, ViewTransaction } from '../entity/transaction'
import { TelegramLog } from '../entity/telegram-log'
import { Payment } from '../entity/payment'
import { randomBytes } from 'crypto'

const ormconfig = {
    ...config.get<ConnectionOptions>('db'),
    entities: [User, TelegramLog, Payment, Block, ViewBlock, Transaction, ViewTransaction],
    // entities: [path.join(__dirname, '..', 'entity', '**/*.{ts,js}')],
}

export class ConnectionWrapper extends EventEmitter {
    manager = new ConnectionManager()
    connecting: Record<string, boolean> = {}

    constructor(options?: ConnectionOptions) {
        super()
        this.addConnection(options ?? ormconfig)
    }

    addConnection(options: ConnectionOptions): Connection {
        const name = options.name ?? 'default'
        return this.manager.has(name) ? this.manager.get(name) : this.manager.create(options)
    }

    async getConnection(name = 'default'): Promise<Connection> {
        if (!this.manager.has(name)) throw new Error(`Connection "${name}" not found`)
        const connection = this.manager.get(name)
        if (connection.isConnected) return connection
        if (!this.connecting[name]) {
            this.connecting[name] = true
            connection
                .connect()
                .then(c => {
                    this.connecting[name] = false
                    this.emit('connected', c)
                })
                .catch(e => {
                    this.connecting[name] = false
                    this.emit('error', e)
                })
        }

        return new Promise((resolve, reject) => {
            this.once('connected', c => resolve(c))
            this.once('error', e => reject(e))
        })
    }
}
const wrapper = new ConnectionWrapper()
export const getConnection = async (name?: string) => await wrapper.getConnection(name)
export type Nullable = false | null | undefined | '' | 0
export const makeIntId = () => Math.round(Math.random() * 2147483647)
export const makeStrId = () => makeIntId().toString(16)

