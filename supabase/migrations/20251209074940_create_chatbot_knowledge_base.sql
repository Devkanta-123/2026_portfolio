/*
  # Chatbot Knowledge Base

  1. New Tables
    - `chatbot_knowledge`
      - `id` (uuid, primary key) - Unique identifier for each knowledge entry
      - `question` (text) - The question or keyword to match
      - `answer` (text) - The response to provide
      - `category` (text) - Category of the knowledge (e.g., 'skills', 'experience', 'general')
      - `keywords` (text[]) - Array of keywords for better matching
      - `created_at` (timestamptz) - Timestamp of creation
      
  2. Security
    - Enable RLS on `chatbot_knowledge` table
    - Add policy for public read access (since it's portfolio info)
    - Only admins can write (not implemented in this demo)
*/

CREATE TABLE IF NOT EXISTS chatbot_knowledge (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  keywords text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chatbot_knowledge ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read chatbot knowledge"
  ON chatbot_knowledge
  FOR SELECT
  TO public
  USING (true);

-- Insert sample knowledge base data
INSERT INTO chatbot_knowledge (question, answer, category, keywords) VALUES
  ('What technologies do you use?', 'I work with a variety of modern technologies including React, Next.js, Node.js, TypeScript, PHP, Python, PostgreSQL, MongoDB, AWS, and Docker. I''m particularly passionate about full-stack JavaScript and building scalable applications.', 'skills', ARRAY['technologies', 'tech stack', 'skills', 'programming languages']),
  
  ('What is your experience?', 'I have over 7 years of professional software development experience. I started as a Junior Developer in 2016 and have progressed to Senior Full-Stack Developer. I''ve worked with startups, agencies, and established tech companies, leading teams and architecting scalable solutions.', 'experience', ARRAY['experience', 'background', 'career', 'work history']),
  
  ('What projects have you worked on?', 'I''ve worked on diverse projects including e-commerce platforms, real-time chat applications, AI-powered task managers, fitness tracking apps, and enterprise project management dashboards. Each project showcases different aspects of my skill set from frontend to backend to DevOps.', 'projects', ARRAY['projects', 'portfolio', 'work', 'examples']),
  
  ('How can I contact you?', 'You can reach me via email at john.doe@example.com, connect with me on LinkedIn, or check out my GitHub profile. I''m always open to discussing new opportunities, collaborations, or just chatting about technology!', 'contact', ARRAY['contact', 'email', 'reach', 'get in touch']),
  
  ('What is your specialty?', 'My specialty is full-stack web development with a focus on creating elegant, performant, and scalable applications. I excel at bridging the gap between design and functionality, ensuring great user experiences backed by solid architecture.', 'skills', ARRAY['specialty', 'expertise', 'focus', 'best at']),
  
  ('Do you work with React?', 'Yes! React is one of my core technologies. I have extensive experience with React, Next.js, and the entire React ecosystem including hooks, context, Redux, and React Query. I''ve built numerous production applications using these technologies.', 'skills', ARRAY['react', 'next.js', 'frontend', 'javascript']),
  
  ('Can you do backend development?', 'Absolutely! I''m proficient in backend development using Node.js, PHP, and Python. I have experience building RESTful APIs, GraphQL servers, implementing authentication systems, and working with various databases including PostgreSQL, MongoDB, and Redis.', 'skills', ARRAY['backend', 'server', 'api', 'database']),
  
  ('What about mobile development?', 'Yes, I work with React Native and Flutter for mobile development. I''ve built cross-platform mobile applications that provide native-like experiences. I also have experience with PWAs for mobile-optimized web applications.', 'skills', ARRAY['mobile', 'react native', 'flutter', 'ios', 'android']),
  
  ('Tell me about yourself', 'I''m a passionate Full-Stack Software Developer with 7+ years of experience building modern web applications. I love solving complex problems with elegant code and creating exceptional user experiences. When I''m not coding, I enjoy contributing to open-source projects and staying updated with the latest tech trends.', 'general', ARRAY['about', 'who are you', 'introduction', 'tell me']),
  
  ('What are your rates?', 'My rates vary depending on the project scope, complexity, and timeline. I''m happy to discuss your specific needs and provide a customized quote. Please feel free to reach out via the contact form to discuss your project in detail.', 'general', ARRAY['rates', 'pricing', 'cost', 'fees', 'how much']);
