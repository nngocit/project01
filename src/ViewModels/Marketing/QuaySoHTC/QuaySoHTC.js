import { inject } from 'aurelia-framework';
import { json } from 'aurelia-fetch-client';
import { WebQuaySoService } from 'Services/Webquayso/WebQuaySoService';
import * as toastr from "toastr";
import { LogService } from 'Services/LogService';
import 'sweetalert';
@inject(WebQuaySoService, LogService)
export class QuaySoHTC {
    postObject = {};
    isSTop = false;
    quaySoResult = '000000000000000';
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
        });
    }

    // select list data when Week changed
    Danhsachkhachhangtheotuan1() {
        this.quaySoResult = '000000000000000';
        this.webQuaySoService.GetListKetQuaKhachHang(this.objQua1()).then(rs => {
            if (rs.StatusCode == "InvalidData") {
                this.DSKhachHangTrung1 = rs.Data.DsKhachhangsDaTrung;
                this.total = this.DSKhachHangTrung1.length;
            } else {
                this.DSKhachHangTrung1 = rs.Data.DsKhachhangsDaTrung;
                this.total = this.DSKhachHangTrung1.length;
            }
        });
    }

    // Break Point Counter
    counter = 1;

    objQua1() {
        let obj = {};
        obj.Tuan = this.postObject.Tuan;
        obj.LoaiQua = 0;
        obj.EventId = 6;
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


    KetQua1() {
        this.webQuaySoService.GetKetQuaKhachHang(this.objQua1()).then(rs => {

            if (rs.StatusCode == "Success") {
                $("#btn_quay_AB").removeAttr("disabled");
                $('#btn_quay_AB').removeClass('disabled');
                this.quaySoResult = rs.Data.KhachhangsDangTrung.MaKh;
                this.logService.InsertAdminCPLog("QuaySoHTC", rs.StatusCode, JSON.stringify(rs));
                this.DSKhachHangTrung1 = rs.Data.DsKhachhangsDaTrung;
                this.total = this.DSKhachHangTrung1.length;

            } else {
                $("#btn_quay_AB").removeAttr("disabled");
                $('#btn_quay_AB').removeClass('disabled');

                this.logService.InsertAdminCPLog("QuaySoHTC", rs.StatusCode, JSON.stringify(rs));
                swal({ title: "QUAY SỐ HTC", text: "Chưa Lấy được kết quả hoặc hết quà!", type: "warning", timer: 5000})
                this.quaySoResult = '000000000000000';
                this.total = this.DSKhachHangTrung1.length;

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
            swal({ title: "Lỗi dữ liệu nhập!", text: strErrorMsg, type: "warning", timer: 5000})
            return false;
        }
        return true;
    }


}