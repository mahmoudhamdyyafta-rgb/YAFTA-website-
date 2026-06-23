import { useEffect, useRef } from 'react';

interface GoldParticlesProps {
  opacity?: number;
  count?: number;
  speed?: number;
}

export default function GoldParticles({ opacity = 0.75, count = 25, speed = 0.4 }: GoldParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = canvas.parentElement?.clientWidth || canvas.clientWidth || window.innerWidth;
    let height = canvas.height = canvas.parentElement?.clientHeight || canvas.clientHeight || window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      pulseSpeed: number;
      pulsePhase: number;
    }> = [];

    // Seed floating gold micro-dust particles
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.4,
        speedX: (Math.random() - 0.5) * speed,
        speedY: -(Math.random() * 0.5 + 0.1) * speed, // drifting upwards
        opacity: Math.random() * 0.6 + 0.1,
        pulseSpeed: 0.015 + Math.random() * 0.02,
        pulsePhase: Math.random() * Math.PI,
      });
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = canvas.width = entry.contentRect.width || canvas.clientWidth;
        height = canvas.height = entry.contentRect.height || canvas.clientHeight;
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        // Slow float logic with screen boundary wrap-around
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < -10) {
          p.x = width + 10;
        } else if (p.x > width + 10) {
          p.x = -10;
        }

        if (p.y < -10) {
          p.y = height + 10;
        } else if (p.y > height + 10) {
          p.y = -10;
        }

        p.pulsePhase += p.pulseSpeed;
        const currentOpacity = p.opacity * (0.5 + 0.5 * Math.sin(p.pulsePhase));

        // Draw individual golden glow particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        ctx.fillStyle = `rgba(229, 192, 96, ${currentOpacity})`;
        // Soft golden drop-shadow/glow for that luxurious depth
        ctx.shadowBlur = p.size * 2;
        ctx.shadowColor = '#e5c060';
        
        ctx.fill();
        ctx.shadowBlur = 0; // Reset for next iteration performance
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [count, speed, opacity]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none w-full h-full mix-blend-screen z-10"
      style={{ opacity }}
    />
  );
}
