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
// import { UserRedirect } from './UserRedirect'


export const App = () => {
    const user = useTracker(() => Meteor.user(), [])

    return <Router>
        <Switch>
            {
                user
                ? <Fragment>
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
                    <Redirect to={Routes.OVERVIEW} />
                </Fragment>
                : <Fragment>
                    <Route path={Routes.LOGIN}>
                        <Pages.Login />
                    </Route>
                    <Redirect to={Routes.LOGIN} />
                </Fragment>
            }
            {/* <Route path={Routes.LOGIN}>
                <Pages.Login />
            </Route>

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
            </Route> */}
            {/* <UserRedirect /> */}
        </Switch>
    </Router>
}
