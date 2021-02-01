import React, { Fragment } from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom'
import 'antd/dist/antd.css'

import * as Routes from './routes'
import * as Pages from './pages/'
import { Spin } from 'antd'


export const App = () => {
    const { isLoading, user } = useTracker(() => {
        const user = Meteor.user()
        return {
            isLoading: !Accounts.loginServicesConfigured(),
            user,
        }
    })
    console.log('APP: user?', user, isLoading)

    if (isLoading) {
        return <Spin tip='Loading' />
    }

    return <Router>
        {
            user
                ? <Switch>
                    <Route path={Routes.OVERVIEW}>
                        <Pages.Overview />
                    </Route>
                    <Route path={Routes.HISTORY}>
                        <Pages.History />
                    </Route>
                    <Route path={Routes.SETTINGS}>
                        <Pages.Settings />
                    </Route>
                    <Route path={Routes.ADD_DRINK}>
                        <Pages.AddDrink />
                    </Route>
                    <Route>
                        <Pages.NotFound />
                    </Route>
                </Switch>
                : <Switch>
                    <Route path={Routes.LOGIN}>
                        <Pages.Login />
                    </Route>
                    <Redirect to={Routes.LOGIN} />
                </Switch>
        }
    </Router>
}
