import { DialogController } from 'aurelia-dialog';
import { inject } from 'aurelia-dependency-injection';
import * as toastr from "toastr";
import 'select2';
import 'sweetalert';
import {
    CommentService
} from 'Services/CommentSvc/CommentService';
import {
    LogService
} from 'Services/LogService';
import { DialogService } from 'aurelia-dialog';
import _ from 'lodash';
@inject(DialogController, CommentService, LogService)
export class UserRegisterCommentMngSO {

    ListAccount = [];
    unbindsearch = false;
    unbindsearchinfo = false;
    ListPhongBanRole = [];
    msonv;

    dialogController: DialogController

    constructor(dialogController, commentService, logService) {

        this.dialogController = dialogController;
        this.commentService = commentService;
        this.logService = logService;


        //Pagination
        this.current = 1;
        this.itemperpage = 20;
        this.pagesize = 20;
        this.total = 0;

    }

    activate() {
        return Promise.all([
            this.commentService.GetListLoaiCommentv2()
        ]).then((rs) => {
            this.ListPhongBanRole = rs[0].data.ListCMRoles.filter(x => x.Code === "CM_AdminSO" || x.Code === "CM_NhanVienSO");


        })
    }
    UploadImg() {

        let rs = "";
        let formData = new FormData();
        let input = document.querySelector('input[type="file"]');
        let result;
        formData.append("userfilename", $('#fileUpload')[0].files[0].name);
        // HTML file input, chosen by user
        formData.append("userfile", $('#fileUpload')[0].files[0]);
        if (this.CheckImg($('#fileUpload')[0].files[0].name) == 1) {
            $.ajax({
                url: 'http://10.10.40.142:8899/v2/upload-image',
                data: formData,
                processData: false,
                contentType: false,
                type: 'POST',
                async: false,
                success: (data) => {
                    result = data;
                }
            });

            return result
        } else {
            return -1;
        }
    }
    CheckImg(img) {
        if ((img.toLowerCase().indexOf('png') != -1) || (img.toLowerCase().indexOf('jpg') != -1) || (img.toLowerCase().indexOf('jpeg') != -1)) {

            return 1;
        } else {
            return -1;
        }
    }


    CheckSize() {
        try {
            if (Math.round(($('#fileUpload')[0].files[0].size) / 1048576) >= 1) {
                return 1;
            } else {
                return 2;
            }
        } catch (error) {
            return 3; // No image to chosen
        }
    }



    RegisterEmployee() {
        if (this.CheckSize() == 3) {
            if (this.RoleId === "") {
                toastr.error("'<b>'Bạn chưa chọn [Chức vụ].'</b>' Vui lòng chọn/nhập lại. <br/>", "QUẢN LÝ USER");
                return
            } else {
                var jsonToPost = {};
                jsonToPost.EmpID = this.ListAccount[0].EmpID;
                if (this.ListAccount[0].EMAIL != "") {
                    jsonToPost.UsernameCitrix = this.ListAccount[0].EMAIL.replace("@vienthonga.com", "");
                }
                jsonToPost.RoleId = this.RoleId;
                jsonToPost.PhongBan = "SO";
                jsonToPost.Avatar = "";
                try {
                    this.commentService.RegisterEmployeeInfo(jsonToPost).then((data) => {


                        if (data.data === "SUCCESS") {
                            toastr.warning("Đăng ký User thành công.", "QUẢN LÝ USER");
                            return;
                        }
                        if (data.data == "USER_EXISTED") {
                            toastr.warning("Tài khoản [" + this.ListAccount[0].EMAIL.replace("@vienthonga.com", "") + "] đã tồn tại.", "QUẢN LÝ USER");
                            return;
                        }
                    });
                } catch (error) {
                    toastr.warning("Đăng ký User thất bại. Vui lòng thử lại.", "QUẢN LÝ USER");
                }
            }
        }
        if (this.CheckSize() == 2) {
            if (this.RoleId === "") {
                toastr.error("'<b>'Bạn chưa chọn [Chức vụ].'</b>' Vui lòng chọn/nhập lại. <br/>", "QUẢN LÝ USER");
                return
            } else {
                var jsonToPost = {};
                jsonToPost.EmpID = this.ListAccount[0].EmpID;
                if (this.ListAccount[0].EMAIL != "") {
                    jsonToPost.UsernameCitrix = this.ListAccount[0].EMAIL.replace("@vienthonga.com", "");
                }
                jsonToPost.RoleId = this.RoleId;
                jsonToPost.PhongBan = "SO";
                if (this.UploadImg() == -1) { toastr.error("Vui lòng chọn tập tin có phần mở rộng '.jpg' '.jpeg' '.png'", "QUẢN LÝ USER"); return; } else { jsonToPost.Avatar = this.UploadImg(); }
                try {
                    this.commentService.RegisterEmployeeInfo(jsonToPost).then((data) => {


                        if (data.data === "SUCCESS") {
                            toastr.warning("Đăng ký User thành công.", "QUẢN LÝ USER");
                            return;
                        }
                        if (data.data == "USER_EXISTED") {
                            toastr.warning("Tài khoản [" + this.ListAccount[0].EMAIL.replace("@vienthonga.com", "") + "] đã tồn tại.", "QUẢN LÝ USER");
                            return;
                        }
                    });
                } catch (error) {
                    toastr.warning("Đăng ký User thất bại. Vui lòng thử lại.", "QUẢN LÝ USER");
                }
            }
        }

        if (this.CheckSize() == 1) {
            toastr.error("Kích thước tập tin không vượt quá 1MB, vui lòng chọn lại", "QUẢN LÝ USER");
            return;
        }

    }







    SearchUserById() {
        if (!this.ValidateMenuBeforeSubmit()) {
            return false;
        } else {
            this.commentService.SearchUserById(this.vlusercitrix).then((rs) => {
                if (rs.status === 200) {

                    this.ListAccount = rs.data;
                    this.total = rs.data.length;
                    if (this.total == 1) {

                        this.unbindsearch = true;
                        this.unbindsearchinfo = true;
                    } else {
                        this.unbindsearch = true;
                        this.unbindsearchinfo = false;
                    }

                    this.logService.InsertAdminCPLog("VTA APP | CS | QuanLyCommentUser  | SearchUser", rs.status, JSON.stringify(rs.data));

                }
            });
        }
    }
    validateName(str) {

        var regex = /^[0-9A-Za-z\$ ]{0,30}$/;
        return regex.test(str);
    }
    ValidateMenuBeforeSubmit() {

        var strErrorMsg = "";
        if (this.vlusercitrix == "" || typeof(this.vlusercitrix) == "undefined") {
            strErrorMsg += "'<b>'Bạn chưa nhập [Tên đăng nhập (Citrix)]'</b>'<br/>";
        }

        if (this.validateName(this.vlusercitrix) == false) {
            strErrorMsg += "'<b>'[Tên đăng nhập (Citrix)]'</b>' không đúng định dạng. Vui lòng chọn/nhập lại. <br/>";
        }
        if (strErrorMsg !== "") {
            toastr.error(strErrorMsg, "QUẢN LÝ USER");
            return false;
        }
        return true;
    }


    attached() {
        $('#uploadBtn').on('change', () => {

            this.fileupload = $('#uploadBtn').val();
        });
    }


}




export class FormatUsernameforLengthValueConverter {
    toView(cmt) {
        return cmt.replace("@vienthonga.com", "");
    }
}