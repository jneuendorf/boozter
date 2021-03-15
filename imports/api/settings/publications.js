import { Meteor } from 'meteor/meteor'

import { Settings } from './collection'


Meteor.publish('settings', function publishSettings() {
    const userId = this.userId
    if (!userId) {
        return this.ready()
    }

    const settings = Settings.findOne({ userId })
    if (settings === undefined) {
        Settings.insert({
            ...Settings.schema.clean({}),
            userId,
        })
    }
    return Settings.find({ userId })
})
