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
      { title: 'Materi 1: Pengenalan Platform', duration: '17:09', videoUrl: 'https://www.youtube.com/watch?v=NjQAwrFlGJ8' },
      { title: 'Materi 2: Menentukan Target Audience', duration: '11:05', videoUrl: 'https://www.youtube.com/watch?v=-rDJJwJnPQo' },
      { title: 'Materi 3: Membuat Iklan Pertama Anda', duration: '16:17', videoUrl: 'https://www.youtube.com/watch?v=jnrETJ8W8_c' },
    ],
  },
  {
    id: 2,
    title: 'Strategi SEO UMKM',
    category: 'SEO',
    thumbnail: 'https://picsum.photos/seed/seoukm/400/225',
    description: 'Tingkatkan visibilitas bisnis UMKM Anda di mesin pencari Google dengan strategi SEO yang terbukti berhasil.',
    videos: [
      { title: 'Materi 1: Riset Kata Kunci', duration: '12:50', videoUrl: 'https://videos.pexels.com/video-files/3254013/3254013-sd_640_360_30fps.mp4' },
      { title: 'Materi 2: Optimasi On-Page', duration: '18:20', videoUrl: 'https://videos.pexels.com/video-files/854131/854131-sd_640_360_25fps.mp4' },
    ],
  },
  {
    id: 3,
    title: 'Copywriting Persuasif',
    category: 'Copywriting',
    thumbnail: 'https://picsum.photos/seed/copy/400/225',
    description: 'Kuasai seni menulis teks iklan yang menjual dan mampu menarik perhatian pelanggan.',
    videos: [
      { title: 'Materi 1: Formula AIDA', duration: '8:45', videoUrl: 'https://videos.pexels.com/video-files/5901249/5901249-sd_640_360_25fps.mp4' },
      { title: 'Materi 2: Menulis Headline Memukau', duration: '11:30', videoUrl: 'https://videos.pexels.com/video-files/6981648/6981648-sd_640_360_25fps.mp4' },
    ],
  },
  {
    id: 4,
    title: 'Membangun Personal Branding',
    category: 'Branding',
    thumbnail: 'https://picsum.photos/seed/brand/400/225',
    description: 'Bangun citra diri yang kuat di dunia digital untuk meningkatkan karir dan bisnis Anda.',
    videos: [
      { title: 'Materi 1: Menemukan Niche Anda', duration: '14:00', videoUrl: 'https://videos.pexels.com/video-files/7578536/7578536-sd_640_360_25fps.mp4' },
      { title: 'Materi 2: Konsistensi Konten', duration: '16:10', videoUrl: 'https://videos.pexels.com/video-files/855390/855390-sd_640_360_24fps.mp4' },
    ],
  },
   {
    id: 5,
    title: 'Google Ads untuk Pemula',
    category: 'Ads',
    thumbnail: 'https://picsum.photos/seed/googleads/400/225',
    description: 'Pelajari cara kerja Google Ads dan bagaimana cara menggunakannya untuk menjangkau pelanggan potensial.',
    videos: [
      { title: 'Materi 1: Pengenalan Google Ads', duration: '10:32', videoUrl: 'https://videos.pexels.com/video-files/854128/854128-sd_640_360_25fps.mp4' },
      { title: 'Materi 2: Setup Kampanye', duration: '15:01', videoUrl: 'https://videos.pexels.com/video-files/3254013/3254013-sd_640_360_30fps.mp4' },
    ],
  },
  {
    id: 6,
    title: 'Link Building Efektif',
    category: 'SEO',
    thumbnail: 'https://picsum.photos/seed/linkbuild/400/225',
    description: 'Strategi mendapatkan backlink berkualitas untuk meningkatkan ranking website Anda.',
    videos: [
      { title: 'Materi 1: Apa itu Backlink?', duration: '9:20', videoUrl: 'https://videos.pexels.com/video-files/3254013/3254013-sd_640_360_30fps.mp4' },
      { title: 'Materi 2: Teknik Outreach', duration: '20:05', videoUrl: 'https://videos.pexels.com/video-files/854131/854131-sd_640_360_25fps.mp4' },
    ],
  },
];