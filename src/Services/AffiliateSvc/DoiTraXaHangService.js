import * as APISettings from 'Configuration/APISettings';
import { inject, transient } from 'aurelia-framework';
import { Restsv } from 'Services/RestsvPublic';
import * as AxiosClient from 'Helpers/AxiosClient'
import 'axios';
@inject(Restsv)
@transient()
export class DoiTraXaHangService {


    constructor(restsv) {

        this.restsv = restsv;
    }
    Getlistxahangconfig(username) {
        return this.restsv.GetV2(APISettings.GetConfigXahang+'?accountCtrix='+username,"Gdonline");
    }
    Getlistxahangsearch(query) {
        return this.restsv.GetV2(APISettings.GetSearchXahang + query,"Gdonline");
    }
     ReportXahang(query) {
      
        return this.restsv.GetV2(APISettings.ReportXahang +'?'+ query,"Gdonline");
    }
    PostxahangUpdateImage(json) {
        return this.restsv.PostV2(APISettings.UpdateImageSearchXahang, json,"Gdonline");
    }

    Putthongtinxahang(json) {
        return this.restsv.PutV2(APISettings.UpdateChiTietXaHang+json.XahangId, json,"Gdonline");
    }

}