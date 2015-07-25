
const CONSTANTS = {
    // WIDTH: window.innerWidth * window.devicePixelRatio,
    // HEIGHT: window.innerHeight * window.devicePixelRatio,
    WIDTH: 640,
    HEIGHT: 640,
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
        MAX_SIZE: 16,
        // 1 is linear, 2 is quadratic (thus favouring smaller sizes)
        SIZE_BIAS: 1.2
    },

    // number of nodes to create
    NUM_NODES: 160,

    // delay between creating nodes
    NODE_CREATE_DELAY: 1,

    // a little buffer when the nodes snap to central structure
    NODE_SNAP_BUFFER: 2,
    NODE_SNAP_VARIANCE: 8,

    // large nodes
    NODE_END_COLOUR: {
        r: 120,
        g: 120,
        b: 120
    },
    // small nodes
    NODE_START_COLOUR: {
        r: 212,
        g: 212,
        b: 212
    },

    // seed params
    SEED: {
        NUM: 2
    }
}


export default CONSTANTS
