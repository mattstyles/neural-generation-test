
import { lerpSize } from './util'
import CONSTANTS from './constants'

const canvas = document.createElement( 'canvas' )
const ctx = canvas.getContext( '2d' )
canvas.setAttribute( 'width', CONSTANTS.WIDTH )
canvas.setAttribute( 'height', CONSTANTS.HEIGHT )
document.body.appendChild( canvas )

// const blue = 'rgb( 72, 72, 218 )'
// const cyan = 'rgb( 102, 241, 250 )'
// const red = 'rgb( 255, 35, 45 )'
// const brown = 'rgb( 155, 84, 10 )'
// const yellow = 'rgb( 235, 235, 77 )'
// const green = 'rgb( 77, 216, 18 )'
// const grey = 'rgb( 190, 190, 190 )'
// const white = 'rgb( 221, 224, 234 )'

const TWO_PI = 2 * Math.PI

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
        prev[ curr ] = ~~( s[ curr ] + ( ( e[ curr ] - s[ curr ] ) * value ) )
        return prev
    }, {} )
}


export default class Renderer {
    constructor() {
        ctx.clearRect( 0, 0, CONSTANTS.WIDTH, CONSTANTS.HEIGHT )
    }

    getColor( value ) {
        let color = lerpColor( value )
        return ' rgb(' + Object.keys( color ).map( key => color[ key ] ).join( ',' ) + ')'
    }

    renderNode( node ) {
        console.log( 'rendering node', node )
        ctx.fillStyle = this.getColor( node.r / CONSTANTS.NODE.MAX_SIZE )

        ctx.beginPath()
        ctx.arc( node.pos.x, node.pos.y, node.r, 0, TWO_PI, false )
        ctx.fill()
    }

}
