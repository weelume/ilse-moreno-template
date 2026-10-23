'use client';
import type { SiteTemplatePageProps } from '../../../types';
import { Shell, Heading, Reveal } from '../components/Shared';
import WorkCanvas from '../components/WorkCanvas';
import ProjectGrid from '../components/ProjectGrid';
import { text } from '../content/data';
export default function WorkPage({ locale = 'zh', basePath }: SiteTemplatePageProps) { return <Shell locale={locale} basePath={basePath}><section className="im-section im-page-top"><div className="im-container"><Reveal><div className="im-page-title"><span className="im-tag">{text(locale, '项目索引', 'Index')}</span><h1>{text(locale, '作品', 'Work')}</h1><p>{text(locale, '从 2022 年至今，为小企业设计的网站与品牌。拖动画布探索，或向下查看完整列表。', 'Sites and brands for small companies, 2022 to now. Drag around the canvas, or scroll down for the full list.')}</p></div></Reveal><WorkCanvas locale={locale} basePath={basePath}/></div></section><section className="im-section im-white"><div className="im-container"><Heading title={text(locale, '全部项目', 'All projects')} description={text(locale, '每个案例都记录了需求、设计过程和最终的改变。', 'Every case study, with the brief, what I did and what changed.')}/><ProjectGrid locale={locale} basePath={basePath}/></div></section></Shell>; }
