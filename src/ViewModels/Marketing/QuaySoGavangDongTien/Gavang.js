import { inject } from 'aurelia-framework';
import { json } from 'aurelia-fetch-client';
import { WebQuaySoService } from 'Services/Webquayso/WebQuaySoService';
import * as toastr from "toastr";
import 'sweetalert';
import { LogService } from 'Services/LogService';
@inject(WebQuaySoService, LogService)
export class Gavang {
    postObject = {};
    isSTop = false;
    quaySoResult = '000000000000000';
    quaySoResult2 = '000000000000000';
    total = 0;
    constructor(webQuaySoService, logService) {
        this.webQuaySoService = webQuaySoService;
        this.logService = logService;
    }

    activate() {

        this.total = 0;
    }

    attached() {
        // Lấy giá trị Text
        $('#el_week').on('change', () => {
            this.Danhsachkhachhangtheotuan1();
            this.Danhsachkhachhangtheotuan2()
        });



    }

    // select list data when Week changed
    Danhsachkhachhangtheotuan1() {
            //  console.log(this.objQua1());
            this.quaySoResult = '000000000000000';
            this.webQuaySoService.GetListKhachHangTrungGaVangDongTien(this.objQua1()).then(rs => {
                if (rs.StatusCode == "InvalidData") {

                    this.DSKhachHangTrung1 = rs.Data.DsKhachhangsDaTrung;
                    this.total = 0;
                } else {
                    this.DSKhachHangTrung1 = rs.Data.DsKhachhangsDaTrung;
                    this.total = this.DSKhachHangTrung1.length;
                }

            });
        }
        // select list data when Week changed
    Danhsachkhachhangtheotuan2() {
        //    console.log(this.objQua2());
        this.quaySoResult2 = '000000000000000';
        this.webQuaySoService.GetListKhachHangTrungGaVangDongTien(this.objQua2()).then(rs => {
            if (rs.StatusCode == "InvalidData") {

                this.DSKhachHangTrung2 = rs.Data.DsKhachhangsDaTrung;
                this.total = 0;
            } else {
                this.DSKhachHangTrung2 = rs.Data.DsKhachhangsDaTrung;
                this.total = this.DSKhachHangTrung2.length;
            }

        });
    }

    // Break Point Counter
    counter = 1;

    objQua1() { //Oppo
        let obj = {};
        obj.Tuan = this.postObject.Tuan;
        obj.GiaTriEvent = 1;
        obj.EventId = 8;
        return obj;
    }
    objQua2() { // Apple
        let obj = {};
        obj.Tuan = this.postObject.Tuan;
        obj.GiaTriEvent = 2;
        obj.EventId = 8;
        return obj;
    }


    HieuUng1() {
        if (this.counter >= 40) {
            this.stop();
            this.KetQua1();
            return;

        }
        setTimeout(() => {
            this.quaySoResult = this.randChars(15);
            this.HieuUng1();
            this.counter++;
        }, 50)
    }
    HieuUng2() {
        if (this.counter >= 40) {
            this.stop();
            this.KetQua2();
            return;

        }
        setTimeout(() => {
            this.quaySoResult2 = this.randChars(15);
            this.HieuUng2();
            this.counter++;
        }, 50)
    }

    KetQua1() {
        this.webQuaySoService.GetKhachHangTrungGaVangDongTien(this.objQua1()).then(rs => {
            //  console.log(JSON.stringify(rs));
            if (rs.StatusCode == "Success") {

                $("#btn_quay_AB").removeAttr("disabled");
                $('#btn_quay_AB').removeClass('disabled');
                this.quaySoResult = rs.Data.KhachhangsDangTrung.MaKh;
                this.logService.InsertAdminCPLog("QuaySoGaVang", rs.StatusCode, JSON.stringify(rs));
                this.DSKhachHangTrung1 = rs.Data.DsKhachhangsDaTrung;
                this.total = this.DSKhachHangTrung1.length;

            } else {
                $("#btn_quay_AB").removeAttr("disabled");
                $('#btn_quay_AB').removeClass('disabled');

                this.logService.InsertAdminCPLog("QuaySoGaVang", rs.StatusCode, JSON.stringify(rs));
                swal({ title: "QUAY SỐ GÀ VÀNG OPPO", text: "Chưa Lấy được kết quả hoặc hết quà!", type: "warning", timer: 5000 });
                this.quaySoResult = '000000000000000';
                this.total = this.DSKhachHangTrung1.length;
            }

        });
    }

    KetQua2() {
        this.webQuaySoService.GetKhachHangTrungGaVangDongTien(this.objQua2()).then(rs => {
            //  console.log(JSON.stringify(rs));
            if (rs.StatusCode == "Success") {

                $("#btn_quay_AB").removeAttr("disabled");
                $('#btn_quay_AB').removeClass('disabled');
                this.quaySoResult2 = rs.Data.KhachhangsDangTrung.MaKh;
                this.logService.InsertAdminCPLog("QuaySoGaVang", rs.StatusCode, JSON.stringify(rs));
                this.DSKhachHangTrung2 = rs.Data.DsKhachhangsDaTrung;
                this.total = this.DSKhachHangTrung2.length;

            } else {
                $("#btn_quay_AB").removeAttr("disabled");
                $('#btn_quay_AB').removeClass('disabled');

                this.logService.InsertAdminCPLog("QuaySoGaVang", rs.StatusCode, JSON.stringify(rs));
                swal({ title: "QUAY SỐ GÀ VÀNG APPLE", text: "Chưa Lấy được kết quả hoặc hết quà!", type: "warning", timer: 5000 });
                this.quaySoResult2 = '000000000000000';
                this.total = this.DSKhachHangTrung2.length;
            }

        });
    }
    play1() {
        if (!this.ValidateConditionBeforeSubmit()) {
            return false;
        }
        $('#btn_quay_AB').addClass('disabled');
        $("#btn_quay_AB").attr("disabled", "disabled");
        this.HieuUng1();
    }
    play2() {
        if (!this.ValidateConditionBeforeSubmit()) {
            return false;
        }
        $('#btn_quay_AB').addClass('disabled');
        $("#btn_quay_AB").attr("disabled", "disabled");
        this.HieuUng2();
    }

    stop() {

        this.isSTop = true;
        this.counter = 1;
    }
    randChars(n_char) {
        var text = "";
        var possible = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        for (var i = 0; i < n_char; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    ValidateConditionBeforeSubmit() {
        var strErrorMsg = "";
        if (this.postObject.Tuan == "" || typeof this.postObject.Tuan === "undefined")
            strErrorMsg += "Tuần quay phải chọn.";
        if (strErrorMsg !== "") {
            toastr.options.positionClass = 'toast-top-center';
            swal({ title: "Lỗi dữ liệu nhập!", text: strErrorMsg, type: "warning", timer: 5000 })
            return false;
        }
        return true;
    }


}