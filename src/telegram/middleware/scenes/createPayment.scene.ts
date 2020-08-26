import WizardScene from 'telegraf/lib/scenes/wizard'
import { ExtendedContext } from '../../context'
import { Message } from 'telegraf/typings/telegram-types'

export const CreateProductScene = new WizardScene(
    'create-payment',
    async (ctx: ExtendedContext) => {
        try {
            if (!ctx.dbUser) throw new Error('User not identified')
            await ctx.reply('Enter payment amount')
            return ctx.wizard.next()
        } catch (e) {
            await ctx.reply(e.message)
            return await ctx.scene.leave()
        }
    },
    async (ctx: ExtendedContext) => {
        try {
            const amount = Number((ctx.message as Message.TextMessage).text)
            if (isNaN(amount)) throw new Error('Amount is not a number, try again')
            ctx.wizard.state.amount = amount
            if (amount < 10) throw new Error('Amount should be at least 10, try again')

            await ctx.reply('Enter payment currency (only RUB supported yet)')
            return ctx.wizard.next()
        } catch (e) {
            await ctx.reply(e.message)
            // return ctx.wizard.back()
        }
    },
    async (ctx: ExtendedContext) => {
        try {
            if (!ctx.dbUser) throw new Error('User not identified')
            const amount: number = ctx.wizard.state.amount
            const currency = (ctx.message as Message.TextMessage).text
            if (currency !== 'RUB') throw new Error('Invalid currency (only RUB supported yet), try again')
            await ctx.broker.call('payment.create', { amount, user_id: ctx.dbUser.id })
            return await ctx.scene.leave()
        } catch (e) {
            await ctx.reply(e.message)
            // return ctx.wizard.back()
        }
    }
)
