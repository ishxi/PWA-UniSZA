// src/utils/avatar.ts
/**
 * Return UI Avatars service URL for fallback avatars based on user name.
 * Example: getUIAvatar('John Doe', '128')
 */
export const getUIAvatar = (name: string | undefined | null, size = 128) => {
  const display = (name || 'User').trim().replace(/\s+/g, '+');
  const bg = 'E9D5FF'; // light purple background (can adjust)
  const color = '4C1D95'; // dark purple text
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(display)}&size=${size}&background=${bg}&color=${color}&rounded=true`;
};
