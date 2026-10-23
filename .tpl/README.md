# Ilse Moreno · 交互画布作品集

Next.js / React / TypeScript 的双语设计师网站，包含首页、作品、关于和六个案例（18 条中英文路径）。默认中文，英文 /en。全部运行素材本地托管，表单只校验、不保存或发送。客户与项目均为演示。

先读 template.json、project.json 与 docs。Node 版本见 .nvmrc，包管理器 pnpm@12.10.1。使用 pnpm install --frozen-lockfile 安装，pnpm dev 启动 http://127.0.0.1:43340，Ctrl+C 停止。检查：pnpm typecheck、pnpm lint、pnpm test、pnpm build。构建后 pnpm start。构建与安装在本地 Linux 文件系统执行。

修改入口：src/features/site-templates/catalog/ilse-moreno/config/brand.ts 为品牌；content/ 为内容；theme.css 为主题；components/ 为公共交互；pages/ 为页面组合。

源码仓库：https://github.com/weelume/ilse-moreno-template 。公开交付已经用户授权；未部署或上架。素材许可见 docs/LICENSE.md。
