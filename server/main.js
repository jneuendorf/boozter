import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
// import { DrinksCollection } from '/imports/api/drinks'
import { Settings } from '/imports/api/settings/collection'

import './registerMethods'
import './registerPublications'
import { initDb } from './startup'


const SEED_USERNAME = 'test'
const SEED_PASSWORD = 'test'


Meteor.startup(() => {
    initDb()

    if (!Accounts.findUserByUsername(SEED_USERNAME)) {
        Accounts.createUser({
            username: SEED_USERNAME,
            password: SEED_PASSWORD,
        })
    }

    // Settings.rawCollection().drop()
})
