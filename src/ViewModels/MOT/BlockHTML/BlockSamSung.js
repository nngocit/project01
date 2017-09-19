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
    BlockSamSungEdit
} from './BlockSamSungEdit';
import moment from 'moment';
import 'momentrange';
import * as toastr from "toastr";
import * as jsidle from "jsidle";

import {
    DialogService
} from 'aurelia-dialog';
import _ from 'lodash';

@inject(DialogService, BlockHTMLService)
export class BlockSamSung {

    ListBlockHtml = [];


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
            this.blockHTMLService.GetListBlockHtml()
        ]).then((rs) => {
            this.ListBlockHtml = rs[0].data.Data;
            this.total = this.ListBlockHtml.length;

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


    Viewallnew() {
        var json = {
            "Id": "",
            "Description": "",
            "BannerId": "",
            "Title": "",
            "Text1": "",
            "Link1": "",
            "Text2": "",
            "Link2": "",
            "Text3": "",
            "Link3": "",
            "Text4": "",
            "Link4": "",
            "Text5": "",
            "Link5": "",
            "Text6": "",
            "Link6": "",
            "CreatedBy": Lockr.get('UserInfo').Fullname
        }
        this.dialogService.open({
            viewModel: BlockSamSungEdit,
            model: json

        }).then((result) => {
            if (result.wasCancelled) {
                this.blockHTMLService.GetListBlockHtml().then((rs) => {
                    this.ListBlockHtml = rs.data.Data;
                    this.total = this.ListBlockHtml.length;
                });
            }
        });
    }

    Viewalledit(it) {
        this.dialogService.open({
            viewModel: BlockSamSungEdit,
            model: it

        }).then((result) => {
            if (result.wasCancelled) {
                this.blockHTMLService.GetListBlockHtml().then((rs) => {
                    this.ListBlockHtml = rs.data.Data;
                    this.total = this.ListBlockHtml.length;
                });
            }
        });
    }


}

export class FormatContentforLengthValueConverter {
    toView(cmt) {
        let tmp = "";
        tmp = _.truncate(cmt.trim(), {
            'length': 30,
            'separator': /,? +/
        });
        return tmp;
    }
}