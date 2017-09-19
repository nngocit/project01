import { inject } from 'aurelia-framework';
import { json } from 'aurelia-fetch-client';
import { NotificationService } from 'Services/Notification/NotificationService';
import { LogService } from 'Services/LogService';
import * as APISettings from 'Configuration/APISettings';

import * as toastr from "toastr";
import 'emojionearea';
import moment from 'moment';
import 'momentrange';

@inject(NotificationService, LogService)
export class CauHinhNotification3 {

    ListDevices = [];
    AppDevice = {};
    PushProgress = {};
    InitPushProgress = [];
    ListHotDeal = [];
    ListHotDealByProductId = [];

    DisablecLink = true;
    DisablecChuongTrinh = true;
    DisablecSPChuongTrinh = true;
    TypeofMessageType = 0;
    EndDate;
    CampaignId;
    RunningMode;

    constructor(notificationService, logService) {
        this.notificationService = notificationService;
        this.logService = logService;
        this.AppDevice.DeviceOs = "All";

        //Init push progress
        this.PushProgress.IsSending = false;
        this.PushProgress.CurrentStatus = "Chưa gửi";
        this.PushProgress.TotalDevice = 0;
        this.PushProgress.TotalAndroidDeviceProcessed = 0;
        this.PushProgress.TotalIosDeviceProcessed = 0;
        this.PushProgress.TotalFailedDevices = 0;
        this.PushProgress.Progress = 0;
        this.PushProgress.PushStartAt = "N/A";
        this.PushProgress.PushEndAt = "N/A";

        this.PushProgress.PushId = "N/A";
        this.PushProgress.TotalAndroidToPush = 0;
        this.PushProgress.TotalIosToPush = 0;
        this.PushProgress.TotalAndroidFail = 0;
        this.PushProgress.TotalIosFail = 0;
        this.PushProgress.PushType = "N/A";
        this.PushProgress.Alert = "N/A";
        //this.PushProgress.LastSuccessPush = "N/A";

        this.RunningMode = APISettings.Environment;
    }

    activate() {

        return Promise.all([this.notificationService.GetPushProgressInfo(null), this.notificationService.GetListCampaignForPrivateSale()]).then((rs) => {
            this.InitPushProgress = rs[0].Data;
            this.ListHotDeal = rs[1].Data.ListCampaign;
            if (rs[0].Data.CurrentStatus === "Processing") {
                this.PushProgress.IsSending = true;
                this.PushProgress = rs[0].Data;
            } else {
                //Init push progress
                this.PushProgress.IsSending = false;
                this.PushProgress.CurrentStatus = "Chưa gửi";
                this.PushProgress.TotalDevice = 0;
                // this.PushProgress.TotalAndroid = 0;
                // this.PushProgress.TotalIos = 0;
                this.PushStartAt = "N/A";
                this.PushEndAt = "N/A";
                this.PushProgress.TotalAndroidDeviceProcessed = 0;
                this.PushProgress.TotalIosDeviceProcessed = 0;
                this.PushProgress.TotalFailedDevices = 0;
                this.PushProgress.Progess = 0;
                //this.PushProgress.LastSuccessPush = "N/A";
            }
        })
    }

    attached() {
        var el = $("#emojitxt").emojioneArea({});

        $('#LoaiLienKet').on('change', () => {
            this.CheckunhideLink();
        })
        $('#Chuongtrinh').on('change', () => {
            this.CheckunhideChuongTrinh();

            this.TypeofMessageType = this.AppDevice.MessageType;
            console.log('this.TypeofMessageType', this.TypeofMessageType);
            if (this.AppDevice.MessageType !== null || this.AppDevice.MessageType !== "" || this.AppDevice.MessageType !== 'undefined') {

                this.GetListProductByCampaignId(this.AppDevice.MessageType);
            }

        })
        $('#Chuongtrinh').on('change', () => {

        })

    }

    CheckunhideLink() {
        if (this.LoaiLienKetval === "1") { //HotDeal
            this.DisablecLink = false;
        } else {
            this.DisablecLink = true;
        }
        if (this.LoaiLienKetval === "2") { //FlashDeal
            this.DisablecChuongTrinh = false;
        } else {
            this.AppDevice.MessageType = "0";
            this.DisablecChuongTrinh = true;
            this.AppDevice.MessageValue = "0";
            this.DisablecSPChuongTrinh = true;
        }
    }

    CheckunhideChuongTrinh() {
        if (this.AppDevice.MessageType === "0") {
            this.AppDevice.MessageValue = 0;
            this.DisablecSPChuongTrinh = true;
        }
    }

    CheckMessageType() {
        let rs = "";
        if (this.AppDevice.MessageType === "0") {
            rs = ""
        }
        if (this.AppDevice.MessageType === "1") {
            console.log('CheckMessageTypeFlashDeal')
            rs = "FlashDeal|" + this.EndDate;
        } else {
            console.log('CheckMessageTypeHotDeal')
            rs = "HotDeal|" + this.EndDate;
        }
        return rs;
    }

    CheckMessageValue() {
        let rs = "";
        if (this.AppDevice.MessageType === "0") {
            rs = "";
        }
        if (this.TypeofMessageType === "1") {
            if (!this.ValidateInfoBeforeSubmitFlashDeal()) {
                return false;
            } else {
                rs = this.CampaignId + "-" + this.AppDevice.MessageValue;
            }

        } else {
            if (!this.ValidateInfoBeforeSubmitHotDeal()) {
                return false;
            } else {
                if (this.AppDevice.MessageValue === "0") {
                    rs = this.AppDevice.MessageType;
                } else {
                    rs = this.AppDevice.MessageType + "-" + this.AppDevice.MessageValue;
                }

            }
        }
        return rs;
    }

    async GetListProductByCampaignId(Id) {
        if (Id == 1) {
            console.log('flashdeal');
            await this.notificationService.GetListProductByCampaignId().then((rs) => {
                if (this.AppDevice.MessageType != 0) {

                    if (rs.Data != null) {
                        console.log(JSON.stringify(rs.Data));
                        this.ListHotDealByProductId = [];
                        this.ListHotDealByProductId = rs.Data;
                        this.CampaignId = rs.Data[0].CampaignId;
                        this.EndDate = new Date(rs.Data[0].DateEnd).getTime();
                        console.log('this.CampaignId', this.CampaignId);
                        this.DisablecSPChuongTrinh = false;
                    } else {
                        this.DisablecSPChuongTrinh = true;
                        this.ListHotDealByProductId = [];
                    }

                }

            });
        } else {
            await this.notificationService.GetListProductByCampaignId(Id).then((rs) => {
                if (this.AppDevice.MessageType != 0) {

                    if (rs.Data != null) {
                        console.log(JSON.stringify(rs.Data));
                        this.ListHotDealByProductId = [];
                        this.ListHotDealByProductId = rs.Data;
                        this.EndDate = new Date(rs.Data[0].DateEnd).getTime();
                        console.log(this.EndDate);
                        this.DisablecSPChuongTrinh = false;
                    } else {
                        this.DisablecSPChuongTrinh = true;
                        this.ListHotDealByProductId = [];
                    }

                }

            });
        }

    }

    async SendNotification() {

        if (this.LoaiLienKetval === "0" || typeof this.LoaiLienKetval === 'undefined') {
            toastr.error("Vui lòng chọn loại liên kết", "Lỗi dữ liệu nhập!");
            return;
        }

        var input = $('#emojitxt').val();
        this.AppDevice.Alert = input;

        //Validate info
        var jsonToPost = {};

        if (this.LoaiLienKetval == 1) { //HotDeal

            if (!this.ValidateURlBeforeSubmit()) {
                return false;
            }
            jsonToPost.PushType = this.AppDevice.DeviceOs;
            // jsonToPost.MessageType = this.AppDevice.MessageType;
            jsonToPost.MessageType = "URL";
            // jsonToPost.MessageValue = this.AppDevice.MessageValue;
            jsonToPost.MessageValue = this.AppDevice.URlvl;
            jsonToPost.Alert = this.AppDevice.Alert;
            jsonToPost.UserPushed = Lockr.get('UserInfo').Fullname;
            console.log('Link', JSON.stringify(jsonToPost));
        }

        if (this.LoaiLienKetval === "2") {

            if (this.AppDevice.MessageType === "0") {
                toastr.error('Chưa chọn chương trình', "Lỗi dữ liệu nhập!");
                return;
            }
            jsonToPost.PushType = this.AppDevice.DeviceOs;
            // jsonToPost.MessageType = this.AppDevice.MessageType;

            jsonToPost.MessageType = this.CheckMessageType();

            jsonToPost.Alert = this.AppDevice.Alert;
            jsonToPost.UserPushed = Lockr.get('UserInfo').Fullname;
            if (this.CheckMessageValue() === false) {
                return;
            } else {
                jsonToPost.MessageValue = this.CheckMessageValue();
            }

            console.log('App', JSON.stringify(jsonToPost));
        }

        this.PushProgress.IsSending = true;

        let response = await (this.notificationService.SendNotification2(jsonToPost));
        console.log("response", JSON.stringify(response));

        if (response != null) {
            if (response.Result === true) {
                toastr.success(response.Data, "Thành công");
                this.logService.InsertAdminCPLog("SendNotification", response.Result, JSON.stringify(response));
            } else {
                toastr.error(response.Data, "Lỗi");
                this.logService.InsertAdminCPLog("SendNotification", response.Result, JSON.stringify(response));
            }
        } else
            this.logService.InsertAdminCPLog("SendNotification", "Response is null!", JSON.stringify(response));
    }

    GetPushProgressInfo(applicationHistoryId) {
        this.notificationService.GetPushProgressInfo(applicationHistoryId).then((data) => {
            if (data != null) {
                this.PushProgress = data.Data;
                //console.log("PushProgress", this.PushProgress);
                if (this.PushProgress.CurrentStatus === "Success") {
                    this.PushProgress.IsSending = false;
                    this.PushProgress.Progress = 100;
                }
                this.logService.InsertAdminCPLog("GetPushProgressInfo", "true", JSON.stringify(data));
            } else {
                this.logService.InsertAdminCPLog("GetPushProgressInfo", "error", JSON.stringify(data));
            }
        });
    }

    ChangeHistory() {
        //console.log("ApplicationHistoryId", this.ApplicationHistoryId);
        this.GetPushProgressInfo(this.ApplicationHistoryId);
    }

    InitPushProgressInfo() {
        //console.log("ApplicationHistoryId", this.ApplicationHistoryId);
        this.ApplicationHistoryId = null;
        this.GetPushProgressInfo(null);
    }

    ValidateURlBeforeSubmit() {

        var strErrorMsg = "";
        if (this.AppDevice.URlvl == null || this.AppDevice.URlvl == "" || typeof this.AppDevice.URlvl === "undefined")
            strErrorMsg += "• URL phải nhập. <br/>";
        if (this.AppDevice.DeviceOs == "" || this.AppDevice.DeviceOs === "undefined")
            strErrorMsg += "• Device OS phải nhập. <br/>";
        if (this.AppDevice.Alert == null || this.AppDevice.Alert == "" || typeof this.AppDevice.Alert === "undefined")
            strErrorMsg += "• Alert phải nhập. <br/>";

        console.log("strErrorMsg", strErrorMsg);
        if (strErrorMsg !== "") {
            toastr.error(strErrorMsg, "Lỗi dữ liệu nhập!");
            return false;
        }
        return true;
    }

    ValidateInfoBeforeSubmitHotDeal() {
        var strErrorMsg = "";

        if (this.AppDevice.DeviceOs == "" || this.AppDevice.DeviceOs === "undefined")
            strErrorMsg += "• Device OS phải nhập. <br/>";
        if (this.AppDevice.Alert == null || this.AppDevice.Alert == "" || typeof this.AppDevice.Alert === "undefined")
            strErrorMsg += "• Alert phải nhập. <br/>";

        if (this.AppDevice.MessageType == null || this.AppDevice.MessageType == "" || typeof this.AppDevice.MessageType === "undefined")
            strErrorMsg += "• MessageType phải nhập. <br/>";
        console.log("strErrorMsg", strErrorMsg);
        if (strErrorMsg !== "") {
            toastr.error(strErrorMsg, "Lỗi dữ liệu nhập!");
            return false;
        }
        return true;
    }

    ValidateInfoBeforeSubmitFlashDeal() {

        var strErrorMsg = "";

        if (this.AppDevice.DeviceOs == "" || this.AppDevice.DeviceOs === "undefined")
            strErrorMsg += "• Device OS phải nhập. <br/>";
        if (this.AppDevice.Alert == null || this.AppDevice.Alert == "" || typeof this.AppDevice.Alert === "undefined")
            strErrorMsg += "• Alert phải nhập. <br/>";

        if (this.AppDevice.MessageType == null || this.AppDevice.MessageType == "" || typeof this.AppDevice.MessageType === "undefined")
            strErrorMsg += "• MessageType phải nhập. <br/>";
        if (this.AppDevice.MessageValue == null || this.AppDevice.MessageValue == "" || this.AppDevice.MessageValue == "0" || typeof this.AppDevice.MessageValue === "undefined")
            strErrorMsg += "• MessageValue phải nhập. <br/>";

        console.log("strErrorMsg", strErrorMsg);
        if (strErrorMsg !== "") {
            toastr.error(strErrorMsg, "Lỗi dữ liệu nhập!");
            return false;
        }
        return true;
    }
}