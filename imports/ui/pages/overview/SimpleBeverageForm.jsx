import React from 'react'
import { Meteor } from 'meteor/meteor'
import { AutoField, AutoForm, ErrorsField, SelectField, SubmitField } from 'uniforms-antd'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'

import { History as HistoryCollection } from '/imports/api/history/collection'
import SimpleSchema from 'simpl-schema'


export const schema = HistoryCollection.schema
    .pick('name')
    .extend({
        numberOfDrinks: {
            type: SimpleSchema.Integer,
            min: 1,
            defaultValue: 1,
        },
    })
const bridge = new SimpleSchema2Bridge(schema)


const handleSubmit = (model) => {
    console.log('history.addUsualBeverage?', model)
    Meteor.call('history.addUsualBeverage', model)
}


export const SimpleBeverageForm = ({ disabled, model, beverages }) => (
    <AutoForm
        schema={bridge}
        model={model}
        disabled={disabled}
        onSubmit={handleSubmit}
    >
        <AutoField name='numberOfDrinks' />
        <SelectField
            name='name'
            options={beverages.map(({ name, isFavorite }) => ({
                label: isFavorite ? `${name} *` : name,
                value: name,
            }))}
        />
        <ErrorsField />
        <SubmitField />
    </AutoForm>
)
