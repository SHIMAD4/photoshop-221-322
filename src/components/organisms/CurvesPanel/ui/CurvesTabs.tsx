import { FC } from 'react'
import TabButton from '../../../atoms/TabButton'

type RGBAProps = {
    kind: 'rgba'
    tab: 'rgb' | 'alpha'
    setTab: (t: 'rgb' | 'alpha') => void
    hasAlpha: boolean
}
type GB7Props = {
    kind: 'gb7'
    tab: 'y' | 'alpha'
    setTab: (t: 'y' | 'alpha') => void
}
type Props = RGBAProps | GB7Props

const CurvesTabs: FC<Props> = (p) => (
    <div style={{ display: 'flex', gap: 8 }}>
        {p.kind === 'rgba' ? (
            <>
                <TabButton
                    active={p.tab === 'rgb'}
                    onClick={() => p.setTab('rgb')}
                >
                    RGB
                </TabButton>
                {p.hasAlpha && (
                    <TabButton
                        active={p.tab === 'alpha'}
                        onClick={() => p.setTab('alpha')}
                    >
                        Alpha
                    </TabButton>
                )}
            </>
        ) : (
            <>
                <TabButton active={p.tab === 'y'} onClick={() => p.setTab('y')}>
                    Y
                </TabButton>
                <TabButton
                    active={p.tab === 'alpha'}
                    onClick={() => p.setTab('alpha')}
                >
                    Alpha
                </TabButton>
            </>
        )}
    </div>
)
export default CurvesTabs
