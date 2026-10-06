/* Shared code: header, footer, SEO tags and page mounting. Rarely needs editing.
   Works in the browser and in build.js (which pre-renders every page to plain HTML). */
const C = CONFIG, IS_BROWSER = typeof document !== 'undefined';
const $ = s => document.querySelector(s);
let OVERRIDE = false;
/* admin.html can save a preview in this browser only; visitors never see it */
if (IS_BROWSER) try { const o = JSON.parse(localStorage.getItem('siteOverride') || 'null'); if (o) { Object.assign(C, o); OVERRIDE = true; } } catch (e) {}
/* Social links: accept missing key, plain URL strings (old format) or {name, url} objects */
const SOCIAL_NAMES = { 'facebook.com': 'Facebook', 'instagram.com': 'Instagram', 'tiktok.com': 'TikTok', 'youtube.com': 'YouTube', 'x.com': 'X', 'twitter.com': 'X', 'linkedin.com': 'LinkedIn', 'g.page': 'Google Business', 'wa.me': 'WhatsApp' };
const socialName = u => { try { const h = new URL(u).hostname.replace(/^www\./, ''); return SOCIAL_NAMES[h] || h; } catch (e) { return u; } };
C.social = (Array.isArray(C.social) ? C.social : []).map(x => typeof x === 'string' ? { name: socialName(x), url: x } : x).filter(x => x && x.url);
const A = C.addr;
C.address = `${A.street}, ${A.city}, ${A.region} ${A.zip}`;
const tel = C.phone.replace(/[^\d+]/g, '');
const FILES = { home: 'index.html', services: 'services.html', gallery: 'gallery.html', pricing: 'pricing.html', contact: 'contact.html' };
const LABELS = { home: 'Home', services: 'Services', gallery: 'Gallery', pricing: 'Pricing', contact: 'Contact' };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const money = n => '$' + Math.round(n).toLocaleString('en-US');
const socialHTML = () => { const s = C.social.filter(x => x.url); return s.length ? `<ul class="chips social">${s.map(x => `<li><a href="${esc(x.url)}" rel="me noopener" target="_blank">${esc(x.name)}</a></li>`).join('')}</ul>` : ''; };
const cta = (t, p) => `<section class="cta"><h2>${t}</h2><p>${p}</p><a class="btn" href="contact.html">Get a free quote</a></section>`;
const base = () => C.siteUrl.replace(/\/$/, '');
const abs = p => /^(https?:|data:)/.test(p) ? p : base() + '/' + p.replace(/^\//, '');
const fill = s => s.replace(/\{(\w+)\}/g, (m, k) => ({ city: A.city, region: A.region, name: C.shortName, phone: C.phone })[k] ?? m);

const accentStyle = () => `<style>:root{--accent:${C.accentLight}}@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--accent:${C.accentDark}}}:root[data-theme="dark"]{--accent:${C.accentDark}}:root[data-theme="light"]{--accent:${C.accentLight}}</style>`;

/* Structured data (JSON-LD) that helps Google show your business in local results */
function ld(key) {
  const b = base(), g = [{
    '@type': 'LocalBusiness', '@id': b + '/#business', name: C.name, url: b + '/', telephone: C.phone, email: C.email,
    description: fill(C.seo.home.description), image: abs(C.ogImage), logo: C.logo ? abs(C.logo) : undefined,
    priceRange: C.priceRange, openingHours: C.openingHours, sameAs: C.social.map(x => x.url).filter(Boolean),
    address: { '@type': 'PostalAddress', streetAddress: A.street, addressLocality: A.city, addressRegion: A.region, postalCode: A.zip, addressCountry: A.country },
    areaServed: C.areas.map(n => ({ '@type': 'City', name: n })),
    hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Junk removal services', itemListElement: C.services.map(s => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.title, description: s.desc } })) }
  }];
  if (key === 'pricing') g.push({ '@type': 'FAQPage', mainEntity: C.faq.map(f => ({ '@type': 'Question', name: f[0], acceptedAnswer: { '@type': 'Answer', text: f[1] } })) });
  return { '@context': 'https://schema.org', '@graph': g };
}

function seoTags(key) {
  const p = C.seo[key], url = base() + '/' + (key === 'home' ? '' : FILES[key]);
  const title = esc(fill(p.title)), desc = esc(fill(p.description));
  return `<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="${url}">
<meta name="theme-color" content="${C.accentLight}">
${C.logo ? `<link rel="icon" href="${esc(C.logo)}">` : ''}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(C.name)}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${esc(abs(C.ogImage))}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${JSON.stringify(ld(key)).replace(/</g, '\\u003c')}</script>
${accentStyle()}`;
}

function headerHTML(key) {
  const logo = C.logo ? `<img src="${esc(C.logo)}" alt="${esc(C.name)} logo" height="40">` : `<span>${C.logoEmoji}</span>`;
  const label = (!C.logo || C.showNameWithLogo) ? esc(C.shortName) : '';
  return `<div class="wrap bar"><a class="logo" href="index.html" aria-label="${esc(C.name)} home">${logo}${label}</a>
  <button class="menu" id="menu" aria-expanded="false" aria-controls="nav">Menu</button>
  <nav id="nav" aria-label="Main">${Object.keys(FILES).map(k => `<a href="${FILES[k]}"${k === key ? ' aria-current="page"' : ''}>${LABELS[k]}</a>`).join('')}</nav>
  <a class="btn call" href="tel:${tel}">Call ${C.phone}</a>
  <button class="theme" id="theme" aria-label="Toggle dark mode">◐</button></div>`;
}

function footerHTML() {
  return `<div class="wrap grid">
 <div><h3>${esc(C.name)}</h3><p>${C.tagline}</p></div>
 <div><h3>Contact</h3><ul><li><a href="tel:${tel}">${C.phone}</a></li><li><a href="mailto:${C.email}">${C.email}</a></li><li>${C.address}</li></ul></div>
 <div><h3>Hours</h3><ul>${C.hours.map(h => `<li>${h[0]}: ${h[1]}</li>`).join('')}</ul></div>
 <div><h3>Pages</h3><ul>${Object.keys(FILES).map(k => `<li><a href="${FILES[k]}">${LABELS[k]}</a></li>`).join('')}</ul></div>${socialHTML() ? `<div><h3>Follow us</h3>${socialHTML()}</div>` : ''}</div>
 <div class="wrap"><p style="margin-top:24px">© ${new Date().getFullYear()} ${esc(C.name)}. ${C.serviceArea}</p></div>`;
}

const PAGES = {};
function mount(key, tpl, init) {
  PAGES[key] = { tpl, init };
  if (IS_BROWSER) document.addEventListener('DOMContentLoaded', () => run(key));
}

function run(key) {
  const prebuilt = $('#app').children.length > 0 && !OVERRIDE;
  if (!prebuilt) { $('#hdr').innerHTML = headerHTML(key); $('#app').innerHTML = PAGES[key].tpl(); $('#ftr').innerHTML = footerHTML(); }
  if (!document.querySelector('meta[name=description]')) document.head.insertAdjacentHTML('beforeend', seoTags(key));
  else if (OVERRIDE) { document.head.insertAdjacentHTML('beforeend', accentStyle()); document.title = fill(C.seo[key].title); }
  if (OVERRIDE) document.body.insertAdjacentHTML('beforeend', '<div class="pv">Preview mode. <a href="admin.html">Back to settings</a></div>');
  $('#theme').onclick = () => {
    const d = document.documentElement, cur = d.dataset.theme || (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
    d.dataset.theme = cur === 'dark' ? 'light' : 'dark';
  };
  $('#menu').onclick = e => { const o = $('#nav').classList.toggle('open'); e.currentTarget.setAttribute('aria-expanded', o); };
  if (PAGES[key].init) PAGES[key].init();
}
