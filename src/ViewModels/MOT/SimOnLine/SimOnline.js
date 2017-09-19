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
    SimOnlineService
} from 'Services/MOT/SimOnlineService';
import { DoiTraXaHangService } from '../../../Services/AffiliateSvc/DoiTraXaHangService';
import moment from 'moment';
import 'momentrange';
import * as toastr from "toastr";
import 'eonasdan-bootstrap-datetimepicker';
import 'select2';
import {
    SimOnlineDetail
} from './SimOnlineDetail';
import {
    DialogService
} from 'aurelia-dialog';
import NProgress from 'nprogress';
import _ from 'lodash';

//import 'nprogress';
import { ExcelService } from 'Helpers/ExcelHelper';
import { DateFormat } from 'Helpers/datetime-format';
import { SimSoPermission } from 'Configuration/PermissionSettings/SimSoPermission';
@inject(BindingEngine, LogService, DialogService, SimOnlineService, ExcelService, DateFormat, DoiTraXaHangService, SimSoPermission)
export class SimOnline {


    //Comment
    ListItems = [];
    ListItemss = [];
    ListNhaMang = [];
    ListTrangThai = [];
    ListMenhGia = [];
    ListQLDonHang = [];
    ListCoSo = [];
    ListHTTT = [];
    ListTT = [];
  
    Disablenhacc = true;
    Disablemg = true;
    DisableTimKiem = false;
    disabledetail = false;
    data;
    DataChiNhanh;
    jsonToPost = {};
    arr = [];
    strQuery = "";
    isexport = "false"
    TongTien=0;
    constructor(bindingEngine, logService, dialogService, simOnlineService, excelService, dateFormat, doiTraXaHangService, simSoPermission) {

        this.simOnlineService = simOnlineService;
        this.logService = logService;
        this.dialogService = dialogService;
        this.excelService = excelService;
        this.dateFormat = dateFormat;
        this.doiTraXaHangService = doiTraXaHangService;
        this.simSoPermission = simSoPermission;
        //Pagination
        this.current = 1;
        this.itemperpage = 20;
        this.orderselect = 0;
        this.pagesize = 20;
        this.sDate = "";
        this.eDate = "";
        this.PointallTeamm = 0;
        this.magiaodichvl = "";
        this.noidungkhongtimthay = "";
        let subscriptioncurrent = bindingEngine.propertyObserver(this, 'current')
            .subscribe(() => {
                this.SearchSimSo();
            });
    }

    async activate() {
        toastr.options.timeOut = 300;
        toastr.options.extendedTimeOut = 300;
        this.isQL();
        this.rs = await this.simOnlineService.GetSimSoConfig();
        this.DataChiNhanh = await this.doiTraXaHangService.Getlistxahangconfig(Lockr.get('UserInfo').Username);
        this.ListGiaTu = this.rs.data.Data.ListGiaTu;
        this.ListGiaDen = this.rs.data.Data.ListGiaDen;
        this.ListNhaMang = this.rs.data.Data.ListNhaMang;
        this.ListTrangThai = this.rs.data.Data.ListTrangThai;
        this.ListMenhGia = this.rs.data.Data.ListMenhGia;
        this.ListQLDonHang = this.rs.data.Data.ListQLDonHang;
        this.ListCoSo = this.DataChiNhanh.data.ListCoSo;

    }
    isQL() {
        this.Roloes = Lockr.get('UserInfo').Roles;
        for (let i of this.Roloes) {
            this.simSoPermission.IsArray(i.Code);
        }
        if (this.simSoPermission.isLimit() == true) {
            this.isLimit = true;
        }
        else {
            this.isLimit = false;
        }
       
    }
    attached() {

        $('#CoSo').select2().val(this.filterCoSo);
        $('#CoSo').select2({
            placeholder: "- Chọn Chi Nhánh -",
            allowClear: true
        }).on('change', () => {
            this.Coso = $('#CoSo').val();
        });


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

     


        $('#CoSo').select2().val(this.filterCoSo);
        $('#CoSo').select2({
            placeholder: "- Chọn Cơ sở -",
            allowClear: true
        }).on('change', () => {
            this.Coso = $('#CoSo').val();

        });


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

    SearchSimSo() {
        this.DisableTimKiem = false;

        var splashHtml = '<div class="splash card">' +
            '<div role="spinner">' +
            '<div class="spinner-icon"></div>' +
            '</div>' +
            '<p class="lead" style="text-align:center">Vui lòng chờ...</p>' +
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

                toastr.warning("Thời gian bắt đầu và thời gian kết thúc chưa được chọn. Vui lòng chọn lại.", "QUẢN LÝ ĐƠN HÀNG SIM SỐ");
                return;
            case 2:

                toastr.warning("Thời gian kết thúc chưa được chọn. Vui lòng chọn lại.", "QUẢN LÝ ĐƠN HÀNG SIM SỐ");
                return;
            case 3:

                toastr.warning("Thời gian bắt đầu chưa được chọn. Vui lòng chọn lại.", "QUẢN LÝ ĐƠN HÀNG SIM SỐ");
                return;

        }

        var range = moment.range(startDate, endDate);
        if (range.diff('days') >= 93) {

            toastr.warning("Khoảng thời gian tìm kiếm không được quá 3 tháng.", "QUẢN LÝ ĐƠN HÀNG SIM SỐ");
            return;
        }
        var ranges = moment.range(endDate, startDate);
        if (ranges.diff('days') >= 93) {

            toastr.warning("Khoảng thời gian tìm kiếm không được quá 3 tháng.", "QUẢN LÝ ĐƠN HÀNG SIM SỐ");
            return;
        }

        if (startDate > endDate) {

            toastr.warning("Thời gian bắt đầu > thời gian kết thúc. Vui lòng chọn lại.", "QUẢN LÝ ĐƠN HÀNG SIM SỐ");
            return;
        }
        if (this.giatu > this.giaden) {

            toastr.warning("Mệnh giá [Giá từ] > [Giá đến] là không hợp lệ. Vui lòng chọn lại.", "QUẢN LÝ ĐƠN HÀNG SIM SỐ");
            return;
        }
        if (this.giaden < this.giatu) {

            toastr.warning("Mệnh giá [Giá đến] < [Giá từ] là không hợp lệ. Vui lòng chọn lại.", "QUẢN LÝ ĐƠN HÀNG SIM SỐ");
            return;
        }

        this.strQuery = "";
        this.arr = [];
        this.arr.push("isExport=" + this.isexport);
        if (startDate) {
            this.arr.push("oBj.ngayBatDau=" + startDate);
            this.sDate = startDate;
        }
        if (endDate) {
            this.arr.push("oBj.ngayKetThuc=" + endDate);
            this.eDate = endDate;
        }
        if (this.madonhang) {
            this.arr.push("oBJ.id=" + this.madonhang);
        }
        if (this.email) {
            this.arr.push("oBJ.email=" + this.email);
        }
        if (this.giatu) {
            this.arr.push("oBJ.giaTu=" + this.giatu);
        }
        if (this.giaden) {
            this.arr.push("oBJ.giaDen=" + this.giaden);
        }
        if (this.sodienthoai) {
            this.arr.push("oBJ.phone=" + this.sodienthoai);
        }
        if (this.sothuebao) {
            this.arr.push("oBJ.thueBao=" + this.sothuebao);
        }
        if (this.Coso) {
            this.arr.push("oBJ.chiNhanhId=" + this.Coso);
        }
        if (this.TTvl) {
            this.arr.push("oBJ.status=" + this.TTvl);
        }
        if (this.tenkhachang) {
            this.arr.push("oBJ.fullName=" + this.tenkhachang);
        }
        if (this.nhamang) {
            this.arr.push("oBJ.nhaMang=" + this.nhamang);
        }
        if (this.quanlydh) {
            this.arr.push("oBJ.quanLyDonHang=" + this.quanlydh)
        }
        // if (this.isLimit == true) {
        //     this.arr.push("oBJ.quanLyDonHang=" + Lockr.get('UserInfo').EmployeeId)
        // }
      
        this.arr.push("pageNo=" + this.current);

        this.strQuery = this.arr.join("&");
     
     
        
        NProgress.start();
        NProgress.set(0.8);
        try {

            return Promise.all([this.simOnlineService.Search(this.strQuery)]).then((rs) => {
                if (rs[0].data.Message == 'INVALID_DATA') {
                    NProgress.done();
                    this.Disabletimkiem = false;
                    this.total = 0;
                    this.TotalItem = 0;

                }
                NProgress.done();
                this.Disabletimkiem = false;
                if (rs[0].data.Result == true) {

                    this.ListItems = rs[0].data.Data.ListResults;
                    this.total = 20 * rs[0].data.Data.TotalPage;
                    this.TotalItem = rs[0].data.Data.TotalItem;
                    this.TongTien=rs[0].data.Data.TongTien
                }
                else {
                    NProgress.done();
                    this.Disabletimkiem = false;

                    toastr.warning("Tìm kiếm thất bại. Vui lòng thử lại.", "QUẢN LÝ ĐƠN HÀNG SIM SỐ");
                    this.total = 0;
                    this.TotalItem = 0;

                }
            });

        } catch (error) {
            this.total = 0;
            this.TotalItem = 0;
            this.Disabletimkiem = false;
            this.noidungkhongtimthay = "Không tìm thấy danh sách đơn hàng thỏa điều kiện.";
            NProgress.done();
        }

    }


    testTypes = {
        "STT": "String",
        "NgayGiaoDich": "String",
        "MaGiaoDich": "String",
        "Phone": "String",
        "HinhThucThanhToan": "String",
        "Nguon": "String",
        "NhaCungCap": "String",
        "MenhGia": "String",
        "TongTien": "String",
        "TrangThai": "String"

    };
    headerTable = [
        "STT",
        "NgayGiaoDich",
        "MaGiaoDich",
        "Phone",
        "HinhThucThanhToan",
        "Nguon",
        "NhaCungCap",
        "MenhGia",
        "TongTien",
        "TrangThai"
    ];
    Getdatadownload() {
        this.arr[0] = "isExport=true";
        this.strQuery = this.arr.join("&");
        return Promise.all([this.simOnlineService.Search(this.strQuery)]).then((rs) => {
            if (rs[0].data.Result == true) {
                this.ListItemss = rs[0].data.Data.ListResults;

            }
        })

    }

    async  download() {
        await this.Getdatadownload();
        this.disabledetail = true;
        this.excelService.download(this.excelService.jsonToSsXml(this.XuatExcel(this.ListItemss), this.headerTable, this.testTypes), 'ReportDonHangSimSo.xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        this.disabledetail = false;
    }

    XuatExcel(ListItemss) {

        var testJson = [];
        var obj = {};
        let i = 1;
        for (var item of ListItemss) {
            obj.STT = i++;
            obj.NgayGiaoDich = moment(item.simSoMic.NgayGiaoDich).format("DD/MM/YYYY HH:mm:ss");
            obj.MaGiaoDich = item.simSoMic.Id;
            obj.Phone = item.simSoMic.C_Phone;
            obj.HinhThucThanhToan = item.simSoMic.P_HTTT == "14" ? "Thanh toán khi nhận hàng" : "Thanh toán trực tuyến";
            obj.Nguon = "WEB";
            obj.NhaCungCap = item.simSoMic.NhaMang;
            obj.MenhGia = item.simSoMic.GiaSIM;
            obj.TongTien = item.simSoMic.ThanhTien;
            obj.TrangThai = this.GetbyNameTrangThai(item.simSoMic.STATUS);
            testJson.push(obj);
            obj = {};
        }

        return testJson;
    }

    GetbyNameTrangThai(key) {
        var status;
        switch (key) {
            case "0":
                status = "Mới";
                break;
            case "2":
                status = "Đã xác nhận";
                break;
            case "3":
                status = "Đã Lock thành công";
                break;
            case "4":
                status = "Lock thất bại";
                break;
            case "5":
                status = "Đã thanh toán";
                break;
            case "6":
                status = "Thanh toán thất bại";
                break;
            case "7":
                status = "Giao hàng thành công";
                break;
            case "8":
                status = "Giao hàng thất bại";
                break;
            case "9":
                status = "Hủy đơn hàng";
                break;
            case "10":
                status = "Khách hàng hủy";
                break;
            case "11":
                status = "Không liên lạc được khách hàng";
                break;

            default:
                status = "";
                break;
        }
        return status
    }

    ViewdlgSimOnlineDetail(item) {
        this.disabledetail = true;
        this.dialogService.open({
            viewModel: SimOnlineDetail,
            model: item,
            lock: true
        }).then((result) => {
       
            if (result.wasCancelled) {
                this.disabledetail = false;
                return Promise.all([this.simOnlineService.Search(this.strQuery)]).then((rs) => {
                 
                    if (rs[0].data.Message == 'INVALID_DATA') {
                        NProgress.done();
                        this.Disabletimkiem = false;
                        this.total = 0;
                        this.TotalItem = 0;

                    }
                    NProgress.done();
                    this.Disabletimkiem = false;
                    if (rs[0].data.Result == true) {

                        this.ListItems = rs[0].data.Data.ListResults;
                        this.total = 20 * rs[0].data.Data.TotalPage;
                        this.TotalItem = rs[0].data.Data.TotalItem;
                    }
                    else {
                        NProgress.done();
                        this.Disabletimkiem = false;

                        toastr.warning("Tìm kiếm thất bại. Vui lòng thử lại.", "QUẢN LÝ ĐƠN HÀNG SIM SỐ");
                        this.total = 0;
                        this.TotalItem = 0;

                    }
                });
            }
        });
    }



}


