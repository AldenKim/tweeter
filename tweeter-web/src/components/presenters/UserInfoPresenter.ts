import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserInfoView {
    setIsFollower: (isFollower: boolean) => void;
    displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
}

export class UserInfoPresenter {
    private view: UserInfoView;
    private service: UserService;

    public constructor(view: UserInfoView) {
        this.view = view;
        this.service = new UserService();
    }

    public async setIsFollowerStatus (
        authToken: AuthToken,
        currentUser: User,
        displayedUser: User
      ) {
        try {
          if (currentUser === displayedUser) {
            this.view.setIsFollower(false);
          } else {
            this.view.setIsFollower(
              await this.service.getIsFollowerStatus(authToken!, currentUser!, displayedUser!)
            );
          }
        } catch (error) {
          this.view.displayErrorMessage(
            `Failed to determine follower status because of exception: ${error}`
          );
        }
    };
}