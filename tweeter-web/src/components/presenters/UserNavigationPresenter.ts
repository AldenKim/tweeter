import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";
import { Presenter, View } from "./Presenter";

export interface UserNavigationView extends View {
  extractAlias: (value: string) => string;
  setDisplayedUser: (user: User) => void;
}

export class UserNavigationPresenter extends Presenter {
  private service: UserService;

  public constructor(view: UserNavigationView) {
    super(view);
    this.service = new UserService();
  }

  protected get view(): UserNavigationView {
    return super.view as UserNavigationView;
  }

  public async navigateToUser(
    target: string,
    authToken: AuthToken | null,
    currentUser: User | null
  ) {
    await this.doFailureReportingOperation(async () => {
      const alias = this.view.extractAlias(target);

      const user = await this.service.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    }, "get user");
  }
}
