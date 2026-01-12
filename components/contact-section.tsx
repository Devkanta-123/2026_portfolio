'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Mail,
  Github,
  Facebook,
  Linkedin,
  Twitter,
  MapPin,
  Send,
  Flag,
  Trophy,
  CheckCircle,
  Radio,
  X,
  MessageSquare,
  Instagram,
  User,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const contactMethods = [
  {
    icon: Mail,
    label: 'TEAM RADIO',
    value: 'devakantakonsam782@gmail.com',
    href: 'mailto:devakantakonsam782@gmail.com',
    description: 'Primary engineering channel',
    status: 'ONLINE',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    href: 'https://www.instagram.com/accounts/login/?next=%2Fdev_since_1998%2F&source=omni_redirect',
    description: 'dev_since_1998',
    status: 'SECURE',
  },
 {
    icon: Facebook,
    label: 'Instagram',
    href: 'https://www.facebook.com/devkant.konsam?mibextid=ZbWKwL',
    description: 'Devkant Konsam',
    status: 'SECURE',
  },
  
];

const socialLinks = [
  {
    icon: Github,
    label: 'GitHub',
    href: 'https://github.com',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: 'https://linkedin.com',
  },
  {
    icon: Twitter,
    label: 'Twitter',
    href: 'https://twitter.com',
  },
  {
    icon: Send,
    label: 'Telegram',
    href: 'https://telegram.org',
  },
];

export function ContactSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const sectionRef = useRef<HTMLElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Handle click outside modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleCloseModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setSubmitStatus('idle');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setIsModalOpen(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // IMPORTANT: Create your own Formspree form at https://formspree.io
      // and replace 'xvgglkoa' with your actual form ID
      const response = await fetch('https://formspree.io/f/mdakbwkk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `New Race Signal from ${formData.name}`,
          _replyto: formData.email,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        
        // Auto-close modal after success
        setTimeout(() => {
          setIsModalOpen(false);
          setIsSubmitting(false);
        }, 2000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setIsSubmitting(false);
    }
  };

  // Subtle carbon / circuit background
  const circuitPattern =
    "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='60' height='60' fill='%23000000'/%3E%3Cpath d='M5 10h25c8 0 12 4 12 12v6c0 8 4 12 12 12h14' stroke='%23b91c1c' stroke-width='1.2' fill='none' stroke-opacity='0.18'/%3E%3Ccircle cx='10' cy='14' r='2' fill='%23ef4444' fill-opacity='0.3'/%3E%3Ccircle cx='40' cy='30' r='2' fill='%23ef4444' fill-opacity='0.22'/%3E%3Ccircle cx='55' cy='40' r='2' fill='%23ef4444' fill-opacity='0.15'/%3E%3C/svg%3E";

  return (
    <>
      <section
        ref={sectionRef}
        id="contact"
        className="relative py-20 px-4 overflow-hidden bg-[#020308] text-white"
      >
        {/* Carbon / circuit background */}
        <div
          className="absolute inset-0 opacity-40 mix-blend-lighten"
          style={{ backgroundImage: `url("${circuitPattern}")` }}
        />

        {/* Horizontal HUD speed lines */}
        <div className="absolute inset-0 pointer-events-none">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="absolute h-[1px] bg-gradient-to-r from-transparent via-red-600/60 to-transparent"
              style={{
                top: `${25 + i * 18}%`,
                width: '120%',
                animation: `mclarenSpeed ${4 + i}s linear infinite`,
                animationDelay: `${i * 0.4}s`,
                opacity: isVisible ? 1 : 0,
              }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="h-px w-12 bg-red-600/80" />
              <div className="mx-3 px-4 py-1 border border-red-600/60 bg-black/70 text-[11px] font-semibold tracking-[0.35em] uppercase text-red-400 shadow-[0_0_20px_rgba(248,113,113,0.25)]">
                PIT CONTROL • CONTACT
              </div>
              <div className="h-px w-12 bg-red-600/80" />
            </div>

            <h2 className="text-3xl md:text-5xl font-bold tracking-[0.18em] uppercase text-gray-100 mb-3">
              McLaren F1 Pit Dash
            </h2>

            <p className="text-sm md:text-base text-gray-400 max-w-xl mx-auto font-mono tracking-[0.22em] uppercase">
              Real-time race communications • Engineering link • Mission control
            </p>
          </div>

          {/* THREE McLaren‑style cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7 mb-14">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <Card
                  key={method.label}
                  className={`relative overflow-hidden bg-gradient-to-b from-black via-[#050509] to-black border border-red-900/70 shadow-[0_0_40px_rgba(248,113,113,0.18)] rounded-xl px-5 py-5 md:px-6 md:py-6 transition-all duration-500 group
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                  style={{ transitionDelay: `${index * 160}ms` }}
                >
                  {/* Corner accent bars */}
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute top-0 left-0 h-[2px] w-10 bg-gradient-to-r from-red-500 to-transparent" />
                    <div className="absolute top-0 left-0 h-10 w-[2px] bg-gradient-to-b from-red-500 to-transparent" />
                    <div className="absolute bottom-0 right-0 h-[2px] w-10 bg-gradient-to-l from-red-500 to-transparent" />
                    <div className="absolute bottom-0 right-0 h-10 w-[2px] bg-gradient-to-t from-red-500 to-transparent" />
                  </div>

                  {/* Subtle inner glow on hover */}
                  <div className="absolute inset-px rounded-[10px] bg-gradient-to-br from-red-600/5 via-transparent to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <a
                    href={method.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 flex flex-col h-full"
                  >
                    {/* Top row: icon + status HUD */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="relative flex items-center justify-center w-12 h-12 rounded-lg border border-red-500/80 bg-black/80 shadow-[0_0_20px_rgba(248,113,113,0.4)] group-hover:shadow-[0_0_32px_rgba(248,113,113,0.75)] transition-shadow duration-500">
                          <Icon className="w-6 h-6 text-red-400" />
                          <div className="absolute inset-0 rounded-lg bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-mono tracking-[0.25em] text-red-500 uppercase">
                            CHANNEL
                          </span>
                          <span className="text-xs font-mono tracking-[0.2em] text-gray-400 uppercase">
                            {method.label}
                          </span>
                        </div>
                      </div>

                      {/* Status indicator block */}
                      <div className="px-3 py-1 rounded-full border border-red-600/60 bg-black/70 flex items-center gap-2">
                        <span className="relative inline-flex h-[10px] w-[10px]">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" />
                          <span className="relative inline-flex h-[10px] w-[10px] rounded-full bg-[#22c55e]" />
                        </span>
                        <span className="text-[10px] font-mono tracking-[0.22em] text-gray-300 uppercase">
                          {method.status}
                        </span>
                      </div>
                    </div>

                    {/* Middle content */}
                    <div className="space-y-2 mb-4">
                      <p className="text-[11px] font-mono tracking-[0.24em] text-red-500 uppercase">
                        LINK
                      </p>
                      <p className="text-sm text-gray-300">{method.description}</p>
                      <p className="text-base md:text-lg font-semibold text-gray-100 mt-1 tracking-wide">
                        {method.value}
                      </p>
                    </div>

                    {/* Telemetry strip */}
                    <div className="mt-auto pt-4 border-t border-red-900/60">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Radio className="w-4 h-4 text-red-400" />
                          <span className="text-[10px] font-mono tracking-[0.25em] text-gray-400 uppercase">
                            ESTABLISH LINK
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <div className="h-3 w-[3px] bg-red-500/80" />
                          <div className="h-4 w-[3px] bg-red-500/60" />
                          <div className="h-2 w-[3px] bg-red-500/40" />
                          <div className="h-5 w-[3px] bg-red-500/90" />
                        </div>
                      </div>
                    </div>
                  </a>
                </Card>
              );
            })}
          </div>

          {/* Main race command card */}
          <div
            className={`transition-all duration-800 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
          >
            <Card className="relative overflow-hidden bg-gradient-to-br from-black via-[#050309] to-black border border-red-900/80 rounded-2xl px-6 md:px-10 py-8 md:py-10 shadow-[0_0_60px_rgba(248,113,113,0.25)]">
              {/* Diagonal tech lines */}
              <div className="pointer-events-none absolute inset-0 opacity-40">
                <div className="absolute -top-10 left-10 h-[1px] w-1/2 bg-gradient-to-r from-transparent via-red-500/70 to-transparent rotate-[4deg]" />
                <div className="absolute bottom-4 right-6 h-[1px] w-1/3 bg-gradient-to-l from-transparent via-red-500/80 to-transparent -rotate-[3deg]" />
                <div className="absolute top-10 right-10 h-24 w-[1px] bg-gradient-to-b from-red-500/60 to-transparent" />
              </div>

              {/* Header row */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <Trophy className="w-7 h-7 text-yellow-400" />
                  <h3 className="text-xl md:text-2xl font-semibold tracking-[0.22em] uppercase text-gray-100">
                    Race Command Center
                  </h3>
                  <Flag className="w-7 h-7 text-red-500" />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-gray-300">
                      Live session
                    </span>
                  </div>
                  <div className="hidden md:flex gap-1">
                    <span className="h-[3px] w-6 bg-green-500/80" />
                    <span className="h-[3px] w-6 bg-yellow-400/70" />
                    <span className="h-[3px] w-6 bg-red-500/80" />
                  </div>
                </div>
              </div>

              {/* Main text */}
              <div className="relative z-10 mb-7 space-y-2">
                <p className="text-sm font-mono tracking-[0.28em] text-red-500 uppercase">
                  ENGINEERING BRIEF
                </p>
                <p className="text-sm md:text-base text-gray-300 max-w-2xl">
                  High‑performance engineering, rapid prototyping and full‑stack delivery tuned
                  for race‑pace execution. Plug this cockpit into your stack and run your next
                  project like a Grand Prix weekend.
                </p>
              </div>

              {/* Social strip */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-6 mb-7">
                <div className="flex items-center gap-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`relative flex items-center justify-center w-10 h-10 rounded-full border border-red-800/80 bg-black/80 text-white/80 hover:text-red-400 hover:border-red-500/90 transition-colors duration-300 group
                        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                        style={{ transitionDelay: `${index * 80 + 200}ms` }}
                        aria-label={social.label}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="absolute -bottom-5 text-[9px] font-mono tracking-[0.24em] uppercase text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {social.label}
                        </span>
                      </a>
                    );
                  })}
                </div>

                {/* Main CTA - Opens Modal */}
                <div className="relative">
                  <Button
                    size="lg"
                    onClick={handleOpenModal}
                    className="relative overflow-hidden bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-sm md:text-base font-mono tracking-[0.25em] uppercase px-8 py-6 rounded-full border border-red-500/90 shadow-[0_0_30px_rgba(248,113,113,0.6)] hover:shadow-[0_0_40px_rgba(248,113,113,0.9)] transition-all duration-400"
                  >
                    <Send className="w-5 h-5 mr-3 -translate-y-[1px] transition-transform duration-300 group-hover:translate-x-1" />
                    Send race signal
                  </Button>
                </div>
              </div>

              {/* Footer telemetry line */}
              <div className="relative z-10 flex flex-wrap items-center gap-4 text-[11px] text-gray-400 font-mono tracking-[0.24em] uppercase">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Deploy‑ready</span>
                </div>
                <span className="h-[1px] w-8 bg-red-500/60" />
                <span>Response &lt; 1 hr</span>
                <span className="h-[1px] w-8 bg-red-500/60" />
                <span>15+ projects shipped</span>
              </div>
            </Card>
          </div>

          {/* Availability HUD */}
          <div
            className={`mt-10 flex items-center justify-center ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              } transition-all duration-700`}
          >
            <div className="inline-flex items-center gap-4 px-6 py-3 rounded-xl border border-red-900/80 bg-black/70 backdrop-blur-sm shadow-[0_0_28px_rgba(248,113,113,0.45)]">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              </div>
              <p className="text-[11px] font-mono tracking-[0.26em] uppercase text-gray-300">
                Availability: race programs • sprint builds • rapid prototyping
              </p>
            </div>
          </div>
        </div>

        {/* Local CSS for the McLaren speed line animation */}
        <style jsx>{`
          @keyframes mclarenSpeed {
            0% {
              transform: translateX(-110%);
            }
            100% {
              transform: translateX(110%);
            }
          }
        `}</style>
      </section>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            ref={modalRef}
            className="relative w-full max-w-2xl bg-gradient-to-br from-black via-[#050309] to-black border border-red-900/80 rounded-2xl shadow-[0_0_80px_rgba(248,113,113,0.4)] overflow-hidden"
          >
            {/* Modal background pattern */}
            <div
              className="absolute inset-0 opacity-20"
              style={{ backgroundImage: `url("${circuitPattern}")` }}
            />

            {/* Close button */}
            <button
              onClick={handleCloseModal}
              disabled={isSubmitting}
              className="absolute top-4 right-4 z-50 p-2 rounded-full border border-red-600/60 bg-black/80 hover:bg-red-900/30 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-red-400" />
            </button>

            {/* Modal content */}
            <div className="relative z-10 p-6 md:p-10">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center mb-4">
                  <div className="h-px w-8 bg-red-600/80" />
                  <div className="mx-3 px-3 py-1 border border-red-600/60 bg-black/70 text-[10px] font-semibold tracking-[0.35em] uppercase text-red-400">
                    RACE TRANSMISSION
                  </div>
                  <div className="h-px w-8 bg-red-600/80" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold tracking-[0.18em] uppercase text-gray-100 mb-3">
                  Send Race Signal
                </h3>
                <p className="text-sm text-gray-400 font-mono tracking-[0.22em] uppercase">
                  Encrypted transmission to HQ • Target: devakantakonsam782@gmail.com
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-mono tracking-[0.24em] uppercase text-red-500">
                    <User className="w-4 h-4" />
                    PILOT IDENTIFICATION
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    disabled={isSubmitting}
                    className="bg-black/70 border-red-800/60 text-gray-100 placeholder-gray-500 rounded-xl px-4 py-6 focus:border-red-500 focus:ring-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Email field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-mono tracking-[0.24em] uppercase text-red-500">
                    <Mail className="w-4 h-4" />
                    COMMUNICATION CHANNEL
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                    disabled={isSubmitting}
                    className="bg-black/70 border-red-800/60 text-gray-100 placeholder-gray-500 rounded-xl px-4 py-6 focus:border-red-500 focus:ring-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Message field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-mono tracking-[0.24em] uppercase text-red-500">
                    <MessageSquare className="w-4 h-4" />
                    MISSION BRIEF
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your project, timeline, and requirements..."
                    required
                    rows={5}
                    disabled={isSubmitting}
                    className="bg-black/70 border-red-800/60 text-gray-100 placeholder-gray-500 rounded-xl px-4 py-4 focus:border-red-500 focus:ring-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                  />
                </div>

                {/* Submit status */}
                {submitStatus === 'success' && (
                  <div className="p-4 rounded-xl bg-green-900/30 border border-green-600/60 text-green-400 text-sm font-mono tracking-[0.22em] uppercase text-center">
                    <CheckCircle className="w-5 h-5 inline-block mr-2" />
                    Signal transmitted successfully! HQ will respond shortly.
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 rounded-xl bg-red-900/30 border border-red-600/60 text-red-400 text-sm font-mono tracking-[0.22em] uppercase text-center">
                    Transmission failed. Please check your connection and try again.
                  </div>
                )}

                {/* Submit button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-sm md:text-base font-mono tracking-[0.25em] uppercase px-8 py-6 rounded-full border border-red-500/90 shadow-[0_0_30px_rgba(248,113,113,0.6)] hover:shadow-[0_0_40px_rgba(248,113,113,0.9)] transition-all duration-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                        TRANSMITTING...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-3" />
                        LAUNCH TRANSMISSION
                      </>
                    )}
                  </Button>
                </div>

                {/* Formspree target info */}
                <div className="pt-4 border-t border-red-900/60">
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400 font-mono tracking-[0.22em] uppercase">
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                      <span>Target:</span>
                    </div>
                    <span className="text-red-400">devakantakonsam782@gmail.com</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}