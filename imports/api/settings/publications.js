import { Meteor } from 'meteor/meteor'

import { Settings } from './collection'


Meteor.publish('settings', function publishSettings() {
    return Settings.find({ userId: this.userId })
})