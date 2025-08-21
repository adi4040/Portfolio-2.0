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



  // --- Animation Loop ---
  const clock = new THREE.Clock();
  let animationId;

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