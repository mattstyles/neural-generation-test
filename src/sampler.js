
import CONSTANTS from './constants'
import { max, min } from './util'

function image1d( x, y ) {
    return ( x + ( y * CONSTANTS.WIDTH ) ) * 4
}
function image2d( i ) {
    var imageDataWidth = CONSTANTS.WIDTH * 4
    return {
        x: i % imageDataWidth,
        y: ~~( i / imageDataWidth )
    }
}

export default class Sampler {
    constructor( ctx ) {
        this.imageCtx = ctx

        this.map = []
        this.mapWidth = 0
        this.mapHeight = 0
        this.image = null

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

    _sampleBlock( x1, y1, x2, y2 ) {
        let count = 0
        let num = 0

        for ( let x = x1; x < x2; x++ ) {
            for ( let y = y1; y < y2; y++ ) {
                num++
                count += this.image.data[ image1d( x, y ) ]
            }
        }
        console.log( x1, y1, x2, y2, ~~( count / num ) )
        return ~~( count / num )
    }

    sample( blockSize ) {
        // Doing it like this is naughty, side-effects
        this.image = this.imageCtx.getImageData( 0, 0, CONSTANTS.WIDTH, CONSTANTS.HEIGHT )
        this.map = []
        this.mapWidth = CONSTANTS.WIDTH / blockSize
        this.mapHeight = CONSTANTS.HEIGHT / blockSize

        for ( let y = 0; y < CONSTANTS.WIDTH; y += blockSize ) {
            for ( let x = 0; x < CONSTANTS.HEIGHT; x += blockSize ) {
                this.map.push( this._sampleBlock(
                    x,
                    y,
                    x + blockSize,
                    y + blockSize
                ))
                // let pixel = this.imageCtx.getImageData( x, y, x + 1, y + 1 )
                // let count = 0
                // let num = 0
                // for( let i = 0; i < pixel.data.length; i += 4 ) {
                //     num++
                //     count += pixel.data[ i ]
                // }
                // this.map.push( ~~( count / num ) )
            }
        }

        // for ( let i = 0; i < this.image.data.length; i += 4 ) {
        //     // Aggregate all pixels in block
        //     // console.log( i )
        //     let tl = image2d( i )
        //     this.map.push( this._sampleBlock(
        //         tl.x,
        //         tl.y,
        //         tl.x + ( blockSize ),
        //         tl.y + ( blockSize )
        //     ))
        // }

        console.log( this.map )
        // console.log( 'min', min( this.map ) )
        // console.log( 'max', max( this.map ) )
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
                this.ctx.fillStyle = this.renderColor( this.map[ x + ( y * this.mapWidth ) ] )
                this.ctx.fillRect( x * pixelWidth, y * pixelHeight, pixelWidth, pixelHeight )
            }
        }
    }

}
