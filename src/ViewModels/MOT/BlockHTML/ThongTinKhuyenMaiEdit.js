import {
    BlockHTMLService
} from '../../../Services/BlockHTML/BlockHTMLService';
import { BizProductsService } from '../../../Services/AffiliateSvc/BizProductsService';
import { BannerService } from '../../../Services/AffiliateSvc/BannerService';
import {
    DialogController
} from 'aurelia-dialog';
import {
    inject
} from 'aurelia-dependency-injection';
import * as toastr from "toastr";
import 'select2';
import 'sweetalert';
import 'trumbowyg';
import 'sweetalert';
import 'ckeditor';
import 'eonasdan-bootstrap-datetimepicker';
@inject(DialogController, BlockHTMLService, BizProductsService, BannerService)
export class ThongTinKhuyenMaiEdit {
    ListBanner = [];
    BizCampaigns = [];
    Positions = [];
    tt = {};
    IsEdit = false;
    disbanner = false;
    dialogController: DialogController
    constructor(dialogController, blockHTMLService, bizProductsService, bannerService) {
        this.dialogController = dialogController;
        this.blockHTMLService = blockHTMLService;
        this.bizProductsService = bizProductsService;
        this.bannerService = bannerService;
    }

    activate(dt) {

        if (dt.Id == "") {
            this.tt = {};
            this.tt = dt;
            this.IsEdit = false;
           
            this.Status = "A";
        }
        else {
            this.tt = dt;
            this.disbanner = false;
            this.IsEdit = true;
            this.tt.Status == "D" ? this.Status = false : this.Status = true;


        }



        return Promise.all([
            this.blockHTMLService.GetListBanner(), this.bannerService.GetBannerPositions()
        ]).then((rs) => {
            if (this.IsEdit == false) {
                this.ChangeBusiness();
                this.Positions = rs[1];
                this.ListBanner = rs[0].data.Data.filter(x => x.IsBlockHtml == false);
            }
            else {
                this.ChangeBusiness();
                this.Positions = rs[1];
                this.ListBanner = rs[0].data.Data;
            }
        });
    }
    get getTieuDe() {
        switch (this.IsEdit) {
            case false:
                return "THÊM MỚI";

            default:
                return "CẬP NHẬT";
        }
    }
    attached() {
        // setTimeout(() => {
        //     CKEDITOR.replace('editor1', {
                
        //     });
        // }, 100);
        	CKEDITOR.replace( 'editor1', {
			height: 300,
			extraPlugins: 'colorbutton,colordialog'
			
		} );
        $('#txtFilterDateStart').datetimepicker({
            format: "YYYY-MM-DD HH:mm:ss "
        });

        $("#txtFilterDateStart").on("dp.change", () => {
            this.dateStartFilter = $('#txtFilterDateStart').val();
        });

        $('#txtFilterDateEnd').datetimepicker({
            format: "YYYY-MM-DD HH:mm:ss "
        });

        $("#txtFilterDateEnd").on("dp.change", () => {
            this.dateEndFilter = $('#txtFilterDateEnd').val();
        });

    }
    ChangeBusiness() {
        this.BizCampaigns = [];
        this.bizProductsService.GetCampaignByBussinessId(9).then((data) => {
            if (data != null) {
                this.BizCampaigns = data;

            }
        });
    }
    CheckDatetime() {
        if (($('#txtFilterDateStart').val() === '') && ($('#txtFilterDateEnd').val() === '')) {
            return 1; // two null 
        }
        if (($('#txtFilterDateStart').val() !== '') && ($('#txtFilterDateEnd').val() === '')) {
            return 2; // two null
        }
        if (($('#txtFilterDateStart').val() === '') && ($('#txtFilterDateEnd').val() !== '')) {
            return 3; // two null
        }
    }

    ValidateBeforeSubmit() {
        var strErrorMsg = "";
        if (this.tt.Title == "" || typeof this.tt.Title === "undefined")
            strErrorMsg += "• Vui lòng nhập Title. <br/>";
        if (CKEDITOR.instances.editor1.getData().length == 0)
            strErrorMsg += "• Vui lòng nhập nội dung HTML. <br/>";
        if (this.tt.CampaignId == "" || typeof this.tt.CampaignId === "undefined")
            strErrorMsg += "• Vui lòng chọn chương trình. <br/>";
        if (this.tt.Position == "" || typeof this.tt.Position === "undefined")
            strErrorMsg += "• Vui lòng chọn vị trí. <br/>";

        if (strErrorMsg !== "") {
            toastr.error(strErrorMsg, "Lỗi dữ liệu nhập!");
            return false;
        }
        return true;

    }




    update(tt) {
        var startDate = $('#txtFilterDateStart').val();
        var endDate = $('#txtFilterDateEnd').val();

        switch (this.CheckDatetime()) {
            case 1:
                toastr.error("Thời gian bắt đầu và thời gian kết thúc chưa được chọn. Vui lòng chọn lại.", "QUẢN LÝ USER");
                return;

            case 2:
                toastr.error("Thời gian kết thúc chưa được chọn. Vui lòng chọn lại.", "QUẢN LÝ USER");
                return;
            case 3:
                toastr.error("Thời gian bắt đầu chưa được chọn. Vui lòng chọn lại.", "QUẢN LÝ USER");
                return;

        }
        if (startDate > endDate) {
            toastr.warning("Thời gian bắt đầu > thời gian kết thúc. Vui lòng chọn lại.", "QUẢN LÝ USER");
            return;
        }

        var json = {

            "Title": tt.Title,
            "HtmlContent": CKEDITOR.instances.editor1.getData(),
            "StartDate": $('#txtFilterDateStart').val(),
            "EndDate": $('#txtFilterDateEnd').val(),
            "Position": tt.Position,
            "CampaignId": tt.CampaignId,
            "CreateBy": Lockr.get('UserInfo').Fullname,
            "Status": this.Status == false ? "D" : "A"

        }
        if (this.IsEdit !== false) {
            json.Id = tt.Id;
        }


        if (!this.ValidateBeforeSubmit()) {
            return;
        }
        else {
          
            swal({
                title: this.IsEdit == false ? "THÊM MỚI THÔNG TIN KHUYẾN MÃI" : "CHI TIẾT THÔNG TIN KHUYẾN MÃI",
                text: this.IsEdit == false ? `Bạn có chắc chắn muốn thêm mới không` : `Bạn có chắc chắn muốn cập nhật không`,
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#5484E2",
                confirmButtonText: this.IsEdit == false ? "LƯU" : "CẬP NHẬT",
                cancelButtonText: "HỦY BỎ",
                closeOnConfirm: false,
                closeOnCancel: false,
                showLoaderOnConfirm: true
            }, (isConfirm) => {
                if (isConfirm) {

                    this.blockHTMLService.PostBanner_InsertOrUpdateBlockHtmlThongTinKhuyenMai(json).then((rs) => {
                        if (rs.status === 200) {

                            swal(this.IsEdit == false ? "THÊM MỚI THÔNG TIN KHUYẾN MÃI" : "CHI TIẾT THÔNG TIN KHUYẾN MÃI", this.IsEdit == false ? "Thêm mới " : "Cập nhật " + "thành công");
                        }
                        else {
                            toastr.error(this.IsEdit == false ? "Thêm mới " : "Cập nhật " + "thành công", this.IsEdit == false ? "THÊM MỚI THÔNG TIN KHUYẾN MÃI" : "CHI TIẾT THÔNG TIN KHUYẾN MÃI");
                        }
                    });
                } else {
                    swal({
                        title: this.IsEdit == false ? "THÊM MỚI THÔNG TIN KHUYẾN MÃI" : "CHI TIẾT BLOCK HTML",
                        text: `HỦY BỎ`,
                        type: "warning"
                    });
                }
            });
        }
    }
}