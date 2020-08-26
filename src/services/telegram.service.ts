import moleculer from 'moleculer'
import { Service, Action } from 'moleculer-decorators'
import { Telegraf } from 'telegraf'
import config from 'config'
import { LaunchPollingOptions, LaunchWebhookOptions, TelegrafOptions } from 'telegraf/typings/telegraf'
import { ExtendedContext } from '../telegram/context'
import composedMiddleware from '../telegram/middleware'

export interface TelegramConfig {
    token: string
    options?: TelegrafOptions
    launchOptions?: {
        polling?: LaunchPollingOptions
        webhook?: LaunchWebhookOptions
    }
}

@Service({ name: 'telegram', dependencies: ['user'] })
export default class TelegramService extends moleculer.Service {
    config = config.get<TelegramConfig>('telegram')
    bot = new Telegraf<ExtendedContext>(this.config.token, this.config.options)
    tg = this.bot.telegram

    async started() {
        this.logger.info('Telegram starting...')
        this.bot.catch(async e => {
            this.logger.error(e)
            throw new moleculer.Errors.MoleculerRetryableError(e.message)
        })
        this.bot.use(composedMiddleware(this))
        await this.bot.launch(this.config.launchOptions)
    }

    async stopped() {
        this.logger.info('Telegram stopping...')
        await this.bot.stop().catch(this.logger.error)
    }

    @Action({
        params: { msg: 'string', chat: 'string' },
    })
    async sendMessage({ params: { msg, chat: chatName } }) {
        const chat = await this.tg.getChat(chatName)
        return await this.tg.sendMessage(chat.id, msg)
    }

    // @Event()
    // 'telegram.message'(ctx: moleculer.Context<TelegrafContext>) {
    //     // console.dir(ctx, { depth: 2 })
    //     const { from, message, chat } = ctx.params
    //     const chatName = chat?.title ?? ctx.params.updateType
    //     this.logger.info(`[${chatName}] @${from?.username}: ${message?.text}`)
    // }
}
