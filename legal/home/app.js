/* Mobile-first Three.js weave with adaptive quality and oath ritual */

(() => {
  const state = {
    webglSupported: supportsWebGL(),
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    deviceTiltActive: false,
    interaction: { x: 0, y: 0 },
    quality: 'high',
    oathStarted: false
  };

  const el = {
    container: document.getElementById('webgl-container'),
    fallback: document.getElementById('fallback'),
    oathBtn: document.getElementById('oath-button'),
    motionBtn: document.getElementById('motion-button'),
    oathOverlay: document.getElementById('oath-overlay'),
    aria: document.getElementById('aria-status')
  };

  if (!state.webglSupported || state.reducedMotion) {
    // Graceful fallback
    el.fallback.classList.remove('hidden');
    attachBasicUI();
    return;
  }

  // Adaptive quality based on device capabilities
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;
  // Heuristic: mid/low devices drop to medium/low
  if (cores <= 4 || mem <= 4) state.quality = 'medium';
  if (cores <= 2 || mem <= 2) state.quality = 'low';

  // Scene setup
  let scene, camera, renderer, coreMesh, points, clock, rafId;
  const uni = {
    time: { value: 0 },
    pulse: { value: 0 },
    intensity: { value: 1.0 }
  };

  init();
  animate();
  attachBasicUI();

  // ————— functions

  function init(){
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05060a, 0.018);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 0, 8);

    renderer = new THREE.WebGLRenderer({
      antialias: state.quality === 'high',
      powerPreference: 'high-performance',
      alpha: true
    });
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.classList.add('webgl');
    el.container.appendChild(renderer.domElement);

    clock = new THREE.Clock();

    addLights();
    addCore();
    addWeave();
    addStarfield();

    window.addEventListener('resize', onResize, { passive: true });
    // Pointer parallax
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // Offer motion toggle for tilt parallax
    el.motionBtn.classList.remove('hide');
    el.motionBtn.addEventListener('click', enableMotion);
  }

  function addLights(){
    const amb = new THREE.AmbientLight(0x6ea9ff, 0.35);
    scene.add(amb);

    const dir = new THREE.DirectionalLight(0x9ee8ff, 0.6);
    dir.position.set(2, 3, 2);
    scene.add(dir);
  }

  function addCore(){
    const coreGeo = new THREE.SphereGeometry(1.05, 32, 32);
    const coreMat = new THREE.ShaderMaterial({
      uniforms: uni,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexShader: `
        varying vec3 vPos;
        void main(){
          vPos = position;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float pulse;
        uniform float intensity;
        varying vec3 vPos;

        float glow(vec3 p){
          float r = length(p);
          return smoothstep(1.2, 0.0, r - 0.2 * sin(time*1.2) + 0.05*pulse);
        }

        void main(){
          float g = glow(vPos) * (0.9 + 0.6 * sin(time*0.8 + length(vPos)*2.0));
          vec3 col = mix(vec3(0.35,0.72,0.95), vec3(0.65,0.98,1.0), g) * intensity;
          gl_FragColor = vec4(col, g*0.9);
        }
      `
    });
    coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);
  }

  function addWeave(){
    // Particle “threads” spiraling toward core
    const count = state.quality === 'high' ? 20000 : state.quality === 'medium' ? 12000 : 7000;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i=0; i<count; i++){
      const r = 3 + Math.random() * 8;
      const a = Math.random() * Math.PI * 2;
      const h = (Math.random() - 0.5) * 6;
      positions[i*3+0] = Math.cos(a) * r;
      positions[i*3+1] = h;
      positions[i*3+2] = Math.sin(a) * r;
      speeds[i] = 0.2 + Math.random() * 0.9;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        time: uni.time,
        intensity: uni.intensity
      },
      vertexColors: false,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        attribute float speed;
        uniform float time;
        varying float vAlpha;
        void main(){
          vec3 p = position;

          // Subtle spiral inwards
          float t = time * speed * 0.08;
          float r = length(p.xz);
          float ang = atan(p.z, p.x) + t * 0.6 / (0.2 + r);
          float rr = r - t * 0.18;
          rr = max(rr, 0.6); // don't collapse to zero

          p.x = cos(ang) * rr;
          p.z = sin(ang) * rr;
          p.y += sin(t + p.x*0.3) * 0.01;

          vAlpha = smoothstep(0.6, 2.0, rr);

          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = (8.0 / -mv.z);
        }
      `,
      fragmentShader: `
        uniform float intensity;
        varying float vAlpha;
        void main(){
          vec2 uv = gl_PointCoord - 0.5;
          float d = dot(uv, uv);
          float c = smoothstep(0.25, 0.0, d);
          vec3 col = mix(vec3(0.42,0.66,1.0), vec3(0.56,0.92,1.0), c) * intensity;
          gl_FragColor = vec4(col, c * vAlpha * 0.7);
        }
      `
    });

    points = new THREE.Points(geo, mat);
    scene.add(points);
  }

  function addStarfield(){
    const count = 1200;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i=0; i<count; i++){
      const r = 30 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random()*2) - 1);
      pos[i*3+0] = r * Math.sin(phi) * Math.cos(theta);
      pos[i*3+1] = r * Math.cos(phi);
      pos[i*3+2] = r * Math.sin(phi) * Math.sin(theta);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0x87bfff,
      size: 0.01,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const stars = new THREE.Points(geo, mat);
    scene.add(stars);
  }

  function animate(){
    rafId = requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    uni.time.value = t;

    // Camera parallax from pointer/tilt
    const targetX = state.interaction.x * 0.6;
    const targetY = state.interaction.y * 0.4;
    camera.position.x += (targetX - camera.position.x) * 0.06;
    camera.position.y += (targetY - camera.position.y) * 0.06;
    camera.lookAt(0, 0, 0);

    // Subtle core breathing
    const s = 1.0 + Math.sin(t * 1.2) * 0.02 + uni.pulse.value * 0.05;
    coreMesh.scale.setScalar(s);

    renderer.render(scene, camera);

    // decay pulse
    uni.pulse.value *= 0.95;
  }

  function onResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onPointerMove(e){
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    state.interaction.x = x * 0.9;
    state.interaction.y = -y * 0.9;
  }

  function enableMotion(){
    const activate = () => {
      window.addEventListener('deviceorientation', onTilt, true);
      state.deviceTiltActive = true;
      el.motionBtn.classList.add('hide');
      announce('Motion enabled. Tilt to explore the weave.');
    };

    // iOS permission gate; on Android 13 most browsers permit without prompt
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(state => {
          if (state === 'granted') activate();
          else announce('Motion permission denied.');
        })
        .catch(() => announce('Motion permission unavailable.'));
    } else {
      activate();
    }
  }

  function onTilt(e){
    // Normalize beta [-180,180], gamma [-90,90]
    const beta = clamp(e.beta || 0, -90, 90) / 90;   // front/back
    const gamma = clamp(e.gamma || 0, -45, 45) / 45; // left/right
    // Map to interaction space
    state.interaction.x = gamma * 0.8;
    state.interaction.y = -beta * 0.6;
  }

  function attachBasicUI(){
    el.oathBtn.addEventListener('click', startOath);
  }

  function startOath(){
    if (state.oathStarted) return;
    state.oathStarted = true;
    uni.pulse.value = 1.0;

    // Cinematic: ease camera inward and then reveal oath overlay
    const startZ = camera.position.z;
    const endZ = 4.8;
    const dur = 1100;
    const t0 = performance.now();

    function dolly(now){
      const p = Math.min((now - t0) / dur, 1);
      const ease = easeOutCubic(p);
      camera.position.z = startZ + (endZ - startZ) * ease;
      uni.intensity.value = 1.0 + 0.6 * ease;
      if (p < 1) requestAnimationFrame(dolly);
      else revealOath();
    }
    requestAnimationFrame(dolly);
  }

  function revealOath(){
    el.oathOverlay.classList.remove('hidden');
    // allow CSS transitions to apply
    requestAnimationFrame(() => el.oathOverlay.classList.add('show'));
    announce('Oath revealed. Scroll to continue.');
    // After a pause, gently pull back to normal
    setTimeout(() => {
      const startZ = camera.position.z;
      const endZ = 7.2;
      const dur = 1300;
      const t0 = performance.now();
      function pull(now){
        const p = Math.min((now - t0) / dur, 1);
        const ease = easeInOutCubic(p);
        camera.position.z = startZ + (endZ - startZ) * ease;
        uni.intensity.value = 1.2 - 0.2 * ease;
        if (p < 1) requestAnimationFrame(pull);
      }
      requestAnimationFrame(pull);
      // Hide oath UI after a while (keeps moment sacred, then clears view)
      setTimeout(() => {
        el.oathOverlay.classList.remove('show');
        setTimeout(() => el.oathOverlay.classList.add('hidden'), 600);
      }, 3200);
    }, 1400);
  }

  // Utils
  function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }
  function easeInOutCubic(t){ return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2; }
  function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

  function supportsWebGL(){
    try{
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch(e){ return false; }
  }

  function announce(msg){
    if (!el.aria) return;
    el.aria.textContent = '';
    setTimeout(() => el.aria.textContent = msg, 10);
  }

  // Cleanup if needed (SPA mounts/unmounts)
  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(rafId);
    renderer && renderer.dispose();
  });
})();