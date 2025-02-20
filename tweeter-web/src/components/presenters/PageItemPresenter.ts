import { AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export const PAGE_SIZE = 10;

export interface PageItemView<T> extends View {
  addItems: (newItems: T[]) => void;
}

export abstract class PageItemPresenter<T, U> extends Presenter {
  private _service: U;

  private _hasMoreItems = true;
  private _lastItem: T | null = null;

  public constructor(view: PageItemView<T>) {
    super(view);
    this._service = this.createService();
  }

  protected get service() {
    return this._service;
  }

  protected abstract createService(): U;

  public get hasMoreItems() {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  protected get lastItem() {
    return this._lastItem;
  }

  protected set lastItem(value: T | null) {
    this._lastItem = value;
  }

  reset() {
    this.lastItem = null;
    this.hasMoreItems = true;
  }

  protected get view(): PageItemView<T> {
    return super.view as PageItemView<T>; 
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    await this.doFailureReportingOperation(async () => {
      const [newItems, hasMore] = await this.getMoreItems(
        authToken,
        userAlias,
      );

      this.hasMoreItems = hasMore;
      this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    }, this.getItemDescription());
  }

  protected abstract getMoreItems(authToken: AuthToken, userAlias: string): Promise<[T[], boolean]>;

  protected abstract getItemDescription(): string;
}
