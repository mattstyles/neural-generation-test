
const CONSTANTS = {
    WIDTH: window.innerWidth * window.devicePixelRatio,
    HEIGHT: window.innerHeight * window.devicePixelRatio,
    STYLE: {
        'transform': 'scale(' + ( 1 / window.devicePixelRatio ) + ')',
        'transformOrigin': 'top left'
    },

    NODE: {
        MIN_SIZE: 4,
        MAX_SIZE: 16,
        // 1 is linear, 2 is quadratic (thus greatly favouring smaller sizes)
        SIZE_BIAS: 4.8
    },

    // number of nodes to create
    NUM_NODES: 300,

    // delay between creating nodes
    NODE_CREATE_DELAY: 1,

    // a little buffer when the nodes snap to central structure
    NODE_SNAP_BUFFER: 2,

    NODE_END_COLOUR: {
        r: 217,
        g: 30,
        b: 24
    },
    NODE_START_COLOUR: {
        r: 224,
        g: 130,
        b: 131
    }
}


export default CONSTANTS
