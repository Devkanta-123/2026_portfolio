'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Heart,
  Code2,
  Flag,
  Trophy,
  Clock,
  Zap,
  Shield,
  FileText,
  Lock,
  AlertTriangle,
  Copyright,
  CheckCircle,
  Facebook,
  Instagram,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeModal, setActiveModal] = useState<'policy' | 'terms' | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const racingLinePoints = [
      { x: 0, y: canvas.height / 2 },
      { x: canvas.width * 0.2, y: canvas.height * 0.3 },
      { x: canvas.width * 0.4, y: canvas.height * 0.7 },
      { x: canvas.width * 0.6, y: canvas.height * 0.4 },
      { x: canvas.width * 0.8, y: canvas.height * 0.6 },
      { x: canvas.width, y: canvas.height / 2 },
    ];

    let animationFrameId: number;
    let progress = 0;
    const racingCar = {
      x: 0,
      y: canvas.height / 2,
      speed: 0.005,
      size: 8,
      color: '#dc2626',
    };

    const drawRacingLine = () => {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 10]);
      ctx.beginPath();
      ctx.moveTo(racingLinePoints[0].x, racingLinePoints[0].y);
      for (let i = 1; i < racingLinePoints.length; i++) {
        const prev = racingLinePoints[i - 1];
        const curr = racingLinePoints[i];
        ctx.lineTo(curr.x, curr.y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const getPointOnCurve = (t: number) => {
      const segments = racingLinePoints.length - 1;
      const segmentIndex = Math.floor(t * segments);
      const segmentProgress = (t * segments) - segmentIndex;

      if (segmentIndex >= racingLinePoints.length - 1) {
        return racingLinePoints[racingLinePoints.length - 1];
      }

      const p0 = racingLinePoints[segmentIndex];
      const p1 = racingLinePoints[segmentIndex + 1];

      return {
        x: p0.x + (p1.x - p0.x) * segmentProgress,
        y: p0.y + (p1.y - p0.y) * segmentProgress,
      };
    };

    const drawRacingCar = (x: number, y: number) => {
      // Car body
      ctx.fillStyle = racingCar.color;
      ctx.beginPath();
      ctx.ellipse(x, y, racingCar.size, racingCar.size / 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Car details
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(x - racingCar.size * 0.3, y, racingCar.size * 0.3, racingCar.size * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Glow effect
      ctx.fillStyle = `${racingCar.color}40`;
      ctx.beginPath();
      ctx.ellipse(x, y, racingCar.size * 1.5, racingCar.size, 0, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw racing line
      drawRacingLine();

      // Update car position
      progress += racingCar.speed;
      if (progress > 1) {
        progress = 0;
        racingCar.color = `hsl(${Math.random() * 60 + 300}, 80%, 50%)`;
      }

      const carPos = getPointOnCurve(progress);
      racingCar.x = carPos.x;
      racingCar.y = carPos.y;

      // Draw car
      drawRacingCar(racingCar.x, racingCar.y);

      // Draw track markers
      for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        const markerPos = getPointOnCurve(t);
        ctx.fillStyle = i % 2 === 0 ? '#dc2626' : '#ffffff';
        ctx.beginPath();
        ctx.ellipse(markerPos.x, markerPos.y, 2, 2, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setActiveModal(null);
      }
    };

    if (activeModal) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [activeModal]);

  const openModal = (modal: 'policy' | 'terms') => {
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const footerLinks = [
    {
      title: 'Racing Lanes',
      icon: Flag,
      links: [
        { label: 'Starting Grid', href: '#' },
        { label: 'Project Paddock', href: '#projects' },
        { label: 'Pit Lane', href: '#contact' },
      ],
    },
    {
      title: 'Team Channels',
      icon: Trophy,
      links: [
        {
          label: 'Facebook',
          href: 'https://www.facebook.com/devkant.konsam?mibextid=ZbWKwL',
          icon: Facebook
        },
        {
          label: 'Instagram',
          href: 'https://instagram.com/dev_since_1998?igshid=MzRlODBiNWFlZA==',
          icon: Instagram
        },
      ],
    },
  ];
  const seasonStats = [
    { label: 'Race Wins', value: '12', icon: Trophy },
    { label: 'Podiums', value: '29', icon: Flag },
    { label: 'Pole Positions', value: '8', icon: Clock },
    { label: 'Fastest Laps', value: '14', icon: Zap },
  ];

  const legalSections = {
    policy: [
      {
        title: 'Intellectual Property Rights',
        icon: Copyright,
        content: `All content, design, graphics, source code, and visual elements displayed on this website are the exclusive intellectual property of Devkanta Racing Team. No part of this website may be reproduced, distributed, or transmitted in any form or by any means without prior written permission.`
      },
      {
        title: 'Code & Design Protection',
        icon: Shield,
        content: `The proprietary codebase, UI/UX designs, animations, and interactive elements are protected under international copyright laws. Reverse engineering, decompilation, or unauthorized copying of any source material is strictly prohibited.`
      },
      {
        title: 'Digital Assets',
        icon: FileText,
        content: `All digital assets including but not limited to: React components, styling systems, animations, 3D models, and multimedia content are registered works. Unauthorized use may result in legal action under the Digital Millennium Copyright Act (DMCA) and international IP treaties.`
      },
      {
        title: 'Trademark Notice',
        icon: AlertTriangle,
        content: `"Devkanta Racing Team", the racing theme, color schemes, and associated branding elements are trademarks. Use of these marks without express authorization constitutes trademark infringement.`
      }
    ],
    terms: [
      {
        title: 'Acceptable Use',
        icon: CheckCircle,
        content: `By accessing this website, you agree not to copy, modify, distribute, or create derivative works based on the content, design, or code. The website is for personal, non-commercial viewing only.`
      },
      {
        title: 'Content Restrictions',
        icon: Lock,
        content: `All visual and interactive elements are protected digital property. Screenshots, recordings, or other reproductions for commercial purposes require written consent. Educational use must be properly attributed.`
      },
      {
        title: 'Liability & Warranty',
        icon: Shield,
        content: `Devkanta Racing Team provides no warranty regarding the availability or functionality of this site. We are not liable for any damages resulting from unauthorized use or attempts to replicate proprietary systems.`
      },
      {
        title: 'Governing Law',
        icon: FileText,
        content: `These terms are governed by the laws of the Republic of India. Any disputes shall be settled in the courts of Guwahati, Assam. International copyright conventions including Berne and WIPO treaties apply.`
      }
    ]
  };

  return (
    <>
      <footer className="relative bg-gradient-to-b from-gray-900 via-black to-gray-950 text-gray-300 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
        />

        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent"
              style={{
                top: `${30 + i * 20}%`,
                width: '100%',
                animation: `speedLine ${2 + i}s linear infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {seasonStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="text-center p-4 bg-gradient-to-br from-gray-800/30 to-black/30 rounded-lg border border-gray-800 hover:border-red-500/50 transition-colors duration-300"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 100}ms both`,
                  }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-gradient-to-br from-red-600/20 to-black/50 border border-gray-700">
                    <Icon className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg">
                    <Code2 className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full animate-ping"></div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white">Devkanta Singh</div>
                  <div className="text-sm text-red-400 font-bold uppercase tracking-widest">Racing Developer</div>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                Building <span className="text-red-400 font-bold">high-performance solutions</span> at
                <span className="text-yellow-400 font-bold"> lightning speed</span>. Ready to join your
                <span className="text-white font-bold"> winning team</span>.
              </p>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-900/30 to-black/30 rounded-full border border-green-500/30">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Race-ready for projects</span>
                </div>
              </div>
            </div>

            {footerLinks.map((section, sectionIndex) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.title}
                  className="group"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${sectionIndex * 100 + 400}ms both`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-800 to-black flex items-center justify-center border border-gray-700 group-hover:border-red-500 transition-colors">
                      <Icon className="w-5 h-5 text-red-400" />
                    </div>
                    <h3 className="text-white font-bold text-lg">{section.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {section.links.map((link) => {
                      // Only get LinkIcon if it exists on the link object
                      const LinkIcon = (link as any).icon; // Type assertion for now
                      return (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            target={link.href.startsWith('http') ? "_blank" : "_self"}
                            rel={link.href.startsWith('http') ? "noopener noreferrer" : undefined}
                            className="text-sm text-gray-400 hover:text-red-400 transition-all duration-300 hover:translate-x-2 inline-flex items-center gap-2 group/link"
                          >
                            {/* Conditionally render icon if it exists */}
                            {LinkIcon && <LinkIcon className="w-4 h-4" />}
                            <span>{link.label}</span>
                            <span className="text-red-400 opacity-0 group-hover/link:opacity-100 transition-opacity">→</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="relative my-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="px-6 py-2 bg-gradient-to-r from-gray-900 to-black rounded-lg border border-gray-800">
                <div className="flex items-center gap-3">
                  <Flag className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-bold text-white uppercase tracking-widest">Finish Line</span>
                  <Flag className="w-5 h-5 text-red-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-400">
                © {currentYear} <span className="text-red-400 font-bold">Devkanta Racing Team</span>. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Season {currentYear} • Powered by high-performance technology
              </p>
            </div>

            <div className="flex gap-6 text-sm">
              <button
                onClick={() => openModal('policy')}
                className="text-gray-400 hover:text-red-400 transition-colors relative group/policy flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                <span>Race Policy</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 group-hover/policy:w-full transition-all duration-300"></span>
              </button>
              <button
                onClick={() => openModal('terms')}
                className="text-gray-400 hover:text-red-400 transition-colors relative group/terms flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Team Terms</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 group-hover/terms:w-full transition-all duration-300"></span>
              </button>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-gray-900/50 to-black/50 rounded-full border border-gray-800">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <span className="text-xs text-gray-400">
                Current Season Status: <span className="text-green-400 font-bold">Green Flag</span> • Ready to Race
              </span>
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

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </footer>

      {/* Legal Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div
            ref={modalRef}
            className="relative w-full max-w-4xl bg-gradient-to-br from-black via-[#0a0a0a] to-black border border-red-900/60 rounded-2xl shadow-[0_0_80px_rgba(220,38,38,0.3)] overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={closeModal}
                className="p-2 rounded-full border border-red-600/60 bg-black/80 hover:bg-red-900/30 transition-colors duration-300"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-red-400" />
              </button>
            </div>

            <div className="p-8">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center mb-4">
                  <div className="h-px w-12 bg-red-600/80" />
                  <div className="mx-3 px-4 py-1.5 border border-red-600/60 bg-black/70 text-xs font-semibold tracking-[0.3em] uppercase text-red-400">
                    {activeModal === 'policy' ? 'LEGAL NOTICE' : 'TERMS OF SERVICE'}
                  </div>
                  <div className="h-px w-12 bg-red-600/80" />
                </div>
                <h2 className="text-3xl font-bold tracking-[0.1em] uppercase text-white mb-3">
                  {activeModal === 'policy' ? 'Race Policy & Copyright' : 'Team Terms & Conditions'}
                </h2>
                <p className="text-gray-400 font-mono text-sm tracking-wider">
                  {activeModal === 'policy'
                    ? 'Intellectual Property Protection & Legal Rights'
                    : 'Usage Guidelines & Legal Agreements'}
                </p>
              </div>

              <div className="space-y-6 mb-8">
                {(activeModal === 'policy' ? legalSections.policy : legalSections.terms).map((section, index) => {
                  const Icon = section.icon;
                  return (
                    <div
                      key={section.title}
                      className="bg-gradient-to-br from-gray-900/30 to-black/30 rounded-xl border border-gray-800/50 p-6 hover:border-red-500/30 transition-all duration-300 group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-600/20 to-black/50 border border-red-500/30 flex items-center justify-center group-hover:border-red-500/60 transition-colors">
                            <Icon className="w-6 h-6 text-red-400" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-bold text-white">{section.title}</h3>
                            <div className="h-px flex-1 bg-gradient-to-r from-red-500/40 to-transparent"></div>
                          </div>
                          <p className="text-gray-300 leading-relaxed">
                            {section.content}
                          </p>
                          {activeModal === 'policy' && index === 0 && (
                            <div className="mt-4 p-4 bg-gradient-to-r from-red-900/20 to-black/20 rounded-lg border border-red-500/20">
                              <div className="flex items-center gap-3">
                                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                                <p className="text-sm text-yellow-200">
                                  <strong>WARNING:</strong> Unauthorized reproduction of any content, design, or code elements will result in immediate legal action. All materials are digitally watermarked and tracked.
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {activeModal === 'policy' && (
                <div className="mb-8 p-6 bg-gradient-to-r from-gray-900/40 to-black/40 rounded-xl border border-gray-800">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                    <Lock className="w-6 h-6 text-red-400" />
                    Enforcement & Legal Actions
                  </h3>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>DMCA Compliance:</strong> All copyright violations will be prosecuted under the Digital Millennium Copyright Act with statutory damages up to $150,000 per infringement.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>International Protection:</strong> Protected under Berne Convention, WIPO Copyright Treaty, and TRIPS Agreement across 179 countries.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span><strong>Takedown Notices:</strong> Immediate removal requests will be sent to hosting providers, search engines, and CDN networks for any infringing content.</span>
                    </li>
                  </ul>
                </div>
              )}

              <div className="text-center pt-8 border-t border-gray-800/50">
                <div className="inline-flex items-center gap-4 mb-6">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                  <span className="text-xs font-mono tracking-[0.3em] uppercase text-gray-400">LEGAL ACKNOWLEDGMENT</span>
                  <div className="h-px w-16 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={closeModal}
                    className="bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white border border-gray-700 hover:border-red-500/50 px-8 py-3 rounded-full transition-all duration-300"
                  >
                    I Understand & Acknowledge
                  </Button>
                  {activeModal === 'terms' && (
                    <Button
                      onClick={closeModal}
                      className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white border border-red-500/70 px-8 py-3 rounded-full transition-all duration-300"
                    >
                      Accept Terms
                    </Button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  By continuing, you acknowledge reading and understanding all {activeModal === 'policy' ? 'copyright policies' : 'terms and conditions'}.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}