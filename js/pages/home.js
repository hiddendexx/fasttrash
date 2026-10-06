/* home page. Edit the markup below or the data in config.js. */
mount('home',
() => `
 <section class="hero"><div class="wrap">
  <h1>${C.tagline}</h1><p>${C.intro}</p>
  <div class="row"><a class="btn" href="tel:${tel}">Call now ${C.phone}</a><a class="btn alt" href="contact.html">Book a pickup</a><a class="btn alt" href="pricing.html">Estimate your price</a></div>
  <div class="stats">${C.stats.map(s=>`<div><b>${s[0]}</b><span>${s[1]}</span></div>`).join('')}</div>
 </div></section>
 <section class="sec"><div class="wrap"><h2>What we haul</h2>
  <div class="grid">${C.services.slice(0,6).map(s=>`<div class="card"><span class="ic">${s.icon}</span><h3>${s.title}</h3><p>${s.desc}</p></div>`).join('')}</div>
  <p style="margin-top:24px"><a class="btn alt" href="gallery.html">See before and after photos</a></p></div></section>
 <section class="sec band"><div class="wrap"><h2>How it works</h2>
  <div class="steps">${C.steps.map(s=>`<div><h3>${s[0]}</h3><p>${s[1]}</p></div>`).join('')}</div></div></section>
 <section class="sec"><div class="wrap"><h2>Neighbors who called us</h2>
  <div class="grid">${C.testimonials.map(t=>`<div class="card quote"><p>“${t.q}”</p><small>${t.n}</small></div>`).join('')}</div></div></section>
 <section class="sec band"><div class="wrap"><h2>${C.about.split('.')[0]}.</h2><p>${C.about.split('.').slice(1).join('.').trim()}</p>
  <p><strong>Where we work:</strong> ${C.serviceArea}</p></div></section>
 ${cta('Ready to clear the clutter?','Tell us what needs to go and we will send a firm price, usually within the hour.')}`,
null);
