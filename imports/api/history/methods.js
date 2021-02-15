import { Settings } from '/imports/api/settings/collection'

import { History } from './collection'
import { userAuthorizedMethods } from '/utils/meteor/methods'


Meteor.methods(userAuthorizedMethods({
    'history.insert'(model) {
        console.log('history.insert?', model, this.userId)

        History.insert({
            createdAt: new Date(),
            ...model,
        })
    },

    'history.addUsualBeverage'({ name, numberOfDrinks }) {
        const userId = this.userId
        console.log('history.addUsualBeverage?', name, numberOfDrinks, userId)
        const settings = Settings.findOne({ userId })
        const beverage = settings.beverages.find(
            beverage => beverage.name === name
        )

        History.insert({
            userId,
            name,
            amount: numberOfDrinks * beverage.usualAmount,
            amountUnit: beverage.usualAmountUnit,
            createdAt: new Date(),
        })
    },
}))
