import {
    DialogController
} from 'aurelia-dialog';
import {
    inject
} from 'aurelia-dependency-injection';
import * as toastr from "toastr";
import 'select2';
import 'sweetalert';
import {
    UserService
} from 'Services/UserSvc/UserService';
import {
    DialogService
} from 'aurelia-dialog';
import {
    CommentService
} from 'Services/CommentSvc/CommentService';

@inject(DialogController, UserService, CommentService)
export class UserUpdateCommentMngCS {

    Listsac = [];
    UserByCompany = [];
    ListRolesToBind = [];
    info = {};
    urlavatar = "";
    dialogController: DialogController
    constructor(dialogController, userService, commentService) {

        this.dialogController = dialogController;
        
        this.userService = userService;
        this.commentService = commentService;

        this.urlimg = "";
        this.current = 1;
        this.itemperpage = 10;
        this.pagesize = 20;
        this.selectedCompany = 1;
        this.total = 0;

    }

    activate(dt) {

        //  console.log('dt', JSON.stringify(dt));
        this.info.MaNV = "";
        this.RoleId = "";
        this.NhomPhongBan = "";
        this.TrangThai = "";

        this.info = dt;
        this.hinhanh = this.imageExists(dt.Avatar);
        this.urlavatar = dt.Avatar;

        return Promise.all([
            this.commentService.GetListLoaiCommentv2()
        ]).then((rs) => {
            this.ListPhongBanRole = rs[0].data.ListCMRoles.filter(x => x.Code === "CM_AdminCS" || x.Code === "CM_NhanVienCS");


        })
    }

    imageExists(image_url) {
        if (image_url == null || image_url == undefined) {
            image_url = "images/avatar_2x.png";
        } else {
            image_url = image_url;
        }
        return image_url;
    }

    attached() {
        $('[data-toggle="tooltip"]').tooltip()
        $("#fileUpload").change(function() {

            if (this.files && this.files[0]) {
                this.viewfile = this.files[0].name;


                var reader = new FileReader();
                reader.onload = function(e) {
                    $('#hinhanh').attr('src', e.target.result)
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
        $('#fileUpload').on('change', () => {
            this.viewfile = $('#fileUpload').val();

        });
    }

    async ResetAvt() {
        $('#hinhanh')
            .attr('src', "../../../../images/avatar_2x.png");
        this.viewfile = "";
    }

    ValidateMenuBeforeSubmit() {

        var strErrorMsg = "";

        if (this.RoleId === "" || typeof(this.RoleId) == "undefined") {
            strErrorMsg += "'Bạn chưa chọn [Chức vụ].'</b>' Vui lòng chọn/nhập lại. <br/>";
            return;
        }


        if (strErrorMsg !== "") {
            toastr.error(strErrorMsg, "QUẢN LÝ USER");
            return false;
        }
        return true;
    }


    UploadImg() {
        try {
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
                toastr.error("Vui lòng chọn tập tin có phần mở rộng '.jpg' '.jpeg' '.png'", "QUẢN LÝ USER");
                return;
            }
        } catch (error) {
            return 'false';
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
    update() {

        if (this.CheckSize() == 3) {
            let jsonToPost = {};
            jsonToPost.MaNV = this.info.MaNV;
            jsonToPost.RoleId = this.RoleId;
            jsonToPost.Avatar = this.urlavatar;
            jsonToPost.PhongBan = "CS";

            if (this.TrangThai === "") {
                jsonToPost.Status = "Active";
            } else {
                jsonToPost.Status = this.TrangThai;
            }
            try {
                this.commentService.UpdateUser(this.info.MaNV, jsonToPost).then((data) => {

                    //      console.log(JSON.stringify(data));
                    if (data.data === "SUCCESS") {
                        toastr.success("Cập nhật thông tin User thành công.", "QUẢN LÝ USER");

                    } else {
                        toastr.warning("Cập nhật thông tin User thất bại. Vui lòng thử lại.", "QUẢN LÝ USER");
                    }

                });
            } catch (error) {
                toastr.warning("Đăng ký User thất bại. Vui lòng thử lại.", "QUẢN LÝ USER");
            }
        }
        if (this.CheckSize() == 2) {
            let jsonToPost = {};
            jsonToPost.MaNV = this.info.MaNV;
            jsonToPost.RoleId = this.RoleId;
            jsonToPost.Avatar = this.UploadImg();
            jsonToPost.PhongBan = "CS";

            if (this.TrangThai === "") {
                jsonToPost.Status = "Active";
            } else {
                jsonToPost.Status = this.TrangThai;
            }
            try {
                this.commentService.UpdateUser(this.info.MaNV, jsonToPost).then((data) => {

                    //    console.log(JSON.stringify(data));
                    if (data.data === "SUCCESS") {
                        toastr.success("Cập nhật thông tin User thành công.", "QUẢN LÝ USER");

                    } else {
                        toastr.warning("Cập nhật thông tin User thất bại. Vui lòng thử lại.", "QUẢN LÝ USER");
                    }

                });
            } catch (error) {
                toastr.warning("Đăng ký User thất bại. Vui lòng thử lại.", "QUẢN LÝ USER");
            }
        }
        if (this.CheckSize() == 1) {
            toastr.error("Kích thước tập tin không vượt quá 1MB, vui lòng chọn lại", "QUẢN LÝ USER");
            return;
        }



    }


}