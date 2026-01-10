import { useEffect, useRef } from 'react';
import { useSettings } from '../providers/SettingsProvider';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';

/**
 * Animated gradient background with organic, slow-moving motion
 * Uses canvas for smooth GPU-accelerated rendering
 */
export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const { settings } = useSettings();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle resize
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Gradient colors based on active gradient setting
    const getGradientColors = () => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);

      if (settings.activeGradient === 1) {
        return {
          start: `hsl(${computedStyle.getPropertyValue('--gradient-1-start').trim()})`,
          mid: `hsl(${computedStyle.getPropertyValue('--gradient-1-mid').trim()})`,
          end: `hsl(${computedStyle.getPropertyValue('--gradient-1-end').trim()})`,
        };
      } else {
        return {
          start: `hsl(${computedStyle.getPropertyValue('--gradient-2-start').trim()})`,
          mid: `hsl(${computedStyle.getPropertyValue('--gradient-2-mid').trim()})`,
          end: `hsl(${computedStyle.getPropertyValue('--gradient-2-end').trim()})`,
        };
      }
    };

    // Animation state
    let time = 0;
    const speed = 0.0003; // Very slow movement

    // Simplex noise approximation using sine waves
    const noise = (x: number, y: number, t: number) => {
      return (
        Math.sin(x * 0.01 + t) * 0.5 +
        Math.sin(y * 0.01 + t * 1.3) * 0.3 +
        Math.sin((x + y) * 0.005 + t * 0.7) * 0.2
      );
    };

    // Draw frame
    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Clear
      ctx.clearRect(0, 0, width, height);

      const colors = getGradientColors();

      // Calculate animated positions
      const centerX = width / 2 + Math.sin(time * 0.5) * width * 0.1;
      const centerY = height / 2 + Math.cos(time * 0.3) * height * 0.1;

      // Create radial gradient with moving center
      const gradient = ctx.createRadialGradient(
        centerX + noise(centerX, centerY, time) * 50,
        centerY + noise(centerY, centerX, time) * 50,
        0,
        width / 2,
        height / 2,
        Math.max(width, height)
      );

      gradient.addColorStop(0, colors.start);
      gradient.addColorStop(0.5, colors.mid);
      gradient.addColorStop(1, colors.end);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Add subtle secondary gradient blob
      const blob2X = width * 0.7 + Math.cos(time * 0.4) * width * 0.15;
      const blob2Y = height * 0.3 + Math.sin(time * 0.6) * height * 0.15;

      const gradient2 = ctx.createRadialGradient(
        blob2X,
        blob2Y,
        0,
        blob2X,
        blob2Y,
        width * 0.4
      );

      gradient2.addColorStop(0, 'hsla(260, 15%, 95%, 0.5)');
      gradient2.addColorStop(1, 'hsla(260, 15%, 95%, 0)');

      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, width, height);

      // Third blob for more organic movement
      const blob3X = width * 0.3 + Math.sin(time * 0.35) * width * 0.12;
      const blob3Y = height * 0.7 + Math.cos(time * 0.45) * height * 0.12;

      const gradient3 = ctx.createRadialGradient(
        blob3X,
        blob3Y,
        0,
        blob3X,
        blob3Y,
        width * 0.35
      );

      gradient3.addColorStop(0, 'hsla(40, 20%, 95%, 0.3)');
      gradient3.addColorStop(1, 'hsla(40, 20%, 95%, 0)');

      ctx.fillStyle = gradient3;
      ctx.fillRect(0, 0, width, height);

      // Update time
      if (!prefersReducedMotion) {
        time += speed * 16; // Approximate 60fps
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    // Start animation
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [settings.activeGradient, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{
        zIndex: 'var(--z-background)',
      }}
      aria-hidden="true"
    />
  );
}

