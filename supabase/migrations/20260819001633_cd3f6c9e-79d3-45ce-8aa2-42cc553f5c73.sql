
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can read their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  cover_image text,
  category text NOT NULL DEFAULT 'AgriVitro News',
  tags text[] NOT NULL DEFAULT '{}',
  author text NOT NULL DEFAULT 'AgriVitro Team',
  publication_date date NOT NULL DEFAULT current_date,
  reading_time integer NOT NULL DEFAULT 5,
  featured boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'draft',
  seo_title text,
  seo_description text,
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published posts are public"
ON public.blog_posts FOR SELECT TO anon, authenticated
USING (status = 'published');

CREATE POLICY "Admins can read all posts"
ON public.blog_posts FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can write posts"
ON public.blog_posts FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  cover_image text,
  category text NOT NULL DEFAULT 'Field Activity',
  date date NOT NULL DEFAULT current_date,
  start_time text,
  end_time text,
  location text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  country text NOT NULL DEFAULT 'Morocco',
  event_status text NOT NULL DEFAULT 'upcoming',
  status text NOT NULL DEFAULT 'draft',
  registration_url text,
  speakers jsonb NOT NULL DEFAULT '[]'::jsonb,
  gallery text[] NOT NULL DEFAULT '{}',
  seo_title text,
  seo_description text,
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published events are public"
ON public.events FOR SELECT TO anon, authenticated
USING (status = 'published');

CREATE POLICY "Admins can read all events"
ON public.events FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can write events"
ON public.events FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER events_updated_at BEFORE UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.demo_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  organization text,
  region text,
  greenhouses text,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.demo_requests TO anon, authenticated;
GRANT SELECT ON public.demo_requests TO authenticated;
GRANT ALL ON public.demo_requests TO service_role;
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a demo request"
ON public.demo_requests FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can read demo requests"
ON public.demo_requests FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.blog_posts (title, slug, excerpt, content, cover_image, category, tags, author, publication_date, reading_time, featured, status, seo_title, seo_description, is_demo) VALUES
('How AI Can Help Moroccan Farmers Save Water', 'how-ai-can-help-moroccan-farmers-save-water', 'Demo content — Predictive irrigation turns scarce water into a managed resource rather than a daily guess.', '<p><em>This is demo content and can be replaced from the admin dashboard.</em></p><h2>Water is the constraint</h2><p>Morocco has faced years of drought pressure. For greenhouse operators, water is no longer an abundant input but the single most important variable in the season.</p><p>AI changes the question from <em>how much should I irrigate today?</em> to <em>what does this crop need in the next few hours, given the conditions inside and outside the greenhouse?</em></p><h2>From readings to decisions</h2><ul><li>Soil moisture at multiple depths</li><li>Air temperature and humidity</li><li>Light levels and crop stage</li></ul><blockquote>Better agriculture does not have to mean more resources. It means better decisions.</blockquote><h2>Measured results</h2><p>In AgriVitro deployments, the system is associated with <strong>30% less water consumption</strong> while supporting <strong>20% higher crop yield</strong>.</p><ol><li>Sense the environment continuously</li><li>Model crop water demand</li><li>Irrigate only when it pays off</li></ol>', '/images/content/water.jpg', 'Water Management', ARRAY['AI','irrigation','water'], 'AgriVitro Team', '2026-07-28', 6, true, 'published', 'How AI Helps Moroccan Farmers Save Water | AgriVitro', 'How predictive irrigation and AI help Moroccan greenhouse farmers cut water use while protecting yields.', true),
('The Future of Smart Greenhouses in Morocco', 'the-future-of-smart-greenhouses-in-morocco', 'Demo content — What the next generation of Moroccan greenhouses will look like, and why it matters.', '<p><em>This is demo content and can be replaced from the admin dashboard.</em></p><h2>A new generation of greenhouses</h2><p>Greenhouses have always been about control. Smart greenhouses extend that control to water, energy and data.</p><h2>What changes</h2><ul><li>Sensors replace manual inspection</li><li>Solar power reduces operating costs</li><li>Dashboards make the invisible visible</li></ul><p>AgriVitro is currently deployed across <strong>4 greenhouses</strong> in Fez and the Souss-Massa region.</p>', '/images/content/greenhouse.jpg', 'Greenhouses', ARRAY['greenhouses','innovation'], 'AgriVitro Team', '2026-07-14', 5, false, 'published', 'The Future of Smart Greenhouses in Morocco | AgriVitro', 'How smart greenhouses are reshaping Moroccan agriculture with sensors, solar energy and data.', true),
('Why Precision Irrigation Matters in a Water-Stressed Climate', 'why-precision-irrigation-matters-in-a-water-stressed-climate', 'Demo content — Precision irrigation is the difference between using water and wasting it.', '<p><em>This is demo content and can be replaced from the admin dashboard.</em></p><h2>The cost of guessing</h2><p>Irrigation schedules built on habit rather than data over-water in cool weeks and under-water in hot ones.</p><h2>Precision in practice</h2><ol><li>Measure the root zone, not the surface</li><li>Adjust to the crop stage</li><li>Verify the outcome</li></ol><blockquote>Every litre saved in a water-stressed climate is a litre available next season.</blockquote>', '/images/content/irrigation.jpg', 'Water Management', ARRAY['irrigation','precision'], 'AgriVitro Team', '2026-06-30', 4, false, 'published', 'Why Precision Irrigation Matters | AgriVitro', 'Precision irrigation explained for greenhouse operators working in a water-stressed climate.', true),
('From Sensors to Decisions: How AgriVitro''s AI Works', 'from-sensors-to-decisions-how-agrivitro-ai-works', 'Demo content — A walkthrough of the path from raw sensor readings to an irrigation decision.', '<p><em>This is demo content and can be replaced from the admin dashboard.</em></p><h2>The pipeline</h2><p>Sensors → AI → Decision → Irrigation → Healthier crops.</p><h2>Sense</h2><p>The AgriVitro Box collects soil moisture, temperature, humidity and light readings continuously.</p><h2>Understand</h2><p>Models combine those readings with crop type and growth stage.</p><h2>Act</h2><p>The system triggers irrigation only when the crop will benefit, and alerts the farmer when something looks wrong.</p>', '/images/content/ai.jpg', 'AI & IoT', ARRAY['AI','IoT','sensors'], 'AgriVitro Team', '2026-06-12', 7, false, 'published', 'From Sensors to Decisions: How AgriVitro AI Works', 'Inside the AgriVitro decision pipeline: sensing, understanding, acting and improving.', true),
('Solar Energy and the Next Generation of Greenhouses', 'solar-energy-and-the-next-generation-of-greenhouses', 'Demo content — Why renewable energy and smart greenhouse control belong together.', '<p><em>This is demo content and can be replaced from the admin dashboard.</em></p><h2>Energy is the second constraint</h2><p>Pumps, fans and controllers all consume energy. Solar generation paired with intelligent scheduling reduces both cost and exposure.</p><p>AgriVitro deployments report <strong>25% less energy consumption</strong>.</p>', '/images/content/solar.jpg', 'Sustainable Energy', ARRAY['solar','energy'], 'AgriVitro Team', '2026-05-22', 5, false, 'published', 'Solar Energy and Smart Greenhouses | AgriVitro', 'How solar power and intelligent energy management lower greenhouse operating costs.', true),
('Inside Our Smart Greenhouse Field Study', 'inside-our-smart-greenhouse-field-study', 'Demo content — What we are learning from a 60-greenhouse field study across Morocco.', '<p><em>This is demo content and can be replaced from the admin dashboard.</em></p><h2>Beyond the prototype</h2><p>AgriVitro has moved from prototype to field testing, into a <strong>60-greenhouse field study</strong> and <strong>4 active deployments</strong>.</p><h2>What we measure</h2><ul><li>Water consumption per cycle</li><li>Energy use</li><li>Yield per square metre</li></ul>', '/images/content/fieldstudy.jpg', 'Field Updates', ARRAY['field study','research'], 'AgriVitro Team', '2026-05-05', 6, false, 'published', 'Inside Our Smart Greenhouse Field Study | AgriVitro', 'Findings and methodology from the AgriVitro 60-greenhouse field study in Morocco.', true);

INSERT INTO public.events (title, slug, description, content, cover_image, category, date, start_time, end_time, location, city, country, event_status, status, registration_url, speakers, gallery, seo_title, seo_description, is_demo) VALUES
('AgriVitro at SIAM Morocco', 'agrivitro-at-siam-morocco', 'Demo content — Meet the AgriVitro team at Morocco''s largest agricultural exhibition.', '<p><em>Demo content — replace from the admin dashboard.</em></p><p>The AgriVitro team will present the AgriVitro Box and the smart greenhouse dashboard, with live demonstrations throughout the week.</p>', '/images/content/event-forum.jpg', 'Exhibition', '2026-10-14', '09:00', '18:00', 'Exhibition Grounds', 'Meknès', 'Morocco', 'upcoming', 'published', NULL, '[{"name":"AgriVitro Team","role":"Product demonstration"}]'::jsonb, '{}', 'AgriVitro at SIAM Morocco', 'Meet AgriVitro at SIAM Morocco for live smart greenhouse demonstrations.', true),
('Smart Agriculture Innovation Forum', 'smart-agriculture-innovation-forum', 'Demo content — A forum on AI, water and the future of Moroccan agriculture.', '<p><em>Demo content — replace from the admin dashboard.</em></p><p>AgriVitro joins researchers, cooperatives and agritech builders to discuss climate-resilient agriculture.</p>', '/images/content/event-forum.jpg', 'Forum', '2026-09-08', '10:00', '16:00', 'Innovation Campus', 'Rabat', 'Morocco', 'happening_soon', 'published', NULL, '[{"name":"Panel","role":"AI and water management"}]'::jsonb, '{}', 'Smart Agriculture Innovation Forum | AgriVitro', 'AgriVitro at the Smart Agriculture Innovation Forum in Rabat.', true),
('AgriVitro Field Day — Souss-Massa', 'agrivitro-field-day-souss-massa', 'Demo content — An open field day inside an active AgriVitro greenhouse deployment.', '<p><em>Demo content — replace from the admin dashboard.</em></p><p>Walk through an active deployment, see the sensor network in place and review real irrigation data with the team.</p>', '/images/content/event-field.jpg', 'Field Day', '2026-09-25', '09:30', '13:00', 'Partner greenhouse site', 'Souss-Massa', 'Morocco', 'upcoming', 'published', NULL, '[{"name":"Field Team","role":"Deployment walkthrough"}]'::jsonb, '{}', 'AgriVitro Field Day — Souss-Massa', 'Join the AgriVitro field day inside an active smart greenhouse in Souss-Massa.', true),
('Smart Greenhouse Demonstration — Fez', 'smart-greenhouse-demonstration-fez', 'Demo content — A hands-on demonstration of the AgriVitro Box and dashboard in Fez.', '<p><em>Demo content — replace from the admin dashboard.</em></p><p>A completed demonstration session held with local growers and cooperative representatives.</p>', '/images/content/event-field.jpg', 'Demonstration', '2026-03-19', '10:00', '14:00', 'Greenhouse cluster', 'Fez', 'Morocco', 'completed', 'published', NULL, '[]'::jsonb, '{}', 'Smart Greenhouse Demonstration — Fez | AgriVitro', 'Recap of the AgriVitro smart greenhouse demonstration held in Fez.', true);
