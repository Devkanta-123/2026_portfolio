'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Mail, Phone, MapPin, Briefcase, Code, Database, Shield, Brain, Globe, Users, BookOpen, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface KnowledgeEntry {
  question: string;
  answer: string;
  keywords: string[];
}

// Enhanced professional knowledge base
const knowledgeBase: KnowledgeEntry[] = [
  {
    question: 'Who is Devkanta Singh?',
    answer:
      "Devkanta Singh is a full-stack developer and software engineer with expertise in building scalable, high-performance applications. Specializing in modern web technologies, he combines technical excellence with strategic thinking to deliver exceptional digital solutions.",
    keywords: ['who is dev', 'about', 'profile', 'developer', 'software engineer', 'introduction'],
  },
  {
    question: 'What are your core technical skills?',
    answer:
      "Frontend: React, Next.js, TypeScript, JavaScript (ES6+), Tailwind CSS, Shadcn UI, Material-UI, Framer Motion\nBackend: Node.js, Express.js, Python (Django/Flask), REST APIs, GraphQL, WebSockets\nDatabases: PostgreSQL, MongoDB, MySQL, Redis, Supabase\nDevOps & Cloud: Docker, Kubernetes, AWS, Vercel, GitHub Actions, CI/CD\nTools: Git, VS Code, Figma, Postman, Jira, Agile/Scrum",
    keywords: ['skills', 'tech stack', 'technologies', 'programming', 'tools', 'expertise'],
  },
  {
    question: 'Tell me about your professional experience',
    answer:
      "I have extensive experience in building enterprise-grade applications across multiple domains including defense, healthcare, HR management, education, and content management. My work focuses on creating secure, scalable, and user-friendly solutions that solve real-world problems. I follow industry best practices, clean architecture patterns, and maintain high code quality standards.",
    keywords: ['experience', 'work', 'background', 'career', 'professional'],
  },
  {
    question: 'What major projects have you built?',
    answer:
      "1. **Assam Rifles Defense Project**: Secure military-grade application with advanced authentication and real-time communication systems\n2. **Healthcare Solutions**: Appointment Booking management systems, telemedicine platforms, and medical record management\n3. **HR Management Systems**: Employee portals, payroll systems, and performance tracking applications\n4. **School ERP**: Complete educational management system for schools and universities\n5. **Content Management Systems**: Custom CMS solutions for various industries\n6. **AI Tools**: Machine learning integrations, chatbots, and predictive analytics systems\n7. **Modern Websites**: High-performance web applications using latest technologies",
    keywords: ['projects', 'portfolio', 'work examples', 'applications', 'software'],
  },
  {
    question: 'How can I contact you?',
    answer:
      "Primary Contact: devakantakonsam782@gmail.com\nSocial Media:\n- Facebook: facebook.com/devkant.konsam\n- Instagram: instagram.com/dev_since_1998\nYou can also use the contact form on this website which will send your message directly to my email.",
    keywords: ['contact', 'email', 'reach', 'social media', 'connect', 'hire'],
  },
  {
    question: 'What is your development philosophy?',
    answer:
      "I believe in: Clean Code Architecture, Test-Driven Development (TDD), Performance Optimization, Security First Approach, Scalable System Design, User-Centric Development, Continuous Learning & Adaptation, and Collaborative Problem Solving. Every project receives meticulous attention to detail and follows industry best practices.",
    keywords: ['philosophy', 'approach', 'methodology', 'principles', 'values'],
  },
  {
    question: 'What industries have you worked in?',
    answer:
      "I have delivered solutions across: Defense & Security, Healthcare & Medical, Education & E-Learning, Human Resources, E-commerce & Retail, Content Management & Publishing, Finance & Banking, and Government Sectors. Each project is tailored to meet specific industry requirements and compliance standards.",
    keywords: ['industries', 'sectors', 'domains', 'fields'],
  },
  {
    question: 'What are your rates and availability?',
    answer:
      "I'm currently available for new projects and collaborations. Rates are project-based and depend on scope, complexity, and timeline. I offer flexible engagement models: Hourly, Project-Based, and Retainer options. For detailed proposals, please contact me directly with your project requirements.",
    keywords: ['rates', 'pricing', 'cost', 'availability', 'hire', 'freelance'],
  },
  {
    question: 'Do you work with teams?',
    answer:
      "Yes, I have experience working in agile teams using Scrum methodology. I'm comfortable collaborating with designers, product managers, QA engineers, and other developers. I can also lead technical teams and provide architecture guidance for complex projects.",
    keywords: ['team', 'collaboration', 'work with others', 'agile'],
  },
  {
    question: 'What makes your approach unique?',
    answer:
      "1. **Security-First Mindset**: Especially crucial for defense and healthcare projects\n2. **Scalability Focus**: Building systems that grow with your business\n3. **Performance Optimization**: Ensuring fast, responsive applications\n4. **Modern Tech Stack**: Using latest, well-supported technologies\n5. **Clear Communication**: Regular updates and transparent processes\n6. **Post-Deployment Support**: Ongoing maintenance and optimization",
    keywords: ['unique', 'different', 'strengths', 'advantages'],
  },
  {
    question: 'Can you handle large-scale projects?',
    answer:
      "Absolutely. I have experience with enterprise-level applications handling thousands of users, complex data relationships, and high-security requirements. My projects include proper documentation, maintainable codebase, and scalable architecture patterns.",
    keywords: ['large scale', 'enterprise', 'complex', 'big projects'],
  },
  {
    question: 'What is your educational background?',
    answer:
      "I hold a strong technical foundation in computer science and software engineering, combined with continuous learning through online courses, certifications, and hands-on project experience. I stay updated with the latest industry trends and technologies.",
    keywords: ['education', 'qualification', 'degree', 'learning'],
  },
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI assistant. I can answer questions about Devkanta's skills, projects, experience, and how to get in touch. Feel free to ask me anything!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findBestMatch = (query: string, knowledgeBase: KnowledgeEntry[]): string => {
    const lowerQuery = query.toLowerCase();
    let bestMatch: KnowledgeEntry | null = null;
    let highestScore = 0;

    for (const entry of knowledgeBase) {
      let score = 0;

      // Exact match in question
      if (entry.question.toLowerCase() === lowerQuery) {
        score += 20;
      }

      // Partial match in question
      if (entry.question.toLowerCase().includes(lowerQuery)) {
        score += 10;
      }

      // Keyword matching
      for (const keyword of entry.keywords) {
        const keywordLower = keyword.toLowerCase();
        if (lowerQuery.includes(keywordLower)) {
          score += 5;
        }
        // Check for partial keyword matches
        if (keywordLower.includes(lowerQuery) || lowerQuery.includes(keywordLower)) {
          score += 3;
        }
      }

      // Common variations
      if (lowerQuery.includes('project') && entry.keywords.some(k => k.includes('project'))) {
        score += 4;
      }
      if (lowerQuery.includes('skill') && entry.keywords.some(k => k.includes('skill'))) {
        score += 4;
      }
      if (lowerQuery.includes('contact') && entry.keywords.some(k => k.includes('contact'))) {
        score += 4;
      }
      if (lowerQuery.includes('work') && entry.keywords.some(k => k.includes('experience') || k.includes('work'))) {
        score += 4;
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = entry;
      }
    }

    if (bestMatch && highestScore > 3) {
      return bestMatch.answer;
    }

    return "I'm not sure about that specific question. You can ask me about:\n• Skills & Technologies\n• Professional Experience\n• Major Projects (Defense, Healthcare, HR, etc.)\n• Contact Information\n• Rates & Availability\n• Development Approach";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = findBestMatch(userMessage.text, knowledgeBase);

      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response,
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error in chatbot:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again later or contact Devkanta directly.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    'Major projects?',
    'Technical skills?',
    'Contact information',
    'Development approach',
    'Rates & availability',
    'Professional experience',
  ];

 return (
  <>
    {!isOpen && (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 z-50 shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] transition-all duration-300"
        size="icon"
      >
        {/* Floating button image - bigger and rounded */}
        <img 
          src="/chat.jpg" 
          alt="Chat" 
          className="h-8 w-8 rounded-full object-cover"
        />
      </Button>
    )}

    {isOpen && (
      <Card className="fixed bottom-6 right-6 w-96 h-[600px] flex flex-col shadow-2xl z-50 bg-gradient-to-b from-gray-900 to-black border border-red-900/70 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-red-900/50 bg-gradient-to-r from-red-900/80 to-black">
          <div className="flex items-center gap-3">
            {/* Header image - bigger and rounded */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg overflow-hidden">
              <img 
                src="/chat.jpg" 
                alt="Chat Assistant" 
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg tracking-wide">Racing AI Assistant</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-xs text-green-300">Online • Professional Mode</p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-red-800/30 border border-red-700/50 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-950 to-black">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
            >
              {message.sender === 'bot' && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden">
                  {/* Bot message image - bigger and rounded */}
                  <img 
                    src="/chat.jpg" 
                    alt="Bot" 
                    className="w-9 h-9 rounded-full object-cover"
                  />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 shadow-lg ${message.sender === 'user'
                    ? 'bg-gradient-to-r from-red-600 to-red-800 text-white rounded-br-none'
                    : 'bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 border border-gray-700 rounded-bl-none'
                  }`}
              >
                <p className="text-sm whitespace-pre-line">{message.text}</p>
                <span className="text-xs opacity-70 mt-2 block text-right">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              {message.sender === 'user' && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center flex-shrink-0 border border-gray-600 overflow-hidden">
                  {/* User avatar - if you want to use image instead of User icon */}
                  {/* <img 
                    src="/user-avatar.jpg" 
                    alt="User" 
                    className="w-9 h-9 rounded-full object-cover"
                  /> */}
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg overflow-hidden">
                {/* Loading state image - bigger and rounded */}
                <img 
                  src="/chat.jpg" 
                  alt="Bot" 
                  className="w-9 h-9 rounded-full object-cover"
                />
              </div>
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 rounded-xl px-4 py-3 rounded-bl-none">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-bounce"></div>
                    <div
                      className="w-2 h-2 rounded-full bg-red-500 animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-red-500 animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400">Processing your query...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="px-4 py-3 border-t border-gray-800 bg-gradient-to-r from-gray-900 to-black">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-red-400" />
              <p className="text-xs text-gray-400 font-semibold tracking-wide">
                QUICK ACCESS QUESTIONS
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => setInput(question)}
                  className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 hover:text-white hover:from-red-900/30 hover:to-gray-900 border border-gray-700 hover:border-red-600/50 transition-all duration-300"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t border-gray-800 bg-gradient-to-r from-gray-900 to-black">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about skills, projects, experience, or contact..."
              className="flex-1 bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-red-600 focus:ring-red-600/50 rounded-xl"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white border border-red-700 rounded-xl shadow-lg hover:shadow-red-500/30 transition-all duration-300"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Shield className="w-3 h-3" />
              <span>Professional • Secure • Confidential</span>
            </div>
            <div className="flex items-center gap-1">
              {[
                { icon: Code, color: 'text-blue-400' },
                { icon: Database, color: 'text-green-400' },
                { icon: Shield, color: 'text-yellow-400' },
                { icon: Cloud, color: 'text-purple-400' },
              ].map((tech, index) => (
                <div
                  key={index}
                  className={`w-5 h-5 ${tech.color} opacity-60 hover:opacity-100 transition-opacity`}
                >
                  <tech.icon className="w-3 h-3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    )}
  </>
);
}