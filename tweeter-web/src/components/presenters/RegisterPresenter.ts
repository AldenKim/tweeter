import { User, AuthToken } from "tweeter-shared";
import {
  AuthenticationPresenter,
  AuthenticationView,
} from "./AuthenticationPresenter";

type RegisterParams = {
  firstName: string;
  lastName: string;
  alias: string;
  password: string;
  imageBytes: Uint8Array;
  imageFileExtension: string;
};

export class RegisterPresenter extends AuthenticationPresenter<RegisterParams> {
  protected authenticate(registerParams: RegisterParams): Promise<[User, AuthToken]> {
    return this.service.register(
      registerParams.firstName,
      registerParams.lastName,
      registerParams.alias,
      registerParams.password,
      registerParams.imageBytes,
      registerParams.imageFileExtension
    );
  }
  
  protected navigate(originalUrl?: string): void {
    this.view.navigate("/");
  }
  protected getItemDescription(): string {
    return "register user"
  }
}
