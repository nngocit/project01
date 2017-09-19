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
    CommentMngViewAllCS
} from './CommentMngViewAllCS';
import {
    DialogService
} from 'aurelia-dialog';

import 'sweetalert';
import _ from 'lodash';
import {
    LogService
} from 'Services/LogService';
import 'ckeditor';
import {
    CommentCSPermission
} from 'Configuration/PermissionSettings/CommentCSPermission';
import 'momentrange';
import NProgress from 'nprogress';
import moment from 'moment';
@inject(DialogController, CommentService, DialogService, CommentCSPermission, LogService)
export class CommentMngDetailCS {

    ListLoaiCmtAll = [];
    ListLoaicmtlv1 = [];
    ListLoaiCmt = [];
    ListReplies = [];
    ListLoaicmtlv3 = [];
    ListLoaicmtlv2 = [];
    ListLoaicmtlv1 = [];
    _isLv4 = false;
    _isLv3 = false;
    entity = {};
    cmt = {};
    Disablecmblv1 = true;
    Disablecmblv2 = true;
    Disablecmblv3 = true;
    Disableso = true;
    Timereply;
    Disableph = true;
    Disablecmluucmt = true;
    Disablenoidung = true;
    isLimit = false;
    DisableTrangThai = false;
    DisablePhanhoi = false;
    _IdComment;
    isEdit = true;
    isEditadmin = true;
    _IdCommentrpl;
    chkdanhgia=false;
    dialogController: DialogController

    constructor(dialogController, commentService, dialogService, commentCSPermission, logService) {

        this.dialogController = dialogController;
        this.commentService = commentService;
        this.dialogService = dialogService;
        this.logService = logService;
        this.commentCSPermission = commentCSPermission;

        this.Point = [{
            text: '1',
            value: 1
        }, {
            text: '2',
            value: 2
        }, {
            text: '3',
            value: 3
        }, {
            text: '4',
            value: 4
        }, {
            text: '5',
            value: 5
        }, {
            text: '6',
            value: 6
        }, {
            text: '7',
            value: 7
        }, {
            text: '8',
            value: 8
        }, {
            text: '9',
            value: 9
        }, {
            text: '10',
            value: 10
        }];


    }

    activate(datas) {
        //  console.log('datas', JSON.stringify(datas))
        //binding diem danh gia
        this.diemdanhgia = datas.DiemDanhGia;
        // Get id to call api 

        // console.log('3123', JSON.stringify(datas));
        this._IdComment = datas.Comment.Id;

        return Promise.all([
            this.commentService.GetListLoaiCommentv2(), this.commentService.GetCommmentDetail(datas.Comment.Id)
        ]).then((rs) => {


            this.entity = rs[1].data.Comment;



            this.entity.NgayGioTraLoi = moment(rs[1].data.NgayGioTraLoi).format("DD/MM/YYYY HH:mm:ss");
            this.Timereply = moment(rs[1].data.NgayGioTraLoi).format("YYYY/MM/DD H:m:ss");
            this.entity.NgayGioTao = moment(rs[1].data.Comment.NgayGioTao).format("DD/MM/YYYY HH:mm:ss");
             this.entity.Thoigiantraloi = moment.utc(moment(this.entity.NgayGioTraLoi, "DD/MM/YYYY HH:mm:ss").diff(moment(this.entity.NgayGioTao, "DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
            // this.entity.Thoigiantraloi = moment.utc(moment(this.entity.NgayGioTraLoi, "DD/MM/YYYY HH:mm:ss").diff(moment(this.entity.NgayGioTao, "DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
           // console.log(moment.utc(moment(this.entity.NgayGioTraLoi, "DD/MM/YYYY HH:mm:ss").diff(moment(this.entity.NgayGioTao, "DD/MM/YYYY HH:mm:ss"), 'minutes')))
           


            this.ListReplies = rs[1].data.Replies;
            this.ListLoaiCmtAll = rs[0].data.ListLoaiComent;
            //console.log(JSON.stringify(rs[1].data.Comment));
            this.ListTrangThai = rs[0].data.ListTrangThai;
            this.ListLoaiCmtdetail = rs[0].data.ListLoaiComent.filter(x => x.ParentId == null);
            this.NhanVienSO = rs[0].data.ListNhanVienTiepNhan.filter(x => x.Phongban == "SO");
            this.NhanVienCS = rs[0].data.ListNhanVienTiepNhan.filter(x => x.Phongban == "CS");


            try {
                var username = Lockr.get('UserInfo').Roles;

            } catch (error) {
                // console.log('Im idle');
                this.router.generate('login');
                Lockr.rm('UserInfo');
                window.location = "#login";
                window.location.reload();
            }

            // Check Roles of user
            var username = Lockr.get('UserInfo').Roles;
            for (let i of username) {
                this.commentCSPermission.IsArray(i.Code);
            }
            this.isFull = this.commentCSPermission.isFull();
            this.isLimit = this.commentCSPermission.isLimit();

            // console.log("this.entity.TrangThai.Id", this.entity.TrangThai.Id);
            // console.log("lm", this.isLimit);

            if (this.isLimit == true) { //Limit
                this.DanhGia = false;
                this.NVCS = true;
                this.NVSO = true;
                this.isLimit = false;

            }
            if (this.isFull == true) { // full
                this.NVSO = true;
                this.NVCS = false;
                this.isLimit = true;
            }

            if (this.entity.TrangThai.Id == 3 || this.entity.TrangThai.Id == 5 || this.entity.TrangThai.Id == 8 || this.entity.TrangThai.Id == 4) {
                this.trangthaidanhgia = this.entity.TrangThai.Id;
                // this.DisableTrangThai = true;
                this.Disableso = true;
                this.Disableph = false;
                this.Disablecmluucmt = false;
                this.Disablenoidung = false;

            } else {
                this.Disableso = false;
                this.Disableph = false;
                this.Disablecmluucmt = false;
                this.Disablenoidung = false;
                this.Disablenoidung = false;
            }

            // comment duoc phep chuyen trang Thai hien tai cua commnent.
            if (this.entity.TrangThai.Id == 1) {
                this.ListTrangThai = rs[0].data.ListTrangThai.filter(x => x.Id == 1 || x.Id == 5 || x.Id == 8);
            }
            if (this.entity.TrangThai.Id == 4) {

                this.ListTrangThai = rs[0].data.ListTrangThai.filter(x => x.Id == 4 || x.Id == 5 || x.Id == 8 || x.Id == 2);

            }
            if (this.entity.TrangThai.Id == 2) {
                this.ListTrangThai = rs[0].data.ListTrangThai.filter(x => x.Id == 2 || x.Id == 5 || x.Id == 8);
            }
            if (this.entity.TrangThai.Id == 5) {
                this.ListTrangThai = rs[0].data.ListTrangThai.filter(x => x.Id == 5 || x.Id == 8);
            }

            if (this.entity.LoaiHienThi == "DG") {
                this.chkdanhgia = true;
            }
        
            //Binding Loaicomment when edit.
            if (this.entity.CM_LoaiCommentLevel1Id == "" || this.entity.CM_LoaiCommentLevel1Id == "" || this.entity.CM_LoaiCommentLevel1Id == "" || this.entity.CM_LoaiCommentLevel1Id == "") {
                this.Disablecmblv1 = true;
                this.Disablecmblv2 = true;
                this.Disablecmblv3 = true;
            } else {

                this.loaicmt = this.entity.CM_LoaiCommentLevel1Id;
                this.Disablecmblv1 = false;
                this.Disablecmblv2 = false;
                this.Disablecmblv3 = false;
                this.ChangeLoaiCmntFilterByParentId(this.ListLoaiCmtAll, this.entity.CM_LoaiCommentLevel1Id, "lv2", null);
                this.loaicmtlv1 = this.entity.CM_LoaiCommentLevel2Id;
                this.ChangeLoaiCmntFilterByParentId(this.ListLoaiCmtAll, this.entity.CM_LoaiCommentLevel2Id, null, "lv3");
                this.loaicmtlv2 = this.entity.CM_LoaiCommentLevel3Id;
                this.ChangeLoaiCmntFilterByParentId(this.ListLoaiCmtAll, this.entity.CM_LoaiCommentLevel3Id, null, "lv4");
                this.loaicmtlv3 = this.entity.CM_LoaiCommentLevel4Id;
                this.ChangeLoaiCmntFilterByParentId(this.ListLoaiCmtAll, this.entity.CM_LoaiCommentLevel4Id, null, "lv5");
            }


            if (datas.MaNVSOTiepNhan == "") {
                this.bindnvso = true;
            } else {
                this.cmt.NVCS = datas.MaNVCSTiepNhan;
                this.cmt.NVSO = datas.MaNVSOTiepNhan;
            }

            if (datas.MaNVCSTiepNhan == "") {
                this.bindnvcs = true;
                // this.NhanVienCS = [];
            } else {
                this.cmt.NVCS = datas.MaNVCSTiepNhan;
                this.cmt.NVSO = datas.MaNVSOTiepNhan;
            }



        });
    }



    attached() {

        setTimeout(() => {

            CKEDITOR.replace('editor1', {

            });
        }, 400);

        $('[data-toggle="tooltip"]').tooltip();
        $('#TrangThaiCommentid').on('change', () => {
            this.CheckConditioncb();
        })
        $('#TrangThaiCommentlv1id').on('change', () => {
            this.CheckConditioncb1();
        })
        $('#TrangThaiCommentlv2id').on('change', () => {
            this.CheckConditioncb2();
        })
        $('#TrangThaiCommentlv3id').on('change', () => {

        })

    }

    CheckImg(img) {
        if ((img.toLowerCase().indexOf('png') != -1) || (img.toLowerCase().indexOf('jpg') != -1) || (img.toLowerCase().indexOf('jpeg') != -1)) {

            return 1;
        } else {
            return -1;
        }
    }



    UploadImage() {

        let rs = "";
        let formData = new FormData();
        let input = document.querySelector('input[type="file"]');
        try {
            formData.append("userfilename", $('#fileUpload')[0].files[0].name);
            // HTML file input, chosen by user
            formData.append("userfile", $('#fileUpload')[0].files[0]);
        } catch (error) {
            toastr.error("Vui lòng chọn tập tin", "QUẢN LÝ COMMENT");
            return;
        }
        if (Math.round(($('#fileUpload')[0].files[0].size) / 1048576) >= 1) {
            toastr.error("Kích thước tập tin không vượt quá 1MB, vui lòng chọn lại", "QUẢN LÝ COMMENT");
            return;
        } else {
            if (this.CheckImg($('#fileUpload')[0].files[0].name) == 1) {

                var req = new XMLHttpRequest();
                req.open('POST', 'http://10.10.40.142:8899/v2/upload-image', true);
                req.onload = function () {
                    // do something to response

                    rs = this.response.substring(1, this.response.length - 1);;
                };
                req.onerror = () => {
                    //  console.log('loi');
                }
                req.send(formData);
                // show upload dialog
                $('.cke_button_icon.cke_button__image_icon').click();
                // $('.cke_dialog_ui_input_text:first>input').val('aassss');
                //$("#cke_76_textInput").val("aaaa");
                // tim url field trong dialog
                // setTimeout(function() {

                // }, 600)


                var wait1000 = new Promise((resolve, reject) => {
                    setTimeout(resolve, 900)
                }).then(() => {
                    var input = $('.cke_dialog_body').find('.cke_dialog_ui_input_text:first>input');
                    // set url text
                    input.val(rs);
                    // trigger load preview url
                    input[0].dispatchEvent(new Event('change'));
                })
            } else {
                toastr.error("Vui lòng chọn tập tin có phần mở rộng '.jpg' '.jpeg' '.png'", "QUẢN LÝ COMMENT");
                return;
            }
        }
    }

    editComment(dt) {
        this._IdCommentrpl = dt.Id;

        var date1 = new Date(this.Timereply);
      
        var date2 = new Date(moment().format("YYYY/MM/DD H:m:ss")); // 5:00 PM



        if (date2 < date1) {
            date2.setDate(date2.getDate() + 1);
        }

        var diff = date2 - date1;
        
        var msec = diff;
        var hh = Math.floor(msec / 1000 / 60 / 60);
        msec -= hh * 1000 * 60 * 60;
        var mm = Math.floor(msec / 1000 / 60);
        msec -= mm * 1000 * 60;
        var ss = Math.floor(msec / 1000);
        msec -= ss * 1000;
        //console.log(hh, mm, ss);

        if (this.isFull == true) { // full

            this.isEdit = false;
            this.Disableph = false;
            CKEDITOR.instances.editor1.setData(dt.NoiDung);

        } else {
            if (hh < 72) {

                this.isEdit = false;
                this.Disableph = false;
                CKEDITOR.instances.editor1.setData(dt.NoiDung);


            } else {

                toastr.error("Bạn chỉ thay đổi nội dung trong khoảng thời gian 72 giờ, tính từ thời điểm nhận Comment", "QUẢN LÝ COMMENT");
                this.Disableph = true;

            }

        }


    }

    CheckConditioncb() {
        this.Disablecmblv1 = false;
        if (this.loaicmt == 0) {
            this.loaicmtlv1 = 0;
            this.Disablecmblv1 = true;
            this.Disablecmblv2 = true;
            this.Disablecmblv3 = true;

        } else {
            this.ListLoaicmtlv3 = [];
            this.ListLoaicmtlv2 = [];
            this.ListLoaicmtlv1 = [];
            //   console.log('ListLoaicmtlv3', this.ListLoaicmtlv3.length);
            this.ChangeLoaiCmntFilterByParentId(this.ListLoaiCmtAll, this.loaicmt, "lv2", null);
        }

    }
    CheckConditioncb1() {
        if (this.loaicmtlv1 == 0) {
            this.loaicmtlv2 = 0;
            this.Disablecmblv2 = true;
            this.Disablecmblv3 = true;
            this.ListLoaicmtlv2 = [];
            this.ListLoaicmtlv3 = [];
        } else {
            this.Disablecmblv2 = false;
            this.ListLoaicmtlv2 = [];
            this.ListLoaicmtlv3 = [];
            //   console.log('ListLoaicmtlv3', this.ListLoaicmtlv3.length);
            this.ChangeLoaiCmntFilterByParentId(this.ListLoaiCmtAll, this.loaicmtlv1, null, "lv3");
        }
    }
    CheckConditioncb2() {
        if (this.loaicmtlv2 == 0) {
            this.loaicmtlv3 = 0;
            this.Disablecmblv3 = true;
            this.ListLoaicmtlv3 = [];
        } else {
            this.Disablecmblv3 = false;
            this.ListLoaicmtlv3 = [];
            //   console.log('ListLoaicmtlv3', this.ListLoaicmtlv3.length);
            this.ChangeLoaiCmntFilterByParentId(this.ListLoaiCmtAll, this.loaicmtlv2, null, "lv4");
        }
    }

    async CallbackService(parentId, level) {
        //  console.log(parentId, level);
        return await Promise.all([this.commentService.GetListLoaiCommentv2()]).then((rs) => {
            this.ListLoaicmtlv2 = rs[0].data.ListLoaiComent.filter(x => x.ParentId == parentId && x.Level == level);
            this.ListLoaicmtlv2.length > 0 ? this._isLv3 = true : this._isLv3 = false;
        });
    }
    async CallbackServicelv3(parentId, level) {
        //   console.log(parentId, level);
        return await Promise.all([this.commentService.GetListLoaiCommentv2()]).then((rs) => {
            this.ListLoaicmtlv3 = rs[0].data.ListLoaiComent.filter(x => x.ParentId == parentId && x.Level == level);
            this.ListLoaicmtlv3.length > 0 ? this._isLv4 = true : this._isLv4 = false;

        });
    }


    ChangeLoaiCmntFilterByParentId(array, parentId, arr1, arr2) {
        if (arr1 === "lv2" && arr1 !== null) {

            this.ListLoaicmtlv1 = array.filter(x => x.ParentId == parentId && x.Level == 2);
        }
        if (arr2 === "lv3" && arr2 !== null) {

            this.CallbackService(parentId, 3);
        }
        if (arr2 === "lv4" && arr2 !== null) {

            this.CallbackServicelv3(parentId, 4);
        }

    }

    ValidateBeforeSubmitReplycmt() {
        var strErrorMsg = "";
        if (CKEDITOR.instances.editor1.getData().length == 0)
            strErrorMsg += "'<b>'[Nội dung phản hồi]'</b>' không đúng định dạng. Vui lòng chọn/nhập lại. <br/>";
        if (strErrorMsg !== "") {
            toastr.error(strErrorMsg, "QUẢN LÝ COMMENT", {
                timeOut: 100
            });

            return false;
        }
        return true;
    }
    ValidateBeforeSubmitRatecmt() {
        var strErrorMsg = "";

        if (this.diemdanhgia == "" || typeof this.diemdanhgia === "undefined")
            strErrorMsg += "'<b>'Bạn chưa chọn [Điểm đánh giá].'</b>' Vui lòng chọn/nhập lại. <br/>";
        if (strErrorMsg !== "") {
            toastr.error(strErrorMsg, "QUẢN LÝ COMMENT", {
                timeOut: 100
            });

            return false;
        }
        return true;
    }
    async Replycommment() {

        // document.getElementsByClassName('trumbowyg-editor')[0].getElementsByTagName('img')[0].height = 900;
        // document.getElementsByClassName('trumbowyg-editor')[0].getElementsByTagName('img')[0].width = 555;
        var cmtreply = {
            "NoiDung": CKEDITOR.instances.editor1.getData()
            //"NoiDung": $('#CommentContent').trumbowyg('html')
        }

        var _MaNV = Lockr.get('UserInfo').PersonalId; //EmployeeId
        if (_MaNV === "")
            _MaNV = Lockr.get('UserInfo').EmployeeId;

        var json = {
            "NoiDung": CKEDITOR.instances.editor1.getData(),
            //"NoiDung": $('#CommentContent').trumbowyg('html')
            "CommentId": this._IdComment,
            "MaNVReply": _MaNV
        }
        if (this.isEdit == true) {

            if (this.ValidateBeforeSubmitReplycmt() == true) {

                this.DisablePhanhoi = true;
                return await this.commentService.ReplyComment(json).then((rs) => {

                    if (rs.status === 200) {

                        NProgress.done();
                        this.DisablePhanhoi = false;
                        CKEDITOR.instances.editor1.setData("");
                        this.commentService.GetCommmentDetail(this._IdComment).then((rs) => {
                            if (rs.status === 200) {
                                this.ListReplies = rs.data.Replies;

                            }
                        });
                        toastr.success("Ghi nhận phản hồi và gửi Email thành công.", "QUẢN LÝ COMMENT", {
                            timeOut: 100
                        });

                    } else {
                        toastr.error("Ghi nhận phản hồi thất bại. Vui lòng thử lại.", "QUẢN LÝ COMMENT", {
                            timeOut: 100
                        });
                    }

                });
            }

        } else {
            if (this.ValidateBeforeSubmitReplycmt() == true) {
                this.DisablePhanhoi = true;
                this.isEdit = true;
                return await this.commentService.UpdateCommentReply(this._IdCommentrpl, cmtreply).then((rs) => {
                    if (rs.status === 200) {
                        this.DisablePhanhoi = false;
                        NProgress.done();
                        CKEDITOR.instances.editor1.setData("");
                        this.commentService.GetCommmentDetail(this._IdComment).then((rs) => {
                            if (rs.status === 200) {
                                this.ListReplies = rs.data.Replies;
                            }
                        });

                    }
                });
            }

        }
    }



    UpdateRate() {

        let jsonToPost = {};
        jsonToPost.CommentId = this._IdComment;
        jsonToPost.MaNVQL_VTA = Lockr.get('UserInfo').PersonalId;
        jsonToPost.DiemDanhGia = this.diemdanhgia;

        if (this.ValidateBeforeSubmitRatecmt() == true) {
            this.commentService.UpdateRate(this._IdComment, jsonToPost)
                .then(rs => {
                    if (rs.status === 200) {
                        toastr.success("Cập nhật thông tin chi tiết Comment thành công", "QUẢN LÝ COMMENT", {
                            timeOut: 100
                        });

                    } else {
                        toastr.success("Đánh giá Comment thất bại. Vui lòng thử lại.", "QUẢN LÝ COMMENT", {
                            timeOut: 100
                        });
                    }
                })


        }

    }



    SendSO() {
        let jso = {
            "CommentId": this._IdComment,
            "TrangThaiId": 3
        }
        let json = {
            "NoiDung": "Chào bạn! Hiện tại thông tin của bạn đã được tiếp nhận và chuyển đến bộ phận Online. Chúng Tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất. Trân trọng!",
            "CommentId": this._IdComment,
            "MaNVReply": Lockr.get('UserInfo').PersonalId
        }





        swal({
            title: "CHI TIẾT COMMENT",
            text: `Bạn có chắc chắn muốn chuyển comment này cho SO không`,
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#5484E2",
            confirmButtonText: "CHUYỂN",
            cancelButtonText: "HỦY BỎ",
            closeOnConfirm: false,
            closeOnCancel: false,
            showLoaderOnConfirm: true
        }, (isConfirm) => {
            if (isConfirm) {
                //  console.log(JSON.stringify(json));
                this.commentService.ReplyComment(json).then((rs) => {
                    if (rs.status === 200) {
                        this.commentService.UpdateComment(this._IdComment, jso).then((rs) => {
                            if (rs.status === 200) {


                                swal("CHI TIẾT COMMENT", "Chuyển Comment cho SO thành công.", {
                                    timeOut: 100
                                });

                            } else {
                                toastr.error("Cập nhật không thành công", "QUẢN LÝ COMMENT", {
                                    timeOut: 100
                                });
                            }

                        });

                        $('#CommentContent').trumbowyg('empty');

                        this.commentService.GetCommmentDetail(this._IdComment).then((rs) => {
                            if (rs.status === 200) {
                                this.ListReplies = rs.data.Replies;
                            }
                        });
                    }
                });




            } else {
                swal({
                    title: "CHI TIẾT COMMENT",
                    text: `HỦY BỎ`,
                    type: "warning"
                });
            }
        });



    }

    Updatecomment() {

        let jsonToPost = {};
        jsonToPost.CommentId = this._IdComment;
        jsonToPost.MaNVTiepNhan = this.cmt.NVCS;
        jsonToPost.PhongBanNV = "CS";
        jsonToPost.LoaiCommentLevel1 = this.loaicmt;
        jsonToPost.LoaiCommentLevel2 = this.loaicmtlv1;
        jsonToPost.LoaiCommentLevel3 = this.loaicmtlv2;
        jsonToPost.LoaiCommentLevel4 = this.loaicmtlv3;
        jsonToPost.TrangThaiId = this.trangthaidanhgia;
        jsonToPost.IsDG = this.chkdanhgia == true ? "T" : "F";



        if ((this._isLv4 == true && this.loaicmtlv3 == 0) || (this._isLv3 == true && this.loaicmtlv2 == 0)) {
            // console.log('lv4');
            toastr.error("Bạn chưa chọn đủ các cấp phân loại comment. Vui lòng chọn lại.", "QUẢN LÝ COMMENT", {
                timeOut: 100
            });
            return;
        } else {
            //console.log('lv44');
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

                    this.logService.InsertAdminCPLog("VTA APP | CS | QuanLyComment  | UpdateComment", Lockr.get('UserInfo').PersonalId, JSON.stringify(jsonToPost));
                    this.commentService.UpdateComment(this._IdComment, jsonToPost)
                        .then(rs => {
                            if (rs.status === 200) {

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

    HiddenComment(data) {
        CKEDITOR.instances.editor1.setData(null);
        let obj = { "Status": "H" };
        this.commentService.UpdateCommentReply(data.Id, obj).then((rs) => {
            if (rs.data === "SUCCESS") {

                this.commentService.GetCommmentDetail(this._IdComment).then((rs) => {
                    if (rs.status === 200) {
                        this.ListReplies = rs.data.Replies;

                    }
                });
            }
        });
    }
    ShowComment(data) {
        let obj = { "Status": "A" };
        this.commentService.UpdateCommentReply(data.Id, obj).then((rs) => {
            if (rs.data === "SUCCESS") {
                this.commentService.GetCommmentDetail(this._IdComment).then((rs) => {
                    if (rs.status === 200) {
                        this.ListReplies = rs.data.Replies;

                    }
                });
            }
        });
    }
    Viewallcomment() {

        this.dialogService.open({
            viewModel: CommentMngViewAllCS,
            model: this._IdComment

        }).then((result) => {

        });
    }




}