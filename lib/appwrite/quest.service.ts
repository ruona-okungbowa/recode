import { Quest } from "@/type";
import { Query } from "react-native-appwrite";
import { config, databases } from "./config";

// Get all the quests for a topic
export const getQuestsByTopic = async (topicId: string): Promise<Quest[]> => {
  try {
    const quests = await databases.listDocuments(
      config.databaseId,
      config.questsTableId,
      [Query.equal("topicId", topicId), Query.orderAsc("order")]
    );
    return quests.documents as Quest[];
  } catch (error) {
    console.error("Error fetching quests:", error);
    throw new Error(error as string);
  }
};

// Get quest by ID
export const getQuestById = async (questId: string): Promise<Quest> => {
  try {
    const quest = await databases.getDocument(
      config.databaseId,
      config.questsTableId,
      questId
    );
    return quest as Quest;
  } catch (error) {
    console.error("Error fetching quest:", error);
    throw new Error(error as string);
  }
};

export const getQuestsByDomain = async (domainId: string): Promise<Quest[]> => {
  try {
    const quests = await databases.listDocuments(
      config.databaseId,
      config.questsTableId,
      [Query.equal("domainsId", domainId), Query.orderAsc("order")]
    );
    return quests.documents as Quest[];
  } catch (error) {
    console.error("Error fetching quests:", error);
    throw new Error(error as string);
  }
};

// Complete a quest
export const completeQuest = async (
  userId: string,
  questId: string
): Promise<void> => {
  try {
    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userTableId,
      [Query.equal("userId", userId)]
    );

    if (!currentUser.documents[0]) throw new Error("User not found");

    const user = currentUser.documents[0];
    const completedQuests = user.completedQuests || [];

    if (!completedQuests.includes(questId)) {
      await databases.updateDocument(
        config.databaseId,
        config.userTableId,
        user.$id,
        {
          completedQuests: [...completedQuests, questId],
        }
      );
    }
    console.log("Quest completed successfully");
  } catch (error) {
    console.error("Error completing quest:", error);
    throw new Error(error as string);
  }
};

export const checkQuestCompletion = async (
  userId: string,
  questId: string
): Promise<boolean> => {
  try {
    // Get the quest
    const quest = await getQuestById(questId);

    // Get user's completed challenges
    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userTableId,
      [Query.equal("userId", userId)]
    );

    if (!currentUser.documents[0]) throw new Error("User not found");

    const user = currentUser.documents[0];
    const completedChallenges = user.completedChallenges || [];

    // Check if all quest challenges are completed
    const allChallengesCompleted = quest.challengeIds.every((challengeId) =>
      completedChallenges.includes(challengeId)
    );

    return allChallengesCompleted;
  } catch (error) {
    console.error("Error checking quest completion:", error);
    throw new Error(error as string);
  }
};
