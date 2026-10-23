import {execFileSync} from 'node:child_process'
// 统一入口顺序执行已有检查，失败立即返回给调用方。
for (const operation of ['typecheck','lint','test']) execFileSync('pnpm',['run',operation],{stdio:'inherit'})
