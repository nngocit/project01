import { inject } from 'aurelia-framework';
import { BizProductsService } from 'Services/AffiliateSvc/BizProductsService';
import { LogService } from 'Services/LogService';
import * as toastr from 'toastr';
import 'eonasdan-bootstrap-datetimepicker';
import 'moment/moment';

@inject(BizProductsService, LogService)

export class AddBusiness {
    Campaign = {};
    BizFormOnCampaign = {};
    listBusiness = [];

    constructor(bizProductsService, logService) {

        this.bizProductsService = bizProductsService;
        this.current = 1;
        this.itemperpage = 10;
        this.pagesize = 8;
        this.logService = logService;

    }
    backToCampaign() {
        window.location = "#MOTMenus/BusinessMng";
    }


    attached() {
        $('#dtBannerStartDate').datetimepicker({ format: "YYYY-MM-DD HH:mm:ss " });
        $("#dtBannerStartDate").on("dp.change", () => {
            this.StartDate = $('#dtBannerStartDate').val();

        });
        $('#dtBannerEndDate').datetimepicker({ format: "YYYY-MM-DD HH:mm:ss " });
        $("#dtBannerEndDate").on("dp.change", () => {
            this.EndDate = $('#dtBannerEndDate').val();
        });

    }
    activate() {

        this.bizProductsService.GetListBusiness().then(data => {
            this.listBusiness = data;

        });


    }
    Submitcampaign() {

        var jsonToPost = {};
        this.Campaign.Business_campaign_id = 0;

        this.Campaign.Business_id = this.Business_id;
        this.Campaign.Discount_code = 0;
        this.Campaign.Campaign_code = this.Use_code;
        this.Campaign.Name = this.Name;

        this.Campaign.Description = this.Description;

        this.Campaign.Date_start = this.StartDate;
        this.Campaign.Date_end = this.EndDate;
        this.Campaign.Position = this.Position;

        this.Campaign.Status = 'A';


        jsonToPost.Campaign = this.Campaign;


        this.bizProductsService.SubmitBusinessCampaign(jsonToPost).then((data) => {
            if (data.Result == true) {
                this.logService.InsertAdminCPLog("Affiliate | Quan ly chuong trinh | AddBusinessCampaign", data.Result, JSON.stringify(jsonToPost));
                toastr.success('Tạo mới chương trình thành công!', "Chương trình");
                window.location = "#MOTMenus/BusinessMng";

                return true;
            } else {
                this.logService.InsertAdminCPLog("Affiliate | Quan ly chuong trinh | AddBusinessCampaign", "false", JSON.stringify(jsonToPost));
                toastr.success('Tạo mới đối tác thất bại !');
                return false;
            }
        });

    }

}
export class FilterBusinessIdValueConverter {
    toView(array, businessId) {

        if (businessId == "") {

            return array;
        } else if (businessId != "") {
            return array.filter(x => x.Business_id != null && x.Business_id == businessId);
        }
        return array;
    }
}