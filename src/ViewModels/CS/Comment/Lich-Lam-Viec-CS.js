import { inject } from 'aurelia-framework';
import { json } from 'aurelia-fetch-client';

import { WebQuaySoService } from 'Services/Webquayso/WebQuaySoService';
import { LogService } from 'Services/LogService';
import 'sweetalert';
import * as toastr from "toastr";

@inject(WebQuaySoService, LogService)
export class CauHinhQuaySoMarketing {

    ListGifts = [];


    constructor(webQuaySoService, logService) {
        this.webQuaySoService = webQuaySoService;
        this.logService = logService;

        //Pagination
        this.current = 1;
        this.itemperpage = 10;
        this.pagesize = 10;
    }

    activate() {
        return Promise.all([this.webQuaySoService.GetListQuaTang()

        ]).then((rs) => {
            this.ListGifts = [];


        })
    }

    bind(ct, ovr) {
        ovr.bindingContext.total = this.ListGifts.length;
    }

    AddGift() {
        this.isEdit = false;
        this.InitGiftInfo();
    }
    RestresultGift(currentGift) {



        swal({
            title: "THÔNG BÁO",
            text: `Reset số lượng quà ` + currentGift.LoaiQua + `, Event:` + currentGift.EventName,
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#5484E2",
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Hủy bỏ",
            closeOnConfirm: false,
            closeOnCancel: false,
            showLoaderOnConfirm: true
        }, (isConfirm) => {
            if (isConfirm) {

                this.webQuaySoService.Resetkqquayso(currentGift.Id)
                    .then(rs => {
                        if (rs.StatusCode === "Success") {
                            this.logService.InsertAdminCPLog("Reset quà tặng quay số chủ động MKT " + currentGift.LoaiQua + ' số lượng reset ' + rs.Data, rs.StatusCode, null);
                            swal("Cập nhật!", `Có ` + rs.Data + ` kết quả được reset thành công`, "success");
                            this.ListGifts = this.webQuaySoService.GetListQuaTang();
                            this.activate();
                        } else { swal("Cập nhật", "Không thể reset", "error"); }
                    })


            } else {
                swal({ title: "THÔNG BÁO", text: `Hủy thao tác`, type: "warning" });
            }
        });
    }
    EditGift(currentGift) {
        var jsonToPost = {};
        this.isEdit = true;
        this.currentGift = currentGift;
        jsonToPost.Id = currentGift.Id;
        jsonToPost.LoaiQua = currentGift.LoaiQua;
        jsonToPost.Giatri = currentGift.Giatri;
        jsonToPost.CreateDate = currentGift.CreateDate;
        jsonToPost.Status = currentGift.Status;
        jsonToPost.Soluong = currentGift.Soluong;
        jsonToPost.EventId = currentGift.EventId;

        if (currentGift.Soluong <= 0) { swal("Cập nhật", "Số lượng không hợp lệ", "error"); return; }
        swal({
            title: "THÔNG BÁO",
            text: `Cập nhật số lượng quà ` + this.currentGift.Soluong + ` cho quà tặng ` + this.currentGift.LoaiQua + `, Event:` + this.currentGift.EventName,
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#5484E2",
            confirmButtonText: "Cập nhật",
            cancelButtonText: "Hủy bỏ",
            closeOnConfirm: false,
            closeOnCancel: false,
            showLoaderOnConfirm: true
        }, (isConfirm) => {
            if (isConfirm) {

                this.webQuaySoService.UpdateQuaTang(jsonToPost)
                    .then(rs => {
                        if (rs.StatusCode === "Success") {
                            this.logService.InsertAdminCPLog("CauHinhSoLuongQuaySoMKT", rs.StatusCode, JSON.stringify(jsonToPost));
                            swal("Cập nhật!", `Cập nhật thành công số lượng quà cho ` + `Event` + this.currentGift.EventName, "success");
                            this.ListGifts = this.webQuaySoService.GetListQuaTang();
                            this.activate();
                        } else { swal("Cập nhật", "Cập nhật không thành công", "error"); }
                    })


            } else {
                swal({ title: "THÔNG BÁO", text: `Hủy cập nhật`, type: "warning" });
            }
        });
    }

    ChangeGiftStatus(gift) {
        this.isEdit = true;
        this.currentGift = gift;
        if (gift.Status === "D") {
            this.currentGift.Status = "A";
        } else {
            this.currentGift.Status = "D";
        }
        this.isStatus = true;
        this.EditGift(gift);
    }

    SubmitGift() {
        if (!this.ValidateGiftBeforeSubmit()) {
            return false;
        }

    }

    InitGiftInfo() {
        this.currentGift = {};
        this.currentGift.LoaiQua = "";
        this.currentGift.Soluong = "";
        this.currentGift.Status = "D";

    }

}



export class FilterByNameValueConverter {
    toView(array, obj) {
        if (obj) {
            return array
                .filter(x => ((x.EventName != null) && (x.EventName.toLowerCase().indexOf(obj.trim().toLowerCase()) != -1)));
        }
        return array;
    }
}