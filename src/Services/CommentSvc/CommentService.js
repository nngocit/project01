import * as APISettings from 'Configuration/APISettings';
import { inject, transient } from 'aurelia-framework';
import { Restsv } from 'Services/RestsvPublic';
import 'axios';
@inject(Restsv)
@transient()
export class CommentService {


    

    constructor(restsv) {
        this.restsv = restsv;
    }
    GetListLoaiCommentv2() {
        return this.restsv.GetV2('/comments/configs',"webcomment");
    }
    CommentSearch2(query) {
        var qr = '?' + query;
        return this.restsv.GetV2('/comments/searchv2/' + qr,"webcomment");
    }
    GetCommmentDetail(Id) {
        return this.restsv.GetV2('/comments/detailv2/' + Id,"webcomment");
    }
    GetCommmentDetailAll(Id) {
        return this.restsv.GetV2('/comments/Alldetailv2/' + Id,"webcomment");
    }
    ReplyComment(json) {
        return this.restsv.PostV2('/comments/replyv2', json,"webcomment");
    }
    UpdateComment(Id, json) {
        return this.restsv.PutV2('/comments/'+Id, json,"webcomment");
    }
    UpdateRate(Id, json) {
        return this.restsv.PutV2('/comments/'+Id, json,"webcomment");
    }
    UpdateCommentReply(Id, json) {
        return this.restsv.PutV2('/comments/reply/' + Id, json,"webcomment");
    }
    SearchUserById(Id) {
        return this.restsv.GetV2('/comments/user/' + Id,"webcomment");
    }
    SearchUserBy(query) {
        var qr = '?' + query;
        return this.restsv.GetV2('/comments/users' + qr,"webcomment");
    }
    RegisterEmployeeInfo(json) {
        return this.restsv.PostV2('/comments/user', json,"webcomment");
    }
    UpdateUser(Id, json) {
        return this.restsv.PutV2('/comments/user/' + Id, json,"webcomment");
    }
    history(query) {
        var qr = query;
        return this.restsv.GetV2('/comments/history/' + qr,"webcomment");
    }
    Export(query) {
        var qr = '?' + query;
        return this.restsv.GetV2('/comments/report/' + qr,"webcomment");
    }
    ResetData(query) {
        var qr = '?' + query;
        return this.restsv.GetV2('/comments/reset/' + qr,"webcomment");
    }
//aa
// GetListLoaiCommentv2() {
//         return this.restsv.GetV2(APISettings.comments + 'configs',"webcomment");
//     }
//     CommentSearch2(query) {
//         var qr = '?' + query;
//         return this.restsv.GetV2(APISettings.comments + '/searchv2/' + qr,"webcomment");
//     }
//     GetCommmentDetail(Id) {
//         return this.restsv.GetV2(APISettings.comments + '/detailv2/' + Id,"webcomment");
//     }
//     GetCommmentDetailAll(Id) {
//         return this.restsv.GetV2(APISettings.comments + 'Alldetailv2/' + Id,"webcomment");
//     }
//     ReplyComment(json) {
//         return this.restsv.PostV2(APISettings.comments + 'replyv2', json,"webcomment");
//     }
//     UpdateComment(Id, json) {
//         return this.restsv.PutV2(APISettings.comments + Id, json,"webcomment");
//     }
//     UpdateRate(Id, json) {
//         return this.restsv.PutV2(APISettings.comments + Id, json,"webcomment");
//     }
//     UpdateCommentReply(Id, json) {
//         return this.restsv.PutV2(APISettings.comments + 'reply/' + Id, json,"webcomment");
//     }
//     SearchUserById(Id) {
//         return this.restsv.GetV2(APISettings.comments + 'user/' + Id,"webcomment");
//     }
//     SearchUserBy(query) {
//         var qr = '?' + query;
//         return this.restsv.GetV2(APISettings.comments + 'users' + qr,"webcomment");
//     }
//     RegisterEmployeeInfo(json) {
//         return this.restsv.PostV2(APISettings.comments + 'user', json,"webcomment");
//     }
//     UpdateUser(Id, json) {
//         return this.restsv.PutV2(APISettings.comments + 'user/' + Id, json,"webcomment");
//     }
//     history(query) {
//         var qr = query;
//         return this.restsv.GetV2(APISettings.comments + 'history/' + qr,"webcomment");
//     }
//     Export(query) {
//         var qr = '?' + query;
//         return this.restsv.GetV2(APISettings.comments + 'report/' + qr,"webcomment");
//     }
//     ResetData(query) {
//         var qr = '?' + query;
//         return this.restsv.GetV2(APISettings.comments + 'reset/' + qr,"webcomment");
//     }




}