export type Point = { x: number; y: number }
export type Channel = 'r' | 'g' | 'b'
export type LUT = Uint8ClampedArray
export type LutsRGB = { r?: LUT; g?: LUT; b?: LUT; a?: LUT }

export const W255 = 256,
    H255 = 256
export const W127 = 128,
    H127 = 128
export const channelColor: Record<Channel, string> = {
    r: '#ff4d4f',
    g: '#52c41a',
    b: '#1890ff',
}
export const clamp255 = (v: number) => Math.max(0, Math.min(255, Math.round(v)))
export const clamp127 = (v: number) => Math.max(0, Math.min(127, Math.round(v)))
