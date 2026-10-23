'use client';
import Link from 'next/link';
import { createContext, useContext, type ReactNode, type ComponentProps } from 'react';
import type { TemplateLocale } from '../../types';
import { brand } from './config/brand';
export interface IlseMorenoHostOptions {
    locale?: TemplateLocale;
    brandName?: Record<TemplateLocale, string>;
    logo?: string;
    lightLogo?: string;
    marketplaceHref?: string;
    marketplaceLabel?: Record<TemplateLocale, string>;
    marketplaceAriaLabel?: Record<TemplateLocale, string>;
    filing?: ReactNode;
}
const Context = createContext<IlseMorenoHostOptions>({});
/** 宿主仅注入展示能力；独立运行不读取宿主资源或路径。 */
export function IlseMorenoHostProvider({ children, ...options }: IlseMorenoHostOptions & {
    children: ReactNode;
}) { return <Context.Provider value={options}>{children}</Context.Provider>; }
export function HostLogo({ light = false, ...props }: Omit<ComponentProps<'img'>, 'src'> & {
    light?: boolean;
}) { const host = useContext(Context); return <img {...props} src={light ? host.lightLogo ?? brand.lightLogo : host.logo ?? brand.logo}/>; }
export function HostFiling() { return useContext(Context).filing; }
export function HostMarketplaceLink(props: ComponentProps<typeof Link>) { const host = useContext(Context); return host.marketplaceHref ? <Link {...props} href={host.marketplaceHref} aria-label={props['aria-label'] ? host.marketplaceAriaLabel?.[host.locale ?? 'zh'] ?? props['aria-label'] : undefined}/> : null; }
export function HostBrandName({ locale = 'zh' }: {
    locale?: TemplateLocale;
}) { const host = useContext(Context); return host.brandName?.[locale] ?? brand.name[locale]; }
export function HostMarketplaceLabel() { const host = useContext(Context); return host.marketplaceLabel?.[host.locale ?? 'zh'] ?? ''; }
