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

  // , cameraAlt = 310
  // , lookAtAlt = 100
  , cameraAlt = 110
  , lookAtAlt = cameraAlt - 5
  , showHinges = false
  , titleAlt = 112
  , titleSpread = 6 // how many would fit round the globe
  , ts = titleSpread

  , places = {

        //// Only show during transition.
        veryEarlyLeft:  { lat: 5, relLon: -250/ts }
      , veryEarlyRight: { lat:-5, relLon: -220/ts }
      , earlyLeft:      { lat: 5, relLon: -200/ts }

        //// Show in front of title when camera stops.
      , veryFrontCenter:{ lat: 0, relLon: -150/ts }
      , veryFrontRight: { lat:-3, relLon: -160/ts }
      , frontLeft:      { lat: 6, relLon: -130/ts }
      , frontCenter:    { lat: 0, relLon: -125/ts }
      , frontRight:     { lat:-7, relLon: -120/ts }
      , midLeft:        { lat: 8, relLon: -120/ts }
      , midCenter:      { lat: 0, relLon: -118/ts }
      , midRight:       { lat:-8, relLon: -115/ts }
      , backLeft:       { lat: 6, relLon: -110/ts }
      , backRight:      { lat:-7, relLon: -105/ts }

        ////
      , justBehindCenter:{ lat: 0, relLon:10/ts }

    }

  , causes = [
        {
            title: 'Bucket Lists'
          , previewDuration: 5000 // in ms
        }
      , {
            title: 'Cheap Flights'
          , previewDuration: 3000 // in ms
          , cutouts: {
                veryEarlyLeft:  { size:10, src:'airport-11-512.png', relAlt:-3 } // Phili
              , veryEarlyRight: { size:10, src:'airport-9-512.png', relAlt:-1 } // Heathrow
              , earlyLeft:      { size:10, src:'airport-10-512.png', relAlt:4 } // Terminal 2
              , veryFrontCenter:{ size:13, src:'airport-4-512.png', relAlt:-2 } // Hi viz
              , veryFrontRight: { size:15, src:'airport-6-1024.png', relAlt:-4.5, relLat:2 } // Easyjet
              , frontLeft:      { size:15, src:'airport-13-512.png', relAlt:4 } // Check In
              , frontRight:     { size:15, src:'airport-8-512.png', relAlt:4 } // Arrivals
              , midLeft:        { size:10, src:'airport-1-512.png', relAlt:-2.3 } // Lady bag
              , midRight:       { size:10, src:'airport-2-512.png', relAlt:-1.5 } // Ladies bags

              // , justBehindCenter:{ size:30, src:'airport-4-512.png', relAlt:-8 } // Hi viz
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
    cause.camStartLon = (i-0.6) * 360 / titleSpread
    cause.camEndLon   = (i+0.4) * 360 / titleSpread
    cause.startLon    = i     * 360 / titleSpread
    cause.endLon      = (i+1) * 360 / titleSpread
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
  , titleSpread

  , places
  , causes
}
