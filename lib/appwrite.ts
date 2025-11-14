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
};

export const client = new Client();
client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);

interface CreateUserParams {
  email?: string;
  password?: string;
  name?: string;
}

interface SignInParams {
  email?: string;
  password?: string;
}

export const createUser = async ({
  email,
  password,
  name,
}: CreateUserParams) => {
  try {
    const newUser = await account.create(ID.unique(), email!, password!);

    if (!newUser) throw Error;

    await signIn({ email, password });
    const avatarUrl = avatar.getInitials(name);

    return await databases.createDocument(
      config.databaseId,
      config.userTableId,
      ID.unique(),
      {
        userId: newUser.$id,
        email,
        name,
        avatar: avatarUrl,
      }
    );
  } catch (error) {
    throw new Error(error as string);
  }
};

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
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
      [Query.equal("accountId", currentAccount.$id)]
    );
    if (!currentUser) throw Error;
    return currentUser.documents[0];
  } catch (error) {
    console.error(error);
    throw new Error(error as string);
  }
};
