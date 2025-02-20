import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import { Status, User } from "tweeter-shared";
import userInfoHook from "./components/userInfo/UserInfoHook";
import { FolloweePresenter } from "./components/presenters/FolloweePresenter";
import { FollowerPresenter } from "./components/presenters/FollowerPresenter";
import { StoryPresenter } from "./components/presenters/StoryPresenter";
import ItemScroller from "./components/mainLayout/ItemScroller";
import { PageItemView } from "./components/presenters/PageItemPresenter";
import { StatusService } from "./components/model/service/StatusService";
import { FeedPresenter } from "./components/presenters/FeedPresenter";
import StatusItem from "./components/statusItem/StatusItem";
import UserItem from "./components/userItem/UserItem";
import { FollowService } from "./components/model/service/FollowService";

const App = () => {
  const { currentUser, authToken } = userInfoHook();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/feed" />} />
        <Route
          path="feed"
          element={
            <ItemScroller<Status, StatusService>
              key={1}
              presenterGenerator={(view: PageItemView<Status>) => new FeedPresenter(view)}
              itemComponentGenerator={(item: Status) => <StatusItem status={item} user={item.user} />}
            />
          }
        />
        <Route
          path="story"
          element={
            <ItemScroller<Status, StatusService>
              key={2}
              presenterGenerator={(view: PageItemView<Status>) => new StoryPresenter(view)}
              itemComponentGenerator={(item: Status) => <StatusItem status={item} user={item.user} />
              }
            />
          }
        />
        <Route
          path="followees"
          element={
            <ItemScroller<User, FollowService>
              key={3}
              presenterGenerator={(view: PageItemView<User>) => new FolloweePresenter(view)}
              itemComponentGenerator={(item: User) => <UserItem value={item} />
              }
            />
          }
        />
        <Route
          path="followers"
          element={
            <ItemScroller<User, FollowService>
              key={4}
              presenterGenerator={(view: PageItemView<User>) => new FollowerPresenter(view)}
              itemComponentGenerator={(item: User) => <UserItem value={item} />
              }
            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/feed" />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
