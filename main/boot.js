import config from './config.js'
import scene from './scene.js'
import state from './state.js'
import tween_0 from './tween-0.js'
import tween_1 from './tween-1.js'
import tween_2 from './tween-2.js'
import tween_3 from './tween-3.js'

const tween = [
    tween_0
  , tween_1
  , tween_2
  , tween_3
]


export function boot() {

    //// Draw the title-spritesheet.
    window.updateTitleSpritesheet( config.causes.map( cause => cause.title ) )

    //// Bind buttons to functions.
    document.querySelector('#restart-preview').addEventListener(
        'click', restartForPreview)
    document.querySelector('#recordpanel button').addEventListener(
        'mousedown', prepareCaptureui)

    ////
    scene.init()
    scene.render()
    restartForPreview()
}




//// Resets the scene state and zeros the timer.
function restart () {
    scene.clock.stop()
    tween[state.cause].reset()
    scene.clock.start() // reset `clock.elapsedTime` to zero

    //// Reset coin altitudes after the ‘drop’ animation.
    scene.coins.forEach( coin => {
        coin.currAlt = coin.origAlt
        const { hingeMesh, origLat, origLon, origAlt } = coin
        scene.updateHinge(hingeMesh, origLat, origLon, origAlt)
    })

}


//// Restarts the scene for development and previewing.
function restartForPreview (evt) {
    const { previewWidth, previewHeight, previewFps
      , pixelRatio } = config
    state.currDuration = config.causes[state.cause].previewDuration
    if ('preview' !== state.currMode) {
        state.currMode = 'preview'
        scene.copyPass.renderToScreen = true
        state.currFps = previewFps
        scene.renderer.setSize(previewWidth, previewHeight)
        scene.composer.setSize(previewWidth * pixelRatio, previewHeight * pixelRatio)
    }

    //// Reset audio.
    scene.$audio.src = `audio/causes-${state.cause}.mp3`
    scene.$audio.pause()
    scene.$audio.fastSeek(0)
    state.audio = 'stopped'

    restart()
}


//// Restarts the scene for capture.
function restartForCapture () {
    const { captureWidth, captureHeight, previewFps, captureFps
      , pixelRatio, showDuringCapture } = config
    state.currDuration = config.causes[state.cause].previewDuration * (previewFps / captureFps)
    if ('capture' !== state.currMode) {
        state.currMode = 'capture'
        scene.copyPass.renderToScreen = showDuringCapture
        state.currFps = captureFps
        scene.renderer.setSize(captureWidth, captureHeight)
        scene.composer.setSize(captureWidth * pixelRatio, captureHeight * pixelRatio)
    }
    restart()
}


////
function prepareCaptureui (e) {
    const captureui = scene.captureui
    restartForCapture()
    captureui.settings.framerate = config.captureFps
    captureui.settings.resolution = `${config.captureWidth}x${config.captureHeight}`
    captureui.settings.time = config.captureDuration / 1000 // convert ms to seconds
    const oldFilename = captureui.settings.filename
    captureui.settings.filename =
        oldFilename.split('.')[0] + '.' + captureui.settings.format
    document.querySelector('#cli-help').innerHTML =
        `mv $HOME/Downloads/'${captureui.settings.filename}' `
      + `'./${captureui.settings.filename}'; \n`
      + `./ffmpeg -i '${captureui.settings.filename}' `
      + `-r ${config.previewFps} -filter:v `
      + `"setpts=${config.captureFps / config.previewFps}*PTS" `
      + `'${oldFilename}-${config.previewFps}fps.${captureui.settings.format}'; \n`
      + `unlink '${captureui.settings.filename}'`
}
