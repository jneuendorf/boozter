import { Meteor } from 'meteor/meteor'

import { Settings } from '../settings/collection'
import { History } from './collection'




Meteor.publish('history', function () {
    const userId = this.userId
    return History.find(
        {
            userId,
        },
        {
            sort: { createdAt: -1 },
            limit: 5000,
        },
    )
})


const MS_PER_DAY = 1000 * 60 * 60 * 24
Meteor.publish('history.recent', function () {
    const userId = this.userId
    const settings = Settings.findOne({ userId })
    const { alcMaxDays } = settings
    console.log('date >=', new Date(Date.now() - alcMaxDays * MS_PER_DAY))
    return History.find(
        {
            userId,
            createdAt: {
                $gte: new Date(Date.now() - alcMaxDays * MS_PER_DAY),
            },
        },
        {
            sort: { createdAt: -1 },
        },
    )
})
