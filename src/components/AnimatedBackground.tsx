import { useEffect, useRef } from 'react';
import { useSettings } from '../providers/SettingsProvider';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';
import type { AnimationStyle } from '../types';

/**
 * Animated gradient background with multiple shader styles
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

    // Get speed multiplier based on animation style
    const getSpeedMultiplier = (style: AnimationStyle): number => {
      switch (style) {
        case 'slow': return 1;
        case 'medium': return 2.5;
        case 'fast': return 5;
        case 'waves': return 1.5;
        case 'spotlight': return 0.8;
        case 'none': return 0;
        default: return 1;
      }
    };

    // Gradient colors based on active gradient setting and theme
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
    const baseSpeed = 0.0003;
    const speedMultiplier = getSpeedMultiplier(settings.animationStyle);

    // Simplex noise approximation using sine waves
    const noise = (x: number, y: number, t: number) => {
      return (
        Math.sin(x * 0.01 + t) * 0.5 +
        Math.sin(y * 0.01 + t * 1.3) * 0.3 +
        Math.sin((x + y) * 0.005 + t * 0.7) * 0.2
      );
    };

    // Draw standard organic gradient
    const drawOrganic = (width: number, height: number) => {
      const colors = getGradientColors();

      const centerX = width / 2 + Math.sin(time * 0.5) * width * 0.1;
      const centerY = height / 2 + Math.cos(time * 0.3) * height * 0.1;

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

      // Secondary blob
      const blob2X = width * 0.7 + Math.cos(time * 0.4) * width * 0.15;
      const blob2Y = height * 0.3 + Math.sin(time * 0.6) * height * 0.15;

      const gradient2 = ctx.createRadialGradient(
        blob2X, blob2Y, 0,
        blob2X, blob2Y, width * 0.4
      );
      gradient2.addColorStop(0, 'hsla(260, 15%, 95%, 0.5)');
      gradient2.addColorStop(1, 'hsla(260, 15%, 95%, 0)');
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, width, height);

      // Third blob
      const blob3X = width * 0.3 + Math.sin(time * 0.35) * width * 0.12;
      const blob3Y = height * 0.7 + Math.cos(time * 0.45) * height * 0.12;

      const gradient3 = ctx.createRadialGradient(
        blob3X, blob3Y, 0,
        blob3X, blob3Y, width * 0.35
      );
      gradient3.addColorStop(0, 'hsla(40, 20%, 95%, 0.3)');
      gradient3.addColorStop(1, 'hsla(40, 20%, 95%, 0)');
      ctx.fillStyle = gradient3;
      ctx.fillRect(0, 0, width, height);
    };

    // Draw wave pattern
    const drawWaves = (width: number, height: number) => {
      const colors = getGradientColors();

      // Base gradient
      const baseGradient = ctx.createLinearGradient(0, 0, width, height);
      baseGradient.addColorStop(0, colors.start);
      baseGradient.addColorStop(0.5, colors.mid);
      baseGradient.addColorStop(1, colors.end);
      ctx.fillStyle = baseGradient;
      ctx.fillRect(0, 0, width, height);

      // Animated wave layers
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        const layerOffset = layer * 0.3;
        const amplitude = height * (0.1 + layer * 0.05);
        const frequency = 0.003 - layer * 0.0005;
        const yBase = height * (0.5 + layer * 0.15);

        for (let x = 0; x <= width; x += 5) {
          const y = yBase + 
            Math.sin(x * frequency + time * (1 + layerOffset)) * amplitude +
            Math.sin(x * frequency * 2 + time * 1.5) * amplitude * 0.3;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        const waveGradient = ctx.createLinearGradient(0, yBase - amplitude, 0, height);
        waveGradient.addColorStop(0, `hsla(${220 + layer * 20}, 20%, ${90 - layer * 5}%, ${0.3 - layer * 0.08})`);
        waveGradient.addColorStop(1, `hsla(${220 + layer * 20}, 20%, ${95 - layer * 3}%, 0)`);
        ctx.fillStyle = waveGradient;
        ctx.fill();
      }
    };

    // Draw spotlight effect (creates shadows on clock)
    const drawSpotlight = (width: number, height: number) => {
      const colors = getGradientColors();

      // Dark base for spotlight effect
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      ctx.fillStyle = isDark ? 'hsl(0, 0%, 4%)' : 'hsl(0, 0%, 98%)';
      ctx.fillRect(0, 0, width, height);

      // Main spotlight
      const spotX = width * 0.5 + Math.sin(time * 0.3) * width * 0.2;
      const spotY = height * 0.4 + Math.cos(time * 0.4) * height * 0.15;

      const spotlight = ctx.createRadialGradient(
        spotX, spotY, 0,
        spotX, spotY, Math.max(width, height) * 0.6
      );

      if (isDark) {
        spotlight.addColorStop(0, 'hsla(0, 0%, 20%, 0.8)');
        spotlight.addColorStop(0.3, 'hsla(0, 0%, 12%, 0.5)');
        spotlight.addColorStop(0.7, 'hsla(0, 0%, 6%, 0.2)');
        spotlight.addColorStop(1, 'hsla(0, 0%, 4%, 0)');
      } else {
        spotlight.addColorStop(0, 'hsla(0, 0%, 100%, 0.9)');
        spotlight.addColorStop(0.3, 'hsla(0, 0%, 98%, 0.6)');
        spotlight.addColorStop(0.7, 'hsla(0, 0%, 95%, 0.3)');
        spotlight.addColorStop(1, colors.end);
      }

      ctx.fillStyle = spotlight;
      ctx.fillRect(0, 0, width, height);

      // Secondary subtle light source
      const spot2X = width * 0.7 + Math.cos(time * 0.5) * width * 0.1;
      const spot2Y = height * 0.6 + Math.sin(time * 0.35) * height * 0.1;

      const spotlight2 = ctx.createRadialGradient(
        spot2X, spot2Y, 0,
        spot2X, spot2Y, width * 0.4
      );

      if (isDark) {
        spotlight2.addColorStop(0, 'hsla(40, 30%, 15%, 0.4)');
        spotlight2.addColorStop(1, 'hsla(40, 30%, 10%, 0)');
      } else {
        spotlight2.addColorStop(0, 'hsla(40, 50%, 97%, 0.6)');
        spotlight2.addColorStop(1, 'hsla(40, 50%, 95%, 0)');
      }

      ctx.fillStyle = spotlight2;
      ctx.fillRect(0, 0, width, height);
    };

    // Draw static gradient (no animation)
    const drawStatic = (width: number, height: number) => {
      const colors = getGradientColors();

      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height)
      );

      gradient.addColorStop(0, colors.start);
      gradient.addColorStop(0.5, colors.mid);
      gradient.addColorStop(1, colors.end);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };

    // Main draw function
    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      // Choose drawing method based on animation style
      switch (settings.animationStyle) {
        case 'waves':
          drawWaves(width, height);
          break;
        case 'spotlight':
          drawSpotlight(width, height);
          break;
        case 'none':
          drawStatic(width, height);
          break;
        default:
          drawOrganic(width, height);
      }

      // Update time
      if (!prefersReducedMotion && settings.animationStyle !== 'none') {
        time += baseSpeed * speedMultiplier * 16;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [settings.activeGradient, settings.animationStyle, prefersReducedMotion]);

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
