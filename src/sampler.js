
import CONSTANTS from './constants'
import { to1d, max, min } from './util'

// function to1d( x, y ) {
//     return x + ( y * CONSTANTS.WIDTH ) * 4
// }

export default class Sampler {
    constructor( ctx ) {
        this.imageCtx = ctx

        this.map = []
        this.mapWidth = 0
        this.mapHeight = 0

        // New canvas
        const canvas = document.createElement( 'canvas' )
        this.ctx = canvas.getContext( '2d' )
        canvas.setAttribute( 'id', 'grid' )
        canvas.setAttribute( 'width', CONSTANTS.WIDTH )
        canvas.setAttribute( 'height', CONSTANTS.HEIGHT )
        Object.keys( CONSTANTS.STYLE ).forEach( style => {
            canvas.style[ style ] = CONSTANTS.STYLE[ style ]
        })
        canvas.style.zIndex = 10
        document.body.appendChild( canvas )
    }

    sample( blockSize ) {
        let image = this.imageCtx.getImageData( 0, 0, CONSTANTS.WIDTH, CONSTANTS.HEIGHT )
        this.map = []
        this.mapWidth = CONSTANTS.WIDTH / blockSize
        this.mapHeight = CONSTANTS.HEIGHT / blockSize

        for ( let i = 0; i < image.data.length; i += 4 + ( blockSize * 4 ) ) {
            // This will push the red component, but its grayscale as we just need brightness
            this.map.push( image.data[ i ] )
        }

        console.log( this.map )
        console.log( 'min', min( this.map ) )
        console.log( 'max', max( this.map ) )
    }

    // Greyscale
    renderColor( col ) {
        return 'rgb( ' + col + ',' + col + ',' + col + ')'
    }

    render() {
        this.ctx.clearRect( 0, 0, CONSTANTS.WIDTH, CONSTANTS.HEIGHT )

        let pixelWidth = CONSTANTS.WIDTH / this.mapWidth
        let pixelHeight = CONSTANTS.HEIGHT / this.mapHeight

        for( let y = 0; y < this.mapHeight; y++ ) {
            for( let x = 0; x < this.mapWidth; x++ ) {
                this.ctx.fillStyle = this.renderColor( this.map[ to1d( x, y ) ] )
                this.ctx.fillRect( x * pixelWidth, y * pixelHeight, pixelWidth, pixelHeight )
            }
        }
    }

}
