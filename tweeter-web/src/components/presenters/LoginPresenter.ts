import { AuthenticationPresenter } from "./AuthenticationPresenter";

export class LoginPresenter extends AuthenticationPresenter {
  public async doLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl?: string
  ) {
    await this.doAuthentication(
      async () => this.service.login(alias, password),
      rememberMe,
      originalUrl
    );
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
