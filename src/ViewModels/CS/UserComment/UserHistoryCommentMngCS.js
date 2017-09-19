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
export class UserHistoryCommentMngCS {


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
            if (item.Date == null || item.Date == "") { obj.Date = "" } else { obj.Date = moment(item.Date).format("DD/MM/YYYY"); }
            if (item.LogInTime == null || item.LogInTime == "") { obj.LogInTime = "" } else { obj.LogInTime = moment(item.LogInTime).format("DD/MM/YYYY HH:mm:ss"); }
            if (item.LogOutTime == null || item.LogOutTime == "") { obj.LogOutTime = "" } else { obj.LogOutTime = moment(item.LogOutTime).format("DD/MM/YYYY HH:mm:ss"); }


            testJson.push(obj);
            obj = {};
        }
        return testJson;
    }
    CheckDatetime() {
        if (($('#txtFilterDateStart').val() === '') && ($('#txtFilterDateEnd').val() === '')) {
            return 1; // two null 
        }
        if (($('#txtFilterDateStart').val() !== '') && ($('#txtFilterDateEnd').val() === '')) {
            return 2; // two null
        }
        if (($('#txtFilterDateStart').val() === '') && ($('#txtFilterDateEnd').val() !== '')) {
            return 3; // two null
        }
    }

    async Search() {

        let arr = [];
        var startDate = $('#txtFilterDateStart').val();
        var endDate = $('#txtFilterDateEnd').val();
        switch (this.CheckDatetime()) {
            case 1:
                toastr.warning("Thời gian bắt đầu và thời gian kết thúc chưa được chọn. Vui lòng chọn lại.", "QUẢN LÝ USER");
                return;
            case 2:
                toastr.warning("Thời gian kết thúc chưa được chọn. Vui lòng chọn lại.", "QUẢN LÝ USER");
                return;
            case 3:
                toastr.warning("Thời gian bắt đầu chưa được chọn. Vui lòng chọn lại.", "QUẢN LÝ USER");
                return;

        }
        if (startDate == "" && endDate != "") {
            startDate = moment().subtract(7, 'days').format("YYYY-MM-DD");
        }

        if (endDate == "" && startDate != "") {
            endDate = moment().add(7, 'days').format("YYYY-MM-DD");
        }
        this.sDate = startDate;
        this.eDate = endDate;
        var range = moment.range(startDate, endDate);
        if (range.diff('days') > 7) {
            toastr.warning("Khoảng thời gian tìm kiếm không được quá 7 ngày.", "QUẢN LÝ USER");
            return;
        }

        if (startDate > endDate) {
            toastr.warning("Thời gian bắt đầu > thời gian kết thúc. Vui lòng chọn lại.", "QUẢN LÝ USER");
            return;
        }


        arr.push(this.manv);
        if (startDate) {
            arr.push(startDate);
        }
        if (endDate) {
            arr.push(endDate);
        }
        this.strQuery = arr.join("/");


        return await this.commentService.history(this.strQuery).then((data) => {

            if (data.status === 200 || data.data !== "NOT_FOUND") {
                this.listuser = data.data;
                this.logService.InsertAdminCPLog("CS | Quan Ly User | Lich Su Login ", "Success", "Xuất report history!");
                this.excelService.download(this.excelService.jsonToSsXml(this.exportExcel(this.listuser), this.headerTable, this.testTypes), 'Lichsulogin_' + this.tennv + '.xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

            }
        })

    }




}