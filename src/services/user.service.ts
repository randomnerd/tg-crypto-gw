import moleculer from 'moleculer'
import { Service, Event, Action, Method } from 'moleculer-decorators'
import { User as TelegramUser } from 'telegraf/typings/telegram-types'
import { User } from '../entity/user'
import { getDbMixin, DbService } from '../lib/dbmixin'

@Service({ name: 'user', mixins: [getDbMixin(User)] })
export default class UserService extends DbService<User> {
    @Action()
    async save({ params: tgUser }) {
        return await this._save(tgUser)
    }

    @Method
    async _save(tgUser: TelegramUser) {
        const user = await this.repo.save({ ...tgUser, updated_at: new Date() })
        this.logger.debug('Saved user', user)
        return user
    }

    @Event()
    async 'user.seen'(ctx: moleculer.Context<TelegramUser>) {
        // const user = await this._save(ctx.params)
        this.logger.info(`Seen user`, ctx.params)
    }
}
