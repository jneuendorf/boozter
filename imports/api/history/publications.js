import { Meteor } from 'meteor/meteor'

import { History } from './collection'


Meteor.publish('history', function () {
    return History.find(
        {
            userId: this.userId,
            createdAt: {
                // TODO: Use settings.alcMaxDays instead 120
                $gte: new Date(Date.now() - 120 * (1000 * 60 * 60 * 24)),
            },
        },
        {
            sort: { createdAt: -1 },
        },
    )
})

// Meteor.publish('history', function() {
//     return History.rawCollection().aggregate([
//         {
//             $match: {
//                 userId: this.userId,
//                 createdAt: {
//                     // TODO: Use settings.alc.maxDays instead 120
//                     $gte: new Date().valueOf() - 120 * (1000 * 60 * 60 * 24)
//                 },
//             }
//         },
//         { $group: { _id: { $dayOfYear: '$createdAt' } } },
//         { $sort: { 'createdAt': -1 } },
//     ])
// })
