(() => {
  const storageKey = 'parallax-theme';
  const root = document.documentElement;
  try {
    if (localStorage.getItem(storageKey) === 'light') root.dataset.theme = 'light';
  } catch {
    // Keep the default theme when storage is unavailable.
  }

  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('[data-theme-toggle]');
    if (!toggle) return;

    function updateLabel() {
      const label = root.dataset.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
      toggle.setAttribute('aria-label', label);
      toggle.title = label;
    }

    updateLabel();
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      const theme = root.dataset.theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = theme;
      updateLabel();
      try {
        localStorage.setItem(storageKey, theme);
      } catch {
        // The toggle still works for the current page.
      }
    });
  });
})();
