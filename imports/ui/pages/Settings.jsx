import React, { useCallback } from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { AutoFields, AutoForm, ErrorsField, ListField, SubmitField } from 'uniforms-antd'
import { Spin } from 'antd'
import { Accordion } from 'antd-mobile'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'

import {
    Settings as SettingsCollection,
    bridge as schema,
} from '/imports/api/settings/collection'
import * as Breakpoints from '../breakpoints'
import { Wrapper } from '../Wrapper'


const alcSchema = SettingsCollection.schema.pick('alcMax', 'alcMaxDays')
const alcBridge = new SimpleSchema2Bridge(alcSchema)
const beveragesSchema = SettingsCollection.schema.pick('beverages')
const beveragesBridge = new SimpleSchema2Bridge(beveragesSchema)


export const Settings = (props) => {
    const { isLoading, userId, settings} = useTracker(() => {
        const user = Meteor.user()
        if (!user || !Meteor.subscribe('settings').ready()) {
            return { isLoading: true }
        }

        const userId = user._id
        console.log('using existing settings object?', !!SettingsCollection.findOne({ userId }))
        const settings = (
            SettingsCollection.findOne({ userId })
            || {
                userId,
                ...SettingsCollection.schema.clean({}),
            }
        )
        return {
            isLoading: false,
            userId,
            settings,
        }
    })
    const handleSubmit = useCallback(
        (model) => {
            Meteor.call('settings.upsert', userId, model)
        },
        [userId],
    )

    console.log(settings)

    return <Spin spinning={isLoading} tip='Loading...'>
        <Breakpoints.Desktop>
            <AutoForm
                schema={schema}
                model={settings}
                disabled={isLoading}
                onSubmit={handleSubmit}
            >
                <AutoFields omitFields={['userId']} />
                <ErrorsField />
                <SubmitField />
            </AutoForm>
        </Breakpoints.Desktop>

        <Breakpoints.TabletOrMobile>
            <Accordion
                defaultActiveKey={['beverages', 'alc']}
                className='settings--accordion'
            >
                <Accordion.Panel key='beverages' header='Beverages'>
                    <Wrapper>
                        <AutoForm
                            schema={beveragesBridge}
                            model={settings}
                            disabled={isLoading}
                            onSubmit={handleSubmit}
                        >
                            <ListField
                                label={null}
                                name='beverages'
                            />
                            <ErrorsField />
                            <SubmitField value='Save' />
                        </AutoForm>
                    </Wrapper>
                </Accordion.Panel>
                <Accordion.Panel key='alc' header='Alcohol'>
                    <Wrapper>
                        <AutoForm
                            schema={alcBridge}
                            model={settings}
                            disabled={isLoading}
                            onSubmit={handleSubmit}
                        >
                            <AutoFields />
                            <ErrorsField />
                            <SubmitField value='Save' />
                        </AutoForm>
                    </Wrapper>
                </Accordion.Panel>
            </Accordion>
        </Breakpoints.TabletOrMobile>

    </Spin>
}
