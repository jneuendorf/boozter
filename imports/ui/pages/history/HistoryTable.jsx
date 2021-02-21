import React from 'react'
import { Table } from 'antd'
import memoize from 'lodash.memoize'


const DATETIME_FORMAT = new Intl.DateTimeFormat(
    undefined,
    { dateStyle: 'short' },
)
const COLUMNS_TOP_LEVEL = [
    {
        title: 'Alcolhol',
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


const nestedTable = memoize(size => ({ records }) => (
    <Table
        dataSource={records}
        columns={COLUMNS_SECOND_LEVEL}
        rowKey='_id'
        size={size}
        pagination={false}
    />
))


export const HistoryTable = ({ expandRowByClick, ...props }) => <Table
    bordered
    columns={COLUMNS_TOP_LEVEL}
    rowKey={topLevelRowKey}
    {...props}
/>


export const ExpandableHistoryTable = ({ size, expandRowByClick, ...props }) => <HistoryTable
    size={size}
    expandable={{
        expandRowByClick,
        expandedRowRender: nestedTable(size),
    }}
    {...props}
/>
