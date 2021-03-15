import { Meteor } from 'meteor/meteor'

import { Settings } from './collection'


Meteor.methods({
    'settings.upsert'(settings) {
        const userId = this.userId
        if (!userId) {
            throw new Meteor.Error('Not authorized.')
        }

        console.log("SETTINGS.UPSERT", userId, settings)

        const { beverages } = settings
        console.log('beverages', beverages)
        if (beverages.length !== new Set(beverages).size) {
            throw new Meteor.Error('Beverage names must be distinct')
        }

        Settings.upsert({userId}, { $set: settings })
    }
})
