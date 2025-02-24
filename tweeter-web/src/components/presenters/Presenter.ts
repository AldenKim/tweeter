export interface View {
  displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
}

export interface MessageView extends View{
  displayInfoMessage(
    message: string,
    duration: number,
    bootstrapClasses?: string
  ): void;
  clearLastInfoMessage(): void;
}

export class Presenter<V extends View> {
  private _view: V;

  protected constructor(view: V) {
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
          `Failed to ${operationDescription} because of exception: ${(error as Error).message}`
        );
      }
    }
}
