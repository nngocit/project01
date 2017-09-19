import {
    DialogController
} from 'aurelia-dialog';
import {
    inject
} from 'aurelia-dependency-injection';
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
    SimOnlineDetailEdit
} from './SimOnlineDetailEdit';
import {
    LogService
} from 'Services/LogService';
import {
    SimOnlineService
} from 'Services/MOT/SimOnlineService';
import { ExcelService } from 'Helpers/ExcelHelper';
import { DateFormat } from 'Helpers/datetime-format';
import viewerjs from 'viewerjs';
import { DoiTraXaHangService } from '../../../Services/AffiliateSvc/DoiTraXaHangService';
import { SimSoPermission } from 'Configuration/PermissionSettings/SimSoPermission';
@inject(DialogController, DialogService, DealOnlineMngService, LogService, ExcelService, DateFormat, SimOnlineService, DoiTraXaHangService, SimSoPermission)
export class SimOnlineDetail {

    ListTT = [];
    DetailCard = [];
    ListHTNH = [];
    ListPTTT = [];
    ListQLDonHang = [];
    ListLoaiDonHang = [];
    ListTrangThai = [];
    ListCoSo = [];

    ChinhanhVTA = false;
    entity = {};
    DataChiNhanh;
    Phivanchuyen = 0;
    showmsg = false;
    DisableHuy
    DisablePos
    DisableUpdate

    ptthanhtoan = false
    DisableTinhtrang = false;
    TrangThaiThanhToan = "";
    dialogController: DialogController

    constructor(dialogController, dialogService, dealOnlineMngService, logService, excelService, dateFormat, simOnlineService, doiTraXaHangService, simSoPermission) {
        this.simOnlineService = simOnlineService;
        this.dialogController = dialogController;
        this.doiTraXaHangService = doiTraXaHangService;
        this.dealOnlineMngService = dealOnlineMngService;
        this.dialogService = dialogService;
        this.logService = logService;
        this.excelService = excelService;
        this.dateFormat = dateFormat;
        this.simSoPermission = simSoPermission;
        //Pagination
        this.current = 1;
        this.itemperpage = 20;
        this.orderselect = 0;
        this.pagesize = 20;

    }


    async activate(data) {

        toastr.options.timeOut = 700;
        toastr.options.extendedTimeOut = 700;
        this.isQL();
        this.entity = data;
        this.rs = await this.simOnlineService.GetSimSoConfig();
        this.ListQLDonHang = this.rs.data.Data.ListQLDonHang;
        this.ListHTNH = this.rs.data.Data.ListHTNH;
        this.ListPTTT = this.rs.data.Data.ListPTTT;
        this.ListLoaiDonHang = this.rs.data.Data.ListLoaiDonHang;
        this.ListTrangThai = this.rs.data.Data.ListTrangThai;
        this.DataChiNhanh = await this.doiTraXaHangService.Getlistxahangconfig(Lockr.get('UserInfo').Username);
        this.ListCoSo = this.DataChiNhanh.data.ListCoSo;
        this.entity.FILE1 = this.imageExists(this.entity.FILE1);
        this.entity.FILE2 = this.imageExists(this.entity.FILE2);
        this.entity.FILE3 = this.imageExists(this.entity.FILE3);
        this.entity.MaNVTiepNhanDH = data.MaNVTiepNhanDH;


        // comment duoc phep chuyen trang Thai hien tai cua commnent.
        if (this.entity.simSoMic.STATUS == "0") {
            this.ListTrangThai = this.rs.data.Data.ListTrangThai.filter(x => x.Value == "0" || x.Value == "5" || x.Value == "6" || x.Value == "7");
        }
        if (this.entity.simSoMic.STATUS == "1") {
            this.ListTrangThai = this.rs.data.Data.ListTrangThai.filter(x => x.Value == "1" || x.Value == "5" || x.Value == "6" || x.Value == "7");
        }
        if (this.entity.simSoMic.STATUS == "2" || this.entity.simSoMic.STATUS == "3" || this.entity.simSoMic.STATUS == "5" || this.entity.simSoMic.STATUS == "6" || this.entity.simSoMic.STATUS == "7") {
            this.DisableTinhtrang = true
        }

        this.checkaction(this.entity.simSoMic.STATUS)
        if (this.entity.simSoMic.P_HTNH == "TRANSFER") {
            this.ChinhanhVTA = false;
            if ((this.entity.simSoMic.GiaSIM + this.entity.simSoMic.GiaGoi) < 400000) {
                this.showmsg = true;
            }
            else {
                this.showmsg = false;
            }
        }
        else {
            this.ChinhanhVTA = true;
        }

        if (this.entity.simSoMic.P_HTTT == 21) {
            this.ptthanhtoan = true
            if (this.entity.simSoMic.TrangThaiThanhToan == "G") {
                this.TrangThaiThanhToan = "Thành công"

            } else {
                this.TrangThaiThanhToan = "Thất bại"
            }
        }
        else {
            this.ptthanhtoan = false
        }

    }

    imageExists(image_url) {
        try {
            if ((image_url.includes('png')) || (image_url.includes('jpeg')) || (image_url.includes('png')) || (image_url.includes('jpg'))) {
                image_url = image_url;
            }
            else {
                image_url = "images/no_image.gif";
            }
        } catch (error) {
            image_url = "images/no_image.gif";
        }

        return image_url;
    }
    checkaction(tt) {
        if (tt == "0") {
            this.DisableHuy = true;
            this.DisablePos = false;
            this.DisableUpdate = false
        }
        if (tt == "1") {
            this.DisableHuy = false;
            this.DisablePos = true;
            this.DisableUpdate = false;
            this.DisableTinhtrang = true;
        }
        if ((tt == "2") || (tt == "3") || (tt == "4") || (tt == "5") || (tt == "6") || (tt == "7")) {
        
            
            this.DisableHuy = true;
            this.DisablePos = true;
            this.DisableUpdate = true
            this.DisableTinhtrang = true;
        }



    }
    attached() {
        var viewer = new Viewer(document.getElementById('thongtin'));


        $('#HtnhId').on('change', () => {
            if ($('#HtnhId').val() == 'VTA') {
             
                
                this.ChinhanhVTA = true;
                this.showmsg = false;
            }
            if ($('#HtnhId').val() == 'TRANSFER') {
             
                
                this.ChinhanhVTA = false;
                if ((this.entity.simSoMic.GiaSIM + this.entity.simSoMic.GiaGoi) < 400000) {
                    this.showmsg = true;
                }
                else {
                    this.showmsg = false;
                }
            }
        })
        $('#CoSo').on('change', () => {
            this.entity.simSoMic.P_CHINHANH = $("#CoSo option:selected").text();
        });

    }

    cancelButtonClick() {
        this.dialogController.cancel();
    }


    SimOnlineDetailEdit(items, a) {
        let NoiDung = "";
        switch (a) {
            case 1:
                NoiDung = "THÔNG TIN KHÁCH HÀNG";
                break;
            default:
                break;
        }
        let obj = items;
        obj.NoiDung = NoiDung;
        obj.HTTT = this.ChinhanhVTA;
        this.dialogService.open({
            viewModel: SimOnlineDetailEdit,
            model: obj,
            lock: true

        }).then((result) => {
            if (result.wasCancelled) {
            }
        });
    }

    ValidateMenuBeforeSubmit() {

        var strErrorMsg = "";
        if (this.entity.MaNVTiepNhanDH == "" || typeof this.entity.MaNVTiepNhanDH == 'undefined') {
            strErrorMsg += "'<b>'[Quản trị đơn hàng]'</b>'Chưa được chọn. Vui lòng chọn/nhập lại. <br/>";
        }
        if (strErrorMsg !== "") {

            toastr.error(strErrorMsg, "QUẢN LÝ ĐƠN HÀNG SIM SỐ");
            return false;
        }
        return true;
    }


    CheckAddress() {
        if (this.entity.simSoMic.P_HTNH == "TRANSFER") {
            if (this.entity.simSoMic.C_Address == "" || typeof this.entity.simSoMic.C_Address == 'undefined' || this.entity.simSoMic.C_Address == null) {
                return false;
            }
            else {
                return true
            }
        }

    }
    async  Updates() {
        if (!this.ValidateMenuBeforeSubmit()) { return; }
        let obj = {};
        obj.Id = this.entity.simSoMic.Id
        obj.STATUS = this.entity.simSoMic.STATUS
        obj.OrderType = this.entity.simSoMic.OrderType
        obj.P_MACHINHANH = this.entity.simSoMic.P_MACHINHANH
        obj.P_HTNH = this.entity.simSoMic.P_HTNH
        obj.P_HTTT = this.entity.simSoMic.P_HTTT
        obj.P_CHINHANH = (this.entity.simSoMic.P_HTNH == "VTA" ? this.entity.simSoMic.P_CHINHANH : this.entity.simSoMic.C_Address)
        obj.MaNVTiepNhanDH = this.entity.MaNVTiepNhanDH
        obj.GhiChu = this.entity.simSoMic.GhiChu == null ? "" : this.entity.simSoMic.GhiChu
        obj.PhiVanChuyen = this.entity.simSoMic.PhiVanChuyen
        obj.ThanhTien = this.entity.simSoMic.ThanhTien
        this.checkaction(this.entity.simSoMic.STATUS)
        if (this.CheckAddress() == false) {
            toastr.error("Vui lòng cập nhật địa chỉ khách hàng", "QUẢN LÝ ĐƠN HÀNG SIM SỐ");
        }
        else {
            if (this.ValidateMenuBeforeSubmit()) {
                let rs
                rs = await this.simOnlineService.UpdateInfoOrder(obj)
                if (rs.data.Message == "Success") {
                    toastr.success("Cập nhật chi tiết giao dịch thành công", "QUẢN LÝ ĐƠN HÀNG SIM SỐ");
                    this.DisableUpdate = true;
                }
                else {
                    toastr.error("Cập nhật chi tiết giao dịch không thành công", "QUẢN LÝ ĐƠN HÀNG SIM SỐ");
                    this.DisableUpdate = false;
                }
            }
        }

    }

    isQL() {
        this.Roloes = Lockr.get('UserInfo').Roles;
        for (let i of this.Roloes) {
            this.simSoPermission.IsArray(i.Code);
        }
        if (this.simSoPermission.isLimit() == true) {
            this.isLimit = true;
        }
        else {
            this.isLimit = false;
        }
    }


    async  huylc() {
        this.DisableHuy = true;
        let obj = {};
        obj.Id = this.entity.simSoMic.Id
        obj.UserName = Lockr.get('UserInfo').Username
        let rs
        rs = await this.simOnlineService.HuyLenhChuyen(obj)
        if (rs.data !== "") {
            toastr.success("Hủy lệnh chuyển thành công", "QUẢN LÝ ĐƠN HÀNG SIM SỐ");

        }
        else {
            toastr.error("Hủy lệnh chuyển không thành công", "QUẢN LÝ ĐƠN HÀNG SIM SỐ");
            this.DisableHuy = false;
        }
    }
    async ChuyenMic() {
        if (this.entity.simSoMic.STATUS == "0") {
            let obj = {};
            obj.orderId = this.entity.simSoMic.Id
            obj.adminUserName = Lockr.get('UserInfo').Username
            if (this.CheckAddress() == false) {
                toastr.error("Vui lòng cập nhật địa chỉ khách hàng", "QUẢN LÝ ĐƠN HÀNG SIM SỐ");
            }
            else {
                this.DisablePos = true;
                this.DisableHuy = false;
                this.DisableUpdate = true;
                let rs
                rs = await this.simOnlineService.ChuyenMic(obj)
                if (rs.data !== "") {
                    this.DisableTinhtrang = true;
                    toastr.success("Chuyển đơn hàng xuống POS thành công", "QUẢN LÝ ĐƠN HÀNG SIM SỐ");

                }
                else {
                    this.DisablePos = false;
                    this.DisableHuy = true;
                    this.DisableUpdate = false;
                    toastr.error("Chuyển đơn hàng xuống POS không thành công", "QUẢN LÝ ĐƠN HÀNG SIM SỐ");
                }
            }
        }
        else {
            toastr.warning("Đơn hàng này không được phép chuyển", "QUẢN LÝ ĐƠN HÀNG SIM SỐ");
        }

    }

}

export class LoaiGDValueConverter {
    toView(title) {
        let text = "";
        if (title !== "" && title != null && typeof title !== "undefined") {
            switch (title) {
                case "TheCao":
                    text = "Thẻ Cào";
                    break;
                default:
                    text = "";
            }
        }
        return text;
    }
}