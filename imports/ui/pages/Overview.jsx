import React from 'react'
import { Link } from 'react-router-dom'
import {
    Layout,
    Row,
    Col,
    Divider,
    Typography,
    Button,
} from 'antd'
import { Line } from '@ant-design/charts'
import {
    BarsOutlined,
    // <DatabaseOutlined />
    SettingOutlined,
    PlusOutlined,
    // <UserOutlined />
    // <BarsOutlined />
    // two tone
    SmileTwoTone,
    MehTwoTone,
    FrownTwoTone,
} from '@ant-design/icons'

import * as Routes from '../routes'


const { Header, Footer, Sider, Content } = Layout
const { Title } = Typography

const data = [
    { year: '1991', value: 3 },
    { year: '1992', value: 4 },
    { year: '1993', value: 3.5 },
    { year: '1994', value: 5 },
    { year: '1995', value: 4.9 },
    { year: '1996', value: 6 },
    { year: '1997', value: 7 },
    { year: '1998', value: 9 },
    { year: '1999', value: 13 },
]
const config = {
    data,
    // width: 400,
    // height: 100,
    autoFit: true,
    padding: [15, 0, 0, 0],
    xAxis: false,
    xField: 'year',
    yAxis: false,
    yField: 'value',
    smooth: true,
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

// 😁😄🙂😕🥴🤮😵
const Emoji = (props) => (
    <Title style={{textAlign: 'center'}}>
        {/* 😁 */}
        <SmileTwoTone twoToneColor='#52c41a' style={{fontSize: '200px'}} />
    </Title>
)


export const Overview = (props) => <Layout>
    {/* <Header /> */}
    {/* <Statistic /> */}
    <Content style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>
        <Button onClick={() => Meteor.logout()}>logout</Button>
        <Row style={{height: '100px'}}>
            <Col span={24}>
                <Line {...config} />
            </Col>
        </Row>
        <Divider />
        <Row style={{flex: 1}}>
            <Col span={24}>
                <Emoji />
            </Col>
        </Row>
        <Row style={{height: '100px'}}>
            <Col span={8} style={{backgroundColor: 'red'}}>
                <Link to={Routes.HISTORY}>
                    <BarsOutlined />
                    {/* <Button
                        icon={<BarsOutlined />}
                        onClick={event => console.log('LIST')}
                    /> */}
                </Link>
            </Col>
            <Col span={8} style={{backgroundColor: 'yellow'}}>
                <Link to={Routes.SETTINGS}>
                    <SettingOutlined />
                </Link>
                {/* <Button
                    icon={<SettingOutlined />}
                    onClick={event => console.log('SETTINGS')}
                /> */}
            </Col>
            <Col span={8} style={{backgroundColor: 'green'}}>
                <Link to={Routes.ADD_DRINK}>
                    <PlusOutlined />
                </Link>
                {/* <Button
                    icon={<PlusOutlined />}
                    onClick={event => console.log('ADD')}
                /> */}
            </Col>
        </Row>
    </Content>
</Layout>
