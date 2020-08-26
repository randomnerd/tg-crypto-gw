import { Connection, EntityManager, Repository } from 'typeorm'
import moleculer from 'moleculer'
import { getConnection } from './db'

export class DbService<T> extends moleculer.Service implements DbMixin<T> {
    connection: Connection
    manager: EntityManager
    entity: T
    repo: Repository<T>
}

export interface DbMixin<T> extends moleculer.ServiceSchema {
    repo: Repository<T>
    entity: T
    manager: EntityManager
    connection: Connection
}

export function getDbMixin<T>(entity: T): DbMixin<T> {
    return {
        name: '',
        repo: null as any,
        entity: null as any,
        manager: null as any,
        connection: null as any,

        created(this: moleculer.Service) {
            this.entity = entity
        },

        async started(this: moleculer.Service) {
            this.connection = await getConnection()
            this.repo = this.connection.getRepository(entity)
            this.logger.info('DbMixin started')
        },

        async stopped() {
            this.logger.info('DbMixin stopped')
        },
    }
}
