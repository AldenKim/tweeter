import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface AppNavbarView extends View {
  displayInfoMessage(message: string, duration: number, bootstrapClasses?: string): void;
  clearLastInfoMessage(): void;
  clearUserInfo(): void;
}

export class AppNavbarPresenter extends Presenter{
    private service: UserService;

    public constructor(view: AppNavbarView) {
        super(view);
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
