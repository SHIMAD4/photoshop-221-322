import { FC, forwardRef, useEffect, useRef } from 'react'

type CanvasProps = {
    id: string
}

const Canvas: FC<CanvasProps & React.RefAttributes<HTMLCanvasElement>> =
    forwardRef(({ id }, ref) => {
        const scrollRef = useRef<HTMLDivElement>(null)

        useEffect(() => {
            const scrollBox = scrollRef.current
            const canvasEl = (ref as React.RefObject<HTMLCanvasElement>)
                ?.current

            if (scrollBox && canvasEl) {
                scrollBox.scrollLeft =
                    canvasEl.offsetLeft +
                    canvasEl.offsetWidth / 2 -
                    scrollBox.clientWidth / 2
                scrollBox.scrollTop =
                    canvasEl.offsetTop +
                    canvasEl.offsetHeight / 2 -
                    scrollBox.clientHeight / 2
            }
        }, [ref])

        const boxSizeW = window.innerWidth * 2
        const boxSizeH = window.innerHeight * 2

        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100vw',
                    height: 'calc(100vh - 120px)',
                    marginTop: '20px',
                }}
            >
                <div
                    ref={scrollRef}
                    style={{
                        overflow: 'auto',
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                    }}
                >
                    <div
                        style={{
                            width: boxSizeW,
                            height: boxSizeH,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <canvas
                            id={id}
                            ref={ref}
                            style={{
                                display: 'block',
                            }}
                        />
                    </div>
                </div>
            </div>
        )
    })

export default Canvas
