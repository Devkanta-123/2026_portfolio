import { Navigation } from '@/components/navigation';
import { HeroSection } from '@/components/hero-section';
import { SkillsSection } from '@/components/skills-section';
import { ExperienceSection } from '@/components/experience-section';
import { ProjectsSection } from '@/components/projects-section';
import { ContactSection } from '@/components/contact-section';
import { Footer } from '@/components/footer';
import { Chatbot } from '@/components/chatbot';
import { LocationSection } from '@/components/location';
export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <LocationSection/>
      <ContactSection />
      <Footer />
      <Chatbot />
    </main>
  );
}
