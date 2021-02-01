import React, { useCallback } from 'react'
import { useTracker } from 'meteor/react-meteor-data'
import { AutoFields, AutoForm, ErrorsField, SubmitField } from 'uniforms-antd'
import { Layout, Spin } from 'antd'

import {
    Settings as SettingsCollection,
    bridge as schema,
 } from '/imports/api/settings/collection'


const { Header, Footer, Sider, Content } = Layout


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
        // TODO: Use `model` for upsert
        (model) => {
            Meteor.call('settings.upsert', userId, model)
        },
        [userId],
    )

    console.log(settings)

    return <Layout>
        <h1>SETTINGS</h1>
        <Spin spinning={isLoading} tip='Loading...'>
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
        </Spin>
    </Layout>
}
