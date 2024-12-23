import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface CompletedChallenges {
  'web-dev': string[];
  'dsa': string[];
}

interface ChallengesState {
  completedChallenges: CompletedChallenges;
  loading: boolean;
  error: string | null;
}

const initialState: ChallengesState = {
  completedChallenges: {
    'web-dev': [],
    'dsa': [],
  },
  loading: false,
  error: null,
};

export const fetchCompletedChallenges = createAsyncThunk(
  'challenges/fetchCompleted',
  async ({ userId, type }: { userId: string; type: keyof CompletedChallenges }) => {
    const response = await fetch(`/api/completed-challenges?userId=${userId}&type=${type}`);
    if (!response.ok) {
      throw new Error('Failed to fetch completed challenges');
    }
    const data = await response.json();
    return { type, challenges: data.completedChallenges };
  }
);

export const toggleChallenge = createAsyncThunk(
  'challenges/toggle',
  async ({ 
    userId, 
    userEmail,
    type, 
    challengeId,
    currentCompleted 
  }: { 
    userId: string;
    userEmail: string;
    type: keyof CompletedChallenges;
    challengeId: string;
    currentCompleted: string[];
  }) => {
    const isCompleted = currentCompleted.includes(challengeId);
    const newCompleted = isCompleted
      ? currentCompleted.filter(id => id !== challengeId)
      : [...currentCompleted, challengeId];

    const response = await fetch('/api/completed-challenges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        userEmail,
        type,
        completedChallenges: newCompleted,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update challenge status');
    }

    return { type, challenges: newCompleted };
  }
);

const challengesSlice = createSlice({
  name: 'challenges',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompletedChallenges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompletedChallenges.fulfilled, (state, action) => {
        state.loading = false;
        state.completedChallenges[action.payload.type] = action.payload.challenges;
      })
      .addCase(fetchCompletedChallenges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch challenges';
      })
      .addCase(toggleChallenge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleChallenge.fulfilled, (state, action) => {
        state.loading = false;
        state.completedChallenges[action.payload.type] = action.payload.challenges;
      })
      .addCase(toggleChallenge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update challenge';
      });
  },
});

export default challengesSlice.reducer; 