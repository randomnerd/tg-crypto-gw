export function findMissingOne(nums, k = 1, sorted = true) {
    if (!sorted) nums = sortNumericArray(nums)
    let j = nums.length
    let i = 0
    while (i < j) {
        const m = i + Math.floor((j - i) / 2)
        nums[m] - m - k >= nums[0] ? (j = m) : (i = m + 1)
    }
    const result = (nums[0] as number) + i + k - 1
    if (result > nums[nums.length - 1] || result < nums[0]) return null
    return result
}

export const numericArray = (len, from = 0) => Array.from(new Array(len), (_, i) => from + i)
export const sortNumericArray = nums => new Array(...nums).sort((a, b) => (a < b ? -1 : a === b ? 0 : 1))

const makeIntId = () => 100 + Math.round(Math.random() * (2147483647 - 100))
const makeStrId = () => makeIntId().toString(16)

export function makeId(kind: 'string'): string
export function makeId(kind: 'number'): number
export function makeId(kind: 'string' | 'number'): string | number {
    return kind === 'string' ? makeStrId() : makeIntId()
}
