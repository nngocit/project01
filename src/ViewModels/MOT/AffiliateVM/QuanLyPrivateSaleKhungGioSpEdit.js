import {
    inject, BindingEngine
} from 'aurelia-framework';
import {
    DialogController
} from 'aurelia-dialog';
import moment from 'moment';
import 'momentrange';
import * as toastr from "toastr";
import 'eonasdan-bootstrap-datetimepicker';
import 'select2';
import {
    PrivateSalesService
} from 'Services/MOT/PrivateSalesService';
@inject(DialogController,PrivateSalesService)
export class QuanLyPrivateSaleKhungGioSpEdit {
    ListItems = []
    constructor(dialogController,privateSalesService) {
        this.dialogController = dialogController;
        this.privateSalesService=privateSalesService;
    }

    cancelButtonClick() {
        this.dialogController.cancel();
    }

    activate(o) {
     
            console.log('QuanLyPrivateSaleKhungGioSpEdit')
         
      
        this.ListItems = o
        this.ListItems.StartTime = this.ListItems.StartTime
        this.ListItems.EndTime = this.ListItems.EndTime
        this.ListItems.Status = this.ListItems.Status
        this.ListItems.CreatedUser = Lockr.get('UserInfo').Username
      
    }
    capnhat() {
        console.log(JSON.stringify(this.ListItems))
        return Promise.all([this.privateSalesService.UpdateFrameTime( this.ListItems)]).then((data) => {
            if (data[0].data == true) {
                toastr.success("Cập nhật thông tin khung giờ thành công.", "Cập nhật thông tin khung giờ private sales");
            }
            else{
                toastr.error(data[0].data.replace("ERROR-", "''"), "Cập nhật thông tin khung giờ private sales");
            }
            
          })
    }
    attached() {
        $('#txtbatdau').datetimepicker({
            format: "YYYY-MM-DD HH:mm:ss"
        });
        $("#txtbatdau").on("dp.change", () => {
            this.ListItems.StartTime = $('#txtbatdau').val();
        });
        $('#txtkethuc').datetimepicker({
            format: "YYYY-MM-DD HH:mm:ss"
        });
        $("#txtkethuc").on("dp.change", () => {
            this.ListItems.EndTime = $('#txtkethuc').val();
        });
    }

}
export class FileListToArrayValueConverter {
    toView(fileList) {
        let files = [];
        if (!fileList) {
            return files;
        }
        for (let i = 0; i < fileList.length; i++) {
            files.push(fileList.item(i));
        }
        return files;
    }
}
export class BlobToUrlValueConverter {
    toView(blob) {
        return URL.createObjectURL(blob);
    }
}