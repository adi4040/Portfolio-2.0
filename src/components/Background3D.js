import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Background3D = () => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const starsRef = useRef(null);
  const infinityTracerRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const isMobile = window.innerWidth <= 768;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: isMobile ? "low-power" : "high-performance"
    });

    const pixelRatio = isMobile ? 1 : Math.min(window.devicePixelRatio, 2);
    const starCount = isMobile ? 5000 : 15000;

    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    container.appendChild(renderer.domElement);

    // Starfield
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

    // Infinity Curve Tracer
    class InfinityCurve extends THREE.Curve {
      constructor(scale = 1) { 
        super(); 
        this.scale = scale; 
      }
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
    const initialTracerXOffset = isMobile ? 2.0 : 3.5;
    infinityTracer.position.x = initialTracerXOffset;

    // Animation variables
    let targetRotX = Math.PI / 6;
    let targetRotY = Math.PI / 8;
    let currentRotX = targetRotX;
    let currentRotY = targetRotY;
    let baseTracerOpacityTarget = tracerBaseOpacity;
    let currentTracerOpacity = tracerBaseOpacity;
    const minTracerScale = isMobile ? 0.95 : 1.0;
    const maxTracerScale = isMobile ? 1.15 : 1.35;
    let targetTracerScale = minTracerScale;
    let currentTracerScale = targetTracerScale;

    // Scroll event handler
    const updateScrollTargets = () => {
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

      const scaleRange = maxTracerScale - minTracerScale;
      targetTracerScale = Math.max(
        minTracerScale,
        Math.min(maxTracerScale, minTracerScale + scaleRange * scrollPercent)
      );
    };

    window.addEventListener('scroll', updateScrollTargets);
    updateScrollTargets();

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

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

      // Smoothly scale the tracer toward the target scale
      const scaleLerp = 0.08;
      currentTracerScale += (targetTracerScale - currentTracerScale) * scaleLerp;
      infinityTracer.scale.set(currentTracerScale, currentTracerScale, currentTracerScale);

      // Stars rotation
      stars.rotation.y += isMobile ? 0.00005 : 0.0001;

      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    let resizeTimeout;
    const resizeHandler = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 250);
    };

    window.addEventListener('resize', resizeHandler);

    // Performance: pause when tab hidden on mobile
    if (isMobile) {
      const visibilityHandler = () => {
        if (document.hidden) {
          cancelAnimationFrame(animationIdRef.current);
        } else {
          animate();
        }
      };
      document.addEventListener('visibilitychange', visibilityHandler);
    }

    // Store refs for cleanup
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
    starsRef.current = stars;
    infinityTracerRef.current = infinityTracer;

    // Cleanup function
    return () => {
      window.removeEventListener('scroll', updateScrollTargets);
      window.removeEventListener('resize', resizeHandler);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div id="webgl-container" ref={containerRef} className="blurred-background" />;
};

export default Background3D;
