/* gallery page. Edit the markup below or the data in config.js. */
mount('gallery',
() => {
  const ph = (g,side) => g[side] ? `<img src="${g[side]}" alt="${g.title}, ${side} cleanup" loading="lazy">` : (side==='before' ? `<div class="ph b" role="img" aria-label="${g.title}, before">${g.icons}</div>` : `<div class="ph a" role="img" aria-label="${g.title}, after"><span>✨</span><small>All clear</small></div>`);
  const cats = [...new Set(C.gallery.map(g=>g.cat))];
  return `
 <section class="sec"><div class="wrap"><h1 style="font-size:clamp(2.4rem,6vw,4rem)">Recent junk removal jobs</h1>
  <p>Drag each photo to compare before and after.</p>
  <div class="chipbar" role="group" aria-label="Filter by job type">${['All',...cats].map((c,i)=>`<button class="fb" data-c="${c}" aria-pressed="${i===0}">${c}</button>`).join('')}</div>
  <div class="gal">${C.gallery.map(g=>`<figure data-c="${g.cat}">
   <div class="stage"><div class="layer after">${ph(g,'after')}</div><div class="layer before">${ph(g,'before')}</div>
    <span class="tag l">Before</span><span class="tag r">After</span><div class="handle"></div>
    <input type="range" min="0" max="100" value="50" aria-label="Reveal before and after for ${g.title}"></div>
   <figcaption><h3>${g.title}</h3><p>${g.caption}</p></figcaption></figure>`).join('')}</div></div></section>
 ${cta('Want your space to look like this?','Send us a photo of the pile and we will quote it today.')}`;
},
() => {
  document.querySelectorAll('.stage input').forEach(i => i.oninput = () => i.parentNode.style.setProperty('--p', i.value + '%'));
  document.querySelectorAll('.fb').forEach(b => b.onclick = () => {
    document.querySelectorAll('.fb').forEach(x => x.setAttribute('aria-pressed', x === b));
    document.querySelectorAll('.gal figure').forEach(f => f.hidden = b.dataset.c !== 'All' && f.dataset.c !== b.dataset.c);
  });
});
