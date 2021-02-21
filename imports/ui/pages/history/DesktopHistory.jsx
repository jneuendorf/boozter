import React, { useCallback, useState } from 'react'

import { HistoryTable } from './HistoryTable'


export const DesktopHistory = ({ history }) => {
    const [isDeleteMode, setDeleteMode] = useState(false)

    const toggleDeleteMode = useCallback(
        () => setDeleteMode(!isDeleteMode),
        [setDeleteMode, isDeleteMode],
    )

    return <HistoryTable
        dataSource={history}
        expandRowByClick={false}
        size='middle'
    />
}
