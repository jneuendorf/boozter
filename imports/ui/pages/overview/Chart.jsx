import React from 'react'
import { Empty } from 'antd'
import { Line } from '@ant-design/charts'
import memoize from 'lodash.memoize'


const STATIC_CHART_PROPS = {
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

const getAnnotations = memoize(annotationValue => [{
    type: 'line',
    start: ['min', annotationValue],
    end: ['max', annotationValue],
    style: {
        stroke: '#F4664A',
        // lineDash : [2 , 2],
    },
}])


export const Chart = ({ data=[], annotationValue, ...props }) => (
    data.length >= 2
        ? <Line
            {...STATIC_CHART_PROPS}
            {...props}
            data={data}
            annotations={getAnnotations(annotationValue)}
        />
        : <Empty
            description='Insufficient data'
            image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
)
