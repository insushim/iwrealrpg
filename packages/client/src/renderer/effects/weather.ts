interface RainDrop {
    x: number;
    y: number;
    length: number;
    speed: number;
    opacity: number;
    width: number;
}

interface SnowFlake {
    x: number;
    y: number;
    radius: number;
    speed: number;
    drift: number;
    opacity: number;
    phase: number;
}

interface AmbientParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    opacity: number;
    life: number;
    maxLife: number;
}

type WeatherType = 'none' | 'rain' | 'snow' | 'ambient';

export default class Weather {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private rafId = 0;
    private type: WeatherType = 'none';

    private drops: RainDrop[] = [];
    private flakes: SnowFlake[] = [];
    private particles: AmbientParticle[] = [];

    public constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'weather-canvas';
        this.canvas.style.cssText =
            'position:absolute;inset:0;pointer-events:none;z-index:45;width:100%;height:100%;';

        let canvasContainer = document.querySelector<HTMLElement>('#canvas');

        if (!canvasContainer) return;

        canvasContainer.append(this.canvas);

        let ctx = this.canvas.getContext('2d');

        if (!ctx) return;

        this.ctx = ctx;
        this.resize();

        window.addEventListener('resize', () => this.resize());
    }

    /**
     * Starts a rain effect with the given intensity (0–1).
     */

    public startRain(intensity = 0.5): void {
        this.type = 'rain';
        this.drops = [];

        let count = Math.floor(120 * intensity);

        for (let i = 0; i < count; i++)
            this.drops.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                length: Math.random() * 14 + 6,
                speed: Math.random() * 4 + 5,
                opacity: Math.random() * 0.25 + 0.08,
                width: Math.random() < 0.3 ? 1.5 : 1
            });

        this.start();
    }

    /**
     * Starts a snow effect with the given intensity (0–1).
     */

    public startSnow(intensity = 0.5): void {
        this.type = 'snow';
        this.flakes = [];

        let count = Math.floor(80 * intensity);

        for (let i = 0; i < count; i++)
            this.flakes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2.5 + 0.8,
                speed: Math.random() * 1.2 + 0.4,
                drift: (Math.random() - 0.5) * 0.6,
                opacity: Math.random() * 0.5 + 0.2,
                phase: Math.random() * Math.PI * 2
            });

        this.start();
    }

    /**
     * Starts ambient floating magic particles.
     */

    public startAmbient(): void {
        this.type = 'ambient';
        this.particles = [];

        for (let i = 0; i < 30; i++) this.spawnParticle(true);

        this.start();
    }

    /**
     * Stops all weather effects.
     */

    public stop(): void {
        this.type = 'none';
        cancelAnimationFrame(this.rafId);
        this.rafId = 0;
        this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private start(): void {
        if (this.rafId) cancelAnimationFrame(this.rafId);

        this.animate();
    }

    private animate(): void {
        if (!this.ctx) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        switch (this.type) {
            case 'rain': {
                this.drawRain();
                break;
            }

            case 'snow': {
                this.drawSnow();
                break;
            }

            case 'ambient': {
                this.drawAmbient();
                break;
            }

            default: {
                break;
            }
        }

        this.rafId = requestAnimationFrame(() => this.animate());
    }

    private drawRain(): void {
        this.ctx.save();

        for (let drop of this.drops) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = `rgba(180, 210, 255, ${drop.opacity})`;
            this.ctx.lineWidth = drop.width;
            this.ctx.moveTo(drop.x, drop.y);
            this.ctx.lineTo(drop.x - drop.length * 0.12, drop.y + drop.length);
            this.ctx.stroke();

            drop.y += drop.speed;
            drop.x -= 0.5;

            if (drop.y > this.canvas.height) {
                drop.y = -drop.length;
                drop.x = Math.random() * this.canvas.width;
            }
        }

        this.ctx.restore();
    }

    private drawSnow(): void {
        let time = Date.now() / 1000;

        this.ctx.save();

        for (let flake of this.flakes) {
            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(240, 248, 255, ${flake.opacity})`;
            this.ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
            this.ctx.fill();

            flake.y += flake.speed;
            flake.x += flake.drift + Math.sin(time + flake.phase) * 0.3;

            if (flake.y > this.canvas.height + flake.radius) {
                flake.y = -flake.radius;
                flake.x = Math.random() * this.canvas.width;
            }

            if (flake.x < -10) flake.x = this.canvas.width + 10;
            else if (flake.x > this.canvas.width + 10) flake.x = -10;
        }

        this.ctx.restore();
    }

    private drawAmbient(): void {
        this.ctx.save();

        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];

            p.life--;
            p.x += p.vx;
            p.y += p.vy;

            let progress = p.life / p.maxLife,
                alpha = p.opacity * Math.sin(progress * Math.PI);

            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(200, 180, 255, ${alpha})`;
            this.ctx.arc(p.x, p.y, p.radius * progress, 0, Math.PI * 2);
            this.ctx.fill();

            if (p.life <= 0) {
                this.particles.splice(i, 1);
                this.spawnParticle(false);
            }
        }

        this.ctx.restore();
    }

    private spawnParticle(randomY: boolean): void {
        let maxLife = Math.floor(Math.random() * 120 + 80);

        this.particles.push({
            x: Math.random() * this.canvas.width,
            y: randomY ? Math.random() * this.canvas.height : this.canvas.height,
            vx: (Math.random() - 0.5) * 0.4,
            vy: -(Math.random() * 0.5 + 0.2),
            radius: Math.random() * 2 + 0.8,
            opacity: Math.random() * 0.4 + 0.15,
            life: maxLife,
            maxLife
        });
    }

    private resize(): void {
        let container = document.querySelector<HTMLElement>('#canvas');

        if (!container) return;

        this.canvas.width = container.offsetWidth;
        this.canvas.height = container.offsetHeight;
    }
}
