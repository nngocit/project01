import { inject } from 'aurelia-framework';
import { json } from 'aurelia-fetch-client';
import { UserService } from 'Services/UserSvc/UserService';
import 'sweetalert';
import 'select2';
import * as toastr from 'toastr';
import 'eonasdan-bootstrap-datetimepicker';
import { DialogService } from 'aurelia-dialog';
import { ViewdlgUser } from './ViewdlgUser';
import { ViewdlgAction } from './ViewdlgAction';
@inject(UserService, DialogService)
export class RolesMenu {
    ListRolesToBind = [];
    ListPages = [];
    ListDN3 = [];
    Listactions = [];
    ListParent = [];
    UserByCompany = [];
    Companies = [];
    IdToUpdate;

    constructor(userService, dialogService) {
        this.userService = userService;
        this.dialogService = dialogService;


        this.current = 1;
        this.itemperpage = 5;
        this.pagesize = 20;

        this.current1 = 1;
        this.itemperpage1 = 10;
        this.pagesize1 = 20;



    }

    activate() {

        return Promise.all([this.userService.ListMenu(),
            this.userService.GetListRoles(),
            this.userService.GetListCompanies(),
            this.userService.GetListUserByCompanyIdPassed(this.selectedCompany)
        ]).then((rs) => {
            for (var i in rs[0].Data) {
                rs[0].Data[i].Status = rs[0].Data[i].Status.trim();

            }
            console.log('test', rs[0].Data.filter(x => x.Loai == "MENU" && x.ParentId != null).length)
            this.ListPages = rs[0].Data.filter(x => x.Loai == "MENU" && x.ParentId != null);

            this.ListDN3 = rs[0].Data.filter(x => { if (x.ParentId == null) return { x } });
            this.total = "30";

            console.log('role', JSON.stringify(rs[0].Data));
            this.Listactions = rs[0].Data.filter(x => x.Loai == "ACTION" && x.ParentId != null);
            this.ListRolesToBind = rs[1].Data;
            this.BindtoParentList(rs[0].Data);
            this.Companies = rs[2].Data;
            this.UserByCompany = rs[3].Data;

        })


    }

    // bind(ct, ovr) {
    //     console.log('a',ovr.bindingContext);
    // }


    BindtoParentList(array) {
        this.ListParent = array.filter(x => { if (x.ParentId == null) return { x } });
    }


    attached() {

        $('#filterByCompany').select2().val(this.filterCompany);
        $('#filterByCompany').select2({
            placeholder: "- Chọn Đơn vị -",
            allowClear: true
        }).on('change', () => {
            this.filterCompany = $('#filterByCompany').val();
        });
    }

    AddRole() {
        this.isEdit = false;
        this.InitInfoRole();
    }
    AddMenu() {
        this.isEdit = false;
        this.InitInfoMenu();
    }



    EditMenu(currentDN) {
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

    EditMenuLevel1(currentDN) {
        console.log(this.isEdit);
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



    SubmitRole() {
        var jsonToPost = {};

        this.selectedUserForEditing.Birthday = $('#dtSelectedUserForEditingBirthday').val();

        jsonToPost.RoleIds = [];
        if (this.isEdit === false) {
            jsonToPost.UserId = null;
            jsonToPost.CreateDate = this.utilitiesJS.GetFormattedDate(new Date());
            jsonToPost.Password = this.selectedUserForEditing.Password;
        } else {
            jsonToPost.UserId = this.selectedUserForEditing.UserId;
            if (this.selectedUserForEditing.SelectedRoleIds.length > 0) {
                for (var i = 0; i < this.selectedUserForEditing.SelectedRoleIds.length; i++) {
                    jsonToPost.RoleIds.push({
                        "RoleId": this.selectedUserForEditing.SelectedRoleIds[i]
                    });
                }
            }
        }

        jsonToPost.Birthday = this.selectedUserForEditing.Birthday

        jsonToPost.UserName = this.selectedUserForEditing.UserName;
        jsonToPost.Email = this.selectedUserForEditing.Email;
        jsonToPost.FullName = this.selectedUserForEditing.FullName;
        jsonToPost.Phone = this.selectedUserForEditing.Phone;
        jsonToPost.PersonalId = this.selectedUserForEditing.PersonalId;
        jsonToPost.CompanyId = this.selectedUserForEditing.CompanyId;
        jsonToPost.Status = this.selectedUserForEditing.Status;
        jsonToPost.EmployeeId = this.selectedUserForEditing.EmployeeId;

        this.userService.SubmitUser(jsonToPost).then((data) => {
            if (data.Result == true) {
                this.userService.GetListUserByCompanyIdPassed(this.selectedCompany).then((data) => {
                    this.UserByCompany = data.Data;
                });
                $('#addEditUser').modal('hide');
                toastr.success(this.isEdit === false ? 'Tạo mới user thành công!' : 'Cập nhật user thành công!', "Thông báo");
                return true;
            } else {
                toastr.error(data.Message, "Lỗi");
                return false;
            }
        });

    }

    SubmitListAction() {

        if (!this.ValidateMenuBeforeSubmit()) { return false; }

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

                swal({
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
                                    this.Listactions = rs.Data.filter(x => x.Loai == "ACTION" && x.ParentId != null);
                                })
                                swal({ title: "'Quản lý Action", text: "Thêm mới Action thành công!", type: "success" }, (isConfirm) => { if (isConfirm) {} })

                                return true;
                            } else {
                                swal({ title: "'Quản lý Action", text: "Lỗi! Xin thử lại!", type: "error" }, (isConfirm) => { if (isConfirm) {} })

                                return false;
                            }
                        });

                    } else {
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



            swal({
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
                                this.Listactions = rs.Data.filter(x => x.Loai == "ACTION" && x.ParentId != null);

                            })
                            return true;
                        } else {
                            swal({ title: "'Quản lý Action", text: "Lỗi! Xin thử lại!", type: "error" }, (isConfirm) => { if (isConfirm) { $('#addEditAction').modal('hide'); } })

                            return false;
                        }
                    });

                } else {
                    swal({ title: "THÔNG BÁO", text: `Hủy xử lý`, type: "warning" }, (isConfirm) => { if (isConfirm) { $('#addEditAction').modal('hide'); } })

                }
            });
        }

    }
    SubmitListMenu() {

        if (!this.ValidateMenuBeforeSubmit()) { return false; }

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

        // insert menu
        if (this.isEdit === false) {

            if (this.currentDNMenu.ListRole != null) {
                // insert here
                for (var i = 0; i < this.currentDNMenu.ListRole.length; i++) {
                    jsonToPost.ListRole += this.currentDNMenu.ListRole[i] + ",";
                }
                jsonToPost.ListRole = jsonToPost.ListRole.substring(0, jsonToPost.ListRole.length - 1);



                // insert menu
                this.userService.InsertMenu(jsonToPost).then((data) => {
                    if (data.Result == true) {

                        $('#addEditMenuLvl1').modal('hide');
                        swal({ title: "'Quản lý Menu", text: "Thêm mới Menu thành công!", type: "success" }, (isConfirm) => { if (isConfirm) { $('#addEditMenuLvl1').modal('hide'); } })
                        this.userService.ListMenu().then((data) => {
                            this.ListDN3 = rs.Data.filter(x => { if (x.ParentId == null) return { x } });
                        });
                        return true;
                    } else {
                        swal({ title: "'Quản lý Menu", text: "Lỗi! Xin thử lại!", type: "error" });
                        return false;
                    }
                });

            } else {
                swal({ title: "'Quản lý Menu", text: "Vui lòng chọn Role", type: "warning" });
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


            swal({
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

                            swal({ title: "'Quản lý Menu", text: "Cập nhật Menu thành công!", type: "success" }, (isConfirm) => { if (isConfirm) { $('#addEditMenuLvl1').modal('hide'); } })
                            this.userService.ListMenu().then((rs) => {
                                this.ListDN3 = rs.Data.filter(x => { if (x.ParentId == null) return { x } });
                            })
                            return true;
                        } else {
                            swal({ title: "'Quản lý Menu", text: "Lỗi! Xin thử lại!", type: "error" }, (isConfirm) => { if (isConfirm) { $('#addEditMenuLvl1').modal('hide'); } })

                            return false;
                        }
                    });

                } else {
                    swal({ title: "THÔNG BÁO", text: `Hủy xử lý`, type: "warning" }, (isConfirm) => { if (isConfirm) { $('#addEditMenuLvl1').modal('hide'); } })

                }
            });
        }
    }

    SubmitListPage() {

        if (!this.ValidateMenuBeforeSubmit()) { return false; }

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

        // insert menu
        if (this.isEditAction === false) {

            if (this.currentDNMenu.ListRole != null) {
                // insert here
                for (var i = 0; i < this.currentDNMenu.ListRole.length; i++) {
                    jsonToPost.ListRole += this.currentDNMenu.ListRole[i] + ",";
                }
                jsonToPost.ListRole = jsonToPost.ListRole.substring(0, jsonToPost.ListRole.length - 1);



                // insert menu
                this.userService.InsertMenu(jsonToPost).then((data) => {
                    if (data.Result == true) {

                        $('#addEditPage').modal('hide');
                        swal({ title: "'Quản lý Page", text: "Thêm mới  Page thành công!", type: "success" }, (isConfirm) => { if (isConfirm) { $('#addEditPage').modal('hide'); } })
                        this.userService.ListMenu().then((data) => {
                            this.ListPages = data.Data.filter(x => x.Loai == "MENU" && x.ParentId != null);
                        });
                        return true;
                    } else {
                        swal({ title: "'Quản lý Page", text: "Lỗi! Xin thử lại!", type: "error" });
                        return false;
                    }
                });

            } else {
                swal({ title: "'Quản lý Page", text: "Vui lòng chọn Role", type: "warning" });
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


            swal({
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

                            swal({ title: "'Quản lý Page", text: "Cập nhật Page thành công!", type: "success" }, (isConfirm) => { if (isConfirm) { $('#addEditPage').modal('hide'); } })
                            this.userService.ListMenu().then((rs) => {
                                this.ListPages = rs.Data.filter(x => x.Loai == "MENU" && x.ParentId != null);
                            })
                            return true;
                        } else {
                            swal({ title: "'Quản lý Page", text: "Lỗi! Xin thử lại!", type: "error" }, (isConfirm) => { if (isConfirm) { $('#addEditPage').modal('hide'); } })

                            return false;
                        }
                    });

                } else {
                    swal({ title: "THÔNG BÁO", text: `Hủy xử lý`, type: "warning" }, (isConfirm) => { if (isConfirm) { $('#addEditPage').modal('hide'); } })

                }
            });
        }
    }


    GetUserSeletedRoleIds(user) {
        this.currentDNMenu.ListRole = [];
        if (user.RoleIds != null && user.RoleIds.length > 0) {
            for (var i = 0; i < user.RoleIds.length; i++) {
                currentDNMenu.ListRole.push(user.RoleIds[i].RoleId);
            }
        }
    }


    ValidateGiftBeforeSubmit() {

        var strErrorMsg = "";
        if (this.currentDN.Name == "" || typeof this.currentDN.Name === "undefined")
            strErrorMsg += "• Tên roles phải nhập. <br/>";


        if (this.currentDN.Type == "" || typeof this.currentDN.Type === "undefined")
            strErrorMsg += "• Type phải nhập. <br/>";

        if (this.currentDN.Code == "" || typeof this.currentDN.Code === "undefined")
            strErrorMsg += "• Code phải nhập. <br/>";

        if (strErrorMsg !== "") {
            toastr.error(strErrorMsg, "Lỗi dữ liệu nhập!");
            return false;
        }
        return true;
    }


    ValidateMenuBeforeSubmit() {

        var strErrorMsg = "";
        if (this.currentDNMenu.Name == "" || typeof this.currentDNMenu.Name === "undefined")
            strErrorMsg += "• Tên menu phải nhập. <br/>";
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

    GetStringOfUserRolesName(roles) {
        return this.userService.GetStringOfUserRolesName(roles);
    }
    InitInfoRole() {
        this.isEdit = false;
        this.currentDN = {};
        this.currentDN.Name = "";
        this.currentDN.Type = "";
        this.currentDN.Code = null;
        this.currentDN.Description = "";
    }
    InitInfoMenu() {

        this.isEdit = false;
        this.currentDNMenu = {};
        this.currentDNMenu.Name = "";
        this.currentDNMenu.Loai = "";
        this.currentDNMenu.Code = null;
        this.currentDNMenu.ControllerName = null;
        this.currentDNMenu.Status = "A";
        this.currentDNMenu.Parentid = "";
        this.currentDNMenu.ListRole = null;
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
    SubmitRolesUser() {
        var jsonToPost = {};


        jsonToPost.RoleIds = [];
        if (this.isEdit === false) {
            jsonToPost.UserId = null;
            jsonToPost.CreateDate = this.utilitiesJS.GetFormattedDate(new Date());
            jsonToPost.Password = this.selectedUserForEditing.Password;
        } else {
            jsonToPost.UserId = this.selectedUserForEditing.UserId;
            if (this.selectedUserForEditing.SelectedRoleIds.length > 0) {
                for (var i = 0; i < this.selectedUserForEditing.SelectedRoleIds.length; i++) {
                    jsonToPost.RoleIds.push({
                        "RoleId": this.selectedUserForEditing.SelectedRoleIds[i]
                    });
                }
            }
        }

        jsonToPost.Birthday = this.selectedUserForEditing.Birthday

        jsonToPost.UserName = this.selectedUserForEditing.UserName;
        jsonToPost.Email = this.selectedUserForEditing.Email;
        jsonToPost.FullName = this.selectedUserForEditing.FullName;
        jsonToPost.Phone = this.selectedUserForEditing.Phone;
        jsonToPost.PersonalId = this.selectedUserForEditing.PersonalId;
        jsonToPost.CompanyId = this.selectedUserForEditing.CompanyId;
        jsonToPost.Status = this.selectedUserForEditing.Status;
        jsonToPost.EmployeeId = this.selectedUserForEditing.EmployeeId;

        this.userService.SubmitUser(jsonToPost).then((data) => {
            if (data.Result == true) {
                this.userService.GetListUserByCompanyIdPassed(this.selectedCompany).then((data) => {
                    this.UserByCompany = data.Data;
                });
                $('#addEditUser').modal('hide');
                toastr.success(this.isEdit === false ? 'Tạo mới user thành công!' : 'Cập nhật Roles User thành công!', "Thông báo");
                return true;
            } else {
                toastr.error(data.Message, "Lỗi");
                return false;
            }
        });
    }

    EditRolesUser(user) {

        this.isEdit = true;
        this.selectedUserForEditing = user;
        this.selectedUserForEditing.SelectedRoleIds = [];

        if (user.RoleIds != null && user.RoleIds.length > 0) {
            for (var i = 0; i < user.RoleIds.length; i++) {
                this.selectedUserForEditing.SelectedRoleIds.push(user.RoleIds[i].RoleId);
            }
        }
    }

    ViewdlgUser() {

        this.dialogService.open({
            viewModel: ViewdlgUser

        }).then((result) => {

        });
    }
    ViewdlgAction() {

        this.dialogService.open({
            viewModel: ViewdlgAction,

        }).then((result) => {

        });
    }

}

export class FilterByStatusValueConverter {
    toView(array, status) {
        if (status) {
            return array.filter(x => x.Status != null && x.Status == status);
        }
        return array;
    }
}

export class FilterByNameValueConverter {
    toView(array, obj) {
        if (obj) {
            return array
                .filter(x => ((x.Name != null) && (x.Name.toLowerCase().indexOf(obj.toLowerCase()) != -1)) ||
                    ((x.Loai != null) && (x.Loai.toLowerCase().indexOf(obj.toLowerCase()) != -1)) ||
                    ((x.Code != null) && (x.Code.toLowerCase().indexOf(obj.toLowerCase()) != -1)) ||
                    ((x.ControllerName != null) && (x.ControllerName.toLowerCase().indexOf(obj.toLowerCase()) != -1))

                )
        }
        return array;
    }
}
export class FilterByNamePageValueConverter {
    toView(array, obj) {
        if (obj) {
            return array
                .filter(x => ((x.Name != null) && (x.Name.toLowerCase().indexOf(obj.toLowerCase()) != -1)))
        }
        return array;
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


export class FilterByCompanyValueConverter {
    toView(array, company) {
        if (company != "" && company != null && typeof company !== "undefined") {
            return array.filter(x => x.CompanyId != null && x.CompanyId == company);
        }
        return array;
    }
}

export class FilterByEmailOrUsernameValueConverter {
    toView(array, obj) {
        if (obj) {
            obj = obj.trim();
            return array
                .filter(x => (((x.Email != null) && (x.Email.indexOf(obj) != -1)) || ((x.UserName != null) && (x.UserName.indexOf(obj) != -1))));
        }

        return array;
    }
}