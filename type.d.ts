import { Models } from "react-native-appwrite";

export interface User extends Models.Document {
  name: string;
  email: string;
  avatar: string;
}

interface CreateUserParams {
  email: string;
  password: string;
  name: string;
}

interface SignInParams {
  email: string;
  password: string;
}
