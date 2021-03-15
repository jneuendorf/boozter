import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'

import BeverageData from '/imports/api/beverages.json'
import { alc } from '/imports/ui/utils'
import { ALLOWED_AMOUNT_UNITS } from '../common'


export const Settings = new Mongo.Collection('settings')


const BEER = 'Beer'
const BEER_ABV = 4.9
// WHO maximum is 1 beer a day, 5 days a week. Assuming 4.9% alc/vol
const ALC_MAX = 5 * alc(500, 'ml', BEER_ABV) / 7
// const ALC_MAX = 5 * BEER_ABV / 7
const ALC_MAX_DAYS = 120


Settings.schema = new SimpleSchema({
    userId: String,

    // colors: {
    //     type: Array,
    //     minCount: 2,
    //     maxCount: 5,
    //     defaultValue: [ 'blue', 'green', 'red' ],
    // },
    // 'colors.$': String,

    alcMax: {
        type: Number,
        label: 'Maximum ABV per day',
        defaultValue: ALC_MAX,
    },
    alcMaxDays: {
        type: SimpleSchema.Integer,
        min: 7,
        label: 'Number of past days relevant for the average',
        defaultValue: ALC_MAX_DAYS,
    },

    beverages: {
        type: Array,
        minCount: 1,
        defaultValue: [
            {
                name: BEER,
                isFavorite: false,
                calories: BeverageData[BEER].calories,
                abv: BEER_ABV,
                usualAmount: 500,
                usualAmountUnit: 'ml'
            },
        ]
    },
    'beverages.$': Object,
    'beverages.$.name': String,
    'beverages.$.isFavorite': {
        type: Boolean,
        defaultValue: false,
    },
    'beverages.$.calories': {
        type: Number,
        min: 0,
    },
    'beverages.$.abv': {
        type: Number,
        min: 0,
        max: 100,
    },
    'beverages.$.usualAmount': {
        type: Number,
        min: 0,
        label: 'Smallest usual amount',
    },
    'beverages.$.usualAmountUnit': {
        type: String,
        allowedValues: ALLOWED_AMOUNT_UNITS,
        label: 'Unit of smallest usual amount',
    },
})

Settings.attachSchema(Settings.schema)
