

//import Gui from './gui'
import CONSTANTS from './constants'
import Renderer from './renderer'
import Gui from './gui'

import { lerpSize } from './util'

const renderer = new Renderer()

let count = 0

class Node {
    constructor( x, y, size ) {
        this.id = ++count
        this.pos = {}
        this.pos.x = x
        this.pos.y = y
        this.r = lerpSize( size )
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

function distance( node1, node2 ) {
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

        let dist = distance( node, curr )
        if ( dist < min ) {
            min = dist
            return curr
        }

        return prev
    }, nodes[ 0 ] )
}

function createNode() {
    // Skew size to favour smaller nodes
    let node = new Node( ...getRandomPosition(), Math.pow( Math.random(), 1.6 ) )

    // Position it

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
window.createNode = createNode
window.findClosest = findClosest
