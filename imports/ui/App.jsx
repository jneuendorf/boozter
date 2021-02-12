import React, { Fragment, useState } from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import Menu from 'antd/lib/menu'
import Spin from 'antd/lib/spin'
import { TabBar } from 'antd-mobile'
import { DatabaseOutlined, DashboardOutlined, DashboardTwoTone, SettingOutlined, DatabaseTwoTone, SettingTwoTone } from '@ant-design/icons'

import 'antd/dist/antd.css'
import 'antd-mobile/dist/antd-mobile.css'

import * as Breakpoints from './breakpoints'
import * as Pages from './pages'
import { LogoutButton } from './LogoutButton'


const Navigation = {
    OVERVIEW: 'overview',
    HISTORY: 'history',
    SETTINGS: 'settings',
}


export const App = () => {
    const { isLoading, user } = useTracker(() => {
        const user = Meteor.user()
        return {
            isLoading: !Accounts.loginServicesConfigured(),
            user,
        }
    })
    const [currentTab, setCurrentTab] = useState(Navigation.OVERVIEW)
    console.log('APP: user?', user, isLoading)

    if (isLoading) {
        return <Spin tip='Loading' />
    }

    return <Fragment>
        {
            user
                ? <Fragment>
                    <Breakpoints.Desktop>
                        <Menu
                            mode="horizontal"
                            selectedKeys={[currentTab]}
                            onClick={({ key }) => setCurrentTab(key)}
                        >
                            <Menu.Item key={Navigation.OVERVIEW} icon={<DashboardOutlined />}>
                                Overview
                            </Menu.Item>
                            <Menu.Item key={Navigation.HISTORY} icon={<DatabaseOutlined />}>
                                History
                            </Menu.Item>
                            <Menu.Item key={Navigation.SETTINGS} icon={<SettingOutlined />}>
                                Settings
                            </Menu.Item>
                            <Menu.Item style={{float: 'right'}}>
                                <LogoutButton />
                            </Menu.Item>
                        </Menu>
                        {currentTab === Navigation.OVERVIEW && <Pages.Overview />}
                        {currentTab === Navigation.HISTORY && <Pages.History />}
                        {currentTab === Navigation.SETTINGS && <Pages.Settings />}
                    </Breakpoints.Desktop>

                    <Breakpoints.TabletOrMobile>
                        <TabBar>
                            <TabBar.Item
                                key={Navigation.OVERVIEW}
                                selected={currentTab === Navigation.OVERVIEW}
                                title='Overview'
                                icon={<DashboardOutlined />}
                                selectedIcon={<DashboardTwoTone />}
                                onPress={() => setCurrentTab(Navigation.OVERVIEW)}
                            >
                                <Pages.Overview />
                            </TabBar.Item>
                            <TabBar.Item
                                key={Navigation.HISTORY}
                                selected={currentTab === Navigation.HISTORY}
                                title='History'
                                icon={<DatabaseOutlined />}
                                selectedIcon={<DatabaseTwoTone />}
                                onPress={() => setCurrentTab(Navigation.HISTORY)}
                            >
                                <Pages.History />
                            </TabBar.Item>
                            <TabBar.Item
                                key={Navigation.SETTINGS}
                                selected={currentTab === Navigation.SETTINGS}
                                title='Settings'
                                icon={<SettingOutlined />}
                                selectedIcon={<SettingTwoTone />}
                                onPress={() => setCurrentTab(Navigation.SETTINGS)}
                            >
                                <Pages.Settings />
                            </TabBar.Item>
                        </TabBar>
                    </Breakpoints.TabletOrMobile>
                </Fragment>
                : <Pages.Login />
        }
    </Fragment>
}
