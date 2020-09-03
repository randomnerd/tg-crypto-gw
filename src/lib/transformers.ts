import { BigNumber as BN } from 'ethers'
import { ValueTransformer } from 'typeorm'
export const tfBN: ValueTransformer = {
    to: v => v.toString(),
    from: v => BN.from(v),
}

export const tfDate: ValueTransformer = {
    to: v => v.toISOString(),
    from: v => new Date(v),
}
