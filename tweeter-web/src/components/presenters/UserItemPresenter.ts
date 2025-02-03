export interface UserItemView {

}

export class UserItemPresenter {
    private view: UserItemView;

    public constructor(view: UserItemView) {
        this.view = view;
    }
}