import {
    inject,
    BindingEngine
} from 'aurelia-framework';
import {
    json
} from 'aurelia-fetch-client';
import {
    LogService
} from 'Services/LogService';
import {
    CommentService
} from 'Services/CommentSvc/CommentService';
import moment from 'moment';
import 'momentrange';
import * as toastr from "toastr";
import * as jsidle from "jsidle";
import 'eonasdan-bootstrap-datetimepicker';
import 'select2';
import {
    UserRegisterCommentMngSO
} from './UserRegisterCommentMngSO';
import {
    UserUpdateCommentMngSO
} from './UserUpdateCommentMngSO';
import {
    UserHistoryCommentMngSO
} from './UserHistoryCommentMngSO';
import {
    DialogService
} from 'aurelia-dialog';
import _ from 'lodash';
import {
    CommentCSPermission
} from 'Configuration/PermissionSettings/CommentCSPermission';
import { Router } from 'aurelia-router';
import {
    CommentMenuPermission
} from 'Configuration/PermissionSettings/CommentMenuPermission';
import NProgress from 'nprogress';
import { UserService } from 'Services/UserSvc/UserService';
@inject(BindingEngine, LogService, DialogService, CommentService, CommentCSPermission, CommentMenuPermission, Router, UserService)
export class UserCommentMngSO {


    //Comment
    ListUsers = [];
    ListLoaiCmtAll = [];
    ListLoaicmtlv1 = [];
    jsonToPost = {};
    strQuery = "";
    Disablecmblv1 = true;
    Disablecmblv2 = true;
    isFull;
    isLimit;
    router;
    constructor(bindingEngine, logService, dialogService, commentService, commentCSPermission, commentMenuPermission, route, userService) {

        this.commentService = commentService;
        this.logService = logService;
        this.dialogService = dialogService;
       
        this.commentCSPermission = commentCSPermission;
        this.commentMenuPermission = commentMenuPermission;
        this.userService = userService;
        //Pagination
        this.current = 1;
        this.itemperpage = 20;
        this.orderselect = 0;
        this.pagesize = 20;
        this.sDate = "";
        this.eDate = "";
        this.PointallTeam = 0;
        this.DanhGia = true;
        this.router = route;
        this._useridlogout = Lockr.get('UserInfo').UserId;
    }

    bind(ct, ovr) {
        if (this.ListComment != null)
            ovr.bindingContext.total = this.ListComment.length;
    }

    activate() {

        return Promise.all([
            this.commentService.GetListLoaiCommentv2()
        ]).then((rs) => {

            this.ListPhongBanRole = rs[0].data.ListCMRoles.filter(x => x.Code === "CM_AdminSO" || x.Code === "CM_NhanVienSO");


        })

    }




    attached() {

        // xử lý lgout trong khoảng 60 phút không tương tác hệ thống
        // $(document).idle({
        //     onIdle: () => {

        //         this.userService.LogOut(this._useridlogout).then((data) => {

        //             if (data.Result == true) {
        //                 this.logService.InsertAdminCPLog("VTA APP | MOT | QuanLyUser | Autologout", data.Result, data);
        //                 this.router.generate('login');

        //                 Lockr.rm('UserInfo');
        //                 window.location = "#login";
        //                 window.location.reload();
        //             }
        //         });

        //     },
        //     events: 'mousemove keydown mousedown touchstart',
        //     onActive: () => {

        //         //      console.log('Im back');
        //     },
        //     idle: 3600000
        //         //idle: 1000
        // })
        var today = new Date();

        $('#txtFilterDateStart').datetimepicker({
            format: "YYYY-MM-DD"
        });

        $("#txtFilterDateStart").on("dp.change", () => {
            this.dateStartFilter = $('#txtFilterDateStart').val();
        });

        $('#txtFilterDateEnd').datetimepicker({
            format: "YYYY-MM-DD"
        });


        $("#txtFilterDateEnd").on("dp.change", () => {
            this.dateEndFilter = $('#txtFilterDateEnd').val();
        });



    }

    Search() {

        if (this.validateName(this.AccCitrix) == false) {
            toastr.error("'<b>'[Tên đăng nhập (Citrix)]'</b>' không đúng định dạng. Vui lòng chọn/nhập lại. <br/>", "QUẢN LÝ USER");

            return;
        }
        var splashHtml = '<div class="splash card">' +
            '<div role="spinner">' +
            '<div class="spinner-icon"></div>' +
            '</div>' +

          '<p style="text-align:center">Vui lòng chờ...</p>' +
            '<div class="progress">' +
            '<div class="mybar" role="bar">' +

            '</div>' +
            '</div>' +
            '</div>';
        NProgress.configure({
            template: splashHtml
        });

        let arr = [];
        var startDate = $('#txtFilterDateStart').val();
        var endDate = $('#txtFilterDateEnd').val();

        if (startDate == "" && endDate == "") {
            this.shtimkiem = false;

        }

        if (startDate == "" && endDate != "") {
            startDate = moment().subtract(92, 'days').format("YYYY-MM-DD");
            this.shtimkiem = true;
        }

        if (endDate == "" && startDate != "") {
            endDate = moment().add(92, 'days').format("YYYY-MM-DD");
            this.shtimkiem = true;
        }

        var range = moment.range(startDate, endDate);
        if (range.diff('days') >= 93) {
            toastr.warning("Khoảng thời gian tìm kiếm không được quá 3 tháng.", "QUẢN LÝ USER");
            return;
        }


        if (startDate > endDate) {
            toastr.warning("Thời gian bắt đầu > thời gian kết thúc. Vui lòng chọn lại.", "QUẢN LÝ USER");
            return;
        }
        //  console.log('startDate', startDate);
        //   console.log('endDate', endDate);
        this.sDate = startDate;
        this.eDate = endDate;


        if (this.CommentId) {
            arr.push("maNV=" + this.CommentId);
        }
        if (this.AccCitrix) {
            arr.push("usernameCitrix=" + this.AccCitrix);
        }
        if (this.TenNhanVien) {
            arr.push("tenNV=" + this.TenNhanVien);
        }

        if (this.SoDienThoai) {
            arr.push("soDienThoai=" + this.SoDienThoai);
        }
        if (this.Chucvu) {
            arr.push("chucVu=" + this.Chucvu);
        }
        if (startDate) {
            arr.push("ngayBatDau=" + startDate);
        }
        if (endDate) {
            arr.push("ngayKetThuc=" + endDate);
        }
        if (this.phongBan) {
            arr.push("phongBan=" + this.SoDienThoai);
        }
        if (this.filterTrangThai) {
            arr.push("status=" + this.filterTrangThai);
        }

        this.strQuery = arr.join("&");


        NProgress.set(0.4)
        this.Disabletimkiem = true;
        try {
            return this.commentService.SearchUserBy(this.strQuery).then((data) => {

                if (data.status === 200 && data.data !== "NOT_FOUND") {
                    NProgress.done();

                    this.ListUsers = data.data.filter(x => x.Nhom === 'SO');
                    this.total = data.data.length;
                    this.mydatalength = this.ListUsers.length;
                    if (this.total == 0) {
                        NProgress.done();
                        this.Disabletimkiem = false;
                        this.ListUsers = null;
                        this.mydatalength = 0;

                        this.noidungkhongtimthay = "Không tìm thấy danh sách user thỏa điều kiện.";
                    }

                } else {
                    NProgress.done();
                    this.Disabletimkiem = false;
                    this.ListUsers = null;
                    this.mydatalength = 0;

                    this.noidungkhongtimthay = "Không tìm thấy danh sách user thỏa điều kiện.";
                }


            })
        } catch (err) {
            NProgress.done();
        }

    }



    validateName(str) {

        var regex = /^[0-9A-Za-z\$ ]{0,30}$/;
        return regex.test(str);
    }
    imageExists(image_url) {
        if (image_url == null || image_url == undefined || image_url == "") {
            image_url = "images/avatar_2x.png";
        } else {
            image_url = image_url;
        }
        return image_url;
    }

    ViewdlgUserHistory(item) {

        this.dialogService.open({
            viewModel: UserHistoryCommentMngSO,
            model: item
        }).then((result) => {
            //  console.log('callback update');
            this.commentService.SearchUserBy(this.strQuery).then((data) => {
                this.ListUsers = data.data.filter(x => x.Nhom === 'SO');
                this.total = data.data.length;
            })
        })
    }


    ViewdlgUserRegister(item) {

        this.dialogService.open({
            viewModel: UserRegisterCommentMngSO,
            model: item
        }).then((result) => {
            //   console.log('callback reg');
            this.commentService.SearchUserBy(this.strQuery).then((data) => {
                this.ListUsers = data.data.filter(x => x.Nhom === 'SO');
                this.total = data.data.length;
            })
        })
    }

    ViewdlgUserUpdate(item) {

        this.dialogService.open({
            viewModel: UserUpdateCommentMngSO,
            model: item
        }).then((result) => {
            //   console.log('callback update');
            this.commentService.SearchUserBy(this.strQuery).then((data) => {
                this.ListUsers = data.data.filter(x => x.Nhom === 'SO');
                this.total = data.data.length;
            })
        })
    }



}