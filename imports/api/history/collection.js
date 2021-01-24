import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'


export const History = new Mongo.Collection('history')

History.schema = new SimpleSchema({
    userId: String,

    list: Array,
    'list.$': {
        type: Object,

    },
    'list.$.name': String,
    'list.$.amount': Number,
    'list.$.amountUnit': String,
})

History.attachSchema(History.schema)
