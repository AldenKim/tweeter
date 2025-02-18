import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
  setIsLoading: (isLoading: boolean) => void;
  setPost: (post: string) => void;
}

export class PostStatusPresenter extends Presenter {
  private service: StatusService;

  public constructor(view: PostStatusView) {
    super(view);
    this.service = new StatusService();
  }

  protected get view(): PostStatusView {
    return super.view as PostStatusView;
  }

  public async submitPost(
    post: string,
    currentUser: User | null,
    authToken: AuthToken | null
  ) {
    try {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser!, Date.now());

      await this.service.postStatus(authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }
  }
}
