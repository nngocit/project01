import { inject } from 'aurelia-framework';
import { json } from 'aurelia-fetch-client';
import { ComboService } from 'Services/MOT/ComboService';
import 'eonasdan-bootstrap-datetimepicker';
import { UtilitiesJS } from 'Helpers/UtilitiesJS';
import * as toastr from "toastr";
import * as typeahead from "bs-typeahead";
import { LogService } from 'Services/LogService';
@inject(ComboService, UtilitiesJS,LogService)
export class Searchcombo {
    ListCombo = [];
    SanPham = {};
    pendding = true;
    tam = {};
    Combo = {};

    constructor(comboService, utilitiesJS,logService) {
        this.comboService = comboService;
        this.logService = logService;

        //Pagination

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
        if (this.Combo.productcolorcode == "" || typeof this.Combo.branchCode === "undefined")
            strErrorMsg += "• Vui lòng điền thông tin tìm kiếm. <br/>";
        if (strErrorMsg !== "") {
            toastr.error(strErrorMsg, "Lỗi dữ liệu nhập!");
             this.pendding = !this.pendding;
            return false;
        }
        return true;

    }

    SearchCombo() {
        // var obj = {};
        // obj.productcolorcode = this.Combo.productcolorcode;
        // obj.branchCode = this.Combo.branchCode;

        // this.pendding = !this.pendding;
        // if (this.ValidateBeforeSubmit() == true) {
        //     this.comboService.SearchCombo(obj).then((rs) => {

        //         if (rs.Result == true) {

        //             this.ListCombo = rs.Data;
        //             this.total = rs.Data.length;
        //             this.pendding = !this.pendding;

        //         }
        //     });
        // } else {
        //     this.pendding = !this.pendding;

        // }
        var obj = {};
        obj.productcolorcode = this.Combo.productcolorcode;
        obj.branchCode = this.Combo.branchCode;
        this.pendding = !this.pendding;
        this.dataServer(obj);
    }
    async dataServer(query) {

        if (this.ValidateBeforeSubmit() == true) {
            let response = await this.comboService.SearchCombo(query);
            // this.comboService.SearchCombo(obj).then((rs) => {
            //console.log('response', response);
            if (response != null) {
                this.logService.InsertAdminCPLog("Searchcombo", response.Result, JSON.stringify(response.Data));
                toastr.success("Kết quả tìm được: " + response.Data.length);
                this.ListCombo = response.Data;
                this.total = response.Data.length;
                this.pendding = !this.pendding;
            } else {
                this.logService.InsertAdminCPLog("Searchcombo", response.Result, JSON.stringify(response.Data));
                toastr.error(strErrorMsg, "Không tìm thấy, Vui lòng thử lại!");
                this.pendding = false;
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
                .filter(x => ((x.Msp != null) && (x.Msp.toLowerCase().indexOf(obj.toLowerCase().trim()) != -1)));
        }
        return array;
    }
}