import { inject } from 'aurelia-framework';
import { Config } from 'aurelia-api';
import 'fetch';
@inject(Config)
export class ServiceRest {
    constructor(config) {

        this.apilocal = config.getEndpoint('apilocal');
        this.comment = config.getEndpoint('comment');
    }
    _get(api, param) {
        console.log(JSON.stringify(api), JSON.stringify(param));
        if (param == true) {
            return this.comment.find(api);
        } else {
            return this.comment.find(api, param);
        }
    }
    _post(api, param) {

        return this.comment.post(api, param);
    }
}