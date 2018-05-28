//// SCENE

import config from  './config.js'
import state from  './state.js'

const

    //// Objects for rendering.
    clock = new THREE.Clock()
  , scene = new THREE.Scene()
  , camera = new THREE.PerspectiveCamera(
        35, config.previewWidth/config.previewHeight, 10, 300)
  , renderer = new THREE.WebGLRenderer({ antialias:true })
  , composer = new THREE.EffectComposer(renderer)
  , copyPass = new THREE.ShaderPass(THREE.CopyShader)

    //// Object3Ds.
  , titleMeshes = []
  , cutoutMeshes = []
  , vidscreens = []

    //// Lights.
  , ambientLight = new THREE.AmbientLight(0xaaaab0)

      //// Geometry.
  , earthGeometry = new THREE.SphereGeometry(100, 100, 100, 32)
  , hingeGeometry = new THREE.BoxGeometry(1, 40, 1)

    //// Textures - for fast development:
  , earthMap = THREE.ImageUtils.loadTexture('images/512_earth_daymap.jpg')
/*
  , earthBumpMap = THREE.ImageUtils.loadTexture('images/512_earth_normal_map.png')
  , earthSpecularMap = THREE.ImageUtils.loadTexture('images/512_earth_specular_map.png')
  , cloudMap = THREE.ImageUtils.loadTexture('images/1024_earth_clouds.jpg')
  , starMap = THREE.ImageUtils.loadTexture('images/1024_stars_milky_way.jpg')

    //// Textures - for final render with a fast GPU:
  // , earthMap = THREE.ImageUtils.loadTexture('images/2048_earth_daymap.jpg')
  // , earthBumpMap = THREE.ImageUtils.loadTexture('images/1024_earth_normal_map.png')
  // , earthSpecularMap = THREE.ImageUtils.loadTexture('images/1024_earth_specular_map.png')
  // , cloudMap = THREE.ImageUtils.loadTexture('images/2048_earth_clouds.jpg')
  // , starMap = THREE.ImageUtils.loadTexture('images/4096_stars_milky_way.jpg')

  , firstTextSpriteTexture = new THREE.CanvasTexture(
        document.getElementById('first-text-sprite')
    )
*/
    //// Materials.
  , earthMaterial = new THREE.MeshBasicMaterial({
           color: 'rgb(202,2,45)'
         , map: earthMap
      // , bumpMap: earthBumpMap
      // , bumpScale: 10
      // , specularMap: earthSpecularMap
      // , specular: new THREE.Color('grey')
    })

  , hingeMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00
      , transparent: true
      , opacity: config.showHinges ? 1 : 0
    })
/*
  , cloudMaterial = new THREE.MeshPhongMaterial({
        map: cloudMap
      , side: THREE.DoubleSide
      , opacity: 1.0
      , blending: THREE.AdditiveBlending
      , transparent: true
    })
  , starMaterial = new THREE.MeshBasicMaterial({
        map: starMap
      , side: THREE.BackSide
      , fog: false
    })
  , spriteMaterialTemplate = {
        map: usualSpriteTexture
      , blending: THREE.AdditiveBlending
      , depthTest: true
      , transparent: true
      , opacity: config.usualSpriteOpacityBeginEnd
      , fog: false

      //// Always in front
      // , depthWrite: false
      // , depthTest: false

    }
  , usualSpriteMaterial = new THREE.SpriteMaterial(
        Object.assign({}, spriteMaterialTemplate)
    )
  , firstTextSpriteMaterial = new THREE.SpriteMaterial({
        map: firstTextSpriteTexture
      , blending: THREE.AdditiveBlending
      , depthTest: true
      , transparent: true
      , opacity: config.usualSpriteOpacityBeginEnd
      , fog: false
    })

    //// Sprites.
  , firstTextSprite = new THREE.Sprite(firstTextSpriteMaterial)
*/

    //// Meshes.
  , earthMesh = new THREE.Mesh(earthGeometry, earthMaterial)
/*
  , cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial)
  , starMesh = new THREE.Mesh(starGeometry, starMaterial)
*/

    //// Capture.
  , capture = new THREEcap({
        width: config.captureWidth
      , height: config.captureHeight
      , fps: config.captureFps
      , time: config.captureDuration / 1000 // convert ms to seconds
      , format: 'mp4'
      , composer: composer // faster than using a canvas
      , scriptbase: 'lib/threecap/'
    })
  , captureui = new THREEcapUI(capture)


    //@TODO delete cube
  , cubeGeometry = new THREE.BoxGeometry(130,130,130)
  , cubeMaterial = new THREE.MeshPhongMaterial({
        color: 0x0000ff
    })
  , cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)

scene.fog = new THREE.Fog(
    new THREE.Color('rgb(202,2,45)'), 0, 750) // RT: rgb(0, 90, 83)



let module; export default module = {

    copyPass
  , renderer
  , composer
  , clock
  , camera
  , captureui

  , titleMeshes
  , cutoutMeshes
  , vidscreens

    //// Sets up the scene - should be called only once.
  , init () {

        clock.stop()
        renderer.domElement.id = 'three-scene'
        renderer.setPixelRatio(config.pixelRatio)
        renderer.autoClear = false
        // renderer.shadowMap.enabled = true
        // renderer.shadowMap.type = THREE.PCFSoftShadowMap // default THREE.PCFShadowMap
        composer.addPass( new THREE.RenderPass(scene, camera) )
        composer.addPass(copyPass)
        scene.background = new THREE.Color('rgb(202,2,45)')
        scene.add(camera)
        scene.add(ambientLight)
        // directionalLight.position.set(-200,300,500)
        // scene.add(directionalLight)
        document.body.appendChild(renderer.domElement)

        scene.add(earthMesh)
        scene.add(cubeMesh)

        //// Create all of the causes’ titles.
        createTitles(config.causes, titleMeshes, scene)

        //// Create all of the causes’ cutouts.
        createCutouts(config.causes, cutoutMeshes, scene)

    }

  , render () {
        requestAnimationFrame(module.render)
        const delta = clock.getDelta() // needed, to enable `clock.elapsedTime`
        const now = clock.elapsedTime
        if (state.prevNow === ~~now)
            if ('capture' === state.currMode) return // only render once a second
        else
            state.prevNow = ~~now // a new second!
/*
        //// Show dots at the correct moment and update the year-text.
        const nowFraction = now / state.currDuration * 1000
        for (let i=0; i<sprites.length; i++) {
            const sprite = sprites[i]
            if (nowFraction > sprite.showAtFraction && ! sprite.visible) {
                sprite.visible = true
                if (state.firstText !== sprite.year) {
                    state.firstText = sprite.year
                    window.updateFirstText(sprite.year)
                    firstTextSpriteMaterial.map.needsUpdate = true
                }
            }
        }

*/
        titleMeshes.forEach( title => {
            // title.rotation.y -= 0.01
        })
        // cubeMesh.rotation.y -= 0.01
        TWEEN.update(now * 1000) // convert seconds to ms
        renderer.clear()
        composer.render()
    }


}


function createTitles (causes, titleMeshes, scene) {
    const titleGeometry = new THREE.PlaneGeometry( 80, 80 / (2048/256) )
    causes.forEach( (cause, i) => {
        const
            titleTexture = new THREE.CanvasTexture(
                document.getElementById('title-spritesheet') )
          , titleMaterial = new THREE.MeshPhongMaterial({
                map: titleTexture
              , blending: THREE.AdditiveBlending
              , depthTest: true
              , transparent: true
              , opacity: config.titleOpacityBeginEnd
              , fog: false
              // , side: THREE.DoubleSide
            })
          , titleMesh = new THREE.Mesh(titleGeometry, titleMaterial)
          , hingeMesh = new THREE.Mesh(hingeGeometry, hingeMaterial)

        //// Show the correct part of the spritesheet.
        titleTexture.repeat.set(1, 0.125) // scale x8 vertically
        titleTexture.offset.set(0, 0.875 - (0.125*i)) // move

        //// Rotate plane to slot into the hinge correctly
        titleMesh.rotation.set(0, 0, -Math.PI/2)
        hingeMesh.add(titleMesh)

        //// Place the hinge in the correct location, and rotate it to be
        //// perpendicular to the ground (`- 0.3` to appear straight).
        updateHinge(
            hingeMesh
          , 0
          , cause.titleLon + i/2 // `i/2` prevents overlaps
          , config.titleAlt
        )
// console.log(cause.title, cause.titleLon, ~~hingeMesh.position.x, ~~hingeMesh.position.y, ~~hingeMesh.position.z);

        //// Add the hinge+title to the scene, and record the title-mesh.
        scene.add(hingeMesh)
        titleMeshes.push(titleMesh)

        //// Only shown when the current cause is being previewed or captured.
        titleMesh.visible = false
        titleMesh.causeIndex = i

    })
}


function createCutouts (causes, cutoutMeshes, scene) {
    causes.forEach( (cause, i) => {
        if (! cause.cutouts) return // has no cutouts
        for ( const [placeName, cutout] of Object.entries(cause.cutouts) ) {
            const
                place = config.places[placeName]
              , size = cutout.size || 15 // 15 by default
              , cutoutGeometry = new THREE.PlaneGeometry(size, size)
              , map = THREE.ImageUtils.loadTexture('images/' + cutout.src)
              , cutoutMaterial = new THREE.MeshBasicMaterial({
                    map, transparent: true
                })
              , repeat = cutout.repeat || {}
              , repeatTally = repeat.tally || 1
              , repeatLon = repeat.lon || 0
              , repeatLat = repeat.lat || 0
              , repeatAlt = repeat.alt || 0

            //// Usually there’s no `repeat`, so `repeatTally` is 1 here:
            for (let j=0; j<repeatTally; j++) {
                const
                    cutoutMesh = new THREE.Mesh(cutoutGeometry, cutoutMaterial)
                  , hingeMesh = new THREE.Mesh(hingeGeometry, hingeMaterial)

                if (! place) console.error(`No such place '${placeName}'`, Object.keys(config.places))

                //// Rotate plane to slot into the hinge correctly
                cutoutMesh.rotation.set(0, 0, -Math.PI/2)
                hingeMesh.add(cutoutMesh)

                //// Apply ‘FLIP’.
                if (cutout.FLIP) cutoutMesh.scale.x = -1

                //// Place the hinge in the correct location, and rotate it to be
                //// perpendicular to the ground (`- 0.3` to appear straight).
                updateHinge(
                    hingeMesh
                  , 0 // the camera travels along the equator
                      + place.lat // apply the place’s latitude...
                      + (cutout.lat || 0) // ...and the cutout’s modifier
                      + (j*repeatLat) // ...and this repeat’s latitude-gap
                  , cause.titleLon // based on the cause’s (absolute) title-longitude
                      + place.lon // apply the place’s relative-longitude...
                      + (cutout.lon || 0) // ...and the cutout’s modifier
                      + (j*repeatLon) // ...and this repeat’s longitude-gap
                      // + (i/2) //@TODO fix flicker better
                  , 100 // the Earth’s radius, so, ground-level
                      + size/2 // the cutout’s bottom edge sits on the ground
                      + (cutout.alt || 0) // apply the cutout’s modifier...
                      + (j*repeatAlt) // ...and this repeat’s altitude-gap
                )
    // console.log(cutout.src, place.relLon, ~~hingeMesh.position.x, ~~hingeMesh.position.y, ~~hingeMesh.position.z);
                //// Add the hinge+cutout to the scene, and record the cutout-mesh.
                scene.add(hingeMesh)
                cutoutMeshes.push(cutoutMesh)

                //// Only shown when the current cause is being previewed or captured.
                cutoutMesh.visible = false
                cutoutMesh.causeIndex = i
            }
        }
    })
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


function updateHinge (hinge, lat, lon, alt) {
    const pos = llaToXyz(lat, lon, alt)

    //// Place the hinge in the correct location.
    hinge.position.set(pos.x, pos.y, pos.z)

    //// Rotate to be perpendicular to the ground (`- 0.3` to appear straight).
    hinge.rotation.set(0, Math.PI * 2 * (lon / 360) - 0.3, 0)
}
