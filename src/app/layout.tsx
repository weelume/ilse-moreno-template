import type { ReactNode } from 'react';
import './globals.css';
export const metadata = { title: 'Ilse Moreno · 品牌与网页设计师', description: '双语交互画布设计作品集' };
export default function Layout({ children }: {
    children: ReactNode;
}) { return <html lang="zh-CN"><body>{children}</body></html>; }
