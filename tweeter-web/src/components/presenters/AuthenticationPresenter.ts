import { To, NavigateOptions } from "react-router-dom";
import { User, AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model/service/UserService";

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
  private _service: UserService;
  constructor(view: AuthenticationView) {
    super(view);
    this._service = new UserService();
  }

  protected get service(): UserService {
    return this._service;
  }

  //Pass in a function instead? 
  public async doAuthentication(
    operation:() => Promise<[User, AuthToken]>,
    rememberMe: boolean,
    originalUrl?: string
  ) {
    await this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      const [user, authToken] = await operation();

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      this.navigate(originalUrl);
    }, this.getItemDescription());

    this.view.setIsLoading(false);
  }

  protected abstract navigate(originalUrl?: string): void;

  protected abstract getItemDescription(): string;
}
