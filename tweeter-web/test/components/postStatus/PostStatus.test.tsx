import { render } from "@testing-library/react";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { MemoryRouter } from "react-router-dom";
import React from "react";

describe("PostStatus Component", () => {
    it("starts with the sign-in button disabled", () => {

    });
});

const renderPostStatus = (originalUrl: string, presenter?: LoginPresenter) => {
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