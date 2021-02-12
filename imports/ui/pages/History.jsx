import React from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { Layout, Spin, Table } from 'antd'

import { History as HistoryCollection } from '/imports/api/history/collection'
import { Settings as SettingsCollection } from '/imports/api/settings/collection'
import { aggregatedHistory } from '/imports/ui/utils'


const DATETIME_FORMAT = new Intl.DateTimeFormat(undefined, { dateStyle: 'short' })
const COLUMNS_TOP_LEVEL = [
    {
        title: 'Alcolhol',
        key: 'alcohol',
        render(text, { aggregated }, index) {
            return `${aggregated.amount} ${aggregated.amountUnit}`
        }
    },
    {
        title: 'Date',
        key: 'createdAt',
        render(text, record, index) {
            return DATETIME_FORMAT.format(record.createdAt)
        }
    },
]
const COLUMNS_SECOND_LEVEL = [
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Amount',
        key: 'amount',
        render(text, { amount, amountUnit }, index) {
            return `${amount} ${amountUnit}`
        }
    },
]


export const History = (props) => {
    const { isLoading, history } = useTracker(() => {
        const user = Meteor.user()
        if (
            !user
            || !Meteor.subscribe('history').ready()
            || !Meteor.subscribe('settings').ready()
        ) {
            return { isLoading: true }
        }

        const userId = user._id
        const settings = SettingsCollection.findOne({ userId })
        const history = HistoryCollection.find({ userId }).fetch()
        const abvByBeverage = Object.fromEntries(
            settings.beverages.map(({ name, abv }) => [name, abv])
        )
        return {
            isLoading: false,
            history: aggregatedHistory(history, ({ name }) => abvByBeverage[name]),
        }
    })
    console.log(history, isLoading)

    return <Layout>
        <Spin spinning={isLoading} tip='Loading...'>
            <Table
                bordered
                dataSource={history}
                columns={COLUMNS_TOP_LEVEL}
                rowKey={({ aggregated }) => aggregated.date}
                expandable={{
                    expandedRowRender({ records }, index, indent, expanded) {
                        return <Table columns={COLUMNS_SECOND_LEVEL} dataSource={records} pagination={false} />
                    },
                }}
            />
        </Spin>
    </Layout>
}
