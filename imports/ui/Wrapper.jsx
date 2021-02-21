import React, { Fragment } from 'react'

import * as Breakpoints from './breakpoints'


export const Wrapper = ({ children, className, style }) => {
    return <Fragment>
        <Breakpoints.Desktop>
            <div
                className={`wrapper wrapper-desktop ${className}`}
                style={style}
            >
                {children}
            </div>
        </Breakpoints.Desktop>
        <Breakpoints.TabletOrMobile>
            <div
                className={`wrapper wrapper-mobile ${className}`}
                style={style}
            >
                {children}
            </div>
        </Breakpoints.TabletOrMobile>
    </Fragment>
}
