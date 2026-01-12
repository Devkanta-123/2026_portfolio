'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Zap, Gauge, Terminal, Database, Cloud, Smartphone, GitBranch } from 'lucide-react';

interface Technology {
  name: string;
  speed: number;
  boost: string;
}

interface CarSpecs {
  engine: string;
  power: string;
  torque: string;
  weight: string;
}

interface Skill {
  category: string;
  icon: any;
  color: string;
  gradient: string;
  maxSpeed: number;
  rpm: number;
  gear: number;
  drs: boolean;
  technologies: Technology[];
  carSpecs: CarSpecs;
}

const skills: Skill[] = [
  {
    category: 'Frontend',
    icon: Gauge,
    color: '#DC2626',
    gradient: 'from-red-600 to-red-800',
    maxSpeed: 98,
    rpm: 14500,
    gear: 8,
    drs: true,
    technologies: [
      { name: 'React', speed: 95, boost: '+25hp' },
      { name: 'Next.js', speed: 92, boost: '+20hp' },
      { name: 'TypeScript', speed: 88, boost: '+18hp' },
      { name: 'Tailwind CSS', speed: 90, boost: '+22hp' },
      { name: 'Vue.js', speed: 85, boost: '+15hp' },
      { name: 'HTML5/Bootstrap', speed: 98, boost: '+30hp' },
    ],
    carSpecs: {
      engine: 'V6 Turbo Hybrid',
      power: '950hp',
      torque: '800Nm',
      weight: '798kg'
    }
  },
  {
    category: 'Backend',
    icon: Terminal,
    color: '#F59E0B',
    gradient: 'from-yellow-600 to-amber-800',
    maxSpeed: 94,
    rpm: 14200,
    gear: 7,
    drs: true,
    technologies: [
      { name: 'Node.js', speed: 94, boost: '+28hp' },
      { name: 'Express', speed: 91, boost: '+24hp' },
      { name: 'Python', speed: 87, boost: '+20hp' },
      { name: 'Laravel', speed: 83, boost: '+18hp' },
      { name: 'SpringBoot', speed: 86, boost: '+19hp' },
    ],
    carSpecs: {
      engine: 'V8 Hybrid',
      power: '920hp',
      torque: '780Nm',
      weight: '805kg'
    }
  },
  {
    category: 'Database',
    icon: Database,
    color: '#3B82F6',
    gradient: 'from-blue-600 to-blue-800',
    maxSpeed: 95,
    rpm: 14300,
    gear: 7,
    drs: true,
    technologies: [
      { name: 'PostgreSQL', speed: 89, boost: '+22hp' },
      { name: 'MySQL', speed: 92, boost: '+25hp' },
      { name: 'MongoDB', speed: 88, boost: '+21hp' },
      { name: 'Redis', speed: 95, boost: '+30hp' },
      { name: 'Supabase', speed: 86, boost: '+19hp' },
    ],
    carSpecs: {
      engine: 'V6 Hybrid',
      power: '940hp',
      torque: '790Nm',
      weight: '800kg'
    }
  },
  {
    category: 'DevOps',
    icon: Cloud,
    color: '#F97316',
    gradient: 'from-orange-600 to-orange-800',
    maxSpeed: 94,
    rpm: 14100,
    gear: 6,
    drs: false,
    technologies: [
      { name: 'Docker', speed: 93, boost: '+27hp' },
      { name: 'Kubernetes', speed: 85, boost: '+20hp' },
      { name: 'Linux', speed: 94, boost: '+28hp' },
    ],
    carSpecs: {
      engine: 'V8 Turbo',
      power: '910hp',
      torque: '770Nm',
      weight: '810kg'
    }
  },
  {
    category: 'Mobile',
    icon: Smartphone,
    color: '#10B981',
    gradient: 'from-green-600 to-emerald-800',
    maxSpeed: 92,
    rpm: 13900,
    gear: 6,
    drs: false,
    technologies: [
      { name: 'React Native', speed: 90, boost: '+24hp' },
      { name: 'Flutter', speed: 87, boost: '+21hp' },
      { name: 'iOS', speed: 82, boost: '+18hp' },
      { name: 'Android', speed: 84, boost: '+19hp' },
    ],
    carSpecs: {
      engine: 'V6 Turbo',
      power: '890hp',
      torque: '750Nm',
      weight: '815kg'
    }
  },
  {
    category: 'Tools',
    icon: GitBranch,
    color: '#8B5CF6',
    gradient: 'from-purple-600 to-violet-800',
    maxSpeed: 98,
    rpm: 14600,
    gear: 8,
    drs: true,
    technologies: [
      { name: 'Git', speed: 96, boost: '+29hp' },
      { name: 'VS Code', speed: 98, boost: '+32hp' },
      { name: 'Figma', speed: 89, boost: '+22hp' },
      { name: 'Android Studio', speed: 80, boost: '+62hp' },
      { name: 'Talend', speed: 97, boost: '+72hp' },
      
    ],
    carSpecs: {
      engine: 'V6 Hybrid ERS',
      power: '960hp',
      torque: '820Nm',
      weight: '795kg'
    }
  },
];

function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let raf: number;
    const start = displayValue;
    const end = value;
    const duration = 600;
    let startTime: number | null = null;

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentValue = Math.floor(start + (end - start) * progress);
      setDisplayValue(currentValue);
      if (progress < 1) raf = requestAnimationFrame(animate);
    }

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [value, displayValue]);

  return <>{displayValue}</>;
}

interface TrackTechCar {
  id: string;
  name: string;
  speed: number;
  boost: string;
  progress: number;
}

interface F1TrackCarProps {
  mouseX: number;
  mouseY: number;
  carSpeed: number;
  skill: Skill;
  trackRect: DOMRect | null;
  scrollProgress: number;
  trackTechCars: TrackTechCar[];
}

const F1TrackCar = ({
  mouseX,
  mouseY,
  carSpeed,
  skill,
  trackRect,
  scrollProgress,
  trackTechCars,
}: F1TrackCarProps) => {
  const [carPosition, setCarPosition] = useState({ x: 5, y: 50 });
  const [rotation, setRotation] = useState(0);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!trackRect) return;

    const scrollX = 5 + scrollProgress * 90;
    const centerY = 50;

    const mouseInfluenceX = windowSize.width < 768 ? 1 : 3;
    const mouseInfluenceY = windowSize.width < 768 ? 2 : 5;

    const relativeMouseX = Math.max(
      -1,
      Math.min(
        1,
        (mouseX - trackRect.left) / trackRect.width - 0.5
      )
    ) * 2;

    const relativeMouseY = Math.max(
      -1,
      Math.min(
        1,
        (mouseY - trackRect.top) / trackRect.height - 0.5
      )
    ) * 2;

    const targetX = scrollX + relativeMouseX * mouseInfluenceX;
    const targetY = centerY + relativeMouseY * mouseInfluenceY;

    const clampedX = Math.max(10, Math.min(90, targetX));
    const clampedY = Math.max(45, Math.min(55, targetY));

    setCarPosition(prev => ({
      x: prev.x + (clampedX - prev.x) * 0.06,
      y: prev.y + (clampedY - prev.y) * 0.06,
    }));

    const dx = clampedX - carPosition.x;
    setRotation(dx * 0.3);
  }, [mouseX, mouseY, scrollProgress, trackRect, carPosition.x, carPosition.y, windowSize.width]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2">
        <div className="relative h-[180px] sm:h-[250px] md:h-[300px] lg:h-[400px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-yellow-400 via-white to-yellow-400 transform -translate-y-1/2" />
            <div className="absolute top-1/2 left-0 right-0 h-2 sm:h-3 md:h-4 lg:h-6 border-t border-b border-white transform -translate-y-1/2">
              <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-red-600 to-red-800" />
              <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-red-600 to-red-800" />
            </div>

            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 h-0.5 w-4 sm:w-6 md:w-8 lg:w-12 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 transform -translate-y-1/2"
                style={{
                  left: `${i * 3}%`,
                  animation: `moveGrid ${1.5 + i * 0.03}s linear infinite`,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}

            {[...Array(15)].map((_, i) => (
              <div
                key={`marker-${i}`}
                className="absolute top-1/2 h-1 sm:h-2 md:h-3 lg:h-4 w-px bg-white transform -translate-y-1/2"
                style={{ left: `${i * 6.5}%` }}
              >
                <div className="absolute -top-3 sm:-top-4 md:-top-5 lg:-top-6 left-1/2 transform -translate-x-1/2 text-[6px] sm:text-[8px] md:text-xs text-white font-mono">
                  {i * 100}m
                </div>
              </div>
            ))}
          </div>

          <div className="absolute -top-3 sm:-top-4 md:-top-6 lg:-top-8 left-0 right-0 h-6 sm:h-8 md:h-12 lg:h-16 bg-gradient-to-b from-gray-900 to-gray-800 border-b border-red-600">
            {['PIRELLI', 'ROLEX', 'DHL', 'AWS', 'HEINEKEN', 'EMIRATES'].map((sponsor, i) => (
              <div
                key={sponsor}
                className="absolute top-1/2 transform -translate-y-1/2 text-gray-400 font-bold text-[6px] sm:text-[8px] md:text-xs lg:text-sm"
                style={{ left: `${(i * 15) + 8}%` }}
              >
                {sponsor}
              </div>
            ))}
          </div>

          <div className="absolute -bottom-3 sm:-bottom-4 md:-bottom-6 lg:-bottom-8 left-0 right-0 h-6 sm:h-8 md:h-12 lg:h-16 bg-gradient-to-t from-gray-900 to-gray-800 border-t border-red-600">
            {['PETRONAS', 'MONSTER', 'SANTANDER', 'CATERPILLAR', 'HONDA', 'MERCEDES'].map((sponsor, i) => (
              <div
                key={sponsor}
                className="absolute top-1/2 transform -translate-y-1/2 text-gray-400 font-bold text-[6px] sm:text-[8px] md:text-xs lg:text-sm"
                style={{ left: `${(i * 15) + 8}%` }}
              >
                {sponsor}
              </div>
            ))}
          </div>

          {trackTechCars.map((tech, index) => (
            <div
              key={tech.id}
              className="absolute w-8 sm:w-10 md:w-12 lg:w-16 h-3 sm:h-4 md:h-5 lg:h-6 pointer-events-none transition-all duration-100"
              style={{
                left: `${5 + tech.progress * 90}%`,
                top: `${48 + (index % 2) * 4}%`,
                transform: 'translate(-50%, -50%)',
                filter: `drop-shadow(0 0 4px ${skill.color})`,
                opacity: tech.progress > 0.05 ? 1 : 0,
              }}
            >
              <div className="relative w-full h-full rounded-sm md:rounded-md bg-gray-900/90 border border-gray-700 shadow">
                <div className="absolute -top-2 sm:-top-3 md:-top-4 left-1/2 -translate-x-1/2 text-[5px] sm:text-[6px] md:text-[8px] lg:text-[10px] font-bold text-white px-1 py-0.5 bg-black/70 rounded">
                  {tech.name}
                </div>
                <div className="absolute inset-y-0.5 left-0.5 sm:left-1 w-0.5 rounded bg-gradient-to-b from-gray-400 to-gray-100" />
                <div className="absolute inset-y-0.5 right-0.5 sm:right-1 w-0.5 rounded bg-gradient-to-b from-gray-100 to-gray-400" />
                <div className="absolute -right-2 sm:-right-3 md:-right-4 top-1/2 -translate-y-1/2 w-1.5 sm:w-2 md:w-3 lg:w-4 h-1 sm:h-1.5 md:h-2 rounded-full blur-sm"
                  style={{
                    background: `radial-gradient(circle at left, ${skill.color}, transparent)`,
                    opacity: 0.7,
                  }}
                />
                <div className="absolute -bottom-1.5 sm:-bottom-2 md:-bottom-3 left-1/2 -translate-x-1/2 text-[5px] sm:text-[6px] md:text-[8px] lg:text-[9px] font-mono text-green-400">
                  {tech.speed}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="absolute w-16 sm:w-20 md:w-24 lg:w-32 h-8 sm:h-10 md:h-12 lg:h-16 pointer-events-none transition-all duration-100 ease-out"
        style={{
          left: `${carPosition.x}%`,
          top: `${carPosition.y}%`,
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          filter: `drop-shadow(0 0 8px ${skill.color})`,
        }}
      >
        <div className="relative w-full h-full">
          <div className={`absolute inset-0 rounded-md lg:rounded-lg bg-gradient-to-r ${skill.gradient} transform skew-x-12 shadow-lg`}>
            <div className="absolute -top-1 sm:-top-2 -left-1 sm:-left-2 w-3 sm:w-4 md:w-6 lg:w-8 h-3 sm:h-4 md:h-6 lg:h-8 rounded-full bg-white flex items-center justify-center shadow">
              <span className="text-black font-bold text-xs sm:text-sm md:text-base lg:text-lg">44</span>
            </div>
            <div className="absolute -top-1.5 sm:-top-2 md:-top-3 lg:-top-4 left-1/2 -translate-x-1/2 w-2 sm:w-3 md:w-4 lg:w-6 h-2 sm:h-3 md:h-4 lg:h-6 rounded-full bg-gradient-to-r from-yellow-400 to-red-500 shadow-sm" />
            <div className="absolute -top-2 sm:-top-3 md:-top-4 lg:-top-6 left-1/4 right-1/4 h-1.5 sm:h-2 md:h-3 lg:h-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-t-sm lg:rounded-t-lg shadow">
              <div className="absolute top-0 left-1/2 w-1 sm:w-1.5 md:w-2 h-3 sm:h-4 md:h-6 lg:h-8 bg-gradient-to-t from-gray-900 to-gray-700 -translate-x-1/2 shadow-sm" />
            </div>
            <div className="absolute -bottom-1.5 sm:-bottom-2 md:-bottom-3 lg:-bottom-4 left-0 right-0 h-1.5 sm:h-2 md:h-3 lg:h-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-b-sm lg:rounded-b-lg shadow">
              <div className="absolute -bottom-0.5 sm:-bottom-1 md:-bottom-2 left-1/3 right-1/3 h-0.5 sm:h-1 md:h-1.5 lg:h-2 bg-gradient-to-r from-gray-700 to-gray-800" />
            </div>
          </div>

          <div
            className="absolute -right-3 sm:-right-4 md:-right-6 lg:-right-8 top-1/2 -translate-y-1/2 w-4 sm:w-5 md:w-8 lg:w-12 h-2 sm:h-3 md:h-4 lg:h-6 rounded-full blur-sm transition-all duration-200"
            style={{
              background: `radial-gradient(ellipse at center, ${skill.color} 0%, transparent 70%)`,
              opacity: carSpeed > 50 ? 0.8 : 0.3,
              animation: carSpeed > 50 ? 'exhaustPulse 0.4s infinite alternate' : 'none',
            }}
          />
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={`light-${i}`}
            className="absolute top-1/2 h-0.5 sm:h-1 w-8 sm:w-12 md:w-16 lg:w-24 bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent -translate-y-1/2"
            style={{
              left: `${(Date.now() / 40 + i * 40) % 100}%`,
              animation: 'trackLight 2.5s linear infinite',
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes exhaustPulse {
          0% { opacity: 0.3; transform: translateY(-50%) scale(0.8); }
          100% { opacity: 0.9; transform: translateY(-50%) scale(1.3); }
        }

        @keyframes trackLight {
          0% { transform: translateY(-50%) translateX(100vw); }
          100% { transform: translateY(-50%) translateX(-120px); }
        }

        @keyframes moveGrid {
          0% { transform: translateY(-50%) translateX(0); }
          100% { transform: translateY(-50%) translateX(-25px); }
        }
      `}</style>
    </div>
  );
};

interface RealF1DigitalSpeedometerProps {
  skills: Skill[];
  activeCategory: number;
  selectedTech: Technology | null;
  onTechSelect: (tech: Technology | null) => void;
  mouseX: number;
  mouseY: number;
  carSpeed: number;
  trackRect: DOMRect | null;
  scrollProgress: number;
}

const RealF1DigitalSpeedometer = ({
  skills,
  activeCategory,
  selectedTech,
  onTechSelect,
  mouseX,
  mouseY,
  carSpeed,
  trackRect,
  scrollProgress
}: RealF1DigitalSpeedometerProps) => {
  const [speed, setSpeed] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [gear, setGear] = useState('N');
  const [lapTime, setLapTime] = useState('1:23.456');
  const [drsActive, setDrsActive] = useState(false);
  const [energyRecovery, setEnergyRecovery] = useState(0);

  const [trackTechCars, setTrackTechCars] = useState<TrackTechCar[]>([]);

  const skill = skills[activeCategory];
  const intervalRef = useRef<NodeJS.Timeout>();

  const gearSpeedThresholds = [0, 30, 70, 110, 160, 210, 270, 320];

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    setSpeed(0);
    setRpm(0);
    setGear('N');
    setDrsActive(false);
    setEnergyRecovery(0);

    let currentSpeed = 0;
    let currentRpm = 0;
    let currentEnergy = 0;

    intervalRef.current = setInterval(() => {
      if (currentSpeed < skill.maxSpeed) {
        currentSpeed += Math.min(6, skill.maxSpeed - currentSpeed);
        setSpeed(currentSpeed);
      }

      if (currentRpm < skill.rpm) {
        currentRpm += Math.min(150, skill.rpm - currentRpm);
        setRpm(currentRpm);
      }

      if (currentEnergy < 100) {
        currentEnergy += 3;
        setEnergyRecovery(currentEnergy);
      }

      let newGear = 'N';
      for (let i = gearSpeedThresholds.length - 1; i >= 0; i--) {
        if (currentSpeed >= gearSpeedThresholds[i]) {
          newGear = i.toString();
          break;
        }
      }
      setGear(newGear);

      if (currentSpeed > 300 && skill.drs) {
        setDrsActive(true);
      }

      if (currentSpeed >= skill.maxSpeed && currentRpm >= skill.rpm && currentEnergy >= 100) {
        clearInterval(intervalRef.current!);
      }
    }, 60);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeCategory, skill]);

  useEffect(() => {
    const baseTime = 90 + (6 - activeCategory) * 5;
    const minutes = Math.floor(baseTime / 60);
    const seconds = baseTime % 60;
    const milliseconds = Math.floor(Math.random() * 1000);
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
    setLapTime(formattedTime);
  }, [activeCategory]);

  useEffect(() => {
    setTrackTechCars([]);

    skill.technologies.forEach((tech, index) => {
      setTimeout(() => {
        setTrackTechCars(prev => [
          ...prev,
          {
            id: `${skill.category}-${tech.name}-${Date.now()}-${index}`,
            name: tech.name,
            speed: tech.speed,
            boost: tech.boost,
            progress: 0,
          },
        ]);
      }, index * 150);
    });

    const moveInterval = setInterval(() => {
      setTrackTechCars(prev =>
        prev
          .map(car => ({
            ...car,
            progress: Math.min(1.1, car.progress + (car.speed / 1000) * 0.02),
          }))
          .filter(car => car.progress < 1.1)
      );
    }, 50);

    return () => clearInterval(moveInterval);
  }, [activeCategory, skill]);

  return (
    <div className="relative w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6">
      <div className="relative h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px] mb-4 sm:mb-6 md:mb-8 rounded-lg md:rounded-xl lg:rounded-2xl overflow-hidden border border-gray-800 bg-gradient-to-b from-gray-900 to-black">
        <F1TrackCar
          mouseX={mouseX}
          mouseY={mouseY}
          carSpeed={speed}
          skill={skill}
          trackRect={trackRect}
          scrollProgress={scrollProgress}
          trackTechCars={trackTechCars}
        />

        {/* Top left card - Fixed positioning for all screens */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 z-10">
          <div className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-3 md:py-2 bg-black/90 backdrop-blur-sm rounded-lg border border-gray-700">
            <div className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-gray-400 leading-tight">CURRENT SECTOR</div>
            <div className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white font-mono leading-tight">S{activeCategory + 1}</div>
          </div>
        </div>

        {/* Top right card - Fixed positioning for all screens */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 z-10">
          <div className="px-2 py-1 sm:px-3 sm:py-1.5 md:px-3 md:py-2 bg-black/90 backdrop-blur-sm rounded-lg border border-gray-700">
            <div className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-gray-400 leading-tight">TRACK TEMP</div>
            <div className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-red-400 font-mono leading-tight">42°C</div>
          </div>
        </div>
      </div>

      {/* Dashboard - Completely redesigned for mobile */}
      <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-xl md:rounded-2xl lg:rounded-3xl p-4 sm:p-5 md:p-6 lg:p-8 border border-gray-800 shadow-xl">
        <div className="text-center text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-3 sm:mb-4 md:mb-6 lg:mb-8 leading-tight">
          SPEEDOMETER DASHBOARD
        </div>

        {/* Main stats grid - Fixed layout to prevent overlap */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-4 sm:mb-6">
          <div className="bg-gray-900/70 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 border border-gray-700">
            <div className="text-[10px] sm:text-xs md:text-sm text-gray-400 mb-1">SPEED</div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-mono text-white leading-none">
              <AnimatedNumber value={speed} />
              <span className="text-xs sm:text-sm md:text-base lg:text-lg ml-1">km/h</span>
            </div>
          </div>
          <div className="bg-gray-900/70 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 border border-gray-700">
            <div className="text-[10px] sm:text-xs md:text-sm text-gray-400 mb-1">RPM</div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-mono text-red-400 leading-none">
              <AnimatedNumber value={rpm} />
            </div>
          </div>
          <div className="bg-gray-900/70 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 border border-gray-700">
            <div className="text-[10px] sm:text-xs md:text-sm text-gray-400 mb-1">GEAR</div>
            <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-mono text-white leading-none">
              {gear}
            </div>
          </div>
          <div className="bg-gray-900/70 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 border border-gray-700">
            <div className="text-[10px] sm:text-xs md:text-sm text-gray-400 mb-1">LAP TIME</div>
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-mono text-green-400 leading-tight">
              {lapTime}
            </div>
          </div>
        </div>

        {/* Bottom stats - Stacked on mobile, side-by-side on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          <div className="bg-gray-900/70 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700">
            <div className="text-[10px] sm:text-xs md:text-sm text-gray-400 mb-2">ERS / ENERGY</div>
            <div className="w-full h-2 sm:h-3 bg-gray-800 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-gradient-to-r from-green-500 via-yellow-400 to-red-500"
                style={{ width: `${energyRecovery}%` }}
              />
            </div>
            <div className="text-[10px] sm:text-xs text-gray-400 font-mono">
              {energyRecovery.toFixed(0)}%
            </div>
          </div>

          <div className="bg-gray-900/70 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700 flex flex-col items-center justify-center">
            <div className="text-[10px] sm:text-xs md:text-sm text-gray-400 mb-2">DRS</div>
            <div
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-mono text-xs sm:text-sm ${drsActive ? 'bg-green-500 text-black' : 'bg-gray-700 text-gray-300'
                }`}
            >
              {drsActive ? 'ACTIVE' : 'OFF'}
            </div>
          </div>

          <div className="bg-gray-900/70 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700">
            <div className="text-[10px] sm:text-xs md:text-sm text-gray-400 mb-2">CAR SPECS</div>
            <div className="space-y-0.5 sm:space-y-1">
              <div className="text-[10px] sm:text-xs text-gray-300 truncate">
                <span className="text-gray-500">Engine:</span> {skill.carSpecs.engine}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-300">
                <span className="text-gray-500">Power:</span> {skill.carSpecs.power}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-300">
                <span className="text-gray-500">Torque:</span> {skill.carSpecs.torque}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-300">
                <span className="text-gray-500">Weight:</span> {skill.carSpecs.weight}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [selectedTech, setSelectedTech] = useState<Technology | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trackRect, setTrackRect] = useState<DOMRect | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const updateRect = () => {
      if (trackRef.current) {
        setTrackRect(trackRef.current.getBoundingClientRect());
      }
    };
    updateRect();
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const progress = Math.max(
        0,
        Math.min(
          1,
          (windowHeight - rect.top) / (windowHeight + rect.height)
        )
      );
      setScrollProgress(progress);
      setTrackRect(rect);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCategoryChange = useCallback((direction: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);
    if (direction === 'next') {
      setActiveCategory(prev => (prev + 1) % skills.length);
    } else {
      setActiveCategory(prev => (prev - 1 + skills.length) % skills.length);
    }
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const handleTechSelect = useCallback((tech: Technology | null) => {
    setSelectedTech(tech);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleCategoryChange('next');
      else if (e.key === 'ArrowLeft') handleCategoryChange('prev');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCategoryChange]);

  return (
    <section className="relative py-8 sm:py-10 md:py-12 lg:py-16 px-3 sm:px-4 md:px-6 bg-gradient-to-br from-gray-950 via-black to-gray-950 min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-gray-900 opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-red-600 to-blue-600 rounded-full border border-gray-700">
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
            <span className="text-white font-bold tracking-wide text-xs sm:text-sm md:text-base">
              F1 DIGITAL DASHBOARD
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black mb-3 sm:mb-4 md:mb-6 tracking-tight bg-gradient-to-r from-red-500 via-white to-blue-500 bg-clip-text text-transparent leading-tight">
            SKILLS TELEMETRY
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed px-2">
            Scroll to race the car along the track. Mouse for steering. Arrow keys to switch categories.
          </p>
        </div>

        {/* Category selector - Stacked on small screens */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
          <button
            onClick={() => handleCategoryChange('prev')}
            className={`p-2 sm:p-3 rounded-full border border-gray-700 bg-gray-900 hover:bg-gray-800 transition-all duration-300 ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'} order-2 sm:order-1`}
            disabled={isAnimating}
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
          </button>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 order-1 sm:order-2 w-full sm:w-auto mb-3 sm:mb-0">
            {skills.map((skill, index) => (
              <button
                key={skill.category}
                onClick={() => !isAnimating && setActiveCategory(index)}
                className={`px-3 py-2 sm:px-4 sm:py-3 rounded-lg transition-all duration-500 transform ${activeCategory === index
                  ? `scale-105 border border-white sm:border-2 bg-gradient-to-r ${skill.gradient}`
                  : 'border border-gray-700 bg-gray-900/50 hover:bg-gray-800'
                  } ${isAnimating ? 'cursor-not-allowed' : 'hover:scale-105'}`}
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <skill.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${activeCategory === index ? 'text-white' : 'text-gray-400'}`} />
                  <span className={`font-bold text-xs sm:text-sm ${activeCategory === index ? 'text-white' : 'text-gray-400'}`}>
                    {skill.category}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => handleCategoryChange('next')}
            className={`p-2 sm:p-3 rounded-full border border-gray-700 bg-gray-900 hover:bg-gray-800 transition-all duration-300 ${isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'} order-3`}
            disabled={isAnimating}
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
          </button>
        </div>

        <div ref={trackRef}>
          <RealF1DigitalSpeedometer
            skills={skills}
            activeCategory={activeCategory}
            selectedTech={selectedTech}
            onTechSelect={handleTechSelect}
            mouseX={mousePosition.x}
            mouseY={mousePosition.y}
            carSpeed={skills[activeCategory].maxSpeed}
            trackRect={trackRect}
            scrollProgress={scrollProgress}
          />
        </div>

        <div className="text-center mt-6 sm:mt-8 md:mt-10 pt-4 sm:pt-6 border-t border-gray-800">
          <div className="text-gray-500 text-xs sm:text-sm mb-2 sm:mb-3">CONTROLS</div>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <div className="px-2 py-1 bg-gray-800 rounded font-mono">← →</div>
              <span>Categories</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="px-2 py-1 bg-gray-800 rounded font-mono">SCROLL</div>
              <span>Car Progress</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="px-2 py-1 bg-gray-800 rounded font-mono">MOUSE</div>
              <span>Steering</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}