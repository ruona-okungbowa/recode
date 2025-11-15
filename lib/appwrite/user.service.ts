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
    const currentAccount = await account.get();
    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userTableId,
      [Query.equal("userId", currentAccount.$id)]
    );

    if (!currentUser.documents[0]) throw new Error("User not found");

    const user = currentUser.documents[0];
    const lastActivity = user.lastActivityDate;
    const today = new Date();

    // Reset time to midnight for comparison
    lastActivity.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor(
      (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    );

    let newStreak = user.streak || 0;

    if (daysDiff === 0) {
      // Same day, no change
      return { streak: newStreak, streakMaintained: true };
    } else if (daysDiff === 1) {
      // Yesterday, increment streak
      newStreak += 1;
    } else {
      // Missed days, reset streak
      newStreak = 1;
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

    return { streak: newStreak, streakMaintained: daysDiff <= 1 };
  } catch (error) {
    console.error("Error updating streak:", error);
    throw new Error(error as string);
  }
};
