import {
    DialogController
} from 'aurelia-dialog';
import {
    inject
} from 'aurelia-dependency-injection';
import * as toastr from "toastr";
import 'select2';
import 'sweetalert';
import {
    CommentService
} from 'Services/CommentSvc/CommentService';

import {
    DialogService
} from 'aurelia-dialog';
import 'trumbowyg';
import 'sweetalert';
import {
    CommentSOPermission
} from 'Configuration/PermissionSettings/CommentSOPermission';
import 'momentrange';
import moment from 'moment';
@inject(DialogController, CommentService, DialogService, CommentSOPermission)
export class CommentMngDetailSO {

    ListLoaiCmtAll = [];
    ListLoaicmtlv1 = [];
    ListLoaiCmt = [];
    ListReplies = [];
    ListLoaicmtlv3 = [];
    ListLoaicmtlv2 = [];
    ListLoaicmtlv1 = [];
    _isLv4;
    entity = {};
    Disablecmblv1 = true;
    Disablecmblv2 = true;
    Disablecmblv3 = true;
    Disableso = true;
    cmt = {};
    Disablecmluucmt = true;
    Disablenoidung = true;
    DisableCapNhat = false;
    isLimit = false;
    DisableTrangThai = true;
    _IdComment;

    _IdCommentrpl;
    dialogController: DialogController

    constructor(dialogController, commentService, dialogService, commentSOPermission) {

        this.dialogController = dialogController;
        this.dialogController.settings.lock = false;
        this.commentService = commentService;
        this.dialogService = dialogService;
        this.commentSOPermission = commentSOPermission;
        this.bindnvcs = false;
        this.bindnvso = false;


    }

    activate(data) {


        this._IdComment = data.Comment.Id;
        return Promise.all([
            this.commentService.GetListLoaiCommentv2(), this.commentService.GetCommmentDetail(data.Comment.Id)
        ]).then((rs) => {

            this.entity = rs[1].data.Comment;
            // console.log(JSON.stringify(this.entity));
            this.ListReplies = rs[1].data.Replies;
            this.ListLoaiCmtAll = rs[0].data.ListLoaiComent;
            this.ListLoaiCmtdetail = rs[0].data.ListLoaiComent.filter(x => x.ParentId == null);
            this.NhanVienSO = rs[0].data.ListNhanVienTiepNhan.filter(x => x.Phongban == "SO");
            this.NhanVienCS = rs[0].data.ListNhanVienTiepNhan.filter(x => x.Phongban == "CS");


            this.ListTrangThai = rs[0].data.ListTrangThai;
            this.trangthaidanhgia = this.entity.TrangThai.Id;
            // Check Roles of user
            var username = Lockr.get('UserInfo').Roles;
            for (let i of username) {
                this.commentSOPermission.IsArray(i.Code);
            }
            this.isFull = this.commentSOPermission.isFull();
            this.isLimit = this.commentSOPermission.isLimit();

            // console.log("fll", this.isFull);
            // console.log("lm", this.isLimit);

            if (typeof this.isFull === "undefined" && this.isLimit == true) { //Limit
                this.DanhGia = false;

                this.NVSO = true;

                this.DisableCapNhat = true;
            }
            if (this.isFull == true && typeof this.isLimit === "undefined") { // full
                this.NVSO = false;
                this.DisableCapNhat = false;
            }


            //  console.log('aaaa', data.MaNVCSTiepNhan);

            if (data.MaNVCSTiepNhan == "") {
                this.bindnvcs = true;

            } else {
                this.cmt.NVCS = data.MaNVCSTiepNhan;
                this.cmt.NVSO = data.MaNVSOTiepNhan;
            }

            if (data.MaNVSOTiepNhan == "") {
                this.bindnvso = true;
                // this.NhanVienSO = [];
            } else {
                this.cmt.NVCS = data.MaNVCSTiepNhan;
                this.cmt.NVSO = data.MaNVSOTiepNhan;
            }


        });
    }
    attached() {
        $('[data-toggle="tooltip"]').tooltip()
        $('#CommentContent').trumbowyg({

            svgPath: 'images/icons.svg',
            semantic: false
        });
    }

    UpdatecommentPh() {
        let jsonToPost = {};
        jsonToPost.CommentId = this._IdComment;
        jsonToPost.TrangThaiId = 4;
        jsonToPost.GhiChu=this.entity.GhiChu
        this.commentService.UpdateComment(this._IdComment, jsonToPost)
            .then(rs => {
                if (rs.status === 200) {
                    this.dialogController.ok("True");
                    toastr.success("Phản hồi Comment cho CS thành công.", "QUẢN LÝ COMMENT");
                } else {
                    toastr.success("Phản hồi Comment cho CS thất bại. Vui lòng thử lại.", "QUẢN LÝ COMMENT");
                }
            })
    }
    Updatecomment() {

        let jsonToPost = {};
        jsonToPost.CommentId = this._IdComment;
        jsonToPost.MaNVTiepNhan = this.cmt.NVSO;
        jsonToPost.PhongBanNV = "SO";
        swal({
            title: "CHI TIẾT COMMENT",
            text: `Bạn có chắc chắn muốn cập nhật thông tin comment này không`,
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#5484E2",
            confirmButtonText: "Cập nhật",
            cancelButtonText: "Hủy bỏ",
            closeOnConfirm: false,
            closeOnCancel: false,
            showLoaderOnConfirm: true
        }, (isConfirm) => {
            if (isConfirm) {
                //console.log(JSON.stringify(jsonToPost));
                this.commentService.UpdateComment(this._IdComment, jsonToPost)
                    .then(rs => {
                        if (rs.status === 200) {
                            this.dialogController.ok("True");
                            // this.logService.InsertAdminCPLog("VTA APP | MOT | QuanLyComment  | UpdateComment", rs.status, jsonToPost);
                            swal("CHI TIẾT COMMENT", "Cập nhật thông tin chi tiết Comment thành công");
                        } else {
                            swal("CHI TIẾT COMMENT", "Cập nhật không thành công", "error");
                        }
                    })
            } else {
                swal({
                    title: "CHI TIẾT COMMENT",
                    text: `Hủy cập nhật`,
                    type: "warning"
                });
            }
        });



    }






}