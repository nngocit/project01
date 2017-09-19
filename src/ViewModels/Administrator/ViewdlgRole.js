import { DialogController } from 'aurelia-dialog';
import { inject } from 'aurelia-dependency-injection';
import * as toastr from "toastr";
import 'select2';
import 'sweetalert';
import { UserService } from 'Services/UserSvc/UserService';
@inject(DialogController, UserService)
export class ViewdlgAction {

    Listsac = [];
    UserByCompany = [];
    ListRolesToBind = [];
    dialogController: DialogController

    constructor(dialogController, userService) {

        this.dialogController = dialogController;
        this.userService = userService;


        this.current = 1;
        this.itemperpage = 10;
        this.pagesize = 20;
        this.selectedCompany = 1;
        this.total = 0;

    }

    async activate() {
        return await Promise.all([this.userService.ListMenu(), this.userService.GetListRoles()]).then((rs) => {
            this.Listsac = rs[0].Data.filter(x => x.Loai == "ACTION" && x.ParentId != null);
            this.total = this.Listsac.length;
            this.ListRolesToBind = rs[1].Data;
            this.BindtoParentList(rs[0].Data);
        })

    }
     InitInfoAction() {
        this.isEdit = false;
        this.currentDNMenu = {};
        this.currentDNMenu.Name = "";
        this.currentDNMenu.Loai = "ACTION";
        this.currentDNMenu.Code = null;
        this.currentDNMenu.ControllerName = null;
        this.currentDNMenu.Status = "A";
        this.currentDNMenu.Parentid = "";
        this.currentDNMenu.ListRole = null;
    }
    
    BindtoParentList(array) {
        this.ListParent = array.filter(x => { if (x.ParentId == null) return { x } });
    }
    EditAction(currentDN) {
        this.IdToUpdate = null;
        this.isEdit = true;
        this.IdToUpdate = currentDN.Id;
        if (currentDN.ListRole != null && currentDN.ListRole.length > 0) {
            this.currentDNMenu.ListRole = currentDN.ListRole.split(",");

        }

        // bindingContext
        this.currentDNMenu.Name = currentDN.Name;
        this.currentDNMenu.Loai = currentDN.Loai;
        this.currentDNMenu.Code = currentDN.Code;
        this.currentDNMenu.ControllerName = currentDN.ControllerName;
        this.currentDNMenu.Status = currentDN.Status;
        this.currentDNMenu.ParentId = currentDN.ParentId;
    }
      ValidateActionBeforeSubmit() {

        var strErrorMsg = "";
        if (this.currentDNMenu.Name == "" || typeof this.currentDNMenu.Name === "undefined")
            strErrorMsg += "• Tên Action phải nhập. <br/>";
        if (this.currentDNMenu.Loai == "" || typeof this.currentDNMenu.Loai === "undefined")
            strErrorMsg += "• Loại phải nhập. <br/>";

        if (this.currentDNMenu.Code == "" || typeof this.currentDNMenu.Code === "undefined")
            strErrorMsg += "• Code phải nhập. <br/>";


        if (strErrorMsg !== "") {
            toastr.error(strErrorMsg, "Lỗi dữ liệu nhập!");
            return false;
        }
        return true;
    }
    SubmitListAction() {

        if (!this.ValidateActionBeforeSubmit()) { return false; }

        //init jsonToPost
        var jsonToPost = {};
        var jsonToUpdate = {};
        jsonToPost.Name = this.currentDNMenu.Name;
        jsonToPost.Loai = this.currentDNMenu.Loai;
        jsonToPost.Code = this.currentDNMenu.Code;
        jsonToPost.ControllerName = this.currentDNMenu.ControllerName;
        jsonToPost.Status = this.currentDNMenu.Status;
        jsonToPost.ParentId = this.currentDNMenu.ParentId;
        jsonToPost.ListRole = "";


        // format ListRolesToPost

        // insert menu
        if (this.isEdit === false) {

            if (this.currentDNMenu.ListRole != null) {
                // insert here
                for (var i = 0; i < this.currentDNMenu.ListRole.length; i++) {
                    jsonToPost.ListRole += this.currentDNMenu.ListRole[i] + ",";
                }
                jsonToPost.ListRole = jsonToPost.ListRole.substring(0, jsonToPost.ListRole.length - 1);

                swal(
                    {
                        title: "THÔNG BÁO",
                        text: `Chọn 'Thêm mới' để hệ thống xử lý`,
                        type: "info",
                        showCancelButton: true,
                        confirmButtonColor: "#5484E2",
                        confirmButtonText: "Thêm mới",
                        cancelButtonText: "Hủy bỏ",
                        closeOnConfirm: false,
                        closeOnCancel: false,
                        showLoaderOnConfirm: true
                    }, (isConfirm) => {
                        if (isConfirm) {

                            this.userService.InsertMenu(jsonToPost).then((data) => {

                                if (data.Result == true) {
                                    //Reload data
                                    this.userService.ListMenu().then((rs) => {
                                        this.Listsac = rs.Data.filter(x => x.Loai == "ACTION" && x.ParentId != null);
                                    })
                                    swal({ title: "'Quản lý Action", text: "Thêm mới Action thành công!", type: "success" }, (isConfirm) => { if (isConfirm) { } })

                                    return true;
                                } else {
                                    swal({ title: "'Quản lý Action", text: "Lỗi! Xin thử lại!", type: "error" }, (isConfirm) => { if (isConfirm) { } })

                                    return false;
                                }
                            });

                        }

                        else {
                            swal({ title: "THÔNG BÁO", text: `Hủy xử lý`, type: "warning" }, (isConfirm) => { if (isConfirm) { $('#addEditAction').modal('hide'); } })

                        }
                    });

            }

        } else {

            jsonToUpdate.ListRole = "";
            jsonToUpdate.Id = this.IdToUpdate,
                jsonToUpdate.Name = this.currentDNMenu.Name;
            jsonToUpdate.Loai = this.currentDNMenu.Loai;
            jsonToUpdate.Code = this.currentDNMenu.Code;
            jsonToUpdate.ControllerName = this.currentDNMenu.ControllerName;
            jsonToUpdate.Status = this.currentDNMenu.Status;
            jsonToUpdate.ParentId = this.currentDNMenu.ParentId;
            for (var i = 0; i < this.currentDNMenu.ListRole.length; i++) {
                jsonToUpdate.ListRole += this.currentDNMenu.ListRole[i] + ",";
            }
            jsonToUpdate.ListRole = jsonToUpdate.ListRole.substring(0, jsonToUpdate.ListRole.length - 1);



            swal(
                {
                    title: "THÔNG BÁO",
                    text: `Chọn 'Cập nhật' để hệ thống xử lý`,
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#5484E2",
                    confirmButtonText: "Cập nhật",
                    cancelButtonText: "Hủy bỏ",
                    closeOnConfirm: false,
                    closeOnCancel: false,
                    showLoaderOnConfirm: true
                }, (isConfirm) => {
                    if (isConfirm) {

                        this.userService.UpdateMenu(jsonToUpdate).then((data) => {

                            if (data.Result == true) {
                                //Reload data

                                swal({ title: "'Quản lý Action", text: "Cập nhật Action thành công!", type: "success" }, (isConfirm) => { if (isConfirm) { $('#addEditAction').modal('hide'); } })
                                this.userService.ListMenu().then((rs) => {
                                    this.Listsac = rs.Data.filter(x => x.Loai == "ACTION" && x.ParentId != null);

                                })
                                return true;
                            } else {
                                swal({ title: "'Quản lý Action", text: "Lỗi! Xin thử lại!", type: "error" }, (isConfirm) => { if (isConfirm) { $('#addEditAction').modal('hide'); } })

                                return false;
                            }
                        });

                    }

                    else {
                        swal({ title: "THÔNG BÁO", text: `Hủy xử lý`, type: "warning" }, (isConfirm) => { if (isConfirm) { $('#addEditAction').modal('hide'); } })

                    }
                });
        }

    }
}


export class FilterByNameActionValueConverter {
    toView(array, obj) {
        if (obj) {
            obj = obj.trim();
            return array
                .filter(x => ((x.Name != null) && (x.Name.toLowerCase().indexOf(obj.toLowerCase()) != -1)))
        }
        return array;
    }
}
