import Link from 'next/link';
export default function NotFound() { return <main style={{ padding: '15vh 8vw', fontFamily: 'sans-serif' }}><h1>404</h1><p>页面不存在 / Page not found</p><Link href="/">返回首页 / Back home</Link></main>; }
