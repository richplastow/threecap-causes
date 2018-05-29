//// CONFIGURATION AND CONSTANTS

const
    stick = 0//247.9 // set to a longitude, to freeze the camera at that position
  , camLonOffset = 0 // set to a longitude to start the camera at that position
  , showHinges = false

    //// Dimensions, framerate, duration.
  , previewWidth = 854
  , previewHeight = 480
  , previewFps = 25
  , previewDuration = 30000 // in ms

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
  , titleAlt = 112
  , titleSpread = 1 // how many would fit round the globe
  , ts = titleSpread

  , FLIP = 'FLIP'

  , places = {

        //// `lat` is latitude: +ve appears to the left, -ve to the right.

        //// `relLon` is the longitude relative to the title’s longitude.

        //// The ‘early’ section comes after the title. It cannot be seen when
        //// the title in being looked at, but comes in straight after.
        early_l_0: { lat: 5, lon: 10 }
      , early_r_0: { lat:-5, lon: 13 }
      , early_l_1: { lat: 5, lon: 20 }
      , early_r_1: { lat:-5, lon: 23 }
      , early_l_2: { lat: 5, lon: 30 }
      , early_r_2: { lat:-5, lon: 33 }
      , early_l_3: { lat: 5, lon: 40 }
      , early_r_3: { lat:-5, lon: 43 }
      , early_l_4: { lat: 5, lon: 50 }
      , early_r_4: { lat:-5, lon: 53 }
      , early_l_5: { lat: 5, lon: 60 }
      , early_r_5: { lat:-5, lon: 63 }
      , early_l_6: { lat: 5, lon: 70 }
      , early_r_6: { lat:-5, lon: 73 }
      , early_l_7: { lat: 5, lon: 80 }
      , early_r_7: { lat:-5, lon: 83 }
      , early_l_8: { lat: 5, lon: 90 }
      , early_r_8: { lat:-5, lon: 93 }
      , early_l_9: { lat: 5, lon:100 }
      , early_r_9: { lat:-5, lon:103 }
      , early_l_A: { lat: 5, lon:110 }
      , early_r_A: { lat:-5, lon:113 }
      , early_l_B: { lat: 5, lon:120 }
      , early_r_B: { lat:-5, lon:123 }
      , early_l_C: { lat: 5, lon:130 }
      , early_r_C: { lat:-5, lon:133 }
      , early_l_D: { lat: 5, lon:140 }
      , early_r_D: { lat:-5, lon:143 }

        //// The ‘pause’ section is a complete scene in itself. No other
        //// sections’ cutouts can be seen here.
      , pause_l_0: { lat: 5, lon:150 }
      , pause_r_0: { lat:-5, lon:152 }
      , pause_c_0: { lat: 0, lon:153 }

      , pause_l_1: { lat: 5, lon:155 }
      , pause_r_1: { lat:-5, lon:157 }
      , pause_c_1: { lat: 0, lon:158 }

      , pause_l_2: { lat: 5, lon:160 }
      , pause_r_2: { lat:-5, lon:162 }
      , pause_c_2: { lat: 0, lon:163 }

      , pause_l_3: { lat: 5, lon:165 }
      , pause_r_3: { lat:-5, lon:167 }
      , pause_c_3: { lat: 0, lon:168 }

      , pause_l_4: { lat: 5, lon:170 }
      , pause_r_4: { lat:-5, lon:172 }
      , pause_c_4: { lat: 0, lon:173 }

      , pause_l_5: { lat: 5, lon:175 }
      , pause_r_5: { lat:-5, lon:177 }
      , pause_c_5: { lat: 0, lon:178 }

        //// The ‘late’ section is another flythrough, like ‘early’.
      , late_l_0:  { lat: 5, lon:190 }
      , late_r_0:  { lat:-5, lon:193 }
      , late_c_0:  { lat: 0, lon:196 }

      , late_l_1:  { lat: 5, lon:200 }
      , late_r_1:  { lat:-5, lon:203 }
      , late_c_1:  { lat: 0, lon:206 }

      , late_l_2:  { lat: 5, lon:210 }
      , late_r_2:  { lat:-5, lon:213 }
      , late_c_2:  { lat: 0, lon:216 }

      , late_l_3:  { lat: 5, lon:220 }
      , late_r_3:  { lat:-5, lon:223 }
      , late_c_3:  { lat: 0, lon:226 }

      , late_l_4:  { lat: 5, lon:230 }
      , late_r_4:  { lat:-5, lon:233 }
      , late_c_4:  { lat: 0, lon:236 }

      , late_l_5:  { lat: 5, lon:240 }
      , late_r_5:  { lat:-5, lon:243 }
      , late_c_5:  { lat: 0, lon:246 }

      , late_l_6:  { lat: 5, lon:250 }
      , late_r_6:  { lat:-5, lon:253 }
      , late_c_6:  { lat: 0, lon:256 }

      , late_l_7:  { lat: 5, lon:260 }
      , late_r_7:  { lat:-5, lon:263 }
      , late_c_7:  { lat: 0, lon:266 }

      , late_l_8:  { lat: 5, lon:270 }
      , late_r_8:  { lat:-5, lon:273 }
      , late_c_8:  { lat: 0, lon:276 }


        //// The ‘conclude’ section provides a concluding scene.
      , conclude_l_0: { lat: 5, lon:280 }
      , conclude_r_0: { lat:-5, lon:282 }
      , conclude_c_0: { lat: 0, lon:283 }

      , conclude_l_1: { lat: 5, lon:290 }
      , conclude_r_1: { lat:-5, lon:292 }
      , conclude_c_1: { lat: 0, lon:293 }

      , conclude_l_2: { lat: 5, lon:290 }
      , conclude_r_2: { lat:-5, lon:292 }
      , conclude_c_2: { lat: 0, lon:293 }

      , conclude_l_3: { lat: 5, lon:300 }
      , conclude_r_3: { lat:-5, lon:302 }
      , conclude_c_3: { lat: 0, lon:303 }

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

               //// Lineup of low-cost planes.
               early_l_0: { src:'airport-a-1-easyjet-parked-1024.png'
                 , size:30, lat: 5, repeat:{ tally:6, lon:6 } }
             , early_r_0: { src:'airport-a-2-ryanair-parked-1024.png'
                 , size:30, lat:-5, repeat:{ tally:6, lon:6 }, lon:-2 }

               //// UK and Euro Airport signs.
             , early_l_5: { src:'airport-b-1-stansted-512.png', size:25, lat:2, alt:-1 }
             , early_r_6: { src:'airport-b-2-east-midlands-1024.png', size:25, lat:-5, lon:-1, alt:-3 }
             , early_r_7: { src:'airport-b-3-luton-512.png', size:25, lat:-3 }
             , early_l_9: { src:'airport-b-4-glasgow-512.png', size:30, lat:7 }
             , early_l_A: { src:'airport-c-2-malaga-512.png', size:25, lat:-4, alt:9 }
             , early_r_B: { src:'airport-c-5-venice-512.png', size:35, lat:-9 }
             , early_l_C: { src:'airport-c-4-rome-1024.png', size:30, alt:3, lat:5 }
             , early_r_C: { src:'airport-c-3-barcelona-512.png' }
             // , early_l_D: { src:'airport-c-1-mallorca-512.png' } //@TODO use this?
             , early_r_D: { src:'airport-c-6-amsterdam-1024.png', size:25, alt:8 }
             , early_l_D: { src:'airport-d-1-terminal2-1024.png', alt:6 }

               //// In the airport.
             , pause_c_0: { src:'airport-e-1-crowd-left-512.png', size:8, lat:0, lon:0, alt:-1 }
             , pause_l_1: { src:'airport-d-5-pizza-1024.png', lat:-1, lon:2, alt:-2
                 , animate: { begin:144.45, end:145.5, alt:-10, lon:-1 } }

             , pause_r_1: { src:'airport-e-3-crowd-right-512.png', size:8, lat:0, lon:0, alt:-1 }

             , pause_l_2: { src:'airport-d-2-checkin-1024.png', lat:2, alt:5 }
             , pause_r_2: { src:'airport-d-3-arrivals-1024.png', lat:-3, alt:5 }
             , pause_r_4: { src:'airport-d-6-beer-1024.png', size:30, lat:-2, alt:-6
                 , animate: { begin:144.6, end:146, alt:-30, lon:-1 } }
             // , pause_c_0: { src:'airport-e-2-crowd-center-1024.png', size:11, alt:-0.5, lon:-1 }
             // , pause_r_2: { src:'airport-d-7-coffee-512.png', size:25, lat:-5, alt:-3 }
             , pause_c_5: { src:'airport-d-4-departures-1024.png', size:35, lat:2, alt:-3
                 , animate: { begin:144.3, end:145, alt:-30, lon:-1 } }

               //// “...free flights...”
             , pause_l_5: { src:'airport-a-2-ryanair-parked-1024.png', size:99, lat:30, alt:-10
                 , animate: { begin:143, end:152, lat:-35, lon:5, alt:4 } }

               //// Multiplying planes.
             , late_l_1:  { src:'airport-f-1-plane-underside-1024.png'
                 , size:10, repeat: { tally:4, lat:3, lon:-3, alt:3 } }
             , late_r_1:  { src:'airport-f-1-plane-underside-1024.png'
                 , size:10, repeat: { tally:4, lat:-3, lon:-3, alt:3 } }
             , late_c_0:  { src:'airport-f-1-plane-underside-1024.png'
                 , size:99, alt:-99, animate: { begin:145, end:160, alt:80 } }

             , late_l_3:  { src:'airport-f-1-plane-underside-1024.png'
                 , size:7, lat:5, repeat: { tally:4, lat:3, lon:-3, alt:3 } }
             , late_r_3:  { src:'airport-f-1-plane-underside-1024.png'
                 , size:7, lat:-5, repeat: { tally:4, lat:-3, lon:-3, alt:3 } }

             , late_l_4:  { src:'airport-f-1-plane-underside-1024.png'
                 , size:5, lat:7, repeat: { tally:4, lat:-3, lon:-3, alt:3 } }
             , late_r_4:  { src:'airport-f-1-plane-underside-1024.png'
                 , size:5, lat:-7, repeat: { tally:4, lat:3, lon:-3, alt:3 }, lon:-3.5 }
             , late_c_4:  { src:'airport-f-1-plane-underside-1024.png', size:7, lon:-6, alt:25 }

             , late_l_5:  { src:'airport-f-1-plane-underside-1024.png'
                 , size:4, lat:7, repeat: { tally:6, alt:7 } }
             , late_r_5:  { src:'airport-f-1-plane-underside-1024.png'
                 , size:4, lat:-7, repeat: { tally:6, alt:7 }, lon:-3.5 }
             , late_c_5:  { src:'airport-f-7-refuel-left-1024.png', size:15, lat:-12, lon:22.5, alt:-0.7, FLIP
                 , animate: { begin:248.2, end:249.5, lat:-2 } } // back

             , late_l_6:  { src:'airport-f-1-plane-underside-1024.png'
                 , size:4, lat:12, alt:3, repeat: { tally:6, lat:1, alt:7 } }
             , late_r_6:  { src:'airport-f-1-plane-underside-1024.png'
                 , size:4, lat:-12, alt:3, repeat: { tally:6, lat:-1, alt:7 }, lon:-3.5 }
             , late_c_6:  { src:'airport-f-1-plane-underside-1024.png', size:40, alt:20, lon:2 }

             , late_l_7:  { src:'airport-f-1-plane-underside-1024.png'
                 , size:9, lat:10, alt:10, repeat: { tally:3, lat:1, lon:-3, alt:10 } }
             , late_r_7:  { src:'airport-f-1-plane-underside-1024.png'
                 , size:9, lat:-10, alt:10, repeat: { tally:3, lat:-1, lon:-3, alt:10 }, lon:-3.5 }
             , late_c_7:  { src:'airport-f-7-refuel-left-1024.png', size:15, lat:12, lon:-8, alt:-0.5
                 , animate: { begin:248.3, end:250, lat:0 } }

               //// Coins
             , late_l_8:  { src:'airport-g-2-coin-512.png'
                 , size:4, lat:2, alt:3, repeat: { tally:12, lat:1, alt:8 } }
             , late_r_8:  { src:'airport-g-2-coin-512.png'
                 , size:4, lat:-2, alt:3, repeat: { tally:12, lat:-1, alt:8 }, lon:-3.5 }
             , late_c_8:  { src:'airport-g-2-coin-512.png'
                 , size:8, lon:-2, alt:10, repeat: { tally:7, alt:10, lon:-2 } }

             , conclude_l_0: { src:'airport-g-2-coin-512.png'
                 , size:3, lat:4, alt:3, repeat: { tally:12, lat:2, alt:8 } }
             , conclude_r_0: { src:'airport-g-2-coin-512.png'
                 , size:3, lat:-4, alt:3, repeat: { tally:12, lat:-2, alt:8 }, lon:-2 }

               //// Another ineup of low-cost planes.
             , conclude_l_1: { src:'airport-a-2-ryanair-parked-1024.png'
                 , size:40, lat: 7, repeat:{ tally:4, lon:-12 }, lon:0, alt:0.5 }
             , conclude_r_1: { src:'airport-a-1-easyjet-parked-1024.png'
                 , size:33, lat:-7, repeat:{ tally:4, lon:-12 }, lon:-2, alt:0.5 }

               //// Ground crew.
             // , conclude_l_1:  { src:'airport-f-5-fire-512.png', lat:6 }
             // , conclude_r_1:  { src:'airport-f-5-fire-512.png', lat:-6, FLIP }
             // , conclude_l_1:  { src:'airport-f-5-fire-512.png', lat:6 }
             // , conclude_r_1:  { src:'airport-f-5-fire-512.png', lat:-6, FLIP }
             // , conclude_c_1:  { src:'airport-f-4-baggage-512.png', size:10, alt:-1.3, lon:-1 }

             // , late_l_A:  { src:'airport-f-7-refuel-left-1024.png', size:25, lat:3 }
             // , conclude_l_2:  { src:'airport-f-8-refuel-right-1024.png', size:20, alt:-2, FLIP }
             // , conclude_r_2:  { src:'airport-f-8-refuel-right-1024.png', size:25, lat:-3, alt:-2.5 }
             //
             // , late_r_B:  { src:'airport-f-7-refuel-left-1024.png', size:20, FLIP }

               //// Ground crew.
             , conclude_c_3:  { src:'airport-g-1-airship-1024.png', size:40, alt:-30
                 , animate: { begin:236, end:270, alt:10 } } // begin/end are camera-longitudes


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
    cause.titleLon    = i       * 360 / ts
    cause.camStartLon = (i-0.2) * 360 / ts // the title just over the horizon
    cause.camEndLon   = (i+0.8) * 360 / ts
})


let module; export default module = {

    stick
  , camLonOffset

    //// Dimensions, framerate, duration.
  , previewDuration
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
