
import EventEmitter from 'events'
import Simplex from 'fast-simplex-noise'

import CONSTANTS from './constants'
import Renderer from './renderer'
import Gui from './gui'
import Sampler from './sampler'
import HeightMap from './heightMap'
import MapRender from './mapRender'

import { lerpSize, Point, Vector2, max, min } from './util'

const renderer = new Renderer()
const sampler = new Sampler( renderer.ctx )
const mapRender = new MapRender()

const simplex = new Simplex({
    min: 0,
    max: 1,
    octaves: 4,
    frequency: .01,
    persistence: .5,
    amplitude: 1
})

const events = new EventEmitter()
events.on( 'update', render )



let count = 0
class Node {
    constructor( x, y, size, color ) {
        this.id = ++count
        this.pos = new Point( x, y )
        this.r = lerpSize( size )
        this.color = color || null
    }

    moveBy( point ) {
        // nodes.push( new Node(
        //     this.pos.x,
        //     this.pos.y,
        //     this.r / CONSTANTS.NODE.MAX_SIZE,
        //     'rgb( 120, 120, 120 )'
        //  ))

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

    // Calc interpolation from vector mag
    let rad = dest.r + node.r + ( CONSTANTS.NODE_SNAP_BUFFER + ( Math.random() * CONSTANTS.NODE_SNAP_VARIANCE ) )
    let perc = 1 - ( rad / vec2.magnitude() )

    node.moveBy( vec2.lerp( perc ) )
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

function createNode( options ) {
    let opts = options || {}

    // Skew size to favour smaller nodes
    let node = new Node( ...getRandomPosition(), Math.pow( Math.random(), CONSTANTS.NODE.SIZE_BIAS ) )

    // console.log( node.id, 'create pos', node.pos.x, node.pos.y )

    // Start again if the node overlaps a pre-existing node
    // @TODO should check this doesnt happen too often, a full area will
    // cause this to loop
    if ( checkOverlap( node ) ) {
        return createNode()
    }

    // Position it
    if ( nodes.length && !opts.float ) {
        let dest = findClosest( node )

        attractNode( node, dest )
    }

    // console.log( node.id, 'final pos', node.pos.x, node.pos.y )

    // Add to global array and render
    nodes.push( node )
    render()

    return node
}


/**
 * Create a number of nodes, with a little delay just for visuals
 */
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

/**
 * Creates a few nodes to act as a seed
 */
function seedMap() {
    let i = CONSTANTS.SEED.NUM
    while( i-- > 0 ) {
        createNode({
            float: true
        })
    }
}


let createParams = {
    num: 100,
    sampleSize: 4
}

const gui = new Gui( createParams )
gui.register( 'Create', createNode )
gui.register( 'Create Nodes', () => {
    createNodes( createParams.num )
})
gui.register( 'Sample', () => {
    sampler.sample( Math.pow( 2, createParams.sampleSize ) )
    sampler.render()
    // renderer.canvas.style.opacity = '.25'
    renderer.canvas.style.display = 'none'
})
gui.register( 'Add Noise', () => {
    let map = new HeightMap({
        width: sampler.mapWidth,
        height: sampler.mapHeight
    })
        .mutate2d( ( x, y ) => {
            return sampler.map[ x + y * sampler.mapWidth ]
        })
        .neutralize()
        // .mutate2d( function( x, y ) {
        //     return 1 - this.getValue( x, y )
        // })
        .expand( Math.pow( 2, createParams.sampleSize ) )
        .mutate2d( function( x, y ) {
            return ( this.getValue( x, y ) * simplex.get2DNoise( x, y ) )
        })

    window.map = map

    let Render = new MapRender()
    Render.render( map )
})
gui.register( 'multipass', () => {
    let maps = []
    console.log( sampler.mapWidth )
    let sampleMap = new HeightMap({
        width: sampler.mapWidth,
        height: sampler.mapHeight
    })
        .mutate2d( ( x, y ) => {
            // return 255 - sampler.map[ x + y * sampler.mapWidth ]
            return sampler.map[ x + y * sampler.mapWidth ]
        })
        .neutralize()
        .expand( Math.pow( 2, createParams.sampleSize ) )
    maps.push({
        weight: 5,
        map: sampleMap
    })
    // for ( let i = 1; i <= 1 + createParams.sampleSize; i++ ) {
    for ( let i = 1; i <= 1 + 1; i++ ) {
        let simplex = new Simplex({
            min: 0,
            max: 1,
            octaves: 4,
            frequency: .005 + ( i * .005 ),
            persistence: .2,
            amplitude: 1 * ( 1 / i )
        })
        let map = new HeightMap({
            width: CONSTANTS.WIDTH,
            height: CONSTANTS.HEIGHT
        }).mutate2d( ( x, y ) => {
            return simplex.get2DNoise( x, y )
        })
        maps.push({
            weight: i,
            map: map
        })
    }
    let map = new HeightMap({
        width: CONSTANTS.WIDTH,
        height: CONSTANTS.HEIGHT
    }).multiPass( maps )

    let Render = new MapRender()
    Render.render( map )
})


// Kickstart initial generation
seedMap()
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
window.max = max
window.min = min

window.sampler = sampler
window.HeightMap = HeightMap
