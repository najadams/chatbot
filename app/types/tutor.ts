export interface Tutor {
  id: string;
  name: string;
  subjects: string[];
  rating: number;
  experience: number;
  image: string;
  description?: string;
  hourlyRate?: number;
  availability?: string[];
}
