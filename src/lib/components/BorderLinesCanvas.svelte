<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import {
		getEffectivePixelRatio,
		shouldAnimate,
		shouldRenderFrame
	} from '$lib/utils/canvasPerformance';

	let canvas: HTMLCanvasElement | undefined = $state();

	onMount(() => {
		if (!canvas) return;

		const renderer = new THREE.WebGLRenderer({
			canvas,
			alpha: true,
			antialias: true
		});
		renderer.setPixelRatio(getEffectivePixelRatio(window.devicePixelRatio));

		const scene = new THREE.Scene();
		const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
		camera.position.z = 1;

		const lineCount = 6;
		const lines: {
			mesh: THREE.Line;
			speed: number;
			offset: number;
			side: number;
		}[] = [];

		for (let i = 0; i < lineCount; i++) {
			const points = [];
			const segments = 40;
			for (let j = 0; j <= segments; j++) {
				points.push(new THREE.Vector3(0, (j / segments) * 2 - 1, 0));
			}

			const geometry = new THREE.BufferGeometry().setFromPoints(points);
			const material = new THREE.LineBasicMaterial({
				color: new THREE.Color('#EC104B'),
				transparent: true,
				opacity: 0.08 + Math.random() * 0.06
			});

			const line = new THREE.Line(geometry, material);
			const side = i % 2 === 0 ? -1 : 1;
			line.position.x = side * 0.98;
			scene.add(line);

			lines.push({
				mesh: line,
				speed: 0.15 + Math.random() * 0.2,
				offset: Math.random() * Math.PI * 2,
				side
			});
		}

		function resize() {
			if (!canvas) return;
			const parent = canvas.parentElement;
			if (!parent) return;
			const w = parent.clientWidth;
			const h = parent.clientHeight;
			renderer.setPixelRatio(getEffectivePixelRatio(window.devicePixelRatio));
			renderer.setSize(w, h);
			const aspect = w / h;
			camera.left = -aspect;
			camera.right = aspect;
			camera.top = 1;
			camera.bottom = -1;
			camera.updateProjectionMatrix();
		}

		resize();
		window.addEventListener('resize', resize);

		let time = 0;
		let animId: number | undefined;
		let lastFrameTime = 0;
		let isTabVisible = document.visibilityState === 'visible';
		let isInViewport = true;
		let observer: IntersectionObserver | undefined;

		const targetFps = 30;
		const timeIncrementPerMs = 0.00048;

		function startAnimation() {
			if (animId !== undefined) return;
			lastFrameTime = performance.now();
			animId = requestAnimationFrame(animate);
		}

		function stopAnimation() {
			if (animId === undefined) return;
			cancelAnimationFrame(animId);
			animId = undefined;
		}

		function syncAnimationState() {
			if (shouldAnimate({ isTabVisible, isInViewport })) {
				startAnimation();
				return;
			}

			stopAnimation();
		}

		function handleVisibilityChange() {
			isTabVisible = document.visibilityState === 'visible';
			syncAnimationState();
		}

		function animate(now: number) {
			animId = requestAnimationFrame(animate);

			if (!shouldRenderFrame(now, lastFrameTime, targetFps)) return;

			const deltaMs = now - lastFrameTime;
			lastFrameTime = now;
			time += deltaMs * timeIncrementPerMs;

			for (const l of lines) {
				const positions = l.mesh.geometry.attributes.position;
				const count = positions.count;

				for (let i = 0; i < count; i++) {
					const t = i / (count - 1);
					const wave = Math.sin(t * Math.PI * 2 + time * l.speed + l.offset) * 0.008;
					positions.setX(i, l.side * 0.98 + wave);
					positions.setY(i, t * 2 - 1 + Math.sin(time * l.speed + l.offset) * 0.3);
				}
				positions.needsUpdate = true;

				const mat = l.mesh.material as THREE.LineBasicMaterial;
				mat.opacity = 0.06 + Math.sin(time * 0.5 + l.offset) * 0.04;
			}

			renderer.render(scene, camera);
		}

		document.addEventListener('visibilitychange', handleVisibilityChange);

		observer = new IntersectionObserver((entries) => {
			isInViewport = entries.some((entry) => entry.isIntersecting);
			syncAnimationState();
		});
		observer.observe(canvas);

		syncAnimationState();

		return () => {
			stopAnimation();
			window.removeEventListener('resize', resize);
			document.removeEventListener('visibilitychange', handleVisibilityChange);
			observer?.disconnect();
			renderer.dispose();
			for (const l of lines) {
				l.mesh.geometry.dispose();
				(l.mesh.material as THREE.LineBasicMaterial).dispose();
			}
		};
	});
</script>

<canvas
	bind:this={canvas}
	class="pointer-events-none absolute inset-0 z-0 h-full w-full"
	aria-hidden="true"
></canvas>
