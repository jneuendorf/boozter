import React, { Fragment } from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { Spin, Table } from 'antd'
import memoize from 'lodash.memoize'

import { History as HistoryCollection } from '/imports/api/history/collection'
import { Settings as SettingsCollection } from '/imports/api/settings/collection'
import { aggregatedHistory } from '/imports/ui/utils'
import * as Breakpoints from '../breakpoints'


const DATETIME_FORMAT = new Intl.DateTimeFormat(
    undefined,
    { dateStyle: 'short' },
)
const COLUMNS_TOP_LEVEL = [
    {
        title: 'Pure Alcolhol',
        key: 'alcohol',
        render(text, { aggregated: { alcAmount, alcAmountUnit } }, index) {
            return Number.isNaN(alcAmount)
                ? '?'
                : `${alcAmount.toFixed(2)} ${alcAmountUnit}`
        },
    },
    {
        title: 'Calories',
        key: 'cal',
        render(text, { aggregated }, index) {
            return Number.isNaN(aggregated.calories)
                ? '?'
                : Math.round(aggregated.calories)
        },
    },
    {
        title: 'Date',
        key: 'createdAt',
        render(text, { aggregated }, index) {
            return DATETIME_FORMAT.format(aggregated.date)
        },
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


const topLevelRowKey = ({ aggregated }) => aggregated.date


const nestedTable = memoize(size => ({ records }, index, indent, expanded) => (
    <Table
        dataSource={records}
        columns={COLUMNS_SECOND_LEVEL}
        rowKey='_id'
        size={size}
        pagination={false}
    />
))


const HistoryTable = ({ size, expandRowByClick, ...props }) => <Table
    bordered
    columns={COLUMNS_TOP_LEVEL}
    rowKey={topLevelRowKey}
    size={size}
    expandable={{
        expandRowByClick,
        expandedRowRender: nestedTable(size),
    }}
    {...props}
/>


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
        return {
            isLoading: false,
            history: aggregatedHistory(history, settings),
        }
    })
    console.log(history, isLoading)

    return <Fragment>
        <Spin spinning={isLoading} tip='Loading...'>
            <Breakpoints.Desktop>
                <HistoryTable
                    dataSource={history}
                    expandRowByClick={false}
                    size='middle'
                />
            </Breakpoints.Desktop>

            <Breakpoints.TabletOrMobile>
                <HistoryTable
                    dataSource={history}
                    expandRowByClick={true}
                    size='small'
                />
            </Breakpoints.TabletOrMobile>
        </Spin>
    </Fragment>
}
