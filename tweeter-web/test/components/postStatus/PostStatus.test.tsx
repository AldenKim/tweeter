import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { PostStatusPresenter } from "../../../src/components/presenters/PostStatusPresenter";
import userEvent from "@testing-library/user-event";
import { anything, instance, mock, verify } from "@typestrong/ts-mockito";
import { AuthToken, User } from "tweeter-shared";
import userInfoHook from "../../../src/components/userInfo/UserInfoHook";

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
  __esModule: true,
  default: jest.fn(),
}));

describe("PostStatus Component", () => {
  const userTest = new User("test", "test", "test", "test");
  const authToken = new AuthToken("testToken", Date.now());

  beforeEach(() => {
    (userInfoHook as jest.Mock).mockReturnValue({
      currentUser: userTest,
      authToken: authToken,
    });
  });

  it("starts with the post status and clear button disabled", () => {
    const { postStatusButton, clearButton } = renderPostStatusAndGetElemnt();

    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("enables post status and clear button when text field has text", async () => {
    const { postStatusButton, clearButton, postField, user } =
      renderPostStatusAndGetElemnt();

    await user.type(postField, "Hello World");

    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  it("disables the post status and clear button when field is cleared", async () => {
    const { postStatusButton, clearButton, postField, user } =
      renderPostStatusAndGetElemnt();

    await user.type(postField, "Hello World");

    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await user.clear(postField);

    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  it("calls the presenters post status method with correct parameters when the post status button is pressed", async () => {
      const mockPresenter = mock<PostStatusPresenter>();
      const mockPresenterInstance = instance(mockPresenter);
  
      const post = "Hello World";
  
      const { postStatusButton, postField, user } =
        renderPostStatusAndGetElemnt(mockPresenterInstance);
  
        await user.type(postField, post);

        await user.click(postStatusButton);
  
        verify(mockPresenter.submitPost(post, userTest, authToken)).once()
    });
});

const renderPostStatus = (presenter?: PostStatusPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? <PostStatus presenter={presenter} /> : <PostStatus />}
    </MemoryRouter>
  );
};

const renderPostStatusAndGetElemnt = (presenter?: PostStatusPresenter) => {
  const user = userEvent.setup();

  renderPostStatus(presenter);

  const postStatusButton = screen.getByRole("button", { name: /Post Status/i });
  const clearButton = screen.getByRole("button", { name: /Clear/i });
  const postField = screen.getByLabelText("postStatusText");

  return { postStatusButton, clearButton, postField, user };
};
