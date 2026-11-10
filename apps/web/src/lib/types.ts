export type Media = {
  url: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
};
export type Speaker = {
  documentId: string;
  name: string;
  slug: string;
  image: Media | null;
  designation: string;
  bio: string;
  expertise: string;
  featured: boolean;
};
export type Program = {
  documentId: string;
  title: string;
  slug: string;
  image: Media | null;
  description: string;
  duration: string;
  speakers: Speaker[];
  featured: boolean;
};
