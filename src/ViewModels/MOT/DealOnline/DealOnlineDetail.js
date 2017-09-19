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
    DialogService
} from 'aurelia-dialog';
import 'trumbowyg';
import {
    DealOnlineMngService
} from 'Services/MOT/DealOnlineMngService';

import {
    LogService
} from 'Services/LogService';
import { ExcelService } from 'Helpers/ExcelHelper';
import { DateFormat } from 'Helpers/datetime-format';
@inject(DialogController, DialogService, DealOnlineMngService, LogService, ExcelService, DateFormat)
export class DealOnlineDetail {

    ListTT = [];
    DetailCard = [];
    Disablett = false;
    Disablesms = false;
    dialogController: DialogController

    constructor(dialogController, dialogService, dealOnlineMngService, logService, excelService, dateFormat) {

        this.dialogController = dialogController;
        this.dealOnlineMngService = dealOnlineMngService;
        this.dialogService = dialogService;
        this.logService = logService;
        this.excelService = excelService;
        this.dateFormat = dateFormat;
        //Pagination
        this.current = 1;
        this.itemperpage = 20;
        this.orderselect = 0;
        this.pagesize = 20;




    }

    activate(data) {
        // Get id to call api 
        console.log(JSON.stringify(data));
        this.Disablesms = false;
        this.entity = data;

        if (data.Status == "PAYMENT_FAIL" || data.Status == "CANCEL" || data.Status == "FAIL" || data.Status == "SUCCESS") {
            this.Disablett = true;
        }
        if (data.Status == "SUCCESS") {
            this.Disablesms = false;

        } else {
            this.Disablesms = true;
        }
        return Promise.all([
            this.dealOnlineMngService.GetListAllConfig(), this.dealOnlineMngService.SearchDetail(data.Id)
        ]).then((data) => {
            this.TTvl = this.entity.Status;
            console.log('aaa', this.TTvl);
            this.DetailCard = data[1].Data.Cards;
            if (this.DetailCard.length == 0) {
                this.Disablesms = true;
            } else {
                this.Disablesms = false;
            }

            if (this.entity.Status == "CREATED") {

                this.ListTT = data[0].Data.filter(x => x.Code == "CANCEL" || x.Code == "PAYMENT" || x.Code == "CREATED");
            }
            if (this.entity.Status == "PAYMENT") {

                this.ListTT = data[0].Data.filter(x => x.Code == "CANCEL" || x.Code == "PAYMENT_SUCCESS" || x.Code == "PAYMENT_FAIL" || x.Code == "PAYMENT");
            }
            if (this.entity.Status == "PAYMENT_SUCCESS") {

                this.ListTT = data[0].Data.filter(x => x.Code == "CANCEL" || x.Code == "SUCCESS" || x.Code == "FAIL" || x.Code == "PAYMENT_SUCCESS");
            }


            this.total = this.DetailCard.length;


        });
    }


    attached() {

    }

    testTypes = {
        "STT": "String",
        "NhaCungCap": "String",
        "MenhGia": "String",
        "SoSerie": "String"


    };
    headerTable = [
        "STT",
        "Nhà cung cấp",
        "Mệnh giá",
        "Số Serie"


    ];
    download() {
        this.logService.InsertAdminCPLog("MOT | QuanLyGiaoDichOnline | Export Excel Detail", "Success", "Xuất report excel!");
        this.excelService.download(this.excelService.jsonToSsXml(this.exportExcel(this.DetailCard), this.headerTable, this.testTypes), 'GiaoDichOnlineChiTiet.xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }

    exportExcel(List) {

        var testJson = [];
        var obj = {};
        let i = 1;
        for (var item of List) {
            obj.STT = i++;
            obj.NhaCungCap = item.NhaCungCap;
            obj.MenhGia = item.MenhGia;
            obj.SoSerie = item.SoSerie;


            testJson.push(obj);
            obj = {};
        }
        return testJson;
    }
    Update() {

        let jsonToPost = {};
        jsonToPost.MaGiaoDich = this.entity.Id;
        jsonToPost.NewStatus = this.TTvl;
        if ($('#TTId').val() === "") {
            toastr.warning("Vui lòng chọn trạng thái", "QUẢN LÝ GIAO DỊCH ONLINE");
            return;
        } else {

            this.dealOnlineMngService.Update(jsonToPost).then((rs) => {

                if (rs.Result == true) {
                    this.logService.InsertAdminCPLog("MOT | QuanLyGiaoDichOnline | Update Status Giao Dich", "Success", jsonToPost);
                    toastr.success("Cập nhật trạng thái giao dịch thẻ cào Online thành công.", "QUẢN LÝ GIAO DỊCH ONLINE");

                }
                this.dialogController.ok("True");
            });
        }
    }

    Sms() {
        this.Disablesms = true;
        let jsonToPost = {};
        jsonToPost.SoDienThoai = this.entity.Phone;
        jsonToPost.DanhSachThe = this.DetailCard;

        this.dealOnlineMngService.Sms(jsonToPost).then((rs) => {

            if (rs.Result == true) {
                this.logService.InsertAdminCPLog("MOT | QuanLyGiaoDichOnline |Send SMS", "Success", jsonToPost);
                toastr.success("Gửi danh sách mã thẻ cho khách hàng thành công.", "QUẢN LÝ GIAO DỊCH ONLINE");

            } else {
                toastr.warning("Gửi danh sách mã thẻ cho khách hàng thất bại.", "QUẢN LÝ GIAO DỊCH ONLINE");
            }

        });
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