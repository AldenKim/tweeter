import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import { PostStatusPresenter } from "../../../src/components/presenters/PostStatusPresenter";
import userEvent from "@testing-library/user-event";


describe("PostStatus Component", () => {
    it("starts with the sign-in button disabled", () => {
        const { postStatusButton, clearButton } = renderPostStatusAndGetElemnt();

        expect(postStatusButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
    });
});

const renderPostStatus = (presenter?: PostStatusPresenter) => {
    return render(
      <MemoryRouter>
        {!!presenter ? (
          <PostStatus presenter={presenter} />
        ) : (
          <PostStatus />
        )}
      </MemoryRouter>
    );
  };

  const renderPostStatusAndGetElemnt = (
    presenter?: PostStatusPresenter
  ) => {
    const user = userEvent.setup();
  
    renderPostStatus(presenter);
  
    const postStatusButton = screen.getByRole("button", { name: /Post Status/i });
    const postField = screen.getByLabelText("postStatusText");
    const clearButton = screen.getByRole("button", { name: /Clear/i });
  
    return { postStatusButton, clearButton, postField, user };
  };