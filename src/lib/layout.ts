import { db } from '~/server/db'
import { likes } from '~/server/db/schema'
import { eq } from 'drizzle-orm'
 
export async function fetchLikes(userId?: string) {
  if (!userId) {
    return []
  }
  
  const userLikes = await db.query.likes.findMany({
    where: eq(likes.clerkId, userId)
  })
  return userLikes.map(like => like.artistId)
}