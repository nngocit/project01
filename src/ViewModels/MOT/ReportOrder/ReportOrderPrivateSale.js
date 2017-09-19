import { inject } from 'aurelia-framework';
import { ReportService } from 'Services/MOT/ReportService';
import { ExcelService } from 'Helpers/ExcelHelper';
import { DateFormat } from 'Helpers/datetime-format';
import { LogService } from 'Services/LogService';
import 'select2';

@inject(ReportService, ExcelService, DateFormat, LogService)
export class ReportOrderPrivateSale {
    obj = {};
    ListOrder;
    ListFilter;
    testTypes = {
        "Id": "String",
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
        "Tên chương trình"
    ];
    selectedProduct = {};
    constructor(reportService, excelService, dateFormat, logService) {
        this.reportService = reportService;
        this.logService = logService;
        this.dateFormat = dateFormat;
        this.current = 1;
        this.itemperpage = 10;
        this.pagesize = 8;
        this.selectedProduct.BusinessCampaignId = 0;
        this.excelService = excelService;
    }
    activate() {
        this.dataServer(this.selectedProduct);
    }

    async dataServer(selectedProduct) {
        let response = await this.reportService.GetAllOrderPrivateSale(selectedProduct);
        let listBusinessCampaign = await this.reportService.GetBusinessCampainOfPrivateSale();
        console.log('listBusinessCampaign',listBusinessCampaign);
        if(listBusinessCampaign!=null){
            this.ListFilter=listBusinessCampaign;
        }
        if (response != null) {
            this.logService.InsertAdminCPLog("Report | GetReportOrderFlashDeal ", "Success", JSON.stringify(selectedProduct));
            this.ListOrder = response;
            this.total = response.length;


        }


    }
    attached() {

        ($('#filterByCampaign').select2().val(this.selectedProduct.BusinessCampaignId));
        $('#filterByCampaign').select2({
            allowClear: true
        }).on('change', () => {
            this.selectedProduct.BusinessCampaignId = $('#filterByCampaign').val();
            console.log('selectedProduct',this.selectedProduct.BusinessCampaignId);
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

            obj.Id = item.O_FlashDealOrder.Id;
            obj.FullName = item.O_FlashDealOrder.FullName;
            obj.Phone = item.O_FlashDealOrder.Phone;
            obj.ProductName = item.O_FlashDealOrder.ProductName;
            obj.CreateDate = this.dateFormat.getDateFormat(new Date(item.O_FlashDealOrder.CreatedDate));
            obj.Email = item.O_FlashDealOrder.Email;
            obj.CampaignName = item.CampaignName;

            testJson.push(obj);
            obj = {};
        }

        return testJson;

    }


}