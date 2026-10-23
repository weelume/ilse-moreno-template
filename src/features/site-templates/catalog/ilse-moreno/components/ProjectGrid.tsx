'use client';
import Link from 'next/link';
import { projects, text, type Locale } from '../content/data';
import { Reveal } from './Shared';
export default function ProjectGrid({ locale, basePath, exclude }: {
    locale: Locale;
    basePath: string;
    exclude?: string;
}) { return <div className="im-project-grid">{projects.filter(p => p.id !== exclude).slice(0, exclude ? 3 : projects.length).map((p, i) => <Reveal key={p.id} delay={i % 2 * .08}><Link className="im-project-card im-glass" href={basePath + '/work/' + p.id}><div className="im-project-card-image"><span>{p.name} · {text(locale, '网站', 'Website')}</span><img src={p.cover} alt={p.name + ' ' + text(locale, '网站设计', 'website design')}/></div><div><h3>{p.name}</h3><p>{p.summary[locale]}</p><span className="im-text-link">{text(locale, '查看案例', 'View case study')}</span></div></Link></Reveal>)}</div>; }
