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
import {
    LogService
} from 'Services/LogService';
import moment from 'moment';
import 'momentrange';
import { ExcelService } from 'Helpers/ExcelHelper';
import { DateFormat } from 'Helpers/datetime-format';
@inject(DialogController, UserService, CommentService, LogService, ExcelService, DateFormat)
export class UserHistoryCommentMngSO {


    info = [];
    listuser = [];
    manv;
    tennv;
    dialogController: DialogController
    constructor(dialogController, userService, commentService, logService, excelService, dateFormat) {
        this.excelService = excelService;
        this.dateFormat = dateFormat;
        this.dialogController = dialogController;
        this.userService = userService;
        this.commentService = commentService;
        this.logService = logService;


        this.current = 1;
        this.itemperpage = 10;
        this.pagesize = 20;
        this.selectedCompany = 1;
        this.total = 0;

    }

    activate(dt) {
        this.info = dt;
        this.manv = dt.MaNV;
        this.tennv = dt.TenNV;
        // console.log(JSON.stringify(dt));
        // return Promise.all([
        //     this.commentService.GetListLoaiCommentv2()
        // ]).then((rs) => {
        //     this.ListPhongBanRole = rs[0].data.ListCMRoles.filter(x => x.Code === "CM_AdminCS" || x.Code === "CM_NhanVienCS");


        // })
    }
    attached() {
        $('#txtFilterDateStart').datetimepicker({
            format: "YYYY-MM-DD"
        });

        $("#txtFilterDateStart").on("dp.change", () => {
            this.dateStartFilter = $('#txtFilterDateStart').val();
        });

        $('#txtFilterDateEnd').datetimepicker({
            format: "YYYY-MM-DD"
        });


        $("#txtFilterDateEnd").on("dp.change", () => {
            this.dateEndFilter = $('#txtFilterDateEnd').val();
        });

    }


    testTypes = {
        "Date": "String",
        "LogInTime": "String",
        "LogOutTime": "String"


    };
    headerTable = [
        "Ngày",
        "Thời điểm login",
        "Thời điểm logout",

    ];


    exportExcel(List) {

        var testJson = [];
        var obj = {};

        for (var item of List) {
            if (item.Date == null || item.Date == "") { obj.Date = "" } else { obj.Date = this.dateFormat.getDateFormat(new Date(item.Date)); }
            if (item.LogInTime == null || item.LogInTime == "") { obj.LogInTime = "" } else { obj.LogInTime = this.dateFormat.getDateFormat(new Date(item.LogInTime)); }
            if (item.LogOutTime == null || item.LogOutTime == "") { obj.LogOutTime = "" } else { obj.LogOutTime = this.dateFormat.getDateFormat(new Date(item.LogOutTime)); }


            testJson.push(obj);
            obj = {};
        }
        return testJson;
    }








    async Search() {

        let arr = [];
        var startDate = $('#txtFilterDateStart').val();
        var endDate = $('#txtFilterDateEnd').val();

        if (startDate == "" && endDate != "") {
            startDate = moment().subtract(30, 'days').format("YYYY-MM-DD");
        }

        if (endDate == "" && startDate != "") {
            endDate = moment().add(30, 'days').format("YYYY-MM-DD");
        }
        this.sDate = startDate;
        this.eDate = endDate;
        var range = moment.range(startDate, endDate);
        if (range.diff('days') >= 31) {
            toastr.warning("Khoảng thời gian tìm kiếm không được quá 30 ngày.", "QUẢN LÝ USER");
            return;
        }

        if (startDate > endDate) {
            toastr.warning("Thời gian bắt đầu > thời gian kết thúc. Vui lòng chọn lại.", "QUẢN LÝ USER");
            return;
        }


        arr.push("MaNV=" + this.manv);
        if (startDate) {
            arr.push("ngayBatDau=" + startDate);
        }
        if (endDate) {
            arr.push("ngayKetThuc=" + endDate);
        }
        this.strQuery = arr.join("&");


        return await this.commentService.history(this.strQuery).then((data) => {
            if (data.status === 200 || data.data !== "NOT_FOUND") {
                this.listuser = data.data;
                this.logService.InsertAdminCPLog("CS | Quan Ly User | Lich Su Login ", "Success", "Xuất report history!");

                this.excelService.download(this.excelService.jsonToSsXml(this.exportExcel(this.listuser), this.headerTable, this.testTypes), 'Lichsulogin_' + this.tennv + '.xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

            }
        })

    }




}