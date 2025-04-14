import { anyString, instance, mock, verify, when } from "@typestrong/ts-mockito";
import { StatusService } from "../../src/components/model/service/StatusService";
import { UserService } from "../../src/components/model/service/UserService";
import 'isomorphic-fetch';
import {
  PostStatusPresenter,
  PostStatusView,
} from "../../src/components/presenters/PostStatusPresenter";

describe("Status Integration Test", () => {
  let statusService: StatusService;
  let userService: UserService;
  let mockPostStatusView: PostStatusView;
  let postStatusPresenter: PostStatusPresenter;

  let loginAlias = "@test";
  let loginPassword = "password";

  let postText: string;

  beforeAll(() => {
    postText = "Test Post " + Date.now();

    statusService = new StatusService();
    userService = new UserService();

    mockPostStatusView = mock<PostStatusView>();
    const mockpostStatusViewInstance = instance(mockPostStatusView);

    postStatusPresenter = new PostStatusPresenter(
      mockpostStatusViewInstance
    );
  });

  

  test("Status integration testing, Verify message was displayed, verify it was appended to users story", async () => {
    const [user, authToken] = await userService.login(
      loginAlias,
      loginPassword
    );
    if (user == undefined || authToken == undefined) {
      throw new Error("Error with logging in");
    }

    verify(user.alias == "@test");

    await postStatusPresenter.submitPost(postText, user, authToken);

    verify(
      mockPostStatusView.displayInfoMessage("Posting status...", 0)
    ).once();
    verify(
      mockPostStatusView.displayInfoMessage("Status posted!", 2000)
    ).once();

    const [statuses, _] = await statusService.loadMoreStoryItems(
      authToken,
      "@test",
      10,
      null
    );

    await userService.logout(authToken);

    expect(statuses).not.toBeNull();
    expect(statuses.length).toBeGreaterThan(0);
    expect(statuses[0].post).toBe(postText);
  }, 15000);
});
