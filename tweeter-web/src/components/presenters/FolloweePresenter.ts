import { AuthToken } from "tweeter-shared";
import { PAGE_SIZE, UserItemPresenter, UserItemView } from "./UserItemPresenter";

export class FolloweePresenter extends UserItemPresenter {
  public constructor(view: UserItemView) {
    super(view);
  }

  protected get view(): UserItemView {
    return super.view as UserItemView;
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    await this.doFailureReportingOperation(async () => {
      const [newItems, hasMore] = await this.service.loadMoreFollowees(
        authToken,
        userAlias,
        PAGE_SIZE,
        this.lastItem
      );

      this.hasMoreItems = hasMore;
      this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    }, "load followees");
  }
}
