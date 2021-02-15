import React, { Fragment, useState } from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { Flex } from 'antd-mobile'
import { Line } from '@ant-design/charts'
import { Button } from 'antd'

import { History as HistoryCollection } from '/imports/api/history/collection'
import { Settings as SettingsCollection } from '/imports/api/settings/collection'
import { aggregatedHistory } from '/imports/ui/utils'
import * as Breakpoints from '../../breakpoints'
import {
    SimpleBeverageForm,
    schema as simpleSchema
} from './SimpleBeverageForm'
import {
    ComplexBeverageForm,
    schema as complexSchema,
} from './ComplexBeverageForm'


const config = {
    autoFit: true,
    height: 100,
    padding: [20, 20, 20, 0],
    xAxis: false,
    xField: 'x',
    yAxis: false,
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


export const Overview = () => {
    const [isSimpleForm, setIsSimpleForm] = useState(true)
    // TODO: Use `status` instead `isLoading`
    const {
        isLoading,
        history = [],
        model,
        beverages = [],
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
                settings.beverages.map(({ name, abv }) => [name, abv])
            )
            console.log(aggregatedHistory(
                HistoryCollection.find({ userId }).fetch(),
                ({ name }) => abvByBeverage[name],
            ))
            const history = (
                aggregatedHistory(
                    HistoryCollection.find({ userId }).fetch(),
                    ({ name }) => abvByBeverage[name],
                )
                    .map(({ aggregated: { date, amount } }) => ({
                        x: date,
                        y: amount,
                    }))
                    .sort((a, b) => a.x - b.x)
            )
            console.log('history', history)
            const initialBeverage = beverages[0]
            const model = (
                isSimpleForm
                    ? {
                        ...simpleSchema.clean({}),
                        name: initialBeverage ? initialBeverage.name : undefined,
                    }
                    : {
                        ...complexSchema.clean({}),
                        name: initialBeverage ? initialBeverage.name : undefined,
                        amount: initialBeverage.usualAmount,
                        amountUnit: initialBeverage.usualAmountUnit,
                        createdAt: new Date(),
                    }
            )
            return {
                userId,
                isLoading: false,
                history,
                model,
                beverages,
            }
        }

    })

    console.log('model', history)
    console.log(
        HistoryCollection.schema
            .pick('name')
            .extend({
                numberOfDrinks: {
                    type: Number,
                    min: 1,
                    defaultValue: 1,
                },
            })
            .clean({})
    )


    return <Fragment>
        <Breakpoints.Desktop>
            1
        </Breakpoints.Desktop>

        <Breakpoints.TabletOrMobile>
            {
                history.length
                    ? <Flex>
                        <Line {...config} data={history} />
                    </Flex>
                    : null
            }
            <Flex>
                <Button onClick={() => setIsSimpleForm(!isSimpleForm)}>toggle</Button>
            </Flex>
            <Flex>
                {
                    isSimpleForm
                        ? <SimpleBeverageForm
                            model={model}
                            disabled={isLoading}
                            beverages={beverages}
                        />
                        : <ComplexBeverageForm
                            model={model}
                            disabled={isLoading}
                            beverages={beverages}
                        />
                }
            </Flex>
        </Breakpoints.TabletOrMobile>
    </Fragment>
}
