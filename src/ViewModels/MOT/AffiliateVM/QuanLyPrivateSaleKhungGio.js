import {
    inject, BindingEngine
} from 'aurelia-framework';
import {
    DialogController
} from 'aurelia-dialog';
import {
    QuanLyPrivateSaleKhungGioSp
} from '../AffiliateVM/QuanLyPrivateSaleKhungGioSp'
import {
    QuanLyPrivateSaleKhungGioSpEdit
} from '../AffiliateVM/QuanLyPrivateSaleKhungGioSpEdit'
import {
    DialogService
} from 'aurelia-dialog';
import {
    PrivateSalesService
} from 'Services/MOT/PrivateSalesService';
import * as toastr from "toastr";
import moment from 'moment';
import 'momentrange';
import _ from 'lodash';
import 'eonasdan-bootstrap-datetimepicker';
@inject(DialogController, DialogService, PrivateSalesService)
export class QuanLyPrivateSaleKhungGio {
    ListItems = []
    ItemList = []
    constructor(dialogController, dialogService, privateSalesService) {
        this.dialogController = dialogController;
        this.dialogService = dialogService;
        this.privateSalesService = privateSalesService;
        this.current = 1;
        this.itemperpage = 20;
        this.pagesize = 20;
    }
    attached() {
        $('#txtFilterDateStart').datetimepicker({
            format: "YYYY-MM-DD HH:mm:ss"
        });
        $("#txtFilterDateStart").on("dp.change", () => {
            this.StartTime = $('#txtFilterDateStart').val();
        });
        $('#txtFilterDateEnd').datetimepicker({
            format: "YYYY-MM-DD HH:mm:ss"
        });
        $("#txtFilterDateEnd").on("dp.change", () => {
            this.EndTime = $('#txtFilterDateEnd').val();
        });
    }
    async activate(o) {
        console.log('QuanLyPrivateSaleKhungGio')

        console.log(JSON.stringify(o))
        this.ItemList = o
        return Promise.all([this.privateSalesService.listkhunghio(this.ItemList.Business_campaign_id)]).then((data) => {
            this.ListItems = data[0].data;
            this.total = this.ListItems.length

        })
        console.log(JSON.stringify(o))
    }
    ValidateBeforeSubmit() {

        var strErrorMsg = "";
        // if ((moment($('#txtFilterDateStart').val(), '"YYYY-MM-DD HH:mm:ss').isValid() == true) ||(moment($('#txtFilterDateEnd').val(), '"YYYY-MM-DD HH:mm:ss').isValid() == true) ) {
        //     console.log($('#txtFilterDateStart').val())
        //     console.log($('#txtFilterDateEnd').val())
        //     toastr.error('Định dạng Ngày tháng không hợp lệ, Vui lòng thử lại', "Lỗi dữ liệu nhập!");
        //     return false;
        // }
        console.log($('#txtFilterDateStart').val())
       console.log($('#txtFilterDateEnd').val())
        if ($('#txtFilterDateStart').val() == "" || typeof $('#txtFilterDateStart').val() === "undefined")
            strErrorMsg += "• Vui lòng chọn ngày bắt đầu. <br/>";
        if ($('#txtFilterDateEnd').val() == "" || typeof $('#txtFilterDateEnd').val() === "undefined")
            strErrorMsg += "• Vui lòng chọn ngày kết thúc. <br/>";
        if (strErrorMsg !== "") {
            toastr.error(strErrorMsg, "Lỗi dữ liệu nhập!");
            return false;
        }
        return true;
    }
    kiemtragio() {
        var startDate = $('#txtFilterDateStart').val();
        var endDate = $('#txtFilterDateEnd').val();
        console.log(startDate)
        console.log(endDate)
        var st = $('#txtFilterDateStart').val()
        var ed = $('#txtFilterDateEnd').val()
        var rg = moment.range(moment(st).format('YYYY-MM-DD 00:00:00'), moment(ed).format('YYYY-MM-DD 00:00:00'));
        console.log('aaaaaaaaa', rg.diff('days'))

        var range = moment.range(startDate, endDate);
        console.log(range.diff('days'))
        console.log(range.diff('hours'))
        console.log(range.diff('days'))
        console.log(range.diff('hours'))

        if (startDate >= endDate) {
            toastr.warning("Thời gian bắt đầu >= thời gian kết thúc. Vui lòng chọn lại.", "Quản lý khung giờ private sales");
            return;
        }
        if (rg.diff('days') == 0 && range.diff('hours') <= 24) {
            return true
        }
        if ((rg.diff('days') >= 1 && range.diff('hours') <= 24) || (rg.diff('days') >= 1 && range.diff('hours') == 'undefined')) {
            toastr.warning("Thời gian bắt đầu và thời gian kết thúc không cùng 1 ngày. Vui lòng chọn lại.", "Quản lý khung giờ private sales");
            return false
        }
        if (rg.diff('days') >= 1) {
            toastr.warning("Thời gian bắt đầu và thời gian kết thúc không cùng 1 ngày. Vui lòng chọn lại.", "Quản lý khung giờ private sales");
            return false
        }
        if (rg.diff('days') <= 1) {
            toastr.warning("Thời gian bắt đầu và thời gian kết thúc không cùng 1 ngày. Vui lòng chọn lại.", "Quản lý khung giờ private sales");
            return false
        }

    }

    them() {

        if (!this.ValidateBeforeSubmit()) { return; }
        if (!this.kiemtragio()) { return };

        let obj = {}
        obj.PrivateSaleId = this.ItemList.Business_campaign_id
        obj.StartTime = this.StartTime
        obj.EndTime = this.EndTime
        obj.CreatedUser = Lockr.get('UserInfo').Username
        console.log(JSON.stringify(obj))
        return Promise.all([this.privateSalesService.InsertFrameTime(obj)]).then((data) => {
            if (data[0].data == true) {
                this.StartTime = ""
                this.EndTime = "";
                toastr.success("Thêm khung giờ thành công.", "Quản lý khung giờ private sales");
            }
            else {
                console.log(data[0].data.replace("ERROR-", ""))
                toastr.error(data[0].data.replace("ERROR-", ""), "Quản lý khung giờ private sales");
            }
            return Promise.all([this.privateSalesService.listkhunghio(this.ItemList.Business_campaign_id)]).then((data) => {
                this.ListItems = data[0].data;
                this.total = this.ListItems.length


            })
        })
    }
    async  xoa(cmt) {

        let obj = {}
        obj.Id = cmt.Id
        obj.PrivateSaleId = cmt.PrivateSaleId
        obj.Status = 'R'
        obj.CreatedUser = Lockr.get('UserInfo').Username

        await (Promise.all([
            this.privateSalesService.DeleteFrameTime(obj).then(rec => {
                console.log(JSON.stringify(rec))
                if (rec.data == true) {
                    this.StartTime = "";
                    this.EndTime = "";
                    toastr.success("Xóa khung giờ thành công.", "Quản lý khung giờ private sales");
                    console.log(rec.data)
                    this.privateSalesService.listkhunghio(this.ItemList.Business_campaign_id).then((rs) => {
                        this.ListItems = []
                        this.ListItems = rs.data;
                        this.total = this.ListItems.length
                    })
                }
                else {
                    this.StartTime = "";
                    this.EndTime = "";
                    toastr.error("Xóa khung giờ thất bại.", "Quản lý khung giờ private sales");
                }

            })
        ]))
    }
    cancelButtonClick() {
        this.dialogController.cancel();
    }
    sanpham(o) {
        console.log('11', JSON.stringify(o))
        this.dialogService.open({
            viewModel: QuanLyPrivateSaleKhungGioSp,
            model: o,
            lock: true
        }).then((result) => {
            console.log("result.wasCancelled", result.wasCancelled)
            if (result.wasCancelled) {
            }
        });
    }
    khunggio(o) {

        this.dialogService.open({
            viewModel: QuanLyPrivateSaleKhungGioSpEdit,
            model: o,
            lock: true
        }).then((result) => {
            console.log("result.wasCancelled", result.wasCancelled)
            if (result.wasCancelled) {
            }
        });
    }
}