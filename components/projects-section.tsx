'use client';

import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Github, Flag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type RaceBoardStatus = 'SC' | 'FCY' | 'VSC';

const statusLabel: Record<RaceBoardStatus, string> = {
  SC: 'SAFETY CAR',
  FCY: 'FULL COURSE YELLOW',
  VSC: 'VIRTUAL SAFETY CAR',
};

const statusColorClass: Record<RaceBoardStatus, string> = {
  SC: 'from-yellow-400 to-yellow-600',
  FCY: 'from-amber-400 to-amber-600',
  VSC: 'from-sky-400 to-sky-600',
};

const projects = [
  {
    title: 'Assam Rifles Posting Management',
    description: 'A secure web-based system developed for Assam Rifles to manage personnel postings, transfers, tenure tracking, and administrative workflows.',
    tags: ['PHP Core', 'PostgreSQL', 'HTML5', 'AJAX', 'jQuery', 'Bootstrap'],
    stars: 200,
    laps: 20,
    bestLap: 'Phase 3',
    position: 1,
    status: 'Live' as RaceBoardStatus,
  },
  {
    title: 'Smart Government Digital Platform',
    description: 'Government-focused digital platform enabling workflow automation, role-based access, and data-driven governance.',
    tags: ['Laravel', 'Vue.js', 'REST API', 'Role-Based Access'],
    stars: 180,
    laps: 18,
    bestLap: 'Phase 3',
    position: 2,
    status: 'Active' as RaceBoardStatus,
  },
  {
    title: 'Content Management System (CMS)',
    description: 'Scalable CMS for managing government and institutional websites with performance optimization and caching.',
    tags: ['Laravel', 'Vue.js', 'Redis', 'PostgreSQL'],
    stars: 160,
    laps: 15,
    bestLap: 'Phase 2',
    position: 3,
    status: 'Live' as RaceBoardStatus,
  },
  {
    title: 'HR Management System',
    description: 'Enterprise HR solution for employee records, payroll, attendance, and role-based access control.',
    tags: ['Laravel', 'Vue.js', 'MySQL', 'REST API'],
    stars: 140,
    laps: 14,
    bestLap: 'Phase 2',
    position: 4,
    status: 'Live' as RaceBoardStatus,
  },
  {
    title: 'School ERP Management System',
    description: 'Comprehensive ERP solution for schools covering academics, administration, fees, and staff management.',
    tags: ['PHP Core', 'HTML5', 'Bootstrap 5', 'MySQL', 'JavaScript'],
    stars: 120,
    laps: 12,
    bestLap: 'Phase 1',
    position: 5,
    status: 'Live' as RaceBoardStatus,
  },
  {
    title: 'College Website & Administration Portal',
    description: 'Official college website with dynamic content management, academic information, and administrative modules.',
    tags: ['Next.js', 'Supabase', 'TypeScript', 'Responsive UI'],
    stars: 110,
    laps: 9,
    bestLap: 'Phase 1',
    position: 6,
    status: 'Live' as RaceBoardStatus,
  },
  {
    title: 'Doctor Online Appointment Booking',
    description: 'Web-based application for managing doctor appointments, patient records, and scheduling workflows.',
    tags: ['ASP.NET', 'C#', 'SQL Server', 'HTML', 'Bootstrap'],
    stars: 95,
    laps: 10,
    bestLap: 'Phase 1',
    position: 7,
    status: 'Live' as RaceBoardStatus,
  },
  {
    title: 'Travel Booking Mobile Application',
    description: 'Cross-platform mobile application for travel planning, bookings, and notifications.',
    tags: ['Flutter', 'Firebase', 'REST API'],
    stars: 130,
    laps: 11,
    bestLap: 'Phase 1',
    position: 8,
    status: 'Active' as RaceBoardStatus,
  },
  {
    title: 'Weather Forecast Mobile Application',
    description: 'Mobile application providing real-time weather forecasts using third-party APIs.',
    tags: ['React Native', 'API Integration', 'Mobile UI'],
    stars: 85,
    laps: 8,
    bestLap: 'Phase 1',
    position: 9,
    status: 'Live' as RaceBoardStatus,
  },
];


function RaceBoardCard({
  project,
  index,
  isVisible,
}: {
  project: (typeof projects)[number];
  index: number;
  isVisible: boolean;
}) {
  const status = project.status;
  const flashing = status === 'SC';
  const baseStatusColor = statusColorClass[status];

  return (
    <div
      className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 transform-none' : 'opacity-0 translate-y-10'
        }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Card className="group relative overflow-hidden bg-black border-2 border-yellow-500/40 shadow-[0_0_40px_rgba(250,204,21,0.15)] rounded-xl">
        {/* Top flashing strip */}
        <div
          className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${baseStatusColor} ${flashing ? 'animate-pulse' : ''
            }`}
        />

        {/* Position circle like car number */}
        <div className="absolute -top-3 -left-3 z-10">
          <div className="w-12 h-12 rounded-full bg-black border-2 border-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-500/40">
            <span className="text-xl font-extrabold text-yellow-300">
              {project.position}
            </span>
          </div>
        </div>

        {/* Status main header bar */}
        <div className="px-4 pt-6 pb-4 border-b border-yellow-500/30">
          <div className="flex items-center justify-between gap-3">
            <div
              className={`flex-1 px-4 py-2 rounded-md bg-gradient-to-r ${baseStatusColor} text-black font-extrabold text-center tracking-[0.25em] text-xs md:text-sm`}
            >
              {statusLabel[status]}
            </div>

            {/* Stars simplified as rating indicator */}
            <div className="flex flex-col items-end text-right">
              <span className="text-[10px] text-gray-400 tracking-widest">
                RATING
              </span>
              <span className="text-lg font-bold text-yellow-300 tabular-nums">
                {project.stars}
              </span>
            </div>
          </div>
        </div>

        {/* Center timing / info section */}
        <div className="px-5 pt-5 pb-4">
          {/* Project title as circuit name style */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-sm text-gray-400 uppercase tracking-[0.25em] mb-1">
                RACE SYSTEM
              </h3>
              <p className="text-xl font-semibold text-white truncate">
                {project.title}
              </p>
            </div>
          </div>

          {/* Description like control note */}
          <p className="text-xs text-gray-400 mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Timing row, mimicking race control clocks */}
          <div className="grid grid-cols-3 gap-3 mb-4 text-center">
            <div className="px-2 py-2 rounded-md bg-zinc-900 border border-yellow-500/20">
              <div className="text-[10px] text-gray-400 tracking-[0.2em] mb-1">
                LAPS
              </div>
              <div className="text-xl font-bold text-green-400 tabular-nums">
                {project.laps}
              </div>
            </div>
            <div className="px-2 py-2 rounded-md bg-zinc-900 border border-yellow-500/20">
              <div className="text-[10px] text-gray-400 tracking-[0.2em] mb-1">
                BEST LAP
              </div>
              <div className="text-sm font-semibold text-yellow-300 tabular-nums">
                {project.bestLap}
              </div>
            </div>
            <div className="px-2 py-2 rounded-md bg-zinc-900 border border-yellow-500/20">
              <div className="text-[10px] text-gray-400 tracking-[0.2em] mb-1">
                POSITION
              </div>
              <div className="text-xl font-bold text-red-400 tabular-nums">
                P{project.position}
              </div>
            </div>
          </div>

          {/* Tags as small LED labels */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.tags.map((tag, tagIndex) => (
              <span
                key={tag}
                className="px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] bg-zinc-950 text-gray-300 rounded border border-yellow-500/30"
                style={{
                  animationDelay: `${tagIndex * 80}ms`,
                  animation: isVisible ? `tagIn 0.3s ease-out ${tagIndex * 80}ms both` : 'none',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action buttons like control buttons */}
         
        </div>

        {/* Bottom LED indicators row */}
        <div className="px-4 pb-4 pt-2 border-t border-yellow-500/20">
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              <div
                className={`w-2.5 h-2.5 rounded-full ${status === 'SC' ? 'bg-yellow-300 animate-pulse' : 'bg-zinc-700'
                  }`}
              />
              <div
                className={`w-2.5 h-2.5 rounded-full ${status === 'FCY' ? 'bg-amber-300 animate-pulse' : 'bg-zinc-700'
                  }`}
              />
              <div
                className={`w-2.5 h-2.5 rounded-full ${status === 'VSC' ? 'bg-sky-300 animate-pulse' : 'bg-zinc-700'
                  }`}
              />
            </div>
            <div className="text-[10px] text-gray-500 tracking-[0.2em] uppercase">
              Race Control
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function ProjectsSection() {
  const [visibleProjects, setVisibleProjects] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            projects.forEach((_, index) => {
              setTimeout(() => {
                setVisibleProjects(prev =>
                  prev.includes(index) ? prev : [...prev, index],
                );
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const circuitPattern = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23dc2626' fill-opacity='0.08' fill-rule='evenodd'/%3E%3C/svg%3E`;

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative py-20 px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-5"
        style={{ backgroundImage: `url("${circuitPattern}")` }}
      />

      <div className="absolute top-0 left-0 right-0 h-20 opacity-10">
        <div className="grid grid-cols-10 h-full">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`${i % 2 === 0 ? 'bg-white' : 'bg-black'} ${Math.floor(i / 10) % 2 === 0 ? '' : 'opacity-70'
                }`}
            />
          ))}
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent"
            style={{
              top: `${15 + i * 25}%`,
              width: '100%',
              animation: `speedLine ${3 + i * 0.5}s linear infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-12 h-1 bg-yellow-500 mr-3" />
            <div className="px-5 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-black text-sm font-bold uppercase tracking-widest rounded border border-yellow-400/60">
              Projects Control Boards
            </div>
            <div className="w-12 h-1 bg-yellow-500 ml-3" />
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-white to-yellow-400">
            F1 Status Portfolio
          </h2>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto px-4 py-3 bg-gradient-to-r from-black/40 via-black/20 to-black/40 rounded-lg border border-gray-700/50">
            Project cards reimagined as{' '}
            <span className="text-yellow-300 font-bold">realistic F1 SC / FCY / VSC boards</span>{' '}
            to mirror modern race control interfaces.
          </p>

          <div className="flex justify-center items-center space-x-8 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-500">12+</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                PROJECTS
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">10+</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                FREELENCE
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">P1</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">
                BEST POSITION
              </div>
            </div>
          </div>
        </div>

        {/* Board-style projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <RaceBoardCard
              key={project.title}
              project={project}
              index={index}
              isVisible={visibleProjects.includes(index)}
            />
          ))}
        </div>

        {/* Summary */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-4 px-6 py-4 bg-gradient-to-r from-black/50 via-gray-900/50 to-black/50 rounded-xl border border-yellow-500/40">
            <Flag className="w-6 h-6 text-yellow-400" />
            <span className="text-gray-300">
              <span className="text-yellow-300 font-bold">
                {visibleProjects.length}
              </span>{' '}
              of{' '}
              <span className="text-white font-bold">{projects.length}</span>{' '}
              race boards visible
            </span>
            <div className="flex space-x-1">
              {projects.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${visibleProjects.includes(idx)
                      ? 'bg-yellow-400 scale-125'
                      : 'bg-gray-700'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes speedLine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes tagIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;         transform: scale(1);
          }
        }
      `}</style>
    </section>
  );
}
