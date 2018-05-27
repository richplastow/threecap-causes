//// CONFIGURATION AND CONSTANTS

const

    //// Dimensions, framerate, duration.
    previewWidth = 854
  , previewHeight = 480
  , previewFps = 25
  , previewDuration = 8000 // in ms

  , captureWidth = 1920
  , captureHeight = 1080
  , captureFps = 1
  , captureDuration = previewDuration * (previewFps / captureFps)

    //// Whether to render the animation during capture.
  , showDuringCapture = false

  , titleOpacityBeginEnd = 0.99
  , titleOpacityFlying = 0.01

  , cameraAlt = 110
  , lookAtAlt = cameraAlt - 5
  , titleAlt = 112
  , titleAngleZ = 0.1 // make title face camera
  , titleSpread = 8 // how many would fit round the globe

  , causes = [
        {
            title: 'Shoddy Journalism'
          , previewDuration: 5000 // in ms
        }
      , {
            title: 'Cheap Flights'
          , previewDuration: 3000 // in ms
        }
      , {
            title: 'Cruise Ships'
          , previewDuration: 8000 // in ms
        }
      , {
            title: 'Holiday Apartments'
          , previewDuration: 2000 // in ms
        }
      , {
            title: 'Demographics'
          , previewDuration: 4000 // in ms
        }
      , {
            title: '(After Demographics)'
          , previewDuration: 2000 // in ms
        }
    ]


//// Fill in causes `captureDuration`s
causes.forEach( (cause,i) => {
    cause.captureDuration = cause.previewDuration * (previewFps / captureFps)
    cause.startLat = -40 + (i     * 360 / titleSpread)
    cause.endLat   = -40 + ((i+1) * 360 / titleSpread)
})


let module; export default module = {

    //// Dimensions, framerate, duration.
    previewDuration
  , previewWidth
  , previewHeight
  , previewFps

  , captureWidth
  , captureHeight
  , captureFps
  , captureDuration
  , pixelRatio: window.devicePixelRatio || 0

    //// Whether to render the animation during capture.
  , showDuringCapture

  , titleOpacityBeginEnd
  , titleOpacityFlying

  , cameraAlt
  , lookAtAlt
  , titleAlt
  , titleAngleZ
  , titleSpread

  , causes
}
