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
        const update = tgCtx.update[tgCtx.updateType]
        if (tgCtx.dbUser && update.from) delete update.from
        const dbUpdate = await this.repo.save({
            update,
            user_id: tgCtx.dbUser?.id,
            id: tgCtx.update.update_id,
            updateType: tgCtx.updateType,
        })
        this.logger.info(`Seen update`, dbUpdate, new Date(update.date * 1000))
        // await this.repo.save({ user_id: update })
    }
}
