import { CreateUserParams, SignInParams } from "@/type";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";

export const config = {
  platform: "com.ruona.recode",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: "6917909200208121b4e0",
  userTableId: "user",
  domainsTableId: "domains",
  challengesTableId: "challenges",
  topicsTableId: "topics",
  userProgressId: "userprogress",
};

export const client = new Client();
client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);

export const createUser = async ({
  email,
  password,
  name,
}: CreateUserParams) => {
  try {
    const newUser = await account.create(ID.unique(), email!, password!, name);

    if (!newUser) throw new Error("User not created");

    await account.createEmailPasswordSession(email, password);
    // fetch acccount info
    const currentAccount = await account.get();

    const avatarUrl = avatar.getInitials(name);
    await databases.createDocument(
      config.databaseId,
      config.userTableId,
      ID.unique(),
      {
        userId: newUser.$id,
        email,
        name,
        avatar: avatarUrl,
        xp: 0,
        level: 1,
        rank: "E-Rank",
        unlockedDomains: ["data-structures"],
        completedChallenges: [],
      }
    );

    return currentAccount;
  } catch (error) {
    throw new Error(error as string);
  }
};

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    console.log("Session created:", session);

    const currentAccount = await account.get();
    return currentAccount;
  } catch (error) {
    throw new Error(error as string);
  }
};

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

// Helper function to parse challenge JSON strings
const parseChallenge = (challenge: any) => {
  try {
    // Only parse if the field is a string AND looks like JSON (starts with { or [)
    const parseIfNeeded = (field: any) => {
      if (
        typeof field === "string" &&
        (field.startsWith("{") || field.startsWith("["))
      ) {
        try {
          return JSON.parse(field);
        } catch {
          return field;
        }
      }
      return field;
    };

    return {
      ...challenge,
      content: parseIfNeeded(challenge.content),
      correctAnswer: parseIfNeeded(challenge.correctAnswer),
    };
  } catch (error) {
    console.error("Error parsing challenge:", error);
    return challenge;
  }
};

// Get challenges for a specific topic
export const getChallengesByTopic = async (topicId: string) => {
  try {
    const challenges = await databases.listDocuments(
      config.databaseId,
      config.challengesTableId,
      [Query.equal("topicId", topicId)]
    );
    // Parse JSON strings in each challenge
    return challenges.documents.map(parseChallenge);
  } catch (error) {
    console.error("Error fetching challenges:", error);
    throw new Error(error as string);
  }
};

// Get a single challenge by ID
export const getChallengeById = async (challengeId: string) => {
  try {
    const challenge = await databases.getDocument(
      config.databaseId,
      config.challengesTableId,
      challengeId
    );
    return parseChallenge(challenge);
  } catch (error) {
    console.error("Error fetching challenge:", error);
    throw new Error(error as string);
  }
};

// Validate user's answer
export const validateAnswer = (
  userAnswer: string,
  correctAnswer: string
): boolean => {
  return userAnswer === correctAnswer;
};

// Award XP to user and update level/rank
export const awardXP = async (userId: string, xpAmount: number) => {
  try {
    // Get current user data
    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userTableId,
      [Query.equal("userId", userId)]
    );

    if (!currentUser.documents[0]) throw new Error("User not found");

    const user = currentUser.documents[0];
    const newXP = (user.xp || 0) + xpAmount;

    // Calculate new level (100 XP per level)
    const newLevel = Math.floor(newXP / 100) + 1;

    // Calculate new rank
    let newRank = "E-Rank";
    if (newLevel >= 61) newRank = "Monarch";
    else if (newLevel >= 51) newRank = "S-Rank";
    else if (newLevel >= 41) newRank = "A-Rank";
    else if (newLevel >= 31) newRank = "B-Rank";
    else if (newLevel >= 21) newRank = "C-Rank";
    else if (newLevel >= 11) newRank = "D-Rank";

    // Update user document
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
      leveledUp: newLevel > (user.level || 1),
    };
  } catch (error) {
    console.error("Error awarding XP:", error);
    throw new Error(error as string);
  }
};

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
          timeSpent: 0,
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
