import { createProductScene } from './scenes/createPayment.scene'
import { Composer, Stage } from 'telegraf'
import { ExtendedContext } from '../context'

const stage = new Stage<ExtendedContext>()
// @ts-ignore
stage.register(createProductScene)
// stage.use(createProductScene.middleware())
const bot = new Composer<ExtendedContext>()
bot.use(stage.middleware())
// bot.use(stage.middleware())
export default bot
