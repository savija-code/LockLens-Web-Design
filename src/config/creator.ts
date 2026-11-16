export type SocialService = 'github' | 'linkedin' | 'facebook';


export const creatorProfiles: Readonly<Record<SocialService, string | null>> = Object.freeze({
  github: 'https://github.com/savija-code',
  linkedin: null,
  facebook: null
});

const profileHosts: Record<SocialService, readonly string[]> = {
  github: ['github.com', 'www.github.com'],
  linkedin: ['linkedin.com', 'www.linkedin.com'],
  facebook: ['facebook.com', 'www.facebook.com']
};

export function confirmedProfileUrl(service: SocialService, value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password || url.port || url.search || url.hash
      || url.pathname === '/' || !profileHosts[service].includes(url.hostname)) return null;
    return url.href;
  } catch { return null; }
}
