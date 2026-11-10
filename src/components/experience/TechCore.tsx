import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { CoreFallback } from "./CoreFallback";

type Props = { mode: number; paused: boolean };
export default function TechCore({ mode, paused }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const update = useRef<(mode: number, paused: boolean) => void>(() => {});
  const [fallback, setFallback] = useState(false);
  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      setFallback(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0xffffff, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    const canvas = renderer.domElement;
    canvas.setAttribute(
      "aria-label",
      "Interactive maroon 3D engineering model. Drag to rotate.",
    );
    canvas.setAttribute("role", "img");
    container.appendChild(canvas);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 60);
    camera.position.set(0, 0.35, 8.5);
    camera.lookAt(0, 0.05, 0);
    const environment = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environmentMap = pmrem.fromScene(environment, 0.04);
    scene.environment = environmentMap.texture;
    environment.dispose();
    pmrem.dispose();
    const group = new THREE.Group();
    group.rotation.set(0.23, -0.3, 0.05);
    scene.add(group);
    const red = new THREE.MeshPhysicalMaterial({
      color: "#6d001a",
      metalness: 0.82,
      roughness: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      envMapIntensity: 2.3,
    });
    const white = new THREE.MeshPhysicalMaterial({
      color: "#f9eff2",
      metalness: 0.55,
      roughness: 0.19,
      clearcoat: 1,
      envMapIntensity: 1.7,
    });
    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.77, 0.245, 128, 20, 2, 3),
      red,
    );
    const crystal = new THREE.Mesh(new THREE.IcosahedronGeometry(1.13, 0), red);
    const inner = new THREE.Mesh(new THREE.OctahedronGeometry(0.83, 0), white);
    inner.rotation.z = Math.PI / 4;
    const lattice = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.5, 1)),
      new THREE.LineBasicMaterial({
        color: "#8a1533",
        transparent: true,
        opacity: 0.37,
      }),
    );
    const engineering = new THREE.Group();
    engineering.add(inner, lattice);
    const objects = [knot, crystal, engineering];
    objects.forEach((object) => group.add(object));
    const shell = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.86, 0)),
      new THREE.LineBasicMaterial({
        color: "#93364b",
        transparent: true,
        opacity: 0.1,
      }),
    );
    group.add(shell);
    const rings = new THREE.Group();
    scene.add(rings);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: "#a5495e",
      transparent: true,
      opacity: 0.24,
    });
    for (let index = 0; index < 3; index++) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.95 + index * 0.13, 0.007, 5, 120),
        ringMaterial,
      );
      ring.rotation.set(0.55 + index * 0.7, 0.3 + index * 0.75, 0.2);
      rings.add(ring);
    }
    const orbiters: THREE.Mesh[] = [];
    for (let index = 0; index < 5; index++) {
      const orb = new THREE.Mesh(
        new THREE.SphereGeometry(index % 2 ? 0.055 : 0.08, 12, 10),
        index % 2 ? white : red,
      );
      const angle = index * 1.3;
      orb.position.set(
        Math.cos(angle) * (2.05 + index * 0.035),
        Math.sin(angle),
        Math.sin(angle + index) * 1.1,
      );
      scene.add(orb);
      orbiters.push(orb);
    }
    scene.add(new THREE.AmbientLight("#ffffff", 2));
    const key = new THREE.DirectionalLight("#ffffff", 3.5);
    key.position.set(4, 6, 5);
    scene.add(key);
    const rim = new THREE.DirectionalLight("#ffb8c7", 2);
    rim.position.set(-4, 2, -2);
    scene.add(rim);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let lostContext = false;
    let stopped = paused,
      visible = true,
      activeMode = mode,
      frame = 0,
      previous = 0,
      time = 0,
      dragging = false;
    let pointerX = 0,
      pointerY = 0,
      lastX = 0,
      lastY = 0;
    function resize() {
      const width = container!.clientWidth,
        height = container!.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
      renderOnce();
    }
    function renderOnce() {
      renderer.render(scene, camera);
    }
    function applyMode(nextMode: number, nextPaused: boolean) {
      activeMode = nextMode;
      stopped = nextPaused;
      objects.forEach((object, index) => {
        object.visible = index === activeMode;
      });
      renderOnce();
      schedule();
    }
    function schedule() {
      if (
        !lostContext &&
        !frame &&
        visible &&
        !document.hidden &&
        !reduced.matches &&
        !stopped
      )
        frame = requestAnimationFrame(tick);
    }
    function tick(now: number) {
      frame = 0;
      const delta = previous ? Math.min((now - previous) / 1000, 0.04) : 0;
      previous = now;
      time += delta;
      if (!dragging) {
        group.rotation.y += delta * 0.14;
        group.rotation.x += (0.2 + pointerY * 0.18 - group.rotation.x) * 0.035;
      }
      group.position.y = Math.sin(time * 0.7) * 0.07;
      rings.rotation.y = time * 0.045;
      rings.rotation.z = Math.sin(time * 0.15) * 0.12;
      shell.rotation.y = -time * 0.07;
      camera.position.x += (pointerX * 0.24 - camera.position.x) * 0.04;
      camera.lookAt(0, 0.05, 0);
      orbiters.forEach((orb, index) => {
        const angle = time * (0.15 + index * 0.025) + index * 1.3;
        orb.position.set(
          Math.cos(angle) * (2.05 + index * 0.035),
          Math.sin(angle) * 1.0,
          Math.sin(angle + index) * 1.1,
        );
      });
      renderOnce();
      schedule();
    }
    const move = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      if (dragging) {
        group.rotation.y += (event.clientX - lastX) * 0.009;
        group.rotation.x += (event.clientY - lastY) * 0.009;
        lastX = event.clientX;
        lastY = event.clientY;
        renderOnce();
      }
    };
    const down = (event: PointerEvent) => {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
    };
    const up = () => {
      dragging = false;
    };
    const resetPointer = () => {
      pointerX = pointerY = 0;
    };
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
        previous = 0;
      } else schedule();
    };
    const preference = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      renderOnce();
      schedule();
    };
    const lost = (event: Event) => {
      event.preventDefault();
      lostContext = true;
      visible = false;
      cancelAnimationFrame(frame);
      frame = 0;
      setFallback(true);
    };
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("pointerleave", resetPointer);
    canvas.addEventListener("webglcontextlost", lost);
    document.addEventListener("visibilitychange", visibility);
    reduced.addEventListener("change", preference);
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? false;
      if (visible) schedule();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
        previous = 0;
      }
    });
    observer.observe(container);
    const sizes = new ResizeObserver(resize);
    sizes.observe(container);
    update.current = applyMode;
    applyMode(mode, paused);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      sizes.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", preference);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("pointerleave", resetPointer);
      canvas.removeEventListener("webglcontextlost", lost);
      scene.traverse((object) => {
        if (
          object instanceof THREE.Mesh ||
          object instanceof THREE.LineSegments
        ) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      environmentMap.dispose();
      renderer.dispose();
      canvas.remove();
      update.current = () => {};
    };
    // The scene lives across mode changes; only visibility/state is updated.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => update.current(mode, paused), [mode, paused]);
  return (
    <div className="rq-webgl-host" ref={host}>
      {fallback && <CoreFallback />}
    </div>
  );
}
