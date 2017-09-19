import { DialogController } from 'aurelia-dialog';
import { inject } from 'aurelia-dependency-injection';
import * as toastr from "toastr";
import 'select2';
import { UserService } from 'Services/UserSvc/UserService';
@inject(DialogController, UserService)
export class ViewdlgUser {

    Listactions = [];
    UserByCompany = [];
    ListRolesToBind = [];
    dialogController: DialogController

    constructor(dialogController, userService) {

        this.dialogController = dialogController;
        this.userService = userService;


        this.current = 1;
        this.itemperpage = 10;
        this.pagesize = 20;
        this.total = 0;

    }

    async activate() {
        return await Promise.all([
            this.userService.GetListCompanies(), this.userService.GetListUserByCompanyIdPassed(this.selectedCompany), this.userService.GetListRoles()

        ]).then((rs) => {

            this.Companies = rs[0].Data;
            console.log(this.Companies);
            this.UserByCompany = rs[1].Data;

            this.total = this.UserByCompany.length;
            this.ListRolesToBind = rs[2].Data;
        })

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
    GetStringOfUserRolesName(roles) {
        return this.userService.GetStringOfUserRolesName(roles);
    }

    submit(entity) {

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

    attached() {
        $('#filterByCompany').select2().val(this.filterCompany);
        $('#filterByCompany').select2({
            placeholder: "- Chọn Đơn vị -",
            allowClear: true
        }).on('change', () => {
            this.filterCompany = $('#filterByCompany').val();
        });



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