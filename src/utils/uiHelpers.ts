export function getUIAvatar(name:string, size=128){ const display = (name||'User').trim().replace(/\s+/g,'+'); return `https://ui-avatars.com/api/?name=${encodeURIComponent(display)}&size=${size}&background=E9D5FF&color=4C1D95&rounded=true`; }

export function getJobIcon(type?: string){
  if(!type) return '🧰';
  const t = type.toLowerCase();
  if(t.includes('developer')||t.includes('engineer')) return '💻';
  if(t.includes('chef')||t.includes('cook')) return '🍳';
  if(t.includes('driver')) return '🚚';
  if(t.includes('teacher')) return '📚';
  if(t.includes('design')) return '🎨';
  return '🧰';
}

export function debounce(fn: Function, wait = 250){
  let t: any = null;
  return (...args:any[])=>{ if(t) clearTimeout(t); t = setTimeout(()=>fn(...args), wait); };
}

export function getInitialsColor(name: string): string {
  const colors = [
    '#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B',
    '#6366F1', '#EF4444', '#14B8A6', '#F97316', '#06B6D4'
  ];
  const charCodeSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[charCodeSum % colors.length];
}

export function generateAvatarFromName(name: string, size: number = 128): string {
  const color = getInitialsColor(name);
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const encodedName = encodeURIComponent(name.trim().replace(/\s+/g, '+'));
  return `https://ui-avatars.com/api/?name=${encodedName}&size=${size}&background=${color.replace('#', '')}&color=ffffff&rounded=true&bold=true`;
}
