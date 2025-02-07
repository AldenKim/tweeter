import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserNavigationView {
  extractAlias: (value: string) => string;
  setDisplayedUser: (user: User) => void;
  displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
}

export class UserNavigationPresenter {
  private view: UserNavigationView;
  private service: UserService;

  public constructor(view: UserNavigationView) {
    this.view = view;
    this.service = new UserService();
  }

  public async navigateToUser(
    target: string,
    authToken: AuthToken | null,
    currentUser: User | null
  ) {
    try {
      const alias = this.view.extractAlias(target);

      const user = await this.service.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`
      );
    }
  }
}
