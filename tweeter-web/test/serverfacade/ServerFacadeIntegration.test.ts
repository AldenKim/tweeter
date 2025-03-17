import { PagedUserItemRequest } from "tweeter-shared";
import { ServerFacade } from "../../src/components/network/ServerFacade";
import 'isomorphic-fetch';

describe("Server Facade Integration Tests", () => {
  let serverFacade: ServerFacade;

  beforeAll(() => {
    serverFacade = new ServerFacade();
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
});
