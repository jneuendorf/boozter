// import { check } from 'meteor/check'

import { History } from './collection'
import { userAuthorizedMethods } from '/utils/meteor/methods'


Meteor.methods(userAuthorizedMethods({
    'history.insert'(model) {
        // check(text, String)
        //
        // if (!this.userId) {
        //     throw new Meteor.Error('Not authorized.')
        // }
        console.log('history.insert?', model, this.userId)

        History.insert({
            createdAt: new Date(),
            ...model,
        })
    },

    // 'drinks.remove'(taskId) {
    //     // check(taskId, String)
    //     //
    //     // if (!this.userId) {
    //     //     throw new Meteor.Error('Not authorized.')
    //     // }

    //     History.remove(taskId)
    // },
}))
