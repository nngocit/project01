import * as APISettings from 'Configuration/APISettings';
import { inject, transient } from 'aurelia-framework';
import { HttpServicegiaodichOnline } from 'Services/HttpService';

@inject(HttpServicegiaodichOnline)
@transient()
export class DealOnlineMngService {

    constructor(httpServicegiaodichOnline) {
        this.httpServicegiaodichOnline = httpServicegiaodichOnline;
    }

    GetListAllConfig() {
        return this.httpServicegiaodichOnline.GetData(APISettings.GetAllconfig, 'get', null);
    }
    Search(json) {
        return this.httpServicegiaodichOnline.GetData(APISettings.SearchCardOrder, 'post', json);
    }
    Update(json) {
        return this.httpServicegiaodichOnline.GetData(APISettings.UpdateStatusCardOrder, 'post', json);
    }
    Sms(json) {
        return this.httpServicegiaodichOnline.GetData(APISettings.SmsCard, 'post', json);
    }

    SearchDetail(keyword) {

        var _str = `?id=` + keyword;
        return this.httpServicegiaodichOnline.GetData(APISettings.GetCardOrderDetail + _str, 'get', null);
    }
}