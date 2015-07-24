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



let nodeSizeRange = CONSTANTS.NODE.MAX_SIZE - CONSTANTS.NODE.MIN_SIZE
export function lerpSize( value ) {
    return CONSTANTS.NODE.MIN_SIZE + value * nodeSizeRange
}
