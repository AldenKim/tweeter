import {
  anything,
  capture,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import { StatusService } from "../../src/components/model/service/StatusService";
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/components/presenters/PostStatusPresenter";
import { AuthToken, Status, User } from "tweeter-shared";

describe("PostStatusPresenter", () => {
  let mockPostStatusView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;
  let mockStatusService: StatusService;

  const authToken = new AuthToken("authtoken", Date.now());
  const user = new User("test", "test", "testAlias", "tempImage");
  const postString = "Hello world";

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockpostStatusViewInstance = instance(mockPostStatusView);

    const postStatusPresenterSpy = spy(
      new PostStatusPresenter(mockpostStatusViewInstance)
    );
    postStatusPresenter = instance(postStatusPresenterSpy);

    mockStatusService = mock<StatusService>();
    const mockUserServiceInstance = instance(mockStatusService);

    when(postStatusPresenterSpy.service).thenReturn(mockUserServiceInstance);
  });

  it("presenter tells the view to display a posting status message", async () => {
    await postStatusPresenter.submitPost(postString, user, authToken);

    verify(
      mockPostStatusView.displayInfoMessage("Posting status...", 0)
    ).once();
  });

  it("presenter calls postStatus on the post status service with the correct status string and auth token", async () => {
    await postStatusPresenter.submitPost(postString, user, authToken);

    const [capturedAuthToken, capturedStatus] = capture(
      mockStatusService.postStatus
    ).last();

    verify(mockStatusService.postStatus(authToken, anything())).once();

    expect(capturedAuthToken).toEqual(authToken);
    expect(capturedStatus.post).toEqual(postString);
    expect(capturedStatus.user).toEqual(user);
  });

  it("the presenter tells the view to clear the last info message, clear the post, and display a status posted message when successful", async () => {
    await postStatusPresenter.submitPost(postString, user, authToken);

    verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(mockPostStatusView.setPost("")).once();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000)
    ).once();

    verify(mockPostStatusView.displayErrorMessage(anything())).never();
  });

  it("the presenter tells the view to display an error message and clear the last info message and does not tell it to clear the post or display a status posted message when not successful", async () => {
    const error = new Error("An error occured");
    when(mockStatusService.postStatus(authToken, anything())).thenThrow(error);
    
    await postStatusPresenter.submitPost(postString, user, authToken);

    verify(mockPostStatusView.displayErrorMessage("Failed to post the status because of exception: An error occured")).once();

    verify(mockPostStatusView.setPost("")).never();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000)
    ).never();
  });
});
