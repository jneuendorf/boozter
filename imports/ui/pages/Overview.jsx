import React, { Fragment, useCallback } from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { Flex } from 'antd-mobile'
import { AutoField, AutoForm, ErrorsField, SelectField, SubmitField } from 'uniforms-antd'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import { Line } from '@ant-design/charts'

import { History as HistoryCollection } from '/imports/api/history/collection'
import { Settings as SettingsCollection } from '/imports/api/settings/collection'
import * as Breakpoints from '../breakpoints'
import { alc } from '../utils'


const config = {
    autoFit: true,
    padding: [20, 20, 20, 0],
    xAxis: false,
    xField: 'x',
    yAxis: true,
    yField: 'y',
    smooth: true,
    connectNulls: true,
    animate: {
        appear: {
            animation: 'path-in',
            duration: 500,
        },
    },
    annotations: [
        {
            type: 'line',
            start: ['min', 'median'],
            end: ['max', 'median'],
            style: {
                stroke: '#F4664A',
                // lineDash : [2 , 2],
            },
        },
    ],
    tooltip: {
        fields: ['x', 'y'],
        showTitle: false,
        formatter: (datum) => ({
            name: datum.x.toLocaleString(undefined, { dateStyle: "short" }),
            value: datum.y,
        }),
    },
    // point: {
    //     size: 5,
    //     shape: 'diamond',
    // },
    // label: {
    //     style: {
    //         fill: '#aaa',
    //     },
    // },
}


const ERROR_NO_SETTINGS = 'No settings'

const schema = HistoryCollection.schema.omit('userId')
const bridge = new SimpleSchema2Bridge(schema)


class BeverageForm extends AutoForm {
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


export const Overview = () => {
    const {
        isLoading,
        history=[],
        historyModel,
        beverages=[],
    } = useTracker(() => {
        const user = Meteor.user()
        if (
            !user
            || !Meteor.subscribe('history').ready()
            || !Meteor.subscribe('settings').ready()
        ) {
            return { isLoading: true }
        }

        const userId = user._id
        const settings = SettingsCollection.findOne({ userId })

        if (settings === undefined) {
            return {
                userId,
                isLoading: false,
                // TODO: Handle error
                error: ERROR_NO_SETTINGS,
            }
        }
        else {
            console.log('settings', settings)
            const beverages = [...settings.beverages].sort((a, b) => b.isFavorite - a.isFavorite)
            const abvByBeverage = Object.fromEntries(
                settings.beverages.map(({name, abv}) => [name, abv])
            )
            const history = (
                HistoryCollection.find({ userId }).fetch()
                .map(({name, createdAt, amount, amountUnit}) => ({
                    x: new Date(createdAt.toDateString()),
                    y: alc(amount, amountUnit, abvByBeverage[name]),
                }))
            )
            console.log('history', history)
            const historyModel = {
                ...HistoryCollection.schema.clean({}),
                userId,
                name: beverages[0] ? beverages[0].name : undefined,
                createdAt: new Date(),
            }
            return {
                userId,
                isLoading: false,
                history,
                historyModel,
                beverages,
            }
        }

    })
    const handleSubmit = useCallback((model) => {
        console.log('history.insert?', model)
        Meteor.call('history.insert', model)
    })

    console.log('historyModel', history)

    return <Fragment>
        <Breakpoints.Desktop>
            1
        </Breakpoints.Desktop>

        <Breakpoints.TabletOrMobile>
            {
                history.length
                ? <Flex>
                    {/* <Flex.Item> */}
                        <Line {...config} data={history} />
                    {/* </Flex.Item> */}
                </Flex>
                : null
            }
            <Flex>
                {/* TODO: Dropdown for usual beverages from settings and customization only after action */}
                <BeverageForm
                    schema={bridge}
                    model={historyModel}
                    disabled={isLoading}
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
                </BeverageForm>
            </Flex>
        </Breakpoints.TabletOrMobile>
    </Fragment>
}
