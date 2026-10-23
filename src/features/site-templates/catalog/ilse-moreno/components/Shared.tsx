'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, type ReactNode, type FormEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { brand } from '../config/brand';
import { text, portrait, type Locale, type Project } from '../content/data';
import { languagePath } from '../canvas-model';
import { HostBrandName, HostLogo, HostFiling, HostNavigationLogo, HostMarketplaceLink, HostMarketplaceLabel } from '../host';
import '../theme.css';
export function Reveal({ children, delay = 0, className = '' }: {
    children: ReactNode;
    delay?: number;
    className?: string;
}) { const reduced = useReducedMotion(); return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: reduced ? 0 : .65, delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>; }
export function Availability({ locale }: {
    locale: Locale;
}) { return <span className="im-availability"><i aria-hidden="true"/>{text(locale, '11 月起接受新项目', 'Taking new projects from November')}</span>; }
export function Selection({ children, label, className = '' }: {
    children: ReactNode;
    label?: string;
    className?: string;
}) { return <div className={'im-selection ' + className}>{label && <span className="im-selection-label">{label}</span>}{children}<i /><i /><i /><i /></div>; }
export function Modal({ open, onClose, label, children }: {
    open: boolean;
    onClose: () => void;
    label: string;
    children: ReactNode;
}) { const ref = useRef<HTMLDialogElement>(null); useEffect(() => { const el = ref.current; if (open && !el?.open)
    el?.showModal();
else if (!open && el?.open)
    el.close(); }, [open]); return <dialog ref={ref} className="im-modal" aria-label={label} onCancel={onClose} onClick={e => { if (e.target === e.currentTarget)
    onClose(); }}><div><button className="im-close" onClick={onClose} aria-label={label + ' · Close / 关闭'}>×</button>{children}</div></dialog>; }
export function Shell({ locale, basePath, children }: {
    locale: Locale;
    basePath: string;
    children: ReactNode;
}) { const pathname = usePathname(), [menu, setMenu] = useState(false), router = useRouter(); const language = languagePath(pathname, basePath, locale, '', ''); function switchLanguage(e: React.MouseEvent<HTMLAnchorElement>) { e.preventDefault(); setMenu(false); router.push(languagePath(pathname, basePath, locale, window.location.search, window.location.hash)); } const home = basePath || '/'; return <div className="im" lang={locale === 'zh' ? 'zh-CN' : 'en'}><header className="im-header"><Link href={home} className="im-wordmark" aria-label={text(locale, '返回首页', 'Home')}><Selection><HostNavigationLogo/><HostBrandName locale={locale}/></Selection></Link><nav className="im-desktop-nav"><Link href={basePath + '/work'}>{text(locale, '作品', 'Work')}</Link><Link href={basePath + '/about'}>{text(locale, '关于', 'About')}</Link><Link href={language || home} hrefLang={locale === 'zh' ? 'en' : 'zh-CN'} onClick={switchLanguage}>{locale === 'zh' ? 'EN' : '中文'}</Link><Link className="im-btn im-dark" href={home + '#contact'}>{text(locale, '聊聊项目', 'Say hello')}</Link></nav><button className="im-menu-btn im-btn" aria-expanded={menu} onClick={() => setMenu(!menu)}>{text(locale, '菜单', 'Menu')}</button></header><Modal open={menu} onClose={() => setMenu(false)} label={text(locale, '导航菜单', 'Navigation menu')}><nav className="im-menu"><Link onClick={() => setMenu(false)} href={home}>{text(locale, '首页', 'Home')}</Link><Link onClick={() => setMenu(false)} href={basePath + '/work'}>{text(locale, '作品', 'Work')}</Link><Link onClick={() => setMenu(false)} href={basePath + '/about'}>{text(locale, '关于', 'About')}</Link><Link onClick={() => setMenu(false)} href={home + '#contact'}>{text(locale, '聊聊项目', 'Say hello')}</Link><Link onClick={switchLanguage} href={language || home}>{locale === 'zh' ? 'English' : '中文'}</Link></nav></Modal><main>{children}</main><footer className="im-footer"><div className="im-container im-footer-grid"><div><Link className="im-wordmark" href={home}><HostBrandName locale={locale}/></Link><p><Availability locale={locale}/></p><a href={'mailto:' + brand.email}>{brand.email}</a></div><div><small>{text(locale, '页面', 'Pages')}</small><Link href={basePath + '/work'}>{text(locale, '作品', 'Work')}</Link><Link href={basePath + '/about'}>{text(locale, '关于', 'About')}</Link><Link href={home + '#contact'}>{text(locale, '聊聊项目', 'Say hello')}</Link></div><div><small>{text(locale, '其他平台', 'Elsewhere')}</small>{['LinkedIn', 'Instagram', 'Dribbble'].map(n => <a key={n} href={'https://www.' + n.toLowerCase() + '.com/'} target="_blank" rel="noreferrer">{n}</a>)}</div></div><div className="im-container im-footer-bottom"><span>{text(locale, '以清晰的设计，让好想法被看见。人物、项目与客户评价均为演示。', 'Clear design for ideas worth seeing. Designer, projects and testimonials are fictional demos.')}</span><span>© {brand.year} <HostBrandName locale={locale}/></span><HostFiling /></div></footer><HostMarketplaceLink href="/" className="im-market" aria-label={text(locale, '打开模板市场', 'Open template marketplace')}><HostLogo light alt=""/><span><HostBrandName locale={locale}/></span><span className="im-sr"><HostMarketplaceLabel /></span></HostMarketplaceLink></div>; }
export function Heading({ title, description, tag }: {
    title: string;
    description?: string;
    tag?: string;
}) { return <div className="im-heading">{tag && <span className="im-tag">{tag}</span>}<h2>{title}</h2>{description && <p>{description}</p>}</div>; }
export function Praise({ project, locale }: {
    project: Project;
    locale: Locale;
}) { return <article className="im-praise im-glass"><div className="im-praise-head"><img src={project.praise.avatar} alt={project.praise.name}/><div><strong>{project.praise.name}</strong><small>{locale === 'zh' ? project.client.zh : project.praise.role}</small></div><span className="im-approved">✓ {text(locale, '已确认', 'Approved')}</span></div><blockquote>“{project.praise.quote[locale]}”</blockquote><div className="im-praise-bottom"><span>{project.praise.reactions.map(r => <span className="im-reaction" key={r}>{r}</span>)}</span><span>{text(locale, '来自 ', 'on ')}{project.name}</span></div></article>; }
export function Contact({ locale }: {
    locale: Locale;
}) { const [status, setStatus] = useState(''), [copy, setCopy] = useState(''); async function copyEmail() { try {
    await navigator.clipboard.writeText(brand.email);
    setCopy(text(locale, '已复制', 'Copied'));
}
catch (error) {
    console.error('[ilse-moreno:clipboard] 写入失败', error instanceof Error ? error.name : 'UnknownError');
    setCopy(text(locale, '复制失败，请手动选择邮箱', 'Copy failed. Please select the email manually.'));
} } function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); const f = new FormData(e.currentTarget), name = String(f.get('name') ?? '').trim(), email = String(f.get('email') ?? '').trim(), message = String(f.get('message') ?? '').trim(); const valid = !!name && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && message.length >= 10; console.debug('[ilse-moreno:contact] 本地校验', { valid, namePresent: !!name, emailValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), messageLength: message.length, sent: false, saved: false }); setStatus(valid ? text(locale, '校验通过。这是演示表单，内容未发送、未保存。', 'Validation passed. Demo only: nothing was sent or saved.') : text(locale, '请填写姓名、有效邮箱，以及至少 10 个字符的项目说明。', 'Enter your name, a valid email and at least 10 characters about the project.')); } return <section className="im-section im-contact" id="contact"><div className="im-container im-two"><Reveal><Heading title={text(locale, '聊聊你的项目', 'Say hello')} description={text(locale, '介绍一下你的想法，我会在两个工作日内回复。', 'Tell me a little about the project. I reply within two working days.')}/><div className="im-email im-glass"><a href={'mailto:' + brand.email}>{brand.email}</a><button onClick={copyEmail}>{text(locale, '复制', 'Copy')}</button></div><p role="status">{copy}</p><Availability locale={locale}/><div className="im-socials">{['LinkedIn', 'Instagram', 'Dribbble'].map(n => <a key={n} href={'https://www.' + n.toLowerCase() + '.com/'} target="_blank" rel="noreferrer">{n}</a>)}</div></Reveal><Reveal><form className="im-form im-glass" onSubmit={submit} noValidate><div className="im-two"><label>{text(locale, '姓名', 'Name')}<input name="name" autoComplete="name" required/></label><label>{text(locale, '邮箱', 'Email')}<input name="email" type="email" autoComplete="email" required/></label></div><label>{text(locale, '你正在做什么项目？', 'What are you working on?')}<textarea name="message" rows={5} minLength={10} required/></label><label>{text(locale, '预算', 'Budget')}<select name="budget"><option>{text(locale, '暂不确定', 'Not sure yet')}</option><option>{text(locale, '€10k 以下', 'Under €10k')}</option><option>€10–20k</option><option>€20k+</option></select></label><p className="im-muted">{text(locale, '演示表单，仅本地校验，不发送或保存信息。', 'Demo form. Local validation only; nothing is sent or saved.')}</p><button className="im-btn im-dark" type="submit">{text(locale, '提交校验', 'Send')}</button><p role="status" aria-live="polite">{status}</p></form></Reveal></div></section>; }
export function CallToAction({ locale, basePath }: {
    locale: Locale;
    basePath: string;
}) { const [show, setShow] = useState(false); return <section className="im-section im-cta"><div className="im-container im-two"><Reveal><Heading title={text(locale, '一起做点好作品', 'Want to work together?')} description={text(locale, '告诉我你在做什么。我会在两个工作日内回复。', "Tell me what you’re working on. I reply within two working days.")}/><Link className="im-btn im-dark" href={(basePath || '/') + '#contact'} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} onFocus={() => setShow(true)} onBlur={() => setShow(false)}>{text(locale, '聊聊项目', 'Say hello')}</Link></Reveal><motion.aside className="im-note im-glass" animate={{ rotate: show ? -2 : 1, y: show ? -8 : 0 }}><img src={portrait} alt=""/><HostBrandName locale={locale}/><small>{text(locale, '通常在两个工作日内回复', 'Usually replies within two working days')}</small><p>{text(locale, '告诉我你想做什么、什么时候需要。我会亲自阅读每一条消息，也会坦诚告诉你是否适合合作。', 'Tell me what you are making and when you need it. I read every message myself, and will say honestly if I am not the right fit.')}</p><Availability locale={locale}/></motion.aside></div></section>; }
