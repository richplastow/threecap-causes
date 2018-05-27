//// CONFIGURATION AND CONSTANTS

const

    //// Dimensions, framerate, duration.
    previewWidth = 854
  , previewHeight = 480
  , previewFps = 25
  , previewDuration = 7000 // in ms

  , captureWidth = 1920
  , captureHeight = 1080
  , captureFps = 1
  , captureDuration = previewDuration * (previewFps / captureFps)

    //// Whether to render the animation during capture.
  , showDuringCapture = false

  , titleOpacityBeginEnd = 0.99
  , titleOpacityFlying = 0.01

  , cameraAlt = 310
  , lookAtAlt = 100//cameraAlt - 5
  // , cameraAlt = 110
  // , lookAtAlt = cameraAlt - 5
  , showHinges = 1
  , titleAlt = 112
  , titleAngleZ = 0.1 // make title face camera
  , titleSpread = 6 // how many would fit round the globe

  , places = {
        earlyLeft:  { relLat: -250/titleSpread, lon:0, alt:100 }
      , earlyRight: { relLat: -200/titleSpread, lon:20, alt:100 }
    }

  , causes = [
        {
            title: 'Shoddy Journalism'
          , previewDuration: 5000 // in ms
        }
      , {
            title: 'Cheap Flights'
          , previewDuration: 3000 // in ms
          , cutouts: {
                // earlyLeft:  { size:10, src:'airport-11-512.png', relAlt:-3 } // Phili
                earlyRight: { size:10, src:'airport-9-512.png', relAlt:-1 } // Heathrow
            }
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
    ]


//// Fill in causes `captureDuration`s
causes.forEach( (cause,i) => {
    cause.captureDuration = cause.previewDuration * (previewFps / captureFps)
    cause.camStartLat = (i-0.6) * 360 / titleSpread
    cause.camEndLat   = (i+0.4) * 360 / titleSpread
    cause.startLat    = i     * 360 / titleSpread
    cause.endLat      = (i+1) * 360 / titleSpread
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
  , showHinges
  , titleAlt
  , titleAngleZ
  , titleSpread

  , places
  , causes
}
