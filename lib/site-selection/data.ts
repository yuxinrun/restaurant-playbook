import topicsJson from '@/content/site-selection/topics.json';
import roadmapJson from '@/content/site-selection/roadmap.json';
import pitfallsJson from '@/content/site-selection/pitfalls.json';
import toolsJson from '@/content/site-selection/tools.json';
import negotiationJson from '@/content/site-selection/negotiation.json';
import casesJson from '@/content/site-selection/cases.json';
import leaseJson from '@/content/site-selection/lease.json';
import fieldworkJson from '@/content/site-selection/fieldwork.json';
import scenariosJson from '@/content/site-selection/scenarios.json';
import demoJson from '@/content/site-selection/demo.json';
import type {
  CategoryType, FailureCase, FieldDetail, FieldRound, LeaseGroup, NegotiationScenario,
  NegotiationStage, SceneType, SiteCaseStudy, SitePitfall, SiteStage, SiteToolDef, SiteTopic,
} from './types';

/** 选址实验室数据中心：与 content/ 下的 JSON 一一对应，页面不直接 import 原始数据。 */
export const siteTopics = topicsJson as unknown as SiteTopic[];
export const siteRoadmap = roadmapJson as unknown as SiteStage[];
export const sitePitfalls = pitfallsJson as unknown as SitePitfall[];
export const siteTools = toolsJson as unknown as SiteToolDef[];

export const negotiation = negotiationJson as unknown as {
  principle: string; stages: NegotiationStage[]; scenarios: NegotiationScenario[];
};

export const siteCaseData = casesJson as unknown as {
  notice: string; studies: SiteCaseStudy[]; failures: FailureCase[];
};

export const leaseData = leaseJson as unknown as { notice: string; groups: LeaseGroup[] };
export const fieldworkData = fieldworkJson as unknown as {
  notice: string; rounds: FieldRound[]; details: FieldDetail[]; recordFields: string[];
};
export const scenarioData = scenariosJson as unknown as {
  notice: string; scenes: SceneType[]; categories: CategoryType[];
};
export const siteDemo = demoJson as unknown as {
  notice: string;
  shop: {
    name: string; area: number; monthlyRent: number; estimatedMonthlyRevenue: number;
    rentToSales: number; score: number; scoreLabel: string; risks: string[]; tags: string[];
  };
  trafficTimes: { labels: string[]; passers: number[]; target: number[] };
  weekdayWeekend: { labels: string[]; weekday: number[]; weekend: number[] };
  audience: { name: string; value: number }[];
  competition: { name: string; distance: number; dailyOrders: number; price: number }[];
  scoreDimensions: string[]; scoreValues: number[];
  candidates: { name: string; rent: number; revenue: number; breakeven: number; score: number }[];
  riskDistribution: { name: string; value: number }[];
};

export const siteToolBySlug = (slug: string): SiteToolDef | undefined => siteTools.find((t) => t.slug === slug);
export const siteTopicBySlug = (id: string): SiteTopic | undefined => siteTopics.find((t) => t.id === id);
export const siteStageById = (id: string): SiteStage | undefined => siteRoadmap.find((s) => s.id === id);

export const SCORE_DIMENSIONS = siteDemo.scoreDimensions;

export const CHART_LABELS: Record<string, { title: string; question: string; note: string }> = {
  'traffic-times': { title: '不同时段客流折线图', question: '什么时候人才真的会停下来？', note: '演示数据 · 经过人数与目标客群分开统计' },
  'traffic-weekday': { title: '工作日与周末客流对比', question: '这家店一周里有几个「不同的店」？', note: '演示数据 · 分时段对比' },
  'audience-pie': { title: '目标客群占比饼图', question: '路过的人里，有多少像会进来的人？', note: '演示数据 · 目标客群口径需自行定义' },
  'competition-map': { title: '商圈竞争门店分布', question: '需求是不是已经被别人满足了？', note: '示意分布 · 非真实地图' },
  'score-radar': { title: '铺位评分雷达图', question: '哪一项在拖后腿？', note: '演示数据 · 评分不是成功率' },
  'rent-compare': { title: '候选铺位租金对比', question: '月租差多少，总成本又差多少？', note: '演示数据 · 仅比较月租，不含附加费' },
  'lease-trend': { title: '不同租金方案总成本趋势', question: '第 3 年之后谁更贵？', note: '演示计算 · 按递增率逐年累加' },
  'revenue-scenarios': { title: '营业额三情景图', question: '保守情景能不能过保本线？', note: '演示计算 · 估算模型不是承诺' },
  'rent-profit': { title: '租金变化对利润的影响', question: '租金每涨 2000 元，利润少多少？', note: '演示计算 · 其他条件不变' },
  'breakeven-compare': { title: '不同方案盈亏平衡对比', question: '哪个铺位需要卖得更多才不亏？', note: '演示计算 · 固定成本 ÷ 边际贡献率' },
  'cash-outflow': { title: '租赁期现金支出趋势', question: '哪个月现金最紧？', note: '演示计算 · 含押金与免租期' },
  'risk-distribution': { title: '选址风险分布图', question: '风险集中在哪里？', note: '演示数据 · 按风险项计数' },
};
