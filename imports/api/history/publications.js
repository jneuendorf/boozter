import { Meteor } from 'meteor/meteor'

import { History } from './collection'


Meteor.publish('history', function publishHistory() {
    return History.find({ userId: this.userId })
})