import { FollowService } from "../model/service/FollowService";

export interface FolloweeView {

}

export class FolloweePresenter {
    private followService: FollowService;
    private view: FolloweeView;

    public constructor(view: FolloweeView) {
        this.followService = new FollowService();
        this.view=view;
    }
}