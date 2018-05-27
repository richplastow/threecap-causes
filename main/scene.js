//// SCENE

import config from  './config.js'
import state from  './state.js'

const

    //// Objects for rendering.
    clock = new THREE.Clock()
  , scene = new THREE.Scene()
  , camera = new THREE.PerspectiveCamera(
        35, config.previewWidth/config.previewHeight, 0.1, 2200)
  , renderer = new THREE.WebGLRenderer({ antialias:true })
  , composer = new THREE.EffectComposer(renderer)
  , copyPass = new THREE.ShaderPass(THREE.CopyShader)

    //// Object3Ds.
  , titleMeshes = []
  , cutouts = []
  , vidscreens = []

    //// Lights.
  , ambientLight = new THREE.AmbientLight(0xaaaab0)

  , earthGeometry = new THREE.SphereGeometry(100, 100, 100, 32)

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
  , cubeGeometry = new THREE.BoxGeometry(100,100,100)
  , cubeMaterial = new THREE.MeshPhongMaterial({
        color: 0x0000ff
    })
  , cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)

scene.fog = new THREE.Fog(
    new THREE.Color('rgb(202,2,45)'), -100, 450) // RT: rgb(0, 90, 83)



let module; export default module = {

    copyPass
  , renderer
  , composer
  , clock
  , camera
  , captureui

  , titleMeshes
  , cutouts
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
        // scene.add(cubeMesh)

        //// Create all of the causes’ titles.
        createTitles(config.causes, titleMeshes, scene)

/*
        //// Add text sprites.
        firstTextSprite.position.set(110, -77, -5)
        firstTextSprite.scale.set(50, 50, 50)
        scene.add(firstTextSprite)

        ////
        let i = 0 // `i` is the ‘million-icon’ index
        for (const yearIndex in data) {
            const [ year, , delta ] = data[yearIndex]

            for (let j=0; j<delta; j++) {
                let y, z, sprite = new THREE.Sprite(usualSpriteMaterial)

                //// `i` up to 100
                if (100 > i) {
                    z = (i % 10) * -7 // effectively x
                    y = ~~(i / 10) * 7

                //// Odd `i`, up to 500, greater than 100
                } else if (500 > i && i % 2) {
                    z = ~~(i / 20) * 7 - 28
                    y = (i % 20) * 3.5 - 3.5

                //// Even `i`, up to 500, greater than 100
                } else if (500 > i) {
                    z = ~~(i / 20) * -7 - 35
                    y = (i % 20) * 3.5

                //// `i` greater than 500
                } else {
                    z = (i % 50) * -7 + 140
                    y = ~~(i / 50) * 7
                }

                sprite.position.set(110, y/2-52, z/2+14.5)
                sprite.scale.set(3, 3, 3)
                if (1950 === year)
                    sprite.showAtFraction = 0
                else if (2017 >= year)
                    sprite.showAtFraction =
                        0.25 // pause for 25% of the duration
                      + (yearIndex * 0.006) // when the year-text changes
                      + (
                            (0.006 / delta) // fraction of the year
                          * j // each ‘million-icon’ appears one-by-one
                        )
                else
                    sprite.showAtFraction =
                        0.35 // pause a bit at 2017
                      + (yearIndex * 0.006) // when the year-text changes
                      + (
                            (0.006 / delta) // fraction of the year
                          * j // each ‘million-icon’ appears one-by-one
                        )
                sprite.year = year
                sprite.visible = false
                sprites.push(sprite)
                scene.add(sprite)

                //// Increment the ‘million-icon’ index
                i++
            }
        }
*/
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
    const
        geometry = new THREE.PlaneGeometry( 80, 80 / (2048/256) )
    causes.forEach( (cause, i) => {
        const
            texture = new THREE.CanvasTexture(
                document.getElementById('title-spritesheet') )
          , material = new THREE.MeshPhongMaterial({
                map: texture
              , blending: THREE.AdditiveBlending
              , depthTest: true
              , transparent: true
              , opacity: 1 //config.titleOpacityBeginEnd
              // , color: 0x0000ff
              , fog: false
              , side: THREE.DoubleSide
            })
          , mesh = new THREE.Mesh(geometry, material)
          , group = new THREE.Object3D()
        mesh.position.set(0, config.titleAlt, 0)
        mesh.rotation.set(0, Math.PI/2, 0)
        group.rotation.set(0, 0, (i * Math.PI*2 / config.titleSpread) - Math.PI*0.5)
        texture.repeat.set(1, 0.125) // scale x8 vertically
        texture.offset.set(0, 1 - (0.125*i)) // move
        group.add(mesh)
        scene.add(group)
        titleMeshes.push(mesh)
        console.log(cause.title, i, 1 - (0.125*i), group.rotation.z);
    })
  //
  // , cubeGeometry = new THREE.BoxGeometry(100,100,100)
  // , cubeMaterial = new THREE.MeshPhongMaterial({
  //       color: 0x0000ff
  //   })
  // , cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)

}
