import { AuthToken } from "tweeter-shared";
import { StatusService } from "../../src/components/model/service/StatusService";
import 'isomorphic-fetch';

describe("Service Integration Tests", () => {
  let statusService: StatusService;

  beforeAll(() => {
    statusService = new StatusService();
  });

  test("Get Story Items Service Integration Test", async () => {
    const authToken: AuthToken = new AuthToken("temp", Date.now());
    const userAlias: string = "tempAlias";
    const pageSize: number = 10;

    const [storyItems, hasMore] = await statusService.loadMoreStoryItems(authToken, userAlias, pageSize, null);

    expect(Array.isArray(storyItems)).toBe(true);
    expect(storyItems.length).toBeGreaterThanOrEqual(0);
    expect(typeof hasMore).toBe("boolean");
  });
});