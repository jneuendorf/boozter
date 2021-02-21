import React, { Fragment } from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { Spin } from 'antd'

import { History as HistoryCollection } from '/imports/api/history/collection'
import { Settings as SettingsCollection } from '/imports/api/settings/collection'
import { aggregatedHistory } from '/imports/ui/utils'
import * as Breakpoints from '../../breakpoints'
import { MobileHistory } from './MobileHistory'
import { DesktopHistory } from './DesktopHistory'


export const History = (props) => {
    const { isLoading, history } = useTracker(() => {
        const user = Meteor.user()
        if (
            !user
            || !Meteor.subscribe('history').ready()
            || !Meteor.subscribe('settings').ready()
        ) {
            return { isLoading: true }
        }

        const userId = user._id
        const settings = SettingsCollection.findOne({ userId })
        const history = HistoryCollection.find({ userId }).fetch()
        return {
            isLoading: false,
            history: aggregatedHistory(history, settings),
        }
    })

    return <Fragment>
        <Spin spinning={isLoading} tip='Loading...'>
            <Breakpoints.Desktop>
                <DesktopHistory history={history} />
            </Breakpoints.Desktop>

            <Breakpoints.TabletOrMobile>
                <MobileHistory history={history} />
            </Breakpoints.TabletOrMobile>
        </Spin>
    </Fragment>
}
