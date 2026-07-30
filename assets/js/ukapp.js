/* Ukreate app shell: role-aware nav, view switching, fake session. No dependencies. */
(function () {
  var root = document.querySelector('[data-ukapp]');
  if (!root) return;

  // nav icon slot -> name in the Toolbox library export (assets/js/ukicons.js)
  var ico = {
    home:  'home',   pitch: 'search', camp:  'bag',
    inbox: 'chat',   learn: 'book',   user:  'user',
    star:  'star',   people:'idcard'
  };

  var NAV = {
    creator: {
      label: 'Creator workspace',
      name: 'Robert Torres', initials: 'RT', role: 'Creator Pro member', inbox: 3,
      items: [
        { id: 'home',     title: 'Home',            icon: 'home'  },
        { id: 'pitch',    title: 'Find hotels',     icon: 'pitch' },
        { id: 'campaigns',title: 'Browse campaigns',icon: 'camp'  },
        { id: 'inbox',    title: 'Collaborations',  icon: 'inbox', count: 3 },
        { id: 'academy',  title: 'Creator Academy', icon: 'learn' },
        { id: 'profile',  title: 'Your profile',    icon: 'user'  },
        { id: 'plan',     title: 'Membership',      icon: 'star'  }
      ]
    },
    brand: {
      label: 'Brand workspace',
      name: 'Robert Torres', initials: 'RT', role: 'Miami Hotel', inbox: 12,
      items: [
        { id: 'home',     title: 'Home',           icon: 'home'   },
        { id: 'campaigns',title: 'Your campaigns', icon: 'camp'   },
        { id: 'creators', title: 'Find creators',  icon: 'people' },
        { id: 'inbox',    title: 'Collaborations', icon: 'inbox', count: 12 },
        { id: 'profile',  title: 'Property profile', icon: 'user' },
        { id: 'plan',     title: 'Membership and billing', icon: 'star' }
      ]
    }
  };

  var q = function (s) { return root.querySelector(s); };
  var role = localStorage.getItem('uk_role') === 'brand' ? 'brand' : 'creator';
  var view = 'home';

  // icons ship their own ink (some stroked, some outlined) so nothing is forced here
  function svg(name) {
    var d = (window.UKICONS || {})[name] || '';
    return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' + d + '</svg>';
  }

  // any element with data-icon="name" gets the library icon injected
  function icons(scope) {
    (scope || root).querySelectorAll('[data-icon]:not(.ukIco--on)').forEach(function (el) {
      el.innerHTML = svg(el.dataset.icon);
      el.classList.add('ukIco', 'ukIco--on');
    });
  }

  function paintNav() {
    var cfg = NAV[role];
    q('#ukNav').innerHTML = cfg.items.map(function (it) {
      return '<button class="ukSide_link' + (it.id === view ? ' is-active' : '') + '" type="button" data-go="' + it.id + '"' +
             (it.id === view ? ' aria-current="page"' : '') + '>' + '<span class="ukIco ukIco--on">' + svg(ico[it.icon]) + '</span>' +
             '<span>' + it.title + '</span>' +
             (it.count ? '<span class="ukSide_count">' + it.count + '</span>' : '') + '</button>';
    }).join('');
    icons(q('#ukNav'));
    q('[data-nav-label]').textContent = cfg.label;
    q('[data-me-name]').textContent = cfg.name;
    q('[data-me-role]').textContent = cfg.role;
    q('[data-me-initials]').textContent = cfg.initials;
    q('[data-inbox-count]').textContent = cfg.inbox;
    root.querySelectorAll('[data-role-btn]').forEach(function (b) {
      b.classList.toggle('is-on', b.dataset.roleBtn === role);
    });
  }

  // per-view UI state (searches, filters, open thread)
  var S = {};
  function st() { return (S[role + ':' + view] = S[role + ':' + view] || {}); }

  function render() {
    var s = st();
    if (view === 'pitch')     return UKV.pitch(s);
    if (view === 'campaigns') return role === 'brand' ? UKV.myCampaigns(s) : UKV.browse(s);
    if (view === 'newcamp')   return UKV.newCampaign(s);
    if (view === 'creators')  return UKV.rolodex(s);
    if (view === 'inbox')     return UKV.inbox(s, role);
    if (view === 'academy')   return UKV.academy(s);
    if (view === 'profile')   return UKV.profile(s, role);
    if (view === 'plan')      return UKV.plan(s, role);
    return UKV.empty('Nothing here yet', 'Pick another section from the sidebar.');
  }

  function paintView(keepScroll) {
    var cfg = NAV[role];
    var item = cfg.items.filter(function (i) { return i.id === view; })[0] ||
               (view === 'newcamp' ? { title: 'Host a creator' } : cfg.items[0]);
    q('[data-page-title]').textContent = item.title;
    document.title = item.title + ' | Ukreate';

    var homes = root.querySelectorAll('.ukView[data-view="home"]');
    var dyn = root.querySelector('.ukView[data-view="dyn"]');
    homes.forEach(function (h) { h.hidden = !(view === 'home' && h.dataset.role === role); });
    dyn.hidden = view === 'home';
    if (view !== 'home') dyn.innerHTML = render();
    icons();
    if (!keepScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function paintPreviewOnly() {
    var dyn = root.querySelector('.ukView[data-view="dyn"]');
    var fresh = document.createElement('div');
    fresh.innerHTML = render();
    var a = dyn.querySelector('.ukSticky'), b = fresh.querySelector('.ukSticky');
    if (a && b) { a.innerHTML = b.innerHTML; icons(a); }
  }

  function go(next) { view = next; paintNav(); paintView(); closeSide(); }
  function repaint() { paintView(true); }

  root.addEventListener('input', function (e) {
    var ff = e.target.closest('[data-f]');
    if (ff) { var s2 = st(); s2.form = s2.form || { del: {} }; s2.form[ff.dataset.f] = ff.value;
              var pv = root.querySelector('.ukSticky'); if (pv) { paintPreviewOnly(); } return; }
    var f = e.target.closest('[data-q]');
    if (!f) return;
    st().q = f.value;
    var pos = f.selectionStart;
    repaint();
    var again = root.querySelector('[data-q]');
    if (again) { again.focus(); again.setSelectionRange(pos, pos); }
  });

  root.addEventListener('click', function (e) {
    var nav = e.target.closest('[data-go]');
    if (nav) { go(nav.dataset.go); return; }
    var jump = e.target.closest('[data-goto]');
    if (jump) {
      e.preventDefault();
      go(jump.dataset.goto);
      if (jump.dataset.preset != null) { st().stageF = jump.dataset.preset; st().thread = null; repaint(); }
      return;
    }

    var s = st(), el;
    if ((el = e.target.closest('[data-cat]')))    { s.cat = el.dataset.cat;       return repaint(); }
    if ((el = e.target.closest('[data-status]'))) { s.status = el.dataset.status; return repaint(); }
    if ((el = e.target.closest('[data-plat]')))   { s.plat = el.dataset.plat;     return repaint(); }
    if ((el = e.target.closest('[data-niche]')))  { s.niche = el.dataset.niche;   return repaint(); }
    if ((el = e.target.closest('[data-stage]')))  { s.stageF = el.dataset.stage;  return repaint(); }
    if ((el = e.target.closest('[data-thread]'))) { s.thread = el.dataset.thread; return paintView(); }
    if (e.target.closest('[data-back]'))          { s.thread = null;              return paintView(); }

    if ((el = e.target.closest('[data-apply]'))) {
      var kc = UK.campaign(el.dataset.apply), card = el.closest('.ukCard');
      if (card.querySelector('.ukApply')) return;
      el.insertAdjacentHTML('afterend', UKV.applyForm(kc));
      el.hidden = true;
      card.querySelector('.ukApply').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }
    if (e.target.closest('[data-closeapply]')) {
      var cd = e.target.closest('.ukCard');
      cd.querySelector('.ukApply').remove();
      cd.querySelector('[data-apply]').hidden = false;
      return;
    }
    if ((el = e.target.closest('[data-sendapply]'))) {
      var k2 = UK.campaign(el.dataset.sendapply), box = el.closest('.ukApply');
      var msg = box.querySelector('[data-applymsg]').value.trim();
      var dts = box.querySelector('[data-applydates]').value.trim();
      var th = UK.addThread({ id: 'ap' + Date.now(), who: 'me', camp: k2.id, stage: 0, unread: 0, when: 'just now',
        msgs: [{ by: 'me', at: 'just now', tx: msg + (dts ? '\n\nDates that work for me: ' + dts : '') }] });
      UK.applied[k2.id] = th.id;
      NAV.creator.items.forEach(function (i) { if (i.id === 'inbox') i.count = (i.count || 0) + 1; });
      NAV.creator.inbox += 1;
      paintNav(); repaint();
      return;
    }
    if ((el = e.target.closest('[data-openthread]'))) {
      view = 'inbox'; st().thread = el.dataset.openthread; paintNav(); paintView(); return;
    }
    if (e.target.closest('[data-newcamp]')) { go('newcamp'); return; }
    if ((el = e.target.closest('[data-pick]'))) {
      var s3 = st(); s3.form = s3.form || { del: {} };
      s3.form[el.dataset.pick] = s3.form[el.dataset.pick] === el.dataset.val ? '' : el.dataset.val;
      return repaint();
    }
    if ((el = e.target.closest('[data-del]'))) {
      var s4 = st(); s4.form = s4.form || { del: {} };
      var cur = s4.form.del[el.dataset.del] || 0;
      var nxt = Math.max(0, cur + (+el.dataset.dir));
      if (nxt) s4.form.del[el.dataset.del] = nxt; else delete s4.form.del[el.dataset.del];
      return repaint();
    }
    if (e.target.closest('[data-publish]')) {
      var fm = st().form;
      UK.campaigns.unshift({ id: 'nk' + Date.now(), t: fm.t, prop: fm.prop, loc: fm.loc,
        from: fm.from, to: fm.to, type: fm.type, inc: fm.inc, status: 'live', apps: 0,
        cat: fm.cat, aud: fm.aud,
        del: Object.keys(fm.del).map(function (d) { return { t: d, q: fm.del[d] }; }) });
      S[role + ':newcamp'] = {};
      go('campaigns');
      return;
    }
    if ((el = e.target.closest('[data-pitch]'))) {
      var h = UK.hotels.filter(function (x) { return x.id === el.dataset.pitch; })[0];
      var card = el.closest('.ukCard');
      var open = card.querySelector('.ukPitch');
      if (open) { open.remove(); return; }
      card.insertAdjacentHTML('beforeend', UKV.pitchOut(h));
      card.querySelector('.ukPitch').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }
    if (e.target.closest('[data-closepitch]')) { e.target.closest('.ukPitch').remove(); return; }
    if ((el = e.target.closest('[data-tone]'))) {
      var wrap = el.closest('.ukPitch');
      wrap.querySelectorAll('[data-tone]').forEach(function (b) { b.classList.toggle('is-on', b === el); });
      wrap.querySelectorAll('[data-tonebody]').forEach(function (b) { b.hidden = b.dataset.tonebody !== el.dataset.tone; });
      return;
    }
    if ((el = e.target.closest('[data-copy]'))) {
      var pre = el.closest('[data-tonebody]').querySelector('pre');
      navigator.clipboard && navigator.clipboard.writeText(pre.textContent);
      el.textContent = 'Copied';
      setTimeout(function () { el.textContent = 'Copy this pitch'; }, 1600);
      return;
    }
    if ((el = e.target.closest('[data-contact],[data-send],[data-advance]'))) {
      var was = el.textContent;
      el.textContent = el.hasAttribute('data-send') ? 'Reply sent' :
                       el.hasAttribute('data-contact') ? 'Message sent' : 'Done, moved on';
      el.disabled = true;
      setTimeout(function () { el.textContent = was; el.disabled = false; }, 1900);
      return;
    }
    var rb = e.target.closest('[data-role-btn]');
    if (rb) {
      role = rb.dataset.roleBtn;
      localStorage.setItem('uk_role', role);
      if (!NAV[role].items.some(function (i) { return i.id === view; })) view = 'home';
      paintNav(); paintView();
    }
  });

  // theme: stored choice wins, otherwise follow the OS
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;
  function paintTheme() {
    var t = document.documentElement.getAttribute('data-theme');
    root.querySelectorAll('[data-theme-btn]').forEach(function (b) {
      var on = b.dataset.themeBtn === t;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }
  function setTheme(t, remember) {
    document.documentElement.setAttribute('data-theme', t);
    if (remember) localStorage.setItem('uk_theme', t);
    paintTheme();
  }
  root.addEventListener('click', function (e) {
    var tb = e.target.closest('[data-theme-btn]');
    if (tb) setTheme(tb.dataset.themeBtn, true);
  });
  if (mq && mq.addEventListener) {
    mq.addEventListener('change', function (e) {
      if (!localStorage.getItem('uk_theme')) setTheme(e.matches ? 'light' : 'dark', false);
    });
  }
  paintTheme();

  // mobile drawer
  var side = document.getElementById('ukSide');
  function closeSide() { side.classList.remove('is-open'); }
  q('[data-burger]').addEventListener('click', function (e) { e.stopPropagation(); side.classList.toggle('is-open'); });
  document.addEventListener('click', function (e) {
    if (side.classList.contains('is-open') && !side.contains(e.target) && !e.target.closest('[data-burger]')) closeSide();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSide(); });

  paintNav();
  paintView();
  icons();
})();
