import { User, AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import {
  AuthenticationPresenter,
  AuthenticationView,
} from "./AuthenticationPresenter";

type LoginParams = {
  alias: string;
  password: string;
};

export class LoginPresenter extends AuthenticationPresenter<LoginParams> {
  protected authenticate(authParams: LoginParams): Promise<[User, AuthToken]> {
    return this.service.login(authParams.alias, authParams.password);
  }

  protected navigate(originalUrl?: string): void {
    if (!!originalUrl) {
      this.view.navigate(originalUrl);
    } else {
      this.view.navigate("/");
    }
  }

  protected getItemDescription(): string {
    return "log user in";
  }
}
