import { Query } from "react-native-appwrite";
import {
  calculateLevel,
  calculateRank,
  checkLevelUp,
  checkRankUp,
} from "../progression";
import { account, config, databases } from "./config";

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) {
      throw Error;
    }
    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userTableId,
      [Query.equal("userId", currentAccount.$id)]
    );
    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    console.error(error);
    throw new Error(error as string);
  }
};

export const awardXP = async (userId: string, xpAmount: number) => {
  try {
    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userTableId,
      [Query.equal("userId", userId)]
    );

    if (!currentUser.documents[0]) throw new Error("User not found");

    const user = currentUser.documents[0];
    const oldXP = user.xp || 0;
    const newXP = oldXP + xpAmount;

    // Calculate new level and rank using progression system
    const newLevel = calculateLevel(newXP);
    const newRank = calculateRank(newLevel);

    // Check for level up and rank up
    const { leveledUp, oldLevel } = checkLevelUp(oldXP, newXP);
    const { rankedUp, oldRank } = checkRankUp(oldLevel, newLevel);

    await databases.updateDocument(
      config.databaseId,
      config.userTableId,
      user.$id,
      {
        xp: newXP,
        level: newLevel,
        rank: newRank,
      }
    );

    return {
      newXP,
      newLevel,
      newRank,
      leveledUp,
      rankedUp,
      oldLevel,
      oldRank,
    };
  } catch (error) {
    console.error("Error awarding XP:", error);
    throw new Error(error as string);
  }
};

export const updateStreak = async (userId: string) => {
  try {
    console.log('updateStreak called with userId:', userId);
    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userTableId,
      [Query.equal("userId", userId)]
    );

    console.log('Found user documents:', currentUser.documents.length);
    if (!currentUser.documents[0]) {
      console.log('No user document found for userId:', userId);
      // Return default streak data instead of throwing error
      return {
        streak: 1,
        streakMaintained: false,
        streakIncremented: true,
        isNewStreak: true,
      };
    }

    const user = currentUser.documents[0];
    const lastActivity = user.lastActivityDate
      ? new Date(user.lastActivityDate)
      : null;
    const today = new Date();

    // Reset time to midnight for comparison
    const todayMidnight = new Date(today);
    todayMidnight.setHours(0, 0, 0, 0);

    let newStreak = user.streak || 0;
    let streakMaintained = false;
    let streakIncremented = false;

    if (!lastActivity) {
      // First time user completes a challenge
      newStreak = 1;
      streakIncremented = true;
      streakMaintained = true;
    } else {
      const lastActivityMidnight = new Date(lastActivity);
      lastActivityMidnight.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor(
        (todayMidnight.getTime() - lastActivityMidnight.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 0) {
        // Same day - streak maintained but not incremented
        streakMaintained = true;
        streakIncremented = false;
      } else if (daysDiff === 1) {
        // Next day - increment streak
        newStreak += 1;
        streakMaintained = true;
        streakIncremented = true;
      } else {
        // Missed days - reset streak to 1
        newStreak = 1;
        streakMaintained = false;
        streakIncremented = true;
      }
    }

    await databases.updateDocument(
      config.databaseId,
      config.userTableId,
      user.$id,
      {
        streak: newStreak,
        lastActivityDate: new Date().toISOString(),
      }
    );

    return {
      streak: newStreak,
      streakMaintained,
      streakIncremented,
      isNewStreak: newStreak === 1 && !streakMaintained,
    };
  } catch (error) {
    console.error("Error updating streak:", error);
    throw new Error(error as string);
  }
};
