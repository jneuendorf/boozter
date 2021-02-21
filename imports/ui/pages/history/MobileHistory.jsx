import React, { useCallback, useState } from 'react'
import { Button as MobileButton } from 'antd-mobile'

import { Wrapper } from '../../Wrapper'
import { Mobile } from '../Layout'
import {
    HistoryTable,
    ExpandableHistoryTable,
} from './HistoryTable'
import { CloseOutlined, DeleteOutlined } from '@ant-design/icons'


const removeHistoryRecords = (ids) => {
    Meteor.call('history.removeMany', ids)
}


export const MobileHistory = ({ history }) => {
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

    return <Mobile.Layout>
        <Mobile.Content>
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
        </Mobile.Content>
        <Mobile.Footer>
            <Wrapper className='history--buttons'>
                <MobileButton
                    icon={
                        isDeleteMode
                            ? <CloseOutlined />
                            : <DeleteOutlined />
                    }
                    size='small'
                    inline={isDeleteMode}
                    className='toggle-delete-mode'
                    onClick={toggleDeleteMode}
                >
                    {
                        isDeleteMode
                            ? 'cancel'
                            : 'delete rows'
                    }
                </MobileButton>
                {
                    isDeleteMode && <MobileButton
                        type='warning'
                        size='small'
                        inline
                        icon={<DeleteOutlined />}
                        disabled={selectedRowIds.length === 0}
                        onClick={removeSelectedRowIds}
                    >
                        delete selected
                    </MobileButton>
                }
            </Wrapper>
        </Mobile.Footer>
    </Mobile.Layout>
}
