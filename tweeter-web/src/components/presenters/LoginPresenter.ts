import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface LoginView {
    setIsLoading: (isLoading: boolean) => void;
    updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void
    navigate: (path: string) => void;
    displayErrorMessage: (message: string, bootstrapClasses?: string) => void
}

export class LoginPresenter {
    private view: LoginView;
    private service: UserService;

    public constructor(view: LoginView) {
        this.view = view;
        this.service = new UserService();
    }

  public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl?: string){
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.service.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate("/");
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user in because of exception: ${error}`
      );
    } finally {
      this.view.setIsLoading(false);
    }
  };
}
