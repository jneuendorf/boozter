import React, { Fragment } from 'react'

import * as Breakpoints from './breakpoints'


export const Wrapper = ({ children, style }) => {
    return <Fragment>
        <Breakpoints.Desktop>
            <div
                className='wrapper wrapper-desktop'
                style={style}
            >
                {children}
            </div>
        </Breakpoints.Desktop>
        <Breakpoints.TabletOrMobile>
            <div
                className='wrapper wrapper-mobile'
                style={style}
            >
                {children}
            </div>
        </Breakpoints.TabletOrMobile>
    </Fragment>
}
