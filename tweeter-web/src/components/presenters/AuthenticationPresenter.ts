import { To, NavigateOptions } from "react-router-dom";
import { User, AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface AuthenticationView extends View {
  setIsLoading: (isLoading: boolean) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  navigate: (to: To, options?: NavigateOptions) => void;
}

export abstract class AuthenticationPresenter extends Presenter<AuthenticationView> {
  constructor(view: AuthenticationView) {
    super(view);
  }
}
