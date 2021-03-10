import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'

import { ALLOWED_AMOUNT_UNITS } from '../common'


export const History = new Mongo.Collection('history')

History.schema = new SimpleSchema({
    userId: String,

    name: String,
    amount: Number,
    amountUnit: {
        type: String,
        allowedValues: ALLOWED_AMOUNT_UNITS,
        defaultValue: 'ml',
    },
    // TODO: Normalize as UTCDate
    createdAt: Date,
})

History.attachSchema(History.schema)


export const bridge = new SimpleSchema2Bridge(History.schema)
// export const bridge2 = new SimpleSchema2Bridge(History.schema.omit('createdAt'))
// export const bridge3 = new SimpleSchema2Bridge(History.schema.getObjectSchema('list.$'))
