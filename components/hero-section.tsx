'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SmokeParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
  opacity: number;
}

const titles = [
  'Racing Developer',
  'Full-Stack Engineer',
  'Speed-Optimization Specialist',
  'Performance Tuning Expert',
  'Tech Innovation Driver',
];

export function HeroSection() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCarHovered, setIsCarHovered] = useState(false);
  const [smokeParticles, setSmokeParticles] = useState<SmokeParticle[]>([]);
  const [movingParticles, setMovingParticles] = useState<number[]>([]);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize moving particles
  useEffect(() => {
    const particles = Array.from({ length: windowSize.width < 768 ? 15 : 25 }, (_, i) => i);
    setMovingParticles(particles);
  }, [windowSize.width]);

  // Typing animation effect - CENTERED
  useEffect(() => {
    const currentTitle = titles[titleIndex];
    const typingSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && displayText === currentTitle) {
      setTimeout(() => setIsDeleting(true), 2000);
      return;
    }

    if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setTitleIndex((prev) => (prev + 1) % titles.length);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayText(
        isDeleting
          ? currentTitle.substring(0, displayText.length - 1)
          : currentTitle.substring(0, displayText.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, titleIndex]);

  // Enhanced smoke particles for car hover
  useEffect(() => {
    if (!isCarHovered) {
      setTimeout(() => {
        setSmokeParticles([]);
      }, 1000);
      return;
    }

    const interval = setInterval(() => {
      const particlesToAdd = Math.floor(Math.random() * 3) + 2;
      const newParticles: SmokeParticle[] = [];

      for (let i = 0; i < particlesToAdd; i++) {
        const size = Math.random() * (windowSize.width < 768 ? 15 : 25) + 10;
        const colorValue = Math.random() * 40 + 60;
        const color = `rgba(${colorValue}, ${colorValue}, ${colorValue}, 0.8)`;

        newParticles.push({
          id: Date.now() + i,
          x: windowSize.width / 2 + (Math.random() - 0.5) * (windowSize.width < 768 ? 40 : 80),
          y: windowSize.height / 2 + (windowSize.width < 768 ? 50 : 100) + Math.random() * 30,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -Math.random() * 2 - 1,
          size,
          life: Math.random() * 40 + 80,
          maxLife: 120,
          color,
          opacity: 0.7 + Math.random() * 0.3
        });
      }

      setSmokeParticles((prev) => [...prev, ...newParticles]);
    }, 150);

    return () => clearInterval(interval);
  }, [isCarHovered, windowSize.width, windowSize.height]);

  // Animate smoke particles
  useEffect(() => {
    const interval = setInterval(() => {
      setSmokeParticles((prev) =>
        prev
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 1,
            vx: particle.vx * 0.98,
            vy: particle.vy * 0.96,
            size: particle.size * 0.995,
            opacity: particle.opacity * 0.985
          }))
          .filter((particle) => particle.life > 0)
      );
    }, 16);

    return () => clearInterval(interval);
  }, []);

  // Canvas animation with smoke + moving particles - TRANSPARENT BACKGROUND
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = windowSize.width;
      canvas.height = windowSize.height;
    };

    resizeCanvas();

    let animationFrameId: number;

    const animate = () => {
      // Clear with TRANSPARENT background to show video behind
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render smoke particles
      smokeParticles.forEach((particle) => {
        const alpha = (particle.life / particle.maxLife) * particle.opacity;

        // Multi-layered smoke
        for (let i = 0; i < 3; i++) {
          const offset = i * 2;
          const layerAlpha = alpha * (0.8 - i * 0.2);

          ctx.save();
          ctx.shadowColor = 'rgba(50, 50, 50, 0.7)';
          ctx.shadowBlur = 15 + i * 5;
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;

          ctx.beginPath();
          ctx.arc(
            particle.x + offset,
            particle.y + offset,
            particle.size * (0.8 - i * 0.2),
            0,
            Math.PI * 2
          );
          ctx.fillStyle = particle.color.replace('0.8', layerAlpha.toString());
          ctx.fill();
          ctx.restore();
        }

        // Turbulence effect
        const turbulence = Math.sin(Date.now() * 0.001 + particle.id) * 2;
        ctx.beginPath();
        ctx.ellipse(
          particle.x + turbulence,
          particle.y,
          particle.size * 1.2,
          particle.size * 0.8,
          0,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = particle.color.replace('0.8', (alpha * 0.3).toString());
        ctx.fill();
      });

      // Render moving particles (small glowing dots)
      movingParticles.forEach((_, i) => {
        const time = Date.now() * 0.001 + i;
        const x = (Math.sin(time * 0.5) * 0.5 + 0.5) * canvas.width;
        const y = (Math.cos(time * 0.3) * 0.5 + 0.5) * canvas.height;
        const size = Math.sin(time * 2) * 2 + 3;

        ctx.save();
        ctx.shadowColor = '#ff4444';
        ctx.shadowBlur = windowSize.width < 768 ? 5 : 10;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, `rgba(255, 68, 68, ${0.8 + Math.sin(time * 3) * 0.2})`);
        gradient.addColorStop(1, 'rgba(255, 68, 68, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [smokeParticles, movingParticles, windowSize]);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth',
    });
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* FULL SCREEN VIDEO BACKGROUND - Covers entire section */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          src="/f1.mp4"
          className="w-full h-full object-cover brightness-50 contrast-125"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onMouseEnter={() => setIsCarHovered(true)}
          onMouseLeave={() => setIsCarHovered(false)}
        />
        {/* Dark Overlay for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
      </div>

      {/* Canvas for particles - TRANSPARENT BACKGROUND */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10"
        style={{ background: 'transparent' }}
      />

      {/* Racing flag stripes */}
      <div className="absolute top-0 left-0 w-full h-1 sm:h-2 bg-gradient-to-r from-red-600 via-white to-red-600 z-20"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 sm:h-2 bg-gradient-to-r from-red-600 via-white to-red-600 z-20"></div>

      {/* CENTERED CONTENT - Name + Typing Effect */}
      <div className="relative z-40 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 text-center max-w-7xl mx-auto w-full pt-16 md:pt-0">
        {/* Name - Responsive text sizes and layout */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black mb-4 sm:mb-6 md:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-white to-red-500 leading-tight">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 md:gap-6">
            <span className="block">Devkanta</span>
            <span className="block">Singh</span>
          </div>
        </h1>

        {/* CENTERED Typing Effect */}
        <div className="h-16 sm:h-20 md:h-24 flex flex-col items-center justify-center mb-6 sm:mb-8 md:mb-12 px-2">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-white tracking-tight">
            <span className="text-red-500 mr-2 sm:mr-3 md:mr-4">#</span>
            <span className="text-white">I'm a</span>{' '}
            <span className="text-red-400 bg-gradient-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">
              {displayText}
            </span>
            <span className="animate-pulse text-red-500 ml-1 sm:ml-2">|</span>
          </h2>
        </div>

        {/* Description */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-6 sm:mb-8 md:mb-12 max-w-2xl leading-relaxed opacity-90 px-4">
          Racing towards digital excellence with{' '}
          <span className="text-red-400 font-bold">lightning-fast solutions</span> and{' '}
          <span className="text-yellow-400 font-bold">precision engineering</span>.
          Every line of code optimized for peak performance.
        </p>

        {/* Buttons - Responsive layout */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-8 sm:mb-12 md:mb-16 w-full max-w-2xl px-4">
          <Button
            size="lg"
            className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-6 sm:px-8 md:px-12 py-4 sm:py-6 md:py-8 text-lg sm:text-xl font-black uppercase tracking-widest shadow-2xl shadow-red-500/40 hover:shadow-red-500/60 transform hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto"
            onClick={() =>
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            <ChevronRight className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 animate-pulse" />
            <span className="text-sm sm:text-base md:text-lg">View Projects</span>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 sm:border-3 border-white/50 hover:bg-white/10 backdrop-blur-sm text-white hover:text-white hover:border-white px-6 sm:px-8 md:px-12 py-4 sm:py-6 md:py-8 text-lg sm:text-xl font-black uppercase tracking-widest transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            onClick={() =>
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }
          >
            <span className="text-sm sm:text-base md:text-lg">Pit Stop Contact</span>
          </Button>
        </div>

        {/* Stats - Responsive grid */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-md mb-8 sm:mb-0 px-4">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-black text-red-500 mb-1 sm:mb-2">100%</div>
            <div className="text-xs sm:text-sm text-gray-400 font-medium tracking-wide uppercase">Performance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-black text-yellow-500 mb-1 sm:mb-2">24/7</div>
            <div className="text-xs sm:text-sm text-gray-400 font-medium tracking-wide uppercase">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1 sm:mb-2">0ms</div>
            <div className="text-xs sm:text-sm text-gray-400 font-medium tracking-wide uppercase">Latency</div>
          </div>
        </div>
      </div>

      {/* Speedometer overlay - Responsive positioning */}
      <div className="absolute top-4 sm:top-8 md:top-12 right-2 sm:right-4 md:right-8 lg:right-12 text-right z-40 backdrop-blur-sm bg-black/30 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl border border-white/20 max-w-[140px] sm:max-w-[160px] md:max-w-none">
        <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider mb-1 sm:mb-2">CURRENT SPEED</div>
        <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-red-500">
          220<span className="text-sm sm:text-base md:text-lg lg:text-2xl">KM/H</span>
        </div>
        <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest mt-0.5 sm:mt-1">MAX PERFORMANCE</div>
      </div>

      {/* Team logo - Responsive positioning */}
    <div className="absolute top-4 sm:top-8 md:top-12 left-2 sm:left-4 md:left-8 lg:left-12 z-40">
  <div className="relative">
    {/* Glow Effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-red-500/70 to-red-600/70 rounded-full blur-xl animate-pulse"></div>
    
    {/* Main Image */}
    <img
      src="/logo.png"
      alt="Team Racing Logo"
      className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-white/30 shadow-2xl shadow-red-500/30 hover:scale-110 hover:rotate-6 transition-all duration-500"
    />
    
    {/* Speed Line Effect */}
    <div className="absolute -bottom-2 -right-2 w-10 h-10">
      <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-transparent transform rotate-45 rounded-full blur-sm"></div>
    </div>
  </div>
</div>  

      {/* Scroll indicator */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center text-red-400 hover:text-red-300 transition-all duration-300 z-30 group"
        aria-label="Scroll to next section"
      >
        <div className="text-xs sm:text-sm mb-2 sm:mb-3 text-gray-400 font-medium uppercase tracking-wider group-hover:translate-y-[-2px] transition-transform">START ENGINE</div>
        <ArrowDown size={windowSize.width < 768 ? 24 : 36} className="animate-bounce group-hover:animate-none group-hover:scale-110 transition-all duration-300" />
      </button>
    </section>
  );
}