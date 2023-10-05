import { Tooltip } from 'antd'
import { type } from 'os'
import React, { useEffect, useState } from 'react'

type Props = {
    children: React.ReactNode,
    text: string
    triggerType?: 'click' | 'hover'
}

const CustomTooltip = ({ children, text, triggerType = 'click' }: Props) => {
    const [open, setOpen] = useState<boolean>(false)

    useEffect(() => {
        if (!open || triggerType === 'hover') return;
        let timeout = setTimeout(() => {
            setOpen(false)
        }, 1000)
        return () => {
            clearTimeout(timeout)
        }
    }, [open])


    return (
        <Tooltip
            title={text}
            open={open}
            overlayInnerStyle={{ textAlign: 'center' }}
            placement={'top'}
        >
            <div
                onClick={() => setOpen(true)}
                onMouseEnter={triggerType === 'hover' ? () => setOpen(true) : () => null}
                onMouseLeave={triggerType === 'hover' ? () => setOpen(false) : () => null}
            >
                {children}
            </div>
        </Tooltip>
    )
}

export default CustomTooltip
