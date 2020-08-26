import moleculer from 'moleculer'
import { Service, Event } from 'moleculer-decorators'
import { getDbMixin, DbService } from '../lib/dbmixin'
import { TelegramLog } from '../entity/telegram-log'
import { ExtendedContext } from '../telegram/context'

@Service({ name: 'telegram-log', mixins: [getDbMixin(TelegramLog)] })
export default class TelegramLogService extends DbService<TelegramLog> {
    @Event()
    async 'telegram-log.update'(ctx: moleculer.Context<ExtendedContext>) {
        const tgCtx = ctx.params
        const dbUpdate = await this.repo.save({
            id: tgCtx.update.update_id,
            user_id: tgCtx.dbUser?.id,
            type: tgCtx.updateType,
            update: tgCtx.update,
        })
        this.logger.info(`Seen update`, dbUpdate)
        // await this.repo.save({ user_id: update })
    }

    async started() {
        this.logger.info('started!', await this.repo.find())
    }
}
