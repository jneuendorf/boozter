import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
// import { DrinksCollection } from '/imports/api/drinks'

import './registerMethods'
import { initDb } from './startup'


// function insertLink({ title, url }) {
//     DrinksCollection.insert({title, url, createdAt: new Date()})
// }


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

    // // If the Links collection is empty, add some data.
    // if (DrinksCollection.find().count() === 0) {
    //     insertLink({
    //         title: 'Do the Tutorial',
    //         url: 'https://www.meteor.com/tutorials/react/creating-an-app',
    //     })
    //
    //     insertLink({
    //         title: 'Follow the Guide',
    //         url: 'http://guide.meteor.com',
    //     })
    //
    //     insertLink({
    //         title: 'Read the Docs',
    //         url: 'https://docs.meteor.com',
    //     })
    //
    //     insertLink({
    //         title: 'Discussions',
    //         url: 'https://forums.meteor.com',
    //     })
    // }
})
