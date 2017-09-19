import {
    inject, BindingEngine
} from 'aurelia-framework';
import {
    DialogController
} from 'aurelia-dialog';
import { HttpClient, json } from 'aurelia-fetch-client';
import { Configuration } from '../../../Services/Configuration';
import moment from 'moment';
import 'momentrange';
import * as toastr from "toastr";
import 'eonasdan-bootstrap-datetimepicker';
import 'select2';
import {
    PrivateSalesService
} from 'Services/MOT/PrivateSalesService';
@inject(DialogController, HttpClient, Configuration, PrivateSalesService)
export class QuanLyPrivateSaleChuongTrinhEdit {
    ListItems = []
    SelectFile = []
    ItemList = [];
    constructor(dialogController, httpClient, configuration, privateSalesService) {

        this.dialogController = dialogController;
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
            this.start = $('#txtFilterDateStart').val();
        });
        $('#txtFilterDateEnd').datetimepicker({
            format: "YYYY-MM-DD HH:mm:ss"
        });
        $("#txtFilterDateEnd").on("dp.change", () => {
            this.end = $('#txtFilterDateEnd').val();
        });
    }

    cancelButtonClick() {
        this.dialogController.cancel();
    }
    activate(item) {
        console.log('QuanLyPrivateSaleChuongTrinhEdit')

        this.ItemList = item;
        console.log(JSON.stringify(this.ItemList))
        this.start = this.ItemList.Date_start
        this.end = this.ItemList.Date_end



        return Promise.all([this.privateSalesService.listsanpham(this.ItemList.Business_campaign_id)]).then((data) => {
            this.ListItems = data[0].data;
            this.total = this.ListItems.length

        })
        this.total = this.ListItems.length;

    }
    ValidateBeforeSubmit() {
      
        var strErrorMsg = "";
        if (this.ItemList.Name == "" || typeof this.ItemList.Name === "undefined")

            strErrorMsg += "• Vui lòng chọn tên chương trình. <br/>";
        if (strErrorMsg !== "") {
            toastr.error(strErrorMsg, "Lỗi dữ liệu nhập!");
            return false;
        }

        return true;

    }

    async doSubmit() {
        var startDate = $('#txtFilterDateStart').val();
        var endDate = $('#txtFilterDateEnd').val();
        if (startDate >= endDate) {
            toastr.warning("Thời gian bắt đầu >= thời gian kết thúc. Vui lòng chọn lại.", "Lỗi dữ liệu nhập");
            return;
        }
        if (this.ValidateBeforeSubmit() == false) { return; }
        let json = {}
        json.Id = this.ItemList.Business_campaign_id
        json.Name = this.ItemList.Name
        json.StartDateCampaing = this.start
        json.EndDateCampaign = this.end
        json.Status = this.ItemList.Status
        json.CreatedUser = Lockr.get('UserInfo').Username
        console.log(JSON.stringify(json))
        return Promise.all([this.privateSalesService.update(json)]).then((data) => {

            if (data[0].data == true) {
                toastr.success("Cập nhật thông tin chương trình thành công.", "Quản lý khung giờ private sales");
            }
            else {
                toastr.error(data[0].data.replace("ERROR-", "''"), "Quản lý khung giờ private sales");
            }
        })
    }
}