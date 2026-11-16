const paths: Record<string, string> = {
  github: '<path d="M9 19c-4 1-4-2-6-2m12 4v-3.5a3 3 0 0 0-.8-2.3c2.7-.3 5.5-1.3 5.5-6a4.7 4.7 0 0 0-1.3-3.3 4.3 4.3 0 0 0-.1-3.3S17.3 2.3 15 3.9a11.5 11.5 0 0 0-6 0C6.7 2.3 5.7 2.6 5.7 2.6a4.3 4.3 0 0 0-.1 3.3A4.7 4.7 0 0 0 4.3 9c0 4.7 2.8 5.7 5.5 6A3 3 0 0 0 9 17.5V21"/>',
  linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 10v7m0-10v.1M11 17v-7m0 3a3 3 0 0 1 6 0v4"/>',
  facebook: '<path d="M14 21v-8h3l.5-4H14V7c0-1.2.4-2 2-2h2V1.5A24 24 0 0 0 15 1c-3 0-5 1.8-5 5v3H7v4h3v8"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="m10.85 12.15 8-8L22 7l-3 3 2 2-3 3-2-2-2.15 2.15"/>',
  activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
  copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  rotate: '<path d="M3 12a9 9 0 0 1 15.4-6.4L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.4 6.4L3 16"/><path d="M8 16H3v5"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff: '<path d="M3 3 21 21"/><path d="M10.7 5.1A10.5 10.5 0 0 1 12 5c6.4 0 10 7 10 7a13.5 13.5 0 0 1-3.2 3.8M6 6.5C3.4 8.2 2 12 2 12s3.6 7 10 7a9.9 9.9 0 0 0 4.6-1"/><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  lock: '<rect x="4" y="10" width="16" height="12" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 11v5M12 8h.01"/>',
  spark: '<path d="m12 3 1.9 6.1L20 11l-6.1 1.9L12 19l-1.9-6.1L4 11l6.1-1.9L12 3ZM19 18l.8 1.2L21 20l-1.2.8L19 22l-.8-1.2L17 20l1.2-.8L19 18Z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  link: '<path d="M10 13a5 5 0 0 0 7 .5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>'
};

export function icon(name: string, size = 18, additionalClass = ''): string {
  return `<svg class="icon ${additionalClass}" aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.info}</svg>`;
}
