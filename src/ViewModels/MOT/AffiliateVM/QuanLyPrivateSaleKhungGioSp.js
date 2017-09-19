import {
    inject, BindingEngine, NewInstance
} from 'aurelia-framework';
import {
    DialogController
} from 'aurelia-dialog';
import {
    DialogService
} from 'aurelia-dialog';
import {
    PrivateSalesService
} from 'Services/MOT/PrivateSalesService';
import { HttpClient, json } from 'aurelia-fetch-client';
import 'select2';
import _ from 'lodash';
import * as toastr from "toastr";
import 'eonasdan-bootstrap-datetimepicker';
@inject(NewInstance.of(HttpClient), DialogController, DialogService, PrivateSalesService)
export class QuanLyPrivateSaleKhungGioSp {
    ListsCapBac = [{ "value": "Member", "text": "Member" }, { "value": "Silver", "text": "Silver" }, { "value": "Gold", "text": "Gold" }]
    ListSp = []
    ListAllSp = []
    ItemList = []
    HinhThuc = []
    listImage = []
    File = []
    selectedItems = []
    capbacarr = []
    Status = true
    disabletaomoi = false
    disablesanpham = false
    chkbanner = false
    chkmua = false
    chkdathang = false
    chktaiapp = false
    isnameup=true
  
    isEdit = true
    isnamesanpham="aaa"
    LinkHinh = ""
    thefilenames = ""
    constructor(http, dialogController, dialogService, privateSalesService) {
        this.dialogController = dialogController;
        this.dialogService = dialogService;
        this.privateSalesService = privateSalesService;
        this.http = http;
        this.httpInstance = http;
        this.current = 1;
        this.itemperpage = 20;
        this.pagesize = 20;

    }
    async activate(o) {
        console.log('QuanLyPrivateSaleKhungGioSp')

        this.soluong = 1
        this.diem = 1;
        this.sanpham = 'ss'
        this.capbac == null
        toastr.options.timeOut = 700;
        toastr.options.extendedTimeOut = 700;
        console.log(JSON.stringify(o))
        this.ItemList = o
        return Promise.all([this.privateSalesService.GetallkhunggioSP(o.PrivateSaleId, o.Id), this.privateSalesService.GetallSP(o.Id)]).then((data) => {
            this.ListSp = data[0].data;
            this.ListAllSp = data[1].data;
            this.total = this.ListAllSp.length
            console.log(JSON.stringify(this.ListAllSp))
        })

    }

    ValidateBeforeSubmit() {
        console.log(this.isEdit)
        var strErrorMsg = "";
        if (this.isEdit == true) {

            if (this.spid === "" || typeof this.spid === "undefined" || $("#sanpham option:selected").text() === "")
                strErrorMsg += "• Vui lòng chọn sản phẩm. <br/>";
        }

        if (this.soluong == "" || typeof this.soluong === "undefined")
            strErrorMsg += "• Vui lòng nhập số lượng. <br/>";
        if (this.soluong == "0")
            strErrorMsg += "• Số lượng không hợp lệ. <br/>";
        if (this.diem == "" || typeof this.diem === "undefined")
            strErrorMsg += "• Vui lòng nhập điểm . <br/>";
        if (this.diem == "0")
            strErrorMsg += "• Điểm không hợp lệ. <br/>";
        if (this.capbac == null || this.capbac.length == 0)
            strErrorMsg += "• Vui lòng chọn cấp bậc. <br/>";
        if (strErrorMsg !== "") {
            toastr.error(strErrorMsg, "Lỗi dữ liệu nhập!");
            return false;
        }
        return true;
    }
    checkhinhthuc() {
        this.HinhThuc = []
        let a, b, c
        if (this.chkmua) {
            this.HinhThuc.push(1)
        }
        if (this.chkdathang) {
            this.HinhThuc.push(2)
        }
        if (this.chktaiapp) {
            this.HinhThuc.push(3)
        }
        return this.HinhThuc.join(",");
    }



    CheckImg(img) {
        if ((img.toLowerCase().indexOf('png') != -1) || (img.toLowerCase().indexOf('jpg') != -1) || (img.toLowerCase().indexOf('jpeg') != -1)) {

            return 1;
        } else {
            return -1;
        }
    }
    FiletoArray(fileList) {
        let files = [];
        if (!fileList) {
            return files;
        }
        for (let i = 0; i < fileList.length; i++) {
            files.push(fileList.item(i));
        }
        return files;
    }
    imageExists(image_url) {
        if (image_url == null || image_url == undefined) {
            image_url = "images/avatar_2x.png";
        } else {
            image_url = image_url;
        }
        return image_url;
    }


    async  themsp() {
        console.log('themsp')
        this.disabletaomoi = true
        if (this.ValidateBeforeSubmit() == true) {
            if (this.chkbanner == true && this.LinkHinh == "") {
                toastr.error("• Chưa nhập link hình banner của khung giờ. Vui lòng thử lại. <br/>", "Lỗi dữ liệu nhập!");
                this.disabletaomoi = false
                return;
            }

            let obj = {}
            obj.CreatedUser = Lockr.get('UserInfo').Username
            obj.Product_id = this.spid
            obj.KhungGioId = this.ItemList.Id
            obj.SoLuong = this.soluong
            obj.ProductName = $("#sanpham option:selected").text();
            obj.CapBac = this.capbac.toString();
            obj.Diem = this.diem
            obj.HieuLuc = this.Status
            obj.LinkHinh = this.LinkHinh
            obj.HinhThucMuaHang = this.checkhinhthuc();
            obj.HienThiBanner = this.chkbanner
            console.log(JSON.stringify(obj))
            console.log('call tao san pham')
            let rs = await this.privateSalesService.CreateSp(obj)
            console.log(rs.data)
            if (rs.data == true) {
                this.disabletaomoi = false

                this.ListSp = [];
                let kqSp = await (this.privateSalesService.GetallkhunggioSP(this.ItemList.PrivateSaleId, this.ItemList.Id))
                this.ListSp = kqSp.data
                this.ListAllSp = [];
                let kqSpAll = await (this.privateSalesService.GetallSP(this.ItemList.Id))
                this.ListAllSp = kqSpAll.data
                this.total = this.ListAllSp.length
                this.resetdetail();
            }
            else{
                toastr.error(rs.data.replace("ERROR_", ""), "CẬP NHẬT SẢN PHẨM PRIVATE SALES");
                this.disabletaomoi = false
              
            }

        }
        else {
       
            this.disabletaomoi = false
        }


    }
    async  capnhatsp() {
        if (this.ValidateBeforeSubmit() == true) {
            if (this.chkbanner == true && this.LinkHinh == "") {
                toastr.error("• Chưa nhập link hình banner của khung giờ. Vui lòng thử lại. <br/>", "Lỗi dữ liệu nhập!");
                this.disabletaomoi = false
                return;
            }
            this.disabletaomoi = true
            console.log(JSON.stringify(this.selectedItems))
            let obj = {}
            obj.Id = this.selectedItems.KhungGioSanPham.Id
            obj.CreatedUser = Lockr.get('UserInfo').Username
            obj.Product_id = this.selectedItems.KhungGioSanPham.Product_id
            obj.KhungGioId = this.ItemList.Id
            obj.SoLuong = this.soluong
            obj.ProductName = this.selectedItems.KhungGioSanPham.ProductName
            obj.CapBac = this.capbac.toString();
            obj.Diem = this.diem
            obj.HieuLuc = this.Status
            obj.LinkHinh = this.LinkHinh
            obj.HinhThucMuaHang = this.checkhinhthuc();
            obj.HienThiBanner = this.chkbanner
            this.isEdit = true
            this.isnameup=true
            console.log(JSON.stringify(obj))
            console.log('call update san pham')
            let rs = await this.privateSalesService.UpdateProduct(obj)
            console.log(rs.data)
            if (rs.data == true) {
                toastr.success("Cập nhật sản phẩm thành công.", "CẬP NHẬT SẢN PHẨM PRIVATE SALES");
                this.disabletaomoi = false
                $('#sanpham').prop("disabled", false);
                this.ListSp = [];
                let kqSp = await (this.privateSalesService.GetallkhunggioSP(this.ItemList.PrivateSaleId, this.ItemList.Id))
                this.ListSp = kqSp.data
                this.ListAllSp = [];
                let kqSpAll = await (this.privateSalesService.GetallSP(this.ItemList.Id))
                this.ListAllSp = kqSpAll.data
                this.total = this.ListAllSp.length
                this.resetdetail();
            }
            else {
                console.log(rs.data.replace("ERROR_", ''))
                toastr.error(rs.data.replace("ERROR_", ''), "CẬP NHẬT SẢN PHẨM PRIVATE SALES");
                this.isEdit = false
            }
        }
        this.disabletaomoi = false
    }




    resetdetail() {
        this.soluong = 1;
        this.diem = 1;
        this.Status = true;
        this.chktaiapp = false;
        this.chkdathang = false;
        this.chkmua = false;
        this.LinkHinh = "";
        this.thefilenames = "";
        this.hinhanh = "";
        this.chkbanner = false
        this.selectedFiles = [];
        this.capbac = []
        $("#capbac").select2('val', 'All');
    }

    cancelButtonClick() {
        this.dialogController.cancel();
    }


    async ResetAvt() {
        this.listImage = [];
        $('#imgid')
            .attr('src', "../../../../images/no_image.gif");
        this.LinkHinh = "";
        this.thefilenames = "";
        this.hinhanh = "";

    }
    test() {
        $('#sanpham').select2({
            disabled: true,
            closeOnSelect: false
        })

    }
    chonanhupload() {
        $("input[type='file']").trigger('click');
    }
    Checknameimgbind(image_url) {
        if (image_url == null || image_url == undefined) {
            image_url = "";
        } else {
            image_url = image_url;
        }
        return image_url;

    }
    Binddataweb(o) {
        this.resetdetail();
        var arrhinh = []
        this.selectedItems = o;
        this.isEdit = false
        console.log('o', JSON.stringify(o))

        this.capbacarr = []
        this.hinhanh = this.imageExists(o.KhungGioSanPham.LinkHinh) // view hinh anh

        arrhinh = this.hinhanh.split('/')
        this.thefilenames = this.Checknameimgbind(arrhinh[7]) // binding ten hinh anh
        this.LinkHinh = o.KhungGioSanPham.LinkHinh // set Link hinh hien tai vao img
        console.log('this.LinkHinh', this.LinkHinh)
        this.isnamesanpham= o.KhungGioSanPham.ProductName
        this.isnameup=false
      
        
        console.log('this.isnamesanpham', this.isnamesanpham)
        this.spid = o.KhungGioSanPham.Product_id
        this.soluong = o.KhungGioSanPham.SoLuong
        this.diem = o.KhungGioSanPham.Diem
        this.chkbanner = o.KhungGioSanPham.HienThiBanner
        this.Status = o.KhungGioSanPham.HieuLuc
        this.HinhThuc = o.KhungGioSanPham.HinhThucMuaHang.split(',');
        this.capbacarr = o.KhungGioSanPham.CapBac.split(',');
        $('#capbac').val(this.capbacarr).trigger("change");
       // $('#sanpham').val(o.KhungGioSanPham.Product_id).trigger("change");
        // $('#sanpham').prop("disabled", true);
        console.log(this.HinhThuc)
        if ((this.HinhThuc[0] == 1) || (this.HinhThuc[1] == 1) || (this.HinhThuc[2] == 1)) {
            this.chkmua = true;
        }
        else {
            this.chkmua = false;
        }
        if ((this.HinhThuc[0] == 2) || (this.HinhThuc[1] == 2) || (this.HinhThuc[2] == 2)) {
            this.chkdathang = true;
        }
        else {
            this.chkdathang = false;
        }
        if ((this.HinhThuc[0] == 3) || (this.HinhThuc[1] == 3) || (this.HinhThuc[2] == 3)) {
            this.chktaiapp = true;
        }
        else {
            this.chktaiapp = false;
        }
        console.log(this.file)
    }
    changechk() {
        if (this.changechk) {
            this.chkbanner = false
            console.log(this.chkbanner)
        }
        else {
            this.chkbanner = true
            console.log(this.chkbanner)
        }


    }
    async Xoasanpham(cmt) {

        let obj = {}
        obj.Id = cmt.KhungGioSanPham.Id
        obj.CreatedUser = Lockr.get('UserInfo').Username
        obj.Status = "D",
            obj.Product_id = cmt.KhungGioSanPham.Product_id
        obj.KhungGioId = this.ItemList.Id
        let rs = await this.privateSalesService.DeleteSp(obj)

        if (rs.data == true) {
            toastr.success("Xóa sản phẩm thành công!", "QUẢN LÝ SẢN PHẨM");
            let kqSpAll = await (this.privateSalesService.GetallSP(this.ItemList.Id))
            this.ListAllSp = [];
            this.ListAllSp = kqSpAll.data
            this.total = this.ListAllSp.length
        }
        else {
            toastr.error(rs.data, "QUẢN LÝ SẢN PHẨM");
        }

    }
    async  onSelectFile(Fileselect) {
        this.listImage = [];
        this.thefilenames = "";
        try {
            this.listImage = [];
            this.listImage = this.FiletoArray(Fileselect);
            this.thefilenames = this.listImage[0].name
            console.log(this.listImage[0].name)
            if (this.CheckImg($('#fileUpload1')[0].files[0].name) !== 1) {
                toastr.error("Vui lòng chọn tập tin có phần mở rộng '.jpg' '.jpeg' '.png'", "QUẢN LÝ SẢN PHẨM");
                this.File = [];
                this.thefilenames = "";

                return;
            }
            if (Math.round(($('#fileUpload1')[0].files[0].size) / 1048576) >= 1) {
                toastr.error("Kích thước tập tin không vượt quá 1MB, vui lòng chọn lại", "QUẢN LÝ SẢN PHẨM");
                this.File = [];
                this.thefilenames = "";
                return;
            }
        } catch (error) {
            this.File = [];
            this.thefilenames = "";
            return;
        }
        if (this.CheckImg($('#fileUpload1')[0].files[0].name) == 1) {
            if (this.listImage != null || typeof this.listImage !== "undefined") {
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

                            this.LinkHinh = data
                            this.hinhanh = data
                            console.log(data)
                            // this.entity.simSoMic.FILE1 = data
                        });
                }
            }

        }

    }
    attached() {
     
      
        $('#txtFilterDateStart').datetimepicker({
            format: "YYYY-MM-DD"
        });
        $("#txtFilterDateStart").on("dp.change", () => {
            this.ListItems.StartTime = $('#txtFilterDateStart').val();
        });
        $('#txtFilterDateEnd').datetimepicker({
            format: "YYYY-MM-DD"
        });
        $("#txtFilterDateEnd").on("dp.change", () => {
            this.ListItems.EndTime = $('#txtFilterDateEnd').val();
        });
           $("#fileUpload").change(function () {

            if (this.files && this.files[0]) {
                this.viewfile = this.files[0].name;


                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#hinhanh').attr('src', e.target.result)
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
        $('#fileUpload').on('change', () => {
            this.viewfile = $('#fileUpload').val();
            console.log(this.viewfile)
        });
        $('#sanpham').select2().val(this.spid);
        $('#sanpham').select2({
            placeholder: "--- Tất cả ---",
            allowClear: true

        }).on('change', () => {
            this.spid = $('#sanpham').val();
            console.log(this.spid)
        });

        $('#capbac').select2().val(this.spid);
        $('#capbac').select2({
            placeholder: "--- Tất cả ---",
            allowClear: true
        }).on('change', () => {
            this.capbac = $('#capbac').val();
            console.log(this.capbac)
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

export class FormatCommentforLengthValueConverter {
    toView(cmt) {
        let tmp = "";
        tmp = _.truncate(cmt.trim(), {
            'length': 20,
            'separator': /,? +/
        });
        return tmp;
    }
}