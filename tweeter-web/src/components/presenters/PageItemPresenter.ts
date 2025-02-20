import { AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export interface PageItemView<T> extends View {
  addItems: (newItems: T[]) => void;
}

export abstract class PageItemPresenter<T, U> extends Presenter {
  private _service: U;

  private _hasMoreItems = true;
  private _lastItem: T | null = null;

  protected constructor(view: PageItemView<T>) {
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

  public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;
}
