

//import Gui from './gui'
import CONSTANTS from './constants'
import Renderer from './renderer'

import { lerpSize } from './util'

const renderer = new Renderer()


class Node {
    constructor( x, y, size ) {
        this.pos = {}
        this.pos.x = x
        this.pos.y = y
        this.r = lerpSize( size )
    }
}

let nodes = []

function getRandomPosition() {
    return [
        Math.random() * CONSTANTS.WIDTH,
        Math.random() * CONSTANTS.HEIGHT
    ]
}

function distance( node1, node2 ) {
    return Math.abs( node1.pos.x - node2.pos.x ) + Math.abs( node1.pos.y - node2.pos.y )
}

function findClosest( node ) {
    if ( !nodes.length ) {
        throw new Error( 'nodes list empty' )
    }

    let min = 0

    return nodes.reduce( ( prev, curr ) => {
        return distance( node, curr ) > min ? prev : curr
    })
}

function createNode() {
    // Skew size to favour smaller nodes
    let node = new Node( ...getRandomPosition(), Math.pow( Math.random(), 1.6 ) )

    // Position it
    nodes.push( node )
    renderer.renderNode( node )

    return node
}









window.r = renderer
window.createNode = createNode
window.findClosest = findClosest
