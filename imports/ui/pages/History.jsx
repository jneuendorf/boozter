import React from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { Layout, List, Spin } from 'antd'

import {
    History as HistoryCollection,
} from '/imports/api/history/collection'

const { Header, Footer, Sider, Content } = Layout


export const History = (props) => {
    const { isLoading, history } = useTracker(() => {
        const user = Meteor.user()
        const handler = Meteor.subscribe('history')
        if (!user || !handler.ready()) {
            return { isLoading: true }
        }

        const userId = user._id
        const history = HistoryCollection.find({ userId }).fetch()
        return {
            isLoading: false,
            // userId,
            history,
        }
    })
    return <Layout>
        <h1>HISTORY</h1>
        <Spin spinning={isLoading} tip='Loading...'>
            <List
                bordered
                dataSource={history}
                renderItem={item => <List.Item>{item}</List.Item>}
            />
        </Spin>
    </Layout>
}