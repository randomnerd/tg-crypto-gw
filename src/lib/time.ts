export const seconds = i => i * 1000
export const minutes = i => seconds(i) * 60
export const hours = i => minutes(i) * 60
export const days = i => hours(i) * 24
export const after = (i: number) => new Date(new Date().getTime() + i)
export const before = (i: number) => new Date(new Date().getTime() - i)
