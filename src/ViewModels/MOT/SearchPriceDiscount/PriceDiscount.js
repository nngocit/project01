import { inject } from 'aurelia-framework';
import { json } from 'aurelia-fetch-client';
import { PricediscountService } from 'Services/MOT/PricediscountService';
import 'eonasdan-bootstrap-datetimepicker';
import { UtilitiesJS } from 'Helpers/UtilitiesJS';
import * as toastr from "toastr";
import * as typeahead from "bs-typeahead";
import { LogService } from 'Services/LogService';
@inject(PricediscountService, UtilitiesJS,LogService)
export class PriceDiscount {
    ListGiaGiam = [];
    SanPham = {};
    pendding = true;
    tam = {};
    Combo = {};
    Items = {};
    constructor(pricediscountService, utilitiesJS,logService) {
        this.pricediscountService = pricediscountService;
        this.logService = logService;

        //Pagination
        this.Items.SanPham = "";
        this.Items.Gia = "";
        this.current = 1;
        this.itemperpage = 10;
        this.pagesize = 8;


    }

    activate() {

    }



    attached() {
    }





    ValidateBeforeSubmit() {

        var strErrorMsg = "";
        if (this.Items.SanPham == "" || typeof this.Items.Gia === "undefined")
            strErrorMsg += "• Vui lòng điền thông tin tìm kiếm. <br/>";
        if (strErrorMsg !== "") {
            toastr.error(strErrorMsg, "Lỗi dữ liệu nhập!");
            this.pendding = !this.pendding;
            return false;
        }
        return true;

    }

    Search() {
        // var array = [];
        // array[0] = this.Items.SanPham;
        // array[1] = this.Items.Gia;
        var obj = {};
        obj.listxml = this.Items.SanPham;
        obj.makho = this.Items.Gia;
        this.pendding = !this.pendding;
        //console.log('this', obj);
        this.dataServer(obj);
    }
    async dataServer(obj) {

        if (this.ValidateBeforeSubmit() == true) {

            let response = await this.pricediscountService.SearchGiamGiaTyLe(obj);
            // this.comboService.SearchCombo(obj).then((rs) => {

            if (response != null && response.Result == true) {
                this.logService.InsertAdminCPLog("SearchGiamGia", response.Result, JSON.stringify(response.Data));
                toastr.success("Kết quả tìm được: " + response.Data.length);
                this.ListGiaGiam = response.Data;
                this.total = response.Data.length;
                this.pendding = !this.pendding;
            } else {
                this.logService.InsertAdminCPLog("SearchGiamGia", response.Result, JSON.stringify(response.Data));
                toastr.error("Không có kết quả, Vui lòng thử lại!");
                this.pendding = !this.pendding;
            }
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
export class FilterByMspValueConverter {
    toView(array, obj) {
        if (obj) {
            return array
                .filter(x => ((x.Mahang != null) && (x.Mahang.toLowerCase().indexOf(obj.toLowerCase().trim()) != -1)));
        }
        return array;
    }
}