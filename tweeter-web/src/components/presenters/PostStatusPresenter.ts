import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { MessageView, Presenter } from "./Presenter";

export interface PostStatusView extends MessageView {
  setIsLoading: (isLoading: boolean) => void;
  setPost: (post: string) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private _service: StatusService | null = null;

  public constructor(view: PostStatusView) {
    super(view);
  }

  public get service() {
    if (this._service == null) {
      this._service = new StatusService();
    }
    return this._service;
  }

  public async submitPost(
    post: string,
    currentUser: User | null,
    authToken: AuthToken | null
  ) {
    await this.doFailureReportingOperation(async () => {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser!, Date.now());

      await this.service.postStatus(authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    }, "post the status");

    this.view.clearLastInfoMessage();
    this.view.setIsLoading(false);
  }
}
