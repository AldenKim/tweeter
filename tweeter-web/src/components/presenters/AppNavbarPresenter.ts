import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { MessageView, Presenter } from "./Presenter";

export interface AppNavbarView extends MessageView {
  clearUserInfo(): void;
}

export class AppNavbarPresenter extends Presenter {
  private service: UserService;

  public constructor(view: AppNavbarView) {
    super(view);
    this.service = new UserService();
  }

  protected get view(): AppNavbarView {
    return super.view as AppNavbarView;
  }

  public async logOut(authToken: AuthToken) {
    this.view.displayInfoMessage("Logging Out...", 0);

    this.doFailureReportingOperation(async () => {
      await this.service.logout(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    }, "log user out");
  }
}
