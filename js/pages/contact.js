/* contact page. Edit the markup below or the data in config.js. */
mount('contact',
() => `
 <section class="sec"><div class="wrap"><h1 style="font-size:clamp(2.4rem,6vw,4rem)">Get a free junk removal quote</h1>
  <div class="two"><div class="card">
   <form id="qf">
    <label for="n">Name</label><input id="n" name="name" required autocomplete="name">
    <label for="p">Phone</label><input id="p" name="phone" type="tel" required autocomplete="tel">
    <label for="e">Email</label><input id="e" name="email" type="email" autocomplete="email">
    <label for="s">What do you need removed?</label><select id="s" name="service">${C.services.map(s=>`<option>${s.title}</option>`).join('')}</select>
    <label for="d">Preferred date</label><input id="d" name="date" type="date">
    <label for="m">Details</label><textarea id="m" name="message" rows="4" placeholder="Items, location, stairs, parking..."></textarea>
    <p style="margin-top:16px"><button class="btn" type="submit">Send request</button></p>
    <div class="ok" id="ok" role="status">Your email app should open with the request ready to send. You can also call ${C.phone}.</div>
   </form></div>
   <div class="card"><h3>Reach us directly</h3>
    <p><a href="tel:${tel}"><strong>${C.phone}</strong></a><br><a href="mailto:${C.email}">${C.email}</a><br>${C.address}</p>
    <h3>Hours</h3>${C.hours.map(h=>`<div class="opt"><span>${h[0]}</span><span>${h[1]}</span></div>`).join('')}
    <p style="margin-top:16px">${C.serviceArea}</p>${socialHTML() ? `<h3>Follow us</h3>${socialHTML()}` : ''}</div></div>
 </div></section>`,
() => {
  $('#qf').onsubmit = async e => {
    e.preventDefault();
    const f = e.target, v = id => $('#' + id).value, ok = $('#ok');
    ok.style.display = 'block';
    if (C.formEndpoint) {
      try {
        const r = await fetch(C.formEndpoint, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } });
        ok.textContent = r.ok ? 'Thanks! We got your request and will reply shortly.' : 'Something went wrong. Please call ' + C.phone + '.';
        if (r.ok) f.reset();
      } catch (_) { ok.textContent = 'Network error. Please call ' + C.phone + '.'; }
      return;
    }
    const body = `Name: ${v('n')}\nPhone: ${v('p')}\nEmail: ${v('e')}\nService: ${v('s')}\nDate: ${v('d')}\n\n${v('m')}`;
    ok.textContent = 'Your email app should open with the request ready to send. You can also call ' + C.phone + '.';
    location.href = `mailto:${C.email}?subject=${encodeURIComponent('Quote request: ' + v('s'))}&body=${encodeURIComponent(body)}`;
  };
});
