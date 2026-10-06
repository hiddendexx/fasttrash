/* Run: node build.js   ->  writes the finished, search-engine-ready site to /dist
   It pre-renders every page to plain HTML (title, description, social tags, structured
   data and all content), and generates sitemap.xml and robots.txt from config.js. */
const fs = require('fs'), vm = require('vm');
const ctx = vm.createContext({ console });
const load = f => vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f });
const get = e => vm.runInContext(e, ctx);

['config.js', 'js/core.js', ...fs.readdirSync('js/pages').map(f => 'js/pages/' + f)].forEach(load);

fs.rmSync('dist', { recursive: true, force: true });
fs.mkdirSync('dist');
/* admin.html is NOT published unless you set INCLUDE_ADMIN=1 */
for (const d of ['styles.css', 'config.js', 'js', 'images', ...(process.env.INCLUDE_ADMIN ? ['admin.html'] : [])]) if (fs.existsSync(d)) fs.cpSync(d, 'dist/' + d, { recursive: true });

const FILES = get('FILES'), base = get('base()'), day = new Date().toISOString().slice(0, 10);
for (const [key, file] of Object.entries(FILES)) {
  const html = fs.readFileSync(file, 'utf8')
    .replace('<!--SEO-->', () => get(`seoTags('${key}')`))
    .replace('<!--HDR-->', () => get(`headerHTML('${key}')`))
    .replace('<!--APP-->', () => get(`PAGES['${key}'].tpl()`))
    .replace('<!--FTR-->', () => get('footerHTML()'));
  fs.writeFileSync('dist/' + file, html);
}

const urls = Object.entries(FILES).map(([k, f]) =>
  `  <url><loc>${base}/${k === 'home' ? '' : f}</loc><lastmod>${day}</lastmod><priority>${k === 'home' ? '1.0' : '0.8'}</priority></url>`).join('\n');
fs.writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
fs.writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\n${process.env.INCLUDE_ADMIN ? 'Disallow: /admin.html\n' : ''}\nSitemap: ${base}/sitemap.xml\n`);
console.log(`Built ${Object.keys(FILES).length} pages for ${base} into ./dist`);
