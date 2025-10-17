# Tanstack Router Cheat Sheet

This cheat sheet summarizes key concepts, setup, and features from the "Tanstack Router Full Course" YouTube video transcript. It's organized by major topics for quick reference. Focus is on React usage (Solid also supported).

## 1. Overview & Features
- **What is Tanstack Router?**: 100% type-safe router for React/Solid apps. Not a full-stack framework but powers Tanstack Start (beta).
- **Key Features**:
  - Nested layouts & layout groups.
  - File-based routing.
  - Parallel data loading, prefetching, built-in caching.
  - Type-safe navigation, search params, and context.
  - Integration with Tanstack Query.
  - Loader functions for data fetching (sync/async, streaming).
  - Error handling, not found routes.
  - Code splitting, preloading.
- **Comparison Table** (from video; simplified):

| Feature                  | Tanstack Router | React Router | Next.js Router |
|--------------------------|-----------------|--------------|----------------|
| Type Safety              | 100% Inferred  | Partial     | Partial       |
| File-Based Routing       | Yes            | No          | Yes           |
| Built-in Caching         | Yes            | No          | Partial       |
| Search Param Validation  | Yes (e.g., Zod)| No          | No            |
| Nested Layouts           | Yes            | Yes         | Yes           |
| Code Splitting           | Auto           | Manual      | Auto          |

## 2. Installation & Setup
- **Create Project**: `npm create vite@latest` → Choose React + TypeScript.
- **Install Dependencies**:
  - `npm install @tanstack/react-router @tanstack/react-router-devtools`
  - Dev: `npm install -D @tanstack/router-vite-plugin`
  - Optional (styling): `npm install -D tailwindcss postcss autoprefixer`
- **Vite Config (vite.config.ts)**:
  ```ts
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';
  import { TanStackRouterVite } from '@tanstack/router-vite-plugin';

  export default defineConfig({
    plugins: [
      TanStackRouterVite({ target: 'react' }), // Before react()
      react(),
    ],
  });
  ```
- **Main.tsx Setup**:
  - Create router with route tree.
  - Render: `<RouterProvider router={router} />`.
  - Add devtools: `<TanStackRouterDevtools />`.

## 3. Routing Basics
- **Code-Based Routing** (less preferred; manual tree building):
  ```ts
  import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';

  const rootRoute = createRootRoute({ component: () => <Outlet /> });
  const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home });
  const routeTree = rootRoute.addChildren([homeRoute]);
  const router = createRouter({ routeTree });
  ```
- **File-Based Routing** (preferred; auto-generates tree):
  - Folder: `src/routes/`.
  - Root: `__root.tsx` (always matched, use `<Outlet />` for children).
  - Home: `index.tsx` (path: `/`).
  - About: `about.tsx` (path: `/about`).
  - Auto-generates `routes.gen.ts` for type safety.
- **Type Safety Setup** (in main.tsx after router):
  ```ts
  declare module '@tanstack/react-router' {
    interface Register { router: typeof router; }
  }
  ```
- **Navigation**:
  - `<Link to="/about" className="active:font-bold">About</Link>`.
  - Active styling: Use `data-status="active"` or `activeProps`.
  - Exact match: `<Link activeOptions={{ exact: true }} />`.

## 4. Nested Routes & Layouts
- **Folder-Based Nesting**:
  - `settings/route.tsx`: Parent layout (no trailing `/`, matches `/settings/*`).
  - `settings/profile.tsx`: Child (path: `/settings/profile`).
  - Use `<Outlet />` in parent for children.
- **Pathless Layouts**: Prefix folder/file with `_` (e.g., `_auth.tsx` for shared UI without path).
- **Ignore in URL**: Prefix with `_` (e.g., `settings_/password.tsx` → `/settings/password`, but not child of `settings`).
- **Ignore Folders**: Prefix with `-` (e.g., `-components/` for non-route files).
- **Groups**: Wrap in `()` (e.g., `(app)/home.tsx` → organizes without affecting URL).
- **Flat File Nesting** (no folders):
  - Use `.` for nesting: `_auth.about.tsx` (about as child of `_auth`).
  - Dynamic: `posts.$postId.tsx` (path: `/posts/:postId`).
- **Index Routes**: `index.tsx` (exact match, no children).

## 5. Dynamic Routes & Params
- **Dynamic Params**: Use `$` (e.g., `posts.$id.tsx` → `/posts/:id`).
- **Access Params**:
  ```ts
  const { id } = route.useParams(); // Type-safe.
  ```

## 6. Data Loading (Loaders)
- **Loader Function** (in route file):
  ```ts
  loader: async () => ({ data: await fetch('/api').then(res => res.json()) }),
  ```
- **Access Data**: `const data = useLoaderData<typeof route>();`.
- **Deps (e.g., search params)**: Use `loaderDeps` to cache separately.
- **Pending State**: `pendingComponent: () => <Loading />`.
- **Streaming**: Use `defer` for partial loading (e.g., `<Await promise={deferred.comments} />`).
- **Before Load**: Runs before loader (e.g., for auth checks, redirects).

## 7. Search Params
- **Validation** (e.g., Zod):
  ```ts
  validateSearch: zodSearchValidator(z.object({ page: z.number().optional() })),
  ```
- **Access**: `const { page } = route.useSearch();`.
- **Update**: `<Link search={{ page: 2 }} />` or `navigate({ search: (prev) => ({ ...prev, page: 2 }) })`.

## 8. Context
- **Provide**: In router: `context: { user: null }`.
- **Access**: `const { user } = route.useRouteContext();`.

## 9. Redirection & Navigation
- **Redirect**: `throw redirect({ to: '/login' });` (in beforeLoad/loader).
- **Navigate Hook**: `const navigate = useNavigate(); navigate({ to: '/home' });`.

## 10. Error Handling
- **Error Component**: `errorComponent: () => <ErrorMessage />`.
- **Not Found**: `notFoundComponent: () => <NotFound />` or `throw notFound();`.
- **Catch Boundary**: Wrap async components: `<CatchBoundary getResetKey={() => 'key'} onCatch={(err) => console.log(err)}><Await ... /></CatchBoundary>`.

## 11. Code Splitting & Preloading
- **Enable**: In vite.config.ts: `TanStackRouterVite({ autoCodeSplitting: true })`.
- **Preload**: `<Link preload="intent" />` (hover) or global: `defaultPreload: 'intent'`.
- **Options**: `defaultPreloadDelay: 1000` (ms before preload), `defaultPreloadStaleTime: 5000` (cache duration).

## 12. Caching
- **Default**: Stale-While-Revalidate (SWR); in-memory only.
- **Options** (per route or global):
  - `staleTime: 30000` (ms data is fresh; default 0).
  - `gcTime: 1800000` (ms before garbage collect; default 30min).
  - `shouldReload: (ctx) => true/false` (custom reload logic).
- **Invalidate**: `router.invalidate()` (reruns loaders, marks stale).

## 13. Authentication (Route Protection)
- **Single Route**: In beforeLoad: `if (!ctx.user) throw redirect({ to: '/login' });`.
- **Group Protection**: Use pathless layout (`_auth.tsx`) with beforeLoad/errorComponent.
- **Login Redirect**: Pass `search: { redirect: location.href }`; On login: `navigate({ to: search.redirect ?? '/' })`.

## 14. Advanced/Misc
- **Devtools**: `<TanStackRouterDevtools position="top-right" />` (visualize route tree).
- **Route Masking**: For modals (mask URL while showing different content).
- **Navigation Blocking**: Warn on unsaved changes.
- **Document Head**: Manage title/meta for SEO.
- **Virtual File Routes**: Custom naming conventions.

For full details, refer to Tanstack Router docs or the video. Use file-based routing for scalability and type safety!

# ملخص Tanstack Router بالعربية

هذا الملخص يغطي النقاط الأساسية من فيديو "Tanstack Router Full Course" على يوتيوب، بناءً على النص المقدم. الملخص مقسم إلى أقسام لسهولة الرجوع إليه، مع التركيز على استخدام Tanstack Router مع React (يدعم Solid أيضًا).

## 1. نظرة عامة ومميزات
- **ما هو Tanstack Router؟**: مكتبة توجيه (Router) آمنة نوعيًا بنسبة 100% لتطبيقات React وSolid. ليست إطار عمل كامل، لكنها تدعم Tanstack Start (في مرحلة البيتا).
- **المميزات الرئيسية**:
  - تخطيطات متداخلة ومجموعات تخطيط.
  - توجيه يعتمد على الملفات.
  - تحميل بيانات متوازي، تحميل مسبق، وتخزين مؤقت مدمج.
  - توجيه ومعاملات بحث آمنة نوعيًا باستخدام TypeScript.
  - التكامل مع Tanstack Query.
  - وظائف تحميل البيانات (Loaders) تدعم التدفق (Streaming).
  - التعامل مع الأخطاء وصفحات "غير موجود".
  - تقسيم الشيفرة والتحميل المسبق.
- **مقارنة بين المكتبات** (مبسطة من الفيديو):

| الميزة                 | Tanstack Router | React Router | Next.js Router |
|-------------------------|-----------------|--------------|----------------|
| الأمان النوعي           | 100% مستنتج    | جزئي        | جزئي          |
| توجيه يعتمد على الملفات | نعم            | لا          | نعم           |
| تخزين مؤقت مدمج        | نعم            | لا          | جزئي          |
| التحقق من معاملات البحث | نعم (مثل Zod)  | لا          | لا            |
| تخطيطات متداخلة        | نعم            | نعم         | نعم           |
| تقسيم الشيفرة          | تلقائي         | يدوي        | تلقائي        |

## 2. التثبيت والإعداد
- **إنشاء مشروع**: `npm create vite@latest` → اختر React + TypeScript.
- **تثبيت التبعيات**:
  - `npm install @tanstack/react-router @tanstack/react-router-devtools`
  - تبعيات التطوير: `npm install -D @tanstack/router-vite-plugin`
  - اختياري (للتنسيق): `npm install -D tailwindcss postcss autoprefixer`
- **إعداد Vite (vite.config.ts)**:
  ```ts
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';
  import { TanStackRouterVite } from '@tanstack/router-vite-plugin';

  export default defineConfig({
    plugins: [
      TanStackRouterVite({ target: 'react' }), // قبل react()
      react(),
    ],
  });
  ```
- **إعداد main.tsx**:
  - إنشاء الراوتر مع شجرة التوجيه.
  - عرض: `<RouterProvider router={router} />`.
  - إضافة أدوات التطوير: `<TanStackRouterDevtools />`.

## 3. أساسيات التوجيه
- **التوجيه القائم على الكود** (غير مفضل؛ يتطلب بناء الشجرة يدويًا):
  ```ts
  import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';

  const rootRoute = createRootRoute({ component: () => <Outlet /> });
  const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home });
  const routeTree = rootRoute.addChildren([homeRoute]);
  const router = createRouter({ routeTree });
  ```
- **التوجيه القائم على الملفات** (مفضل؛ يولد الشجرة تلقائيًا):
  - مجلد: `src/routes/`.
  - الجذر: `__root.tsx` (يتم تطابقه دائمًا، استخدم `<Outlet />` للأبناء).
  - الصفحة الرئيسية: `index.tsx` (المسار: `/`).
  - صفحة "حول": `about.tsx` (المسار: `/about`).
  - يولد ملف `routes.gen.ts` تلقائيًا للأمان النوعي.
- **إعداد الأمان النوعي** (في main.tsx بعد الراوتر):
  ```ts
  declare module '@tanstack/react-router' {
    interface Register { router: typeof router; }
  }
  ```
- **التنقل**:
  - `<Link to="/about" className="active:font-bold">حول</Link>`.
  - تنسيق الرابط النشط: استخدم `data-status="active"` أو `activeProps`.
  - تطابق دقيق: `<Link activeOptions={{ exact: true }} />`.

## 4. التوجيه المتداخل والتخطيطات
- **التوجيه باستخدام المجلدات**:
  - `settings/route.tsx`: تخطيط أب (بدون `/` نهائية، يطابق `/settings/*`).
  - `settings/profile.tsx`: ابن (المسار: `/settings/profile`).
  - استخدم `<Outlet />` في الأب لعرض الأبناء.
- **تخطيطات بدون مسار**: استخدم `_` في بداية الملف/المجلد (مثل `_auth.tsx` لتخطيط مشترك بدون مسار).
- **تجاهل في المسار**: استخدم `_` (مثل `settings_/password.tsx` → `/settings/password`، لكن ليس ابنًا لـ `settings`).
- **تجاهل المجلدات**: استخدم `-` (مثل `-components/` لملفات غير متعلقة بالتوجيه).
- **المجموعات**: استخدم `()` (مثل `(app)/home.tsx` → تنظيم بدون تأثير على المسار).
- **التوجيه المسطح** (بدون مجلدات):
  - استخدم `.` للتداخل: `_auth.about.tsx` (about ابن لـ `_auth`).
  - ديناميكي: `posts.$postId.tsx` (المسار: `/posts/:postId`).
- **مسارات Index**: `index.tsx` (تطابق دقيق، بدون أبناء).

## 5. المسارات الديناميكية والمعاملات
- **معاملات ديناميكية**: استخدم `$` (مثل `posts.$id.tsx` → `/posts/:id`).
- **الوصول للمعاملات**:
  ```ts
  const { id } = route.useParams(); // آمن نوعيًا.
  ```

## 6. تحميل البيانات (Loaders)
- **وظيفة Loader** (في ملف المسار):
  ```ts
  loader: async () => ({ data: await fetch('/api').then(res => res.json()) }),
  ```
- **الوصول للبيانات**: `const data = useLoaderData<typeof route>();`.
- **التبعيات (مثل معاملات البحث)**: استخدم `loaderDeps` لتخزين منفصل.
- **حالة الانتظار**: `pendingComponent: () => <جاري التحميل />`.
- **التدفق**: استخدم `defer` لتحميل جزئي (مثل `<Await promise={deferred.comments} />`).
- **قبل التحميل (Before Load)**: يعمل قبل الـ loader (مثل التحقق من المصادقة، إعادة التوجيه).

## 7. معاملات البحث
- **التحقق** (مثل Zod):
  ```ts
  validateSearch: zodSearchValidator(z.object({ page: z.number().optional() })),
  ```
- **الوصول**: `const { page } = route.useSearch();`.
- **التحديث**: `<Link search={{ page: 2 }} />` أو `navigate({ search: (prev) => ({ ...prev, page: 2 }) })`.

## 8. السياق (Context)
- **توفير السياق**: في الراوتر: `context: { user: null }`.
- **الوصول**: `const { user } = route.useRouteContext();`.

## 9. إعادة التوجيه والتنقل
- **إعادة التوجيه**: `throw redirect({ to: '/login' });` (في beforeLoad/loader).
- **Hook التنقل**: `const navigate = useNavigate(); navigate({ to: '/home' });`.

## 10. التعامل مع الأخطاء
- **مكون الخطأ**: `errorComponent: () => <رسالة خطأ />`.
- **غير موجود**: `notFoundComponent: () => <غير موجود />` أو `throw notFound();`.
- **حدود الالتقاط**: لف المكونات الغير متزامنة: `<CatchBoundary getResetKey={() => 'key'} onCatch={(err) => console.log(err)}><Await ... /></CatchBoundary>`.

## 11. تقسيم الشيفرة والتحميل المسبق
- **التفعيل**: في vite.config.ts: `TanStackRouterVite({ autoCodeSplitting: true })`.
- **التحميل المسبق**: `<Link preload="intent" />` (عند التمرير) أو عام: `defaultPreload: 'intent'`.
- **الخيارات**: `defaultPreloadDelay: 1000` (تأخير التحميل المسبق)، `defaultPreloadStaleTime: 5000` (مدة التخزين).

## 12. التخزين المؤقت
- **الافتراضي**: Stale-While-Revalidate (SWR)، في الذاكرة فقط.
- **الخيارات** (لكل مسار أو عامة):
  - `staleTime: 30000` (مدة اعتبار البيانات حديثة؛ الافتراضي 0).
  - `gcTime: 1800000` (مدة الاحتفاظ بالبيانات؛ الافتراضي 30 دقيقة).
  - `shouldReload: (ctx) => true/false` (تحكم مخصص بإعادة التحميل).
- **إبطال التخزين**: `router.invalidate()` (يعيد تشغيل الـ loaders ويعلّم التخزين كـ stale).

## 13. المصادقة (حماية المسارات)
- **مسار واحد**: في beforeLoad: `if (!ctx.user) throw redirect({ to: '/login' });`.
- **حماية مجموعة**: استخدم تخطيط بدون مسار (`_auth.tsx`) مع beforeLoad/errorComponent.
- **إعادة توجيه تسجيل الدخول**: مرر `search: { redirect: location.href }`؛ عند تسجيل الدخول: `navigate({ to: search.redirect ?? '/' })`.

## 14. ميزات متقدمة
- **أدوات التطوير**: `<TanStackRouterDevtools position="top-right" />` (تصور شجرة المسارات).
- **إخفاء المسارات**: للنوافذ المنبثقة (عرض محتوى بمسار مختلف).
- **منع التنقل**: تحذير عند التغييرات غير المحفوظة.
- **إدارة رأس الصفحة**: إدارة العنوان/البيانات الوصفية لتحسين محركات البحث.
- **مسارات الملفات الافتراضية**: تخصيص اصطلاحات التسمية.

لمزيد من التفاصيل، راجع وثائق Tanstack Router أو الفيديو. استخدم التوجيه القائم على الملفات لسهولة التوسع والأمان النوعي!
