if(!self.define){let e,s={};const t=(t,a)=>(t=new URL(t+".js",a).href,s[t]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=t,e.onload=s,document.head.appendChild(e)}else e=t,importScripts(t),s()})).then((()=>{let e=s[t];if(!e)throw new Error(`Module ${t} didn’t register its module`);return e})));self.define=(a,c)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let i={};const l=e=>t(e,n),r={module:{uri:n},exports:i,require:l};s[n]=Promise.all(a.map((e=>r[e]||l(e)))).then((e=>(c(...e),i)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"0c6afc0d3248be7070b4fcbe4d654ae8"},{url:"/_next/static/0OJWLIvU7H2ctWqKllIzR/_buildManifest.js",revision:"0d0fdf879423f966061ad4cb0a82d74c"},{url:"/_next/static/0OJWLIvU7H2ctWqKllIzR/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/0e5ce63c-29f8578a1c2023c4.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/1242-00459a528beaf75f.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/1345-4c7a6495ebef89e2.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/13b76428-250fb8d199f8d754.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/1493-1a7f48c8b4e49eae.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/1517-a9ea2c217e59671f.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/2229-7d24979651895eaa.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/2466-af984b3f3f0a9950.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/2626716e-8f1f8b6d0da3a191.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/2889-4ded84a388625e88.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/2895-77e88a2e0d5f928f.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/3362-da7c91bd4466383f.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/4133-80b3285041cc7798.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/4544-5f2d185beb2deed6.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/4604-0148fcb39790d4f1.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/4630-187242a5900c4b4a.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/4928-dd058c58c27e0faf.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/4bd1b696-bc2143f8e12b224e.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/5161-b9a6b970835c2648.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/5290-e9692e2e17e8e688.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/5631.7d455267ab9c0971.js",revision:"7d455267ab9c0971"},{url:"/_next/static/chunks/6294-8d15b91ec50cbefc.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/7518-fc7e3565311470d4.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/7756-69424c75a752edbc.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/814-aec0b3418a464a5a.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/8173-e7a5120a8c9726e4.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/8293-11e4f4c394edbcff.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/8450-ef05ad10879ccaa1.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/9184-6079776b94f9115a.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/a6eb9415-cb40667f2ab0f39a.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/(auth)/(signin)/page-1eb73e3ba227f13c.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/_not-found/page-117fb47aec6d87a0.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/api/annualLeave/create/route-2ea4df55227f6fbc.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/api/annualLeave/getTaskCount/route-149116b4bacc09b0.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/api/annualLeave/list/route-1ea05f3b4a5166c3.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/api/annualLeave/listByMonth/route-5a782d179141f051.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/api/annualLeave/update/route-1c5db49d4e1a034b.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/api/annualLeave/updateStatus/route-2c0b545cc63dc5fa.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/api/auth/%5B...nextauth%5D/route-30bd77186f181e39.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/api/auth/login/route-8d562cb72c9bd8a1.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/api/auth/route-9f7dcc37bfebaa7f.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/api/employee/create/route-a8f0e8aac02cd7e6.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/api/employee/info/%5BemployeeId%5D/route-e5d50fbe8e446101.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/api/employee/list/route-83bb7bff9f094531.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/api/employee/update/route-e8d10f027bca7720.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/api/site/departments/route-1f885e013eddbc3d.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/dashboard/annualleave/create/page-ba72bb22e2be51e3.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/dashboard/annualleave/page-2eae89cf84579f49.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/dashboard/calendar/page-2c24dac7e724e442.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/dashboard/employee/%5BemployeeId%5D/annualleave/manage/page-5e02e71f45439ac9.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/dashboard/employee/%5BemployeeId%5D/annualleave/page-92a56a0338ea7821.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/dashboard/employee/%5BemployeeId%5D/page-137f28f4e8538f57.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/dashboard/employee/create/page-3282dba09098b9ae.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/dashboard/employee/page-78d2626c4c0f1d2c.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/dashboard/employee/update/%5Bemployee_id%5D/page-6e84a525230da899.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/dashboard/kanban/page-62eaadfacd3319d5.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/dashboard/layout-62349c17f136e54c.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/dashboard/myannualleave/page-f9eb86b1e10a1b75.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/dashboard/overview/page-c54b3cffe7168c6a.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/dashboard/page-9384474421b936f6.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/dashboard/profile/page-ad15f849d9642951.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/error-b7d9dc793bc05dcc.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/layout-472af5a39591a36d.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/app/not-found-5c6449d8b8aa1ece.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/framework-1ec85e83ffeb8a74.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/main-ab1f5b2b07e27ab5.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/main-app-bb56567d8d0446ce.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/pages/_app-5f03510007f8ee45.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/pages/_error-8efa4fbf3acc0458.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-9605b370afc90657.js",revision:"0OJWLIvU7H2ctWqKllIzR"},{url:"/_next/static/css/87ec0d37eb8be012.css",revision:"87ec0d37eb8be012"},{url:"/_next/static/css/a9291741cbdc7802.css",revision:"a9291741cbdc7802"},{url:"/_next/static/media/162938472036e0a8-s.woff2",revision:"f07093b23087bde42e34448bcbad3f78"},{url:"/_next/static/media/4de1fea1a954a5b6-s.p.woff2",revision:"b7d6b48d8d12946dc808ff39aed6c460"},{url:"/_next/static/media/6d664cce900333ee-s.p.woff2",revision:"017598645bcc882a3610effe171c2ca3"},{url:"/_next/static/media/7ff6869a1704182a-s.p.woff2",revision:"cf5ec3859b05de1b9351ab934b937417"},{url:"/_next/static/media/af4d27004aa34222-s.woff2",revision:"c5a05a4e2a52b4590fbb511cc93b5045"},{url:"/_next/static/media/f1df658da56627d0-s.woff2",revision:"372d9cf6e4822b41d014fcc9de0a979a"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/vercel.svg",revision:"61c6b19abff40ea7acd577be818f3976"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:t,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
