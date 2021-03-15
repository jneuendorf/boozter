import React, { Fragment, useCallback, useState } from 'react'
import { Button } from 'antd'

import { Wrapper } from '../../Wrapper'
import {
    HistoryTable,
    ExpandableHistoryTable,
} from './HistoryTable'
import { CloseOutlined, DeleteOutlined } from '@ant-design/icons'


const removeHistoryRecords = (ids) => {
    Meteor.call('history.removeMany', ids)
}


export const DesktopHistory = ({ history }) => {
    const [isDeleteMode, setDeleteMode] = useState(false)
    const [selectedRowIds, setSelectedRowIds] = useState([])

    const toggleDeleteMode = useCallback(
        () => setDeleteMode(!isDeleteMode),
        [setDeleteMode, isDeleteMode],
    )
    const onRowSelectionChange = useCallback(
        (selectedRowKeys, selectedRows) => {
            setSelectedRowIds(
                selectedRows.map(row => row.records)
                    .flat()
                    .map(record => record._id)
            )
        },
        [setSelectedRowIds],
    )
    const removeSelectedRowIds = useCallback(
        () => {
            removeHistoryRecords(selectedRowIds)
            setDeleteMode(false)
        },
        [selectedRowIds, setDeleteMode],
    )

    return <Fragment>
        {
            isDeleteMode
                ? <HistoryTable
                    dataSource={history}
                    size='small'
                    rowSelection={{
                        type: 'checkbox',
                        onChange: onRowSelectionChange,
                    }}
                />
                : <ExpandableHistoryTable
                    dataSource={history}
                    expandRowByClick={true}
                    size='small'
                />
        }
        <Wrapper className='history--buttons'>
            <Button
                icon={
                    isDeleteMode
                        ? <CloseOutlined />
                        : <DeleteOutlined />
                }
                inline={isDeleteMode}
                className='toggle-delete-mode'
                onClick={toggleDeleteMode}
            >
                {
                    isDeleteMode
                        ? 'cancel'
                        : 'delete rows'
                }
            </Button>
            {
                isDeleteMode && <Button
                    type='warning'
                    inline
                    icon={<DeleteOutlined />}
                    disabled={selectedRowIds.length === 0}
                    onClick={removeSelectedRowIds}
                >
                    delete selected
                    </Button>
            }
        </Wrapper>
    </Fragment>
}
