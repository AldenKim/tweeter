import { AuthToken, FakeData, User } from "tweeter-shared";
import useToastListener from "../toaster/ToastListenerHook";
import userInfoHook from "./UserInfoHook";
import { UserNavigationPresenter, UserNavigationView } from "../presenters/UserNavigationPresenter";
import { useState } from "react";

interface UserNavigation {
  navigate: (event: React.MouseEvent) => Promise<void>;
  extractAlias: (value: string) => string;
}

const userNavigationHook = (): UserNavigation => {
  const { displayErrorMessage } = useToastListener();
  
  const { setDisplayedUser, currentUser, authToken } =
      userInfoHook();
      
  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();
    presenters.navigateToUser(event.target.toString(), authToken, currentUser);
  };

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  const listener: UserNavigationView = {
    extractAlias: extractAlias,
    setDisplayedUser: setDisplayedUser,
    displayErrorMessage: displayErrorMessage,
  }

  const [presenters] =  useState(new UserNavigationPresenter(listener));

  return {
    navigate: navigateToUser,
    extractAlias
  };
};

export default userNavigationHook;
