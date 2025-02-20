import { AuthenticationPresenter } from "./AuthenticationPresenter";

export class RegisterPresenter extends AuthenticationPresenter {
  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean
  ) {
    await this.doAuthentication(
      async () =>
        this.service.register(
          firstName,
          lastName,
          alias,
          password,
          imageBytes,
          imageFileExtension
        ),
      rememberMe
    );
  }

  protected navigate(): void {
    this.view.navigate("/");
  }
  protected getItemDescription(): string {
    return "register user";
  }
}
