export type Role = "alumni" | "student";

export interface Person {
  id: string;
  role: Role;
  name: string;
  email: string;
  linkedinUrl?: string;
  avatarColor: string; // tailwind gradient classes for the initial-avatar
  major: string;
  gradYear: number;
  location?: string;
  // Alumni-specific
  currentRole?: string;
  company?: string;
  // Student-specific
  expectedGradYear?: number;
  // Shared tag-style fields
  interests: string[];
  // Alumni: topics they're happy to advise on. Students: what they're seeking.
  askMeAbout?: string[]; // alumni
  lookingFor?: string[]; // students
  bio: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  author: string;
  date: string; // ISO
  pinned?: boolean;
}

export interface TechTalk {
  id: string;
  title: string;
  speaker: string;
  speakerRole: string;
  date: string; // ISO
  description: string;
  videoUrl?: string;
  upcoming?: boolean;
}

export interface GivingPledge {
  id: string;
  name: string;
  classYear?: string;
  message?: string;
  date: string;
}

export interface BoardMessage {
  id: string;
  author: string;
  role: Role | "staff";
  category: "Job" | "Internship" | "Event" | "General";
  body: string;
  date: string; // ISO
}
