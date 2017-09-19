import * as APISettings from 'Configuration/APISettings';
import { inject, transient } from 'aurelia-framework';
import { HttpServiceLocalApi } from 'Services/HttpService';

@inject(HttpServiceLocalApi)
@transient()
export class PricediscountService {

    constructor(httpServiceLocalApi) {
        this.httpServiceLocalApi = httpServiceLocalApi;
    }

    SearchGiamGiaTyLe(json) {
        return this.httpServiceLocalApi.GetData(APISettings.APISearchGiamGiaTyle, 'post',json);
    }
}