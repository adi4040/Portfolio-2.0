import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

document.addEventListener('DOMContentLoaded', function() {
  // --- Mobile Navigation Logic ---
  const sideNav = document.getElementById('side-nav');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navClose = document.getElementById('nav-close');
  const navOverlay = document.getElementById('nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link-side');
  const sections = document.querySelectorAll('section[id]');
  const researchSection = document.getElementById('research');

  const isMobile = window.innerWidth <= 768;

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
      sideNav?.classList.add('active');
      navOverlay?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeMobileMenu() {
    sideNav?.classList.remove('active');
    navOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (navClose) navClose.addEventListener('click', closeMobileMenu);
  if (navOverlay) navOverlay.addEventListener('click', closeMobileMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        if (isMobile) closeMobileMenu();
        setTimeout(() => {
          const offsetTop = targetSection.offsetTop - (isMobile ? 60 : 0);
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }, isMobile ? 300 : 0);
      }
    });
  });

  function highlightActiveSection() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
    scrollTimeout = requestAnimationFrame(highlightActiveSection);
  });

  // --- Intersection/Scroll Animations (for content visibility) ---
  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        animationObserver.unobserve(entry.target);
      }
    });
  }, { threshold: isMobile ? 0.1 : 0.15, rootMargin: isMobile ? '0px' : '50px' });

  document.querySelectorAll('.animate-on-scroll').forEach(el => animationObserver.observe(el));

  // --- Three.js Scene Setup ---
  const container = document.getElementById('webgl-container');

  const pixelRatio = isMobile ? 1 : Math.min(window.devicePixelRatio, 2);
  const starCount = isMobile ? 5000 : 15000;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    antialias: !isMobile,
    alpha: true,
    powerPreference: isMobile ? "low-power" : "high-performance"
  });

  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.5;
  container.appendChild(renderer.domElement);

  // --- Post-processing (desktop only) ---
  let composer, bloomPass;
  if (!isMobile) {
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.4,
      0.6,
      0.12
    );
    composer.addPass(bloomPass);
  }

  // --- Starfield ---
  const starGeometry = new THREE.BufferGeometry();
  const starVertices = [];
  for (let i = 0; i < starCount; i++) {
    starVertices.push(
      (Math.random() - 0.5) * 3000,
      (Math.random() - 0.5) * 3000,
      (Math.random() - 0.5) * 2000
    );
  }
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
  const starMaterial = new THREE.PointsMaterial({
    size: isMobile ? 1.2 : 1.5,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    color: 0x64748b
  });
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  // --- Infinity Curve Tracer (scroll-reactive) ---
  class InfinityCurve extends THREE.Curve {
    constructor(scale = 1) { super(); this.scale = scale; }
    getPoint(t, target = new THREE.Vector3()) {
      const a = this.scale;
      const t2 = 2 * Math.PI * t;
      const x = a * Math.sqrt(2) * Math.cos(t2) / (Math.sin(t2) ** 2 + 1);
      const y = a * Math.sqrt(2) * Math.cos(t2) * Math.sin(t2) / (Math.sin(t2) ** 2 + 1);
      return target.set(x, y, 0);
    }
  }

  const infinityPath = new InfinityCurve(isMobile ? 10 : 12);
  const tubeSegments = isMobile ? 256 : 512;
  const tubeRadius = isMobile ? 0.15 : 0.2;
  const tubeGeometry = new THREE.TubeGeometry(infinityPath, tubeSegments, tubeRadius, 12, false);

  const tracerBaseOpacity = isMobile ? 0.85 : 0.95;
  let tubeMaterial;

  if (isMobile) {
    tubeMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0080,
      transparent: true,
      opacity: tracerBaseOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  } else {
    tubeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        color1: { value: new THREE.Color(0xff0040) },
        color2: { value: new THREE.Color(0x0080ff) },
        opacity: { value: tracerBaseOpacity }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform float opacity;
        void main() {
          float p = fract(vUv.x - time);
          float intensity = smoothstep(0.0, 0.3, p) * smoothstep(1.0, 0.7, p);
          vec3 color = mix(color1, color2, vUv.x);
          gl_FragColor = vec4(color * intensity, intensity * opacity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  }

  const infinityTracer = new THREE.Mesh(tubeGeometry, tubeMaterial);
  scene.add(infinityTracer);

  camera.position.z = isMobile ? 40 : 35;

  // Scroll-reactive rotation and base opacity for the tracer
  let targetRotX = Math.PI / 6;
  let targetRotY = Math.PI / 8;
  let currentRotX = targetRotX;
  let currentRotY = targetRotY;

  let baseTracerOpacityTarget = tracerBaseOpacity;
  let currentTracerOpacity = tracerBaseOpacity;

  function updateScrollTargets() {
    const scrollY = window.scrollY;
    const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
    const scrollPercent = scrollY / maxScroll;

    const rxFactor = isMobile ? 0.0003 : 0.0005;
    const ryFactor = isMobile ? 0.00015 : 0.00025;

    targetRotX = Math.PI / 6 + scrollY * rxFactor;
    targetRotY = Math.PI / 8 + scrollY * ryFactor;

    const fadeStart = 0.4;
    if (scrollPercent > fadeStart) {
      const fade = 1.0 - (scrollPercent - fadeStart) / (0.5);
      baseTracerOpacityTarget = Math.max(0.2, tracerBaseOpacity * fade);
    } else {
      baseTracerOpacityTarget = tracerBaseOpacity;
    }
  }
  window.addEventListener('scroll', updateScrollTargets);
  updateScrollTargets();

  function setTracerOpacity(op) {
    if (tubeMaterial.uniforms && tubeMaterial.uniforms.opacity) {
      tubeMaterial.uniforms.opacity.value = op;
    } else if ('opacity' in tubeMaterial) {
      tubeMaterial.opacity = op;
    }
  }

  // Helpers
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (t) => t * t * (3 - 2 * t);

  // --- Brain + Neural Network (Research section) - UPDATED FOR REALISTIC BRAIN ---
  const brainRadiusWorld = isMobile ? 8.0 : 10.0;
  let brainGroup, leftHemi, rightHemi, brainMaterials = [], nodesMaterial, linesMaterial;
  let leftBound = -15, rightBound = 15;

  function updateHorizontalBounds() {
    const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * camera.position.z;
    const halfW = halfH * camera.aspect;
    const margin = brainRadiusWorld * 1.2;
    leftBound = -halfW - margin;
    rightBound = halfW + margin;
  }
  updateHorizontalBounds();

  function brainHemisphereMaterial() {
    // Realistic brain colors - muted, anatomical
    const base = new THREE.Color(0xE8C4C4);      // light pinkish-gray tissue
    const sulcus = new THREE.Color(0xB08080);    // darker grooves
    const highlight = new THREE.Color(0xF0D0D0); // subtle highlights

    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uOpacity: { value: 0.85 },
        uBaseColor: { value: base },
        uSulcusColor: { value: sulcus },
        uHighlightColor: { value: highlight },
      },
      vertexShader: `
        uniform float uTime;
        varying float vGyri;
        varying vec3 vNormal;
        varying vec3 vPosition;

        // 3D simplex noise (Ashima)
        vec3 mod289(vec3 x){return x - floor(x*(1.0/289.0))*289.0;}
        vec4 mod289(vec4 x){return x - floor(x*(1.0/289.0))*289.0;}
        vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
        float snoise(vec3 v){
          const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
          const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy) );
          vec3 x0 = v - i + dot(i, C.xxx) ;
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min( g.xyz, l.zxy );
          vec3 i2 = max( g.xyz, l.zxy );
          vec3 x1 = x0 - i1 + 1.0 * C.xxx;
          vec3 x2 = x0 - i2 + 2.0 * C.xxx;
          vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
          i = mod289(i);
          vec4 p = permute( permute( permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                  + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                  + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
          float n_ = 1.0/7.0;
          vec3  ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_ );
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4( x.xy, y.xy );
          vec4 b1 = vec4( x.zw, y.zw );
                    vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
          vec3 p0 = vec3(a0.xy,h.x);
          vec3 p1 = vec3(a0.zw,h.y);
          vec3 p2 = vec3(a1.xy,h.z);
          vec3 p3 = vec3(a1.zw,h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                        dot(p2,x2), dot(p3,x3) ) );
        }
        float ridge(float n){ n=1.0-abs(n); return n*n; }

        float ridgedMF(vec3 p) {
          float sum = 0.0;
          float amp = 0.5;
          float freq = 1.0;
          for (int i = 0; i < 4; i++) {
            sum += ridge(snoise(p * freq)) * amp;
            freq *= 2.2;
            amp *= 0.5;
          }
          return sum;
        }

        void main() {
          // Ellipsoid shaping for realistic brain proportions
          vec3 pos = position;
          pos.x *= 0.9;
          pos.y *= 1.1;
          pos.z *= 1.0;

          // Create brain folds (gyri and sulci) - more subtle
          vec3 aniso = vec3(1.5, 1.0, 1.2);
          float folds = ridgedMF(normalize(pos) * 2.8) * 0.6
                      + 0.3 * ridgedMF(pos * aniso * 0.3);
          float micro = ridgedMF(pos * 1.5) * 0.2;
          float disp = folds + micro;

          // Deeper central fissure
          vec4 worldPre = modelMatrix * vec4(pos, 1.0);
          float fissureW = 0.8;
          float fissure = 1.0 - smoothstep(fissureW, fissureW + 1.2, abs(worldPre.x));
          pos.x += sign(worldPre.x) * (0.8 * fissure);

          // Apply displacement
          vec3 displaced = pos + normalize(pos) * disp * 0.7;

          vGyri = folds;
          vNormal = normalize(normalMatrix * normal);
          vPosition = displaced;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        uniform vec3 uBaseColor;
        uniform vec3 uSulcusColor;
        uniform vec3 uHighlightColor;
        varying float vGyri;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          // Simple diffuse lighting
          vec3 lightDir = normalize(vec3(0.5, 1.0, 0.5));
          float NdotL = max(dot(vNormal, lightDir), 0.0);
          
          // Ambient + diffuse
          float ambient = 0.4;
          float diffuse = 0.6 * NdotL;
          float lighting = ambient + diffuse;

          // Mix colors based on gyri/sulci
          float gyri = smoothstep(0.3, 0.7, vGyri);
          vec3 baseColor = mix(uSulcusColor, uBaseColor, gyri);
          
          // Add subtle highlights on raised areas
          vec3 color = mix(baseColor, uHighlightColor, gyri * 0.2) * lighting;

          // Output with no glow/bloom
          gl_FragColor = vec4(color, uOpacity);
        }
      `,
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: true,
      side: THREE.FrontSide
    });
  }

  function createBrainGroup() {
    const group = new THREE.Group();

    // Higher tessellation for cleaner folds
    const segU = isMobile ? 48 : 96;
    const segV = isMobile ? 36 : 72;
    const hemiGeo = new THREE.SphereGeometry(brainRadiusWorld, segU, segV);

    if (isMobile) {
      // Simple material for mobile
      const simpleMat = new THREE.MeshPhongMaterial({
        color: 0xE8C4C4,
        shininess: 10,
        transparent: true,
        opacity: 0.8,
        depthWrite: true
      });
      leftHemi = new THREE.Mesh(hemiGeo, simpleMat.clone());
      rightHemi = new THREE.Mesh(hemiGeo, simpleMat.clone());
    } else {
      const matL = brainHemisphereMaterial();
      const matR = brainHemisphereMaterial();
      brainMaterials.push(matL, matR);
      leftHemi = new THREE.Mesh(hemiGeo, matL);
      rightHemi = new THREE.Mesh(hemiGeo, matR);
    }

    // Hemisphere separation
    const gap = isMobile ? 0.8 : 1.2;
    leftHemi.position.x = -gap;
    rightHemi.position.x = gap;

    // Set render order to ensure brain renders properly
    leftHemi.renderOrder = 10;
    rightHemi.renderOrder = 10;

    group.add(leftHemi);
    group.add(rightHemi);

    // Remove or significantly reduce neural network visibility
    const nodeCount = isMobile ? 30 : 50;
    const innerR = brainRadiusWorld + 2.0;
    const outerR = brainRadiusWorld + 3.0;

    const nodesPositions = [];
    for (let i = 0; i < nodeCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = innerR + (outerR - innerR) * Math.random();
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      nodesPositions.push(x, y, z);
    }

    const nodesGeometry = new THREE.BufferGeometry();
    nodesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(nodesPositions, 3));
    nodesMaterial = new THREE.PointsMaterial({
      color: 0x808080,  // Gray instead of cyan
      size: isMobile ? 0.4 : 0.5,
      transparent: true,
      opacity: 0.1,  // Very subtle
      blending: THREE.NormalBlending,
      depthWrite: false
    });
    const nodes = new THREE.Points(nodesGeometry, nodesMaterial);
    group.add(nodes);

    // Very subtle connection lines
    const linesPositions = [];
    const maxDist = isMobile ? 2.5 : 3.0;
    const p = nodesGeometry.attributes.position.array;
    for (let i = 0; i < nodeCount; i++) {
      const ix = i * 3;
      for (let j = i + 1; j < nodeCount; j++) {
        const jx = j * 3;
        const dx = p[ix] - p[jx];
        const dy = p[ix + 1] - p[jx + 1];
        const dz = p[ix + 2] - p[jx + 2];
        const d = Math.sqrt(dx*dx + dy*dy + dz*dz);
        if (d < maxDist && Math.random() < 0.2) {  // Fewer connections
          linesPositions.push(
            p[ix], p[ix + 1], p[ix + 2],
            p[jx], p[jx + 1], p[jx + 2]
          );
        }
      }
    }

    const linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linesPositions, 3));
    linesMaterial = new THREE.LineBasicMaterial({
      color: 0x606060,  // Gray
      transparent: true,
      opacity: 0.08,  // Very subtle
      blending: THREE.NormalBlending,
      depthWrite: false
    });
    const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
    group.add(lines);

    // Add simple lighting for the brain
    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(5, 10, 5);
    group.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    group.add(ambientLight);

    group.visible = false;
    return group;
  }

  brainGroup = createBrainGroup();
  scene.add(brainGroup);

  // --- Scroll Mapping for Research ---
  function getResearchProgress() {
    if (!researchSection) return 0;
    const top = researchSection.offsetTop;
    const height = researchSection.offsetHeight;
    const y = window.scrollY;
    const start = top - window.innerHeight * 0.3;
    const end = top + height - window.innerHeight * 0.4;
    const raw = (y - start) / (end - start);
    return clamp(raw, 0, 1);
  }

  // --- Animation Loop ---
  const clock = new THREE.Clock();
  let animationId;

  // Cross fade controller for tracer while brain is visible
  let brainPresence = 0.0;

  function animate() {
    animationId = requestAnimationFrame(animate);

    const t = clock.getElapsedTime();

    // Infinity tracer motion
    if (!isMobile && tubeMaterial.uniforms) {
      tubeMaterial.uniforms.time.value = t * 0.2;
    }
    const rotLerp = 0.08;
    currentRotX += (targetRotX - currentRotX) * rotLerp;
    currentRotY += (targetRotY - currentRotY) * rotLerp;
    infinityTracer.rotation.x = currentRotX;
    infinityTracer.rotation.y = currentRotY;

    // Stars
    stars.rotation.y += isMobile ? 0.00005 : 0.0001;

    // Brain behavior across Research section
    const rp = getResearchProgress();
    const targetPresence = (rp > 0.0 && rp < 1.0) ? 1.0 : 0.0;
    brainPresence += (targetPresence - brainPresence) * 0.15;

    brainGroup.visible = brainPresence > 0.01;

    if (brainGroup.visible) {
      const rpEase = smooth(rp);
      // Move across screen
      brainGroup.position.x = lerp(leftBound, rightBound, rpEase);
      brainGroup.position.y = Math.sin(t * 0.4) * 0.5;  // Gentler bobbing
      brainGroup.rotation.y = -0.25 + rpEase * 0.75 + Math.sin(t * 0.2) * 0.03;
      brainGroup.rotation.x = 0.15 + Math.cos(t * 0.3) * 0.03;

      // Update shader time
      brainMaterials.forEach(mat => { if (mat.uniforms?.uTime) mat.uniforms.uTime.value = t; });
    }

    // Cross-fade tracer
    const targetTracerOpacity = baseTracerOpacityTarget * (1.0 - 0.7 * brainPresence);
    currentTracerOpacity += (targetTracerOpacity - currentTracerOpacity) * 0.08;
    setTracerOpacity(currentTracerOpacity);

    // Don't reduce bloom for brain - it shouldn't glow
    if (bloomPass) {
      bloomPass.strength = 1.4;  // Keep constant bloom for other elements
    }

    camera.lookAt(0, 0, 0);

    if (composer && !isMobile) {
      composer.render();
    } else {
      renderer.render(scene, camera);
    }
  }

  animate();

  // --- Handle Resize ---
  function handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    if (composer && !isMobile) composer.setSize(width, height);
    updateHorizontalBounds();
  }

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 250);
  });

  // --- Typing Effect ---
  const phrases = [
    "I build things for the web.",
    "I create intelligent solutions.",
    "I solve complex problems.",
    "I turn ideas into reality."
  ];
  let phraseIndex = 0, charIndex = 0, isDeleting = false;
  const typingElement = document.getElementById('typing-text');

  if (typingElement) {
    function typeEffect() {
      const currentPhrase = phrases[phraseIndex];
      if (isDeleting) {
        typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
      }
      let typeSpeed = isDeleting ? 50 : 100;
      if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
      setTimeout(typeEffect, typeSpeed);
    }
    typeEffect();
  }

  // --- Performance: pause when tab hidden on mobile ---
  if (isMobile) {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(animationId)
      else animate();
    });
  }
});