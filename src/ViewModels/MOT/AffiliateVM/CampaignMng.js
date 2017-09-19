import { inject } from 'aurelia-framework';
import { BizProductsService } from 'Services/AffiliateSvc/BizProductsService';
import { LogService } from 'Services/LogService';
import * as toastr from "toastr";
import 'select2';
import 'trumbowyg';

@inject(BizProductsService,LogService)

export class CampaignMng {

    business = [];
    listBusiness = [];
    constructor(bizProductsService,logService) {

        this.bizProductsService = bizProductsService;
        this.current = 1;
        this.itemperpage = 10;
        this.pagesize = 8;
        this.logService = logService;
    }

    bind(ct, ovr) {
        if (this.business != null)
            ovr.bindingContext.total = this.business.length;
    }




    activate() {
        return Promise.all([
            this.bizProductsService.GetListBusiness().then(data => {
                this.listBusiness = data;
            }),
            this.bizProductsService.GetBusiness().then(data => {
                this.business = data;
               
            })
        ]);




    }
    addBusiness() {
        location.href = `#/MOTMenus/AddCampaign`;
    }
    editToBusiness(item) {
      
        location.href = `#/MOTMenus/EditCampaign?campaignid=${item.Business_id}`;
    }
    deleteBusiness(item) {
        item.Status = 'D';

     
        var json = {};
        json.Business = item;
        this.bizProductsService.SubmitBusinessCampaign(json).then((data) => {
            if (data.Result == true) {
                this.logService.InsertAdminCPLog("Affiliate | Quan ly doi Tac | DelBusiness",data.Result, JSON.stringify(json));
                toastr.success('Xóa thành công!', "Chương trình");
             
            } else {
                this.logService.InsertAdminCPLog("Affiliate | Quan ly doi Tac | DelBusiness","false", JSON.stringify(json));
                toastr.success('Không thành công!', "Chương trình");;
            }
        });
    }

}


export class FilterBusinessValueConverter {
    toView(array, businessId) {
        //console.log('businessId',businessId);
        if (businessId == "") {
            return array;
            // console.log('array loc', JSON.stringify(array));
        } else {
            return array.filter(x => x.Business_id == businessId);

        }
        return array;

    }
}