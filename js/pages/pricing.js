/* pricing page. Edit the markup below or the data in config.js. */
mount('pricing',
() => `
 <section class="sec"><div class="wrap"><h1 style="font-size:clamp(2.4rem,6vw,4rem)">Junk removal pricing</h1>
  <p>We price by how much space your items take in our truck. No hourly rates, no surprise fees.</p>
  <div class="tiers">${C.tiers.map(t=>`<div class="card tier"><h3>${t.name}</h3><div class="price">${money(t.price)}</div><p>${t.desc}</p></div>`).join('')}</div></div></section>
 <section class="sec band"><div class="wrap"><h2>Estimate your job</h2>
  <div class="est"><div class="card">
   <label for="load">How full would the truck be?</label>
   <div class="truck"><div class="bed"><div class="fill" id="fill"></div></div><div class="cab"></div></div>
   <input type="range" id="load" min="0" max="${C.tiers.length-1}" value="1" step="1" aria-describedby="loadname">
   <p id="loadname" style="margin-top:8px"></p>
   <h3 style="margin-top:20px">Extras</h3>
   ${C.extras.map((e,i)=>`<label class="opt" style="font-weight:400;margin:0"><span><input type="checkbox" class="ex" data-i="${i}" style="width:auto;margin-right:8px">${e.label}</span><span>+${money(e.price)}</span></label>`).join('')}
  </div>
  <div class="card"><p>Estimated range</p><div class="total" id="total"></div><p style="margin-top:12px">Your on-site quote is final. If the job is smaller than expected, you pay less.</p><a class="btn" href="contact.html">Book this job</a></div></div>
 </div></section>
 <section class="sec"><div class="wrap"><h2>Questions</h2>${C.faq.map(f=>`<details><summary>${f[0]}</summary><p>${f[1]}</p></details>`).join('')}</div></section>`,
() => {
  const r = $('#load'), upd = () => {
    const t = C.tiers[+r.value];
    let base = t.price; document.querySelectorAll('.ex:checked').forEach(c => base += C.extras[+c.dataset.i].price);
    $('#fill').style.width = (t.load*100) + '%';
    $('#loadname').textContent = t.name + ': ' + t.desc;
    $('#total').textContent = money(base*(1-C.estimateRange)) + ' to ' + money(base*(1+C.estimateRange));
  };
  r.oninput = upd; document.querySelectorAll('.ex').forEach(c => c.onchange = upd); upd();
});
