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
import $ from "jquery";
import * as toastr from "toastr";
import 'eonasdan-bootstrap-datetimepicker';
@inject(DialogController, HttpClient, Configuration)
export class QuanLyPrivateSaleChuongTrinh {
    ListItems = []
    SelectFile = []

    constructor(dialogController, httpClient, configuration) {

        this.dialogController = dialogController;
        this.http = httpClient
        this.http.configure(config => {
            config
                .useStandardConfiguration()
                .withBaseUrl('http://10.10.40.171:8082');
        });
        this.current = 1;
        this.itemperpage = 20;
        this.pagesize = 20;
        console.log('QuanLyPrivateSaleChuongTrinh')
     
    }
    attached() {
        $('#txtFilterDateStart').datetimepicker({
            format: "YYYY-MM-DD HH:mm:ss"
        });
        $("#txtFilterDateStart").on("dp.change", () => {
            this.dateStartFilter = $('#txtFilterDateStart').val();
        });
        $('#txtFilterDateEnd').datetimepicker({
            format: "YYYY-MM-DD HH:mm:ss"
        });
        $("#txtFilterDateEnd").on("dp.change", () => {
            this.dateEndFilter = $('#txtFilterDateEnd').val();
        });
    }

    cancelButtonClick() {
        this.dialogController.cancel();
    }

    ValidateBeforeSubmit() {
        var strErrorMsg = "";
        if (this.CampaignName == "" || typeof this.CampaignName === "undefined")
            strErrorMsg += "• Vui lòng chọn tên chương trình. <br/>";
        if (this.dateStartFilter == "" || typeof this.dateStartFilter === "undefined")
            strErrorMsg += "• Vui lòng chọn ngày bắt đầu. <br/>";
        if (this.dateEndFilter == "" || typeof this.dateEndFilter === "undefined")
            strErrorMsg += "• Vui lòng chọn ngày kết thúc. <br/>";
        if (this.SelectFile.length == 0 || typeof this.SelectFile === "undefined")
            strErrorMsg += "• Vui lòng chọn file upload <br/>";
        if (strErrorMsg !== "") {
            toastr.error(strErrorMsg, "Lỗi dữ liệu nhập!");
            return false;
        }
        return true;

    }
    onSelectFile(item) {
        this.SelectFile = item
        if (this.SelectFile.length > 0) {
            this.DisableHuy = false
        }
        else {
            this.DisableHuy = true
        }

    }
    async doSubmit() {
        var startDate = $('#txtFilterDateStart').val();
        var endDate = $('#txtFilterDateEnd').val();
        if (startDate >= endDate) {
            toastr.warning("Thời gian bắt đầu >= thời gian kết thúc. Vui lòng chọn lại.", "Lỗi dữ liệu nhập");
            return;
        }
        this.ValidateBeforeSubmit();
        console.log(this.CampaignName)
        console.log(this.dateStartFilter)
        console.log(this.dateEndFilter)
        console.log(this.SelectFile[0])
        var fd = new FormData();
        fd.append("UploadFile", this.SelectFile[0]);
        fd.append("EndDate", moment(this.dateEndFilter).format('YYYY-MM-DD HH:mm:ss'));
        fd.append("StartDate", moment(this.dateStartFilter).format('YYYY-MM-DD HH:mm:ss'));
        fd.append("CampaignName", this.CampaignName);
        fd.append("CreatedUser", Lockr.get('UserInfo').Username);
        this.DisableHuy = true;
        await this.http.fetch('/v2/PrivateSale/CreateBusinessCampaignAfterUploadProduct', {
            method: 'post',
            body: fd,

        })
            .then(response => response.json())
            .then(data => {
                this.ListItems = data
                console.log(data)
                if (data.includes("ERROR")) {
                    this.ListItems = []
                    this.DisableHuy = false;
                    this.total = 0;
                    toastr.error(data, "Thêm chương trình private sales")
                }
                else{
                    toastr.success("Ghi nhận thông tin chương trình thành công.", "Thêm chương trình private sales")
                    this.total = this.ListItems.length;
                    console.log(this.total)
                    this.DisableHuy = false;
                }

            })
            .catch();



    }
}