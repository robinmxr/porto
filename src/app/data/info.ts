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
    education: string;
    degree: string;
    school: string;
    timezone: string;
    notice: string;
    authorization: string;
    credibility: string;
  };
  links: {
    github: string;
    linkedin: string;
    website: string;
    resume: string;
  };
  skills: SkillGroup[];
  secondarySkills: { label: string; items: string[] };
  experience: ExperienceItem[];
  projects: ProjectCardData[];
  culture: Culture;
  credentials: Credentials;
  principles: Principle[];
  caseStudies: CaseStudy[];
}

export interface Credentials {
  languages: { name: string; level: string }[];
  certifications: { name: string; issuer: string }[];
}

export interface SkillGroup {
  label: string;
  core: string[];
  more: string[];
}

export interface Figure {
  value: string;
  label: string;
}

export interface Achievement {
  lead: string;
  detail: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  status: string;
  summary: string;
  figures: Figure[];
  achievements: Achievement[];
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
  focusAreas: string[];
  metrics: { label: string; value: string }[];
  highlights: string[];
  proof: Figure;
  diagrams?: Diagram[];
  /** Plain-language background for readers who do not know the domain. */
  context?: ProjectContext;
  year: string;
  repoUrl: string;
  demoUrl: string;
}

export interface ProjectContext {
  what: string;
  why: Achievement[];
  uses: Achievement[];
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

export type DiagramNodeKind = 'client' | 'service' | 'store' | 'queue' | 'external' | 'state' | 'terminal';

export interface DiagramNode {
  id: string;
  label: string;
  kind: DiagramNodeKind;
  /** Grid position; fractional values are allowed for fine placement. */
  col: number;
  row: number;
  sub?: string;
  highlight?: boolean;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
}

export interface Diagram {
  title: string;
  caption: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export interface Decision {
  choice: string;
  why: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  kicker: string;
  tagline: string;
  summary: string;
  problem: string;
  figures: Figure[];
  diagrams: Diagram[];
  decisions: Decision[];
  results: string[];
  concepts: string[];
  /** "If X goes wrong" rows: `choice` is the failure, `why` is how the design absorbs it. */
  failureModes: Decision[];
  /** What the design deliberately does not promise. */
  nonGuarantees: string[];
  /** Reasoning about the next order of magnitude. Not built. */
  atScale: string[];
}

export interface Principle {
  title: string;
  detail: string;
  /** Case studies where this principle is shown in practice. */
  caseStudies: string[];
}

export const INFO = info as PortfolioInfo;
export const PROJECT_CARDS = INFO.projects;
