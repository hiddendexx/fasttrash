/* services page. Edit the markup below or the data in config.js. */
mount('services',
() => `
 <section class="sec"><div class="wrap"><h1 style="font-size:clamp(2.4rem,6vw,4rem)">Junk removal services in ${C.addr.city}</h1>
  <p>One crew, one truck, one price. Here is what we take on most.</p>
  <div class="grid">${C.services.map(s=>`<div class="card"><span class="ic">${s.icon}</span><h3>${s.title}</h3><p>${s.desc}</p></div>`).join('')}</div></div></section>
 <section class="sec band"><div class="wrap two">
  <div><h2>What we take</h2><ul class="chips">${C.accepted.map(a=>`<li>${a}</li>`).join('')}</ul></div>
  <div class="no"><h2>What we can't take</h2><ul>${C.notAccepted.map(a=>`<li>${a}</li>`).join('')}</ul><p>Not sure about an item? Call ${C.phone} and ask.</p></div>
 </div></section>
 <section class="sec"><div class="wrap"><h2>Where we work</h2><p>${C.serviceArea}</p>
  <ul class="chips">${C.areas.map(a=>`<li>${a}</li>`).join('')}</ul></div></section>
 ${cta('Not sure what to call it?','If you want it gone, we probably haul it. Send a photo and we will quote it.')}`,
null);
