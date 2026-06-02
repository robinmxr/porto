import info from './info.json';

export interface PortfolioInfo {
  profile: {
    name: string;
    shortName: string;
    initials: string;
    role: string;
    focus: string;
    headline: string;
    summary: string;
    location: string;
    status: string;
    mode: string;
    email: string;
  };
  links: {
    github: string;
    linkedin: string;
    resume: string;
  };
  skills: Record<string, string[]>;
  experience: ExperienceItem[];
  projects: ProjectCardData[];
  culture: Culture;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  status: string;
  summary: string;
  achievements: string[];
  stack: string[];
}

export interface ProjectCardData {
  id: string;
  name: string;
  type: string;
  description: string;
  background: string;
  border: string;
  accent: string;
  text: string;
  lightBackground: string;
  lightBorder: string;
  lightAccent: string;
  lightText: string;
  stack: string[];
  metrics: { label: string; value: string }[];
  highlights: string[];
  year: string;
  repoUrl: string;
  demoUrl: string;
}

export interface Culture {
  music: {
    title: string;
    artist: string;
    albumArtUrl: string;
    url: string;
    note: string;
  };
  book: CultureItem;
  movie: CultureItem;
}

export interface CultureItem {
  title: string;
  creator: string;
  url: string;
  note: string;
}

export const INFO = info as PortfolioInfo;
export const PROJECT_CARDS = INFO.projects;
