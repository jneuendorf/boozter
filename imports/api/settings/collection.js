import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'

import { ALLOWED_AMOUNT_UNITS } from '../common'


export const Settings = new Mongo.Collection('settings')


const ALC_MAX = 5 * 5 / 7
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

    alc: {
        type: Object,
        // This is necessary for `schema.clean()` to generate this nested object
        defaultValue: {
            max: ALC_MAX,
            maxDays: ALC_MAX_DAYS,
        },
    },
    // WHO maximum is 1 beer a day, 5 days a week. Assuming 5% alc/vol
    'alc.max': {
        type: Number,
        label: 'Maximum ABV per day',
        defaultValue: ALC_MAX,
    },
    'alc.maxDays': {
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
                name: 'Beer (default)',
                isFavorite: false,
                // Average without alc free according to
                // https://www.kalorientabelle.net/kalorien/bier
                calories: 44,
                abv: 4.9,
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
// Settings.rawCollection().createIndex('')


export const bridge = new SimpleSchema2Bridge(Settings.schema)

// export const ensureUserSettings = (userId) => {
//     if (Settings.findOne({ userId }) === undefined) {
//         console.log('INITIALIZING SETTINGS')
//         Settings.insert({
//             userId,
//             ...Settings.schema.clean({}),
//         })
//     }
// }
