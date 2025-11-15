import { ID, Query } from "react-native-appwrite";
import { config, databases } from "./config";

// Save user progress for a challenge
export const saveProgress = async (
  userId: string,
  challengeId: string,
  topicId: string,
  completed: boolean,
  score: number = 100
) => {
  try {
    // Check if progress already exists
    const existing = await databases.listDocuments(
      config.databaseId,
      config.userProgressId,
      [Query.equal("userId", userId), Query.equal("challengeId", challengeId)]
    );

    if (existing.documents.length > 0) {
      // Update existing progress
      await databases.updateDocument(
        config.databaseId,
        config.userProgressId,
        existing.documents[0].$id,
        {
          completed,
          score,
          attempts: existing.documents[0].attempts + 1,
          completedAt: new Date().toISOString(),
        }
      );
    } else {
      // Create new progress record
      await databases.createDocument(
        config.databaseId,
        config.userProgressId,
        ID.unique(),
        {
          userId,
          challengeId,
          topicId,
          completed,
          score,
          attempts: 1,
          completedAt: new Date().toISOString(),
        }
      );
    }

    // If completed, add to completedChallenges array
    if (completed) {
      const currentUser = await databases.listDocuments(
        config.databaseId,
        config.userTableId,
        [Query.equal("userId", userId)]
      );

      if (currentUser.documents[0]) {
        const user = currentUser.documents[0];
        const completedChallenges = user.completedChallenges || [];

        if (!completedChallenges.includes(challengeId)) {
          await databases.updateDocument(
            config.databaseId,
            config.userTableId,
            user.$id,
            {
              completedChallenges: [...completedChallenges, challengeId],
            }
          );
        }
      }
    }
  } catch (error) {
    console.error("Error saving progress:", error);
    throw new Error(error as string);
  }
};

export const getUserProgress = async (userId: string, challengeId: string) => {
  try {
    const progress = await databases.listDocuments(
      config.databaseId,
      config.userProgressId,
      [Query.equal("userId", userId), Query.equal("challengeId", challengeId)]
    );
    return progress.documents[0] || null;
  } catch (error) {
    console.error("Error fetching progress:", error);
    throw new Error(error as string);
  }
};
