import {
    inject, BindingEngine
} from 'aurelia-framework';
import {
    DialogController
} from 'aurelia-dialog';
import 'ckeditor';
import {
    PrivateSalesService
} from 'Services/MOT/PrivateSalesService';
import * as toastr from "toastr";
@inject(DialogController, PrivateSalesService)
export class QuanLyPrivateSaleTheLeChuongtrinh {
    ItemList = [];
    constructor(dialogController, privateSalesService) {
        this.dialogController = dialogController;
        this.privateSalesService = privateSalesService;
        toastr.options.timeOut = 700;
        toastr.options.extendedTimeOut = 700;
        this.SelectItems = [];
    }
    activate(o) {
        console.log('QuanLyPrivateSaleTheLeChuongtrinh')
        this.ItemList=o;
        setTimeout(() => {
            CKEDITOR.instances.editor1.setData(this.ItemList.TheLe)
        }, 700);
  

    }
   
    cancelButtonClick() {
        this.dialogController.cancel();
    }
    attached() {
        setTimeout(() => {
            CKEDITOR.replace('editor1', {
            });
        }, 100);


    }
    async capnhat() {
      
        var obj = {
            "PrivateSaleId": this.ItemList.Business_campaign_id,
            "TheLe": CKEDITOR.instances.editor1.getData(),
            "CreatedUser": Lockr.get('UserInfo').Username,
            "CreatedDate": null

        }
        this.data = await this.privateSalesService.updatethele(obj)

        if (this.data.data == true) {
            toastr.success("Cập nhật thể lệ chương trình thành công.", "Cập nhật thể lệ chương trình private sales");
        }
        else{
            toastr.error("Cập nhật thể lệ chương trình thất bại.", "Cập nhật thể lệ chương trình private sales");
        }
    }
}