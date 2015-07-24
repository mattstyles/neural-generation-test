
import dat from 'dat-gui'
import EventEmitter from 'events'

export default class Gui extends EventEmitter {
    constructor( props ) {
        super()

        this.props = props
        this.gui = new dat.GUI()
    }

    register( name, fn ) {
        let func = {}
        func[ name ] = fn
        this.gui.add( func, name )
    }

    onChange = () => {
        this.emit( 'change' )
    }

}
