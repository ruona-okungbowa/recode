import { Query } from "react-native-appwrite";
import { config, databases } from "./config";

// Get all the quests for a topic
export const getQuestsByTopic = async (topicId: string) => {
  try {
    const quests = await databases.listDocuments(
      config.databaseId,
      config.questsTableId,
      [Query.equal("topicId", topicId)]
    );
    return quests.documents;
  } catch (error) {
    console.error("Error fetching quests:", error);
    throw new Error(error as string);
  }
};

// Get quest by ID
export const getQuestById = async (questId: string) => {
  try {
    const quest = await databases.getDocument(
      config.databaseId,
      config.questsTableId,
      questId
    );

    // Parse theoryContent if it's a JSON string
    if (typeof quest.theoryContent === "string") {
      quest.theoryContent = JSON.parse(quest.theoryContent);
    }

    return quest;
  } catch (error) {
    console.error("Error fetching quest:", error);
    throw new Error(error as string);
  }
};

// Complete a quest
export const completeQuest = async (userId: string, questId: string) => {
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
  } catch (error) {
    console.error("Error completing quest:", error);
    throw new Error(error as string);
  }
};
