/* Ukreate auth: tab switching, role fork, password reveal. No dependencies. */
(function () {
  var root = document.querySelector('[data-ukauth]');
  if (!root) return;

  var tabs = Array.prototype.slice.call(root.querySelectorAll('.ukAuth_tab'));
  var panels = {
    login: root.querySelector('#ukauth-login'),
    signup: root.querySelector('#ukauth-signup')
  };

  function show(name) {
    tabs.forEach(function (t) {
      var on = t.dataset.panel === name;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    Object.keys(panels).forEach(function (k) {
      if (panels[k]) panels[k].hidden = k !== name;
    });
    if (history.replaceState) {
      history.replaceState(null, '', name === 'signup' ? '#signup' : '#login');
    }
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function () { show(t.dataset.panel); });
    t.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      var i = tabs.indexOf(t);
      var next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      next.focus();
      show(next.dataset.panel);
    });
  });

  root.querySelectorAll('[data-switch]').forEach(function (b) {
    b.addEventListener('click', function () {
      show(b.dataset.switch);
      var first = panels[b.dataset.switch].querySelector('input:not([type=radio])');
      if (first) first.focus();
    });
  });

  // role fork: swap the role-specific field and the button label
  var roles = Array.prototype.slice.call(root.querySelectorAll('input[name="ukrole"]'));
  var label = root.querySelector('[data-role-cta]');
  var CTA = { creator: 'Create creator account', brand: 'Create brand account' };

  function applyRole() {
    var picked = (roles.filter(function (r) { return r.checked; })[0] || {}).value;
    root.querySelectorAll('[data-for-role]').forEach(function (el) {
      var on = el.dataset.forRole === picked;
      el.classList.toggle('is-on', on);
      el.querySelectorAll('input').forEach(function (i) { i.disabled = !on; });
    });
    if (label && CTA[picked]) {
      label.textContent = CTA[picked];
      var hov = label.closest('span');
      if (hov) hov.setAttribute('data-hover', CTA[picked]);
    }
  }
  roles.forEach(function (r) { r.addEventListener('change', applyRole); });
  applyRole();

  // password reveal
  root.querySelectorAll('.ukAuth_reveal').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = btn.parentNode.querySelector('input');
      var hidden = input.type === 'password';
      input.type = hidden ? 'text' : 'password';
      btn.setAttribute('aria-label', hidden ? 'Hide password' : 'Show password');
      btn.setAttribute('aria-pressed', hidden ? 'true' : 'false');
    });
  });

  // Fake session for review: any credentials get you into the shell.
  // Sign up carries the chosen role through; log in reuses the last one.
  root.querySelectorAll('form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var isSignup = !!form.closest('#ukauth-signup');
      var picked = (roles.filter(function (r) { return r.checked; })[0] || {}).value;
      var chosen = isSignup ? (picked || 'creator') : (localStorage.getItem('uk_role') || 'creator');
      localStorage.setItem('uk_role', chosen);
      window.location.href = '/app/';
    });
  });

  show(location.hash === '#signup' ? 'signup' : 'login');
})();
