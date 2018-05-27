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
            state.cameraCurrent.position.lat = tweenDefs[1].beginState.lat
            state.cameraCurrent.position.lon = tweenDefs[1].beginState.lon
            state.cameraCurrent.position.alt = tweenDefs[0].beginState.alt
            updateCamera(
                scene.camera
              , state.cameraCurrent.position.lat
              , state.cameraCurrent.position.lon
              , state.cameraCurrent.position.alt
              , state.cameraCurrent.position.lat + 10 // lookAtLat
              , state.cameraCurrent.position.lon      // lookAtLon
              , config.lookAtAlt                      // lookAtAlt
              , state.cameraCurrent.position.alt + 10 // upAlt
            )
        }
      , onUpdate:   function (def) { return function () {
            state.cameraCurrent.position.alt = def.currState.alt
        } }
    }
  , { // camera position’s latitude and longitude
        // beginState: { lat:-180, lon:45 }
        beginState: { lat:config.causes[state.cause].camStartLat, lon:0 }
      , currState:  {}
      // , endState:   { lat:180, lon:45 }
      , endState:   { lat:config.causes[state.cause].camEndLat, lon:0 }
      , beginFrac:  0.0 // fraction of whole duration, so `0`...
      , endFrac:    1.0 // ...`1` fills the entire sequence
      , tween:      null
      , easing:     TWEEN.Easing.Cubic.InOut
      , onReset:    function (def) {
            tweenDefs[1].beginState.lat = config.causes[state.cause].camStartLat
            tweenDefs[1].endState.lat   = config.causes[state.cause].camEndLat
        }
      , onUpdate:   function (def) { return function () {
            state.cameraCurrent.position.lat = def.currState.lat
            state.cameraCurrent.position.lon = def.currState.lon
            updateCamera(
                scene.camera
              , state.cameraCurrent.position.lat
              , state.cameraCurrent.position.lon
              , state.cameraCurrent.position.alt
              , state.cameraCurrent.position.lat + 10 // lookAtLat
              , state.cameraCurrent.position.lon      // lookAtLon
              , config.lookAtAlt                      // lookAtAlt
            )
        } }
    }
  , { // title opacity BEGIN
        beginState: { opacity:config.titleOpacityBeginEnd }
      , currState:  {}
      , endState:   { opacity:config.titleOpacityFlying }
      , beginFrac:  0.2
      , endFrac:    0.5
      , tween:      null
      , easing:     TWEEN.Easing.Cubic.Out
      , onReset:    function (def) {
            scene.titleMeshes.forEach( titleMesh => {
                titleMesh.material.opacity = def.beginState.opacity
            })
        }
      , onUpdate:   function (def) { return function () {
            scene.titleMeshes.forEach( titleMesh => {
                titleMesh.material.opacity = def.currState.opacity
            })
        } }
    }
  , { // title opacity END
        beginState: { opacity:config.titleOpacityFlying }
      , currState:  {}
      , endState:   { opacity:config.titleOpacityBeginEnd }
      , beginFrac:  0.5
      , endFrac:    0.8
      , tween:      null
      , easing:     TWEEN.Easing.Cubic.In
      , onReset:    function (def) {
        }
      , onUpdate:   function (def) { return function () {
            scene.titleMeshes.forEach( titleMesh => {
                titleMesh.material.opacity = def.currState.opacity
            })
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
  , lookAtLat, lookAtLon, lookAtAlt
) {
    const
        pos    = llaToXyz(posLat, posLon, posAlt)
      , lookAt = llaToXyz(lookAtLat, lookAtLon, lookAtAlt)
      , up     = llaToXyz(posLat, posLon, posAlt + 10)
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
