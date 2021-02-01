import React from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { Layout, Spin, Table } from 'antd'

import {
    History as HistoryCollection,
} from '/imports/api/history/collection'

const { Header, Footer, Sider, Content } = Layout


const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Amount',
        key: 'amount',
        render(text, record, index) {
            return `${record.amount} ${record.amountUnit}`
        }
    },
    {
        title: 'Date',
        key: 'createdAt',
        render(text, record, index) {
            return record.createdAt.toLocaleString()
        }
    },
]


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
            history,
        }
    })
    return <Layout>
        <h1>HISTORY</h1>
        <Spin spinning={isLoading} tip='Loading...'>
            <Table
                bordered
                dataSource={history}
                columns={columns}
            />
        </Spin>
    </Layout>
}