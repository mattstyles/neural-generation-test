import CONSTANTS from './constants'

export function to1d( x, y ) {
    return x + ( y * CONSTANTS.WIDTH )
}

export function max( map ) {
    return map.reduce( ( prev, curr ) => curr > prev ? curr : prev, 0 )
}

export function min( map ) {
    return map.reduce( ( prev, curr ) => curr < prev ? curr : prev, 0 )
}
