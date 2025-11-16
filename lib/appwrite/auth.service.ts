import { CreateUserParams, SignInParams } from "@/type";
import { ID } from "react-native-appwrite";
import { account, config, databases } from "./config";

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

    // Assign a random avatar from available avatars (1-10)
    const randomAvatarNumber = Math.floor(Math.random() * 10) + 1;
    const avatarUrl = `avatar${randomAvatarNumber}.png`;

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
        rank: "F-Rank",
        streak: 0,
        lastActivityDate: new Date(),
        unlockedDomains: ["data-structures"],
        completedChallenges: [],
        completedQuests: [],
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
