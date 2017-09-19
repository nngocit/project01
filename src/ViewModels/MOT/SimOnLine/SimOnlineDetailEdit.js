import {
    DialogController
} from 'aurelia-dialog';
import { inject, transient, NewInstance, BindingEngine } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
import * as toastr from "toastr";
import 'select2';
import 'sweetalert';

import {
    DialogService
} from 'aurelia-dialog';
import 'trumbowyg';
import {
    DealOnlineMngService
} from 'Services/MOT/DealOnlineMngService';

import {
    LogService
} from 'Services/LogService';
import {
    SimOnlineService
} from 'Services/MOT/SimOnlineService';
import { ExcelService } from 'Helpers/ExcelHelper';
import { DateFormat } from 'Helpers/datetime-format';

@inject(NewInstance.of(HttpClient), DialogController, DialogService, DealOnlineMngService, LogService, ExcelService, DateFormat, SimOnlineService)
export class SimOnlineDetailEdit {

    ListTinhThanhQuanHuyen = [];
    ListTinhThanh = [];
    ListQuanHuyen = [];
    entity = {};
    dialogController: DialogController
    isEdit = true;
    constructor(http, dialogController, dialogService, dealOnlineMngService, logService, excelService, dateFormat, simOnlineService) {
        this.http = http;
        this.httpInstance = http;
        this.dialogController = dialogController;
        this.dealOnlineMngService = dealOnlineMngService;
        this.dialogService = dialogService;
        this.logService = logService;
        this.excelService = excelService;
        this.dateFormat = dateFormat;
        this.simOnlineService = simOnlineService;
        //Pagination
        this.current = 1;
        this.itemperpage = 20;
        this.orderselect = 0;
        this.pagesize = 20;
        this._DistTrictName;
        this._WardName;

    }

    async activate(data) {
        this.isEdit = true;
        this.NoiDung = data.NoiDung;
        this.entity = data;
        this.rs = await this.simOnlineService.GetSimSoConfig();
        this.ListTinhThanhQuanHuyen = this.rs.data.Data.ListTinhThanhQuanHuyen;
        this.ListTinhThanh = this.ListTinhThanhQuanHuyen[0].ListCity;
        this.ListQuanHuyen = this.ListTinhThanhQuanHuyen[0].ListDistrict;
        this.GetIdByName(this.entity.simSoMic.P_TINHTP, this.entity.simSoMic.P_QUANHUYEN);
      
        
        toastr.options.timeOut = 300;
        toastr.options.extendedTimeOut = 300;

    }

    attached() {
        $('#P_TinhThanhId').on('change', () => {

            this.ChangeListQuanHuyen($('#P_TinhThanhId').val())
        })
        // Lấy giá trị Text
        $('#P_TinhThanhId').on('change', () => {
            this.entity.simSoMic.P_TINHTP = $("#P_TinhThanhId option:selected").text();
            this.entity.simSoMic.P_QUANHUYEN = ""
            // this._DistTrictName = $("#P_TinhThanhId option:selected").text();
        });
        $('#P_QuanHuyenId').on('change', () => {
            this.entity.simSoMic.P_QUANHUYEN = $("#P_QuanHuyenId option:selected").text();
            // this._WardName = $("#P_QuanHuyenId option:selected").text();
        });
        $('#Gtid').on('change', () => {
            $('#Gtid').val() !== "" ? this.isEdit = false : this.isEdit = true
        });
    }

    ValidateMenuBeforeSubmit() {

        var strErrorMsg = "";
        if (this.entity.simSoMic.P_TINHTP == "" || typeof this.entity.simSoMic.P_TINHTP == 'undefined') {
            strErrorMsg += "'<b>'[Tỉnh/thành]'</b>'không được để trống. Vui lòng chọn/nhập lại. <br/>";
        }
        if (this.entity.simSoMic.P_QUANHUYEN == "" || typeof this.entity.simSoMic.P_QUANHUYEN == 'undefined') {
            strErrorMsg += "'<b>'[Quận/huyện]'</b>'không được để trống. Vui lòng chọn/nhập lại. <br/>";
        }
        if (this.entity.simSoMic.C_Email == undefined || this.entity.simSoMic.C_Email == "") {

        } else {
            if (this.validateEmail(this.entity.simSoMic.C_Email) == false) {
                strErrorMsg += "'<b>'[Email]'</b>' không đúng định dạng. Vui lòng chọn/nhập lại.'";

            }
        }

        if (strErrorMsg !== "") {
            toastr.error(strErrorMsg, "QUẢN LÝ ĐƠN HÀNG SIM SỐ");
            return false;
        }
        return true;
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

    CheckImg(img) {
        if ((img.toLowerCase().indexOf('png') != -1) || (img.toLowerCase().indexOf('jpg') != -1) || (img.toLowerCase().indexOf('jpeg') != -1)) {

            return 1;
        } else {
            return -1;
        }
    }


    validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    async  onSelectFile1(Fileselect) {
        try {
            Fileselect.length == 0 ? this.isEdit = true : this.isEdit = false
            this.listImage = [];
            this.listImage = this.fileListToArr(Fileselect);
            if (this.CheckImg($('#fileUpload1')[0].files[0].name) !== 1) {
                toastr.error("Vui lòng chọn tập tin có phần mở rộng '.jpg' '.jpeg' '.png'", "QUẢN LÝ ĐƠN HÀNG SIM SỐ");
                this.File1 = [];
                this.isEdit = true
                return;
            }
            if (Math.round(($('#fileUpload1')[0].files[0].size) / 1048576) >= 2) {
                toastr.error("Kích thước tập tin không vượt quá 2MB, vui lòng chọn lại", "QUẢN LÝ ĐƠN HÀNG SIM SỐ");
                this.File1 = [];
                this.isEdit = true
                return;
            }
        }
        catch (error) {

            this.File1 = [];
            this.isEdit = true
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
                            this.isEdit = false
                            this.entity.simSoMic.FILE1 = data
                        });
                }
            }

        }
      
        
    }

    async onSelectFile2(Fileselect) {
        try {
            Fileselect.length == 0 ? this.isEdit = true : this.isEdit = false
            this.listImage = [];
            this.listImage = this.fileListToArr(Fileselect);
            if (this.CheckImg($('#fileUpload2')[0].files[0].name) !== 1) {
                toastr.error("Vui lòng chọn tập tin có phần mở rộng '.jpg' '.jpeg' '.png'", "QUẢN LÝ ĐƠN HÀNG SIM SỐ");
                this.File2 = [];
                this.isEdit = true
                return;
            }
            if (Math.round(($('#fileUpload2')[0].files[0].size) / 1048576) >= 2) {
                toastr.error("Kích thước tập tin không vượt quá 2MB, vui lòng chọn lại", "QUẢN LÝ ĐƠN HÀNG SIM SỐ");
                this.File2 = [];
                this.isEdit = true
                return;
            }
        }
        catch (error) {

            this.File2 = [];
            this.isEdit = true
            return;
        }
        if (this.CheckImg($('#fileUpload2')[0].files[0].name) == 1) {
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
                            this.isEdit = false
                            this.entity.simSoMic.FILE2 = data
                        });
                }
            }

        }
    }
    get getTieuDe() {
        return "test"
    }
    async  onSelectFile3(Fileselect) {
        try {
            Fileselect.length == 0 ? this.isEdit = true : this.isEdit = false
            this.listImage = [];
            this.listImage = this.fileListToArr(Fileselect);
            if (this.CheckImg($('#fileUpload3')[0].files[0].name) !== 1) {
                toastr.error("Vui lòng chọn tập tin có phần mở rộng '.jpg' '.jpeg' '.png'", "QUẢN LÝ ĐƠN HÀNG SIM SỐ");
                this.File3 = [];
                this.isEdit = true
                return;
            }
            if (Math.round(($('#fileUpload3')[0].files[0].size) / 1048576) >=2) {
                toastr.error("Kích thước tập tin không vượt quá 2MB, vui lòng chọn lại", "QUẢN LÝ ĐƠN HÀNG SIM SỐ");
                this.File3 = [];
                this.isEdit = true
                return;
            }
        }
        catch (error) {

            this.File3 = [];
            this.isEdit = true
            return;
        }
        if (this.CheckImg($('#fileUpload3')[0].files[0].name) == 1) {
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
                            this.isEdit = false
                            this.entity.simSoMic.FILE3 = data
                        });
                }
            }

        }

    }


    cancelButtonClick() {
        this.dialogController.cancel();
    }


    GetIdByName(Tinhthanhname, Quanhuyenname) {
        var citycode = this.ListTinhThanhQuanHuyen[0].ListCity.filter(x => x.Cityname == Tinhthanhname).map(x => {
            return {
                Cityid: x.Cityid
            }
        })
     
        
        var quanhuyen = this.ListTinhThanhQuanHuyen[0].ListDistrict.filter(x => x.Districtname == Quanhuyenname).map(x => {
            return {
                DistrictId: x.DistrictId
            }
        })

        if ((typeof citycode[0] !== "undefined") || (typeof quanhuyen[0] !== "undefined")) {
            try {

                this.tinhthanhid = citycode[0].Cityid
                this.quanhuyenid = quanhuyen[0].DistrictId
                this.quanhuyenid.length > 0 ? this.isEdit = false : this.isEdit = true
            } catch (error) {

            }

        }
        else {
            this.tinhthanhid = "";
            this.quanhuyenid = "";
        }
    }
    ChangeListQuanHuyen(tinhthanhid) {
        this.ListQuanHuyen = this.ListTinhThanhQuanHuyen[0].ListDistrict.filter(x => x.CityId == tinhthanhid)
        this.ListQuanHuyen.length > 0 ? this.isEdit = false : this.isEdit = true
    }
    async Uploads() {
        let obj = {}
        obj.Id = this.entity.simSoMic.Id
        obj.C_FullName = this.entity.simSoMic.C_FullName
        obj.C_Sex = this.entity.simSoMic.C_Sex
        obj.C_Phone = this.entity.simSoMic.C_Phone
        obj.C_Email = this.entity.simSoMic.C_Email
        obj.C_CMND = this.entity.simSoMic.C_CMND
        obj.P_TINHTP = this.entity.simSoMic.P_TINHTP
        obj.P_QUANHUYEN = this.entity.simSoMic.P_QUANHUYEN
        obj.C_Address = this.entity.simSoMic.C_Address
        obj.FILE1 = this.entity.simSoMic.FILE1
        obj.FILE2 = this.entity.simSoMic.FILE2
        obj.FILE3 = this.entity.simSoMic.FILE3


        if (this.ValidateMenuBeforeSubmit()) {
            let rs
            rs = await this.simOnlineService.UpdateInfoGuest(obj)
            if (rs.data.Message == "Success") {
                toastr.success("Cập nhật thông tin thành công", "QUẢN LÝ ĐƠN HÀNG SIM SỐ");
            }
            else {
                toastr.error("Cập nhật thông tin thành công", "QUẢN LÝ ĐƠN HÀNG SIM SỐ");
            }
        }

    }

}

