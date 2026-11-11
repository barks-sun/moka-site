/* Apply the saved appearance before styles; new visits start in light mode. */
(() => {
  const root = document.documentElement;
  const key = 'efonly-appearance';
  const sharedDomain = location.hostname === 'efonly.cc' || location.hostname.endsWith('.efonly.cc');
  function read() {
    try {
      const value = sharedDomain
        ? document.cookie.split('; ').find(item => item.startsWith(key + '='))?.split('=')[1]
        : localStorage.getItem(key);
      return value === 'dark' ? 'dark' : 'light';
    } catch { return 'light'; }
  }
  let mode = read();
  function apply() {
    root.dataset.appearance = mode;
    const button = document.querySelector('.theme-control');
    if (!button) return;
    const en = root.lang.startsWith('en');
    const label = mode === 'dark'
      ? (en ? 'Switch to light mode' : '切换为亮色')
      : (en ? 'Switch to dark mode' : '切换为暗色');
    button.setAttribute('aria-label', label);
    button.title = label;
  }
  apply();
  for (const event of ['storage', 'pageshow', 'focus']) {
    addEventListener(event, () => { mode = read(); apply(); });
  }
  document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.shell > .header, body > .site-header');
    if (!header) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-control';
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16Z"/></svg>';
    header.append(button);
    apply();
    button.addEventListener('click', () => {
      mode = mode === 'dark' ? 'light' : 'dark';
      try {
        if (sharedDomain) document.cookie = `${key}=${mode}; Domain=efonly.cc; Path=/; Max-Age=31536000; SameSite=Lax; Secure`;
        else localStorage.setItem(key, mode);
      } catch { /* Switching still works when preference storage is blocked. */ }
      apply();
    });
  });
})();
