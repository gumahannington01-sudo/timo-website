/*// Create 3D Chair
function createChair(color = 0x8B4513) {
  const group = new THREE.Group();
  
  // Seat
  const seatGeom = new THREE.BoxGeometry(0.8, 0.2, 0.8);
  const seatMat = new THREE.MeshPhongMaterial({ color: color });
  const seat = new THREE.Mesh(seatGeom, seatMat);
  seat.position.y = 0.5;
  seat.castShadow = true;
  group.add(seat);
  
  // Back
  const backGeom = new THREE.BoxGeometry(0.8, 1.2, 0.2);
  const back = new THREE.Mesh(backGeom, seatMat);
  back.position.y = 1.3;
  back.position.z = -0.3;
  back.castShadow = true;
  group.add(back);
  
  // Front legs
  const legGeom = new THREE.BoxGeometry(0.15, 0.8, 0.15);
  const legMat = new THREE.MeshPhongMaterial({ color: 0x654321 });
  
  const legFL = new THREE.Mesh(legGeom, legMat);
  legFL.position.set(-0.3, 0.2, 0.3);
  legFL.castShadow = true;
  group.add(legFL);
  
  const legFR = new THREE.Mesh(legGeom, legMat);
  legFR.position.set(0.3, 0.2, 0.3);
  legFR.castShadow = true;
  group.add(legFR);
  
  // Back legs
  const legBL = new THREE.Mesh(legGeom, legMat);
  legBL.position.set(-0.3, 0.2, -0.3);
  legBL.castShadow = true;
  group.add(legBL);
  
  const legBR = new THREE.Mesh(legGeom, legMat);
  legBR.position.set(0.3, 0.2, -0.3);
  legBR.castShadow = true;
  group.add(legBR);
  
  group.castShadow = true;
  group.receiveShadow = true;
  return group;
}

// Create 3D Sofa
function createSofa() {
  const group = new THREE.Group();
  
  // Main cushion
  const cushionGeom = new THREE.BoxGeometry(2.5, 0.8, 1);
  const cushionMat = new THREE.MeshPhongMaterial({ color: 0x00AA44 });
  const cushion = new THREE.Mesh(cushionGeom, cushionMat);
  cushion.position.y = 0.6;
  cushion.castShadow = true;
  group.add(cushion);
  
  // Base
  const baseGeom = new THREE.BoxGeometry(2.5, 0.3, 1);
  const baseMat = new THREE.MeshPhongMaterial({ color: 0x2d4a40 });
  const base = new THREE.Mesh(baseGeom, baseMat);
  base.position.y = 0.15;
  group.add(base);
  
  // Left armrest
  const armrestGeom = new THREE.BoxGeometry(0.4, 1, 1);
  const armrestMat = new THREE.MeshPhongMaterial({ color: 0x00AA44 });
  const leftArm = new THREE.Mesh(armrestGeom, armrestMat);
  leftArm.position.set(-1.15, 0.8, 0);
  leftArm.castShadow = true;
  group.add(leftArm);
  
  // Right armrest
  const rightArm = new THREE.Mesh(armrestGeom, armrestMat);
  rightArm.position.set(1.15, 0.8, 0);
  rightArm.castShadow = true;
  group.add(rightArm);
  
  // Back cushion
  const backCushionGeom = new THREE.BoxGeometry(2.5, 0.8, 0.3);
  const backCushion = new THREE.Mesh(backCushionGeom, cushionMat);
  backCushion.position.set(0, 1.5, -0.4);
  backCushion.castShadow = true;
  group.add(backCushion);
  
  group.castShadow = true;
  group.receiveShadow = true;
  return group;
}

// Initialize 3D Scene
function init3DScene(containerId, createObject, autoRotate = true) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn('Container not found:', containerId);
    return;
  }
  
  const width = container.clientWidth || 300;
  const height = container.clientHeight || 300;
  
  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);
  
  // Camera
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(0, 0.5, 2.5);
  
  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowShadowMap;
  
  container.appendChild(renderer.domElement);
  
  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
  directionalLight.position.set(5, 8, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.left = -10;
  directionalLight.shadow.camera.right = 10;
  directionalLight.shadow.camera.top = 10;
  directionalLight.shadow.camera.bottom = -10;
  scene.add(directionalLight);
  
  // Create object
  const object = createObject();
  scene.add(object);
  
  // Ground plane
  const groundGeom = new THREE.PlaneGeometry(5, 5);
  const groundMat = new THREE.ShadowMaterial({ opacity: 0.2 });
  const ground = new THREE.Mesh(groundGeom, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.1;
  ground.receiveShadow = true;
  scene.add(ground);
  
  // Mouse interaction
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  
  renderer.domElement.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = { x: e.clientX, y: e.clientY };
  });
  
  renderer.domElement.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      
      object.rotation.y += deltaX * 0.01;
      object.rotation.x += deltaY * 0.01;
      
      previousMousePosition = { x: e.clientX, y: e.clientY };
    }
  });
  
  renderer.domElement.addEventListener('mouseup', () => {
    isDragging = false;
  });
  
  renderer.domElement.addEventListener('mouseleave', () => {
    isDragging = false;
  });
  
  // Touch support
  renderer.domElement.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  });
  
  renderer.domElement.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;
      
      object.rotation.y += deltaX * 0.01;
      object.rotation.x += deltaY * 0.01;
      
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  });
  
  renderer.domElement.addEventListener('touchend', () => {
    isDragging = false;
  });
  
  // Animation loop
  const animate = () => {
    requestAnimationFrame(animate);
    
    if (autoRotate && !isDragging) {
      object.rotation.y += 0.005;
    }
    
    renderer.render(scene, camera);
  };
  
  animate();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });
}
  
// Initialize all 3D scenes
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    // Product cards only - no 3D in hero, just show the image
    init3DScene('canvas-small-chair', () => {
      const chair = createChair(0x8B4513); // Brown
      chair.scale.set(1.2, 1.2, 1.2);
      return chair;
    }, true);
    
    init3DScene('canvas-dining-chair', () => {
      const chair = createChair(0xD2B48C); // Tan
      chair.scale.set(1.2, 1.2, 1.2);
      return chair;
    }, true);
    
    init3DScene('canvas-cream-chair', () => {
      const chair = createChair(0xFFFDD0); // Cream
      chair.scale.set(1.2, 1.2, 1.2);
      return chair;
    }, true);
  }, 100);
});

// Cart functions
function add() {
  alert('Item added to cart!');
}

function addTocart() {
  alert('Cart button clicked!');
}
  */
