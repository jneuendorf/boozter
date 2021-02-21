/**
 * Inspired by
 * https://css-tricks.com/how-to-use-css-grid-for-sticky-headers-and-footers/
 */
import React from 'react'


const MOIBLE_TABBAR_HEIGHT = '50px'


export const Mobile = {
    Layout: ({ style = {}, ...props}) => <div
        {...props}
        style={{
            ...style,
            display: 'grid',
            gridTemplateColumns: '1fr',
            gridTemplateRows: 'auto 1fr auto',
            gridTemplateAreas: '"header" "content" "footer"',
            height: `calc(100vh - ${MOIBLE_TABBAR_HEIGHT})`,
        }}
    />,
    Header: ({ style = {}, ...props }) => <div
        {...props}
        style={{
            ...style,
            gridArea: 'header',
        }}
    />,
    Content: ({ style = {}, ...props }) => <div
        {...props}
        style={{
            ...style,
            gridArea: 'content',
            overflow: 'auto',
        }}
    />,
    Footer: ({ style = {}, ...props }) => <div
        {...props}
        style={{
            ...style,
            gridArea: 'footer',
        }}
    />,
}

