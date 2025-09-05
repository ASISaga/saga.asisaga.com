// Minimal Three.js test scene — forces WebGL on, no fallbacks

(() => {
  let scene, camera, renderer, coreMesh, points, clock;

  init();
  animate();

  function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05060a, 0.018);

    camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    camera.position.set(0, 0, 8);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.classList.add('webgl');
    document.getElementById('webgl-container').appendChild(renderer.domElement);

    clock = new THREE.Clock();

    addLights();
    addCore();
    addWeave();

    window.addEventListener('resize', onResize, false);
  }

  function addLights() {
    scene.add(new THREE.AmbientLight(0x6ea9ff, 0.35));
    const dir = new THREE.DirectionalLight(0x9ee8ff, 0.6);
    dir.position.set(2, 3, 2);
    scene.add(dir);
  }

  function addCore() {
    const geo = new THREE.SphereGeometry(1.05, 32, 32);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xa9f8ff,
      transparent: true,
      opacity: 0.8
    });
    coreMesh = new THREE.Mesh(geo, mat);
    scene.add(coreMesh);
  }

  function addWeave() {
    const count = 8000;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 8;
      const a = Math.random() * Math.PI * 2;
      const h = (Math.random() - 0.5) * 6;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = h;
      positions[i * 3 + 2] = Math.sin(a) * r;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0x87bfff,
      size: 0.05,
      transparent: true,
      opacity: 0.7
    });

    points = new THREE.Points(geo, mat);
    scene.add(points);
  }

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Rotate weave
    points.rotation.y = t * 0.05;
    points.rotation.x = Math.sin(t * 0.2) * 0.05;

    // Pulse core
    const s = 1 + Math.sin(t * 2) * 0.05;
    coreMesh.scale.setScalar(s);

    renderer.render(scene, camera);
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
})();