export interface Challenge {
  id: number;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  completed: boolean;
}

export type MemberType = {
  _id: string;
  name: string;
  img: string;
  github: string;
  linkedin: string;
  position: string;
  __v: number;
};