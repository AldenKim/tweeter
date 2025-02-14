export interface View {
  displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
}

export class Presenter {
  private _view: View;

  protected constructor(view: View) {
    this._view = view;
  }

  protected get view() {
    return this._view;
  }
}
