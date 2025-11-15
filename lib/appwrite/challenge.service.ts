import { Query } from "react-native-appwrite";
import { config, databases } from "./config";

// Helper function to parse challenge JSON strings
const parseChallenge = (challenge: any) => {
  try {
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
