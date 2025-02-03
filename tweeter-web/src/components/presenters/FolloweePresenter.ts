import { FollowService } from "../model/service/FollowService";
import { UserItemPresenter, UserItemView } from "./UserItemPresenter";

export interface FolloweeView {

}

export class FolloweePresenter extends UserItemPresenter {
    private followService: FollowService;

    public constructor(view: UserItemView) {
        super(view)
        this.followService = new FollowService();
    }
}