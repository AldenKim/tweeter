import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface AppNavbarView {
  displayInfoMessage(message: string, duration: number, bootstrapClasses?: string): void;
  displayErrorMessage(message: string, bootstrapClasses?: string): void;
  clearLastInfoMessage(): void;
  clearUserInfo(): void;
}

export class AppNavbarPresenter {
    private view: AppNavbarView
    private service: UserService;

    public constructor(view: AppNavbarView) {
        this.view = view;
        this.service = new UserService();
    }

  public async logOut(authToken: AuthToken) {
    this.view.displayInfoMessage("Logging Out...", 0);

    try {
      await this.service.logout(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    }
  }
}
