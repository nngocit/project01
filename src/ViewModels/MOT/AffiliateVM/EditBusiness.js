import { inject } from 'aurelia-framework';
import { BizProductsService } from 'Services/AffiliateSvc/BizProductsService';
import { LogService } from 'Services/LogService';
import * as toastr from 'toastr';
import 'eonasdan-bootstrap-datetimepicker';
import 'moment/moment';

@inject(BizProductsService,LogService)

export class EditBusiness {
    detailCampaign = {};

    constructor(bizProductsService,logService) {

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
        $('#dtBannerStartDate').datetimepicker();
        $("#dtBannerStartDate").on("dp.change", () => {
         
            this.detailCampaign.Date_start = $('#dtBannerStartDate').val();
          
        });
        $('#dtBannerEndDate').datetimepicker();
        $("#dtBannerEndDate").on("dp.change", () => {
        
            this.detailCampaign.Date_end = $('#dtBannerEndDate').val();

        });

    }
    activate(params) {


        this.bizProductsService.GetCampaignDetailById(params.businessid).then(data => {
            this.detailCampaign = data;
         
        });

    }
    backToCampaignMng() {
        window.location = "#MOTMenus/BusinessMng";
    }
    editCampaign() {

        var jsonToPost = {};

        var campaign = {};
        campaign.Business_campaign_id = this.detailCampaign.Business_campaign_id;

        campaign.Business_id = this.detailCampaign.Business_id;
        campaign.Discount_code = this.detailCampaign.Discount_code;
        campaign.Campaign_code = this.detailCampaign.Use_code;
        campaign.Name = this.detailCampaign.Name;
        campaign.Description = this.detailCampaign.Description;
        campaign.Date_start = this.detailCampaign.Date_start;
        campaign.Date_end = this.detailCampaign.Date_end;
        campaign.Position = this.detailCampaign.Position;
        campaign.Status = this.detailCampaign.Status;
        jsonToPost.Campaign = campaign;
        
        this.bizProductsService.SubmitBusinessCampaign(jsonToPost).then((data) => {
            if (data.Result == true) {
                this.logService.InsertAdminCPLog("Affiliate | Quan ly chuong trinh | editCampaign",data.Result, JSON.stringify(jsonToPost));    
                toastr.success('Tạo mới chương trình thành công!', "Chương trình");
                window.location = "#MOTMenus/BusinessMng";

                return true;
            } else {
                this.logService.InsertAdminCPLog("Affiliate | Quan ly chuong trinh | editCampaign","false", JSON.stringify(jsonToPost));    
                toastr.success('Tạo mới chương trình thất bại !');
                return false;
            }
        });

    }

}