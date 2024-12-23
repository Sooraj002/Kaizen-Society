import { NextRequest, NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import redis from '@/lib/redis';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');

    if (!userId || !type) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Try to get from Redis first
    const cacheKey = `challenges:${userId}:${type}`;
    const cachedData = await redis.get(cacheKey);
    
    if (cachedData) {
      return NextResponse.json({ completedChallenges: cachedData });
    }

    // If not in Redis, get from MongoDB
    const { db } = await connectMongoDB();
    const completedChallenges = await db.collection('completed_challenges')
      .findOne({ userId, type });

    if (completedChallenges) {
      // Cache in Redis for future requests
      await redis.set(cacheKey, completedChallenges.challenges);
      return NextResponse.json({ completedChallenges: completedChallenges.challenges });
    }

    return NextResponse.json({ completedChallenges: [] });
  } catch (error) {
    console.error('Error in GET /api/completed-challenges:', error);
    return NextResponse.json(
      { error: 'Failed to fetch completed challenges' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userEmail, type, completedChallenges } = body;

    if (!userId || !userEmail || !type || !completedChallenges) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { db } = await connectMongoDB();
    
    // Update MongoDB
    await db.collection('completed_challenges').updateOne(
      { userId, type },
      {
        $set: {
          userId,
          userEmail,
          type,
          challenges: completedChallenges,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    // Update Redis cache
    const cacheKey = `challenges:${userId}:${type}`;
    await redis.set(cacheKey, completedChallenges);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in POST /api/completed-challenges:', error);
    return NextResponse.json(
      { error: 'Failed to update completed challenges' },
      { status: 500 }
    );
  }
} 