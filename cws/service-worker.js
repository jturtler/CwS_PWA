/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

workbox.skipWaiting();
workbox.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "css/log.css",
    "revision": "528354822cf90529d81b97d1223f7114"
  },
  {
    "url": "css/media.css",
    "revision": "9b34f53d6b7dcb1a476e74a34517370a"
  },
  {
    "url": "css/mobile.css",
    "revision": "2b9f8b2d9d342d4d3152bf3086b3f59a"
  },
  {
    "url": "css/responsive.css",
    "revision": "eabe518cf8b307319f15f210ce3800be"
  },
  {
    "url": "css/style.css",
    "revision": "6b0eabab029120fce0c23836d299b309"
  },
  {
    "url": "images/blank.gif",
    "revision": "325472601571f31e1bf00674c368d335"
  },
  {
    "url": "images/captureByDetail.jpg",
    "revision": "67ad72f0fe6c2616271044832eb02176"
  },
  {
    "url": "images/captureByVoucher.jpg",
    "revision": "4e6c2f569dabd33ff4c8720113b19587"
  },
  {
    "url": "images/icons/icon-128x128.png",
    "revision": "9828f9995d52f35cc202efd0e1cd65cc"
  },
  {
    "url": "images/icons/icon-144x144.png",
    "revision": "aa14407a2c513a84700518838bed9a30"
  },
  {
    "url": "images/icons/icon-152x152.png",
    "revision": "fd9ee07f034b409b522d479076843e60"
  },
  {
    "url": "images/icons/icon-192x192.png",
    "revision": "7b997cde4d36d2cc05a31c1fda5c6a13"
  },
  {
    "url": "images/icons/icon-256x256.png",
    "revision": "461dd0d2fe65456ecac7085856d1cf95"
  },
  {
    "url": "images/listInQueue.jpg",
    "revision": "ea75664670f5ec9d4a5c4790bf35f549"
  },
  {
    "url": "images/loader-bar.gif",
    "revision": "1b99adaad537086965a046dc3e04487d"
  },
  {
    "url": "images/loader-bigCircle.gif",
    "revision": "13a5354a3663d119a9918cf83c5c41df"
  },
  {
    "url": "images/loading_basic.gif",
    "revision": "03ce3dcc84af110e9da8699a841e5200"
  },
  {
    "url": "images/loading_big_black.gif",
    "revision": "a51c5608d01acf32df728f299767f82b"
  },
  {
    "url": "images/loading.gif",
    "revision": "6334d3fb9d2884cf47c16aaea13bff03"
  },
  {
    "url": "images/offline.jpg",
    "revision": "607ea3a3094fb6195aee6f5f3fc5f35a"
  },
  {
    "url": "images/online.jpg",
    "revision": "d399f85bd9589fe3cacabcce42724c5f"
  },
  {
    "url": "images/reload.png",
    "revision": "49fc5eb146e5e274794d85593a4a6e36"
  },
  {
    "url": "images/searchByPhone.jpg",
    "revision": "6b03314aac5c4cd769a1958c843af1d8"
  },
  {
    "url": "images/searchByVoucher.jpg",
    "revision": "ed34ebf1c0b9af335a77030ebe291dd9"
  },
  {
    "url": "images/searchByWalkIn.jpg",
    "revision": "444a5b20edb9dec94c4036b14fb2e1ae"
  },
  {
    "url": "images/test.html",
    "revision": "5ce25367e464141d0bf99285ba600a05"
  },
  {
    "url": "img/act.svg",
    "revision": "a59f1cd43cdb7fe359000002283a50a7"
  },
  {
    "url": "img/active.svg",
    "revision": "f7bed36b34a604e93941d71404522168"
  },
  {
    "url": "img/alert.svg",
    "revision": "5f2f94439570a21a82cf1007d5359b8a"
  },
  {
    "url": "img/arrow_down.svg",
    "revision": "25d42cf770aa7563897bda84b56cc673"
  },
  {
    "url": "img/arrow_up.svg",
    "revision": "aa66e325f7c4d48a42cc37f265646e40"
  },
  {
    "url": "img/client.svg",
    "revision": "06fbcb3609cbd6c246ac69ebe007ad1b"
  },
  {
    "url": "img/contact.svg",
    "revision": "3426c2fced5715e0a5ab6160a3b71088"
  },
  {
    "url": "img/key.svg",
    "revision": "20f1389ffe6ee7e237c300129b2dc370"
  },
  {
    "url": "img/lock.svg",
    "revision": "de3a2c52c81ddd7829b1d107e5ed5ee2"
  },
  {
    "url": "img/logo_log.svg",
    "revision": "0be80d63c398303a54a276fedffc2b22"
  },
  {
    "url": "img/logo_top.svg",
    "revision": "35e285c0cccf3fc660d9fa7b4aadefd5"
  },
  {
    "url": "img/menu_icon.svg",
    "revision": "528dd5f2e025f2208386bead7bbc1e59"
  },
  {
    "url": "img/mobile.svg",
    "revision": "56d9b808639a50927115cab90dd8e246"
  },
  {
    "url": "img/net.svg",
    "revision": "2144acb467584dffbf59e6798923bd2b"
  },
  {
    "url": "img/open.svg",
    "revision": "f7cf6943aeb6e19ae972aabcebcb022d"
  },
  {
    "url": "img/plus_on.svg",
    "revision": "1122c272c9085cf3f611902a4c879b28"
  },
  {
    "url": "img/plus.svg",
    "revision": "7051f6c37f8d6b64308cf5a635ba1e56"
  },
  {
    "url": "img/request.svg",
    "revision": "5a9e932915d53546d8e80c2071b867b8"
  },
  {
    "url": "img/service.svg",
    "revision": "35363617ed2f2f7fb7d14b5b33af2ee5"
  },
  {
    "url": "img/settings.svg",
    "revision": "7c8dcb4c9fce086566e3fe6414dccd08"
  },
  {
    "url": "img/sync-n.svg",
    "revision": "74076b33f6af9ee62151ccb80ac9e2cf"
  },
  {
    "url": "img/sync.svg",
    "revision": "3d9a12be6d7b5432ea8e9a55a67e39d0"
  },
  {
    "url": "img/voucher.svg",
    "revision": "f7fff22ec94144c3a073cf6c0045cee3"
  },
  {
    "url": "index.html",
    "revision": "d29b555d8a00aa69b1f3c3cd9132ccf3"
  },
  {
    "url": "scripts/app.js",
    "revision": "51f13812d6482113a2765a0f31f1d7dd"
  },
  {
    "url": "scripts/classes/action.js",
    "revision": "6b86553482ac9693e3cf5209628061e7"
  },
  {
    "url": "scripts/classes/block.js",
    "revision": "27ece97f1de9a3ddb89048a4cb696141"
  },
  {
    "url": "scripts/classes/blockButton.js",
    "revision": "1788140edfb2bbd550b726b2619cd2af"
  },
  {
    "url": "scripts/classes/blockForm.js",
    "revision": "06fde46820613c9624a8718626fee47d"
  },
  {
    "url": "scripts/classes/blockList.js",
    "revision": "1967caf5d79b64f01d26976e3bb42fa9"
  },
  {
    "url": "scripts/classes/blockMsg.js",
    "revision": "e07c7ceac70600386f0c601d307493aa"
  },
  {
    "url": "scripts/classes/dataList.js",
    "revision": "303382bdf35cae8ffb551a50ee47c5c4"
  },
  {
    "url": "scripts/classes/login.js",
    "revision": "2c98f56e9fe14deb5c4c17b2890b12e8"
  },
  {
    "url": "scripts/classes/validation.js",
    "revision": "561a4872cbde1adb5c3a247c1a5c4bf0"
  },
  {
    "url": "scripts/cwsRender.js",
    "revision": "28ab02f8b6b3edee24d21317aafd9b6b"
  },
  {
    "url": "scripts/libraries/jquery-3.3.1.js",
    "revision": "6a07da9fae934baf3f749e876bbfdd96"
  },
  {
    "url": "scripts/libraries/jquery-3.3.1.min.js",
    "revision": "a09e13ee94d51c524b7e2a728c7d4039"
  },
  {
    "url": "scripts/libraries/jquery-dateformat.min.js",
    "revision": "c5b600620a496ec17424270557a2f676"
  },
  {
    "url": "scripts/libraries/jquery-ui.js",
    "revision": "ab5284de5e3d221e53647fd348e5644b"
  },
  {
    "url": "scripts/libraries/jquery.blockUI.js",
    "revision": "5c98c0cbfacee6dab0783112cb0e233d"
  },
  {
    "url": "scripts/utils/configUtil.js",
    "revision": "f69e8c365748c5d1d1fb410a00e6d7fd"
  },
  {
    "url": "scripts/utils/connManager.js",
    "revision": "a24dc13c381c415c7b4824ba09e4bc52"
  },
  {
    "url": "scripts/utils/dataManager.js",
    "revision": "c34da316284c61a58bd26d0972bf4a82"
  },
  {
    "url": "scripts/utils/formUtil.js",
    "revision": "d682b88361a2bcde827775c063ea21da"
  },
  {
    "url": "scripts/utils/util.js",
    "revision": "e4b8d4ff76a42341b0040411bdc43bc5"
  },
  {
    "url": "scripts/z. Old Files/cwsRender_v0.js",
    "revision": "190671a49009c2cc6caa80d022d71fe4"
  },
  {
    "url": "scripts/z. Old Files/materialize.js",
    "revision": "e97da5c8b60e6673b98b286c2acf437d"
  },
  {
    "url": "scripts/z. Old Files/testSection.js",
    "revision": "0e632d23fbb96b56bf389700041637dc"
  },
  {
    "url": "service-worker_back.js",
    "revision": "de80056a12a74c2a49b1de762e295cb9"
  },
  {
    "url": "styles/images/ui-icons_444444_256x240.png",
    "revision": "d10bc07005bb2d604f4905183690ac04"
  },
  {
    "url": "styles/images/ui-icons_555555_256x240.png",
    "revision": "00dd0ec0a16a1085e714c7906ff8fb06"
  },
  {
    "url": "styles/images/ui-icons_777620_256x240.png",
    "revision": "4e7e3e142f3939883cd0a7e00cabdaef"
  },
  {
    "url": "styles/images/ui-icons_777777_256x240.png",
    "revision": "40bf25799e4fec8079c7775083de09df"
  },
  {
    "url": "styles/images/ui-icons_cc0000_256x240.png",
    "revision": "093a819138276b446611d1d2a45b98a2"
  },
  {
    "url": "styles/images/ui-icons_ffffff_256x240.png",
    "revision": "ea4ebe072be75fbbea002631916836de"
  },
  {
    "url": "styles/jquery-ui.css",
    "revision": "6fd5a6e8197041971d02cf62d06f4b14"
  },
  {
    "url": "styles/jquery-ui.min.css",
    "revision": "0b5729a931d113be34b6fac13bcf5b29"
  },
  {
    "url": "styles/materialize.css",
    "revision": "76c24fc9d852e3b4bef9b9b57b1d5928"
  },
  {
    "url": "styles/style.css",
    "revision": "611533ab94004153b7a1a1807ff4c1ee"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/\.(html|css|js|gif|jpg|png|svg)/, workbox.strategies.cacheFirst(), 'GET');
workbox.routing.registerRoute(/^https:\/\/use\.fontawesome\.com.*/, workbox.strategies.staleWhileRevalidate({ "cacheName":"fontawesome", plugins: [] }), 'GET');
