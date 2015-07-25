
const CONSTANTS = {
    // WIDTH: window.innerWidth * window.devicePixelRatio,
    // HEIGHT: window.innerHeight * window.devicePixelRatio,
    WIDTH: 2048,
    HEIGHT: 2048,
    STYLE: {
        'transform': 'scale(' + ( 1 / window.devicePixelRatio ) + ')',
        'transformOrigin': 'top left',
        'position': 'absolute',
        'top': '0px',
        'left': '0px',
        'zIndex': '100'
    },

    NODE: {
        MIN_SIZE: 4,
        MAX_SIZE: 24,
        // 1 is linear, 2 is quadratic (thus favouring smaller sizes)
        SIZE_BIAS: 3.4
    },

    // number of nodes to create
    NUM_NODES: 800,

    // delay between creating nodes
    NODE_CREATE_DELAY: 1,

    // a little buffer when the nodes snap to central structure
    NODE_SNAP_BUFFER: 2,
    NODE_SNAP_VARIANCE: 8,

    // large nodes
    NODE_END_COLOUR: {
        r: 245,
        g: 245,
        b: 245
    },
    // small nodes
    NODE_START_COLOUR: {
        r: 212,
        g: 212,
        b: 212
    },

    // seed params
    SEED: {
        NUM: 4
    }
}


export default CONSTANTS
