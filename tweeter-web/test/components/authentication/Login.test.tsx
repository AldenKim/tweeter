import { MemoryRouter } from "react-router-dom";
import Login from "../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import React from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { LoginPresenter } from "../../../src/components/presenters/LoginPresenter";
import { anything, instance, mock, verify } from "@typestrong/ts-mockito";

library.add(fab);

describe("Login Component", () => {
  it("starts with the sign-in button disabled", () => {
    const { signInButton } = renderLoginAndGetElemnt("/");

    expect(signInButton).toBeDisabled();
  });

  it("enables the sign-in button if both alias and password field have text", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElemnt("/");

    await user.type(aliasField, "testAlias");
    await user.type(passwordField, "testPassword");

    expect(signInButton).toBeEnabled();
  });

  it("disables the sign in button if either field is cleared", async () => {
    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElemnt("/");

    await user.type(aliasField, "testAlias");
    await user.type(passwordField, "testPassword");

    expect(signInButton).toBeEnabled();

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "testAlias2");
    expect(signInButton).toBeEnabled();

    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });

  it("calls the presenters login method with correct parameters when the sign-in button is pressed", async () => {
    const mockPresenter = mock<LoginPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const originalUrl = "http://testurl.com";
    const alias = "@testAlias";
    const password = "testPassword"

    const { signInButton, aliasField, passwordField, user } =
      renderLoginAndGetElemnt(originalUrl, mockPresenterInstance);

      await user.type(aliasField, alias);
      await user.type(passwordField, password);

      await user.click(signInButton);

      verify(mockPresenter.doLogin(alias, password, anything(), originalUrl)).once()
  });
});

const renderLogin = (originalUrl: string, presenter?: LoginPresenter) => {
  return render(
    <MemoryRouter>
      {!!presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
      )}
    </MemoryRouter>
  );
};

const renderLoginAndGetElemnt = (
  originalUrl: string,
  presenter?: LoginPresenter
) => {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign in/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { signInButton, aliasField, passwordField, user };
};
