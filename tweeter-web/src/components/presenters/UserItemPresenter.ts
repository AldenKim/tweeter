import { User } from "tweeter-shared";
import { PageItemPresenter } from "./PageItemPresenter";
import { FollowService } from "../model/service/FollowService";

export abstract class UserItemPresenter extends PageItemPresenter<
  User,
  FollowService
> {
  protected createService(): FollowService {
    return new FollowService();
  }
}
