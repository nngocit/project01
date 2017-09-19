import {
    DialogController
} from 'aurelia-dialog';
import { inject, transient, NewInstance } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import * as toastr from "toastr";
import 'select2';
import 'sweetalert';
import 'trumbowyg';
import 'sweetalert';
import 'ckeditor';
import _ from 'lodash';
import 'eonasdan-bootstrap-datetimepicker';
import {
    DoiTraXaHangService
} from '../../../Services/AffiliateSvc/DoiTraXaHangService';
import NProgress from 'nprogress';
@inject(NewInstance.of(HttpClient), DoiTraXaHangService, DialogController)

export class QuanLyMayImageDetail {
    listImage = [];
    tt = {};
    IsEdit = false;
    disbanner = false;
    disablerm = true;
    ItemList = [];
    selectedItem = []
    Filter = "";
    loading = false;
    xahangid;
    FlagEdit = false;
    constructor(http, doiTraXaHangService, dialogController) {
        this.http = http;
        this.httpInstance = http;
        this.doiTraXaHangService = doiTraXaHangService;
        this.dialogController = dialogController;
    }
    activate(dt) {

        this.Filter = dt.XaHangItem.imei;
        this.xahangid = dt.XaHangItem.xahang_id;
        this.uploaddisable = true;
        this.ItemList = dt

        this.selectedItem = [];
        if (this.ItemList.Images.length > 0) {

            for (var item of this.ItemList.Images) {
                this.selectedItem.push(item);
            }
            this.FlagEdit = true;
        }


    }




    ArrImageService(List) {
        let strQuery = "";
        let arr = [];
        for (var item of List) {
            arr.push(item);
        }
        strQuery = arr.join(",");
        return strQuery;

    }
    ArrImage(List) {
        var testJson = [];
        var obj = {};
        for (var item of List) {
            obj.Ten = item.name;
            testJson.push(obj);
        }
        return testJson;
    }


    fileListToArr(fileList) {
        let files = [];
        if (!fileList) {
            return files;
        }
        for (let i = 0; i < fileList.length; i++) {
            files.push(fileList.item(i));
        }
        return files;
    }

    onSelectFile(selectedFiles) {

        this.listImage = [];
        this.listImage = this.fileListToArr(selectedFiles);
        if (this.listImage.length > 0) {
            this.uploaddisable = false
        }
    }

    removeimage(item) {

        if (this.uploaddisable == true) {
            return;
        }
        else {
            this.listImage.splice(_.findIndex(this.listImage, (o) => { return o.name == item.name; }), 1);


        }
        if (this.listImage.length == 0) {
            document.getElementById("fileUpload").value = "";
            this.listImage = [];
            this.uploaddisable = true
        }

    }

    async UploadImage() {

        this.loading = true;
        this.uploaddisable = true;

        if (this.listImage.length > 0) {

            let obj = {};
            if (this.FlagEdit == true) {// cập nhật hình
                let img = {};
                let fileArray = this.listImage;

                for (let i = 0; i < fileArray.length; i++) {
                    let formData = new FormData()
                    formData.append("userfilename", fileArray[i].name);
                    formData.append("userfile", fileArray[i]);
                    await this.http.fetch('https://publicapi.vienthonga.vn/v2/upload-image', {
                        method: 'POST',
                        body: formData,
                    })
                        .then(response => response.json())
                        .then(data => {
                            img.xahang_id = this.xahangid;
                            img.image_url = data;
                            img.status_duyet = "A";
                            img.order = this.selectedItem.length + 1;
                            img.image_status = "A"
                            this.selectedItem.push(img);
                            img = {};
                        });
                }
                this.ItemList.Images.push(img);
                console.log('test',JSON.stringify(  this.ItemList.Images))

                obj.XahangId = this.xahangid;
                obj.TinhTrangHienThi = "A"
                obj.TinhTrangDuyetSanPham = this.ItemList.XaHangItem.approved;
                obj.GhiChu = this.ItemList.XaHangItem.ghichu1;
                obj.ListImages = this.selectedItem;
                obj.MoTaLoi = this.ItemList.XaHangItem.approve_error;
                obj.UserName = Lockr.get('UserInfo').Username;

                await this.doiTraXaHangService.Putthongtinxahang(obj).then((o) => {
                    if (o.data === "SUCCESS") {
                        this.Callback();
                    }
                    else {
                        toastr.warning("Upload hình ảnh không thành công !", "QUẢN LÝ MÁY ĐỔI TRẢ");
                    }
                });
            }
            else { // Thêm mới hình
                let fileArray = this.listImage;

                for (let i = 0; i < fileArray.length; i++) {
                    let formData = new FormData()
                    formData.append("userfilename", fileArray[i].name);
                    formData.append("userfile", fileArray[i]);
                    await this.http.fetch('https://publicapi.vienthonga.vn/v2/upload-image', {
                        method: 'POST',
                        body: formData,
                    })
                        .then(response => response.json())
                        .then(data => {
                           // this.selectedItem.push(data);
                           img.xahang_id = this.xahangid;
                           img.image_url = data;
                           img.status_duyet = "A";
                           img.order = this.selectedItem.length + 1;
                           img.image_status = "A"
                           this.ItemList.Images.push(img);
                           console.log('test',JSON.stringify(  this.ItemList.Images))
                           img = {};
                        });
                }
                obj.XahangId = this.xahangid;
                obj.ListImageUrls = this.ArrImageService(this.selectedItem)
                obj.UserName = Lockr.get('UserInfo').Username;
                await this.doiTraXaHangService.PostxahangUpdateImage(obj).then((o) => {
                    if (o.data === "SUCCESS") {
                        this.Callback();
                    }
                    else {
                        toastr.warning("Upload hình ảnh không thành công !", "QUẢN LÝ MÁY ĐỔI TRẢ");
                    }
                });
            }
            obj = {};


        } else {
            toastr.warning("Vui lòng chọn hình ảnh!", "QUẢN LÝ MÁY ĐỔI TRẢ")
        }
    }

    async Callback() {

        return await this.doiTraXaHangService.Getlistxahangsearch("imei=" + this.Filter).then((data) => {

            this.ItemList = data.data.ListResults.filter((x) => {
                if (x.XaHangItem.xahang_id == this.xahangid) {
                    return x;
                }
            })

            this.ItemList.Images = this.ItemList[0].Images;
            this.loading = false;
            this.uploaddisable = false;
            toastr.success("Upload hình ảnh thành công !", "QUẢN LÝ MÁY ĐỔI TRẢ");
           

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