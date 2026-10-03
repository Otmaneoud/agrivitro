export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category: string;
  tags: string[];
  author: string;
  publication_date: string;
  reading_time: number;
  featured: boolean;
  status: string;
  seo_title: string | null;
  seo_description: string | null;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
};

export type EventSpeaker = { name: string; role?: string };

export type SiteEvent = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  cover_image: string | null;
  category: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  location: string;
  city: string;
  country: string;
  event_status: string;
  status: string;
  registration_url: string | null;
  speakers: EventSpeaker[];
  gallery: string[];
  seo_title: string | null;
  seo_description: string | null;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
};

export const POST_COLUMNS =
  "id,title,slug,excerpt,content,cover_image,category,tags,author,publication_date,reading_time,featured,status,seo_title,seo_description,is_demo,created_at,updated_at";

export const EVENT_COLUMNS =
  "id,title,slug,description,content,cover_image,category,date,start_time,end_time,location,city,country,event_status,status,registration_url,speakers,gallery,seo_title,seo_description,is_demo,created_at,updated_at";
