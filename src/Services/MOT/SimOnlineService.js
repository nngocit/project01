import * as APISettings from 'Configuration/APISettings';
import { inject, transient } from 'aurelia-framework';
import { Restsv } from 'Services/RestsvPublic';
import * as AxiosClient from 'Helpers/AxiosClient'
import { HttpServiceWebPublicApi } from 'Services/HttpService';
import 'axios';
@inject(Restsv, HttpServiceWebPublicApi)
@transient()
export class SimOnlineService {

    constructor(restsv, httpServiceWebPublicApi) {
        this.restsv = restsv;
        this.httpServiceWebPublicApi = httpServiceWebPublicApi;
    }

    GetSimSoConfig() {
        return this.restsv.GetV2(APISettings.SimSo + 'configs/', "SimOnline");
    }
    Search(query) {
        return this.restsv.GetV2(APISettings.SimSo + 'search/?' + query, "SimOnline");
    }
    UpdateInfoGuest(json) {
        return this.restsv.PutV2(APISettings.SimSo + 'updatecustomer', json, "SimOnline");
    }
    UpdateInfoOrder(json) {
        return this.restsv.PutV2(APISettings.SimSo + 'update', json, "SimOnline");
    }
    ChuyenMic(json) {
        return this.restsv.PostV2(APISettings.SimSo + 'chuyen-mic', json, "SimOnline");
    }
    HuyLenhChuyen(json) {
        return this.restsv.PutV2(APISettings.SimSo + 'huylenhchuyen', json, "SimOnline");
         
    }


}