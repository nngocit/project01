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

import moment from 'moment';
import 'momentrange';
import * as toastr from "toastr";
import 'eonasdan-bootstrap-datetimepicker';
import 'select2';
import {
    QuanLyPrivateSaleChuongTrinhEdit
} from '../AffiliateVM/QuanLyPrivateSaleChuongTrinhEdit'
import {
    QuanLyPrivateSaleChuongTrinh
} from '../AffiliateVM/QuanLyPrivateSaleChuongTrinh'
import {
    QuanLyPrivateSaleTheLeChuongtrinh
} from '../AffiliateVM/QuanLyPrivateSaleTheLeChuongtrinh'
import {
    QuanLyPrivateSaleKhungGio
} from '../AffiliateVM/QuanLyPrivateSaleKhungGio'
import {
    DialogService
} from 'aurelia-dialog';
import NProgress from 'nprogress';
import _ from 'lodash';
import {
    PrivateSalesService
} from 'Services/MOT/PrivateSalesService';
//import 'nprogress';
import { DateFormat } from 'Helpers/datetime-format';

@inject(BindingEngine, LogService, DialogService, PrivateSalesService)
export class QuanLyPrivateSales {


    disabledetail = true
    Disabletimkiem = true;
    hienthi = true
    isnoidung = false
    noidung = ''
    dateStartFilters = ""
    dateEndFilters = ""
    dateStartFilter = ""
    dateEndFilter = ""
    constructor(bindingEngine, logService, dialogService, privateSalesService) {
        this.dialogService = dialogService
        this.privateSalesService = privateSalesService
        this.current = 1;
        this.itemperpage = 20;
        this.pagesize = 20;
        let subscriptioncurrent = bindingEngine.propertyObserver(this, 'current')
        .subscribe(() => {
            this.search();
        });
    }
    async activate() {
        console.log('QuanLyPrivateSalestest')

    }
    attached() {
        $('#txtFilterDateStartbd').datetimepicker({
            format: "YYYY-MM-DD"
        });
        $("#txtFilterDateStartbd").on("dp.change", () => {
            this.dateStartFilters = $('#txtFilterDateStartbd').val();
            this.CheckViewNgayTao(this.dateStartFilters, this.dateEndFilters, this.dateStartFilter, this.dateEndFilter)

        });
        $('#txtFilterDateEndkt').datetimepicker({
            format: "YYYY-MM-DD"
        });
        $("#txtFilterDateEndkt").on("dp.change", () => {
            this.dateEndFilters = $('#txtFilterDateEndkt').val();
            this.CheckViewNgayTao(this.dateStartFilters, this.dateEndFilters, this.dateStartFilter, this.dateEndFilter)

        });


        //
        $('#txtFilterDateStart').datetimepicker({
            format: "YYYY-MM-DD"
        });
        $("#txtFilterDateStart").on("dp.change", () => {
            this.dateStartFilter = $('#txtFilterDateStart').val();
            this.CheckViewHieuLuc(this.dateStartFilters, this.dateEndFilters, this.dateStartFilter, this.dateEndFilter)

        });
        $('#txtFilterDateEnd').datetimepicker({
            format: "YYYY-MM-DD"
        });
        $("#txtFilterDateEnd").on("dp.change", () => {
            this.dateEndFilter = $('#txtFilterDateEnd').val();
            this.CheckViewHieuLuc(this.dateStartFilters, this.dateEndFilters, this.dateStartFilter, this.dateEndFilter)
        });
    }

    CheckViewNgayTao(starts, ends, start, end) {
        if ((starts == "") && (ends == "") && (start != "") && (end != "")) {
            console.log('Hiệu lực')
            console.log(start, end)
            this.hienthi = false
            this.noidung = 'Hiệu lực'
        }

        if ((starts != "") && (ends != "") && (start != "") && (end != "")) {
            console.log(starts, ends)
            this.hienthi = true
            this.noidung = 'Ngày tạo'
        }
        if ((starts != "") && (ends != "") && (start == "") && (end == "")) {
            console.log(starts, ends)
            this.hienthi = true
            this.noidung = 'Ngày tạo'
        }
        if ((starts == "") && (ends == "") && (start == "") && (end == "")) {
            this.noidung = ""
        }
    }
    CheckViewHieuLuc(starts, ends, start, end) {
        if ((starts == "") && (ends == "") && (start == "") && (end == "")) {
            this.noidung = ""
        }
        if ((starts == "") && (ends == "") && (start != "") && (end != "")) {
            console.log('Hiệu lực')
            console.log(start, end)
            this.hienthi = false
            this.noidung = 'Hiệu lực'
        }

        if ((starts != "") && (ends != "") && (start != "") && (end != "")) {
            console.log(starts, ends)
            this.hienthi = true
            this.noidung = 'Ngày tạo'
        }
        if ((starts != "") && (ends != "") && (start == "") && (end == "")) {
            console.log(starts, ends)
            this.hienthi = true
            this.noidung = 'Ngày tạo'
        }
    }

    ChuongTrinh() {
        this.dialogService.open({
            viewModel: QuanLyPrivateSaleChuongTrinh,
            lock: true
        }).then((result) => {
            console.log("result.wasCancelled", result.wasCancelled)
            if (result.wasCancelled) {
                try {
                    console.log(JSON.stringify(this.strQuery))
                    return Promise.all([this.privateSalesService.privatesalesSearch(this.strQuery)]).then((data) => {
                        this.disabledetail = true
                        this.Disabletimkiem = true;
                        this.ListItems = data[0].data.ListResults;

                        NProgress.done();
                        this.disabledetail = false
                        this.Disabletimkiem = false;
                        this.total = 20 * data[0].data.TotalPage;


                        this.TotalItem = data[0].data.TotalItem;
                        if (this.total == 0) {
                            this.noidungkhongtimthay = "Không tìm thấy danh sách sản phẩm thỏa điều kiện.";
                        }

                    })
                } catch (err) {
                    NProgress.done();
                }
            }
        });
    }
    ChuongTrinhEdit(o) {
        this.dialogService.open({
            viewModel: QuanLyPrivateSaleChuongTrinhEdit,
            model: o,
            lock: true
        }).then((result) => {
            console.log("result.wasCancelled", result.wasCancelled)
            if (result.wasCancelled) {
                try {
                    console.log(JSON.stringify(this.strQuery))
                    return Promise.all([this.privateSalesService.privatesalesSearch(this.strQuery)]).then((data) => {
                        this.disabledetail = true
                        this.Disabletimkiem = true;
                        this.ListItems = data[0].data.ListResults;

                        NProgress.done();
                        this.disabledetail = false
                        this.Disabletimkiem = false;
                        this.total = 20 * data[0].data.TotalPage;


                        this.TotalItem = data[0].data.TotalItem;
                        if (this.total == 0) {
                            this.noidungkhongtimthay = "Không tìm thấy danh sách sản phẩm thỏa điều kiện.";
                        }

                    })
                } catch (err) {
                    NProgress.done();
                }
            }
        });
    }
    Thelechuongtrinh(o) {
        this.dialogService.open({
            viewModel: QuanLyPrivateSaleTheLeChuongtrinh,
            model: o,
            lock: true
        }).then((result) => {
            console.log("result.wasCancelled", result.wasCancelled)
            if (result.wasCancelled) {
                try {
                    console.log(JSON.stringify(this.strQuery))
                    return Promise.all([this.privateSalesService.privatesalesSearch(this.strQuery)]).then((data) => {
                        this.disabledetail = true
                        this.Disabletimkiem = true;
                        this.ListItems = data[0].data.ListResults;

                        NProgress.done();
                        this.disabledetail = false
                        this.Disabletimkiem = false;
                        this.total = 20 * data[0].data.TotalPage;


                        this.TotalItem = data[0].data.TotalItem;
                        if (this.total == 0) {
                            this.noidungkhongtimthay = "Không tìm thấy danh sách sản phẩm thỏa điều kiện.";
                        }

                    })
                } catch (err) {
                    NProgress.done();
                }
            }
        });
    }
    khunggio(o) {
        this.dialogService.open({
            viewModel: QuanLyPrivateSaleKhungGio,
            model: o,
            lock: true
        }).then((result) => {
            console.log("result.wasCancelled", result.wasCancelled)
            if (result.wasCancelled) {
            }
        });
    }
    CheckDatetime() {
        var a

        if (($('#txtFilterDateStartbd').val() !== '') && ($('#txtFilterDateEndkt').val() === '')) {
            a = 1; // two null
        }
        if (($('#txtFilterDateStartbd').val() === '') && ($('#txtFilterDateEndkt').val() !== '')) {
            a = 2; // two null
        }
        if (($('#txtFilterDateStart').val() !== '') && ($('#txtFilterDateEnd').val() === '')) {
            a = 3; // two null
        }
        if (($('#txtFilterDateStart').val() === '') && ($('#txtFilterDateEnd').val() !== '')) {
            a = 4; // two null
        }
        if ($('#txtFilterDateStart').val() > $('#txtFilterDateEnd').val()) {
            a = 5; // two null
        }
        if ($('#txtFilterDateStartbd').val() > $('#txtFilterDateEndkt').val()) {
            a = 6; // two null
        }





        console.log(a)
        return a
    }
    search() {
        this.strQuery = "";
        this.arr = [];
        var startDate = $('#txtFilterDateStart').val();
        var endDate = $('#txtFilterDateEnd').val();
        var startDatebd = $('#txtFilterDateStartbd').val();
        var endDatekt = $('#txtFilterDateEndkt').val();
        switch (this.CheckDatetime()) {
            case 1:
                toastr.warning("Thời gian kết thúc ngày tạo chưa được chọn. Vui lòng chọn lại.", "QUẢN LÝ ĐƠN HÀNG PRIVATE SALES");
                return;
            case 2:
                toastr.warning("Thời gian bắt đầu ngày tạo chưa được chọn. Vui lòng chọn lại.", "QUẢN LÝ ĐƠN HÀNG PRIVATE SALES");
                return;
            case 3:
                toastr.warning("Thời gian kết thúc hiệu lực chưa được chọn. Vui lòng chọn lại.", "QUẢN LÝ ĐƠN HÀNG PRIVATE SALES");
                return;
            case 4:
                toastr.warning("Thời gian bắt đầu hiệu lực chưa được chọn. Vui lòng chọn lại.", "QUẢN LÝ ĐƠN HÀNG PRIVATE SALES");
                return;
            case 5:
                toastr.warning("Thời gian bắt đầu hiệu lực > thời gian kết thúc hiệu lực. Vui lòng chọn lại.", "QUẢN LÝ ĐƠN HÀNG PRIVATE SALES");
                return;
            case 6:
                toastr.warning("Thời gian bắt đầu ngày tạo > thời gian kết thúc ngày tạo. Vui lòng chọn lại.", "QUẢN LÝ ĐƠN HÀNG PRIVATE SALES");
                return;

        }

     
        if (this.Id) {
            this.arr.push("filterDTO.sale.id=" + this.Id);
        }
        if (startDatebd) {
            this.arr.push("filterDTO.sale.startDate=" + startDatebd);

        }
        if (endDatekt) {
            this.arr.push("filterDTO.sale.endDate=" + endDatekt);
        }

        if (startDate) {
            this.arr.push("filterDTO.sale.startDateCampaing=" + startDate);
            this.sDate = startDate

        }
        if (endDate) {
            this.arr.push("filterDTO.sale.endDateCampaign=" + endDate);
            this.eDate = endDate

        }
        if (this.Name) {
            this.arr.push("filterDTO.sale.Name=" + this.Name);
        }
        if (this.Status) {
            this.arr.push("filterDTO.sale.Status=" + this.Status);
        }
        this.arr.push("filterDTO.pageNo=" + this.current);
        console.log('this.current', this.current)
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
        if (startDate > endDate) {
            toastr.warning("Thời gian bắt đầu > thời gian kết thúc. Vui lòng chọn lại.", "QUẢN LÝ ĐƠN HÀNG PRIVATE SALES");
            return;
        }
        NProgress.set(0.6);
        this.strQuery = this.arr.join("&");
        try {
            console.log(JSON.stringify(this.strQuery))
            return Promise.all([this.privateSalesService.privatesalesSearch(this.strQuery)]).then((data) => {
                this.disabledetail = true
                this.Disabletimkiem = true;
                this.ListItems = data[0].data.ListResults;

                NProgress.done();
                this.disabledetail = false
                this.Disabletimkiem = false;
                this.total = 20 * data[0].data.TotalPage;


                this.TotalItem = data[0].data.TotalItem;
                if (this.total == 0) {
                    this.noidungkhongtimthay = "Không tìm thấy danh sách sản phẩm thỏa điều kiện.";
                }

            })
        } catch (err) {
            NProgress.done();
        }
    }


}