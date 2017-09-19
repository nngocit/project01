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
    CommentMngDetailCS
} from './CommentMngDetailCS';
import {
    DialogService
} from 'aurelia-dialog';
import _ from 'lodash';
import {
    CommentCSPermission
} from 'Configuration/PermissionSettings/CommentCSPermission';
import {
    CommentMenuPermission
} from 'Configuration/PermissionSettings/CommentMenuPermission';
import { Router } from 'aurelia-router';
import NProgress from 'nprogress';
import { UserService } from 'Services/UserSvc/UserService';
import { ExcelService } from 'Helpers/ExcelHelper';
import { DateFormat } from 'Helpers/datetime-format';

@inject(BindingEngine, LogService, DialogService, CommentService, CommentCSPermission, CommentMenuPermission, UserService, Router, ExcelService, DateFormat)
export class CommentMngCS {


    //Comment
    ListComment = [];
    ListCommentsr = [];
    ListCommentExport = [];
    ListLoaiCmtAll = [];
    ListLoaicmtlv1 = [];
    jsonToPost = {};

    Disablecmblv1 = true;
    Disablecmblv2 = true;
    DisableExport = false;
    disabledetail = false;
    isFull;
    isLimit;
    router;
    _userid;
    username;
    arr = [];

    constructor(bindingEngine, logService, dialogService, commentService, commentCSPermission, commentMenuPermission, userService, route, excelService, dateFormat) {

        this.commentService = commentService;
        this.logService = logService;
        this.dialogService = dialogService;
        this.commentCSPermission = commentCSPermission;
        this.commentMenuPermission = commentMenuPermission;
        this.userService = userService;
        this.excelService = excelService;
        this.dateFormat = dateFormat;
        //Pagination
        this.current = 1;
        this.itemperpage = 20;
        this.orderselect = 0;
        this.pagesize = 20;
        this.sDate = "";
        this.eDate = "";
        this.PointallTeam = 0;
        this.DanhGia = true;
        this.noidungkhongtimthay = "";
        this.router = route;
        let subscriptioncurrent = bindingEngine.propertyObserver(this, 'current')
            .subscribe(() => {
                this.SearchComment();
            });
        setInterval(() => this.DataTimer(), 10000);
        setInterval(() => {

            this.ListComment = this.ListComment.map(x => {
                return Object.assign({}, x, {
                    timmer: this.CountTime(
                        x.Comment.NgayGioTao)
                    , NgayGioTraloi: this.CountTime2(x.Comment.NgayGioTao, x.NgayGioTraLoi)
                    , IshowTimer: x.Comment.TrangThai.Id == 1 ? true : false
                    , IshowCmt: this.Timerwarning(x.Comment.NgayGioTao, x.Comment.TrangThai.Id) == 1 ? true : false
                })
            });

        }, 1000);
    }



    bind(ct, ovr) {
        if (this.ListComment != null)
            ovr.bindingContext.total = this.ListComment.length;
    }

    DataTimer() {
        this.commentService.CommentSearch2(this.strQuery).then((data) => {
            if (data.status === 200 && data.data !== "NOT_FOUND") {

                if (this.isLimit == true) {
                    this.ListComment = data.data.ListComments.filter(x => x.MaNVCSTiepNhan == this._userid).map(x => {
                        return Object.assign({}, x, {
                            timmer: this.CountTime(
                                x.Comment.NgayGioTao)
                            , NgayGioTraloi: this.CountTime2(x.Comment.NgayGioTao, x.NgayGioTraLoi)
                            , IshowTimer: x.Comment.TrangThai.Id == 1 ? true : false
                            , IshowCmt: this.Timerwarning(x.Comment.NgayGioTao, x.Comment.TrangThai.Id) == 1 ? true : false
                        })
                    });

                }
                if (this.isFull == true) {
                   
                    this.ListComment = data.data.ListComments.map(x => {
                        return Object.assign({}, x, {
                            timmer: this.CountTime(
                                x.Comment.NgayGioTao)
                            , NgayGioTraloi: this.CountTime2(x.Comment.NgayGioTao, x.NgayGioTraLoi)
                            , IshowTimer: x.Comment.TrangThai.Id == 1 ? true : false
                            , IshowCmt: this.Timerwarning(x.Comment.NgayGioTao, x.Comment.TrangThai.Id) == 1 ? true : false
                        })
                    });


                }
                this.total = 20 * data.data.TotalPage;
                this.TotalItem = data.data.TotalItem;
                this.PointallTeamm = this.round(this.TotalAllTeam(this.ListComment, this.total));
            }
        });
    }

    activate() {

        this._useridlogout = Lockr.get('UserInfo').UserId;
        this.Init();
        return Promise.all([
            this.commentService.GetListLoaiCommentv2()
        ]).then((rs) => {

            if (!this.CheckArrisNull(rs[0])) {
                this.ListLoaiCmtAll = rs[0].data.ListLoaiComent;
                this.ListTrangThai = rs[0].data.ListTrangThai;
                this.ListTrangThaiComment = rs[0].data.ListTrangThai.filter(x => x.LoaiTrangThai === "CM");
                this.ListTrangThaiDanhGia = this.ListTrangThai.filter(x => x.LoaiTrangThai === "DG");
                this.ListLoaiCmt = this.ListLoaiCmtAll.filter(x => x.ParentId == null);
                this.NhanVienSO = rs[0].data.ListNhanVienTiepNhan.filter(x => x.Phongban === "SO");

            }

            this.username = Lockr.get('UserInfo').Roles;
            this._userid = Lockr.get('UserInfo').PersonalId;

            for (let i of this.username) {
                this.commentCSPermission.IsArray(i.Code);
            }

            this.isNoAccess = this.commentMenuPermission.isCs();
            this.isFull = this.commentCSPermission.isFull();
            this.isLimit = this.commentCSPermission.isLimit();

            if (this.isLimit == true) {
                this.commentCSPermission.isExportFnc() == true ? this.ishidenexcel = true : this.ishidenexcel = false
                this.DanhGia = false;
                this.NhanVienCS = rs[0].data.ListNhanVienTiepNhan.filter(x => x.MaNV === this._userid);

            }

            if (this.isFull == true) {
                this.ishidenexcel = true;
                this.DisableExport = false;
                this.NhanVienCS = rs[0].data.ListNhanVienTiepNhan.filter(x => x.Phongban === "CS");

            }

        });

    }



    CheckArrisNull(arr) {
        return arr == null || arr == "underfined" ? true : false;
    }
    async CallbackService(parentId) {
        return await Promise.all([this.commentService.GetListLoaiCommentv2()]).then((rs) => {
            this.ListLoaicmtlv2 = rs[0].data.ListLoaiComent.filter(x => x.ParentId == parentId && x.Level == 3);
        });
    }
    ChangeLoaiCmntFilterByParentId(array, parentId, arr1, arr2) {
        if (arr1 === "lv2" && arr1 !== null) {

            this.ListLoaicmtlv1 = array.filter(x => x.ParentId == parentId && x.Level == 2);
        }
        if (arr2 === "lv3" && arr2 !== null) {

            this.CallbackService(parentId);
        }
    }


    attached() {

        $('#TrangThaiCommentid').on('change', () => {
            this.CheckConditioncb();
        })
        $('#TrangThaiCommentlv1id').on('change', () => {
            this.CheckConditioncb1();
        })

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

        $('#filterTrangThaiComment').on('change', () => {
            this.filterTrangThaiComment = $('#filterTrangThaiComment').val();

        })

    }

    TotalAllTeam(arr, _length) {
        var sum = 0;
        for (let i = 0; i < arr.length; i++) {
            sum += arr[i].DiemDanhGia;
        }
        return sum / _length;
    }

    CheckConditioncb() {
        this.Disablecmblv1 = false;
        if (this.loaicmt == -1) {
            this.Disablecmblv1 = true;
            this.Disablecmblv2 = true;
        }


        if (this.loaicmt == 0) {
            this.loaicmtlv1 = 0;
            this.Disablecmblv1 = true;
            this.Disablecmblv2 = true;
            this.ListLoaicmtlv2 = [];
            this.ListLoaicmtlv1 = [];
        } else {
            this.ChangeLoaiCmntFilterByParentId(this.ListLoaiCmtAll, this.loaicmt, "lv2", null);
        }

    }
    CheckConditioncb1() {
        if (this.loaicmtlv1 == 0) {
            this.loaicmtlv2 = 0;
            this.Disablecmblv2 = true;
            this.ListLoaicmtlv2 = [];
        } else {
            this.Disablecmblv2 = false;
            this.ChangeLoaiCmntFilterByParentId(this.ListLoaiCmtAll, this.loaicmtlv1, null, "lv3");
        }
    }
    Init() {
        this.CommentId = "";
        this.TenSanPham = "";
        this.NguoiComment = "";
        this.LoaiHienThi = null;
        this.LoaiCommentLevel1 = null;
        this.LoaiCommentLevel2 = null;
        this.LoaiCommentLevel3 = null;
        this.MaNVCSTiepNhan = null;
        this.MaNVSOTiepNhan = null;
        this.NgayBatDau = null;
        this.NgayKetThuc = null;
        this.TrangThaiCM = null;
        this.TrangThaiDG = null;
    }
    validateNumber(number) {
        var re = /[0-9]|\./;
        return re.test(number);
    }
    validateName(str) {

        var regex = /^[0-9A-Za-z\$ ]{0,30}$/;
        return regex.test(str);
    }

    testTypes = {
        "Stt": "String",
        "CommentId": "String",
        "NgayGioTao": "String",
        "TenLoaiComment": "String",
        "TenLoaiCommentLv1": "String",
        "TenLoaiCommentLv2": "String",
        "TenLoaiCommentLv3": "String",
        "HoTen": "String",
        "NoiDung": "String",
        "TenSanPham": "String",
        "CSreply1": "String",
        "CSreply2": "String",
        "CSreply3": "String",
        "NVCS": "String",
        "NVSO": "String",
        "TGTL": "String",
        "DGQL": "String",
        "TT": "String",
        "TGC": "String"
    };
    headerTable = [
        "STT",
        "ID Comment",
        "Ngày Comment",
        "Loại Comment",
        "Loại Comment Cấp 1",
        "Loại Comment Cấp 2",
        "Loại Comment Cấp 3",
        "Người Comment",
        "Nội dung Comment",
        "Sản phẩm",
        "Nội dung CS trả lời 1",
        "Nội dung CS trả lời 2",
        "Nội dung CS trả lời 3",
        "Nhân viên CS tiếp nhận",
        "Nhân viên SO tiếp nhận",
        "Thời gian trả lời",
        "Đánh giá của QL",
        "Trạng thái",
        "Thời gian chờ"

    ];

    download() {
        this.excelService.download(this.excelService.jsonToSsXml(this.exportExcel(this.ListCommentExport), this.headerTable, this.testTypes), 'ReportComment.xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }

    exportExcel(List) {
        var testJson = [];
        var o = {};
        for (var item of List) {
            let NgayGioTraLoi = moment(item.NgayGioTraLoi).format("DD/MM/YYYY HH:mm:ss");
            let NgayGioTao = moment(item.NgayGioTao).format("DD/MM/YYYY HH:mm:ss");
            o.Stt = item.Stt;
            o.CommentId = item.CommentId;
            o.NgayGioTao = moment(item.NgayGioTao).format("DD/MM/YYYY HH:mm:ss");
            (item.LoaiCommentLevel1Id == null || item.LoaiCommentLevel1Id == "") ? o.TenLoaiComment = "" : o.TenLoaiComment = item.LoaiCommentLevel1Id.TenLoaiComment;
            (item.LoaiCommentLevel2Id == null || item.LoaiCommentLevel2Id == "") ? o.TenLoaiCommentLv1 = "" : o.TenLoaiCommentLv1 = item.LoaiCommentLevel2Id.TenLoaiComment;
            (item.LoaiCommentLevel3Id == null || item.LoaiCommentLevel3Id == "") ? o.TenLoaiCommentLv2 = "" : o.TenLoaiCommentLv2 = item.LoaiCommentLevel3Id.TenLoaiComment;
            (item.LoaiCommentLevel4Id == null || item.LoaiCommentLevel4Id == "") ? o.TenLoaiCommentLv3 = "" : o.TenLoaiCommentLv3 = item.LoaiCommentLevel4Id.TenLoaiComment;
            (item.ThongTinKhachHang == null || item.ThongTinKhachHang == "") ? o.HoTen = "" : o.HoTen = item.ThongTinKhachHang.HoTen;
            o.NoiDung = item.NoiDung;
            (item.SP_TenSP == null || item.SP_TenSP == "") ? o.TenSanPham = item.SP_URL : o.TenSanPham = item.SP_TenSP;

            (item.Replies[0] == null || item.Replies[0] == "" || item.Replies[0] == undefined) ? o.CSreply1 = "" : o.CSreply1 = item.Replies[0].NoiDung;
            (item.Replies[1] == null || item.Replies[1] == "" || item.Replies[1] == undefined) ? o.CSreply2 = "" : o.CSreply2 = item.Replies[1].NoiDung;
            (item.Replies[2] == null || item.Replies[2] == "" || item.Replies[2] == undefined) ? o.CSreply3 = "" : o.CSreply3 = item.Replies[2].NoiDung;
            (item.TenNVCSTiepNhan == null || item.TenNVCSTiepNhan == "" || item.TenNVCSTiepNhan == undefined) ? o.NVCS = "" : o.NVCS = item.TenNVCSTiepNhan;
            (item.TenNVSOTiepNhan == null || item.TenNVSOTiepNhan == "" || item.TenNVSOTiepNhan == undefined) ? o.NVSO = "" : o.NVSO = item.TenNVSOTiepNhan;
            (item.NgayGioTraLoi == null || item.NgayGioTraLoi == "" || item.NgayGioTraLoi == undefined) ? o.TGTL = "" : o.TGTL = moment(item.NgayGioTraLoi).format("DD/MM/YYYY HH:mm:ss");
            (item.DiemDanhGia == null || item.DiemDanhGia == "" || item.DiemDanhGia == undefined) ? o.DGQL = "" : o.DGQL = item.DiemDanhGia;
            (item.TrangThaiCM_Text == null || item.TrangThaiCM_Text == "" || item.TrangThaiCM_Text == undefined) ? o.TT = "" : o.TT = item.TrangThaiCM_Text;

            moment.utc(moment(NgayGioTraLoi, "DD/MM/YYYY HH:mm:ss").diff(moment(NgayGioTao, "DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss") == "Invalid date" ? o.TGC = "" : o.TGC = moment.utc(moment(NgayGioTraLoi, "DD/MM/YYYY HH:mm:ss").diff(moment(NgayGioTao, "DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss");
            testJson.push(o);
            o = {};
            NgayGioTraLoi = null;
            NgayGioTao = null;
        }
        return testJson;
    }

    ResetData() {
        Promise.all([this.commentService.ResetData("phongBan=CS")]).then((rs) => {

            if (rs[0].status === 200) {
                toastr.success("Reset thành công", "QUẢN LÝ COMMENT");
                this.logService.InsertAdminCPLog("VTA APP | CS | QuanLyComment  | ResetData", rs[0].status, "Success");
                this.commentService.CommentSearch2(this.strQuery).then((data) => {
                    if (data.status === 200 && data.data !== "NOT_FOUND") {
                        this.logService.InsertAdminCPLog("VTA APP | CS | QuanLyComment  | SearchComment", "Callback", this.strQuery);
                        if (this.isLimit == true) {
                            this.ListComment = data.data.ListComments.filter(x => x.MaNVCSTiepNhan == this._userid);
                        }
                        if (this.isFull == true) {
                            this.ListComment = data.data.ListComments;

                        }
                        this.total = 20 * data.data.TotalPage;
                        this.PointallTeamm = this.round(this.TotalAllTeam(this.ListComment, this.total));
                    }
                });
            }

        });
    }

    ValidateMenuBeforeSubmit() {

        var strErrorMsg = "";
        if (this.CommentId != "" && this.validateName(this.CommentId) == false) {
            strErrorMsg += "'<b>'[ID comment]'</b>' không đúng định dạng. Vui lòng chọn/nhập lại. <br/>";
        }
        if (this.TenSanPham != "" && this.validateName(this.TenSanPham) == false) {
            strErrorMsg += "'<b>'[Sản phẩm] '</b>'không đúng định dạng. Vui lòng chọn/nhập lại. <br/>";
        }
        if (this.NguoiComment === "" && this.validateName(this.NguoiComment) == false) {
            strErrorMsg += "'<b>'[Người comment]'</b>' không đúng định dạng. Vui lòng chọn/nhập lại. <br/>";
        }

        if (strErrorMsg !== "") {
            toastr.error(strErrorMsg, "QUẢN LÝ COMMENT");
            return false;
        }
        return true;
    }

    CheckDatetime() {
        if (($('#txtFilterDateStart').val() === '') && ($('#txtFilterDateEnd').val() === '')) {
            return 1; // two null 
        }
        if (($('#txtFilterDateStart').val() !== '') && ($('#txtFilterDateEnd').val() === '')) {
            return 2; // two null
        }
        if (($('#txtFilterDateStart').val() === '') && ($('#txtFilterDateEnd').val() !== '')) {
            return 3; // two null
        }
    }

    async SearchComment() {

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



        var startDate = $('#txtFilterDateStart').val();
        var endDate = $('#txtFilterDateEnd').val();

        switch (this.CheckDatetime()) {
            case 1:
                toastr.warning("Thời gian bắt đầu và thời gian kết thúc chưa được chọn. Vui lòng chọn lại.", "QUẢN LÝ COMMENT");
                return;
            case 2:
                toastr.warning("Thời gian kết thúc chưa được chọn. Vui lòng chọn lại.", "QUẢN LÝ COMMENT");
                return;
            case 3:
                toastr.warning("Thời gian bắt đầu chưa được chọn. Vui lòng chọn lại.", "QUẢN LÝ COMMENT");
                return;

        }

        var range = moment.range(startDate, endDate);
        if (range.diff('days') >= 93) {
            toastr.warning("Khoảng thời gian tìm kiếm không được quá 3 tháng.", "QUẢN LÝ COMMENT");
            return;
        }
        var ranges = moment.range(endDate, startDate);
        if (ranges.diff('days') >= 93) {
            toastr.warning("Khoảng thời gian tìm kiếm không được quá 3 tháng.", "QUẢN LÝ COMMENT");
            return;
        }

        if (startDate > endDate) {

            toastr.warning("Thời gian bắt đầu > thời gian kết thúc. Vui lòng chọn lại.", "QUẢN LÝ COMMENT");
            return;
        }

        this.sDate = startDate;
        this.eDate = endDate;
        this.shtimkiem = true;
        if (!this.ValidateMenuBeforeSubmit()) {
            return false;
        }
        this.strQuery = "";
        this.arr = [];
        if (this.CommentId) {
            this.arr.push("CommentId=" + this.CommentId);
        }
        if (this.TenSanPham) {
            this.arr.push("TenSanPham=" + this.TenSanPham);
        }
        if (this.NguoiComment) {
            this.arr.push("NguoiComment=" + this.NguoiComment);
        }

        if ($('#TrangThaiCommentid').val()) {
            this.arr.push("loaiCommentLevel1=" + $('#TrangThaiCommentid').val());
        }
        if ($('#TrangThaiCommentlv1id').val()) {
            this.arr.push("loaiCommentLevel2=" + $('#TrangThaiCommentlv1id').val());
        }
        if ($('#TrangThaiCommentlv2id').val()) {
            this.arr.push("loaiCommentLevel3=" + $('#TrangThaiCommentlv2id').val());
        }

        if (this.MaNVSOTiepNhan) {
            this.arr.push("maNVSOTiepNhan=" + this.MaNVSOTiepNhan);
        }
        if (startDate) {
            this.arr.push("ngayBatDau=" + startDate);
        }
        if (endDate) {
            this.arr.push("ngayKetThuc=" + endDate);
        }
        if ($('#filterTrangThaiComment').val()) {
            this.arr.push("trangThaiCM=" + $('#filterTrangThaiComment').val());
        }
        if (this.ttdg) {
            this.arr.push("trangThaiDG=" + this.ttdg);
        }
        this.arr.push("phongBan=CS");
        this.arr.push("pageNo=" + this.current);
        if (this.isLimit == true) {

            this.arr.push("maNVCSTiepNhan=" + Lockr.get('UserInfo').PersonalId)
        }
        else {
            if (this.MaNVCSTiepNhan) {
                this.arr.push("maNVCSTiepNhan=" + this.MaNVCSTiepNhan);
            }
        }
        this.strQuery = this.arr.join("&");
        if ($('#filterTrangThaiComment').val() == "0") {

            return
        } else {

            NProgress.configure({ trickleRate: 0.02, trickleSpeed: 800 });
            NProgress.inc();
            this.Disabletimkiem = true;

            try {
                return await Promise.all([this.commentService.CommentSearch2(this.strQuery)]).then((data) => {
                    if (data[0].status === 200 && data[0].data !== "NOT_FOUND") {
                        NProgress.done();
                        this.Disabletimkiem = false;
                        this.ListComment = data[0].data.ListComments.map(x => {
                            return Object.assign({}, x, {
                                timmer: this.CountTime(
                                    x.Comment.NgayGioTao)
                                , NgayGioTraloi: this.CountTime2(x.Comment.NgayGioTao, x.NgayGioTraLoi)
                                , IshowTimer: x.Comment.TrangThai.Id == 1 ? true : false
                                , IshowCmt: this.Timerwarning(x.Comment.NgayGioTao, x.Comment.TrangThai.Id) == 1 ? true : false
                            })
                        });
                        this.total = 20 * data[0].data.TotalPage;
                        this.TotalItem = data[0].data.TotalItem;
                        this.mydatalength = this.ListComment.length;
                        this.PointallTeamm = this.round(this.TotalAllTeam(this.ListComment, this.total));

                        if (this.ListComment.length == 0) {
                            NProgress.done();
                            this.Disabletimkiem = false;
                            this.ListComment = [];
                            this.mydatalength = 0;
                            this.PointallTeamm = 0;
                            this.TotalItem = 0;
                            this.noidungkhongtimthay = "Không tìm thấy danh sách comment thỏa điều kiện.";
                        }

                    } else {
                        NProgress.done();
                        this.Disabletimkiem = false;
                        this.ListComment = [];
                        this.mydatalength = 0;
                        this.PointallTeamm = 0;
                        this.TotalItem = 0;
                        this.noidungkhongtimthay = "Không tìm thấy danh sách comment thỏa điều kiện.";
                    }


                });
            } catch (err) {
                NProgress.done();
            }
        }

    }


    Timerwarning(date1, StatusCmt) {
        var kt
        var GioComent = moment(date1).format("H");
        if (GioComent >= 8 && GioComent < 22) {
            var date1 = new Date(moment(date1).add(30, 'minutes').format('YYYY/MM/DD H:m:ss'))
            var date2 = new Date(moment().format("YYYY/MM/DD H:m:ss"));
            var diff = date1 - date2;
            var seconds = moment.duration(diff).seconds();
            var minutes = moment.duration(diff).minutes();
            var hours = Math.trunc(moment.duration(diff).asHours());
            if ((minutes <= 9 && StatusCmt == 1) || StatusCmt == 2) {
                kt = 1
            }


        }

        else {
            var date1 = new Date(moment().format("YYYY/MM/DD 10:00:00"));
            var date2 = new Date(moment().format("YYYY/MM/DD H:m:ss"));
            var diff = date1 - date2;
            var secondss = moment.duration(diff).seconds();
            var minutess = moment.duration(diff).minutes();
            var hourss = Math.trunc(moment.duration(diff).asHours());
            if ((minutes <= 9 && StatusCmt == 1) || StatusCmt == 2) { // thoi gian con lai cua cmt moi warning
                kt = 1
            }


        }

        return kt;


    }



    CountTime(date1) {
        var GioComent = moment(date1).format("H");
        if (GioComent >= 8 && GioComent < 22) {
            var date11 = new Date(moment(date1).add(20, 'minutes').format('YYYY/MM/DD H:m:ss'))
            var date2 = new Date(moment().format("YYYY/MM/DD H:m:ss"));
          
            var diff = date11 - date2;
           
            var seconds = moment.duration(diff).seconds();
            var minutes = moment.duration(diff).minutes();
            var hours = Math.trunc(moment.duration(diff).asHours());
            //var days = moment(moment(date1).toArray()).to(date2, true);
          
           
            if (minutes == 0 || (date11 < date2)) {
                return 0 + ":" + 0 + ":" + 0;
            }
            return hours + ":" + minutes + ":" + seconds;
        }
        else {
            var date11 = new Date(moment().format("YYYY/MM/DD 10:00:00"));
            var date2 = new Date(moment().format("YYYY/MM/DD H:m:ss"));
            var diff = date11 - date2;
            var seconds = moment.duration(diff).seconds();
            var minutes = moment.duration(diff).minutes();
            var hours = Math.trunc(moment.duration(diff).asHours());
            var days = moment(moment(date1).toArray()).diff((moment(date2).toArray()), 'days')
            
            if (minutes == 0 || (date11 < date2)) {
                return 0 + ":" + 0 + ":" + 0;
            }
            if (days <=-2) {
                return 0 + ":" + 0 + ":" + 0;
            }
            return hours + ":" + minutes + ":" + seconds;
        }
    }
    CountTime2(date1, date2) {

        var date1 = new Date(date1);
        var date2 = new Date(date2); // 5:00 PM

        if (date2 < date1) {
            return "";
        }
        var diff = date2 - date1;
        var seconds = moment.duration(diff).seconds();
        var minutes = moment.duration(diff).minutes();
        var hours = Math.trunc(moment.duration(diff).asHours());
        return hours + ":" + minutes + ":" + seconds;
    }


    async  RunExport() {
        var startDate = $('#txtFilterDateStart').val();
        var endDate = $('#txtFilterDateEnd').val();



        this.sDate = startDate;
        this.eDate = endDate;
        this.shtimkiem = true;
        if (!this.ValidateMenuBeforeSubmit()) {
            return false;
        }
        this.strQuery = "";
        this.arr = [];
        if (this.CommentId) {
            this.arr.push("CommentId=" + this.CommentId);
        }
        if (this.TenSanPham) {
            this.arr.push("TenSanPham=" + this.TenSanPham);
        }
        if (this.NguoiComment) {
            this.arr.push("NguoiComment=" + this.NguoiComment);
        }

        if ($('#TrangThaiCommentid').val()) {
            this.arr.push("loaiCommentLevel1=" + $('#TrangThaiCommentid').val());
        }
        if ($('#TrangThaiCommentlv1id').val()) {
            this.arr.push("loaiCommentLevel2=" + $('#TrangThaiCommentlv1id').val());
        }
        if ($('#TrangThaiCommentlv2id').val()) {
            this.arr.push("loaiCommentLevel3=" + $('#TrangThaiCommentlv2id').val());
        }
        if (this.MaNVCSTiepNhan) {
            this.arr.push("maNVCSTiepNhan=" + this.MaNVCSTiepNhan);
        }
        if (this.MaNVSOTiepNhan) {
            this.arr.push("maNVSOTiepNhan=" + this.MaNVSOTiepNhan);
        }
        if (startDate) {
            this.arr.push("ngayBatDau=" + startDate);
        }
        if (endDate) {
            this.arr.push("ngayKetThuc=" + endDate);
        }
        if ($('#filterTrangThaiComment').val()) {
            this.arr.push("trangThaiCM=" + $('#filterTrangThaiComment').val());
        }
        if (this.ttdg) {
            this.arr.push("trangThaiDG=" + this.ttdg);
        }
        this.arr.push("phongBan=CS");
        this.arr.push("pageNo=" + this.current);
        this.strQuery = this.arr.join("&");
        if ($('#filterTrangThaiComment').val() == "0") {

            return
        } else {

            var splashHtml = '<div class="splash card">' +
                '<div role="spinner">' +
                '<div class="spinner-icon"></div>' +
                '</div>' +
                '<p style="text-align:center">Đang xử lý...</p>' +
                '<div class="progress">' +
                '<div class="mybar" role="bar">' +
                '</div>' +
                '</div>' +
                '</div>';
            NProgress.configure({
                template: splashHtml
            });
            NProgress.configure({ trickleRate: 0.02, trickleSpeed: 800 });
            NProgress.inc();
            this.Disabletimkiem = true;

            try {
                return await Promise.all([this.commentService.Export(this.strQuery)]).then((data) => {
                    this.ListCommentExport = data[0].data;


                    if (this.ListCommentExport.length > 0) {
                        NProgress.done();

                        this.Disabletimkiem = false;
                        this.download();
                    }
                });
            } catch (err) {
                NProgress.done();
            }
        }

    }



    round(num) {
        return +(Math.round(num + "e+2") + "e-2");
    }

    ViewdlgCommmentDetail(item) {

        this.disabledetail = true;
        this.dialogService.open({
            viewModel: CommentMngDetailCS,
            model: item
        }).then((result) => {

            if (result.wasCancelled) {
                this.disabledetail = false;
                this.commentService.CommentSearch2(this.strQuery).then((data) => {
                    if (data.status === 200 && data.data !== "NOT_FOUND") {
                        this.ListComment = data.data.ListComments.map(x => {
                            return Object.assign({}, x, {
                                timmer: this.CountTime(
                                    x.Comment.NgayGioTao)
                                , NgayGioTraloi: this.CountTime2(x.Comment.NgayGioTao, x.NgayGioTraLoi)
                                , IshowTimer: x.Comment.TrangThai.Id == 1 ? true : false
                                , IshowCmt: this.Timerwarning(x.Comment.NgayGioTao, x.Comment.TrangThai.Id) == 1 || this.Timerwarning(x.Comment.NgayGioTao, x.Comment.TrangThai.Id) == 2 ? true : false


                            })
                        });
                        this.total = 20 * data.data.TotalPage;
                        this.TotalItem = data.data.TotalItem;
                        this.PointallTeamm = this.round(this.TotalAllTeam(this.ListComment, this.total));
                    }
                });

            }
        });
    }



}
export class FormatCommentforLengthValueConverter {
    toView(cmt) {
        let tmp = "";
        tmp = _.truncate(cmt.trim(), {
            'length': 80,
            'separator': /,? +/
        });
        return tmp;
    }
}
export class FormatLoaicmtValueConverter {
    toView(lv1, lv2, lv3, lv4, lv5) {
        if (lv1 == null) {
            return "Chưa phân loại";
        } else
            if (lv5 == null) {
                return lv2 + '-' + lv3 + '-' + lv4;
            }
        return lv2 + '-' + lv3 + '-' + lv4 + '-' + lv5;
    }
}
export class FilterByTrangThaiCommentValueConverter {
    toView(array, tt) {

        if (tt != "" && tt != null && typeof tt !== "undefined") {

            return array.filter(x => x.CM_NVQuanLyDanhGiaId == tt);


        } else {
            return array;
        }

    }
}