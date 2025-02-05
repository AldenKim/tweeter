import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { NavigateOptions, To } from "react-router-dom";

export interface RegisterView {
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

export class RegisterPresenter {
  private view: RegisterView;
  private service: UserService;

  public constructor(view: RegisterView) {
    this.view = view;
    this.service = new UserService();
  }

 public async doRegister(firstName: string, lastName:string, 
    alias: string, password: string, imageBytes: 
    Uint8Array<ArrayBufferLike>, imageFileExtension: string, rememberMe: boolean) {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.service.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension
      );

      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate("/");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`
      );
    } finally {
      this.view.setIsLoading(false);
    }
  };
}
