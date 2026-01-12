'use client';

import { useState, useEffect, useRef } from 'react';
import { Target, Zap, Users, Clock, ChevronRight, Radio, MoveRight, Trophy, MapPin, Award, Briefcase, Menu, X } from 'lucide-react';

interface Experience {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string;
  color: string;
  data: {
    laps: number;
    topSpeed: string;
    sector: string;
    achievements: string[];
  };
}

export function ExperienceSection() {
  const [activeExperienceId, setActiveExperienceId] = useState<number>(1);
  const [battleMode, setBattleMode] = useState<boolean>(false);
  const [trackAnimation, setTrackAnimation] = useState<boolean>(false);
  const [cardAnimation, setCardAnimation] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<SVGSVGElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Experiences array with unique IDs
const experiences: Experience[] = [
    {
    id: 1,
    title: 'Junior Developer (Freelancer)',
    company: 'Defence Project (Freelance)',
    period: '2022-2023',
    description: 'Worked as a junior developer on a defence-related web project, focusing on secure and reliable web modules.',
    color: '#0600ef',
    data: {
      laps: 1,
      topSpeed: '160',
      sector: 'Sector 1',
      achievements: [
        'Developed secure PHP core modules',
        'Built responsive UI using Bootstrap',
        'Implemented dynamic features using JavaScript'
      ]
    }
  },
  {
    id: 2,
    title: 'Full-Stack Developer',
    company: 'Enterprise & ERP Projects',
    period: '2023 - 2024',
    description: 'Worked on multiple enterprise-level projects including HR systems, School ERP, and a mobile application.',
    color: '#ff9800',
    data: {
      laps: 2,
      topSpeed: '185',
      sector: 'Sector 2',
      achievements: [
        'Delivered HR and School ERP solutions',
        'Built REST APIs using Laravel and Vue.js',
        'Used Talend for ETL and data automation'
      ]
    }
  },
  {
    id: 3,
    title: 'Full-Stack Developer',
    company: 'NIC Meghalaya',
    period: '2024 - 2025',
    description: 'Developed and maintained government CMS platforms with a focus on performance and scalability.',
    color: '#900000',
    data: {
      laps: 3,
      topSpeed: '200',
      sector: 'Sector 3',
      achievements: [
        'Built CMS using Laravel and Vue.js',
        'Integrated Redis for caching and performance',
        'Improved page load performance significantly'
      ]
    }
  },
  {
    id: 4,
    title: 'Full-Stack Developer',
    company: 'IIT Guwahati (Smart Government Projects)',
    period: '2025 - Present',
    description: 'Currently involved in smart government projects, focusing on scalable architecture and clean business logic.',
    color: '#00d2be',
    data: {
      laps: 4,
      topSpeed: '215',
      sector: 'Sector 2',
      achievements: [
        'Developed smart governance modules',
        'Designed reusable Laravel-Vue architecture',
        'Collaborated with research and government teams'
      ]
    }
  }
  ];

  // Check for mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Find active experience by ID
  const getActiveExperience = () => {
    return experiences.find(exp => exp.id === activeExperienceId) || experiences[0];
  };

  // Get active experience index for track positions
  const getActiveExperienceIndex = () => {
    return experiences.findIndex(exp => exp.id === activeExperienceId);
  };

  // Responsive track positions
  const trackPositions = isMobile 
    ? [
        { x: 20, y: 15, rotation: -15 },
        { x: 40, y: 30, rotation: 25 },
        { x: 60, y: 50, rotation: -10 },
        { x: 80, y: 70, rotation: 20 },
      ]
    : [
        { x: 15, y: 10, rotation: -15 },
        { x: 25, y: 30, rotation: 25 },
        { x: 40, y: 50, rotation: -10 },
        { x: 60, y: 70, rotation: 20 },
      ];

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const progress = Math.max(0, Math.min(100, 
          ((windowHeight - rect.top) / (rect.height + windowHeight)) * 100
        ));
        setScrollProgress(progress);
        
        // Auto-select experience based on scroll
        const expIndex = Math.min(Math.floor((progress / 100) * experiences.length), experiences.length - 1);
        if (expIndex !== getActiveExperienceIndex() && experiences[expIndex]) {
          handleExperienceSelect(experiences[expIndex].id);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleExperienceSelect = (id: number) => {
    setTrackAnimation(true);
    setCardAnimation(true);
    setActiveExperienceId(id);
    setShowMobileMenu(false);
    
    // Reset animations after completion
    setTimeout(() => setTrackAnimation(false), 1000);
    setTimeout(() => setCardAnimation(false), 600);
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          {experiences.map((exp) => {
            const index = experiences.findIndex(e => e.id === exp.id);
            const isActive = exp.id === activeExperienceId;
            const pos = trackPositions[index] || trackPositions[0];
            
            return (
              <div
                key={exp.id}
                className={`absolute w-32 h-32 lg:w-64 lg:h-64 rounded-full blur-3xl transition-all duration-1000 ${
                  isActive ? 'opacity-30' : 'opacity-10'
                }`}
                style={{
                  backgroundColor: exp.color,
                  top: `${pos.y}%`,
                  left: `${pos.x}%`,
                  transform: `translate(-50%, -50%) scale(${isActive ? 1.5 : 1})`,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto px-4 py-6 lg:py-12">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-700"
        >
          {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Header */}
        <div className="mb-6 lg:mb-8 border-b border-gray-700 pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <h1 className="text-xl lg:text-2xl font-bold tracking-tight">EXPERIENCE TRACKER</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Clock className="h-4 w-4" />
                <span>LAP {getActiveExperienceIndex() + 1}/{experiences.length}</span>
              </div>
            </div>
         
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel - CAREER LAPS - Hidden on mobile, shown in sidebar */}
          <div className={`lg:col-span-3 space-y-3 ${showMobileMenu ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg tracking-wide">CAREER LAPS</h2>
                <Users className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="space-y-3">
                {experiences.map((exp) => {
                  const isActive = exp.id === activeExperienceId;
                  return (
                    <div
                      key={exp.id}
                      onClick={() => handleExperienceSelect(exp.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-500 transform hover:scale-[1.02] ${
                        isActive 
                          ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-l-4 shadow-lg' 
                          : 'bg-gray-900/50 hover:bg-gray-800/70'
                      }`}
                      style={{ 
                        borderLeftColor: exp.color,
                        transform: isActive ? 'translateX(4px)' : 'none'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className={`w-3 h-3 rounded-full transition-transform duration-300 ${
                              isActive ? 'scale-125' : ''
                            }`}
                            style={{ backgroundColor: exp.color }}
                          />
                          <div className="overflow-hidden">
                            <div className={`font-bold text-lg transition-colors truncate ${
                              isActive ? 'text-white' : 'text-gray-300'
                            }`}>
                              {exp.title.split(' ')[0]}
                            </div>
                            <div className="text-xs text-gray-400 truncate">{exp.company}</div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className={`text-sm font-mono ${
                            isActive ? 'text-cyan-400' : 'text-gray-400'
                          }`}>
                            LAP {experiences.findIndex(e => e.id === exp.id) + 1}
                          </div>
                          <div className="text-xs text-gray-500">{exp.period}</div>
                        </div>
                      </div>
                      {isActive && (
                        <div className="mt-3 pt-3 border-t border-gray-800 animate-fadeIn">
                          <div className="text-xs text-gray-400">✓ Currently Selected</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Center Panel - Track */}
          <div className="col-span-1 lg:col-span-6 relative">
            <div className="relative h-[400px] lg:h-[600px] bg-gradient-to-b from-gray-900 to-black rounded-2xl border-2 border-gray-800 overflow-hidden shadow-2xl">
              {/* Track Container */}
              <div className="absolute inset-0 p-4">
                <svg 
                  ref={trackRef}
                  className="w-full h-full"
                  viewBox="0 0 800 600"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <linearGradient id="activeTrackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1f2937" />
                      <stop offset="50%" stopColor={getActiveExperience().color} />
                      <stop offset="100%" stopColor="#111827" />
                    </linearGradient>
                    
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur"/>
                      <feMerge>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Main Track - Simplified for mobile */}
                  <path
                    d={isMobile 
                      ? "M 50,200 C 150,50 250,50 350,150 S 550,200 650,250 C 700,300 700,400 650,450 S 450,450 350,350 S 150,350 50,250"
                      : "M 50,250 C 150,50 250,50 350,150 S 550,200 650,250 C 700,300 700,400 650,450 S 450,450 350,350 S 150,350 50,250"
                    }
                    fill="none"
                    stroke="#374151"
                    strokeWidth={isMobile ? "60" : "84"}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />

                  {/* Animated Track Surface */}
                  <path
                    d={isMobile 
                      ? "M 50,200 C 150,50 250,50 350,150 S 550,200 650,250 C 700,300 700,400 650,450 S 450,450 350,350 S 150,350 50,250"
                      : "M 50,250 C 150,50 250,50 350,150 S 550,200 650,250 C 700,300 700,400 650,450 S 450,450 350,350 S 150,350 50,250"
                    }
                    fill="none"
                    stroke="url(#activeTrackGradient)"
                    strokeWidth={isMobile ? "56" : "80"}
                    strokeLinecap="round"
                    className={`transition-all duration-1000 ${trackAnimation ? (isMobile ? 'stroke-[60px]' : 'stroke-[85px]') : ''}`}
                  />

                  {/* Experience Position Markers */}
                  {experiences.map((exp, index) => {
                    const pos = trackPositions[index];
                    const isActive = exp.id === activeExperienceId;
                    
                    return (
                      <g key={exp.id} className="transition-all duration-700">
                        {/* Connection line for active marker */}
                        {isActive && (
                          <line
                            x1={`${pos.x}%`}
                            y1={`${pos.y}%`}
                            x2="50%"
                            y2={isMobile ? "85%" : "100%"}
                            stroke={exp.color}
                            strokeWidth="2"
                            strokeDasharray="5,3"
                            opacity="0.5"
                            className="animate-dash"
                          />
                        )}
                        
                        {/* Outer glow for active marker */}
                        {isActive && (
                          <circle
                            cx={`${pos.x}%`}
                            cy={`${pos.y}%`}
                            r={isMobile ? "16" : "24"}
                            stroke={exp.color}
                            strokeWidth="2"
                            fill="none"
                            opacity="0.3"
                            className="animate-ping"
                          />
                        )}
                        
                        {/* Marker circle */}
                        <circle
                          cx={`${pos.x}%`}
                          cy={`${pos.y}%`}
                          r={isActive ? (isMobile ? "12" : "18") : (isMobile ? "8" : "12")}
                          fill={exp.color}
                          className={`transition-all duration-500 ${isActive ? 'animate-bounce' : ''}`}
                          filter={isActive ? "url(#glow)" : "none"}
                          onClick={() => handleExperienceSelect(exp.id)}
                          style={{ cursor: 'pointer' }}
                        />
                        
                        {/* Inner circle */}
                        <circle
                          cx={`${pos.x}%`}
                          cy={`${pos.y}%`}
                          r={isActive ? (isMobile ? "6" : "10") : (isMobile ? "4" : "6")}
                          fill="white"
                          className="transition-all duration-500"
                        />
                        
                        {/* Position number */}
                        <text
                          x={`${pos.x}%`}
                          y={`${pos.y}%`}
                          textAnchor="middle"
                          dy=".3em"
                          className={`font-bold transition-all duration-500 ${
                            isActive 
                              ? (isMobile ? 'text-[10px] fill-black' : 'text-sm fill-black') 
                              : (isMobile ? 'text-[8px] fill-gray-800' : 'text-xs fill-gray-800')
                          }`}
                        >
                          {index + 1}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Active Experience Display Card - Positioned differently on mobile */}
                <div className={`absolute transition-all duration-700 ${
                  cardAnimation ? 'animate-slideUp' : ''
                } ${
                  isMobile 
                    ? 'bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-sm' 
                    : 'bottom-8 left-1/2 transform -translate-x-1/2 w-96'
                }`}>
                  <div 
                    className="bg-gray-900/90 backdrop-blur-lg rounded-xl border-2 p-4 lg:p-6 shadow-2xl"
                    style={{ borderColor: getActiveExperience().color }}
                  >
                    <div className="flex items-center justify-between mb-3 lg:mb-4">
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <div 
                          className="w-3 h-3 lg:w-4 lg:h-4 rounded-full animate-pulse flex-shrink-0"
                          style={{ backgroundColor: getActiveExperience().color }}
                        />
                        <h3 className="text-lg lg:text-xl font-bold truncate">
                          {getActiveExperience().title}
                        </h3>
                      </div>
                      <div className="px-2 lg:px-3 py-1 rounded-full bg-gray-800 text-xs lg:text-sm font-medium flex-shrink-0">
                        LAP {getActiveExperienceIndex() + 1}
                      </div>
                    </div>
                    
                    <div className="mb-3 lg:mb-4">
                      <div className="flex flex-col lg:flex-row lg:items-center space-y-1 lg:space-y-0 lg:space-x-2 text-gray-400 mb-2">
                        <div className="flex items-center space-x-2">
                          <Briefcase className="h-3 w-3 lg:h-4 lg:w-4" />
                          <span className="text-sm lg:text-base font-medium truncate">{getActiveExperience().company}</span>
                        </div>
                        <span className="text-xs bg-gray-800 px-2 py-1 rounded w-fit">
                          {getActiveExperience().period}
                        </span>
                      </div>
                      <p className="text-gray-300 text-xs lg:text-sm">
                        {getActiveExperience().description}
                      </p>
                    </div>
                    
                    <div className="pt-3 lg:pt-4 border-t border-gray-800">
                      <div className="flex items-center space-x-2 text-xs lg:text-sm text-gray-400 mb-2 lg:mb-3">
                        <Award className="h-3 w-3 lg:h-4 lg:w-4" />
                        <span>KEY ACHIEVEMENTS</span>
                      </div>
                      <ul className="space-y-1 lg:space-y-2">
                        {getActiveExperience().data.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-xs lg:text-sm">
                            <div 
                              className="w-2 h-2 rounded-full mt-1 lg:mt-1.5 flex-shrink-0"
                              style={{ backgroundColor: getActiveExperience().color }}
                            />
                            <span className="text-gray-300">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Active Experience Details - Hidden on mobile */}
          <div className="hidden lg:block lg:col-span-3 space-y-3">
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg tracking-wide">ACTIVE LAP DATA</h2>
                <Radio className="h-5 w-5 text-gray-400" />
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gray-800/30">
                  <div className="text-xs text-gray-400 mb-2">CURRENT SECTOR</div>
                  <div className="text-2xl font-bold" style={{ color: getActiveExperience().color }}>
                    {getActiveExperience().data.sector}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-gray-800/30">
                    <div className="text-xs text-gray-400">TOTAL LAPS</div>
                    <div className="text-2xl font-bold">{getActiveExperience().data.laps}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-800/30">
                    <div className="text-xs text-gray-400">TOP SPEED</div>
                    <div className="text-2xl font-bold">{getActiveExperience().data.topSpeed}</div>
                    <div className="text-xs text-gray-500">km/h</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Active Lap Data - Only shown on mobile */}
        <div className="lg:hidden mt-6 bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">ACTIVE LAP DATA</h3>
            <Radio className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-gray-800/30">
              <div className="text-xs text-gray-400 mb-2">CURRENT SECTOR</div>
              <div className="text-2xl font-bold" style={{ color: getActiveExperience().color }}>
                {getActiveExperience().data.sector}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-gray-800/30">
                <div className="text-xs text-gray-400">TOTAL LAPS</div>
                <div className="text-2xl font-bold">{getActiveExperience().data.laps}</div>
              </div>
              <div className="p-3 rounded-lg bg-gray-800/30">
                <div className="text-xs text-gray-400">TOP SPEED</div>
                <div className="text-2xl font-bold">{getActiveExperience().data.topSpeed}</div>
                <div className="text-xs text-gray-500">km/h</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Timeline - CAREER LAP HISTORY */}
        <div className="mt-6 lg:mt-8 bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 space-y-2 lg:space-y-0">
            <h3 className="font-bold text-lg">CAREER LAP HISTORY</h3>
            <div className="flex items-center space-x-2 text-xs lg:text-sm text-gray-400">
              <Clock className="h-3 w-3 lg:h-4 lg:w-4" />
              <span>CLICK TO VIEW LAP DETAILS</span>
            </div>
          </div>
          
          <div className="flex overflow-x-auto pb-2 space-x-4 lg:space-x-4 snap-x snap-mandatory">
            {experiences.map((exp, index) => {
              const isActive = exp.id === activeExperienceId;
              
              return (
                <div
                  key={exp.id}
                  className={`flex-shrink-0 w-[85%] lg:w-60 p-4 rounded-xl cursor-pointer transition-all duration-500 transform hover:scale-[1.02] snap-center ${
                    isActive 
                      ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-2 shadow-xl scale-[1.02]' 
                      : 'bg-gray-900/50 hover:bg-gray-800/70'
                  }`}
                  style={{ borderColor: isActive ? exp.color : 'transparent' }}
                  onClick={() => handleExperienceSelect(exp.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div 
                        className={`w-3 h-3 rounded-full transition-transform ${
                          isActive ? 'scale-125' : ''
                        }`}
                        style={{ backgroundColor: exp.color }}
                      />
                      <div className={`font-bold text-lg ${
                        isActive ? 'text-white' : 'text-gray-300'
                      }`}>
                        LAP {index + 1}
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 transition-transform ${
                      isActive ? 'text-cyan-400 rotate-90' : 'text-gray-500'
                    }`} />
                  </div>
                  
                  <div className="mb-2">
                    <div className="font-medium truncate">{exp.title}</div>
                    <div className="text-sm text-gray-400 truncate">{exp.company}</div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-3">{exp.period}</div>
                  
                  {isActive && (
                    <div className="pt-3 border-t border-gray-800 animate-fadeIn">
                      <div className="text-xs text-green-400 font-medium">✓ ACTIVE POSITION</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to { 
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        
        @keyframes dash {
          to { stroke-dashoffset: -8; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
        
        .animate-dash {
          animation: dash 1s linear infinite;
        }
      `}</style>
    </section>
  );
}