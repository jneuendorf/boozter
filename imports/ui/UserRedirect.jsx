import React from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { Redirect, useLocation } from 'react-router-dom'

import * as Routes from './routes'


export const UserRedirect = () => {
    const location = useLocation()
    const user = useTracker(() => Meteor.user(), [])
    const route = (
        user
        ? Routes.OVERVIEW
        : Routes.LOGIN
    )
    if (route !== location.pathname) {
        console.log('redirecting to', route)
    }
    else {
        console.log('not redirecting...')
    }
    return (
        route !== location.pathname
        ? <Redirect to={route} />
        : null
    )
}
