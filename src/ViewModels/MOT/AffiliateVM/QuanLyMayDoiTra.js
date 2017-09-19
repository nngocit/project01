import {
    inject, BindingEngine
} from 'aurelia-framework';
import {
    QuanLyMayImageDetail
} from '../AffiliateVM/QuanLyMayImageDetail';
import {
    QuanLyMayProductDetail
} from '../AffiliateVM/QuanLyMayProductDetail';
import {
    DialogService
} from 'aurelia-dialog';
import {
    DoiTraXaHangService
} from '../../../Services/AffiliateSvc/DoiTraXaHangService';
import { MotMenuPermission } from 'Configuration/PermissionSettings/MotMenuPermission';
import 'select2';
import * as toastr from "toastr";
import NProgress from 'nprogress';
import { ExcelService } from 'Helpers/ExcelHelper';
@inject(BindingEngine, DialogService, DoiTraXaHangService, MotMenuPermission, ExcelService)
export class QuanLyMayDoiTra {
    strQuery = "";
    ListItems = []
    arr = [];
    banner = {};
    doitra = {};
    ListBU = [];
    ListLoaiMay = [];
    ListCoSo = [];
    ListTinhTrangDuyet = [];
    ListTinhTrangBan = [];
    ListTinhTrangCapNhatHinh = [];
    ListTinhTrangHienThi = [];
    ListDoiTra = [];
    ListDoiTras = [];
    isLimit = true;
    disabledetail = false;
    Disabletimkiem = false;
    data;
    activate() {
        this.productsStatus = "H";
    }

    constructor(bindingEngine, dialogService, doiTraXaHangService, motMenuPermission, excelService) {
        this.dialogService = dialogService;
        this.doiTraXaHangService = doiTraXaHangService;
        this.motMenuPermission = motMenuPermission;
        this.excelService = excelService;
        //PAGINATION
        this.current = 1;
        this.itemperpage = 20;
        this.pagesize = 8;
        let subscriptioncurrent = bindingEngine.propertyObserver(this, 'current')
            .subscribe(() => {
                this.Search();
            });
    }

    async activate() {
        this.isQLGS();
        if (this.isLimit == false) {
            this.data = await this.doiTraXaHangService.Getlistxahangconfig(Lockr.get('UserInfo').Username + "&role=qlgs");
        }
        else {
            this.data = await this.doiTraXaHangService.Getlistxahangconfig(Lockr.get('UserInfo').Username);
        }
        this.ListBU = this.data.data.ListBU;
        this.ListCoSo = this.data.data.ListCoSo;
        this.ListLoaiMay = this.data.data.ListLoaiMay;
        this.ListTinhTrangDuyet = this.data.data.ListTinhTrangDuyet;
        this.ListTinhTrangBan = this.data.data.ListTinhTrangBan;
        this.ListTinhTrangCapNhatHinh = this.data.data.ListTinhTrangCapNhatHinh;
        this.ListTinhTrangHienThi = this.data.data.ListTinhTrangHienThi;
    }

    isQLGS() {
        this.Roloes = Lockr.get('UserInfo').Roles;

        for (let i of this.Roloes) {
            this.motMenuPermission.IsArray(i.Code);
        }

        if (this.motMenuPermission.isQuanLyGiamSat() == true) {
            this.isLimit = false;
        }
    }



    attached() {
        $('#CoSo').select2().val(this.filterCoSo);
        $('#CoSo').select2({
            placeholder: "- Chọn Cơ sở -",
            allowClear: true
        }).on('change', () => {
            this.Coso = $('#CoSo').val();
        });
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
    Search() {
        this.strQuery = "";
        this.arr = [];

        var startDate = $('#txtFilterDateStart').val();
        var endDate = $('#txtFilterDateEnd').val();


        if (startDate) {
            this.arr.push("ngayBatDau=" + startDate);
        }
        if (endDate) {
            this.arr.push("ngayKetThuc=" + endDate);
        }
        if (this.IMEI) {
            this.arr.push("imei=" + this.IMEI);
        }

        if (this.TenSanPham) {
            this.arr.push("tenSp=" + this.TenSanPham);
        }
        if (this.Tinhtranghienthi) {
            this.arr.push("ttHienThi=" + this.Tinhtranghienthi);
        }
        if (this.Tinhtrangban) {
            this.arr.push("ttBan=" + this.Tinhtrangban);
        }
        if (this.Coso) {
            this.arr.push("coSo=" + this.Coso);
        }
        if (this.Loaimay) {
            this.arr.push("loaiMay=" + this.Loaimay);
        }

        if (this.Tinhtrangduyet) {
            this.arr.push("ttDuyet=" + this.Tinhtrangduyet);
        }
        if (this.Tinhtrangcapnhathinh) {
            this.arr.push("ttHinh=" + this.Tinhtrangcapnhathinh);
        }
        this.arr.push("userName=" + Lockr.get('UserInfo').Username);
        this.arr.push("pageNo=" + this.current);
        if (this.isLimit == false) {
            this.arr.push("role=qlgs")
        }
        if (startDate > endDate) {

            toastr.warning("Thời gian bắt đầu > thời gian kết thúc. Vui lòng chọn lại.", "QUẢN LÝ MÁY ĐỔI TRẢ");
            return;
        }
        this.strQuery = this.arr.join("&");
        var splashHtml = '<div class="splash card">' +
            '<div role="spinner">' +
            '<div class="spinner-icon"></div>' +
            '</div>' +

            '<p style="text-align:center">Vui lòng chờ...</p>' +
            '<div class="progress">' +
            '<div class="mybar" role="bar">' +
            '</div>' +
            '</div>' +
            '</div>';
        NProgress.configure({
            template: splashHtml
        });

        NProgress.set(0.6);
        this.disabledetail = true
        this.Disabletimkiem = true;

        try {
            return Promise.all([this.doiTraXaHangService.Getlistxahangsearch(this.strQuery)]).then((data) => {

                this.ListDoiTra = data[0].data.ListResults;
                NProgress.done();
                this.disabledetail = false
                this.Disabletimkiem = false;
                this.total = 20 * data[0].data.TotalPage;
                this.TotalItem = data[0].data.TotalItem;
                if (this.total == 0) {
                    this.noidungkhongtimthay = "Không tìm thấy danh sách sản phẩm thỏa điều kiện.";
                }

            })
        } catch (err) {
            NProgress.done();
        }
    }


    ViewdlgDetailImageProcduct(dt) {
        this.dialogService.open({
            viewModel: QuanLyMayImageDetail,
            model: dt,

        }).then((result) => {


            this.disabledetail = false
            this.Disabletimkiem = false;
            // try {
            //     return Promise.all([this.doiTraXaHangService.Getlistxahangsearch(this.strQuery)]).then((data) => {

            //         this.ListDoiTra = data[0].data.ListResults;
            //         NProgress.done();
            //         this.disabledetail = false
            //         this.Disabletimkiem = false;
            //         this.total = 20 * data[0].data.TotalPage;
            //         this.TotalItem = data[0].data.TotalItem;
            //         if (this.total == 0) {
            //             this.noidungkhongtimthay = "Không tìm thấy danh sách sản phẩm thỏa điều kiện.";
            //         }

            //     })
            // } catch (err) {
            //     NProgress.done();
            // }


        })

    }

    ViewdlgQuanLyMayProductDetail(dt) {
        let obj = {};
        obj = dt;
        obj.ListTinhTrangDuyet = this.ListTinhTrangDuyet;

        this.disabledetail = true;
        this.dialogService.open({
            viewModel: QuanLyMayProductDetail,
            model: obj,
            lock: true
        }).then((result) => {


            if (result.output == "CallUpdate") {

                this.disabledetail = true;
                this.Disabletimkiem = true;
                try {
                    return Promise.all([this.doiTraXaHangService.Getlistxahangsearch(this.strQuery)]).then((data) => {
                        this.ListDoiTra = data[0].data.ListResults;
                        NProgress.done();
                        this.disabledetail = false
                        this.Disabletimkiem = false;
                        this.total = 20 * data[0].data.TotalPage;
                        this.TotalItem = data[0].data.TotalItem;
                        if (this.total == 0) {
                            this.noidungkhongtimthay = "Không tìm thấy danh sách sản phẩm thỏa điều kiện.";
                        }

                    })
                } catch (err) {
                    NProgress.done();
                }

            }
            else {
                this.disabledetail = false
                this.Disabletimkiem = false;
            }
        });

    }
    testTypes = {
        "Stt": "String",
        "imei": "String",

        "CoSo_Text": "String",
        "TtBan_Text": "String",
        "TtHinh_Value": "String",
        "TtDuyet_Text": "String",
        "TtHienThi_Value": "String"

    };
    headerTable = [
        "STT",
        "IMEI",

        "Cơ Sở",
        "Tình Trạng Bán",
        "Tình Trạng Cập Nhật Hình",
        "Tình Trạng Duyệt",
        "Tình Trạng Hiển Thị"
    ];
    Getdatadownload() {
        if(this.strQuery=="")
            return
        var splashHtml = '<div class="splash card">' +
            '<div role="spinner">' +
            '<div class="spinner-icon"></div>' +
            '</div>' +
            '<p style="text-align:center">Đang xử lý...</p>' +
            '<div class="progress">' +
            '<div class="mybar" role="bar">' +
            '</div>' +
            '</div>' +
            '</div>';
        NProgress.configure({
            template: splashHtml
        });
        NProgress.configure({ trickleRate: 0.02, trickleSpeed: 800 });
        NProgress.inc();
        return Promise.all([this.doiTraXaHangService.ReportXahang(this.strQuery)]).then((rs) => {
            if (rs[0].data.ListResults != null) {
                this.ListDoiTras = rs[0].data.ListResults;
            }
            else {
                NProgress.done();
            }
            NProgress.done();
        })

    }
    async download() {

        await this.Getdatadownload();
        this.disabledetail = true;

        this.excelService.download(this.excelService.jsonToSsXml(this.exportExcel(this.ListDoiTras), this.headerTable, this.testTypes), 'ReportMayDoiTra.xls', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        this.disabledetail = false;

    }

    exportExcel(List) {
        var testJson = [];
        var o = {};
        let i = 1;
        for (var item of List) {
            o.Stt = i++;
            o.imei = item.XaHangItem.imei;

            o.CoSo_Text = item.CoSo_Text;
            o.TtBan_Text = item.TtBan_Text
            o.TtHinh_Value = item.TtHinh_Value;
            o.TtDuyet_Text = item.TtDuyet_Text
            o.TtHienThi_Value = item.TtHienThi_Value;

            testJson.push(o);
            o = {};
        }
        return testJson;
    }
}