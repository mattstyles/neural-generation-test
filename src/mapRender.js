
import CONSTANTS from './constants'

export default class MapRender {
    constructor() {

        // New canvas
        const canvas = document.createElement( 'canvas' )
        this.ctx = canvas.getContext( '2d' )
        canvas.setAttribute( 'id', 'render' )
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
        col = col > 1 ? 1 : col
        let color = ~~( col * 0xff )
        return 'rgb( ' + color + ',' + color + ',' + color + ')'
    }

    render( map ) {
        this.ctx.clearRect( 0, 0, CONSTANTS.WIDTH, CONSTANTS.HEIGHT )

        let pixelWidth = CONSTANTS.WIDTH / map.width
        let pixelHeight = CONSTANTS.HEIGHT / map.height

        for( let y = 0; y < map.height; y++ ) {
            for( let x = 0; x < map.width; x++ ) {
                this.ctx.fillStyle = this.renderColor( map.getValue( x, y ) )
                this.ctx.fillRect( x * pixelWidth, y * pixelHeight, pixelWidth, pixelHeight )
            }
        }
    }

}
