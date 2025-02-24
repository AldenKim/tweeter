import { AuthToken } from "tweeter-shared";
import {
  AppNavbarPresenter,
  AppNavbarView,
} from "../../src/components/presenters/AppNavbarPresenter";
import {
  mock,
  instance,
  verify,
  spy,
  when,
  anything,
  capture,
} from "@typestrong/ts-mockito";
import { UserService } from "../../src/components/model/service/UserService";

describe("AppNavbarPresenter", () => {
  let mockAppNavbarPresenterView: AppNavbarView;
  let appNavBarPresenter: AppNavbarPresenter;
  let mockUserService: UserService;

  const authToken = new AuthToken("authtoken", Date.now());

  beforeEach(() => {
    mockAppNavbarPresenterView = mock<AppNavbarView>();
    const mockAppNavbarPresenterViewInstance = instance(
      mockAppNavbarPresenterView
    );

    const appNavbarPresenterSpy = spy(
      new AppNavbarPresenter(mockAppNavbarPresenterViewInstance)
    );
    appNavBarPresenter = instance(appNavbarPresenterSpy);

    mockUserService = mock<UserService>();
    const mockUserServiceInstance = instance(mockUserService);

    when(appNavbarPresenterSpy.service).thenReturn(mockUserServiceInstance);
  });

  it("tells the view to display a logging out message", async () => {
    await appNavBarPresenter.logOut(authToken);

    verify(
      mockAppNavbarPresenterView.displayInfoMessage("Logging Out...", 0)
    ).once();
  });

  it("calls logout on the user service with the correct authtoken", async () => {
    await appNavBarPresenter.logOut(authToken);

    verify(mockUserService.logout(authToken)).once();
  });

  it("presenter tells the view to clear the last info message and clear the user info when successful", async () => {
    await appNavBarPresenter.logOut(authToken);

    verify(mockAppNavbarPresenterView.clearLastInfoMessage()).once();
    verify(mockAppNavbarPresenterView.clearUserInfo()).once();

    verify(mockAppNavbarPresenterView.displayErrorMessage(anything())).never();
  });

  it("presenter tells the view to display an error message and does not tell it to clear the last info message or clear the user info when not successful", async () => {
    const error = new Error("An error occured");
    when(mockUserService.logout(authToken)).thenThrow(error);

    await appNavBarPresenter.logOut(authToken);

    verify(mockAppNavbarPresenterView.displayErrorMessage("Failed to log user out because of exception: An error occured")).once();

    verify(mockAppNavbarPresenterView.clearLastInfoMessage()).never();
    verify(mockAppNavbarPresenterView.clearUserInfo()).never();
  });
});
