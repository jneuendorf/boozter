import { useMediaQuery } from 'react-responsive'


const MOBILE_MAX = 768
const TABLET_MAX = 992


export const Desktop = ({ children }) => {
    return useMediaQuery({ minWidth: TABLET_MAX }) && children
}


export const TabletOrMobile = ({ children }) => {
    return useMediaQuery({ maxWidth: TABLET_MAX - 1 }) && children
}


export const Tablet = ({ children }) => {
    return useMediaQuery({ minWidth: MOBILE_MAX, maxWidth: TABLET_MAX - 1 }) && children
}


export const Mobile = ({ children }) => {
    return useMediaQuery({ maxWidth: MOBILE_MAX - 1 }) && children
}