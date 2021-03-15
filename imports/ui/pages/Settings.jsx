import React, { useCallback } from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { AutoFields, AutoForm, ErrorsField, ListField, SubmitField } from 'uniforms-antd'
import { Divider, Spin } from 'antd'
import { Accordion } from 'antd-mobile'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'

import {
    Settings as SettingsCollection,
} from '/imports/api/settings/collection'
import * as Breakpoints from '../breakpoints'
import { Wrapper } from '../Wrapper'
import { LogoutButton } from '../LogoutButton'


const bridge = new SimpleSchema2Bridge(SettingsCollection.schema)
const alcSchema = SettingsCollection.schema.pick('alcMax', 'alcMaxDays')
const alcBridge = new SimpleSchema2Bridge(alcSchema)
const beveragesSchema = SettingsCollection.schema.pick('beverages')
const beveragesBridge = new SimpleSchema2Bridge(beveragesSchema)


export const Settings = (props) => {
    const { isLoading, settings } = useTracker(() => {
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
            settings,
        }
    })
    const handleSubmit = useCallback(model => {
        Meteor.call('settings.upsert', model)
    })

    console.log(settings)

    return <Spin spinning={isLoading} tip='Loading...'>
        <Breakpoints.Desktop>
            <Wrapper />
            <AutoForm
                schema={bridge}
                model={settings}
                disabled={isLoading}
                onSubmit={handleSubmit}
            >
                <ListField name='beverages' />
                <Divider />
                <AutoFields fields={['alcMax', 'alcMaxDays']} />
                <ErrorsField />
                <SubmitField />
            </AutoForm>
        </Breakpoints.Desktop>

        <Breakpoints.TabletOrMobile>
            <Accordion
                defaultActiveKey={['logout']}
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
                <Accordion.Panel key='logout' header='System'>
                    <Wrapper>
                        <LogoutButton />
                    </Wrapper>
                </Accordion.Panel>
            </Accordion>
        </Breakpoints.TabletOrMobile>

    </Spin>
}
