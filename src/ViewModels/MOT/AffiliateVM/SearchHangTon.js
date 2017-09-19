import { inject } from 'aurelia-framework';
import { json } from 'aurelia-fetch-client';
import { EnterpriseService } from 'Services/EnterpriseSvc/EnterpriseService';
import 'eonasdan-bootstrap-datetimepicker';
import { UtilitiesJS } from 'Helpers/UtilitiesJS';
import { ExcelService } from 'Helpers/ExcelHelper';
import * as toastr from "toastr";
import * as typeahead from "bs-typeahead";
import { LogService } from 'Services/LogService';
@inject(EnterpriseService, UtilitiesJS, ExcelService, LogService)
export class SearchHangTon {
    ListDN = [];
    SanPham = {};
    pendding = true;
    tam = {};

    constructor(enterpriseService, utilitiesJS, excelService, logService) {
        this.enterpriseService = enterpriseService;
        this.excelService = excelService;
        this.logService = logService;

        //Pagination

        this.current = 1;
        this.itemperpage = 10;
        this.pagesize = 8;


    }

    activate() {
        this.Init();
    }

    selected;

    attached() {








        $('#masanphamid').typeahead({
            // source: this.typeaheadSource,
            // displayField: 'full_name',
            // valueField: 'id',
            onSelect: (item) => {

                this.selected = item.value;
               
                this.SanPham.Products = this.selected;

            },
            ajax: {
                url: "https://publicapi.vienthonga.vn/search-api/SearchProduct?",
                timeout: 500,
                displayField: "ProductName",
                valueField: "ProductCode",
                triggerLength: 1,
                method: "get",
                loadingClass: "loading-circle",
                preDispatch: function(query) {
                    // showLoadingMask(true);
                    return {
                        keyWord: query,
                        StoreId: "CS_0000188"
                    }
                },
                preProcess: function(data) {
                    // showLoadingMask(false);
                    // console.log('data', data);
                    if (data.success === false) {
                        // Hide the list, there was some error
                        return false;
                    }
                    // We good!
                    return data.Data;
                }
            }
        });


    }


    Init() {

        this.SanPham.Products = "";
        this.SanPham.Stores = "";
    }

    testTypes = {
        "STT": "String",
        "ProductCode": "String",
        "ProductId": "String",
        "ProductName": "String",
        "ProductColorCode": "String",
        "ColorName": "String",
        "Tonthucte": "String",
        "StoreCode": "String",
        "StoreName": "String"

    };
    headerTable = [
        "STT",
        "Mã code",
        "Mã sản phẩm",
        "Sản phẩm",
        "Mã màu",
        "Màu",
        "Tồn thực tế",
        "Mã Store",
        "Store"

    ];

    download() {
        this.logService.InsertAdminCPLog("SearchHangTon", "Success", "Xuất Excel");
        this.excelService.download(this.excelService.jsonToSsXml(this.exportExcel(), this.headerTable, this.testTypes), 'Excel.xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }

    exportExcel() {

        var testJson = [];
        var obj = {};
        var i = 1;
        for (var item of this.GiftDN.items) {
            obj.STT = i;
            obj.ProductCode = item.ProductCode;
            obj.ProductId = item.ProductId;
            obj.ProductName = item.ProductName;
            obj.ProductColorCode = item.ProductColorCode;
            obj.ColorName = item.ColorName;
            obj.Tonthucte = item.Tonthucte;
            obj.StoreCode = item.StoreCode;
            obj.StoreName = item.StoreName
            i++;
            testJson.push(obj);
            obj = {};
        }

        return testJson;

    }


    ValidateBeforeSubmit() {

        var strErrorMsg = "";
        if (this.SanPham.Products == "" || typeof this.SanPham.Products === "undefined")
            strErrorMsg += "• Vui lòng điền thông tin tìm kiếm. <br/>";
        if (strErrorMsg !== "") {
            toastr.error(strErrorMsg, "Lỗi dữ liệu nhập!");
            this.pendding = false;
            return false;
        }
        return true;

    }

    SearchTon() {
        var obj = {};
        obj.ListProductCode = this.SanPham.Products;
        obj.StoreCode = this.SanPham.Stores;
        this.pendding = !this.pendding;
        //return;
        if (this.ValidateBeforeSubmit() == true) {
            this.enterpriseService.GetListDanhsachton(obj).then((rs) => {

                if (rs.Result == true) {
                  
                    this.ListDN = rs.Data;
                    
                    
                    this.total = rs.Data.length;
                    this.pendding = !this.pendding;
                }
            });
        } else {

            this.pendding = !this.pendding;

        }
    }

}



export class ToToTalSoLuongValueConverter {
    toView(array) {
        var tt = 0;
        if (array == undefined) {
            return 0;
        } else {
            return array.length;
        }

    }
}
export class ToTotalAmountValueConverter {
    toView(arr) {
        var tt = 0;
        for (var i in arr) {
            tt += arr[i].Tonthucte;
        }
        return tt;
    }
}
export class FilterByProductColorValueConverter {
    toView(array, obj) {
        if (obj) {
            return array
                .filter(x => ((x.ProductColorCode != null) && (x.ProductColorCode.toLowerCase().indexOf(obj.toLowerCase().trim()) != -1)) ||
                    ((x.ProductCode != null) && (x.ProductCode == obj)) ||
                    ((x.ProductId != null) && (x.ProductId == obj)) ||
                    ((x.ProductName != null) && (x.ProductName.toLowerCase().indexOf(obj.toLowerCase().trim()) != -1)) ||
                    ((x.ColorName != null) && (x.ColorName.toLowerCase().indexOf(obj.toLowerCase().trim()) != -1)) ||
                    ((x.StoreCode != null) && (x.StoreCode.toLowerCase().indexOf(obj.toLowerCase().trim()) != -1)) ||
                    ((x.StoreName != null) && (x.StoreName.toLowerCase().indexOf(obj.toLowerCase().trim()) != -1))

                );
        }
        return array;
    }
}
export class FilterByStroreCodeValueConverter {
    toView(array, obj) {
        if (obj) {
            return array
                .filter(x => ((x.StoreCode != null) && (x.StoreCode.toLowerCase().indexOf(obj.toLowerCase().trim()) != -1)));
        }
        return array;
    }
}