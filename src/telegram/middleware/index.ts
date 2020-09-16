import { Composer } from 'telegraf'
import { ExtendedContext } from '../context'
import session from './session'
import menu from './menu'
import log from './log'
import user from './user'
import stage from './stage'
import commandParts from 'telegraf-command-parts'

export const bot = new Composer<ExtendedContext>()
bot.use(user)
bot.use(session)
bot.use(log)
bot.use(stage)
bot.use(menu)
bot.use(commandParts())
bot.command('start', async (ctx, next) => {
    console.log(ctx.startPayload)
    const msg = ctx.startPayload
    if (!msg || !ctx.dbUser) return
    try {
        const { m, valid } = await ctx.broker.call('user.checkMessage', { u: ctx.dbUser.id, m: msg })
        if (!valid) throw new Error('signature invalid')
        await ctx.reply(`Signed! ${m as string}`)
    } catch (e) {
        console.error(e)
    }
    await next()
})
bot.command('signedlink', async (ctx, next) => {
    // if (!ctx.update)
    if (!ctx.dbUser) return await next()
    const m = ctx.state.command?.args
    if (!m) return await next()
    console.log(ctx.dbUser)
    const msg: string = await ctx.broker.call('user.signMessage', { u: ctx.dbUser.id, m })
    console.log(msg, msg.length)
    await ctx.reply(`https://t.me/${ctx.botInfo?.username ?? 'bot'}?start=${msg.replace('=', '')}`)
    console.log(ctx.state.command)
    await next()
})
export default bot
