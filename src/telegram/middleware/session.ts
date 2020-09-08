import { Composer } from 'telegraf'
import { after, minutes } from '../../lib/time'
import { ExtendedContext } from '../context'

function session(opts?) {
    const options = {
        property: 'session',
        store: new Map(),
        getSessionKey: (ctx: ExtendedContext) => ctx.from && ctx.chat && `${ctx.from.id}:${ctx.chat.id}`,
        ...opts,
    }

    const ttlMs = options.ttl && options.ttl * 1000

    return (ctx, next) => {
        const key = options.getSessionKey(ctx)
        if (!key) {
            return next(ctx)
        }
        const now = Date.now()
        return Promise.resolve(options.store.get(key))
            .then(state => state || { session: {} })
            .then(({ session, expires }) => {
                if (expires && expires < now) {
                    session = {}
                }
                Object.defineProperty(ctx, options.property, {
                    get: function () {
                        return session
                    },
                    set: function (newValue) {
                        session = { ...newValue }
                    },
                })
                return next(ctx).then(() =>
                    options.store.set(key, {
                        session,
                        expires: ttlMs ? now + ttlMs : null,
                    })
                )
            })
    }
}

const bot = new Composer<ExtendedContext>()
bot.use(session())
// const options = {
//     property: 'session',
//     store: new Map(),
//     ttl: minutes(60),
//     getSessionKey: (ctx: ExtendedContext) => ctx.from && ctx.chat && `${ctx.from.id}:${ctx.chat.id}`,
// }
//
// bot.use(async (ctx, next) => {
//     const key = options.getSessionKey(ctx)
//     if (!key) return await next()
//
//     const state = options.store.get(key) || { session: {} }
//     if (state.expires && state.expires > Date.now()) state.session = {}
//     Object.defineProperty(ctx, options.property, {
//         get() {
//             return state.session
//         },
//         set(newValue) {
//             state.session = { ...newValue }
//         },
//     })
//     await next()
//     options.store.set(key, { session: state.session, expires: options.ttl ? after(options.ttl) : null })
// })
export default bot
