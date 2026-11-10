export function bindNavigation(selectView: (view: string) => void): void {
  const sidebar = document.getElementById('sidebar')!;
  const toggle = document.getElementById('menu-toggle')!;
  const backdrop = document.getElementById('navigation-backdrop')!;
  const content = document.querySelector<HTMLElement>('.main-column')!;
  const mobile = window.matchMedia('(max-width: 740px)');
  let open = false;

  function setOpen(next: boolean, restoreFocus = true): void {
    open = mobile.matches && next;
    sidebar.classList.toggle('open', open);
    sidebar.inert = mobile.matches && !open;
    content.inert = open;
    backdrop.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) sidebar.querySelector<HTMLButtonElement>('button')?.focus();
    else if (restoreFocus && mobile.matches) toggle.focus();
  }

  toggle.addEventListener('click', () => setOpen(!open));
  backdrop.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', event => {
    if (!open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Tab') {
      const controls = [...sidebar.querySelectorAll<HTMLElement>('button, a[href]')];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  mobile.addEventListener('change', () => {
    const focusWasInSidebar = sidebar.contains(document.activeElement);
    const focusWasOnToggle = document.activeElement === toggle;
    setOpen(false, focusWasInSidebar);
    if (!mobile.matches && focusWasOnToggle) sidebar.querySelector<HTMLButtonElement>('button')?.focus();
  });
  document.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(button => {
    button.addEventListener('click', () => {
      selectView(button.dataset.view || 'generator');
      if (open) setOpen(false);
    });
  });
  sidebar.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(anchor => {
    anchor.addEventListener('click', () => {
      if (!open) return;
      setOpen(false, false);
      document.querySelector<HTMLElement>(anchor.hash)?.focus({ preventScroll: true });
    });
  });
  const tabs = [...document.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  tabs.forEach((tab, index) => tab.addEventListener('keydown', event => {
    let next: number;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    selectView(tabs[next].dataset.view!);
    tabs[next].focus();
  }));
  setOpen(false, false);
}
