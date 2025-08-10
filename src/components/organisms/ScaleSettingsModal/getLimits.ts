import { ResizeUnit } from './useResizeState'

export function getLimits(unit: ResizeUnit): { min: number; max: number } {
    return unit === 'percent' ? { min: 1, max: 200 } : { min: 1, max: 10000 }
}
