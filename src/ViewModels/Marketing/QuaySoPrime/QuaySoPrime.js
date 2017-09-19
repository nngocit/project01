import { inject } from 'aurelia-framework';
import { json } from 'aurelia-fetch-client';
import { WebQuaySoService } from 'Services/Webquayso/WebQuaySoService';
import * as toastr from "toastr";
import 'sweetalert';
import { LogService } from 'Services/LogService';
@inject(WebQuaySoService, LogService)

export class QuaySoPrime {
    postObjectJ5 = {};
    postObjectJ7 = {};
    isSTop = false;
    quaySoResultJ5 = '000000000000000';
    quaySoResultJ7 = '000000000000000';

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
        $('#el_weekJ5').on('change', () => {
            this.Danhsachkhachhangtheotuan1();
        });
        $('#el_weekJ7').on('change', () => {
            this.Danhsachkhachhangtheotuan2();
        });
    }

    // select list data when Week changed
    Danhsachkhachhangtheotuan1() {
        console.log(this.objQua1());
        this.quaySoResultJ5 = '000000000000000';
        this.webQuaySoService.GetListKetQuaKhachHang(this.objQua1()).then(rs => {
            if (rs.StatusCode == "InvalidData") {

                this.DSKhachHangTrung1 = rs.Data.DsKhachhangsDaTrung;
                this.total = 0;
            } else {
                this.DSKhachHangTrung1 = rs.Data.DsKhachhangsDaTrung;
                this.total = this.DSKhachHangTrung1.length;
            }

        });
    }

    Danhsachkhachhangtheotuan2() {
        console.log(this.objQua1());
        this.quaySoResultJ7 = '000000000000000';
        this.webQuaySoService.GetListKetQuaKhachHang(this.objQua2()).then(rs => {
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

    objQua1() {
        let obj = {};
        obj.Tuan = this.postObjectJ5.Tuan;
        obj.LoaiQua = 0;
        obj.EventId = 9;
        return obj;
    }

    objQua2() {
        let obj = {};
        obj.Tuan = this.postObjectJ7.Tuan;
        obj.LoaiQua = 0;
        obj.EventId = 9;
        return obj;
    }

    HieuUng1() {
        if (this.counter >= 40) {
            this.stop();
            this.KetQua1();
            return;

        }
        setTimeout(() => {
            this.quaySoResultJ5 = this.randChars(15);
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
            this.quaySoResultJ7 = this.randChars(15);
            this.HieuUng2();
            this.counter++;
        }, 50)
    }

    KetQua1() {
        this.webQuaySoService.GetKetQuaKhachHangPrime(this.objQua1()).then(rs => {

            if (rs.StatusCode == "Success") {

                $("#btn_quay_J5").removeAttr("disabled");
                $('#btn_quay_J5').removeClass('disabled');
                this.quaySoResultJ5 = rs.Data.KhachhangsDangTrung.MaKh;
                this.logService.InsertAdminCPLog("QuaySoPrime", rs.StatusCode, JSON.stringify(rs));
                this.DSKhachHangTrung1 = rs.Data.DsKhachhangsDaTrung;
                this.total = this.DSKhachHangTrung1.length;

            } else {
                $("#btn_quay_J5").removeAttr("disabled");
                $('#btn_quay_J5').removeClass('disabled');

                this.logService.InsertAdminCPLog("QuaySoPrime", rs.StatusCode, JSON.stringify(rs));
                swal({ title: "Quà tặng Samsung Galaxy J5 Prime", text: "Chưa lấy được kết quả hoặc hết quà!", type: "warning", timer: 5000 });
                this.quaySoResultJ5 = '000000000000000';
                this.total = this.DSKhachHangTrung1.length;
            }

        });
    }

    KetQua2() {
        this.webQuaySoService.GetKetQuaKhachHangPrime(this.objQua2()).then(rs => {

            if (rs.StatusCode == "Success") {

                $("#btn_quay_J7").removeAttr("disabled");
                $('#btn_quay_J7').removeClass('disabled');
                this.quaySoResultJ7 = rs.Data.KhachhangsDangTrung.MaKh;
                this.logService.InsertAdminCPLog("QuaySoPrime", rs.StatusCode, JSON.stringify(rs));
                this.DSKhachHangTrung2 = rs.Data.DsKhachhangsDaTrung;
                this.total = this.DSKhachHangTrung2.length;

            } else {
                $("#btn_quay_J7").removeAttr("disabled");
                $('#btn_quay_J7').removeClass('disabled');

                this.logService.InsertAdminCPLog("QuaySoPrime", rs.StatusCode, JSON.stringify(rs));
                swal({ title: "Quà tặng Samsung Galaxy J7 Prime", text: "Chưa lấy được kết quả hoặc hết quà!", type: "warning", timer: 5000 });
                this.quaySoResultJ7 = '000000000000000';
                this.total = this.DSKhachHangTrung2.length;
            }

        });
    }


    play1() {
        if (!this.ValidateJ5ConditionBeforeSubmit()) {
            return false;
        }
        $('#btn_quay_J5').addClass('disabled');
        $("#btn_quay_J5").attr("disabled", "disabled");
        this.HieuUng1();
    }

    play2() {
        if (!this.ValidateJ7ConditionBeforeSubmit()) {
            return false;
        }
        $('#btn_quay_J7').addClass('disabled');
        $("#btn_quay_J7").attr("disabled", "disabled");
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

    ValidateJ5ConditionBeforeSubmit() {
        var strErrorMsg = "";
        if (this.postObjectJ5.Tuan == "" || typeof this.postObjectJ5.Tuan === "undefined")
            strErrorMsg += "Vui lòng chọn khung giờ mua!";
        if (strErrorMsg !== "") {
            toastr.options.positionClass = 'toast-top-center';
            swal({ title: "Lỗi!", text: strErrorMsg, type: "warning", timer: 5000 })
            return false;
        }
        return true;
    }

    ValidateJ7ConditionBeforeSubmit() {
        var strErrorMsg = "";
        if (this.postObjectJ7.Tuan == "" || typeof this.postObjectJ7.Tuan === "undefined")
            strErrorMsg += "Vui lòng chọn khung giờ mua!";
        if (strErrorMsg !== "") {
            toastr.options.positionClass = 'toast-top-center';
            swal({ title: "Lỗi!", text: strErrorMsg, type: "warning", timer: 5000 })
            return false;
        }
        return true;
    }


}