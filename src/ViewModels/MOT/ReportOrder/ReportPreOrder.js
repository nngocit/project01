import { inject } from 'aurelia-framework';

import { ReportService } from 'Services/MOT/ReportService';
import { ExcelService } from 'Helpers/ExcelHelper';
import { DateFormat } from 'Helpers/datetime-format';
import { LogService } from 'Services/LogService';
import 'select2';

@inject(ReportService, ExcelService, DateFormat, LogService)
export class ReportPreOrder {
    obj = {};
    ListOrder;
    ListFilter;
    testTypes = {
        "Stt": "String",
        "NgayDat": "String",
        "NhanvienSO": "String",
        "OrderId": "String",
        "TenKh": "String",
        "Phone": "String",
        "EmailKh": "String",
        "Color": "String",
        "Msp": "String",
        "Chinhanh": "String",
        "MaChinhanh": "String",
        "Khuvuc": "String",
        "AffiliateName": "String",
        "Trangthai": "String"
    };
    headerTable = [
        "STT",
        "Ngày đặt",
        "Nhân viên Seo",
        "OrderId",
        "Tên khách hàng",
        "Điện thoại",
        "Email",
        "Màu",
        "Mã sản phẩm",
        "Chi nhánh",
        "Mã chi nhánh",
        "Khu vực",
        "Đối tác",
        "Trạng thái"
    ];

    selectedProduct = {};
    constructor(reportService, excelService, dateFormat, logService) {
        this.reportService = reportService;
        this.logService = logService;
        this.current = 1;
        this.itemperpage = 10;
        this.pagesize = 8;
        this.selectedProduct.CampaignId = "112";
        this.excelService = excelService;
        this.dateFormat = dateFormat;
    }
    activate() {

        return this.dataServer(this.selectedProduct);

    }
    async dataServer(selectedProduct) {
        let response = await this.reportService.GetReportPreOrder(selectedProduct);
       
        if (response != null) {

            this.logService.InsertAdminCPLog("Report | GetReportPreOrder ", "Success", JSON.stringify(selectedProduct));
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
        this.logService.InsertAdminCPLog("Report | ReportPreOrder | Export Excel ", "Success", "Xuất report excel!");
        this.excelService.download(this.excelService.jsonToSsXml(this.exportExcel(this.ListOrder), this.headerTable, this.testTypes), 'ReportPreOrder.xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }

    exportExcel(ListOrder) {

        var testJson = [];
        var obj = {};
        let i = 1;
        for (var item of ListOrder) {
            obj.Stt = i++;
            obj.NgayDat = this.dateFormat.getDateFormat(new Date(item.NgayDat));
            obj.NhanvienSO = item.NhanvienSO;
            obj.OrderId = item.OrderId;
            obj.TenKh = item.TenKh;
            obj.Phone = item.Phone;
            obj.EmailKh = item.EmailKh;
            obj.Color = item.Color;
            obj.Msp = item.Msp;

            obj.Chinhanh = item.Chinhanh;
            obj.MaChinhanh = item.MaChinhanh;
            obj.Khuvuc = item.Khuvuc;
            obj.AffiliateName = item.AffiliateName === null ? '' : item.AffiliateName;
            obj.Trangthai = item.Trangthai;


            testJson.push(obj);

            obj = {};
        }
        return testJson;
    }


}