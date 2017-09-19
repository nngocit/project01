import { inject } from 'aurelia-framework';
import { json } from 'aurelia-fetch-client';
import { LogService } from 'Services/LogService';
import { QuaySoService } from 'Services/QuaySo/QuaySoService';
import { NotificationService } from 'Services/Notification/NotificationService';
import { ExcelService } from 'Helpers/ExcelHelper';
import { DateFormat } from 'Helpers/datetime-format';
import moment from 'moment';
import 'momentrange';
import * as toastr from "toastr";
import 'eonasdan-bootstrap-datetimepicker';
import 'select2';
import 'momentrange';
@inject(QuaySoService, NotificationService, LogService, ExcelService, DateFormat)
export class QuanLyVTAApp {

    ListKhuVuc = [];
    ListBranchs = [];
    ListAppEmployee = [];
    ListDataBUDistinct = [];
    ListDataASMDistinct = [];
    ListDataCSDistinct = [];
    ListDataBUModelFromPOS = [];

    pendding = true;

    testTypes = {
        "InstalledDateTime": "String",
        "DeviceOs": "String",
        "AreaId": "String",
        "BUInfo": "String",
        "KhuVucPos": "String",
        "ChiNhanhPos": "String",
        "EmployeeId": "String",
        "HoTen": "String",
        "DoTuoiKH_value": "String",
        "GioiTinhKH_value": "String"
    };
    headerTable = [
        "Thời gian cài đặt",
        "Hệ điều hành chi tiết",
        "Khu vực",
        "BU",
        "Khu vực POS",
        "Chi nhánh POS",
        "Mã Nhân viên",
        "Họ tên",
        "Độ tuổi",
        "Giới tính"
    ];

    constructor(quaySoService, notificationService, logService, excelService, dateFormat) {
        this.quaySoService = quaySoService;
        this.logService = logService;
        this.notificationService = notificationService;

        this.filterBranch = "";

        //Pagination
        this.current = 1;
        this.itemperpage = 20;
        this.orderselect = 0;
        this.pagesize = 20;

        this.excelService = excelService;
        this.dateFormat = dateFormat;

        this.filterKhuVuc = '';
    }

    bind(ct, ovr) {
        if (this.ListAppEmployee != null)
            ovr.bindingContext.total = this.ListAppEmployee.length;
    }

    activate() {
        return Promise.all([this.quaySoService.GetListQuaySoBranch(), this.notificationService.GetListBuAllConfig()]).then((rs) => {
            // this.ListBranchs = rs[0].Data.ListBranchs,
            this.ListKhuVuc = rs[0].Data.ListArea
            this.ListDataBUModelFromPOS = rs[1].Data.ListDataBUModelFromPOS;
            this.ListDataBUDistinct = rs[1].Data.ListDataBUDistinct;
            this.ListDataASMDistinct = rs[1].Data.ListDataASMDistinct;
            this.ListDataCSDistinct = rs[1].Data.ListDataCSDistinct;



        });
    }
    async ChangeBU() {
        this.ListDataASMDistinct = [];
        return await Promise.all([this.notificationService.GetListBuAllConfig()]).then((rs) => {

            this.ListDataASMDistinct = rs[0].Data.ListDataASMDistinct.filter(x => x.ParentValue == this.filterKhuVucBU);

        });
    }
    async ChangePOS() {
        this.ListDataCSDistinct = [];
        return await Promise.all([this.notificationService.GetListBuAllConfig()]).then((rs) => {
            this.ListDataCSDistinct = rs[0].Data.ListDataCSDistinct.filter(x => x.ParentValue == this.filterKhuVucPOS);

        });
    }

    attached() {
        $('#filterByBranch').select2().val(this.filterBranch);
        $('#filterByBranch').select2({
            placeholder: "- Chọn Chi nhánh -",
            allowClear: true
        }).on('change', () => {
            this.filterBranch = $('#filterByBranch').val();

        });
        $('#filterByKhuVucBU').on('change', () => {
            this.ChangeBU();
        })
        $('#filterByKhuVucPOS').on('change', () => {
            this.ChangePOS();
        })

        var today = new Date();
        $('#txtFilterDateStart').datetimepicker({ format: "YYYY-MM-DD" });
        $("#txtFilterDateStart").on("dp.change", () => {
            this.dateStartFilter = $('#txtFilterDateStart').val();
        });
        $('#txtFilterDateEnd').datetimepicker({ format: "YYYY-MM-DD" });
        $("#txtFilterDateEnd").on("dp.change", () => {
            this.dateEndFilter = $('#txtFilterDateEnd').val();
        });
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
    SearchAppEmployee() {
        let jsonToPost = {};

        var startDate = $('#txtFilterDateStart').val();
        var endDate = $('#txtFilterDateEnd').val();

        if (startDate == "" && endDate != "") {
            startDate = moment(new Date()).format("YYYY-MM-DD");
        }

        if (endDate == "" && startDate != "") {
            endDate = moment(new Date()).format("YYYY-MM-DD");
        }

        switch (this.CheckDatetime()) {
            case 1:
                toastr.warning("Thời gian bắt đầu và thời gian kết thúc chưa được chọn. Vui lòng chọn lại.", "QUẢN LÝ VTA APP");
                return;
            case 2:
                toastr.warning("Thời gian kết thúc chưa được chọn. Vui lòng chọn lại.", "QUẢN LÝ VTA APP");
                return;
            case 3:
                toastr.warning("Thời gian bắt đầu chưa được chọn. Vui lòng chọn lại.", "QUẢN LÝ VTA APP");
                return;

        }
        var range = moment.range(startDate, endDate);
        if (range.diff('days') >= 93) {
            toastr.warning("Khoảng thời gian tìm kiếm không được quá 3 tháng.", "QUẢN LÝ VTA APP");
            return;
        }
        var ranges = moment.range(endDate, startDate);
        if (ranges.diff('days') >= 93) {
            toastr.warning("Khoảng thời gian tìm kiếm không được quá 3 tháng.", "QUẢN LÝ VTA APP");
            return;
        }
        if (startDate > endDate) {

            toastr.warning("Thời gian bắt đầu > thời gian kết thúc. Vui lòng chọn lại.", "QUẢN LÝ VTA APP");
            return;
        }
        this.sDate = startDate;
        this.eDate = endDate;
        jsonToPost.StartDate = startDate;
        jsonToPost.Enddate = endDate;
        jsonToPost.EmployeeId = this.MaNV;
        jsonToPost.AreaId = this.filterKhuVuc;
        jsonToPost.BUValue = this.filterKhuVucBU;
        jsonToPost.ASMValue = this.filterKhuVucPOS;
        jsonToPost.BranchId = this.filterBranch;
        jsonToPost.FullName = this.FullName;
        jsonToPost.DeviceOs = this.DeviceOs;
        jsonToPost.DoTuoiKH = this.DoTuoiKH;
        jsonToPost.GioiTinhKH = this.GioiTinhKH;

        this.pendding = !this.pendding;

        this.notificationService.SearchListAppEmployee(jsonToPost).then((data) => {

            if (data.Result == true) {
                this.logService.InsertAdminCPLog("VTA APP | QuanLyVTAApp | SearchListAppEmployee", data.Result, JSON.stringify(jsonToPost));
                this.ListAppEmployee = [];
                this.ListAppEmployee = data.Data;
                //console.log(data.Data);
                //return;
                this.total = this.ListAppEmployee.length;
                this.pendding = !this.pendding;
            } else {
                toastr.warning("Tìm kiếm thất bại. Vui lòng thử lại.", "QUẢN LÝ VTA APP");
                this.pendding = !this.pendding;
            }
        });
    }

    downloadReportVtaApp() {
        this.logService.InsertAdminCPLog("VTA APP | QuanLyVTAApp | downloadReportVtaApp", "Success", "downloadReportVtaApp");
        this.excelService.download(this.excelService.jsonToSsXml(this.XuatExcel(this.ListAppEmployee), this.headerTable, this.testTypes), 'ReportVTAApp_Employees.xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }

    XuatExcel(ListAppEmployee) {

        var testJson = [];
        var obj = {};
        console.log(JSON.stringify(this.ListAppEmployee));
        for (var item of ListAppEmployee) {

            obj.InstalledDateTime = this.dateFormat.getDateFormat(new Date(item.InstalledDateTime));
            obj.DeviceOs = item.DeviceOs;
            obj.AreaId = this.GetAreaName(item.AreaId);

            obj.BUInfo = item.BUInfo;
            obj.KhuVucPos = item.KhuVucPos;
            obj.ChiNhanhPos = item.ChiNhanhPos;
            obj.EmployeeId = item.EmployeeId;
            obj.HoTen = item.HoTen;
            obj.DoTuoiKH_value = item.DoTuoiKH_value;
            obj.GioiTinhKH_value = item.GioiTinhKH_value;
            testJson.push(obj);
            obj = {};


        }
        //debugger;
        return testJson;

    }

    GetAreaName(areaId) {
        if (areaId !== "") {
            var area = this.ListKhuVuc.filter(x => x.AreaId != null && x.AreaId == areaId);
            if (area.length > 0)
                return area[0].AreaName;
        }
        return "N/A";
    }

    GetBranchName(branchId) {
        if (branchId !== "") {
            var branch = this.ListBranchs.filter(x => x.BranchsId != null && x.BranchsId == branchId);
            if (branch.length > 0)
                return branch[0].BranchsAdd;
        }
        return "N/A";
    }
}

export class BranchNameValueConverter {
    toView(branchCode, ListBranchs) {
        if (branchCode !== "") {
            var branch = ListBranchs.filter(x => x.BranchsId != null && x.BranchsId == branchCode);
            if (branch.length > 0)
                return branch[0].BranchsAdd;
        }
        return "N/A";
    }
}

export class AreaNameValueConverter {
    toView(areaId, ListKhuVuc) {
        if (areaId !== "") {
            var area = ListKhuVuc.filter(x => x.AreaId != null && x.AreaId == areaId);
            if (area.length > 0)
                return area[0].AreaName;
        }
        return "N/A";
    }
}

export class FilterByMaNVValueConverter {
    toView(array, obj) {
        if (obj) {
            return array.filter(x => ((x.EmployeeId != null) && (x.EmployeeId.toLowerCase().indexOf(obj.trim().toLowerCase()) != -1)));
        }
        return array;
    }
}

export class FilterByTenNVValueConverter {
    toView(array, obj) {
        if (obj) {
            return array.filter(x => ((x.HoTen != null) && (x.HoTen.toLowerCase().indexOf(obj.trim().toLowerCase()) != -1)));
        }
        return array;
    }
}

export class FilterByHDHValueConverter {
    toView(array, obj) {
        if (obj) {
            return array.filter(x => ((x.DeviceOs != null) && (x.DeviceOs.toLowerCase().indexOf(obj.trim().toLowerCase()) != -1)));
        }
        return array;
    }
}

export class FilterByBranchValueConverter {
    toView(array, branch) {
        //console.log("branchId", branch);
        if (branch != "" && branch != null && typeof branch !== "undefined") {
            return array.filter(x => x.BranchId != null && x.BranchId == branch);
        }
        return array;
    }
}

export class FilterByKhuVucValueConverter {
    toView(array, khuvuc) {

        // if (branch != "" && branch != null && typeof branch !== "undefined") {
        //     return array.filter(x => x.BranchId != null && x.BranchId == branch);
        // }
        return array;
    }
}