/**
 * STORY PAGE 3D ANIMATION
 * Cinematic Floating Cube with Athlete Inside
 */

let scene, camera, renderer, cube, particles, athletePlane;
let container = document.getElementById('three-container');

function init() {
    // 1. Scene Setup
    scene = new THREE.Scene();
    scene.background = null; // Transparent background to show the dark gradient from CSS

    // 2. Camera Setup
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // 3. Renderer Setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // 4. Floating 3D Transparent Box (The Cube)
    const geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5);
    const material = new THREE.MeshPhongMaterial({
        color: 0xff6600,
        opacity: 0.15,
        transparent: true,
        side: THREE.BackSide,
        shininess: 100,
        specular: 0xffffff
    });

    // Wireframe for the box edges
    const wireframeGeometry = new THREE.EdgesGeometry(geometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0xff6600, linewidth: 2 });
    const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);

    cube = new THREE.Mesh(geometry, material);
    cube.add(wireframe);
    scene.add(cube);

    // 5. Muscular Athlete Inside (Video Plane)
    const video = document.createElement('video');
    video.src = "https://assets.mixkit.co/videos/preview/mixkit-bodybuilder-training-his-back-with-a-pulldown-machine-2340-large.mp4";
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = true;
    video.play();

    const videoTexture = new THREE.VideoTexture(video);
    const athleteGeometry = new THREE.PlaneGeometry(2, 2);
    const athleteMaterial = new THREE.MeshBasicMaterial({
        map: videoTexture,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
    });

    athletePlane = new THREE.Mesh(athleteGeometry, athleteMaterial);
    cube.add(athletePlane); // Add inside the cube so it rotates with it

    // 6. Floating Energy Particles
    const particleCount = 1000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        // Positioned in a sphere around the cube
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const r = 3 + Math.random() * 2;

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);

        // Orange/White colors
        colors[i * 3] = 1; // R
        colors[i * 3 + 1] = Math.random() * 0.5; // G (0 to 0.5 for orange)
        colors[i * 3 + 2] = 0; // B
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 7. Cinematic Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
    scene.add(ambientLight);

    const orangeLight = new THREE.PointLight(0xff6600, 5, 20);
    orangeLight.position.set(5, 5, 5);
    scene.add(orangeLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 2);
    rimLight.position.set(-5, 0, 5);
    scene.add(rimLight);

    // 8. Event Listeners
    window.addEventListener('resize', onWindowResize, false);

    animate();
}

function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
    requestAnimationFrame(animate);

    // Cube rotation
    if (cube) {
        cube.rotation.y += 0.005;
        cube.rotation.x += 0.002;

        // Face the plane towards the camera inside the rotating cube
        // but keep it locked to cube rotation for "surrounding" effect
        // Instead, let's keep it steady so the athlete is always visible
        athletePlane.lookAt(camera.position);
    }

    // Particle movement (subtle drift)
    if (particles) {
        particles.rotation.y -= 0.001;
    }

    // Camera orbit (very subtle)
    let time = Date.now() * 0.0005;
    camera.position.x = Math.sin(time) * 0.5;
    camera.position.y = Math.cos(time) * 0.5;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

init();
