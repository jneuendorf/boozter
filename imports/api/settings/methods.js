import { Meteor } from 'meteor/meteor'

import { Settings } from './collection'
import { userAuthorizedMethods } from '/utils/meteor/methods'


Meteor.methods(userAuthorizedMethods({
    // 'settings.init'() {
    //     console.log('SETTINGS INIT')
    //    if (Settings.findOne({userId: this.userId}) === undefined) {
    //        Settings.insert({
    //            userId: this.userId,
    //            ...Settings.schema.clean({}),
    //        })
    //    }

    // },
    'settings.upsert'(userId, settings) {
        console.log("SETTINGS.UPSERT", userId, settings)

        const { beverages } = settings
        console.log('beverages', beverages)
        if (beverages.length !== new Set(beverages).size) {
            throw new Meteor.Error('Beverage names must be distinct')
        }

        Settings.upsert({userId}, { $set: settings })
    }
}))
