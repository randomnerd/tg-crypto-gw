import { CreateProductScene } from './scenes/createPayment.scene'
import { Composer, Stage } from 'telegraf'
import { ExtendedContext } from '../context'

const stage = new Stage<ExtendedContext>([CreateProductScene])
const bot = new Composer<ExtendedContext>()
bot.use(stage.middleware())
export default bot
