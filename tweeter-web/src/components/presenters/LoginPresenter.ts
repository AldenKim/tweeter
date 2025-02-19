import { UserService } from "../model/service/UserService";
import {
  AuthenticationPresenter,
  AuthenticationView,
} from "./AuthenticationPresenter";

export class LoginPresenter extends AuthenticationPresenter {
  private service: UserService;

  public constructor(view: AuthenticationView) {
    super(view);
    this.service = new UserService();
  }

  protected get view(): AuthenticationView {
    return super.view as AuthenticationView;
  }

  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl?: string
  ) {
    await this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      const [user, authToken] = await this.service.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate("/");
      }
    }, "log user in");

    this.view.setIsLoading(false);
  }
}
