import React, { Fragment, useCallback, useState } from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { Button as MobileButton } from 'antd-mobile'
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'

import { History as HistoryCollection } from '/imports/api/history/collection'
import { Settings as SettingsCollection } from '/imports/api/settings/collection'
import { aggregatedHistory } from '/imports/ui/utils'
import * as Breakpoints from '../../breakpoints'
import { Wrapper } from '../../Wrapper'
import { Mobile } from '../Layout'
import {
    SimpleBeverageForm,
    schema as simpleSchema
} from './SimpleBeverageForm'
import {
    ComplexBeverageForm,
    schema as complexSchema,
} from './ComplexBeverageForm'
import { Chart } from './Chart'


const ERROR_NO_SETTINGS = 'No settings'


export const Overview = () => {
    const [isSimpleForm, setIsSimpleForm] = useState(true)
    // TODO: Use `status` instead `isLoading`
    const {
        isLoading,
        history = [],
        model,
        beverages = [],
        alcMax,
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
            // console.log('settings', settings)
            const { beverages, alcMax } = settings
            const sortedBeverages = [...beverages].sort(
                (a, b) => b.isFavorite - a.isFavorite
            )
            // TODO: use `settings.alcMaxDays` to limit data
            const history = (
                aggregatedHistory(
                    HistoryCollection.find({ userId }).fetch(),
                    settings,
                )
                    .map(({ aggregated: { date, alcAmount } }) => ({
                        x: date,
                        y: alcAmount,
                    }))
                    .sort((a, b) => a.x - b.x)
            )
            // console.log('history', history)
            const initialBeverage = sortedBeverages[0]
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
                beverages: sortedBeverages,
                alcMax,
            }
        }

    })

    // console.log('model', history)

    const toggleForm = useCallback(
        () => setIsSimpleForm(!isSimpleForm),
        [setIsSimpleForm, isSimpleForm],
    )


    return <Fragment>
        <Breakpoints.Desktop>
            1
        </Breakpoints.Desktop>

        <Breakpoints.TabletOrMobile>
            <Mobile.Layout>
                <Mobile.Header>
                    <Chart
                        data={history}
                        annotationValue={alcMax}
                    />
                </Mobile.Header>
                <Mobile.Content>
                    <Wrapper>
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
                    </Wrapper>
                </Mobile.Content>
                <Mobile.Footer>
                    <Wrapper>
                        <MobileButton
                            icon={
                                isSimpleForm
                                    ? <PlusCircleOutlined />
                                    : <MinusCircleOutlined />
                            }
                            onClick={toggleForm}
                            size='small'
                        >
                            {
                                isSimpleForm
                                    ? 'more details'
                                    : 'less details'
                            }
                        </MobileButton>
                    </Wrapper>
                </Mobile.Footer>
            </Mobile.Layout>
        </Breakpoints.TabletOrMobile>
    </Fragment>
}
