
import type { User, Course } from '../types';

export const dummyUser: User = {
  name: 'Budi Darmawan',
  email: 'budi.darmawan@example.com',
  avatar: 'https://picsum.photos/seed/user/100',
  subscriptionStatus: 'Pro',
};

export const dummyCourses: Course[] = [
  {
    id: 1,
    title: 'Dasar Facebook Ads',
    category: 'Ads',
    thumbnail: 'https://picsum.photos/seed/fbads/400/225',
    description: 'Pelajari dasar-dasar periklanan di Facebook dari nol hingga mahir. Cocok untuk pemula dan pemilik bisnis.',
    videos: [
      { title: 'Materi 1: Pengenalan Platform', duration: '10:32' },
      { title: 'Materi 2: Menentukan Target Audience', duration: '15:01' },
      { title: 'Materi 3: Membuat Iklan Pertama Anda', duration: '22:15' },
    ],
  },
  {
    id: 2,
    title: 'Strategi SEO UMKM',
    category: 'SEO',
    thumbnail: 'https://picsum.photos/seed/seoukm/400/225',
    description: 'Tingkatkan visibilitas bisnis UMKM Anda di mesin pencari Google dengan strategi SEO yang terbukti berhasil.',
    videos: [
      { title: 'Materi 1: Riset Kata Kunci', duration: '12:50' },
      { title: 'Materi 2: Optimasi On-Page', duration: '18:20' },
    ],
  },
  {
    id: 3,
    title: 'Copywriting Persuasif',
    category: 'Copywriting',
    thumbnail: 'https://picsum.photos/seed/copy/400/225',
    description: 'Kuasai seni menulis teks iklan yang menjual dan mampu menarik perhatian pelanggan.',
    videos: [
      { title: 'Materi 1: Formula AIDA', duration: '8:45' },
      { title: 'Materi 2: Menulis Headline Memukau', duration: '11:30' },
    ],
  },
  {
    id: 4,
    title: 'Membangun Personal Branding',
    category: 'Branding',
    thumbnail: 'https://picsum.photos/seed/brand/400/225',
    description: 'Bangun citra diri yang kuat di dunia digital untuk meningkatkan karir dan bisnis Anda.',
    videos: [
      { title: 'Materi 1: Menemukan Niche Anda', duration: '14:00' },
      { title: 'Materi 2: Konsistensi Konten', duration: '16:10' },
    ],
  },
   {
    id: 5,
    title: 'Google Ads untuk Pemula',
    category: 'Ads',
    thumbnail: 'https://picsum.photos/seed/googleads/400/225',
    description: 'Pelajari cara kerja Google Ads dan bagaimana cara menggunakannya untuk menjangkau pelanggan potensial.',
    videos: [
      { title: 'Materi 1: Pengenalan Google Ads', duration: '10:32' },
      { title: 'Materi 2: Setup Kampanye', duration: '15:01' },
    ],
  },
  {
    id: 6,
    title: 'Link Building Efektif',
    category: 'SEO',
    thumbnail: 'https://picsum.photos/seed/linkbuild/400/225',
    description: 'Strategi mendapatkan backlink berkualitas untuk meningkatkan ranking website Anda.',
    videos: [
      { title: 'Materi 1: Apa itu Backlink?', duration: '9:20' },
      { title: 'Materi 2: Teknik Outreach', duration: '20:05' },
    ],
  },
];
