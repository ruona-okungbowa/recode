import { Query } from "react-native-appwrite";
import { config, databases } from "./config";

export const getAllDomains = async () => {
  try {
    const domains = await databases.listDocuments(
      config.databaseId,
      config.domainsTableId
    );
    return domains.documents;
  } catch (error) {
    console.error("Error fetching domains", error);
    throw new Error(error as string);
  }
};

// Get all topics for a specific domain
export const getTopicsByDomain = async (domainId: string) => {
  try {
    const topics = await databases.listDocuments(
      config.databaseId,
      config.topicsTableId,
      [Query.equal("domainId", domainId), Query.orderAsc("order")]
    );
    return topics.documents;
  } catch (error) {
    console.error("❌ Error fetching topics:", error);
    throw new Error(error as string);
  }
};

// Get a specific topic by ID
export const getTopicById = async (topicId: string) => {
  try {
    const topic = await databases.getDocument(
      config.databaseId,
      config.topicsTableId,
      topicId
    );
    return topic;
  } catch (error) {
    console.error("❌ Error fetching topic:", error);
    console.error("❌ Failed with topicId:", topicId);
    throw new Error(error as string);
  }
};
