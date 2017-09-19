import * as APISettings from 'Configuration/APISettings';
import { inject, transient } from 'aurelia-framework';
import { HttpServiceLocalApi } from 'Services/HttpService';

@inject(HttpServiceLocalApi)
@transient()
export class ComboService {

    constructor(httpServiceLocalApi) {
        this.httpServiceLocalApi = httpServiceLocalApi;
    }

    SearchCombo(json) {
        return this.httpServiceLocalApi.GetData(APISettings.APISearchCombo, 'post',json);
    }
}