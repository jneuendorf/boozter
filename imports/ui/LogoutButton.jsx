import React, { useCallback } from 'react'
import { Button } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'


export const LogoutButton = (props) => {
    const logout = useCallback(
        () => Meteor.logout(),
        [Meteor],
    )
    return <Button
        icon={<LogoutOutlined />}
        onClick={logout}
    >
        Logout
    </Button>
}