import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useGeolocation } from '../hooks/useGeolocation';
import { useTheme } from '../providers/ThemeProvider';
import { usePrefersReducedMotion } from '../hooks/useMediaQuery';

// Mapbox access token from environment variable
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// Map styles
const MAP_STYLES = {
  dark: 'mapbox://styles/mapbox/dark-v11',
  light: 'mapbox://styles/mapbox/light-v11',
};

// Wind particle configuration
const PARTICLE_COUNT = 300;
const PARTICLE_SPEED = 1.5;
const PARTICLE_LIFE_SPAN = 100;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  maxAge: number;
  trail: { x: number; y: number }[];
}

const TRAIL_LENGTH = 15;

/**
 * Simplex-like noise function for organic wind movement
 */
function noise(x: number, y: number, time: number): { dx: number; dy: number } {
  const angle =
    Math.sin(x * 0.01 + time * 0.5) * Math.PI +
    Math.cos(y * 0.01 + time * 0.3) * Math.PI * 0.5 +
    Math.sin((x + y) * 0.005 + time * 0.2) * Math.PI * 0.3;

  return {
    dx: Math.cos(angle) * PARTICLE_SPEED,
    dy: Math.sin(angle) * PARTICLE_SPEED,
  };
}

/**
 * MapBackground component
 * Displays a Mapbox map with animated wind particles
 */
export function MapBackground() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);

  const { latitude, longitude, loading: geoLoading } = useGeolocation();
  const { theme } = useTheme();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize particles
  const initParticles = (width: number, height: number) => {
    particlesRef.current = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      particlesRef.current.push({
        x,
        y,
        vx: 0,
        vy: 0,
        age: Math.random() * PARTICLE_LIFE_SPAN,
        maxAge: PARTICLE_LIFE_SPAN + Math.random() * 50,
        trail: [{ x, y }],
      });
    }
  };

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainerRef.current || !MAPBOX_TOKEN) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: theme === 'dark' ? MAP_STYLES.dark : MAP_STYLES.light,
      center: [longitude ?? -74.006, latitude ?? 40.7128],
      zoom: 12,
      interactive: false, // Disable user interaction
      attributionControl: false,
      logoPosition: 'bottom-right',
    });

    map.on('load', () => {
      setMapLoaded(true);
      // Force resize after load to ensure proper dimensions
      setTimeout(() => {
        map.resize();
      }, 100);
    });

    // Handle window resize
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.resize();
      }
    };
    window.addEventListener('resize', handleResize);

    mapRef.current = map;

    // Initial resize after a short delay to ensure container is rendered
    setTimeout(() => {
      map.resize();
    }, 50);

    return () => {
      window.removeEventListener('resize', handleResize);
      map.remove();
      mapRef.current = null;
    };
  }, [MAPBOX_TOKEN]);

  // Update map center when geolocation changes
  useEffect(() => {
    if (mapRef.current && latitude && longitude && !geoLoading) {
      mapRef.current.flyTo({
        center: [longitude, latitude],
        duration: 2000,
        essential: true,
      });
    }
  }, [latitude, longitude, geoLoading]);

  // Update map style when theme changes
  useEffect(() => {
    if (mapRef.current && mapLoaded) {
      mapRef.current.setStyle(
        theme === 'dark' ? MAP_STYLES.dark : MAP_STYLES.light
      );
    }
  }, [theme, mapLoaded]);

  // Wind particle animation
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
      initParticles(rect.width, rect.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Clear canvas completely for transparency
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const time = timeRef.current;

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Get wind direction from noise
        const wind = noise(p.x, p.y, time);

        // Update velocity with some inertia
        p.vx = p.vx * 0.9 + wind.dx * 0.1;
        p.vy = p.vy * 0.9 + wind.dy * 0.1;

        // Update position
        p.x += p.vx;
        p.y += p.vy;
        p.age++;

        // Add current position to trail
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > TRAIL_LENGTH) {
          p.trail.shift();
        }

        // Reset particle if it goes out of bounds or too old
        if (
          p.x < 0 ||
          p.x > width ||
          p.y < 0 ||
          p.y > height ||
          p.age > p.maxAge
        ) {
          // Reset at a random edge
          const edge = Math.floor(Math.random() * 4);
          switch (edge) {
            case 0:
              p.x = Math.random() * width;
              p.y = 0;
              break;
            case 1:
              p.x = width;
              p.y = Math.random() * height;
              break;
            case 2:
              p.x = Math.random() * width;
              p.y = height;
              break;
            case 3:
              p.x = 0;
              p.y = Math.random() * height;
              break;
          }
          p.age = 0;
          p.maxAge = PARTICLE_LIFE_SPAN + Math.random() * 50;
          p.vx = 0;
          p.vy = 0;
          p.trail = [{ x: p.x, y: p.y }];
          continue;
        }

        // Calculate base opacity based on age
        const lifeRatio = p.age / p.maxAge;
        const baseOpacity = Math.sin(lifeRatio * Math.PI) * 0.7;

        // Draw trail with fading opacity
        if (p.trail.length > 1) {
          for (let j = 1; j < p.trail.length; j++) {
            const trailOpacity = (j / p.trail.length) * baseOpacity;
            ctx.beginPath();
            ctx.moveTo(p.trail[j - 1].x, p.trail[j - 1].y);
            ctx.lineTo(p.trail[j].x, p.trail[j].y);
            ctx.strokeStyle =
              theme === 'dark'
                ? `rgba(255, 255, 255, ${trailOpacity})`
                : `rgba(80, 80, 80, ${trailOpacity * 0.8})`;
            ctx.lineWidth = 1.5;
            ctx.lineCap = 'round';
            ctx.stroke();
          }
        }
      }

      // Update time
      if (!prefersReducedMotion) {
        timeRef.current += 0.016;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    if (!prefersReducedMotion) {
      animate();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [theme, prefersReducedMotion]);

  // If no Mapbox token, show a fallback gradient
  if (!MAPBOX_TOKEN) {
    return (
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 'var(--z-background)',
          background:
            theme === 'dark'
              ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
              : 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 50%, #d4d4d4 100%)',
        }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-foreground/30 text-sm">
            Add VITE_MAPBOX_TOKEN for map background
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mapbox Map */}
      <div
        ref={mapContainerRef}
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 'var(--z-background)',
          width: '100%',
          height: '100%',
        }}
        aria-hidden="true"
      />

      {/* Wind Particles Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{
          zIndex: 'calc(var(--z-background) + 1)',
        }}
        aria-hidden="true"
      />
    </>
  );
}

