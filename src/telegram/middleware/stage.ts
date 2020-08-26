import { CreateProductScene } from './scenes/createProduct.scene'
import { Composer, Stage } from 'telegraf'
import { ExtendedContext } from '../context'
import TelegramService from 'services/telegram.service'

export default (_service: TelegramService) => {
    const stage = new Stage<ExtendedContext>([CreateProductScene])
    const bot = new Composer<ExtendedContext>()
    bot.use(stage.middleware())
    return bot
}
