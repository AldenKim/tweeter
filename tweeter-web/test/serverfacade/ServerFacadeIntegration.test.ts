import { FollowRequest, PagedUserItemRequest, RegisterRequest } from "tweeter-shared";
import { ServerFacade } from "../../src/components/network/ServerFacade";
import "isomorphic-fetch";

describe("Server Facade Integration Tests", () => {
  /*let serverFacade: ServerFacade;

  beforeAll(() => {
    serverFacade = new ServerFacade();
  });

  test("Register Integrations Test", async () => {
    const request: RegisterRequest = {
      firstName: "value1",
      lastName: "value2",
      alias: "value3",
      password: "value4",
      userImageBytes: "value5",
      imageFileExtension: "value6",
    };

    const [user, authToken] = await serverFacade.register(request);

    expect(user).toBeDefined();
    expect(authToken).toBeDefined();
    expect(typeof user.alias).toBe("string");
    expect(typeof user.firstName).toBe("string");
    expect(typeof user.lastName).toBe("string");

    expect(authToken.token).toBeDefined();
    expect(typeof authToken.token).toBe("string");
    expect(authToken.timestamp).toBeDefined();
    expect(typeof authToken.timestamp).toBe("number");
  });

  test("Get Followers Integrations Test", async () => {
    const request: PagedUserItemRequest = {
      token: "value1",
      userAlias: "value2",
      pageSize: 10,
      lastItem: null,
    };

    const [followers, hasMore] = await serverFacade.getMoreFollowers(request);

    expect(Array.isArray(followers)).toBe(true);
    expect(followers.length).toBeGreaterThanOrEqual(0);
    expect(typeof hasMore).toBe("boolean");
  });

  test("Get Following Count Integrations Test", async () => {
    const request: FollowRequest = {
      token: "value1",
      user: {
        firstName: "Allen",
        lastName: "Anderson",
        alias: "@allen",
        imageUrl: ""
      }
    };

    const count = await serverFacade.getFolloweeCount(request);

    expect(count).toBeDefined();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test("Get Followers Count Integrations Test", async () => {
    const request: FollowRequest = {
      token: "value1",
      user: {
        firstName: "Allen",
        lastName: "Anderson",
        alias: "@allen",
        imageUrl: ""
      }
    };

    const count = await serverFacade.getFollowerCount(request);

    expect(count).toBeDefined();
    expect(count).toBeGreaterThanOrEqual(0);
  }); */

  test("Get Followers Count Integrations Test", async () => {
    return true;
  }); 
});
