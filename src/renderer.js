
import CONSTANTS from './constants'

const canvas = document.createElement( 'canvas' )
const ctx = canvas.getContext( '2d' )
canvas.setAttribute( 'width', CONSTANTS.WIDTH )
canvas.setAttribute( 'height', CONSTANTS.HEIGHT )
Object.keys( CONSTANTS.STYLE ).forEach( style => {
    canvas.style[ style ] = CONSTANTS.STYLE[ style ]
})
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
const s = CONSTANTS.NODE_START_COLOUR
const e = CONSTANTS.NODE_END_COLOUR

function lerpColor( value ) {
    return [ 'r', 'g', 'b' ].reduce( ( prev, curr ) => {
        prev[ curr ] = ~~( s[ curr ] + ( ( e[ curr ] - s[ curr ] ) * value ) )
        return prev
    }, {} )
}


export default class Renderer {
    constructor() {
        this.clear()

        ctx.font = '11px "dejavu sans mono"'
    }

    getColor( value ) {
        let color = lerpColor( value )
        return ' rgb(' + Object.keys( color ).map( key => color[ key ] ).join( ',' ) + ')'
    }

    clear() {
        ctx.clearRect( 0, 0, CONSTANTS.WIDTH, CONSTANTS.HEIGHT )
    }

    renderNode = ( node ) => {
        ctx.fillStyle = node.color || this.getColor( node.r / CONSTANTS.NODE.MAX_SIZE )

        ctx.beginPath()
        ctx.arc( node.pos.x, node.pos.y, node.r, 0, TWO_PI, false )
        ctx.fill()

        // ctx.fillStyle = '#000'
        // ctx.fillText( node.id, node.pos.x - 4, node.pos.y + 3 )
    }

}
