import { Tooltip } from 'antd'
import { type } from 'os'
import React, {useEffect, useRef, useState} from 'react'
import {TooltipPlacement} from "antd/es/tooltip";

type Props = {
    children: React.ReactNode,
    text: string,
    arrow?: boolean,
    placement?: TooltipPlacement | undefined,
    triggerType?: 'click' | 'hover',
    mouseEnterDelay?:  number;
    mouseLeaveDelay?: number;
    isPreventDefault?: boolean;
}

const CustomTooltip = ({isPreventDefault, children, arrow = true, mouseEnterDelay,mouseLeaveDelay, placement = 'top', text, triggerType = 'click' }: Props) => {
    const [open, setOpen] = useState<boolean>(false)
    const [delayHandler, setDelayHandler] = useState(null)

    useEffect(() => {
        if (!open || (triggerType === 'hover')) return;
        let timeout = setTimeout(() => {
            setOpen(false)
        }, 1000)
        return () => {
            clearTimeout(timeout)
        }
    }, [open])

    const onMouseEnter = () => {
        if (triggerType === 'hover') {
            if (mouseEnterDelay) {
                // @ts-ignore
                setDelayHandler(setTimeout(() => {
                      setOpen(true)
                }, mouseEnterDelay))
            } else {
                setOpen(true);
            }
        } else {
            return null;
        }
    }

    const onMouseLeave = () => {
        if (triggerType === 'hover') {
            if (mouseEnterDelay && delayHandler) {
                clearTimeout(delayHandler);
            }
            setOpen(false);
        } else {
            return null;
        }
    }


    return (
        <Tooltip
            mouseEnterDelay={mouseEnterDelay}
            mouseLeaveDelay={mouseLeaveDelay}
            arrow={arrow}
            title={text}
            open={open}
            overlayInnerStyle={{ textAlign: 'center' }}
            placement={placement}
        >
            <div
                onClick={(e) => {
                    if (isPreventDefault) {
                        e.preventDefault();
                    }
                    setOpen(true)
                }}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                {children}
            </div>
        </Tooltip>
    )
}

export default CustomTooltip
