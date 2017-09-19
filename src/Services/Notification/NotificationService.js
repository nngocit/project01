import * as APISettings from 'Configuration/APISettings';
import { inject, transient } from 'aurelia-framework';
import { HttpServiceLocalApi } from 'Services/HttpService';
import { HttpService } from 'Services/HttpService';
import { HttpServicePushNotification } from 'Services/HttpService';
import { HttpServiceWebPublicApi } from 'Services/HttpService';
@inject(HttpServiceLocalApi, HttpService, HttpServicePushNotification, HttpServiceWebPublicApi)
@transient()
export class NotificationService {

    constructor(httpServiceLocalApi, httpService, httpServicePushNotification, httpServiceWebPublicApi) {
        this.httpServiceLocalApi = httpServiceLocalApi;
        this.httpService = httpService;
        this.httpServicePushNotification = httpServicePushNotification;
        this.httpServiceWebPublicApi = httpServiceWebPublicApi;
    }

    //get list app devices
    GetListAppDevice() {
        var data = this.httpService.GetData(APISettings.APIGetListAppDevice, 'get', null);
        //console.log(JSON.stringify(data));
        return data;
    }

    //get list app employee
    GetListAppEmployee() {
        var data = this.httpService.GetData(APISettings.APIGetListAppEmployee, 'get', null);
        return data;
    }

    SearchListAppEmployee(jsonToPost) {
       // console.log(JSON.stringify(jsonToPost));
        var data = this.httpService.GetData(APISettings.APISearchListAppEmployeeV2, 'post', jsonToPost);
        return data;
    }

    InsertNotificationLog(jsonToPost) {
        //console.log(JSON.stringify(jsonToPost));
        return this.httpService.GetData(APISettings.APIInsertNotificationLog, 'post', jsonToPost);
    }

    SendNotification(deviceOs, jsonToPost) {

        if (deviceOs == "Android") {
            var pathToApi = APISettings.LocalApiUrlBase + APISettings.APISendMesageNotiAndroid;
            var response = this.httpServiceLocalApi.GetData(APISettings.APISendMesageNotiAndroid, 'post', jsonToPost);
            console.log("response from service", response);
            return response;
        }

        if (deviceOs == "iOS") {
            var pathToApi = APISettings.LocalApiUrlBase + APISettings.APISendMesageNotiIOS;
            var response = this.httpServiceLocalApi.GetData(APISettings.APISendMesageNotiIOS, 'post', jsonToPost);
            console.log("response from service", response);
            return response;
        }
    }

    SendNotification2(jsonToPost) {


        console.log(jsonToPost);
        console.log(APISettings.Environment);
        if (APISettings.Environment === "TEST")
            return this.httpServicePushNotification.GetData(APISettings.APISendNotificationv2Test, 'post', jsonToPost);

        if (APISettings.Environment === "LIVE")
            return this.httpServicePushNotification.GetData(APISettings.APISendNotificationv2, 'post', jsonToPost);
    }

    GetPushProgressInfo(applicationHistoryId) {
        //console.log("ApplicationHistoryId from service", APISettings.APIGetPushProgressInfo + "?notificationId=" + applicationHistoryId);
        if (applicationHistoryId !== null)
            return this.httpService.GetData(APISettings.APIGetPushProgressInfo + "?nid=" + applicationHistoryId, 'get', null);
        else
            return this.httpService.GetData(APISettings.APIGetPushProgressInfo, 'get', null);
    }
    GetListCampaignForPrivateSale() {
        return this.httpServiceWebPublicApi.GetData(APISettings.GetListCampaignForPrivateSale, 'get', null);
    }
    GetListProductByCampaignId(Id) {
        return this.httpServiceWebPublicApi.GetData(APISettings.GetListProductByCampaignId + '?categoryId=' + Id + '&skip=0&take=10', 'get', null);
    }
    GetListBuAllConfig() {
        return this.httpService.GetData(APISettings.APIGetListBuAllConfig, 'get', null);
    }
}