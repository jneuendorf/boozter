import React from 'react'
import { Link } from 'react-router-dom'
import { Layout } from 'antd'

import * as Routes from '../routes'


const { Header, Footer, Sider, Content } = Layout


export const AddDrink = (props) => <Layout>
    <Link to={Routes.OVERVIEW}>back</Link>
    <h1>ADD DRINK</h1>
</Layout>
