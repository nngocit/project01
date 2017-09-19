import {
    inject,
    BindingEngine
} from 'aurelia-framework';
import {
    json
} from 'aurelia-fetch-client';
import {
    LogService
} from 'Services/LogService';
import {
    BlockHTMLService
} from '../../../Services/BlockHTML/BlockHTMLService';
import {
    ThongTinKhuyenMaiEdit
} from './ThongTinKhuyenMaiEdit';
import moment from 'moment';
import 'momentrange';
import * as toastr from "toastr";
import * as jsidle from "jsidle";

import {
    DialogService
} from 'aurelia-dialog';
import _ from 'lodash';
import 'ckeditor';
@inject(DialogService, BlockHTMLService)
export class ThongTinKhuyenMai {

    ListBlockHtmlKm = [];


    constructor(dialogService, blockHTMLService) {
        this.dialogService = dialogService;
        this.blockHTMLService = blockHTMLService;
        //PAGINATION
        this.current = 1;
        this.itemperpage = 10;
        this.pagesize = 8;
    }


    activate() {
        return Promise.all([
            this.blockHTMLService.GetListBlockThongTinKM()
        ]).then((rs) => {
            this.ListBlockHtmlKm = rs[0].data.Data;
            this.total = this.ListBlockHtmlKm.length;

        });
    }

    Deleteblock(bn) {
        swal({
            title: "BLOCK HTML",
            text: `Bạn có chắc chắn muốn xóa Banner này không`,
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#5484E2",
            confirmButtonText: "ĐỒNG Ý ",
            cancelButtonText: "HỦY BỎ",
            closeOnConfirm: false,
            closeOnCancel: false,
            showLoaderOnConfirm: true
        }, (isConfirm) => {
            if (isConfirm) {

                this.blockHTMLService.ClearBanner(bn.BannerModel.Id).then((rs) => {
                    if (rs.status === 200) {
                        swal("BLOCK HTML", " Xóa banner thành công");
                    } else {
                        swal("BLOCK HTML", " Xóa banner không thành thành công");
                    }
                    this.blockHTMLService.GetListBlockHtml().then((rs) => {
                        this.ListBlockHtml = rs.data.Data;
                        this.total = this.ListBlockHtml.length;
                    });
                });
            } else {
                swal({
                    title: "BLOCK HTML",
                    text: `HỦY BỎ`,
                    type: "warning"
                });
            }
        });



    }

    ViewallKmnew() {
        var json = {
            "Id":"",
            "Title": "",
            "HtmlContent": "",
            "StartDate": "",
            "EndDate": "",
            "Position": "",
            "CampaignId": "",
            "CreateBy": Lockr.get('UserInfo').Fullname
        }
        this.dialogService.open({
            viewModel: ThongTinKhuyenMaiEdit,
            model: json

        }).then((result) => {
            if (result.wasCancelled) {
                this.blockHTMLService.GetListBlockThongTinKM().then((rs) => {
                    this.ListBlockHtmlKm = rs.data.Data;
                    this.total = this.ListBlockHtmlKm.length;
                });
            }
        });
    }

    ViewallkmEdit(it) {
        this.dialogService.open({
            viewModel: ThongTinKhuyenMaiEdit,
            model: it

        }).then((result) => {
            if (result.wasCancelled) {
              
                this.blockHTMLService.GetListBlockThongTinKM().then((rs) => {
                    this.ListBlockHtmlKm = rs.data.Data;
                    this.total = this.ListBlockHtmlKm.length;
                });
            }
        });
    }


}
export class FormatforLengthValueConverter {
    toView(cmt) {
        let tmp = "";
        tmp = _.truncate(cmt.trim(), {
            'length': 60,
            'separator': /,? +/
        });
        return tmp;
    }
}
