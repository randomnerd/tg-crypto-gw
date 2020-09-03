import WizardScene from 'telegraf/lib/scenes/wizard'
import { ExtendedContext } from '../../context'
import { Message } from 'telegraf/typings/telegram-types'

export const CreateProductScene = new WizardScene(
    'create-payment',
    async (ctx: ExtendedContext) => {
        try {
            if (!ctx.dbUser) throw new Error('User not identified')
            await ctx.reply('Enter payment currency (only RUB supported yet)')
            return ctx.wizard.next()
        } catch (e) {
            await ctx.reply(e.message)
            return await ctx.scene.leave()
        }
    },
    async (ctx: ExtendedContext) => {
        try {
            // const amount: number = ctx.wizard.state.amount
            const currency = (ctx.message as Message.TextMessage).text.toUpperCase()
            if (currency !== 'RUB') throw new Error('Invalid currency (only RUB supported yet)')
            ctx.wizard.state.currency = currency
            await ctx.reply('Enter payment amount')

            return ctx.wizard.next()
        } catch (e) {
            await ctx.reply(`${e.message as string}, try again`)
        }
    },
    async (ctx: ExtendedContext) => {
        try {
            if (!ctx.dbUser) throw new Error('User not identified')
            const currency = ctx.wizard.state.currency
            const amount = Number((ctx.message as Message.TextMessage).text)
            if (isNaN(amount)) throw new Error('Amount is not a number')
            if (currency === 'RUB' && amount < 10) throw new Error('Amount should be at least 10')

            await ctx.broker.call('payment.create', { amount, user_id: ctx.dbUser.id })
            return ctx.wizard.next()
        } catch (e) {
            await ctx.reply(`${e.message as string}, try again`)
        }
    }
)
