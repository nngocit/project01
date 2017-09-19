import { inject } from 'aurelia-framework';
import { json } from 'aurelia-fetch-client';
import { QuaySoService } from 'Services/QuaySo/QuaySoService';
import { ExcelService } from 'Helpers/ExcelHelper';
import { DateFormat } from 'Helpers/datetime-format';
import * as toastr from 'toastr';
import 'select2';
import { LogService } from 'Services/LogService';
@inject(QuaySoService, LogService, ExcelService, DateFormat)
export class KetQuaQuaySo {

    _defaultMonth = "10";
    _defaultYear = "2016";
    pendding = true;

    ListCampaigns = [];
    ListBranchs = [];
    ListKetQuaQuaySoHangThang = [];

    constructor(quaySoService, logService, excelService, dateFormat) {
        this.filterBranch = "";
        this.quaySoService = quaySoService;
        this.logService = logService;
        this.excelService = excelService;
        this.dateFormat = dateFormat;
    }

    activate() {
        return Promise.all([
            this.quaySoService.GetListQuaySoCampaign(),
            this.quaySoService.GetListAllBranch()
        ]).then((rs) => {
            //console.log(rs[1].Data);
            this.ListCampaigns = rs[0].Data;
            this.ListBranchs = rs[1].Data;
        })
    }

    attached() {
        $('#filterByBranch').select2().val(this.filterBranch);
        $('#filterByBranch').select2({
            placeholder: "Tất cả Chi nhánh",
            allowClear: true
        }).on('change', () => {

            this.filterBranch = $('#filterByBranch').val();
        });
    }
    testTypes = {
        "STT": "String",
        "MaQuaySo": "String",
        "TenChiNhanh": "String",
        "TenQuaTang": "String",
        "NgayQuay": "String",
        "CampaignName": "String"
    };
    headerTable = [
        "STT",
        "Mã quay số",
        "Chi Nhánh",
        "Tên Quà Tặng",
        "Ngày Quay",
        "Chương Trình"
    ];
    download() {
        this.logService.InsertAdminCPLog("Marketing | SearchKetQuaQuaySo | Export Excel ", "Success", "Xuất report excel!");
        this.excelService.download(this.excelService.jsonToSsXml(this.exportExcel(this.ListKetQuaQuaySoHangThang), this.headerTable, this.testTypes), 'Report_KetQuaQuaySoHangThang.xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }

    exportExcel(List) {

        var testJson = [];
        var obj = {};
        let i = 1;
        for (var item of List) {
            obj.STT = i++;
            obj.MaQuaySo = item.MaQuaySo;
            obj.TenChiNhanh = item.TenChiNhanh;
            obj.TenQuaTang = item.TenQuaTang;
            obj.NgayQuay = this.dateFormat.getDateFormat(new Date(item.NgayQuay));
            obj.CampaignName = item.CampaignName;
            testJson.push(obj);
            obj = {};
        }
        return testJson;
    }
    async SearchKetQuaQuaySo() {
        //Check du lieu nhap
        if (this.filterBranch === null && this.filterCampaign.value == 0) {
            toastr.error("Bạn phải chọn Chương trình hoặc Chi nhánh cần xuất báo cáo!");
            return;
        }

        this.ListKetQuaQuaySoHangThang = [];
        if (this.filterBranch === null)
            this.filterBranch = "All";
        this.pendding = !this.pendding;
        await this.quaySoService.GetKetQuaQuaySoHangThang(this.filterCampaign.value, this.filterBranch).then((data) => {
            if (data.Result === true) {
                this.ListKetQuaQuaySoHangThang = data.Data;
                this.logService.InsertAdminCPLog("Marketing | SearchKetQuaQuaySo", data.Result, this.ListKetQuaQuaySoHangThang.length + " records.");
                this.pendding = !this.pendding;
                return true;
            } else {
                this.pendding = !this.pendding;
                toastr.error("Lỗi! Xin thử lại!");
                return false;
            }
        });
    }
}