export interface View {
  displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
}

export interface MessageView {
  displayInfoMessage(
    message: string,
    duration: number,
    bootstrapClasses?: string
  ): void;
  clearLastInfoMessage(): void;
}

export class Presenter {
  private _view: View;

  protected constructor(view: View) {
    this._view = view;
  }

  protected get view() {
    return this._view;
  }

   public async doFailureReportingOperation(operation:() => Promise<void>, operationDescription: string) {
      try {
        await operation();
      } catch (error) {
        this.view.displayErrorMessage(
          `Failed to ${operationDescription} because of exception: ${error}`
        );
      }
    }
}
