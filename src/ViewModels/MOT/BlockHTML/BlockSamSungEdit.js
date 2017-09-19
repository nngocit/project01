import {
    BlockHTMLService
} from '../../../Services/BlockHTML/BlockHTMLService';
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
@inject(DialogController, BlockHTMLService)
export class BlockSamSungEdit {
    ListBanner = [];
    bn = {};
    IsEdit = false;
    disbanner = false;
    dialogController: DialogController
    constructor(dialogController, blockHTMLService) {
        this.dialogController = dialogController;
        this.blockHTMLService = blockHTMLService;

    }

    activate(dt) {

        if (dt.Id == "") {
            this.bn = {};
            this.bn = dt;
            this.IsEdit = false;
        }
        else {
            this.bn = dt;
            this.disbanner = true;
            this.IsEdit = true;
        }



        return Promise.all([
            this.blockHTMLService.GetListBanner()
        ]).then((rs) => {
            if (this.IsEdit == false) {
                this.ListBanner = rs[0].data.Data.filter(x => x.IsBlockHtml == false);
            }
            else {
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
        setTimeout(() => {
            CKEDITOR.replace('editor1', {
            });
        }, 100);

    }

    ValidateBeforeSubmit() {
        var strErrorMsg = "";
        if (this.bn.BannerModel.Id == "" || typeof this.bn.BannerModel.Id === "undefined")
            strErrorMsg += "• Vui lòng chọn Banner. <br/>";
        if (this.bn.BannerModel.Title == "" || typeof this.bn.BannerModel.Title === "undefined")
            strErrorMsg += "• Vui lòng nhập Title. <br/>";
        if (CKEDITOR.instances.editor1.getData().length == 0)
            strErrorMsg += "• Vui lòng nhập Description. <br/>";
        if (strErrorMsg !== "") {
            toastr.error(strErrorMsg, "Lỗi dữ liệu nhập!");
            return false;
        }
        return true;

    }




    update(bn) {
        var json = {
            "Description": CKEDITOR.instances.editor1.getData(),
            "BannerId": bn.BannerModel.Id,
            "Title": bn.BannerModel.Title,
            "Text1": bn.Text1,
            "Link1": bn.Link1,
            "Text2": bn.Text2,
            "Link2": bn.Link2,
            "Text3": bn.Text3,
            "Link3": bn.Link3,
            "Text4": bn.Text4,
            "Link4": bn.Link4,
            "Text5": bn.Text5,
            "Link5": bn.Link5,
            "Text6": bn.Text6,
            "Link6": bn.Link6,
            "CreatedBy": Lockr.get('UserInfo').Fullname
        }

        if (!this.ValidateBeforeSubmit()) {
            return;
        }
        else {

            swal({
                title: this.IsEdit == false ? "THÊM  MỚI BLOCK HTML" : "CHI TIẾT BLOCK HTML",
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
                    console.log(JSON.stringify(json))
                    this.blockHTMLService.PostBanner_InsertOrEditBlockHtml(json).then((rs) => {
                        if (rs.status === 200) {
                            CKEDITOR.instances.editor1.setData("");
                            swal(this.IsEdit == false ? "THÊM MỚI BLOCK HTML" : "CHI TIẾT BLOCK HTML", this.IsEdit == false ? "Thêm mới " : "Cập nhật " + "thành công");
                        }
                        else {
                            toastr.error(this.IsEdit == false ? "Thêm mới " : "Cập nhật " + "thành công", this.IsEdit == false ? "THÊM  MỚI BLOCK HTML" : "CHI TIẾT BLOCK HTML");
                        }
                    });
                } else {
                    swal({
                        title: this.IsEdit == false ? "THÊM  MỚI BLOCK HTML" : "CHI TIẾT BLOCK HTML",
                        text: `HỦY BỎ`,
                        type: "warning"
                    });
                }
            });
        }
    }
}