import { AuthToken, FakeData, User } from "tweeter-shared";
import useToastListener from "../toaster/ToastListenerHook";
import userInfoHook from "./UserInfoHook";

interface UserNavigation {
  navigate: (event: React.MouseEvent) => Promise<void>;
  extractAlias: (value: string) => string;
  getUser: (authToken: AuthToken, alias: string) => Promise<User | null>;
}

const userNavigationHook = (): UserNavigation => {
  const { displayErrorMessage } = useToastListener();
  
  const { setDisplayedUser, currentUser, authToken } =
      userInfoHook();
      
  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    try {
      const alias = extractAlias(event.target.toString());

      const user = await getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          setDisplayedUser(currentUser!);
        } else {
          setDisplayedUser(user);
        }
      }
    } catch (error) {
      displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  };

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  const getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  };

  return {
    navigate: navigateToUser,
    extractAlias,
    getUser
  };
};

export default userNavigationHook;
