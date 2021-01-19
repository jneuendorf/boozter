import React from 'react'
import { Layout, PageHeader, Card } from 'antd'

import { LoginForm } from './LoginForm'

const { Content, Footer } = Layout


export const Login = (props) => <Layout>
    <Content>
        <PageHeader title='Boozter' subTitle='Boost your booze habits' />
        <Card bordered={false}>
            <LoginForm />
        </Card>
    </Content>
    <Footer>
        Boozter &copy;2021 Created by Jim Neuendorf
    </Footer>
</Layout>
