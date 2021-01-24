// import { check } from 'meteor/check'

import { Drinks } from './collection'
import { userAuthorizedMethods } from '/utils/meteor/methods'


Meteor.methods(userAuthorizedMethods({
    'drinks.insert'(name, calories, alc) {
        // check(text, String)
        //
        // if (!this.userId) {
        //     throw new Meteor.Error('Not authorized.')
        // }

        Drinks.insert({
            name,
            calories,
            alc,
            createdAt: new Date(),
            userId: this.userId,
        })
    },

    'drinks.remove'(taskId) {
        // check(taskId, String)
        //
        // if (!this.userId) {
        //     throw new Meteor.Error('Not authorized.')
        // }

        Drinks.remove(taskId)
    },

    'drinks.setIsChecked'(taskId, isChecked) {
        // check(taskId, String)
        // check(isChecked, Boolean)
        //
        // if (!this.userId) {
        //     throw new Meteor.Error('Not authorized.')
        // }

        Drinks.update(taskId, {
            $set: {
                isChecked
            }
        })
    }
}))
