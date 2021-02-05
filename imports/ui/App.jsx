import React, { Fragment, useState } from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import {
    BrowserRouter as Router,
    Link,
    Redirect,
    Route,
    Switch,
} from 'react-router-dom'
import { Menu, Spin } from 'antd'
import { BarsOutlined, HomeOutlined, SettingOutlined } from '@ant-design/icons'

import 'antd/dist/antd.css'

// import * as Breakpoints from './breakpoints'
import * as Routes from './routes'
import * as Pages from './pages'


export const App = () => {
    const { isLoading, user } = useTracker(() => {
        const user = Meteor.user()
        return {
            isLoading: !Accounts.loginServicesConfigured(),
            user,
        }
    })
    const [currentTab, setCurrentTab] = useState(
        window.location.pathname.replace(/\//g, '')
    )
    console.log('APP: user?', user, isLoading)

    if (isLoading) {
        return <Spin tip='Loading' />
    }


    return <Router>
        {
            user
                ? <Fragment>
                    <Menu
                        mode="horizontal"
                        selectedKeys={[currentTab]}
                        onClick={({ key }) => setCurrentTab(key)}
                    >
                        <Menu.Item key="overview" icon={<HomeOutlined />}>
                            <Link to={Routes.OVERVIEW}>Overview</Link>
                        </Menu.Item>
                        <Menu.Item key="history" icon={<BarsOutlined />}>
                            <Link to={Routes.HISTORY}>History</Link>
                        </Menu.Item>
                        <Menu.Item key="settings" icon={<SettingOutlined />}>
                            <Link to={Routes.SETTINGS}>Settings</Link>
                        </Menu.Item>
                    </Menu>
                    <Switch>
                        <Route path={Routes.OVERVIEW}>
                            <Pages.Overview />
                        </Route>
                        <Route path={Routes.HISTORY}>
                            <Pages.History />
                        </Route>
                        <Route path={Routes.SETTINGS}>
                            <Pages.Settings />
                        </Route>
                        <Route>
                            <Pages.NotFound />
                        </Route>
                    </Switch>
                </Fragment>
                : <Switch>
                    <Route path={Routes.LOGIN}>
                        <Pages.Login />
                    </Route>
                    <Redirect to={Routes.LOGIN} />
                </Switch>
        }
    </Router>
}
