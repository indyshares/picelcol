# eiei
สติ๊กเกอร์ เครื่องเขียน และของเล็กๆ น้อยๆ ที่ทำให้วันของคุณน่ารักขึ้น

เว็บไซต์บทความ SEO + User System + Knowledge Graph + AI Ready
สร้างด้วย Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4

## UI Redesign — Cute Lifestyle Brand

ปรับดีไซน์ตามโจทย์ `eiei-app-design.md` (soft kawaii, pastel, premium, ไม่ใช้ emoji):

- **โครงสร้าง route** — แยก `src/app/(public)/` (home, articles, bookmarks, login, register)
  ออกจาก `admin/` เพื่อให้หน้า public ทั้งหมดมี `SiteHeader`/`SiteFooter` ร่วมกัน โดยไม่กระทบ
  admin ซึ่งมี header ของตัวเอง — เปลี่ยนแค่ path ที่ไฟล์ตั้งอยู่ ไม่กระทบ URL จริง
- **`SiteHeader`** — sticky + backdrop-blur, ช่องค้นหาทรงกลม (ผูกกับ `searchArticles()` ที่เพิ่ง
  เติมเข้ามา — เป็น Full Text Search แบบพื้นฐานที่ขาดไปจาก Phase 1 เดิม)
- **`DecorativeBlobs`** — ลายเซ็นของธีมนี้: กลุ่มบับเบิลพาสเทลเบลอนุ่มๆ (สีตามโลโก้: ฟ้า/ชมพู/
  ส้มคอรัล) สร้างด้วย CSS gradient ล้วนๆ ไม่มีรูปภาพ/emoji ใช้ในหน้า Home, Login, Register
- **`ArticleCard`** ใหม่ — badge หมวดหมู่, fallback gradient เมื่อไม่มีรูปปก, ผู้เขียน + วันที่,
  hover ยกตัว+ขยายรูป
- **`EmptyState`** — CSS illustration ล้วน (ไม่ใช้ emoji) แทนข้อความเปล่าๆ
- **`Button`** (`src/components/ui/button.tsx`) — ปุ่มมาตรฐานของทั้งเว็บ (primary/secondary/
  ghost/outline/link) ใช้ร่วมกันใน auth form, comment form, article form
- **Loading skeleton** — `articles/loading.tsx` แบบ soft pulse
- หน้าบทความ: badge หมวดหมู่, เวลาอ่านโดยประมาณ (`utils/reading-time.ts`), typography
  ที่ใช้ฟอนต์ Poppins ชัดเจนขึ้น, spacing กว้างขึ้น

## โครงสร้างโปรเจกต์

```
src/
├── app/
│   ├── (public)/   # หน้า public ทั้งหมด (home, articles, bookmarks, login, register)
│   │                # — ใช้ SiteHeader/SiteFooter ร่วมกันผ่าน (public)/layout.tsx
│   ├── admin/      # หน้าแอดมิน (มี layout/header แยกของตัวเอง)
│   ├── auth/       # auth callback route
│   └── ...SEO files (robots.ts, sitemap.ts, manifest.ts, opengraph-image.tsx)
├── components/     # shared UI (Button, SiteHeader, SiteFooter, DecorativeBlobs, EmptyState)
├── features/       # ฟีเจอร์แยกตามโดเมน เช่น features/article, features/auth
├── lib/            # prisma client, supabase clients, cn() util
├── services/       # data-access layer / business logic ที่เรียกจาก route handlers
├── hooks/          # custom hooks + zustand stores
├── utils/          # pure helper functions (slugify, reading-time)
├── schemas/        # zod schemas สำหรับ validation
├── types/          # shared TypeScript types
├── constants/       # ค่าคงที่ เช่น site config, theme tokens
├── styles/         # globals.css + theme.css (design tokens)
└── middleware.ts   # supabase auth session refresh

prisma/
└── schema.prisma   # DB schema ตามโครงสร้างฐานข้อมูลในเอกสาร (users, articles,
                     # categories/tags, comments, likes/bookmarks)
```

## เริ่มต้นใช้งาน

```bash
pnpm install
cp .env.example .env   # แล้วกรอกค่า Supabase / Database URL ของจริง

pnpm prisma:generate
pnpm prisma:migrate    # สร้างตารางตาม schema.prisma ใน Supabase

pnpm dev
```

เปิด [http://localhost:3000](http://localhost:3000)

## Theme

โทนสี Light/Dark ตั้งไว้เป็น CSS variables ที่ `src/styles/theme.css` และ map เข้ากับ
Tailwind v4 ผ่าน `@theme` ใน `src/styles/globals.css` (เช่น `bg-primary`, `text-text`,
`border-border`) สลับธีมด้วย `next-themes` (`class` strategy) ที่ตั้งไว้ใน
`src/components/theme-provider.tsx` แล้ว

ฟอนต์: Poppins สำหรับ heading, Nunito Sans สำหรับ body (โหลดผ่าน `next/font/google`
ใน `src/app/layout.tsx`)

## ระบบบทความ (Article System)

- `src/features/article/` — feature module
  - `components/article-editor.tsx` — MDXEditor client component (toolbar, headings, lists,
    links, images, tables, code blocks พร้อม CodeMirror)
  - `components/article-form.tsx` — ฟอร์มสร้าง/แก้ไขบทความ, auto-generate slug จากชื่อเรื่อง,
    ใช้ `useActionState` (React 19) ร่วมกับ Server Actions
  - `components/article-card.tsx`, `components/article-content.tsx` — แสดงผลฝั่ง public
  - `render-markdown.ts` — pipeline remark-gfm + Shiki (light/dark) แปลง Markdown → HTML
  - `actions.ts` — Server Actions: create/update/delete พร้อม validate ด้วย Zod (`schemas/article.schema.ts`)
- `src/services/article.service.ts`, `taxonomy.service.ts` — data-access layer (Prisma)
- หน้า public: `/articles` (list), `/articles/[slug]` (detail + dynamic metadata + Article JSON-LD)
- หน้า admin: `/admin/articles` (list+delete), `/admin/articles/new`, `/admin/articles/[id]/edit`



## ระบบผู้ใช้ (User System / Auth)

- `src/features/auth/actions.ts` — Server Actions: `signUpAction`, `signInAction`, `signOutAction`
  (Supabase Auth, email + password)
- `src/features/auth/get-current-user.ts` — อ่าน session ปัจจุบันฝั่ง server
- `src/services/user.service.ts` — `ensureUser()` sync Supabase auth user → Prisma `User`
  (ใช้ auth user id เป็น Prisma user id เดียวกัน จึง join ได้ตรงๆ)
- หน้า `/login`, `/register` ใช้ฟอร์มร่วมกัน (`features/auth/components/auth-form.tsx`)
- `/auth/callback` — route handler สำหรับ exchange code (ยืนยันอีเมล/OAuth)
- `src/app/admin/layout.tsx` — **auth guard**: ทุกหน้าใต้ `/admin` ต้องล็อกอินก่อน ไม่งั้น
  redirect ไป `/login`; มี header แสดงอีเมลผู้ใช้ + ปุ่มออกจากระบบ
- `features/article/actions.ts` ผูก `authorId` เข้ากับผู้ใช้ที่ล็อกอินจริงแล้ว (ผ่าน `ensureUser`)

> มีระบบ Role/Permission แล้ว: ผู้ใช้มี role `admin` หรือ `user` (ดู `UserRole` enum ใน
> Prisma schema) — เฉพาะ `admin` เท่านั้นที่เข้า `/admin` ได้ (`src/app/admin/layout.tsx`
> เรียก `isAdmin()` จาก `user.service.ts`); ผู้ใช้ใหม่จะได้ role `user` โดยอัตโนมัติ
> ต้องใช้ `setAdminRole()` เพื่อเลื่อนสิทธิ์ให้ admin คนแรก

## Dynamic OG Image

- `src/app/opengraph-image.tsx`, `src/app/twitter-image.tsx` — การ์ดแบรนด์ default
  (ใช้ `runtime = "edge"`, gradient ตาม Light Theme, ไม่พึ่ง Prisma)
- `src/app/articles/[slug]/opengraph-image.tsx` — สร้างรูปตาม "ชื่อบทความ" และ
  "หมวดหมู่แรก" ของบทความจริงแบบไดนามิก (ใช้ `runtime = "nodejs"` เพราะต้อง query
  Prisma ได้ตรงๆ, edge runtime ทำไม่ได้)
- ไม่ต้องตั้งค่า `openGraph.images` เองในหน้าที่ไม่มี cover image — Next.js จะ fallback
  ไปใช้ไฟล์เหล่านี้ให้อัตโนมัติตาม route

## Engagement: Likes / Bookmarks / Views (Phase 2)

- `src/services/engagement.service.ts` — Prisma queries: toggle like/bookmark, count,
  record view, `getTrendingArticles()` (group `ArticleView` by article in the last N days)
- `src/features/engagement/actions.ts` — Server Actions ต้องล็อกอินสำหรับ like/bookmark
  (`recordViewAction` ไม่ต้องล็อกอิน — เก็บ view จากทุกคน)
- Client components (optimistic UI): `like-button.tsx`, `bookmark-button.tsx`,
  `view-tracker.tsx` (component เปล่าที่ยิง view ครั้งเดียวตอน mount)
- หน้าใหม่: `/bookmarks` (auth-guarded, รายการบทความที่บันทึกไว้)
- หน้า `/articles` มีเซคชัน "มาแรงสัปดาห์นี้" จาก `getTrendingArticles()`
- หน้า `/articles/[slug]` แสดงจำนวนวิว, ปุ่ม Like/Bookmark, จำนวนคนบันทึก

> หมายเหตุ: `ArticleView` บันทึกทุกครั้งที่เปิดหน้า (ไม่ dedupe ต่อผู้ใช้/ต่อ IP) —
> เพียงพอสำหรับ MVP แต่ถ้าต้องการนับ unique view ที่แม่นยำ ควรเพิ่ม dedupe key ภายหลัง

## Comments (Phase 2)

- `src/services/comment.service.ts` — list/create/delete (ลบได้เฉพาะเจ้าของ comment)
- `src/features/comment/actions.ts` — Server Actions ต้องล็อกอิน, validate ด้วย Zod
- `comment-form.tsx` (client, `useActionState`), `comment-list.tsx` (server component,
  แสดงปุ่มลบเฉพาะ comment ของผู้ใช้ที่ล็อกอินอยู่)
- แสดงอยู่ในหน้า `/articles/[slug]`

## Related Articles (Phase 2)

- `src/services/related-articles.service.ts` — heuristic แบบง่าย: หาบทความที่แชร์
  หมวดหมู่/แท็กเดียวกัน แล้วจัดอันดับตามจำนวนที่ overlap กัน (หมวดหมู่ถ่วงน้ำหนักมากกว่าแท็ก)
- แสดงเป็นเซคชันท้ายหน้า `/articles/[slug]`

## สถานะปัจจุบัน

- [x] Scaffold โปรเจกต์ + โครงสร้างโฟลเดอร์
- [x] Prisma schema เบื้องต้นตามโครงสร้างฐานข้อมูล
- [x] Theme tokens (light/dark) + font setup
- [x] Supabase client (browser/server) + middleware สำหรับ auth session
- [x] robots.ts / sitemap.ts (query บทความจริง, รองรับค้นหา) / manifest.ts
- [x] ระบบบทความ (MDXEditor, Article CRUD, Markdown rendering + Shiki)
- [x] Structured Data (Article JSON-LD) + Dynamic Metadata สำหรับหน้าบทความ
- [x] ระบบผู้ใช้ (login/register, auth guard สำหรับ /admin, sync user เข้า Prisma)
- [x] Dynamic OG Image (default + ต่อบทความ)
- [x] Likes / Bookmarks / Views + Trending
- [x] Comments
- [x] Related Articles (heuristic เบื้องต้น)
- [x] Basic Full Text Search (`searchArticles`, ใช้ใน `SiteHeader`)
- [x] UI Redesign — Cute Lifestyle Brand (ดูหัวข้อด้านบน)
- [x] Role/Permission (admin vs user) — admin guard ที่ `/admin/layout.tsx`
- [ ] Knowledge Graph, AI Tagging, AI Search, RAG (Phase 3-4) — **ข้ามโดยตั้งใจ**: เว็บนี้เป็น
      แบรนด์ส่วนตัวที่มีแอดมินคนเดียวเป็นคนลงบทความเอง ไม่ต้องการมี AI เกี่ยวข้องกับเว็บไซต์เลย

**Phase 1 + Phase 2 ครบ, UI ปรับเป็น Cute Lifestyle Brand แล้ว — Phase 3-4 ข้ามตามที่ตกลงกัน**


