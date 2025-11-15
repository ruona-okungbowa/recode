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
    console.log("🔍 Fetching topics for domainId:", domainId);
    const topics = await databases.listDocuments(
      config.databaseId,
      config.topicsTableId,
      [Query.equal("domainId", domainId), Query.orderAsc("order")]
    );
    console.log("✅ Found topics:", topics.documents.length);
    console.log(
      "📋 Topics:",
      topics.documents.map((t) => ({
        $id: t.$id,
        name: t.name,
        domainId: t.domainId,
      }))
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
    console.log("🔍 Fetching topic by ID:", topicId);
    console.log("📦 Database ID:", config.databaseId);
    console.log("📋 Topics Table ID:", config.topicsTableId);
    const topic = await databases.getDocument(
      config.databaseId,
      config.topicsTableId,
      topicId
    );
    console.log("✅ Found topic:", topic.name);
    return topic;
  } catch (error) {
    console.error("❌ Error fetching topic:", error);
    console.error("❌ Failed with topicId:", topicId);
    throw new Error(error as string);
  }
};
