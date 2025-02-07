import { To, NavigateOptions } from "react-router-dom";
import { User, AuthToken } from "tweeter-shared";

export interface AuthenticationView {
  setIsLoading: (isLoading: boolean) => void;
  updateUserInfo: (
    currentUser: User,
    displayedUser: User | null,
    authToken: AuthToken,
    remember: boolean
  ) => void;
  navigate: (to: To, options?: NavigateOptions) => void;
  displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
}

export abstract class AuthenticationPresenter {
  private _view: AuthenticationView;

  constructor(view: AuthenticationView) {
    this._view = view;
  }

  protected get view() {
    return this._view;
  }
}
