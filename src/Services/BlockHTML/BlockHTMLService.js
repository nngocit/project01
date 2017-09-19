import * as APISettings from 'Configuration/APISettings';
import { inject, transient } from 'aurelia-framework';
import { Restsv } from 'Services/RestsvPublic';
import 'axios';
@inject(Restsv)
@transient()
export class BlockHTMLService {


    constructor(restsv) {

        this.restsv = restsv;
    }
    GetListBlockHtml() {
        return this.restsv.GetV2(APISettings.GetListBlockHtmlByCampainName + "?campaignName=CHUYENTRANG_SAMSUNG", "vnpost");
    }

    GetListBanner() {
        return this.restsv.GetV2(APISettings.GetListBanner + "?campaignName=CHUYENTRANG_SAMSUNG", "vnpost");
    }
    ClearBanner(Id) {
        return this.restsv.GetV2(APISettings.Bannerdelete + "?bannerId=" + Id, "vnpost");
    }
    GetListBlockThongTinKM() {
        return this.restsv.GetV2(APISettings.GetListBlockThongTinKM, "vnpost");
    }


    PostBanner_InsertOrEditBlockHtml(json) {
        return this.restsv.PostV2(APISettings.Banner_InsertOrEditBlockHtml, json, "vnpost");
    }
    PostBanner_InsertOrUpdateBlockHtmlThongTinKhuyenMai(json) {
        return this.restsv.PostV2(APISettings.InsertOrUpdateBlockHtmlThongTinKhuyenMai, json, "vnpost");
    }




}