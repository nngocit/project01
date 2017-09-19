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
    DealOnlineMngService
} from 'Services/MOT/DealOnlineMngService';
import moment from 'moment';
import 'momentrange';
import * as toastr from "toastr";
import 'eonasdan-bootstrap-datetimepicker';
import 'select2';
import {
    DealOnlineDetail
} from './DealOnlineDetail';
import {
    DialogService
} from 'aurelia-dialog';
import NProgress from 'nprogress';
import _ from 'lodash';

//import 'nprogress';
import { ExcelService } from 'Helpers/ExcelHelper';
import { DateFormat } from 'Helpers/datetime-format';
@inject(BindingEngine, LogService, DialogService, DealOnlineMngService, ExcelService, DateFormat)
export class DealOnline {


    //Comment

    ListGiaoDich = [];
    ListTypeGiaoDich = [];
    Listsource = [];
    Listsourcesp = [];
    ListCost = [];
    ListHTTT = [];
    ListTT = [];
    HideNote = false;
    Disablenhacc = true;
    Disablemg = true;
    DisableTimKiem = false;

    jsonToPost = {};
    constructor(bindingEngine, logService, dialogService, dealOnlineMngService, excelService, dateFormat) {

        this.dealOnlineMngService = dealOnlineMngService;
        this.logService = logService;
        this.dialogService = dialogService;
        this.excelService = excelService;
        this.dateFormat = dateFormat;

        //Pagination
        this.current = 1;
        this.itemperpage = 20;
        this.orderselect = 0;
        this.pagesize = 20;
        this.sDate = "";
        this.eDate = "";
        this.PointallTeamm = 0;

        this.magiaodichvl = "";
    }

    bind(ct, ovr) {
        if (this.ListComment != null)
            ovr.bindingContext.total = this.ListComment.length;
    }

    activate() {


        return Promise.all([
            this.dealOnlineMngService.GetListAllConfig()
        ]).then((rs) => {
            this.ListTypeGiaoDich = rs[0].Data.filter(x => x.Type == "LOAIGIAODICH");
            this.Listsource = rs[0].Data.filter(x => x.Type == "NGUON");
            this.Listsourcesp = rs[0].Data.filter(x => x.Type == "NHACUNGCAP");
            this.ListCost = rs[0].Data.filter(x => x.Type == "MENHGIA");
            this.ListHTTT = rs[0].Data.filter(x => x.Type == "HINHTHUCTHANHTOAN");
            this.ListTT = rs[0].Data.filter(x => x.Type == "TRANGTHAI");
        });
    }


    attached() {

        $('#LoaigiaodichId').on('change', () => {
            this.CheckDisablenhacc();
            if ($('#LoaigiaodichId').val() === "") {
                this.Nhacungcvl = "";
                this.Menhgiavl = "";
                this.Disablenhacc = true;
                this.Disablemg = true;

            }
        })
        $('#NhacungcId').on('change', () => {
            this.CheckDisablemg();
            if ($('#NhacungcId').val() === "") {
                this.Menhgiavl = "";
                this.Disablemg = true;
            }
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

        $('#TTId').on('change', () => {

            console.log($('#TTId').val())
            if ($('#TTId').val() == "") {
                this.HideNote = false;
            } else {
                this.HideNote = true;
            }
        })

    }


    CheckDisablenhacc() {
        this.Disablenhacc = false;

    }
    CheckDisablemg() {
        this.Disablemg = false;
    }
    async SearchComment() {
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

        if (startDate == "" && endDate != "") {
            startDate = moment().subtract(92, 'days').format("YYYY-MM-DD");


        }

        if (endDate == "" && startDate != "") {
            endDate = moment().add(92, 'days').format("YYYY-MM-DD");
        }
        this.sDate = startDate;
        this.eDate = endDate;
        var range = moment.range(startDate, endDate);
        if (range.diff('days') >= 93) {
            toastr.warning("Khoảng thời gian tìm kiếm không được quá 3 tháng.", "QUẢN LÝ GIAO DỊCH ONLINE");
            return;
        }


        if (startDate > endDate) {
            toastr.warning("Thời gian bắt đầu > thời gian kết thúc. Vui lòng chọn lại.", "QUẢN LÝ GIAO DỊCH ONLINE");
            return;
        }

        if ((this.magiaodichvl !== null || this.magiaodichvl !== "") && this.magiaodichvl.indexOf("CARDVTA") !== -1)
            this.magiaodichvl = this.magiaodichvl.replace("CARDVTA", "");

        this.jsonToPost.MaGiaoDich = this.magiaodichvl.replace("CARDVTA", "");
        this.jsonToPost.LoaiGiaoDich = this.Loaigdvl;
        this.jsonToPost.HinhThucThanhToan = this.Htttvl;
        this.jsonToPost.Nguon = this.Nguonvl;
        this.jsonToPost.NhaCungCap = this.Nhacungcvl;
        this.jsonToPost.NgayBatDau = startDate;
        this.jsonToPost.NgayKetThuc = endDate;
        this.jsonToPost.SoDienThoai = this.sdtkhachhangvl;
        this.jsonToPost.MenhGia = this.Menhgiavl;
        this.jsonToPost.TrangThai = this.TTvl;
        NProgress.start();
        NProgress.set(0.8);
        try {

            return await this.dealOnlineMngService.Search(this.jsonToPost).then((data) => {
                if (data.Result == true) {
                    this.DisableTimKiem = false;

                    NProgress.done();
                    this.ListGiaoDich = data.Data;

                    this.total = this.ListGiaoDich.length;
                    this.PointallTeamm = this.TotalPrice(this.ListGiaoDich);
                    this.logService.InsertAdminCPLog("MOT | QuanLyGiaoDichOnline | TimKiem", data.Result, JSON.stringify(data.Data));

                    if (this.total == 0) {
                        toastr.warning("Không tìm thấy danh sách giao dịch Online thỏa điều kiện.", "QUẢN LÝ GIAO DỊCH ONLINE");
                    }

                } else {
                    toastr.warning("Tìm kiếm thất bại. Vui lòng thử lại.", "QUẢN LÝ GIAO DỊCH ONLINE");
                }
            });
        } catch (error) {
            NProgress.done();
        }


        if (this.magiaodichvl !== "" && this.magiaodichvl.indexOf("CARDVTA") === -1) {
            this.magiaodichvl = "CARDVTA" + this.magiaodichvl;
        }


    }


    testTypes = {
        "STT": "String",
        "CreatedDate": "String",
        "Id": "String",
        "Masp": "String",
        "Phone": "String",
        "LoaiGiaoDich": "String",
        "HTThanhToan": "String",
        "Nguon": "String",
        "MobiNetwork": "String",
        "Denominations": "String",
        "OrderTotal": "String",
        "Status": "String",

    };
    headerTable = [
        "STT",
        "Ngày giao dịch",
        "Mã giao dịch",
        "Mã POS",
        "Số điện thoại khách hàng",
        "Loại giao dịch",
        "Hình thức thanh toán",
        "Nguồn",
        "Nhà cung cấp",
        "Mệnh giá",
        "Tổng tiền (VNĐ)",
        "Trạng thái"
    ];
    download() {
        this.logService.InsertAdminCPLog("MOT | QuanLyGiaoDichOnline | Export Excel ", "Success", "Xuất report excel!");
        this.excelService.download(this.excelService.jsonToSsXml(this.exportExcel(this.ListGiaoDich), this.headerTable, this.testTypes), 'GiaoDichOnline.xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }

    exportExcel(List) {

        var testJson = [];
        var obj = {};
        let i = 1;
        for (var item of List) {
            obj.STT = i++;
            obj.CreatedDate = moment(item.CreatedDate).format("DD/MM/YYYY HH:mm:ss");
            obj.Id = item.CardOrder.Id;
            obj.Masp = item.Masp;
            obj.Phone = item.CardOrder.Phone;
            obj.LoaiGiaoDich = item.CardOrder.LoaiGiaoDich;
            obj.HTThanhToan = item.CardOrder.HTThanhToan;
            obj.Nguon = item.CardOrder.Nguon;
            obj.MobiNetwork = item.CardOrder.MobiNetwork;
            obj.Denominations = item.CardOrder.Denominations;
            obj.OrderTotal = item.CardOrder.OrderTotal;
            obj.Status = item.CardOrder.Status;
            testJson.push(obj);
            obj = {};
        }
        return testJson;
    }


    //download
    TotalPrice(arr) {
        var sum = 0;
        for (let i = 0; i < arr.length; i++) {

            if (arr[i].Status !== "PAYMENT_FAIL" && arr[i].Status !== "CANCEL" && arr[i].Status !== "FAIL") {
                sum += arr[i].CardOrder.Price;

            }
        }
        return sum
    }


    ViewdlgCommmentDetail(item) {

        this.dialogService.open({
            viewModel: DealOnlineDetail,
            model: item.CardOrder
        }).then((result) => {
            if (!result.wasCancelled) {

                this.dealOnlineMngService.Search(this.jsonToPost).then((data) => {
                    if (data.Result == true) {
                        this.ListGiaoDich = data.Data;
                        this.total = this.ListGiaoDich.length;
                        this.PointallTeamm = this.TotalPrice(this.ListGiaoDich);


                        if (this.total == 0) {
                            toastr.warning("Không tìm thấy danh sách giao dịch Online thỏa điều kiện.", "QUẢN LÝ GIAO DỊCH ONLINE");
                        }

                    } else {
                        toastr.warning("Tìm kiếm thất bại. Vui lòng thử lại.", "QUẢN LÝ GIAO DỊCH ONLINE");
                    }
                });
            }
        });
    }



}


export class TrangThaiValueConverter {
    toView(title) {
        let text = "";
        if (title !== "" && title != null && typeof title !== "undefined") {
            // switch (title) {
            //     case "CREATED":
            //         text = "Mới";
            //         break;
            //     case "PAYMENT":
            //         text = "Đang thanh toán";
            //         break;
            //     case "PAYMENT_SUCCESS":
            //         text = "Đã thanh toán";
            //         break;
            //     case "PAYMENT_FAIL":
            //         text = "Thanh toán thất bại";
            //         break;
            //     case "SUCCESS":
            //         text = "Giao hàng thành công";
            //         break;
            //     case "FAIL":
            //         text = "Giao hàng thất bại";
            //         break;
            //     case "CANCEL":
            //         text = "Hủy";
            //         break;
            //     default:
            //         text = "";
            // }
            switch (title) {
                case "CREATED":
                    text = "Mới tạo";
                    break;
                case "PAYMENT":
                    text = "Đang thanh toán";
                    break;
                case "PAYMENTDONE":
                    text = "Thanh toán thành công";
                    break;
                case "PAYMENT_FAIL":
                    text = "Thanh toán không thành công";
                    break;
                case "FAIL":
                    text = "Thanh toán không thành công";
                    break;
                case "SUCCESS":
                    text = "Giao hàng thành công";
                    break;
                case "DELIVERYFAIL":
                    text = "Giao hàng thất bại";
                    break;
                case "LOCKFAIL":
                    text = "Lock card không thành công";
                    break;
                case "QUANTITYFAIL":
                    text = "Số lượng mua lớn hơn số lượng còn lại trong kho";
                    break;
                default:
                    text = "";
            }
        }
        return text;
    }
}

export class LoaiGDValueConverter {
    toView(title) {
        let text = "";
        if (title !== "" && title != null && typeof title !== "undefined") {
            switch (title) {
                case "TheCao":
                    text = "Thẻ Cào";
                    break;
                default:
                    text = "";
            }
        }
        return text;
    }
}