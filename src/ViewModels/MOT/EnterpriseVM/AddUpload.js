import { inject } from 'aurelia-framework';

import { EnterpriseService } from 'Services/EnterpriseSvc/EnterpriseService';

import * as toastr from 'toastr';
import 'eonasdan-bootstrap-datetimepicker';

@inject(EnterpriseService)

export class AddUpload {
    campaign = [];
    business = [];
    _Check = false;
    constructor(enterpriseService) {

        this.enterpriseService = enterpriseService;

    }
    goToBack() {
        window.location = "#MOTMenus/ProductsMngF";
    }
    backToUpload() {
        if (this.file != null) {
            window.location = "#MOTMenus/ProductsMngF";
            alert('upload file thành công');
        } else {
            alert('upload file thất bại');
        }

    }

    attached() {

        $('#startDate').datetimepicker({format: "YYYY-MM-DD HH:mm:ss"});
        $("#startDate").on("dp.change", () => {});
        $('#endDate').datetimepicker({format: "YYYY-MM-DD HH:mm:ss "});
        $("#endDate").on("dp.change", () => {});
        this.businessId = $('.selectpicker').selectpicker('val');

    }


    activate() {
        return Promise.all([this.enterpriseService.GetListCompany()]).then(rs => { this.campaign = rs[0].Data; });
    }

}