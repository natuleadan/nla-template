## [2.3.0](https://github.com/natuleadan/agents-lite/compare/v2.2.1...v2.3.0) (2026-05-06)

### Features

* **i18n:** add arabic font support for og images ([4611245](https://github.com/natuleadan/agents-lite/commit/46112451950103ef7bd69858cd578108ff3be5ac))
* **i18n:** add arabic ui translations ([a28a211](https://github.com/natuleadan/agents-lite/commit/a28a21121f15557c9f52aa8db88e13df065c6e82))
* **i18n:** add centralized locale config with dynamic direction ([e776995](https://github.com/natuleadan/agents-lite/commit/e7769957140fd1b040bb99e02626a0e4f36e4bac))
* **i18n:** load arabic data in all modules ([c57bc3a](https://github.com/natuleadan/agents-lite/commit/c57bc3a851356fc29a3a43d7f1865f400c1b93b9))

### Bug Fixes

* **i18n:** add countrycodes to hook dependency arrays ([7542f8b](https://github.com/natuleadan/agents-lite/commit/7542f8b1eaef2a4f35be313893f71f38a9a839f8))
* **i18n:** add rtl positioning to cookie banner and nav elements ([1a47f54](https://github.com/natuleadan/agents-lite/commit/1a47f54612209c38a9db1128f7541a60b3843165))
* **i18n:** eliminate direction flash on first load ([4b32d0f](https://github.com/natuleadan/agents-lite/commit/4b32d0f2b1201cc179ff4af689c7a29bbd5e9b42))
* **i18n:** fix regex syntax in layout inline script and refactor webhook to return immediately ([b78e6ec](https://github.com/natuleadan/agents-lite/commit/b78e6ec053befb07cd0391840367707f2f5ae847))
* **i18n:** update locale-hardcoded consumers for arabic support ([56f9d3b](https://github.com/natuleadan/agents-lite/commit/56f9d3b89ec669da34c3c46ca43fefeead78862c))
* **i18n:** use locale-aware brand in footer and contact page ([0bcb2f0](https://github.com/natuleadan/agents-lite/commit/0bcb2f0aa7521ea680f38f379b142bdf5795c1d7))
* **i18n:** use locale-aware brand in json-ld and product metadata ([76caf67](https://github.com/natuleadan/agents-lite/commit/76caf67a51c8916d3e2569a652363740f47271a9))
* **i18n:** use locale-aware brand in sitename and page titles ([91d3be1](https://github.com/natuleadan/agents-lite/commit/91d3be1f1a3d2d20f7cf100b92eba71b50ff93bf))
* **i18n:** use locale-aware brand name in metadata ([def1656](https://github.com/natuleadan/agents-lite/commit/def1656daa3c2621dc2eb9c0fd43dc48d4c83d60))
* **i18n:** use locale-aware config in sidebar breadcrumb and pagination ([b5ec6a9](https://github.com/natuleadan/agents-lite/commit/b5ec6a91c0740b25aa615214f7d834fabc79f845))
* **i18n:** use locale-aware error messages in api routes ([0797844](https://github.com/natuleadan/agents-lite/commit/079784482de6d866dd5cf67cab8f40336bf78547))

### Refactoring

* **env:** extract response helpers and auth to api and internal ([d31e3e6](https://github.com/natuleadan/agents-lite/commit/d31e3e62448a0cad0723547f874b0fbdabbea3f8))

### Chore

* **cleanup:** remove dead code ([d4aef2c](https://github.com/natuleadan/agents-lite/commit/d4aef2c6079a0dcd4f06bc8bb7f7d541cb2b1e31))
* **gitignore:** add ds store ([7cf73c4](https://github.com/natuleadan/agents-lite/commit/7cf73c415b76c3d6a4a88e9a8a62e51732149228))

## [2.2.1](https://github.com/natuleadan/agents-lite/compare/v2.2.0...v2.2.1) (2026-05-05)

### Bug Fixes

* **project:** rename nla references to agents-lite and update readme ([ba693dc](https://github.com/natuleadan/agents-lite/commit/ba693dc77149da19e7d2c0c806de9fa9f69b663f))

### Chore

* **project:** rename package to agents-lite ([c1c84e8](https://github.com/natuleadan/agents-lite/commit/c1c84e85d358d4648e6f18564bb8b59451d1db0d))

## [2.2.0](https://github.com/natuleadan/nla-template/compare/v2.1.2...v2.2.0) (2026-05-05)

### Features

* **cart:** shopping cart with local storage and transformable navbar button ([461d8c5](https://github.com/natuleadan/nla-template/commit/461d8c55340e5278546842909d2c1ddd90233fe5))

### Bug Fixes

* **agents:** harden ssrf validation for ycloud media hostnames ([894bf26](https://github.com/natuleadan/nla-template/commit/894bf26455c4be7e07a348c51c2ce9f224c87c65))
* **agents:** route whatsapp vendor sdk calls through external wrapper ([04b5cd5](https://github.com/natuleadan/nla-template/commit/04b5cd5b22eff0063f4e59c73dfb53d0f6beaf0b))
* **ci:** pin eslint to 9.x to avoid breaking change in 10.x ([ba53006](https://github.com/natuleadan/nla-template/commit/ba53006746e6fc8e07d5cbd9419f9f6fc870b1d3))
* **core:** remove dead code and fix pre-existing bugs ([f7a491e](https://github.com/natuleadan/nla-template/commit/f7a491e67ae2b54d431b698da7fac0f84932db1f))
* **headers:** add missing csp directives, body size limits, and secure cookie flags ([45200fa](https://github.com/natuleadan/nla-template/commit/45200fa9f303d5a9a342b13d1ec37d23495a596c))
* **lint:** remove unused import and variable flagged by codeql ([8873f47](https://github.com/natuleadan/nla-template/commit/8873f47a75c993b5a7c58f104daa297901379e63))
* **ui:** dialog close button i18n and whatsapp dialog not closing ([fb84840](https://github.com/natuleadan/nla-template/commit/fb8484031407211072d346c71436c32b08d5abca))
* **ui:** update design for global consistency ([5f7c90c](https://github.com/natuleadan/nla-template/commit/5f7c90c95dc20310e4a3a857fed19d151599a566))

### Performance

* **api:** add rate limiting to public endpoints and input constraints ([bd11c7a](https://github.com/natuleadan/nla-template/commit/bd11c7a7760ccd8b27d875b429fe56359686b11b))

### Refactoring

* **lib:** reorganize modules into internal, api, hooks and update imports ([8a99cbc](https://github.com/natuleadan/nla-template/commit/8a99cbcca5ad6945bb09a8365b6c7729286cd13b))

### Chore

* **deps-dev:** bump @semantic-release/github from 11.0.6 to 12.0.6 ([#8](https://github.com/natuleadan/nla-template/issues/8)) ([1a71cce](https://github.com/natuleadan/nla-template/commit/1a71cce3e550da5e13e6e1d0c87b6722f28cfbf2))
* **deps-dev:** bump @semantic-release/npm from 12.0.2 to 13.1.5 ([#12](https://github.com/natuleadan/nla-template/issues/12)) ([13abda5](https://github.com/natuleadan/nla-template/commit/13abda5199cb22b3f858f62309b2625929c4f3f1))
* **deps-dev:** bump prettier-plugin-tailwindcss from 0.7.4 to 0.8.0 ([#15](https://github.com/natuleadan/nla-template/issues/15)) ([b713681](https://github.com/natuleadan/nla-template/commit/b71368118c78cc24c3268da19c65f42551f721a3))
* **deps-dev:** bump semantic-release from 24.2.9 to 25.0.3 ([#14](https://github.com/natuleadan/nla-template/issues/14)) ([5f23251](https://github.com/natuleadan/nla-template/commit/5f23251b2a199337a3a0e08060c2e6cd6951e4b5))
* **deps-dev:** bump the eslint group with 2 updates ([#2](https://github.com/natuleadan/nla-template/issues/2)) ([a4e2dbc](https://github.com/natuleadan/nla-template/commit/a4e2dbcfb57418c2268e2b024155acf79b632ba7))
* **deps:** bump @hookform/resolvers from 1.3.8 to 5.2.2 ([#11](https://github.com/natuleadan/nla-template/issues/11)) ([405fad9](https://github.com/natuleadan/nla-template/commit/405fad921bc630422c442737f28668ea06be8275))
* **deps:** bump @scalar/nextjs-api-reference from 0.10.13 to 0.10.14 ([#16](https://github.com/natuleadan/nla-template/issues/16)) ([d218d51](https://github.com/natuleadan/nla-template/commit/d218d51e55e52ea9ecb68a4b877fc2a9dc22c0b7))
* **deps:** bump @vercel/analytics from 1.3.1 to 2.0.1 ([#3](https://github.com/natuleadan/nla-template/issues/3)) ([ad95aa5](https://github.com/natuleadan/nla-template/commit/ad95aa5b64f908144299e9793adf35d08e16c375))
* **deps:** bump actions/setup-node from 6.3.0 to 6.4.0 ([#1](https://github.com/natuleadan/nla-template/issues/1)) ([6e21799](https://github.com/natuleadan/nla-template/commit/6e21799d7f835c71d429217422ac1bdea6a788ec))
* **deps:** bump embla-carousel-react from 8.5.1 to 8.6.0 ([#9](https://github.com/natuleadan/nla-template/issues/9)) ([4db7c31](https://github.com/natuleadan/nla-template/commit/4db7c31354a4231b83a263c69120014145cf4d3b))
* **deps:** bump input-otp from 1.4.1 to 1.4.2 ([#7](https://github.com/natuleadan/nla-template/issues/7)) ([bf49c3d](https://github.com/natuleadan/nla-template/commit/bf49c3d0cf19c2de5a486e2e36da23ac5e4ce00f))
* **deps:** bump next from 16.1.6 to 16.2.4 ([#4](https://github.com/natuleadan/nla-template/issues/4)) ([5bee9aa](https://github.com/natuleadan/nla-template/commit/5bee9aade0a23c5e2bfd114633b315704fe090a3))
* **deps:** bump react-day-picker from 9.8.0 to 9.14.0 ([#6](https://github.com/natuleadan/nla-template/issues/6)) ([281bfb8](https://github.com/natuleadan/nla-template/commit/281bfb8d1bbb49a4aa8f35a3d8bce3288e70fc21))
* **deps:** bump recharts from 2.15.4 to 3.8.1 ([#13](https://github.com/natuleadan/nla-template/issues/13)) ([97466b3](https://github.com/natuleadan/nla-template/commit/97466b3c8ecb6d40659443eb0c69a4c38a20ff8e))
* **deps:** bump sonner from 1.7.4 to 2.0.7 ([#5](https://github.com/natuleadan/nla-template/issues/5)) ([be42207](https://github.com/natuleadan/nla-template/commit/be4220718e451b9d923c58f61f1e4a135b1e1fdb))
* **deps:** bump zod from 3.25.76 to 4.4.3 ([#10](https://github.com/natuleadan/nla-template/issues/10)) ([0d3f453](https://github.com/natuleadan/nla-template/commit/0d3f453dcb02d96ac05a1185053c733e31094a42))
* **deps:** update lockfile after eslint downgrade to 9.x ([07c4ada](https://github.com/natuleadan/nla-template/commit/07c4ada8a86e5eb3420addb4903aec57122f96c5))

### CI/CD

* **deps:** add dependabot config and update dependencies ([2acf965](https://github.com/natuleadan/nla-template/commit/2acf96550c2dfb1ab380c62164af6a3f6a6aae3e))

## [2.1.2](https://github.com/natuleadan/nla-template/compare/v2.1.1...v2.1.2) (2026-05-04)

### Bug Fixes

* **ids:** normalize entity ids to 3-digit zero-padded format ([de2a8c6](https://github.com/natuleadan/nla-template/commit/de2a8c68987d42c598ff768a1cdccbe485daf974))
* **store:** redesign product page layout, inventory ui, and gallery aspect ratio ([a780bfb](https://github.com/natuleadan/nla-template/commit/a780bfb85768b4718803013b625cda0a2214e950))
* **ui:** add i18n to attachments, normalize header icon sizing ([c78835e](https://github.com/natuleadan/nla-template/commit/c78835e8980ff6db33c367b8413c2f03fc5c8403))

## [2.1.1](https://github.com/natuleadan/nla-template/compare/v2.1.0...v2.1.1) (2026-05-04)

### Bug Fixes

* **seo:** remove redundant routes.ts and simplify sitemap config ([1967af0](https://github.com/natuleadan/nla-template/commit/1967af0b5fdc7c301ecbad9455fe66dd1a7866b6))

## [2.1.0](https://github.com/natuleadan/nla-template/compare/v2.0.3...v2.1.0) (2026-05-04)

### Features

* **blog:** add downloadable attachments, rename blog to news, fix lang switcher and svg config ([4e91b5a](https://github.com/natuleadan/nla-template/commit/4e91b5ad3d3d4bfa480b4a3ae77361d2724f134a))
* **certificates:** add certificate search module with webhook verification, rate limiting, and i18n ([a53ee8b](https://github.com/natuleadan/nla-template/commit/a53ee8bacfbd34d617d5c291efb5f9348fb8ef00))
* **pages:** add downloadable attachments to legal pages with responsive 3-column layout ([a9937d7](https://github.com/natuleadan/nla-template/commit/a9937d701f1e7b65f59a4260f7e049db85b10147))
* **store:** add downloadable attachments to products ([0f4cd02](https://github.com/natuleadan/nla-template/commit/0f4cd0245da9345da3d07c079fba8addb93f0f56))

### Bug Fixes

* **seo:** remove duplicate sitemap entries and add autocomplete to email field ([ffd8cac](https://github.com/natuleadan/nla-template/commit/ffd8cacfcf051fa122141deb46c1558312202508))

## [2.0.3](https://github.com/natuleadan/nla-template/compare/v2.0.2...v2.0.3) (2026-05-04)

### Bug Fixes

* **ui:** replace nla palette with default and add brand color validation ([8bfbba9](https://github.com/natuleadan/nla-template/commit/8bfbba9e11af1ffe3dfe790848c57bf5346b683f))

## [2.0.2](https://github.com/natuleadan/nla-template/compare/v2.0.1...v2.0.2) (2026-05-04)

### Bug Fixes

* **security:** remove unused anonymizephone and isderived imports ([e90ed17](https://github.com/natuleadan/nla-template/commit/e90ed1774842b9cb05a2a18bd4e51e115840259f))

## [2.0.1](https://github.com/natuleadan/nla-template/compare/v2.0.0...v2.0.1) (2026-05-04)

### Bug Fixes

* **security:** remove unused variable and import codeql alerts ([5abe5e2](https://github.com/natuleadan/nla-template/commit/5abe5e21704cbc363a0cea6c7d3fefca683306d1))

## [2.0.0](https://github.com/natuleadan/nla-template/compare/v1.5.0...v2.0.0) (2026-05-04)

### ⚠ BREAKING CHANGES

* **modules:** all public URLs are now in english.

- /tienda/*  -> /store/*
- /blog/*    -> /news/*
- /paginas/* -> /pages/*
- /contacto  -> /contact
- /agenda    -> /schedule

### Upgrade

* **modules:** rename public routes from spanish to english ([9125d44](https://github.com/natuleadan/nla-template/commit/9125d443a7511d70dc72ebe9778bfcae47b9969a))

### Features

* **agent:** refine system prompt with derive rules and conditional first-time intro ([bdaa8e9](https://github.com/natuleadan/nla-template/commit/bdaa8e9d4a4999273942d2a72e420a5d03020258))
* **api:** add zod validation, configurable rate limit, and migrate whatsapp to server action ([7e52b34](https://github.com/natuleadan/nla-template/commit/7e52b34ac53277ba746ce4327951de6cc6001c3e))
* **i18n:** add english data files for products, blog, pages, brand, reviews, comments ([55d9750](https://github.com/natuleadan/nla-template/commit/55d97505cec6928465ebd9226b6f6360782a5c0a))
* **i18n:** add english site config and remaining data files ([35fde2b](https://github.com/natuleadan/nla-template/commit/35fde2b8d42b258070b8da36a488e1fed7a61745))
* **i18n:** add lang-switcher, bilingual sitemap, robots, llms, root og fallback ([27922ee](https://github.com/natuleadan/nla-template/commit/27922eeb460165f2325bd559605bfc10f3294253))
* **localize:** cross-locale slug resolution for lang switcher and seo ([ecde6fd](https://github.com/natuleadan/nla-template/commit/ecde6fda17bc69eff246cb7083a5c27c3e9850fc))
* **orders:** add order detail page with partial prerendering and gps map ([56dfbd3](https://github.com/natuleadan/nla-template/commit/56dfbd35f986e8cbe876f7984257edfe00bc09bf))
* **security:** add content security policy, timing-safe auth, and xss prevention ([c63c481](https://github.com/natuleadan/nla-template/commit/c63c48165ea65b7805505f784396eb934f899382))
* **ui:** blog post featured image on left side with wider content on desktop ([91c8067](https://github.com/natuleadan/nla-template/commit/91c8067f9f2d8e88b4d17981739fd6f2c53ecf3c))
* **whatsapp:** add phone cookie system with 15min ttl and auto-fill ([a5a9cb8](https://github.com/natuleadan/nla-template/commit/a5a9cb865337d5e4895fb0f185830829ff40cee6))

### Bug Fixes

* **agent:** fix system prompt contradictions, add admin isolation tools ([2214afb](https://github.com/natuleadan/nla-template/commit/2214afbf43d3c1dcc2d4f2608f04c17a9100bfdf))
* **agent:** no general knowledge, strict action vs info distinction, terminal derive ([81e11ab](https://github.com/natuleadan/nla-template/commit/81e11aba91a9538f7e5805c33a20f2922ab3b6eb))
* **agent:** precargar shipping info, post-delete no references, action vs info examples ([3bb7929](https://github.com/natuleadan/nla-template/commit/3bb7929f249f6980b706cf40a2e9b482bee8331e))
* **agent:** strengthen derive rules - immediate, terminal, no fake offers ([faf4a17](https://github.com/natuleadan/nla-template/commit/faf4a1747d594a2e3513271b5438c58b26626ef0))
* **agent:** stronger prompt for shipping/action distinction, admin tools tested ([cd8c5b0](https://github.com/natuleadan/nla-template/commit/cd8c5b05d9e4e08228a8c37a04a3e87e4d05824c))
* **analytics:** enforce cookie consent before sending data ([3382994](https://github.com/natuleadan/nla-template/commit/3382994b3aa1d8b1f3860feae9de0a95fcc7f1be))
* **analytics:** render only in production environment ([566e63e](https://github.com/natuleadan/nla-template/commit/566e63e73e17f1313f67b887a08c2bebc8dc5ed1))
* **api:** add auth to post/put/delete endpoints, add order pre-creation in chat ([e716c21](https://github.com/natuleadan/nla-template/commit/e716c211c3bebcf31da319323e76a854ec00deb4))
* **api:** add pagination to products get endpoint ([5b869dc](https://github.com/natuleadan/nla-template/commit/5b869dc85fdb4b262bfdbbbc15259f2ad42f0a37))
* **api:** update rate limit message on whatsapp send ([8477539](https://github.com/natuleadan/nla-template/commit/847753921ca1b4206211d4a391fc4824275571c1))
* **brand:** remove unused whatsapp product id config keys ([6efa2f3](https://github.com/natuleadan/nla-template/commit/6efa2f351a68c07482b28c29dd240d0b68db1e49))
* **components:** add dialog service, cookie webhook, and clean up notification imports ([cdd35ad](https://github.com/natuleadan/nla-template/commit/cdd35ad0c6efad22520403f23c55efc894e3681c))
* **deps:** replace lucide-react with @tabler/icons-react ([8194d88](https://github.com/natuleadan/nla-template/commit/8194d884c591210494111831bfadb72c5306dbc6))
* **i18n:** add locale support to api routes, manifest, and remaining modules ([30881e7](https://github.com/natuleadan/nla-template/commit/30881e7203943cb01d8e117f06c0a849dbc1e5ec))
* **i18n:** localize all hardcoded strings in api routes, og images, metadata, and configs ([0d05006](https://github.com/natuleadan/nla-template/commit/0d050063ecdbcef2089b796d70e94d8b5d202dcd))
* **localize:** add locale prefix to sitemap, ui components, and json-ld ([d6ce466](https://github.com/natuleadan/nla-template/commit/d6ce466124ee7886c9c088f5f68eee0537768dd7))
* **localize:** locale-aware og and twitter images for all routes ([071c8e0](https://github.com/natuleadan/nla-template/commit/071c8e0decae8f6b7e7c6dccc15d2714d7531c83))
* **nav:** add dropdown type to nav items and wire navdropdown in navbar ([8dc2295](https://github.com/natuleadan/nla-template/commit/8dc22951fb71ecb4d2ef438d8e06415aed6dc435))
* **orders:** add in-memory fallback for createbusorder ([39eb34d](https://github.com/natuleadan/nla-template/commit/39eb34d6528ebf97c5f767e16c0e5816b3d51c41))
* **redis:** add hashgetall type coercion for numeric fields ([4ce7d0a](https://github.com/natuleadan/nla-template/commit/4ce7d0a4abbadba0313b20f30748fcae41baf560))
* **scalar:** resolve openapi type errors and delete legacy paths ([77928ea](https://github.com/natuleadan/nla-template/commit/77928ea3bd7cbbfc6e47fe0639d0133e4a47aa28))
* **scalar:** update product and order openapi schemas ([6d4fc4a](https://github.com/natuleadan/nla-template/commit/6d4fc4a62f3b86256ddf2e290ce25723e5cbad5b))
* **schema:** consolidate comment and review status to pending|approved ([0767bf4](https://github.com/natuleadan/nla-template/commit/0767bf4d8414f4328510a9504b1e99d75ee0fa0c))
* **schemas:** add zod validation for seed data modules ([7d411ec](https://github.com/natuleadan/nla-template/commit/7d411ecc96d80819bafff2c01a768dba64ee1ab6))
* **security:** address codeql alerts for ssrf, log injection, and password hash ([2e1b4a2](https://github.com/natuleadan/nla-template/commit/2e1b4a23324e3488517b4c65415b8513b1b25be2))
* **seo:** add inlanguage and dynamic currency to product jsonld, change blogposting to article ([dd8368e](https://github.com/natuleadan/nla-template/commit/dd8368e2584e3fe65341cda7673e05d8f71c7590))
* **seo:** remove redundant bare locale allow rule from robots ([3413e78](https://github.com/natuleadan/nla-template/commit/3413e78df6e7c199f3369957196877e12228f093))
* **types:** resolve typecheck errors across components and modules ([4134d6f](https://github.com/natuleadan/nla-template/commit/4134d6ff049c1aa74257265b9147b985942405a7))
* **ui:** convert lang switcher and theme toggle to dropdown menus ([c0e234e](https://github.com/natuleadan/nla-template/commit/c0e234eb33efb44e882b60764fd1a4c29d78650f))
* **ui:** localize hardcoded sidebar labels in mobile menu ([343b3a4](https://github.com/natuleadan/nla-template/commit/343b3a45974e38cab4dbc21ccc2c22738bcd2f0e))
* **whatsapp:** move typing indicator after media processing ([37d56ca](https://github.com/natuleadan/nla-template/commit/37d56ca0f89da58e51d21b13fbb08b677c8614d0))

### Documentation

* **i18n:** add complete english translation of paginas data policy pages ([a38efcd](https://github.com/natuleadan/nla-template/commit/a38efcd4453f9e21b94dc5bf5a73feb3c57162dd))
* **readme:** update endpoints, tools table, env vars, test count ([ca56d87](https://github.com/natuleadan/nla-template/commit/ca56d8764a64ef269956619c5b33343a740a1327))
* **readme:** update tool count, test count and add phone cookie feature ([53c64b3](https://github.com/natuleadan/nla-template/commit/53c64b36d39b0d3b5bd6ca47929aae0ba1d07970))

### Refactoring

* **agent:** strip redis to only session/memory/rate/derived, remove all crud tools ([e375eaa](https://github.com/natuleadan/nla-template/commit/e375eaa71bb8f1bc8348b12e278eebb065b7354d))
* **api:** remove all dynamic data endpoints ([523b486](https://github.com/natuleadan/nla-template/commit/523b486d84612e6cc49650cc764ea6987307ea98))
* **i18n:** add langprovider, getconfig, proxy locale detection, and barrel files ([7128867](https://github.com/natuleadan/nla-template/commit/71288670868868af08901d065ba058c19a01fd57))
* **i18n:** add locale prop to json-ld components ([e5dd4e3](https://github.com/natuleadan/nla-template/commit/e5dd4e3649ecdce4071816362d0f02cb33117140))
* **i18n:** migrate all pages to [lang] with locale-aware metadata and alternates ([994dc0c](https://github.com/natuleadan/nla-template/commit/994dc0c18aedd358b87eadc2be84730f18d36131))
* **i18n:** remove deprecated ordenes module ([9f6f530](https://github.com/natuleadan/nla-template/commit/9f6f530197c22d2fafaa3606ac595a246b489fe8))
* **i18n:** rename data files from .ts to .es.ts for barrel ([97d59ad](https://github.com/natuleadan/nla-template/commit/97d59ad94583471af083cb91e991752899b8a4c2))
* **i18n:** update all components to uselang and getconfig ([cef061a](https://github.com/natuleadan/nla-template/commit/cef061adecbb1d13cadeb825cfbba63a84a835ba))
* **template:** acme-generic branding, office products, readme cleanup ([cf4603f](https://github.com/natuleadan/nla-template/commit/cf4603f9126f0626e0e2f42037f24481c2985930))

### Tests

* **i18n:** add anti-regression test for hardcoded locale patterns ([d7d8c7c](https://github.com/natuleadan/nla-template/commit/d7d8c7c494bd3ddaec094c1a7948e18d5025f971))

### Chore

* **config:** add .nvmrc and update node engine ([d30fc04](https://github.com/natuleadan/nla-template/commit/d30fc04cc6ecd8cfe3547c84d30fd33e01e60118))
* **config:** update env.example, readme, add anti-regression test ([6b48e20](https://github.com/natuleadan/nla-template/commit/6b48e20bd3d36151789a83d9ccfecc57ee801291))
* **deps:** install missing ui dependencies ([ffeef48](https://github.com/natuleadan/nla-template/commit/ffeef489dc5f87d74520ce1b40321085cf27d88f))
* **format:** apply prettier formatting to all files ([2c281a0](https://github.com/natuleadan/nla-template/commit/2c281a005b7755b64166c014d21ac8b81765a2e8))
* **upstash:** rename redis.ts to client.ts and ratelimit.ts to ratelimit.service.ts ([075cf76](https://github.com/natuleadan/nla-template/commit/075cf76b2808f4ef3679752fd48d274883e9140e))

## [1.5.0](https://github.com/natuleadan/nla-template/compare/v1.4.1...v1.5.0) (2026-04-28)

### Features

* **ai:** add multimodal support with provider switch, image/pdf analysis and chat endpoint ([0c1a1bd](https://github.com/natuleadan/nla-template/commit/0c1a1bdbe3e97ed55f14a695efec2a7366b3dcb8))
* **ai:** add zero data retention support ([1a92da2](https://github.com/natuleadan/nla-template/commit/1a92da24ee52baf5ea54001af2fb7c81fb2b627a))

### Bug Fixes

* **agents:** hash redis keys with hmac-sha256 ([2067bf0](https://github.com/natuleadan/nla-template/commit/2067bf06fdbbc3747b518c66683548dcea1bd429))
* **agents:** rewrite agent loop with streamtext+stopwhen ([7978ade](https://github.com/natuleadan/nla-template/commit/7978ade901ac9d4dfa032aebb572922d870b028f))
* **ai:** use openai transcription directly instead of gateway, remove strict from tools ([a62c40a](https://github.com/natuleadan/nla-template/commit/a62c40aba80aee2e6dbae4f374cdbedad3cc670a))

### Chore

* **config:** add ai_provider env var and update documentation ([98d3ee0](https://github.com/natuleadan/nla-template/commit/98d3ee07d086f9d62a968dfab0a549f577845c20))

## [1.4.1](https://github.com/natuleadan/nla-template/compare/v1.4.0...v1.4.1) (2026-04-28)

### Bug Fixes

* **whatsapp:** do not expose ycloud 403 status to client ([420d11b](https://github.com/natuleadan/nla-template/commit/420d11b8f6f56858593f83fc2700e5a310f60dd3))
* **whatsapp:** force node 22.x to avoid url.parse deprecation in node 24 ([3f2b431](https://github.com/natuleadan/nla-template/commit/3f2b4319f38ba90be344da8810af72ac7e82a743))
* **whatsapp:** resolve type errors, async signature, and gateway fallback ([b1d34a9](https://github.com/natuleadan/nla-template/commit/b1d34a9963c9e88efbc7f9756629fd839a15b54d))

## [1.4.0](https://github.com/natuleadan/nla-template/compare/v1.3.3...v1.4.0) (2026-04-28)

### Features

* **whatsapp:** add store-to-client messaging with dialog and per-country validation ([8be1ed1](https://github.com/natuleadan/nla-template/commit/8be1ed159a1fef13d06e59c1bae2e8a4f120bc7c))
* **whatsapp:** add ycloud inbound webhook with ai agent and upstash redis ([4db81db](https://github.com/natuleadan/nla-template/commit/4db81dbfe520cc2173269bda67db3b4e5d800f62))

### Bug Fixes

* **whatsapp:** improve dialog ux, add per-country validation, move hardcoded texts to config ([31baace](https://github.com/natuleadan/nla-template/commit/31baace0b8c43dba8f038da93e30cb12f04b2b2b))

## [1.3.3](https://github.com/natuleadan/nla-template/compare/v1.3.2...v1.3.3) (2026-04-27)

### Bug Fixes

* **blog:** replace isomorphic-dompurify with xss to fix jsdom esm error ([228e57e](https://github.com/natuleadan/nla-template/commit/228e57ea31b1cfbd768e0b79bc2821c985135013))

## [1.3.2](https://github.com/natuleadan/nla-template/compare/v1.3.1...v1.3.2) (2026-04-27)

### Bug Fixes

* **env:** wrap dev console logs in isdev guard ([8954ad1](https://github.com/natuleadan/nla-template/commit/8954ad1ce285a8745bb4154a3d4dde7a9956a69a))

### Refactoring

* **env:** add vercel constants and conditionally render analytics ([c3b38cd](https://github.com/natuleadan/nla-template/commit/c3b38cd64678100326c9348d5819e42082f3ae95))

### Tests

* **env:** add isdev guard validation and agents.md link ([3f19958](https://github.com/natuleadan/nla-template/commit/3f19958afe82ddab7a74607736827ba09835ba20))

## [1.3.1](https://github.com/natuleadan/nla-template/compare/v1.3.0...v1.3.1) (2026-04-27)

### Bug Fixes

* **codeql:** resolve unused imports and xss warnings ([0370b04](https://github.com/natuleadan/nla-template/commit/0370b04b10eaea197b6be13f57c74f09068afbf0))

## [1.3.0](https://github.com/natuleadan/nla-template/compare/v1.2.0...v1.3.0) (2026-04-27)

### Features

* **contact:** submit form via whatsapp with api fallback ([0167d7a](https://github.com/natuleadan/nla-template/commit/0167d7a4f3ba7aa88b1a096d97eb0e26cbbbdba8))
* **nav:** add icon-only tablet nav with hover tooltips ([e037aa3](https://github.com/natuleadan/nla-template/commit/e037aa372f3ca9a23613425d67145a898fde60bd))
* **nav:** add icons to menu items, fix mobile accordion navigation ([fbd5ad9](https://github.com/natuleadan/nla-template/commit/fbd5ad939806c4bb720ef1a69d1c93eda70e0bcc))
* **nav:** compact tablet nav with hover-to-reveal labels and dropdowns ([6030ff1](https://github.com/natuleadan/nla-template/commit/6030ff15cbfd4dcebb1a69a6192952d5e21ff7a6))

### Bug Fixes

* **ui:** add toolbar skeletons to list pages, center blog detail layout ([b659426](https://github.com/natuleadan/nla-template/commit/b659426c691c6faebe9fb3dfba5e3897d9555b97))
* **ui:** og images for paginas slug, aligned skeletons, image counter ([1ff1ee5](https://github.com/natuleadan/nla-template/commit/1ff1ee5f793b2d85271a26cadb3229aa9bd087a0))

### Refactoring

* **config:** separate data from ui translations, move all hardcoded strings to config ([3495cb8](https://github.com/natuleadan/nla-template/commit/3495cb8e2c440ced178d96c1dd9cb638771b9a89))

## [1.2.0](https://github.com/natuleadan/nla-template/compare/v1.1.3...v1.2.0) (2026-04-27)

### Features

* **blog:** add comment system with whatsapp submission ([5bdbcdf](https://github.com/natuleadan/nla-template/commit/5bdbcdf756667c4656bc7ecd7da8dc41fb67e878))
* **skeletons:** add dedicated skeleton components for all loading states ([4d517ca](https://github.com/natuleadan/nla-template/commit/4d517cabee4e4880f909de3192984328eb5df52f))

### Bug Fixes

* **agenda:** dialog state sync, auto-open from url, full date in slots ([05645c9](https://github.com/natuleadan/nla-template/commit/05645c99cc67337be2618250678463c2a9b99263))
* **jsonld:** comply with google structured data standards ([73fab41](https://github.com/natuleadan/nla-template/commit/73fab41d7ef01338623f066d816576f527aca304))
* **seo:** metadata separator |, agenda count total, anonymize product names ([737bed6](https://github.com/natuleadan/nla-template/commit/737bed6dd72ecddd8fa0ad6e5e5f4666d208ccf0))
* **ui:** footer agenda format, empty state for header and footer ([ce32627](https://github.com/natuleadan/nla-template/commit/ce326270f2b1368310a50997a52e62c4645a82b5))
* **ui:** reduce footer spacing and fix cookie banner mobile layout ([6cf10f7](https://github.com/natuleadan/nla-template/commit/6cf10f734aceef9f742b985cf7e871ef1c15cc15))

### Refactoring

* **config:** remove 39 dead translation keys ([3e59d18](https://github.com/natuleadan/nla-template/commit/3e59d182840cbeccde315868b68e45f234222bc1))
* **products:** 16 products with type/appointment and agenda button ([2f941ae](https://github.com/natuleadan/nla-template/commit/2f941ae6c2a6f74cea1c0b0ae323f8b70056aee1))
* **reviews:** submit via whatsapp with pending status ([33aecdb](https://github.com/natuleadan/nla-template/commit/33aecdb679fd521f92ee20631403a190618816b0))

### Tests

* **config:** validate all translation keys in both directions ([96579c1](https://github.com/natuleadan/nla-template/commit/96579c1b8c695f2c8359a34b33f9c13165447100))

## [1.1.3](https://github.com/natuleadan/nla-template/compare/v1.1.2...v1.1.3) (2026-04-26)

### Bug Fixes

* **agenda:** limit cmd+k to 5 slots, add type tooltip on slots ([52d7db7](https://github.com/natuleadan/nla-template/commit/52d7db7729f205dba236353ed450dc4da733d7e7))
* **agenda:** show upcoming slots with day number in nav dropdown ([b2ffa48](https://github.com/natuleadan/nla-template/commit/b2ffa484dfb05753342bd8dab44345cc0088b380))
* **agenda:** sync slot state with props on late mount ([f7e9aa1](https://github.com/natuleadan/nla-template/commit/f7e9aa1efc8c01ee790319cecb18d6ee8683e8c7))
* **deploy:** exclude jsdom from server bundle for vercel ([6405801](https://github.com/natuleadan/nla-template/commit/64058011e02a1233a7c23f34c7ccf86aae6dc1da))
* **deploy:** load isomorphic-dompurify only on client to avoid jsdom on server ([0dcacbc](https://github.com/natuleadan/nla-template/commit/0dcacbc13c7bfcc61941d08f79ab964ddca9f251))
* **header:** use min-w-max for desktop dropdown width ([8094a4f](https://github.com/natuleadan/nla-template/commit/8094a4f171ac26c66b62cd04c03fe608825c1bd9))

### Refactoring

* **agenda:** centralize utils, type-first dialog, fix cmd+k ([274663a](https://github.com/natuleadan/nla-template/commit/274663a408a847e0b47b683076a650ff4832c114))
* **agenda:** hover reveal type with color variants, remove tooltip ([3226dd3](https://github.com/natuleadan/nla-template/commit/3226dd3017e876fe759b21c7a69634391b9ca9b3))
* **footer:** dynamic columns with social env vars and agenda fallback ([1501275](https://github.com/natuleadan/nla-template/commit/1501275e884eb7f592026814db6326730a884cca))
* **seo:** normalize og metadata across all pages ([1af107e](https://github.com/natuleadan/nla-template/commit/1af107ef755433d96a25aa6285cdd97d92cc53c0))

## [1.1.2](https://github.com/natuleadan/nla-template/compare/v1.1.1...v1.1.2) (2026-04-26)

### Bug Fixes

* **layout:** use generate metadata for robots ([3880236](https://github.com/natuleadan/nla-template/commit/38802366afeba61e4e97d7d691f079392d62cefd))

## [1.1.1](https://github.com/natuleadan/nla-template/compare/v1.1.0...v1.1.1) (2026-04-26)

### Bug Fixes

* **codeql:** resolve xss and unused variable alerts ([0494d84](https://github.com/natuleadan/nla-template/commit/0494d849e897f815e1a23b66836de8f4c640554f))

### Refactoring

* **project:** restructure with src/ directory, split env public/private, add cors proxy ([510becb](https://github.com/natuleadan/nla-template/commit/510becb5ac2923e6f7bf1fec8b3bdb261dbd2923))

## [1.1.0](https://github.com/natuleadan/nla-template/compare/v1.0.1...v1.1.0) (2026-04-26)

### Features

* **accessibility:** add aria attributes and skip-to-content link ([046e70f](https://github.com/natuleadan/nla-template/commit/046e70ffdc13ca6404a519ec9aae009bbe64d08f))
* **agenda:** add agenda module with weekly calendar, global search, and dark mode toggle ([aed70cf](https://github.com/natuleadan/nla-template/commit/aed70cf456ba9e2f8d76a21918849301b3f1c998))
* **agenda:** add current time badge with live clock ([532d391](https://github.com/natuleadan/nla-template/commit/532d39123dc31e20d6510648fd3d51a5f3af3a4b))
* **agenda:** filter expired slots and add week max limit ([a039c5f](https://github.com/natuleadan/nla-template/commit/a039c5f14777186b69f5eb664bb3f6195f2d95f2))
* **blog:** add complete blog module with api, metadata, and ui components ([f727fe8](https://github.com/natuleadan/nla-template/commit/f727fe869016f7459529c3ea3c6aa5f77fa639c3))
* **blog:** enrich nutrition post with full typography demo content ([f27bbcd](https://github.com/natuleadan/nla-template/commit/f27bbcd3edd1d7f77f2546f0014327a6d2c9fd39))
* **config:** extract all hardcoded data into lib/config ([f7f47d7](https://github.com/natuleadan/nla-template/commit/f7f47d7f15c13f79fdecebcba5bc671279856d66))
* **paginas:** add paginas module with list/detail pages and remove old static pages ([134153a](https://github.com/natuleadan/nla-template/commit/134153a18e24012dcf696242ca9175bfee227f58))
* **seo:** add dynamic og and twitter images for all pages ([ab9e5ae](https://github.com/natuleadan/nla-template/commit/ab9e5ae0a6449d200c1cb2cae83898b8b5324053))
* **seo:** add json-ld structured data components ([841c0c7](https://github.com/natuleadan/nla-template/commit/841c0c7173f44a90623466ee70cae8e46189bc8c))
* **seo:** add metadata and json-ld references to all pages ([2cf5c6d](https://github.com/natuleadan/nla-template/commit/2cf5c6deb519635cfbe6975f552d3f768f4d2d71))
* **seo:** add robots, sitemap, manifest, llms, and icons ([c7583fc](https://github.com/natuleadan/nla-template/commit/c7583fc49aeca8433e281bec177ae3e0de23af29))
* **ui:** add email share with contextual info ([2d0b46a](https://github.com/natuleadan/nla-template/commit/2d0b46a4058820e968331a601f27a4a0b11e5db4))
* **ui:** add pages to global search ([584cf02](https://github.com/natuleadan/nla-template/commit/584cf02bd99caa8af5206cbca03098b684c257e1))
* **ui:** add social media share buttons to share dialog ([aefc6ee](https://github.com/natuleadan/nla-template/commit/aefc6ee8a2b308a2ae5701eb2db0b68069ea8d45))
* **ui:** add typography and prose components, fix mobile detail layout ([f95a668](https://github.com/natuleadan/nla-template/commit/f95a6683de727809747044765d1fb5b1d2c8c471))

### Bug Fixes

* **design:** add copyright client component and og background svg ([36c793a](https://github.com/natuleadan/nla-template/commit/36c793ad08f2ee617b130cc9aee660253ccc1007))
* **design:** og images, footer, cookie banner, and theme ([49a0733](https://github.com/natuleadan/nla-template/commit/49a07335358b41bb18131f18b7d43dac464fdbb4))
* **design:** responsive product cards, grid, buttons and ui ([8d41e5b](https://github.com/natuleadan/nla-template/commit/8d41e5beddb89cf61365aa41229f6be6e291971e))
* **env:** replace hardcoded localhost urls with getbaseurl ([4ad57b0](https://github.com/natuleadan/nla-template/commit/4ad57b097274e98e7d022ae6cbb6d38af9812759))
* **responsive:** mobile hamburger menu, touch targets, grid cols, and sheet a11y ([000269e](https://github.com/natuleadan/nla-template/commit/000269eb9ae197807b5e15b9d7b534acf271a8f7))
* **ui:** add className prop to page-header and use it in product details ([9f386d8](https://github.com/natuleadan/nla-template/commit/9f386d85bfe50020ebd1aba2003538acf2b2b0c2))
* **ui:** mobile header icon order ([08b36e5](https://github.com/natuleadan/nla-template/commit/08b36e5613273ad0ec29f4711c7ca5623ba95c15))
* **ui:** move search and theme toggle to mobile header row, remove whatsapp outline border ([f51698c](https://github.com/natuleadan/nla-template/commit/f51698c9a61372ee4c946be06945224bcc41fedd))
* **ui:** responsive agenda grid and tablet nav ([9b769fa](https://github.com/natuleadan/nla-template/commit/9b769fac6b2b85f6dfbeca19575bfcf0fb79a29e))

### Documentation

* **readme:** add week max env var ([b720eb3](https://github.com/natuleadan/nla-template/commit/b720eb326fb26538b9f36412361df45daf5aa9f5))
* **readme:** update with pages module, accessibility, global search, and new ui components ([876029d](https://github.com/natuleadan/nla-template/commit/876029d89a9fd74d8545c2936889ff70b5b38527))

### Chore

* **deps:** add schema-dts dependency ([af917ae](https://github.com/natuleadan/nla-template/commit/af917ae50b9e81cdd1ed93efbbfa1a9f1da17ac3))
* **env:** add env example and update package json ([52242ee](https://github.com/natuleadan/nla-template/commit/52242ee1810b937e14579bba08206547e4294617))
* **format:** format entire codebase with prettier ([d3ddfc0](https://github.com/natuleadan/nla-template/commit/d3ddfc0a2a8f3c4f28d3fb979d54c0896095e329))
* **format:** format footer and cookie-banner with prettier ([4b37fdd](https://github.com/natuleadan/nla-template/commit/4b37fdd302e0d084871538f6e2426572dbf0e452))

## [1.0.1](https://github.com/natuleadan/nla-template/compare/v1.0.0...v1.0.1) (2026-04-25)

### Bug Fixes

* **core:** remove unused imports and add prototype pollution protection ([8813e89](https://github.com/natuleadan/nla-template/commit/8813e899e8b12ed43e4641d42781708e9859d61c))
* **core:** remove unused imports in product-details and products route ([fc603c5](https://github.com/natuleadan/nla-template/commit/fc603c56ad928ff2a4c21c091ac6a6ad7f1b4bd6))
* **core:** restore createreview and inventoryitem imports in product-details ([1392bf8](https://github.com/natuleadan/nla-template/commit/1392bf8f6be6effdb7fbf8bf0b1e2505c50d4073))
* **security:** use map instead of object to prevent prototype pollution ([21e61b4](https://github.com/natuleadan/nla-template/commit/21e61b44a882af224d87cc00c087b83d0b21e5f6))

## 1.0.0 (2026-04-25)

### Features

* **core:** initial commit ([988d390](https://github.com/natuleadan/nla-template/commit/988d390cf34d5007e92ba0130d76fef6cd4016ef))
