import type { SourceRef } from '@/lib/types';

export interface SiteTopic {
  id: string; order: number; title: string; english: string; summary: string;
  points: string[]; articles: string[]; tools: string[];
}

export interface SiteStage {
  id: string; order: number; phase: string; title: string; goal: string;
  tasks: string[]; method: string[]; data: string[]; tools: string[];
  mistakes: string[]; pass: string; next: string; articles: string[];
}

export interface SitePitfall {
  id: string; question: string; answer: string; article: string; tool: string;
}

export interface SiteToolDef {
  slug: string; name: string; short: string; description: string;
  outputs: string[]; formula: string[]; icon: string; storage: string; mobile: boolean;
}

export interface SiteArticleMeta {
  slug: string; title: string; subtitle: string; summary: string;
  topic: string; order: number; tags: string[]; readingMinutes: number;
  publishedAt: string; updatedAt: string; charts: string[]; tools: string[];
  sources: SourceRef[]; seoDescription: string;
}

export interface SiteArticle extends SiteArticleMeta { body: string }

export interface NegotiationLine { label: string; text: string; when: string; effect: string }

export interface NegotiationStage {
  id: string; phase: string; title: string; lines: NegotiationLine[];
}

export interface NegotiationScenario {
  id: string; title: string; background: string; intent: string; wrong: string;
  strategy: string; opener: string; followup: string; refusal: string;
  concessions: string; bottomLine: string; exitSignal: string;
}

export interface SiteCaseStudy {
  id: string; brand: string; region: string; logic: string; audience: string;
  location: string; model: string; learn: string; smallShop: string;
  notCopy: string; sources: SourceRef[]; date: string;
}

export interface FailureCase {
  id: string; title: string; type: string; reason: string; signal: string;
  loss: string; investigation: string; prevention: string;
}

export interface LeaseItem { id: string; label: string; why: string; verify: string }
export interface LeaseGroup { title: string; items: LeaseItem[] }

export interface FieldRound { id: string; label: string; time: string; focus: string; record: string }
export interface FieldDetail { id: string; label: string; why: string; check: string }

export interface SceneType {
  id: string; name: string; audience: string; time: string; price: string;
  competition: string; rent: string; suitable: string; risk: string; method: string;
}

export interface CategoryType {
  id: string; name: string; priority: string; checklist: string[]; avoid: string;
}

export interface SiteVisit {
  id: string; name: string; address: string; date: string; weather: string;
  slot: string; tradeArea: string; area: number; floor: string; frontage: number;
  corner: boolean; blocked: boolean; parking: string; transit: string;
  competitors: string; passers: number; target: number; crowd: string;
  photo: string; note: string;
}

export interface TrafficSession {
  id: string; name: string; startedAt: number; endedAt: number;
  passers: number; target: number; competitorIn: number; ownIn: number;
  buckets: { label: string; passers: number; target: number }[];
}

export interface Candidate {
  id: string; name: string; area: number; rent: number; transferFee: number;
  tradeArea: string; dailyTraffic: number; competition: number;
  dailyOrders: number; ticket: number; contributionRate: number;
  otherFixedCost: number; initialInvestment: number; score: number;
}

export interface LeaseCheckState {
  checked: Record<string, boolean>;
  pending: Record<string, boolean>;
  notes: Record<string, string>;
}

export interface ScoreState {
  values: Record<string, number>;
  weights: Record<string, number>;
  veto: Record<string, boolean>;
}
