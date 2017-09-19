import { DialogController } from 'aurelia-dialog';
import { inject } from 'aurelia-dependency-injection';
import * as toastr from "toastr";
import 'select2';
import 'sweetalert';
import {
    CommentService
} from 'Services/CommentSvc/CommentService';
@inject(DialogController, CommentService)
export class CommentMngViewAllCS {

    Listsac = [];
    UserByCompany = [];
    ListRolesToBind = [];
    dialogController: DialogController

    constructor(dialogController, commentService) {

        this.dialogController = dialogController;

        this.commentService = commentService;
        this.current = 1;
        this.itemperpage = 10;
        this.pagesize = 20;

        this.total = 0;

    }
    activate(dt) {
        // Get id to call api 

          
        return Promise.all([this.commentService.GetCommmentDetailAll(dt)]).then((rs) => {
        
             this.SP_TenSP = rs[0].data.Comment.SP_TenSP;
             this.ListReplies = rs[0].data.ListAllComments;
             this.total = rs[0].data.ListAllComments.length;
        });
    }



}