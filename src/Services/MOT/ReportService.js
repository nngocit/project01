import * as APISettings from 'Configuration/APISettings';
import { inject, transient } from 'aurelia-framework';
import { HttpServiceLocalApi,HttpService } from 'Services/HttpService';

@inject(HttpServiceLocalApi,HttpService)
@transient()
export class ReportService {

    constructor(httpServiceLocalApi,httpService) {
        this.httpServiceLocalApi = httpServiceLocalApi;
        this.httpService=httpService;
    }

    GetReportOrderFlashDeal(jsonToPost) {
        return this.httpServiceLocalApi.GetData(APISettings.APIMOTGetReportOrderFlashDeal, 'post', jsonToPost);
    }
    GetReportPreOrder(jsonToPost) {
        console.log(jsonToPost);
        return this.httpServiceLocalApi.GetData(APISettings.APIMOTGetReportPreOrder, 'post', jsonToPost);
    }
    GetAllOrderPrivateSale(jsonToPost) {
        console.log(jsonToPost);
        return this.httpService.GetData(APISettings.APIMOTGetOrderPrivateSale,'post', jsonToPost);
    }
    GetBusinessCampainOfPrivateSale(jsonToPost) {
        console.log(jsonToPost);
        return this.httpService.GetData(APISettings.APIMOTGetOrderCamPaignBusinessPrivateSale,'get');
    }
  
}