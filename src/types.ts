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

export interface WebDevChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface DSAChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface CompletedChallenges {
  'web-dev': string[];
  'dsa': string[];
}