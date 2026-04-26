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
