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


export class Point {
    constructor( x, y ) {
        this.x = x
        this.y = y
    }
}


export class Vector2 {
    constructor( src, dest ) {
        this.x = dest.pos.x - src.pos.x
        this.y = dest.pos.y - src.pos.y
    }

    normalize() {
        let r = Math.max( this.x, this.y )
        this.x *= r
        this.y *= r
    }

    lerp( value ) {
        return new Point( this.x * value, this.y * value )
    }

    magnitude() {
        return Math.sqrt( Math.pow( this.x, 2 ) + Math.pow( this.y, 2 ) )
    }
}
