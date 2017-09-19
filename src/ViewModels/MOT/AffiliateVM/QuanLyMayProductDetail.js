import { inject, transient, NewInstance } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import * as toastr from "toastr";
import 'select2';
import 'sweetalert';
import 'trumbowyg';
import 'ckeditor';
import _ from 'lodash';

import 'eonasdan-bootstrap-datetimepicker';
import {
    DoiTraXaHangService
} from '../../../Services/AffiliateSvc/DoiTraXaHangService';
import { DialogController } from 'aurelia-dialog';
import NProgress from 'nprogress';

import {
    DialogService
} from 'aurelia-dialog';
import viewerjs from 'viewerjs';
@inject(NewInstance.of(HttpClient), DoiTraXaHangService, DialogController, DialogService)

export class QuanLyMayProductDetail {
    listImage = [];
    tt = {};
    IsEdit = false;
    disbanner = false;
    HieuLuc = true;

    ItemList = [];
    ListTinhTrangDuyet = [];
    ListTinhTrangHienThi = [];
    dialogController: DialogController
    constructor(http, doiTraXaHangService, dialogController, dialogService) {
        this.http = http;
        this.httpInstance = http;
        this.doiTraXaHangService = doiTraXaHangService;
        this.dialogController = dialogController;
        this.dialogService = dialogService;
    }


    activate(items) {
        this.ItemList = items;
        this.ListTinhTrangDuyet = items.ListTinhTrangDuyet;
        this.Tinhtrangduyet = items.TtDuyet_Value;
        this.Tinhtranghienthi = items.TtHienThi_Text;
        if (this.ItemList.TtDuyet_Value == 'D') {
            this.showmotaloi = true;
        }
        else {
            this.showmotaloi = false;
        }

    }



    ShowTinhTrangDuyet(tt) {
        if (tt == 'D') {
            this.showmotaloi = true;
        }
        else {
            this.showmotaloi = false;
        }
    }


    attached() {
        var viewer = new Viewer(document.getElementById('sortable-1'));

        $('#TinhTrangDuyet').on('change', () => {
            this.ShowTinhTrangDuyet($('#TinhTrangDuyet').val());

        })

        setTimeout(() => {
            CKEDITOR.replace('editor1', {
                height: 200,
                width: 700
            });
        }, 400);

    }




    swapArrayElements(indexA, indexB) {
        let arr = this.ItemList.Images;
        let temp = arr[indexA];
        arr[indexA] = arr[indexB];
        arr[indexB] = temp;
        return arr;
    };


    removeimg(mt) {

        this.ItemList.Images.splice(_.findIndex(this.ItemList.Images, (o) => { return o.image_url == mt.image_url; }), 1);

    }

    Infoimg(img) {

    }
    update(obj) {
        let Items = {};
        Items.XahangId = this.ItemList.XaHangItem.xahang_id;
        Items.TinhTrangHienThi = this.ItemList.XaHangItem.status;
        Items.TinhTrangDuyetSanPham = this.Tinhtrangduyet;
        Items.GhiChu = CKEDITOR.instances.editor1.getData();
        Items.ListImages = this.ItemList.Images;
        Items.MoTaLoi = this.ItemList.XaHangItem.approve_error;
        Items.UserName = Lockr.get('UserInfo').Username;

        if (!this.ValidateBeforeSubmit()) {
            return;
        }
        swal({
            title: "CHI TIẾT SẢN PHẨM",
            text: `Bạn có chắc chắn muốn cập nhật chi tiết sản phẩm này không`,
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#5484E2",
            confirmButtonText: "ĐỒNG Ý",
            cancelButtonText: "HỦY BỎ",
            closeOnConfirm: false,
            closeOnCancel: false,

        }, (isConfirm) => {
            if (isConfirm) {
                this.doiTraXaHangService.Putthongtinxahang(Items).then((rs) => {
                    if (rs.data == "SUCCESS") {
                        this.dialogController.ok("CallUpdate");
                        swal("CHI TIẾT SẢN PHẨM!", "Cập nhật thành công", "success");

                    } else {
                        swal("CHI TIẾT SẢN PHẨM!", "Cập nhật không thành công, vui lòng thử lại", "success");

                    }
                });

            } else {
                swal({
                    title: "CHI TIẾT SẢN PHẨM",
                    text: `HỦY BỎ`,
                    type: "warning"
                });
            }
        });

    }

    ValidateBeforeSubmit() {
        var strErrorMsg = "";
        if (this.ItemList.XaHangItem.status == "" || typeof this.ItemList.XaHangItem.status === "undefined")
            strErrorMsg += "• Vui lòng chọn Tình trạng hiển thị. <br/>";
        if (this.Tinhtrangduyet == "" || typeof this.Tinhtrangduyet === "undefined")
            strErrorMsg += "• Vui lòng chọn Tình trạng duyệt. <br/>";
        if (strErrorMsg !== "") {
            toastr.error(strErrorMsg, "Lỗi dữ liệu nhập!");
            return false;
        }
        return true;

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