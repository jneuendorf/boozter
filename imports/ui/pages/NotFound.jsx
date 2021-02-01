import React from 'react'
import { Link } from 'react-router-dom'
import { Layout } from 'antd'

import * as Routes from '../routes'


export const NotFound = (props) => {
    return <Layout>
        <h1>Not found</h1>
        <Link to={Routes.OVERVIEW}>Overview</Link>
        <Link to={Routes.HISTORY}>History</Link>
        <Link to={Routes.SETTINGS}>Settings</Link>
        {/* <Link to={Routes.OVERVIEW}>Overview</Link> */}
    </Layout>
}