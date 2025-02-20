import { User } from "tweeter-shared";
import { View } from "./Presenter";
import { PageItemPresenter } from "./PageItemPresenter";
import { FollowService } from "../model/service/FollowService";

export interface UserItemView extends View {
  addItems: (newItems: User[]) => void;
}

export abstract class UserItemPresenter extends PageItemPresenter<
  User,
  FollowService
> {
  protected createService(): FollowService {
    return new FollowService();
  }
}
