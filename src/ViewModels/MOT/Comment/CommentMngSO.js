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
    CommentMngDetailSO
} from './CommentMngDetailSO';
import {
    DialogService
} from 'aurelia-dialog';
import _ from 'lodash';
import {
    CommentSOPermission
} from 'Configuration/PermissionSettings/CommentSOPermission';
import { Router } from 'aurelia-router';
import {
    CommentMenuPermission
} from 'Configuration/PermissionSettings/CommentMenuPermission';
import NProgress from 'nprogress';
import { UserService } from 'Services/UserSvc/UserService';
@inject(BindingEngine, LogService, DialogService, CommentService, CommentSOPermission, CommentMenuPermission, Router, UserService)
export class CommentMngSO {


    //Comment
    ListComment = [];
    ListLoaiCmtAll = [];
    ListLoaicmtlv1 = [];
    strQuery = "";
    strQueryNv = "";
    jsonToPost = {};
    Disablecmblv1 = true;
    Disablecmblv2 = true;
    isFull;
    isLimit;
    userId;
    router;
    arr = [];
    constructor(bindingEngine, logService, dialogService, commentService, commentSOPermission, commentMenuPermission, route, userService) {

        this.commentService = commentService;
        this.logService = logService;
        this.dialogService = dialogService;
        this.commentSOPermission = commentSOPermission;
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
        this.noidungkhongtimthay = "";
        this._useridlogout = Lockr.get('UserInfo').UserId;
          let subscriptioncurrent = bindingEngine.propertyObserver(this, 'current')
            .subscribe(() => {
                
        
            this.SearchComment();
            console.log('query',this.strQuery);
            });
    }

    bind(ct, ovr) {
        if (this.ListComment != null)
            ovr.bindingContext.total = this.ListComment.length;
    }

    activate() {

        this.Init();
        return Promise.all([
            this.commentService.GetListLoaiCommentv2()
        ]).then((rs) => {

            //Comment
            if (!this.CheckArrisNull(rs[0])) {
                this.ListLoaiCmtAll = rs[0].data.ListLoaiComent;
                this.ListTrangThai = rs[0].data.ListTrangThai;

                this.ListTrangThaiComment = rs[0].data.ListTrangThai.filter(x =>x.Id===3 || x.Id===4);
                this.ListTrangThaiDanhGia = this.ListTrangThai.filter(x => x.LoaiTrangThai === "DG");
                this.ListLoaiCmt = this.ListLoaiCmtAll.filter(x => x.ParentId == null);
                this.NhanVienCS = rs[0].data.ListNhanVienTiepNhan.filter(x => x.Phongban === "CS");
            }
            //console.log(rs[0].data.ListTrangThai);

            var username = Lockr.get('UserInfo').Roles;
            this.userId = Lockr.get('UserInfo').PersonalId;



            for (let i of username) {
                this.commentSOPermission.IsArray(i.Code);
            }
            this.isNoAccess = this.commentMenuPermission.isSO();
            //    console.log(" this.isNoAccess ", this.isNoAccess);
            this.isFull = this.commentSOPermission.isFull();
             this.isLimit = this.commentSOPermission.isLimit();
            //   console.log("Full", this.isFull);
            //   console.log("Limit", this.isLimit);
            if (this.isLimit == true) { //Limit

                this.NhanVienSO = rs[0].data.ListNhanVienTiepNhan.filter(x => x.MaNV == this.userId);
            } else {
                this.NhanVienSO = rs[0].data.ListNhanVienTiepNhan.filter(x => x.Phongban === "SO");
                //     console.log(JSON.stringify(rs[0].ListNhanVienTiepNhan));
            }



        });

    }






    CheckArrisNull(arr) {
        return arr == null || arr == "underfined" ? true : false;
    }
    async CallbackService(parentId) {
        return await Promise.all([this.commentService.GetListLoaiCommentv2()]).then((rs) => {
            this.ListLoaicmtlv2 = rs[0].Data.ListLoaiComent.filter(x => x.ParentId == parentId && x.Level == 3);
        });
    }
    ChangeLoaiCmntFilterByParentId(array, parentId, arr1, arr2) {
        if (arr1 === "lv2" && arr1 !== null) {
            //  console.log('lv2', parentId);
            this.ListLoaicmtlv1 = array.filter(x => x.ParentId == parentId && x.Level == 2);
        }
        if (arr2 === "lv3" && arr2 !== null) {
            //   console.log('lv3', parentId);
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
                // endDate = moment(new Date()).format("YYYY-MM-DD");
                // startDate = moment(new Date()).format("YYYY-MM-DD");
                // break;
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
        this.shtimkiem = true; //show/hide button search
        if (!this.ValidateMenuBeforeSubmit()) {
            return false;
        }
        this.strQuery ="";
        this.arr=[];
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
        this.arr.push("pageNo=" + this.current);
        this.arr.push("phongBan=SO");
        this.strQuery = this.arr.join("&"); 
       
        if ($('#filterTrangThaiComment').val() == "0") {
            return
        } else {
            NProgress.set(0.4)
            this.Disabletimkiem = true;
            try {
                return await this.commentService.CommentSearch2(this.strQuery).then((data) => {

                    if (data.status === 200 && data.data !== "NOT_FOUND") { // Chỉ hiện data khi status = 200 và được có dữ liệu
                        NProgress.done();
                        this.Disabletimkiem = false;
                  
                        this.logService.InsertAdminCPLog("MOT | QuanLyCommentSO  | SearchComment", data.Result, this.strQuery); // Ghi LogService
                      
                        if (this.isLimit == true) {
                            this.ListComment = data.data.ListComments.filter(x => x.MaNVSOTiepNhan == this.userId);

                        }
                        if (this.isFull == true) {
                            this.ListComment = data.data.ListComments
                        
                           
                        }
                      
                        if(this.ListComment.length==0){
                            this.total = 0;
                            this.ListComment = [];
                            this.mydatalength = 0;
                            this.PointallTeamm = 0;
                            this.noidungkhongtimthay = "Không tìm thấy danh sách comment thỏa điều kiện.";
                        }
                        else
                        {
                                this.total = 20*data.data.TotalPage;
                        }
                     
                    } else {
                        NProgress.done();
                        this.Disabletimkiem = false;
                        this.ListComment = null;
                        this.mydatalength = 0;
                        this.PointallTeamm = 0;
                        this.noidungkhongtimthay = "Không tìm thấy danh sách comment thỏa điều kiện.";
                    }
                });


            } catch (error) {
                NProgress.done();
            }

        }
    }

    round(num) {
        return +(Math.round(num + "e+2") + "e-2");
    }

    ViewdlgCommmentDetail(item) {

        this.dialogService.open({
            viewModel: CommentMngDetailSO,
            model: item
        }).then((result) => {
              console.log(result.wasCancelled);
            if (!result.wasCancelled) {
                     
                      this.commentService.CommentSearch2(this.strQuery).then((data) => {
                   
                        if (this.isLimit == true) {
                            
                            this.ListComment = data.data.ListComments.filter(x => x.MaNVSOTiepNhan == this.userId);

                        }
                        if (this.isFull == true) {
                         
                            this.ListComment = data.data.ListComments.filter(x => x.Comment.CM_TrangThaiId == 3 || x.Comment.CM_TrangThaiId == 4);
                           
                        }
                          if(this.ListComment.length==0){
                            this.total = 0;
                            this.ListComment = [];
                            this.mydatalength = 0;
                            this.PointallTeamm = 0;
                            this.noidungkhongtimthay = "Không tìm thấy danh sách comment thỏa điều kiện.";
                        }
                        else
                        {
                               this.total = 20*data.data.TotalPage;
                               this.PointallTeamm = this.round(this.TotalAllTeam(this.ListComment, this.total));
                        }
                      })

                        
                         
            
            }
        });
    }



}
export class FormatCommentforLengthValueConverter {
    toView(cmt) {
        let tmp = "";
        tmp = _.truncate(cmt, {
            'length': 100,
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

            return array.filter(x => x.CM_TrangThaiId == tt);
        } else {
            return array;
        }

    }
}