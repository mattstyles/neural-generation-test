

//import Gui from './gui'
import CONSTANTS from './constants'
import Renderer from './renderer'
import Gui from './gui'
import EventEmitter from 'events'

import { lerpSize } from './util'

const renderer = new Renderer()


const events = new EventEmitter()
events.on( 'update', render )

class Point {
    constructor( x, y ) {
        this.x = x
        this.y = y
    }
}

let count = 0
class Node {
    constructor( x, y, size ) {
        this.id = ++count
        this.pos = new Point( x, y )
        this.r = lerpSize( size )
    }

    moveBy( point ) {
        this.pos.x += point.x
        this.pos.y += point.y

        events.emit( 'update' )
    }

    fakeAdd( point ) {
        let x = this.pos.x
        let y = this.pos.y
        return {
            pos: {
                x: x + point.x,
                y: y + point.y
            }
        }
    }
}



class Vector2 {
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
}

let nodes = []


function render() {
    renderer.clear()
    nodes.forEach( renderer.renderNode )
}

function getRandomPosition() {
    return [
        Math.random() * CONSTANTS.WIDTH,
        Math.random() * CONSTANTS.HEIGHT
    ]
}

// Squaring and rooting is fairly expensive
function euclidean( node1, node2 ) {
    return Math.sqrt( Math.pow( node1.pos.x - node2.pos.x, 2 ) + Math.pow( node1.pos.y - node2.pos.y, 2 ) )
}

// Quick, struggles with diagonals, will give false results
function manhattan( node1, node2 ) {
    return Math.abs( node1.pos.x - node2.pos.x ) + Math.abs( node1.pos.y - node2.pos.y )
}

/**
 * Uses a quick check against every other node
 * A little expensive
 */
function findClosest( node ) {
    if ( !nodes.length ) {
        throw new Error( 'nodes list empty' )
    }

    let min = 1e8

    return nodes.reduce( ( prev, curr ) => {
        // Dont return yourself
        if ( node.id === curr.id ) {
            return prev
        }

        let dist = manhattan( node, curr )
        if ( dist < min ) {
            min = dist
            return curr
        }

        return prev
    }, nodes[ 0 ] )
}

/**
 * Brute forces to find a distance close to the target node
 * Fairly expensive
 */
function attractNode( node, dest ) {

    let vec2 = new Vector2( node, dest )

    // Brute force the interpolation required to get outside the radius
    // This is pretty expensive
    let val = 1
    let l = vec2.lerp( val )
    let newPos = node.fakeAdd( l )
    while( euclidean( newPos, dest ) < dest.r + node.r + CONSTANTS.NODE_SNAP_BUFFER ) {
        val -= 0.05

        l = vec2.lerp( val )
        newPos = node.fakeAdd( l )
    }

    node.moveBy( vec2.lerp( val ) )
}

/**
 * Checks this nodes distance from every other node
 * expensive
 */
function checkOverlap( node ) {
    let overlap = false
    let i = nodes.length - 1
    let src = nodes[ i ]

    while( i >= 0 ) {
        src = nodes[ i ]

        if ( euclidean( node, src ) < node.r + src.r + CONSTANTS.NODE_SNAP_BUFFER ) {
            overlap = true
            break
        }

        i--
    }

    return overlap
}

function createNode() {
    // Skew size to favour smaller nodes
    let node = new Node( ...getRandomPosition(), Math.pow( Math.random(), 1.6 ) )

    // console.log( node.id, 'create pos', node.pos.x, node.pos.y )

    // Start again if the node overlaps a pre-existing node
    // @TODO should check this doesnt happen too often, a full area will
    // cause this to loop
    if ( checkOverlap( node ) ) {
        console.log( 'recreating' )
        return createNode()
    }

    // Position it
    if ( nodes.length ) {
        let dest = findClosest( node )

        attractNode( node, dest )
    }

    // console.log( node.id, 'final pos', node.pos.x, node.pos.y )

    // Add to global array and render
    nodes.push( node )
    render()

    return node
}




const gui = new Gui()
gui.register( 'Create', createNode )
gui.register( 'Find Closest', () => {
    let node = nodes[ nodes.length - 1 ]
    console.log( findClosest( node ) )
})


function createNodes( num ) {

    function create() {
        num--
        createNode()

        if ( num > 0 ) {
            setTimeout( create, CONSTANTS.NODE_CREATE_DELAY )
        }
    }

    create()
}

createNodes( CONSTANTS.NUM_NODES )

window.r = renderer
window.Vector2 = Vector2
window.nodes = nodes
window.render = render
window.createNode = createNode
window.createNodes = createNodes
window.findClosest = findClosest
window.euclidean = euclidean
window.manhattan = manhattan
