
import { Shot, Category } from './types';

export const CATEGORIES = Object.values(Category);

export const MOCK_SHOTS: Shot[] = [
  {
    id: '1',
    title: 'Dreamy Cloud Banking App',
    image: 'https://picsum.photos/seed/lilac1/800/600',
    user: { id: 'u1', name: 'Elara Moon', avatar: 'https://picsum.photos/seed/avatar1/100/100', isPro: true },
    likes: 1240,
    views: 8900,
    tags: ['Fintech', 'App', 'Soft UI'],
    category: Category.MOBILE
  },
  {
    id: '2',
    title: 'Minimalist Floral Branding',
    image: 'https://picsum.photos/seed/lilac2/800/600',
    user: { id: 'u2', name: 'Julian Rivers', avatar: 'https://picsum.photos/seed/avatar2/100/100' },
    likes: 856,
    views: 4200,
    tags: ['Logo', 'Nature', 'Purple'],
    category: Category.BRANDING
  },
  {
    id: '3',
    title: 'Celestial Illustration Series',
    image: 'https://picsum.photos/seed/lilac3/800/600',
    user: { id: 'u3', name: 'Sasha Bloom', avatar: 'https://picsum.photos/seed/avatar3/100/100', isPro: true },
    likes: 2100,
    views: 15400,
    tags: ['Vector', 'Space', 'Vibe'],
    category: Category.ILLUSTRATION
  },
  {
    id: '4',
    title: 'Luxury Watch E-commerce',
    image: 'https://picsum.photos/seed/lilac4/800/600',
    user: { id: 'u4', name: 'Marcus Sterling', avatar: 'https://picsum.photos/seed/avatar4/100/100' },
    likes: 543,
    views: 3100,
    tags: ['Web', 'Dark Mode', 'Shop'],
    category: Category.WEB_DESIGN
  },
  {
    id: '5',
    title: 'Dreamy Lavender Icons',
    image: 'https://picsum.photos/seed/lilac5/800/600',
    user: { id: 'u5', name: 'Aria Zen', avatar: 'https://picsum.photos/seed/avatar5/100/100', isPro: true },
    likes: 932,
    views: 7500,
    tags: ['Icons', 'Lilac', 'Set'],
    category: Category.PRODUCT_DESIGN
  },
  {
    id: '6',
    title: 'Serene Landscape 3D Render',
    image: 'https://picsum.photos/seed/lilac6/800/600',
    user: { id: 'u6', name: 'Leo Frost', avatar: 'https://picsum.photos/seed/avatar6/100/100' },
    likes: 3200,
    views: 24000,
    tags: ['3D', 'Abstract', 'Vibe'],
    category: Category.ANIMATION
  },
  {
    id: '7',
    title: 'Pastel Social Dashboard',
    image: 'https://picsum.photos/seed/lilac7/800/600',
    user: { id: 'u7', name: 'Mia Song', avatar: 'https://picsum.photos/seed/avatar7/100/100' },
    likes: 721,
    views: 5900,
    tags: ['UX', 'Dashboard', 'Soft'],
    category: Category.PRODUCT_DESIGN
  },
  {
    id: '8',
    title: 'Ethereal Typography Poster',
    image: 'https://picsum.photos/seed/lilac8/800/600',
    user: { id: 'u8', name: 'Kael Thorne', avatar: 'https://picsum.photos/seed/avatar8/100/100', isPro: true },
    likes: 1560,
    views: 12300,
    tags: ['Type', 'Poster', 'Print'],
    category: Category.PRINT
  }
];
