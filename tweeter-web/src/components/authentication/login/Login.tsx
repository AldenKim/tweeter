import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import useToastListener from "../../toaster/ToastListenerHook";
import AuthenticationFields from "../AuthenticationFields";
import userInfoHook from "../../userInfo/UserInfoHook";
import { LoginPresenter } from "../../presenters/LoginPresenter";
import { AuthenticationPresenter, AuthenticationView } from "../../presenters/AuthenticationPresenter";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = userInfoHook();
  const { displayErrorMessage } = useToastListener();

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const listener: AuthenticationView = {
    updateUserInfo: updateUserInfo,
    navigate: navigate,
    displayErrorMessage: displayErrorMessage,
  };

  const [presenter]  = useState(new LoginPresenter(listener));

  const inputFieldGenerator = () => {
    return (
      <>
        <AuthenticationFields
          alias={alias}
          password={password}
          setAlias={setAlias}
          setPassword={setPassword}
          doAuth={() =>
            presenter.doLogin(alias, password, rememberMe, props.originalUrl)
          }
          checkSubmitButtonStatus={checkSubmitButtonStatus}
        />
      </>
    );
  };

  const switchAuthenticationMethodGenerator = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldGenerator={inputFieldGenerator}
      switchAuthenticationMethodGenerator={switchAuthenticationMethodGenerator}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={presenter.isLoading}
      submit={() =>
        presenter.doLogin(alias, password, rememberMe, props.originalUrl)
      }
    />
  );
};

export default Login;
