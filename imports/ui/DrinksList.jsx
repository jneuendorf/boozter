import * as React from 'react'
import { Table } from 'antd'


const { Column } = Table


const expandedRowRender = (record, index, indent, expanded) => {
    return <Table dataSource={[]}>
        <Column />
    </Table>
}


export const DrinksList = (props) => {
    return <Table
        dataSource={[
            {date: new Date()}
        ]}
        expandable={{ expandedRowRender }}
    >
        <Column title="Date" dataIndex="age" key="date" />
    </Table>
}
