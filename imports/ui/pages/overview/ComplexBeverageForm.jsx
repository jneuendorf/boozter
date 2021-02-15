import React from 'react'
import { Meteor } from 'meteor/meteor'
import { AutoField, AutoForm, ErrorsField, SelectField, SubmitField } from 'uniforms-antd'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'

import { History as HistoryCollection } from '/imports/api/history/collection'


export const schema = HistoryCollection.schema.pick(
    'name',
    'amount',
    'amountUnit',
    'createdAt',
)
const bridge = new SimpleSchema2Bridge(schema)


class BeverageAutoForm extends AutoForm {
    onChange(key, value) {
        if (key === 'name') {
            const { beverages } = this.props
            const beverage = beverages.find(beverage => beverage.name === value)
            super.onChange('amount', beverage.usualAmount)
            super.onChange('amountUnit', beverage.usualAmountUnit)
        }

        super.onChange(key, value)
    }
}


const handleSubmit = (model) => {
    console.log('history.insert?', model)
    Meteor.call('history.insert', model)
}


export const ComplexBeverageForm = ({ disabled, model, beverages }) => (
    <BeverageAutoForm
        schema={bridge}
        model={model}
        disabled={disabled}
        onSubmit={handleSubmit}
        beverages={beverages}
    >
        <SelectField
            name='name'
            options={beverages.map(({ name, isFavorite }) => ({
                label: isFavorite ? `${name} *` : name,
                value: name,
            }))}
        />
        <AutoField name='amount' />
        <AutoField name='amountUnit' />
        <AutoField name='createdAt' />
        <ErrorsField />
        <SubmitField />
    </BeverageAutoForm>
)
