import * as APISettings from 'Configuration/APISettings';
import { HttpService } from 'Services/HttpService';
import { inject, transient } from 'aurelia-framework';
import { json } from 'aurelia-fetch-client';

@inject(HttpService)
@transient()
export class LogService {

    constructor(httpService) {
        this.httpService = httpService;
    }

    InsertAdminCPLog(_function, _errorMessage, _result) {
        var jsonLog = {};
        try {
            jsonLog.User = Lockr.get('UserInfo').Username;
        } catch (err) {
            jsonLog.User = err;
        }
        jsonLog.Function = _function;
        jsonLog.ErrorMessage = _errorMessage;
        jsonLog.Result = _result;

        return this.httpService.GetData(APISettings.APIInsertAdminCpLog, 'post', jsonLog);
    }
}