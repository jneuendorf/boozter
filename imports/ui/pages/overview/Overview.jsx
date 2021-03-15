import React, { Fragment, useCallback, useState } from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { Button } from 'antd'
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


const MS_PER_DAY = 1000 * 60 * 60 * 24


export const Overview = () => {
    const [isSimpleForm, setIsSimpleForm] = useState(true)
    const toggleForm = useCallback(
        () => setIsSimpleForm(!isSimpleForm),
        [setIsSimpleForm, isSimpleForm],
    )

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
            || !Meteor.subscribe('history.recent').ready()
            || !Meteor.subscribe('settings').ready()
        ) {
            return { isLoading: true }
        }

        const userId = user._id
        const settings = SettingsCollection.findOne({ userId })
        const { beverages, alcMax, alcMaxDays } = settings
        const sortedBeverages = [...beverages].sort(
            (a, b) => b.isFavorite - a.isFavorite
        )
        const history = (
            aggregatedHistory(
                HistoryCollection.find(
                    {
                        userId,
                        createdAt: {
                            $gte: new Date(Date.now() - alcMaxDays * MS_PER_DAY),
                        },
                    },
                    {
                        sort: { createdAt: -1 },
                    },
                ).fetch(),
                settings,
            )
                .map(({ aggregated: { date, alcAmount } }) => ({
                    x: date,
                    y: alcAmount,
                }))
                .sort((a, b) => a.x - b.x)
        )
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
    })

    return <Fragment>
        <Breakpoints.Desktop>
            <Chart
                data={history}
                annotationValue={alcMax}
                height={200}
            />
            <Wrapper style={{paddingRight: '0', textAlign: 'right'}}>
                <Button
                    icon={
                        isSimpleForm
                            ? <PlusCircleOutlined />
                            : <MinusCircleOutlined />
                    }
                    onClick={toggleForm}
                >
                    {
                        isSimpleForm
                            ? 'more details'
                            : 'less details'
                    }
                </Button>
            </Wrapper>
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
