import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'


export const Drinks = new Mongo.Collection('drinks')

Drinks.schema = new SimpleSchema({
    name: {type: String},
    // per 100ml
    calories: {type: Number},
    // per 100ml
    alc: {type: Number},
})

Drinks.attachSchema(Drinks.schema)
