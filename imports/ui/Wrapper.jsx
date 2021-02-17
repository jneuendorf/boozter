import React, { Fragment } from 'react'

import * as Breakpoints from './breakpoints'


export const Wrapper = ({ children }) => {
    return <Fragment>
        <Breakpoints.Desktop>
            <div className='wrapper wrapper-desktop'>
                {children}
            </div>
        </Breakpoints.Desktop>
        <Breakpoints.TabletOrMobile>
            <div className='wrapper wrapper-mobile'>
                {children}
            </div>
        </Breakpoints.TabletOrMobile>
    </Fragment>
}
