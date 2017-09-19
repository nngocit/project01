import { inject } from 'aurelia-framework';
import { json } from 'aurelia-fetch-client';

import { BizProductsService } from 'Services/AffiliateSvc/BizProductsService';
import { UtilitiesJS } from 'Helpers/UtilitiesJS';
import { RoSanPhamAffPermission } from 'Configuration/PermissionSettings/RoSanPhamAffPermission';
import * as toastr from 'toastr';
import 'eonasdan-bootstrap-datetimepicker';
import 'trumbowyg';
import 'select2';
import 'moment';
import { LogService } from 'Services/LogService';
@inject(BizProductsService, RoSanPhamAffPermission, UtilitiesJS, LogService)
export class BizProductsMng {


    Business = [];
    BizCampaigns = [];
    BizProducts = [];

    selectedProducts = [];

    BizForm = {};
    CampaignForm = {};
    BizFormOnCampaign = {};
    pendding = true;
    get total() {
        return this.mydata.items.length;
    }

    constructor(bizProductsService, roSanPhamAffPermission, utilitiesJS, logService) {
        this.bizProductsService = bizProductsService;
        this.roSanPhamAffPermission = roSanPhamAffPermission;
        this.utilitiesJS = utilitiesJS;
        this.logService = logService;
        this.newStatus = "A";
        this.BusinessId = 0;
        this.CampaignId = 1;
        this.checkAll = false;

        //PAGINATION
        this.current = 1;
        this.itemperpage = 10;
        this.pagesize = 8;
        this.strErrorMsg = "";

        //this.filterDateStart = this.utilitiesJS.GetFormattedDate(new Date("2016-01-01"));
        //this.filterDateEnd = this.utilitiesJS.GetFormattedDate(new Date("2016-12-31"));

    }

    activate(params) {
        if (params.result) {
            if (params.result == "true") {
                this.logService.InsertAdminCPLog("Sản phẩm |Quản lý rổ sản phẩm", params.result, "Tạo mới Upload thành công!");
                toastr.success('Tạo mới Upload thành công!', "Upload");
            } else {
                this.logService.InsertAdminCPLog("Sản phẩm |Quản lý rổ sản phẩm", params.result, "Tạo mới Upload không thành công!");
                toastr.error('Tạo mới Upload không thành công!', "Upload");
            }

        }

        return Promise.all([this.bizProductsService.GetListBusiness(),
            this.bizProductsService.GetCampaignByBussinessId(null),
            this.bizProductsService.GetListBizProducts(this.CampaignId)
        ]).then((rs) => {
            this.Business = rs[0];
            //console.log('Business',this.Business);
            this.BizCampaigns = rs[1];
            //console.log('BizCampaigns',JSON.stringify(this.BizCampaigns));
            //console.log('BizCampaigns',this.BizCampaigns);
            for (var i in rs[2]) {
                rs[2][i].checked = false;


            }
            this.BizProducts = rs[2];
            //console.log('BizProducts',JSON.stringify(rs[2]));

            var username = Lockr.get('UserInfo').Roles;
            for (let i of username) {
                this.roSanPhamAffPermission.IsArray(i.Code);
            }
            this.isNoAccess = this.roSanPhamAffPermission.IsPermission();
        
        })

    }
    async syncProduct() {
        this.pendding = !this.pendding;
        let sync = await this.bizProductsService.DongboDataProduct();
        //    console.log('sync', JSON.stringify(sync));

        if (sync.Result == true) {
            this.pendding = !this.pendding;
            this.logService.InsertAdminCPLog("Sản phẩm |Quản lý rổ sản phẩm", sync.Result, "Đồng bộ sản phẩm web thành công!");
            toastr.success('Đồng bộ sản phẩm web thành công!', "QUẢN LÝ SẢN PHẨM");
        } else {
            this.pendding = !this.pendding;
            this.logService.InsertAdminCPLog("Sản phẩm |Quản lý rổ sản phẩm", sync.Result, "Đồng bộ sản phẩm web thất bại!");
            toastr.error('Đồng bộ sản phẩm web thất bại!', "QUẢN LÝ SẢN PHẨM");
        }
    }




    attached() {

        $('#select2').select2({}).on('change', () => {
            this._BusinessId = $('#select2').val();
            this.ChangeBusiness();

        });
        $('#select3').select2({}).on('change', () => {
            this._Campaign = $('#select3').val();
            this.ChangeCampaign();
        });





        $('#dtSelectedProductForEditingDateStart').datetimepicker({ format: "YYYY-MM-DD HH:mm:ss " });
        $("#dtSelectedProductForEditingDateStart").on("dp.change", () => {
            // console.log('dtBannerStartDate',$('#dtSelectedProductForEditingDateStart').val());
            this.selectedProductForEditing.DateStart = $('#dtSelectedProductForEditingDateStart').val();
            //console.log('Date_start',this.dateStart);
        });

        $('#dtSelectedProductForEditingDateEnd').datetimepicker({ format: "YYYY-MM-DD HH:mm:ss " });
        $("#dtSelectedProductForEditingDateEnd").on("dp.change", () => {
            //console.log('dtBannerStartDate',$('#dtSelectedProductForEditingDateEnd').val());
            this.selectedProductForEditing.DateEnd = $('#dtSelectedProductForEditingDateEnd').val();
            //console.log('Date_start',this.dateStart);
        });




        $('#txtFilterDateStart').datetimepicker({ format: "YYYY-MM-DD HH:mm:ss " });
        $("#txtFilterDateStart").on("dp.change", () => {
            //console.log('dtBannerEndDate',$('#dtBannerEndDate').val());
            //console.log('this.dateEnd ' , this.dateEnd.value);
            this.dateStartFilter = $('#txtFilterDateStart').val();
            //  console.log('this.dateStartFilter ' , this.dateStartFilter);

            //console.log('Date_End',this.dateEnd);
        });


        $('#txtFilterDateEnd').datetimepicker({ format: "YYYY-MM-DD HH:mm:ss " });
        $("#txtFilterDateEnd").on("dp.change", () => {
            //console.log('dtBannerEndDate',$('#dtBannerEndDate').val());
            //console.log('this.dateEnd ' , this.dateEnd.value);
            this.dateEndFilter = $('#txtFilterDateEnd').val();
            //  console.log('this.dateEndFilter ' , this.dateEndFilter);

            //console.log('Date_End',this.dateEnd);
        });



        $('#dtCampaignDateStart').datetimepicker();
        $("#dtCampaignDateStart").on("dp.change", () => {
            //console.log('dtBannerStartDate',$('#dtBannerStartDate').val());
            this.Date_start = $('#dtCampaignDateStart').val();
            //console.log('Date_start 1',this.Date_start);
        });
        $('#dtCampaignDateEnd').datetimepicker();
        $("#dtCampaignDateEnd").on("dp.change", () => {
            //console.log('dtBannerEndDate',$('#dtBannerEndDate').val());
            this.Date_End = $('#dtCampaignDateEnd').val();
            //console.log('Date_End 1',this.Date_End);
        });


        $('#PromotionDescription').trumbowyg({
            svgPath: 'images/icons.svg',
            semantic: false
        });
        //console.log('mydata',JSON.stringify(this.mydata.items));

    }



    SelectAllBizProducts() {
        if (this.checkAll === false) {
            for (var i in this.BizProducts) {
                this.BizProducts[i].checked = true;
            }
        } else {
            for (var i in this.BizProducts) {
                this.BizProducts[i].checked = false;
            }
        }
        this.checkAll = !this.checkAll;

        //console.log(this.checkAll);
    }

    ChangeBusiness() {

        this.BizCampaigns = [];
        this.bizProductsService.GetCampaignByBussinessId(this._BusinessId).then((data) => {
            this.BizCampaigns = data;
            //console.log('Business',JSON.stringify(this.BizCampaigns));
        });
    }

    ChangeCampaign() {
        this.BizProducts = [];
        this.bizProductsService.GetListBizProducts(this._Campaign).then((data) => {
            this.BizProducts = data;
            // console.log('Campaign',JSON.stringify(this.BizProducts));
        });
    }

    SubmitBusiness() {

        if (!this.ValidateBusinessBeforeSubmit()) {
            alert(this.strErrorMsg);
            return;
        }

        var jsonToPost = {};

        //Set Up Business
        this.BizForm.Business_id = 0;
        this.BizForm.Affiliate_branch_id = 0;
        this.BizForm.Date_reg = 0;
        this.BizForm.Position = 0;
        this.BizForm.Status = "A";

        jsonToPost.Business = this.BizForm;
        jsonToPost.Campaign = null;

        this.bizProductsService.SubmitBusinessCampaign(jsonToPost).then((data) => {
            if (data.Result == true) {
                this.bizProductsService.GetListBusiness().then((data) => {
                    this.Business = data;
                });
                this.logService.InsertAdminCPLog("Sản phẩm |Quản lý rổ sản phẩm", data.Result, "Tạo mới đối tác thành công!");
                toastr.success('Tạo mới đối tác thành công!', "Đối tác");
                $('#addBusiness').modal('hide');
                return true;
            } else {
                this.logService.InsertAdminCPLog("Sản phẩm |Quản lý rổ sản phẩm", data.Result, "Lỗi! Không thể tạo mới đối tác. Xin thử lại!");
                toastr.error('Lỗi! Không thể tạo mới đối tác. Xin thử lại!', "Đối tác");
                return false;
            }
        });
    }

    SubmitCampaign() {

        this.CampaignForm.Date_start = this.Date_start;
        this.CampaignForm.Date_end = this.Date_End;

        if (!this.ValidateCampaignBeforeSubmit()) {
            alert(this.strErrorMsg);
            return;
        }

        var jsonToPost = {};

        this.CampaignForm.Business_campaign_id = 0;
        this.CampaignForm.Use_code = "D";
        this.CampaignForm.Campaign_code = "";
        this.CampaignForm.Position = 0;
        this.CampaignForm.Status = "A";
        this.CampaignForm.Business_id = this.BizFormOnCampaign.Business_id;

        jsonToPost.Campaign = this.CampaignForm;
        jsonToPost.Business = this.BizFormOnCampaign;
        //console.log('Campaign', JSON.stringify(jsonToPost.Campaign));
        //console.log('Business',JSON.stringify(jsonToPost.Business));
        this.bizProductsService.SubmitBusinessCampaign(jsonToPost).then((data) => {
            if (data.Result == true) {
                //console.log('object', JSON.stringify(data));
                this.bizProductsService.GetCampaignByBussinessId(null).then((data) => {
                    this.BizCampaigns = data;
                    //console.log('BizCampaigns sadfsdf', JSON.stringify(data));
                });
                this.logService.InsertAdminCPLog("Sản phẩm |Quản lý rổ sản phẩm|Tạo mới chương trình", data.Result, JSON.stringify(jsonToPost));
                toastr.success('Tạo mới chương trình thành công!', "Chương trình");
                $('#addCampaign').modal('hide');
                return true;
            } else {
                this.logService.InsertAdminCPLog("Sản phẩm |Quản lý rổ sản phẩm|Tạo mới chương trình", data.Result, JSON.stringify(jsonToPost));
                toastr.error('Lỗi! Không thể tạo chương trình. Xin thử lại!', "Chương trình");
                return false;
            }
        });
    }

    UpdateSelectedBizProductsStatus() {
            this.selectedProducts = this.BizProducts.filter(x => x.checked == true);
            if (this.selectedProducts.length == 0) {
                toastr.warning('Please select products on below table before for changing their status!', "Update Products")
                return;
            }

            let selectedProductIds = [];
            for (var i in this.selectedProducts) {
                selectedProductIds.push(this.selectedProducts[i].Id);
                this.selectedProducts[i].Status = this.newStatus;
            }

            var jsonToPost = {};
            jsonToPost.Status = this.newStatus;
            jsonToPost.ListCampaignProduct = selectedProductIds;

            this.bizProductsService.UpdateSelectedBizProductsStatus(jsonToPost).then((data) => {
                if (data.Result == true) {
                    this.logService.InsertAdminCPLog("Sản phẩm |Quản lý rổ sản phẩm|Cập nhật danh sách", data.Result, JSON.stringify(jsonToPost));
                    toastr.success('Cập nhật danh sách thành công!', "Business Products");
                    return true;
                } else {
                    this.logService.InsertAdminCPLog("Sản phẩm |Quản lý rổ sản phẩm|Cập nhật danh sách", data.Result, JSON.stringify(jsonToPost));
                    toastr.error('Lỗi! Không thể cập nhật danh sách. Xin thử lại!', "Business Products");
                    return false;
                }
            });
        }
        //thịnh làm phần create upload file
    goToUpload() {
        location.href = '#/MOTMenus/AddUpload';
    }

    EditProduct(product) {
        //console.log("xxx", product);
        this.selectedProductForEditing = product;
        this.selectedProductForEditing.DateStart = product.DateStart;
        this.selectedProductForEditing.DateEnd = product.DateEnd;
        this.selectedProductForEditing.PromotionDescription = product.PromotionDescription;
        this.selectedProductForEditing.BusinessCampaignId = product.BusinessCampaignId;

        $('#PromotionDescription').trumbowyg('html', product.PromotionDescription);
    }

    UpdateBizProduct(selectedProductForEditing) {
        var jsonToPost = {};
        this.selectedProductForEditing.DateStart = $('#dtSelectedProductForEditingDateStart').val();
        this.selectedProductForEditing.DateEnd = $('#dtSelectedProductForEditingDateEnd').val();
        this.selectedProductForEditing.PromotionDescription = $('#PromotionDescription').trumbowyg('html');

        jsonToPost.Id = selectedProductForEditing.Id;
        jsonToPost.Status = selectedProductForEditing.Status;
        jsonToPost.StartDate = this.selectedProductForEditing.DateStart;
        jsonToPost.EndDate = this.selectedProductForEditing.DateEnd;
        jsonToPost.PromotionDescription = this.selectedProductForEditing.PromotionDescription;
        jsonToPost.DisplayType = this.selectedProductForEditing.DisplayType;
        jsonToPost.PromotionType = this.selectedProductForEditing.PromotionType;





        this.bizProductsService.UpdateBizProduct(jsonToPost).then((data) => {
            if (data.Result == true) {
                this.logService.InsertAdminCPLog("Sản phẩm |Quản lý rổ sản phẩm|Cập nhật sản phẩm", data.Result, JSON.stringify(jsonToPost));
                toastr.success('Cập nhật sản phẩm thành công!', "Product");
                $('#editProduct').modal('hide');
                return true;
            } else {
                this.logService.InsertAdminCPLog("Sản phẩm |Quản lý rổ sản phẩm|Cập nhật sản phẩm", data.Result, JSON.stringify(jsonToPost));
                toastr.error('Lỗi! Không thể cập nhật sản phẩm. Xin thử lại!', "Product");
                return false;
            }
        });
    }


    //
    UpdateBizAllProductCode(selectedProductForEditing) {
        var jsonToPost = {};

        this.selectedProductForEditing.DateStart = $('#dtSelectedProductForEditingDateStart').val();
        this.selectedProductForEditing.DateEnd = $('#dtSelectedProductForEditingDateEnd').val();
        this.selectedProductForEditing.PromotionDescription = $('#PromotionDescription').trumbowyg('html');

        jsonToPost.Id = selectedProductForEditing.Id;
        jsonToPost.Status = selectedProductForEditing.Status;
        jsonToPost.StartDate = this.selectedProductForEditing.DateStart;
        jsonToPost.EndDate = this.selectedProductForEditing.DateEnd;
        jsonToPost.PromotionDescription = this.selectedProductForEditing.PromotionDescription;
        jsonToPost.ProductCode = this.selectedProductForEditing.ProductCode;
        jsonToPost.BusinessCampaignId = this.selectedProductForEditing.BusinessCampaignId;
        jsonToPost.DisplayType = this.selectedProductForEditing.DisplayType;
        jsonToPost.PromotionType = this.selectedProductForEditing.PromotionType;
        this.bizProductsService.UpdateListCampaignProductbyProductCodes(jsonToPost).then((data) => {

            if (data.Result == true) {
                this.logService.InsertAdminCPLog("Sản phẩm |Quản lý rổ sản phẩm|Áp dụng tất cả mã code", data.Result, JSON.stringify(jsonToPost));
                toastr.success('Áp dụng tất cả mã code thành công!', "Product");
                $('#editProduct').modal('hide');
                location.reload();
                return true;

            } else {
                this.logService.InsertAdminCPLog("Sản phẩm |Quản lý rổ sản phẩm|Áp dụng tất cả mã code", data.Result, JSON.stringify(jsonToPost));
                toastr.error('Lỗi! Không thể áp dụng. Xin thử lại!', "Product");
                return false;
            }
        });
    }


    ValidateBusinessBeforeSubmit() {
        this.strErrorMsg = "";
        if (this.BizForm.Name == "" || typeof this.BizForm.Name === "undefined")
            this.strErrorMsg += "• \"Tên\" phải nhập. \n";
        if (this.BizForm.User == "" || typeof this.BizForm.User === "undefined")
            this.strErrorMsg += "• \"Người Dùng\" phải nhập. \n";
        if (this.BizForm.Pass == "" || typeof this.BizForm.Pass === "undefined")
            this.strErrorMsg += "• \"Mật Khẩu\" phải nhập. \n";
        if (this.strErrorMsg !== "")
            return false;
        return true;
    }

    ValidateCampaignBeforeSubmit() {
        this.strErrorMsg = "";
        if (this.BizFormOnCampaign.Business_id == "" || typeof this.BizFormOnCampaign.Business_id === "undefined")
            this.strErrorMsg += "• \"Business\" phải nhập. \n";
        if (this.CampaignForm.Name == "" || typeof this.CampaignForm.Name === "undefined")
            this.strErrorMsg += "• \"Tên\" phải nhập. \n";
        if (this.CampaignForm.Date_start == null || typeof this.CampaignForm.Date_start === "undefined")
            this.strErrorMsg += "• \"Ngày Bắt Đầu\" phải nhập. \n";
        if (this.CampaignForm.Date_end == null || typeof this.CampaignForm.Date_end === "undefined")
            this.strErrorMsg += "• \"Ngày Kết Thúc\" phải nhập. \n";
        if (this.strErrorMsg !== "")
            return false;
        return true;
    }
}

export class FilterByCampaignIdValueConverter {
    toView(array, obj) {
        if (obj) {
            let filteredArr = array.filter(x => x.BusinessCampaignId == obj);
            return filteredArr;
        }
        return array;
    }
}

export class FilterByIdOrCodeValueConverter {
    toView(array, obj) {
        if (obj) {
            obj = obj.trim();
            return array
                .filter(x => (((x.ProductCode != null) && (x.ProductCode.toLowerCase().indexOf(obj.toLowerCase()) != -1)) ||
                    ((x.ProductId != null) && (x.ProductId == obj)) ||
                    ((x.ProductColorCode != null) && (x.ProductColorCode.toLowerCase().indexOf(obj.toLowerCase()) != -1)) ||
                    ((x.ProductName != null) && (x.ProductName.toLowerCase().indexOf(obj.toLowerCase()) != -1))));
        }
        return array;
    }
}

export class FilterByErrorProductsValueConverter {
    toView(array, obj) {
        if (typeof obj === "undefined")
            obj = false;
        if (obj) {
            return array
                .filter(x => (x.ProductId == 0));
        }
        return array;
    }
}

export class FilterByRangeDateValueConverter {
    setDateGMT(x) {
        var a = new Date(x);
        return new Date(a.setHours(a.getHours() + a.getTimezoneOffset() / 60));
    }


    toView(array, dateStartFilter, dateEndFilter) {

        //console.log(startDate);
        //console.log(endDate);
        //convert to Unix time before compare


        var start = new Date(dateStartFilter);
        var end = new Date(dateEndFilter);

        //console.log("end",end);

        //console.log('array',JSON.stringify(array));
        if (dateStartFilter == undefined || dateEndFilter == undefined) {

            return array;
        } else if (start > end) {
            array = [];
            return array;
        } else if ((dateStartFilter != undefined && dateEndFilter != undefined) && end >= start) {


            return array.filter((x) => {
                return ((this.setDateGMT(x.DateStart) >= start) && (this.setDateGMT(x.DateEnd) <= end))
            });

        }

        return array;
    }

}