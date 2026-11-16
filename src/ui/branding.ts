import { confirmedProfileUrl, creatorProfiles } from '../config/creator.js';
import { icon } from './icons.js';

const profileLabels = { github: 'GitHub', linkedin: 'LinkedIn', facebook: 'Facebook' } as const;

export function renderSiteInformation(): string {
  return `
    <section id="about" class="site-about" tabindex="-1" aria-labelledby="about-title">
      <h2 id="about-title">About LockLens</h2>
      <p>A focused browser workspace for generating passwords and understanding local strength estimates. Scores offer guidance, not a guarantee of safety.</p>
      <details id="legal" class="site-legal" tabindex="-1">
        <summary>Ownership &amp; licenses</summary>
        <div class="legal-content">
          <p>LockLens is designed and developed by Savija Rumeth. A public website does not require its development repository to be public. JavaScript, styles and other files delivered to your browser can still be inspected; minification does not make them secret.</p>
          <p>The existing <a href="./LICENSE">MIT License</a> and permissions already granted for published code remain in effect. Copyright wording does not revoke those permissions. Dependencies and datasets retain their own terms in the <a href="./THIRD_PARTY_NOTICES.txt">third-party notices</a>.</p>
        </div>
      </details>
    </section>
    <section id="privacy" class="privacy-disclosure" tabindex="-1" aria-labelledby="privacy-title">
      <h2 id="privacy-title">Privacy</h2>
      <p>Password generation and strength analysis run locally in this browser. The application does not intentionally log, transmit or save these values to browser storage. It has no accounts, tracking or remote password checks.</p>
      <p>Loading the site requests its files from the host, which may keep ordinary access logs. Generation and analysis make no additional requests. Creator links contact the chosen social website only when opened; that website has its own privacy practices.</p>
      <p>Copied passwords may remain on your system clipboard or in clipboard history. Browser extensions, a compromised device or screen sharing can expose sensitive content. Use test passwords in the analyzer and a trusted, updated browser over HTTPS.</p>
    </section>
    <footer class="page-footer footer-branding">
      <div class="footer-identity">
        <strong>locklens<span class="brand-period">.</span></strong>
        <span>Designed &amp; Developed by Savija Rumeth</span>
        <p class="copyright">© 2026 Savija Rumeth. All rights reserved.</p>
        <p class="copyright-terms">Subject to existing MIT grants and third-party license terms.</p>
      </div>
      <section class="creator-connections" id="creator-connections" aria-labelledby="creator-title" hidden>
        <h2 id="creator-title">Connect with the creator</h2>
        <nav id="creator-links" class="creator-links" aria-label="Creator social profiles"></nav>
      </section>
      <nav class="footer-links" aria-label="Site information">
        <a href="#about">About</a><a href="#privacy">Privacy</a><a href="#legal">Legal</a>
      </nav>
    </footer>`;
}

export function mountCreatorConnections(): void {
  const links = document.getElementById('creator-links');
  if (!links) return;
  links.replaceChildren();
  for (const service of ['github', 'linkedin', 'facebook'] as const) {
    const url = confirmedProfileUrl(service, creatorProfiles[service]);
    if (!url) continue;
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer external';
    anchor.referrerPolicy = 'no-referrer';
    anchor.className = 'creator-link';
    anchor.setAttribute('aria-label', `Savija Rumeth on ${profileLabels[service]} (opens in a new tab)`);
    const mark = document.createElement('span');
    mark.innerHTML = icon(service, 17);
    const label = document.createElement('span');
    label.textContent = profileLabels[service];
    anchor.append(mark, label);
    links.append(anchor);
  }
  document.getElementById('creator-connections')!.hidden = !links.childElementCount;
  function openLegal(): void {
    if (window.location.hash === '#legal') (document.getElementById('legal') as HTMLDetailsElement).open = true;
  }
  window.addEventListener('hashchange', openLegal);
  openLegal();
}
