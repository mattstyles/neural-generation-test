
import CONSTANTS from './constants'

export default class MapRender {
    constructor() {
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
        canvas.style.zIndex = 20
        document.body.appendChild( canvas )
    }

    // Greyscale
    // 0 <= col <= 1
    renderColor( col ) {
        // Tranform to 0...255
        let color = col * 0xff
        return 'rgb( ' + color + ',' + color + ',' + color + ')'
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
