import { Account, Avatars, Client, Databases } from "react-native-appwrite";

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
  questsTableId: "quests",
};

export const client = new Client();
client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);
