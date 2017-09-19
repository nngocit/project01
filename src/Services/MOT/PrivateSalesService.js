import * as APISettings from 'Configuration/APISettings';
import { inject, transient } from 'aurelia-framework';
import { Restsv } from 'Services/RestsvPublic';
import * as AxiosClient from 'Helpers/AxiosClient'

import 'axios';
@inject(Restsv)
@transient()
export class PrivateSalesService {

    constructor(restsv) {
        this.restsv = restsv;
     
    }

    privatesalesSearch(query) {
        return this.restsv.GetV2(APISettings.privateSales + '/search?' + query, "Admincp");
    }
    updatethele(json) {
        return this.restsv.PutV2(APISettings.privateSales + '/updatethele', json, "Admincp");
    }
    update(json) {
        return this.restsv.PutV2(APISettings.privateSales + '/update', json, "Admincp");
    }
    listsanpham(query) {
        return this.restsv.GetV2(APISettings.privateSales + '/GetListProductofBusinessCampaign?bussinessCampaignId='+ query, "Admincp");
    }
    listkhunghio(query) {
        return this.restsv.GetV2(APISettings.privateSales + '/GetByFrameTimes?saleid='+ query, "Admincp");
    }
    update(json) {
        return this.restsv.PutV2(APISettings.privateSales + '/update', json, "Admincp");
    }
    UpdateFrameTime(json) {
        return this.restsv.PutV2(APISettings.privateSales + '/UpdateFrameTime', json, "Admincp");
    }
    DeleteFrameTime(json) {
        return this.restsv.PutV2(APISettings.privateSales + '/UpdateFrameTime', json, "Admincp");
    }
    InsertFrameTime(json) {
        return this.restsv.PostV2(APISettings.privateSales + '/CreateFrameTime', json, "Admincp");
    }
    GetallkhunggioSP(idsp,idkg) {
        return this.restsv.GetV2(APISettings.privateSales + '/GetAllBusinessCampainProductNotContainerKhungGioSanPham?bussinessCampaignId='+ idsp+'&khunggioId='+idkg, "Admincp");
    }
    GetallSP(idkg) {
        return this.restsv.GetV2(APISettings.privateSales + '/GetAllProduct?khunggioId='+ idkg, "Admincp");
    }
    CreateSp(json) {
        return this.restsv.PostV2(APISettings.privateSales + '/CreateProduct', json, "Admincp");
    }
    DeleteSp(json) {
        return this.restsv.PutV2(APISettings.privateSales + '/UpdateProduct', json, "Admincp");
    }
    UpdateProduct(json) {
        return this.restsv.PutV2(APISettings.privateSales + '/UpdateProduct', json, "Admincp");
    }

}