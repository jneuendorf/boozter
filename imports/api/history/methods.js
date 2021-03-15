import { Settings } from '/imports/api/settings/collection'

import { History } from './collection'


Meteor.methods({
    'history.insert'(model) {
        const userId = this.userId
        if (!userId) {
            throw new Meteor.Error('Not authorized.')
        }

        console.log('history.insert?', model, userId)

        History.insert({
            createdAt: new Date(),
            ...model,
            userId,
        })
    },

    'history.addUsualBeverage'({ name, numberOfDrinks }) {
        const userId = this.userId
        if (!userId) {
            throw new Meteor.Error('Not authorized.')
        }

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

    'history.removeMany'(ids) {
        const userId = this.userId
        if (!userId) {
            throw new Meteor.Error('Not authorized.')
        }

        History.remove({
            userId,
            _id: { $in: ids },
        })
    },
})
