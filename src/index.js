

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

function euclidean( node1, node2 ) {
    return Math.sqrt( Math.pow( node1.pos.x - node2.pos.x, 2 ) + Math.pow( node1.pos.y - node2.pos.y, 2 ) )
}

function manhattan( node1, node2 ) {
    return Math.abs( node1.pos.x - node2.pos.x ) + Math.abs( node1.pos.y - node2.pos.y )
}

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

function attractNode( node, dest ) {

    let vec2 = new Vector2( node, dest )

    node.moveBy( vec2.lerp( .8 ) )
}

function createNode() {
    // Skew size to favour smaller nodes
    let node = new Node( ...getRandomPosition(), Math.pow( Math.random(), 1.6 ) )

    // Position it
    if ( nodes.length ) {
        let dest = findClosest( node )

        attractNode( node, dest )
    }

    // Add to global array and render
    nodes.push( node )
    render()

    return node
}




const gui = new Gui()
gui.register( 'Create', () => {
    console.log( createNode() )
})
gui.register( 'Find Closest', () => {
    let node = nodes[ nodes.length - 1 ]
    console.log( findClosest( node ) )
})


window.r = renderer
window.Vector2 = Vector2
window.nodes = nodes
window.render = render
window.createNode = createNode
window.findClosest = findClosest
window.euclidean = euclidean
window.manhattan = manhattan
