import { inject } from 'aurelia-framework';
import { ReportService } from 'Services/MOT/ReportService';
import { ExcelService } from 'Helpers/ExcelHelper';
import { DateFormat } from 'Helpers/datetime-format';
import { LogService } from 'Services/LogService';
import 'select2';

@inject(ReportService, ExcelService, DateFormat, LogService)
export class ReportOrderFlashDeal {
    obj = {};
    ListOrder;
    ListFilter;
    testTypes = {
        "Stt": "String",
        "FullName": "String",
        "Phone": "String",
        "ProductName": "String",
        "CreateDate": "String",
        "Email": "String",
        "CampaignName": "String"
    };
    headerTable = [
        "STT",
        "Họ và tên",
        "Điện thoại",
        "Sản phẩm",
        "Ngày tạo",
        "Email",
        "CampaignName"
    ];
    selectedProduct = {};
    constructor(reportService, excelService, dateFormat, logService) {
        this.reportService = reportService;
        this.logService = logService;
        this.dateFormat = dateFormat;
        this.current = 1;
        this.itemperpage = 10;
        this.pagesize = 8;
        this.selectedProduct.CampaignId = "99";
        this.excelService = excelService;
    }
    activate() {
        this.dataServer(this.selectedProduct);
    }

    async dataServer(selectedProduct) {
        let response = await this.reportService.GetReportOrderFlashDeal(selectedProduct);
        //console.log('select', JSON.stringify(selectedProduct));
        if (response != null) {
            this.logService.InsertAdminCPLog("Report | GetReportOrderFlashDeal ", "Success", JSON.stringify(selectedProduct));
            this.ListFilter = response.Data.ListFilter;
            this.ListOrder = response.Data.ListOrder;
            this.total = response.ItemsCount;


        }


    }
    attached() {

        ($('#filterByCampaign').select2().val(this.selectedProduct.CampaignId));
        $('#filterByCampaign').select2({
            allowClear: true
        }).on('change', () => {
            this.selectedProduct.CampaignId = $('#filterByCampaign').val();
            this.dataServer(this.selectedProduct);
        });


    }

    download() {
        this.logService.InsertAdminCPLog("Report | ReportOrderFlashDeal | Export Excel ", "Success", "Xuất report excel!");
        this.excelService.download(this.excelService.jsonToSsXml(this.exportExcel(this.ListOrder), this.headerTable, this.testTypes), 'ReportOrderFlashDeal.xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }

    exportExcel(ListOrder) {

        var testJson = [];
        var obj = {};
        for (var item of ListOrder) {

            obj.Stt = item.Stt;
            obj.FullName = item.FullName;
            obj.Phone = item.Phone;
            obj.ProductName = item.ProductName;
            obj.CreateDate = this.dateFormat.getDateFormat(new Date(item.CreatedDate));
            obj.Email = item.Email;
            obj.CampaignName = item.CampaignName

            testJson.push(obj);
            obj = {};
        }

        return testJson;

    }


}