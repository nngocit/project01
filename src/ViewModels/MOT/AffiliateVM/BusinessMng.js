import { inject } from 'aurelia-framework';
import { BizProductsService } from 'services/AffiliateSvc/BizProductsService';
import { LogService } from 'Services/LogService';
import * as toastr from "toastr";



@inject(BizProductsService,LogService)

export class BusinessMng {
    campaign = [];
    listBusiness = [];
    CampaignMng = {};
    campaigns = [];

    constructor(bizProductsService,logService) {

        this.bizProductsService = bizProductsService;
        this.current = 1;
        this.itemperpage = 10;
        this.pagesize = 8;
        this.logService = logService;

    }
    bind(ct, ovr) {
        if (this.campaigns != null)
            ovr.bindingContext.total = this.campaigns.length;
    }





    activate() {
        return Promise.all([
            this.bizProductsService.GetBusiness().then(data => {
                this.campaign = data;
           
            }),

            this.bizProductsService.GetCampaigns().then(data => {
                this.campaigns = data;

            }),

            this.bizProductsService.GetListBusiness().then(data => {
                this.listBusiness = data;


            })
        ]);




    }

    addCampaign() {
        location.href = `#/MOTMenus/AddBusiness`;
    }
    editToCampaign(item) {
        
        window.location = `#/MOTMenus/EditBusiness?businessid=${item.Business_campaign_id}`;
        this.bizProductsService.GetCampaignDetailById(item.Business_campaign_id).then(data => {
            this.detailCampaign = data;
          
        });
    }
    deleteCampaign(item) {
        item.Status = 'D';
      
        var json = {};
        var deleteCampaign = {};
        deleteCampaign.Business_id = item.Business_id;
        
        json.campaign = item;
      
        this.bizProductsService.SubmitBusinessCampaign(json).then((data) => {
            if (data.Result == true) {
                this.logService.InsertAdminCPLog("Affiliate | Quan ly chuong trinh | deleteCampaign",data.Result, JSON.stringify(json));
                toastr.success('Xóa chương trình thành công!', "Chương trình");
             
            } else {
                this.logService.InsertAdminCPLog("Affiliate | Quan ly chuong trinh | deleteCampaign","false", JSON.stringify(json));
                toastr.success('Không xóa chương trình thành công!', "Chương trình");;
            }
        });
    }

}


export class FilterBusinessValueConverter {
    toView(array, obj) {
        if (obj) {
            let filteredArr = array.filter(x => x.Business_id == obj);
            return filteredArr;
        }
        return array;
    }
}