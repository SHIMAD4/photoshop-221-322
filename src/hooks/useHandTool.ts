import { useEffect } from 'react'

/**
 * Хук для реализации инструмента "Рука" (перемещение изображения по холсту с помощью мыши).
 * Позволяет перетаскивать изображение в пределах допустимых границ, определённых функцией getImageBounds.
 *
 * @param { HTMLCanvasElement | null } canvas - Ссылка на элемент canvas, в котором отображается изображение.
 * @param { boolean } active - Флаг, активен ли в данный момент инструмент "Рука".
 * @param { () => { minX: number, maxX: number, minY: number, maxY: number } } getImageBounds - Функция, возвращающая границы, в пределах которых можно перемещать изображение.
 * @param { React.RefObject<{ x: number; y: number }> } currentOffsetRef - React ref, хранящий текущий сдвиг изображения по осям X и Y.
 *
 * @example
 * useHandTool(canvasRef.current, activeTool === 'hand', getImageBounds, offsetRef);
 *
 * @returns { void } Хук не возвращает значения, но добавляет и удаляет обработчики событий для мыши.
 */
export function useHandTool(
    canvas: HTMLCanvasElement | null,
    active: boolean,
    getImageBounds: () => {
        minX: number
        maxX: number
        minY: number
        maxY: number
    },
    currentOffsetRef: React.RefObject<{ x: number; y: number }>,
) {
    useEffect(() => {
        if (!canvas || !active) return

        let isDragging = false
        let startX = 0
        let startY = 0
        let startOffset = { x: 0, y: 0 }

        const onMouseDown = (e: MouseEvent) => {
            isDragging = true
            startX = e.clientX
            startY = e.clientY
            startOffset = { ...currentOffsetRef.current }
            canvas.style.cursor = 'grabbing'
        }

        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging) return

            const dx = e.clientX - startX
            const dy = e.clientY - startY

            const rawX = startOffset.x + dx
            const rawY = startOffset.y + dy

            const { minX, maxX, minY, maxY } = getImageBounds()

            const clampedX = Math.max(minX, Math.min(maxX, rawX))
            const clampedY = Math.max(minY, Math.min(maxY, rawY))

            canvas.style.transform = `translate(${clampedX}px, ${clampedY}px)`
            currentOffsetRef.current = { x: clampedX, y: clampedY }
        }

        const onMouseUp = () => {
            isDragging = false
            canvas.style.cursor = 'grab'
        }

        canvas.addEventListener('mousedown', onMouseDown)
        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup', onMouseUp)

        return () => {
            canvas.removeEventListener('mousedown', onMouseDown)
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseup', onMouseUp)
        }
    }, [canvas, active, currentOffsetRef, getImageBounds])
}
