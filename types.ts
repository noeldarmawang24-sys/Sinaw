export interface User {
  name: string;
  email: string;
  avatar: string;
  subscriptionStatus: 'freemium' | 'sinaw-pro' | 'sinaw-proficient';
}

export interface Course {
  id: number;
  title: string;
  category: string;
  thumbnail: string;
  description: string;
  videos: { title: string; duration: string; videoUrl: string; }[];
}

export type Category = 'SEO' | 'Ads' | 'Copywriting' | 'Branding';

export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

export interface ScheduleItem {
  id: number;
  date: string; // "YYYY-MM-DD"
  courseCode: string;
  courseName: string;
  classType: 'Onsite Class' | 'Online Class';
  sessionInfo: string; // e.g., "F2F"
  sessionNumber: number;
  time: string; // e.g., "11:20 - 13:00 GMT+7"
  location: string;
}

export type Page = 'splash' | 'login' | 'home' | 'course' | 'mentor' | 'profile' | 'subscription' | 'my-courses' | 'settings' | 'certificate' | 'edit-profile';