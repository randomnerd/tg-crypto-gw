import fetch from 'node-fetch'
import { randomBytes } from 'crypto'
import { before, days, after, hours } from './time'

export interface CapustaConfig {
    email: string
    token: string
    projectCode: string
}

export enum PaymentStatus {
    CREATED = 'CREATED',
    SUCCESS = 'SUCCESS',
    EXPIRED = 'EXPIRED',
    FAIL = 'FAIL',
}

export interface CapustaPayment {
    id: string
    amount: {
        amount: number
        commission: number
        currency: string
    }
    description?: string
    projectId?: number
    projectCode?: string
    partnerPaymentId?: string
    contentUrl?: string
    sender?: string
    custom?: string
    expire?: string
    status: PaymentStatus
    payUrl: string
    parent_id?: string
    created_at: string
    updated_at: string
}

export class CapustaPaymentStatus {
    publicId: string
    partnerPaymentId: string
    amount: CapustaPaymentAmount
    status: string
    description?: string
    contentUrl?: string
    projectId: number
    projectCode: string
    payUrl: string
    sender?: any
    expire: string
    custom?: any
    multiBill: boolean
    billPaymentEnabled: boolean
    createdAt: string
    transactions: Transaction[]

    constructor(initial?: Partial<CapustaPaymentStatus>) {
        Object.assign(this, initial)
    }

    get isSuccess() {
        const closed = this.status === 'CLOSED'
        const amountPaid = this.transactions.reduce(
            (acc, i) => (i.status === 'SUCCESS' ? acc + i.amount.amount : acc),
            0
        )
        return closed && amountPaid === this.amount.amount
    }

    get isExpired() {
        return new Date(this.expire) < new Date()
    }

    get paymentStatus(): PaymentStatus {
        if (this.isExpired) return PaymentStatus.EXPIRED
        if (this.isSuccess) return PaymentStatus.SUCCESS
        if (this.status === 'NEW') return PaymentStatus.CREATED
        return PaymentStatus.FAIL
    }
}

export interface CapustaPaymentAmount {
    amount: number
    commission: number
    currency: string
}

export interface Transaction {
    id: string
    amount: CapustaPaymentAmount
    status: string
    createdAt: string
    updatedAt: string
}

export class Capusta {
    private readonly baseUrl = 'https://api.capusta.space/v1/partner'
    private readonly baseUrlV2 = 'https://api.capusta.space/v2/partner'
    constructor(private readonly config: CapustaConfig) {}

    private get headers() {
        return {
            Accept: 'application/json',
            Authorization: `Bearer ${this.config.email}:${this.config.token}`,
            'Content-Type': 'application/json',
        }
    }

    private async callGetMethod(method: string, params: Record<string, any> = {}, v2 = false) {
        params.projectCode = this.config.projectCode
        const queryParams = Object.entries(params).reduce((acc, [key, value], idx) => {
            const separator = idx === 0 ? '?' : '&'
            if (value) acc += `${separator}${key}=${value as string}`
            return acc
        }, '')

        const url = `${v2 ? this.baseUrlV2 : this.baseUrl}/${method}${queryParams}`
        const result = await fetch(url, { headers: this.headers, method: 'GET' })
        return result.ok ? await result.json() : await result.text()
    }

    private async callMethod(method: string, params: Record<string, any> = {}, v2 = false) {
        params.projectCode = this.config.projectCode
        const url = `${v2 ? this.baseUrlV2 : this.baseUrl}/${method}`
        const result = await fetch(url, {
            headers: this.headers,
            body: JSON.stringify(params),
            method: 'POST',
        })
        return result.ok ? await result.json() : await result.text()
    }

    public registry(from: Date = before(days(1)), to: Date = after(hours(1))): Promise<CapustaPayment[]> {
        const params: Record<string, string> = {}
        if (from) params.from = from.toISOString()
        if (to) params.to = to.toISOString()
        return this.callGetMethod('registry', params)
    }

    public async paymentStatus(id: string): Promise<CapustaPaymentStatus> {
        const result = await this.callGetMethod('status', { 'transaction-id': id }, true)
        return result.status ? new CapustaPaymentStatus(result) : result
    }

    public createPayment(amount: number, expire?: Date): Promise<CapustaPayment> {
        return this.callMethod('payment', {
            expire: expire?.toISOString(),
            id: randomBytes(8).toString('hex'),
            amount: {
                amount: Math.round(amount * 100),
                currency: 'RUB',
            },
        })
    }
}
