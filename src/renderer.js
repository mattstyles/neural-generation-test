
import { to1d } from './util'
import CONSTANTS from './constants'

const canvas = document.createElement( 'canvas' )
const ctx = canvas.getContext( '2d' )
canvas.setAttribute( 'width', CONSTANTS.WIDTH )
canvas.setAttribute( 'height', CONSTANTS.HEIGHT )
document.body.appendChild( canvas )

const blue = 'rgb( 72, 72, 218 )'
const cyan = 'rgb( 102, 241, 250 )'
const red = 'rgb( 255, 35, 45 )'
const brown = 'rgb( 155, 84, 10 )'
const yellow = 'rgb( 235, 235, 77 )'
const green = 'rgb( 77, 216, 18 )'
const grey = 'rgb( 190, 190, 190 )'
const white = 'rgb( 221, 224, 234 )'


const s = {
    r: 253,
    g: 227,
    b: 167
}

const e = {
    r: 211,
    g: 84,
    b: 0
}

function lerpColor( value ) {
    return [ 'r', 'g', 'b' ].reduce( ( prev, curr ) => {
        prev.r = s[ curr ] + ( ( s[ curr ] - e[ curr ] ) * value )
        return prev
    }, {} )
}

window.lerpColor = lerpColor


export default class Renderer {
    constructor( opts ) {
        ctx.clearRect( 0, 0, CONSTANTS.WIDTH, CONSTANTS.HEIGHT )
    }

    getColor( value ) {
        let color = Object.keys( lerpColor( value ) ).map( key => this[ key ] )
        return ' rgb( ' + color.join( ',' ) + ')'
    }

    renderNode( node ) {


    }

}
