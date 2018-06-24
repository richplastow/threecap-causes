//// TWEEN
import config from './config.js'
import scene from './scene.js'
import state from './state.js'


const tweenDefs = [

    { // camera position’s altitude
        beginState: { alt:config.cameraAlt }
      , currState:  { }
      , endState:   { alt:config.cameraAlt }
      , beginFrac:  0.0
      , endFrac:    1.0
      , tween:      null
      , easing:     TWEEN.Easing.Cubic.InOut
      , onReset:    function (def) {

            //// Hide all titles except the ones we need for this run.
            scene.titleMeshes.forEach( mesh => {
                mesh.visible = state.cause === mesh.causeIndex
            })
            scene.cutoutMeshes.forEach( mesh => {
                mesh.visible = state.cause === mesh.causeIndex
            })

            //// Set camera-pause positions, depending on current cause.
            const
                cause    = config.causes[state.cause]
              , start    = cause.camStartLon
              , seeTitle = cause.titleLon - 40
              , pause    = cause.titleLon + 40
              , conclude = cause.camEndLon - 100
              , end      = cause.camEndLon

            tweenDefs[1].beginState.lon = config.stick || start
            tweenDefs[1].endState.lon   = config.stick || seeTitle
            tweenDefs[2].beginState.lon = config.stick || seeTitle
            tweenDefs[2].endState.lon   = config.stick || pause
            tweenDefs[3].beginState.lon = config.stick || pause
            tweenDefs[3].endState.lon   = config.stick || conclude
            tweenDefs[4].beginState.lon = config.stick || conclude
            tweenDefs[4].endState.lon   = config.stick || end

            state.cameraCurrent.position.lat = tweenDefs[1].beginState.lat
            state.cameraCurrent.position.lon = tweenDefs[1].beginState.lon
            state.cameraCurrent.position.alt = tweenDefs[0].beginState.alt

            updateCamera(
                scene.camera
              , state.cameraCurrent.position.lat
              , state.cameraCurrent.position.lon
              , state.cameraCurrent.position.alt
              , state.cameraCurrent.position.lat      // lookAtLat
              , state.cameraCurrent.position.lon + 10 // lookAtLon
              , config.lookAtAlt                      // lookAtAlt
            )
        }
      , onUpdate:   function (def) { return function () {
            state.cameraCurrent.position.alt = def.currState.alt
        } }
    }
  , { // camera position’s latitude and longitude START -> TITLE
        beginState: { lat:0, lon:null } // `lon` set in `tweenDefs[0].onReset()`
      , currState:  {}
      , endState:   { lat:0, lon:null } // `lon` set in `tweenDefs[0].onReset()`
      , beginFrac:  0.0 // fraction of whole duration, so `0`...
      , endFrac:    0.1 // ...`1` fills the entire sequence
      , tween:      null
      , easing:     TWEEN.Easing.Cubic.Out
      , onReset:    function (def) {}
      , onUpdate:   function (def) { return function () {
            const camPos = state.cameraCurrent.position
            camPos.lat = def.currState.lat
            camPos.lon = def.currState.lon
            updateCamera(scene.camera, camPos.lat, camPos.lon, camPos.alt)
        } }
    }
  , { // camera position’s latitude and longitude TITLE -> PAUSE
        beginState: { lat:0, lon:null } // `lon` set in `tweenDefs[0].onReset()`
      , currState:  {}
      , endState:   { lat:0, lon:null } // `lon` set in `tweenDefs[0].onReset()`
      , beginFrac:  0.1
      , endFrac:    0.35
      , tween:      null
      , easing:     TWEEN.Easing.Quadratic.InOut
      , onReset:    function (def) {}
      , onUpdate:   function (def) { return function () {

            //// Start the audio, if it’s not playing
            if ('playing' !== state.audio) {
                state.audio = 'playing'
                scene.$audio.play(0)
            }

            const camPos = state.cameraCurrent.position
            camPos.lat = def.currState.lat
            camPos.lon = def.currState.lon
            updateCamera(scene.camera, camPos.lat, camPos.lon, camPos.alt)
        } }
    }
  , { // camera position’s latitude and longitude PAUSE -> CONCLUDE
        beginState: { lat:0, lon:null } // `lon` set in `tweenDefs[0].onReset()`
      , currState:  {}
      , endState:   { lat:0, lon:null } // `lon` set in `tweenDefs[0].onReset()`
      , beginFrac:  0.35
      , endFrac:    0.6
      , tween:      null
      , easing:     TWEEN.Easing.Quadratic.InOut
      , onReset:    function (def) {}
      , onUpdate:   function (def) { return function () {
            const camPos = state.cameraCurrent.position
            camPos.lat = def.currState.lat
            camPos.lon = def.currState.lon
            updateCamera(scene.camera, camPos.lat, camPos.lon, camPos.alt)
        } }
    }
  , { // camera position’s latitude and longitude CONCLUDE -> END
        beginState: { lat:0, lon:null } // `lon` set in `tweenDefs[0].onReset()`
      , currState:  {}
      , endState:   { lat:0, lon:null } // `lon` set in `tweenDefs[0].onReset()`
      , beginFrac:  0.6
      , endFrac:    1.0
      , tween:      null
      , easing:     TWEEN.Easing.Cubic.In
      , onReset:    function (def) {}
      , onUpdate:   function (def) { return function () {
            const camPos = state.cameraCurrent.position
            camPos.lat = def.currState.lat
            camPos.lon = def.currState.lon
            updateCamera(scene.camera, camPos.lat, camPos.lon, camPos.alt)
        } }
    }

]




let module; export default module = {

    //// Delete all existing tweens, and create a fresh new set.
    reset () {

        //// Stop and remove all tweens.
        tweenDefs.forEach( def => { if (def.tween) def.tween.stop() })
        TWEEN.removeAll()

        ////
        for (let i=0; i<tweenDefs.length; i++) {
            const def = tweenDefs[i]
            def.onReset(def)
            def.currState = Object.assign({}, def.beginState)
            def.tween =
                new TWEEN.Tween(def.currState)
                   .to(def.endState, (def.endFrac-def.beginFrac) * state.currDuration)
                   .easing(def.easing)
                   .onUpdate( def.onUpdate(def) )
                   .start(def.beginFrac * state.currDuration)
        }
    }

}




function llaToXyz (lat, lon, alt) {
    const
        cosLat = Math.cos(lat * Math.PI / 180)
      , sinLat = Math.sin(lat * Math.PI / 180)
      , cosLon = Math.cos(lon * Math.PI / 180)
      , sinLon = Math.sin(lon * Math.PI / 180)
      , x = alt * cosLat * cosLon
      , y = alt * cosLat * sinLon
      , z = alt * sinLat
    return {
        x: x
      , y: z  // for correct THREE.js coords, swap y with z...
      , z: -y // ...and z with negative y
    }
}


function updateCamera (
    camera
  , posLat, posLon, posAlt
) {
    const
        posLonMod = posLon + config.camLonOffset
      , pos       = llaToXyz(posLat, posLonMod, posAlt)
      , lookAt    = llaToXyz(posLat, posLonMod + 10, config.lookAtAlt)
      , up        = llaToXyz(posLat, posLonMod, posAlt + 10)
    camera.position.set(pos.x, pos.y, pos.z)
    camera.lookAt(lookAt.x, lookAt.y, lookAt.z)
    camera.up.set(up.x, up.y, up.z)
}


// function lookAtPositionUsingLla (object3d, lat, lon, alt) {
//     const cosLat = Math.cos(lat * Math.PI / 180)
//     const sinLat = Math.sin(lat * Math.PI / 180)
//     const cosLon = Math.cos(lon * Math.PI / 180)
//     const sinLon = Math.sin(lon * Math.PI / 180)
//     const x = alt * cosLat * cosLon
//     const y = alt * cosLat * sinLon
//     const z = alt * sinLat
//     object3d.lookAt(x, z, -y)
// }
