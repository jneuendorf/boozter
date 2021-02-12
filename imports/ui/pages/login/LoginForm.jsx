import * as React from 'react'
// import { useTracker } from 'meteor/react-meteor-data'
// import { Meteor } from 'meteor/meteor'
import { Form, Input, Button } from 'antd'

import * as Routes from '../../routes'


const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    }
}

export const LoginForm = (props) => {
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    // const history = useHistory()

    const onFinish = (values) => {
        console.log('Success:', values)
        console.log()
        Meteor.loginWithPassword(username, password)
        // history.push(Routes.HOME)
    }

    return <Form layout="horizontal" name="basic" onFinish={onFinish}>
        <Form.Item
            label="Username"
            name="username"
            rules={[{
                required: true,
                message: 'Please input your username!',
            }]}
        >
            <Input onChange={e => setUsername(e.target.value)} />
        </Form.Item>

        <Form.Item
            label="Password"
            name="password"
            rules={[{
                required: true,
                message: 'Please input your password!',
            }]}
        >
            <Input.Password onChange={e => setPassword(e.target.value)} />
        </Form.Item>

        <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
        </Form.Item>
    </Form>
}
