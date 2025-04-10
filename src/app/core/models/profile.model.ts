export interface Profile {
  id: string;
  name: string;
  age: number;
  profession: string;
  images: string[];
  city: string;
  state: string;
  country: string;
  height?: string;
  education?: string;
  caste?: string;
  language?: string;
  religion?: string;
  isVerified?: boolean;
  isPremium?: boolean;
  isNRI?: boolean;
}