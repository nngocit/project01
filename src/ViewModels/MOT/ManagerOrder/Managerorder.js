import { inject } from 'aurelia-framework';
import { json } from 'aurelia-fetch-client';
import { DialogService } from 'aurelia-dialog';
import { ViewOrderDlg } from './ViewOrderDlg';
import { OrderService } from 'Services/MOT/OrderService';
import { UtilitiesJS } from 'Helpers/UtilitiesJS';
import 'eonasdan-bootstrap-datetimepicker';
import 'pdfmake';
import 'vfs_fonts';
import { LogService } from 'Services/LogService';
import * as toastr from "toastr";
import moment from 'moment';
import 'select2';


@inject(DialogService, UtilitiesJS, OrderService, LogService)
export class Managerorder {

    OBJ = {};
    numbercheck = 0;
    selectedOrderToPrints = [];
    listOrder = [];
    ListStatus = [];
    ListLoaiDonhang = [];
    ListAffiliate = [];
    ListChinhanh = [];
    ListNhanvien = [];
    pendding = true;
    constructor(dialogService, utilitiesJS, orderService, logService) {
        this.dialogService = dialogService;
        this.checkAll = false;
        this.orderService = orderService;
        this.logService = logService;
        //Pagination
        this.current = 1;
        this.itemperpage = 20;
        this.orderselect = 0;
        this.pagesize = 20;
    }

    bind(ct, ovr) {
        if (this.listOrder != null)
            ovr.bindingContext.total = this.listOrder.length;
    }
    activate() {
        this.StartDate = "";
        this.EndDate = "";
        this.number1 = "";
        this.number2 = "";
        var wait1000 = new Promise((resolve, reject) => {
                setTimeout(resolve, 70000)
            }).then(() => {
                this.activate()
            })
            // setTimeout(() => { this.activate() }, 70000);
        this.pendding = !this.pendding;
        return Promise.all([this.orderService.GetListOrder(this.OBJ)]).then(rs => {
            if (rs[0].Result == true) {
                //console.log(this.OBJ);
                this.listOrder = rs[0].Data.ListOrder;
                this.ListStatus = rs[0].Data.ListStatus;
                this.ListAffiliate = rs[0].Data.ListAffiliate;
                this.ListChinhanh = rs[0].Data.ListChinhanh;
                this.ListNhanvien = rs[0].Data.ListNhanvien;
                this.ListLoaiDonhang = rs[0].Data.ListLoaiDonhang;
                this.total = rs[0].Data.length;
                this.orderselect = 0;
                this.numbercheck = 0;
                this.pendding = !this.pendding;

            } else {
                this.pendding = !this.pendding;
            }
        })

    }



    attached() {
        $('[data-toggle="tooltip"]').tooltip()


        $('#txtFilterDateTo').datetimepicker({ format: "YYYY-MM-DD HH:mm:ss " });
        $("#txtFilterDateTo").on("dp.change", () => {
            this.EndDate = $('#txtFilterDateTo').val();
        });

        $('#txtFilterDateFrom').datetimepicker({ format: "YYYY-MM-DD HH:mm:ss " });
        $("#txtFilterDateFrom").on("dp.change", () => {
            this.StartDate = $('#txtFilterDateFrom').val();
        });

        $('#filterByCN').select2().val(this.filterCN);
        $('#filterByCN').select2({
            placeholder: "--- Tất cả ---",
            allowClear: true
        }).on('change', () => {
            this.filterCN = $('#filterByCN').val();
        });

        $('#filterByLoaiDonHang').select2().val(this.filterLoaiDonHang);
        $('#filterByLoaiDonHang').select2({
            placeholder: "--- Tất cả ---",
            allowClear: true
        }).on('change', () => {
            this.filterLoaiDonHang = $('#filterByLoaiDonHang').val();
        });

        $('#filterByTT').select2().val(this.filterTT);
        $('#filterByTT').select2({
            placeholder: "--- Tất cả ---",
            allowClear: true
        }).on('change', () => {
            this.filterTT = $('#filterByTT').val();
        });

        $('#filterByOrQuanLyDonHang').select2().val(this.OrQuanLyDonHang);
        $('#filterByOrQuanLyDonHang').select2({
            placeholder: "--- Tất cả ---",
            allowClear: true
        }).on('change', () => {
            this.OrQuanLyDonHang = $('#filterByOrQuanLyDonHang').val();
        });

        $('#filterByOrAfiliate').select2().val(this.OrAfiliate);
        $('#filterByOrAfiliate').select2({
            placeholder: "--- Tất cả ---",
            allowClear: true
        }).on('change', () => {
            this.OrAfiliate = $('#filterByOrAfiliate').val();
        });

        $('.ckbox label').on('click', function() {
            $(this).parents('tr').toggleClass('selected');
        });

        $('.btn-filter').on('click', function() {
            var $target = $(this).data('target');
            if ($target != 'all') {
                $('.table tr').css('display', 'none');
                $('.table tr[data-status="' + $target + '"]').fadeIn('slow');
            } else {
                $('.table tr').css('display', 'none').fadeIn('slow');
            }
        });
    }

    imageExists(image_url) {

        if (image_url == 'N') {
            image_url = "images/not.png";
        } else {
            image_url = "images/check.png";
        }

        return image_url;

    }

    EditDN(currentKH) {
        this._CodeKH = currentKH.Id;
        this._CreateDateKH = currentKH.CreatedDate;
        this.isEdit = true;
        this.currentKH = currentKH;
    }

    printdonhang() {

        this.selectedOrderToPrints = this.listOrder.filter(x => x.checked == true);

        if (this.selectedOrderToPrints.length == 0) {
            toastr.warning('Vui lòng  chọn đơn hàng trước khi In', "Thông báo");
            return;
        }

        if (this.selectedOrderToPrints.length > 20) {
            toastr.warning('Số lượng đơn hàng được chọn để In không vượt quá 20', "Thông báo");
            return;
        }

        let selectedOrder = [];
        for (var i in this.selectedOrderToPrints) {
            selectedOrder.push(this.selectedOrderToPrints[i]);
            //this.listOrder[i].Status = this.newStatus;
        }
        this.logService.InsertAdminCPLog("Quản lý đơn hàng | In danh sách đơn hàng", "Success", JSON.stringify(selectedOrder));


        var _contentToPrint = {};

        _contentToPrint.content = [];
        _contentToPrint.styles = {};
        _contentToPrint.defaultStyle = {};

        var t = 0;
        for (let i in selectedOrder) {

            if (t > 20)
                continue;

            var _rowObject = {};

            if ((t % 4 === 0 && t !== 0))
                _contentToPrint.content.push({ text: 'Page ' + (t / 4 + 1), fontSize: 6, bold: true, pageBreak: 'before', margin: [0, 0, 0, 2] });
            else {
                if (t == 0)
                    _contentToPrint.content.push({ text: 'Page 1', fontSize: 6, bold: true, margin: [0, 0, 0, 2] });
            }


            _rowObject.style = 'mainTableStyle';
            _rowObject.table = {};
            _rowObject.table.widths = [];
            _rowObject.table.widths.push(135);
            _rowObject.table.widths.push(70);
            _rowObject.table.widths.push(295);
            _rowObject.table.body = [];
            _rowObject.table.body.push([{ rowSpan: 5, text: '\n\nCÔNG TY CP VIỄN THÔNG A \n Đ/C : 328 - 330 đường 3/2. \nP.12, Quận 10, TP. HCM\nHotline : 1900545446 Hoặc\n0888.545.446', style: 'firstCol', alignment: 'center' },
                { text: 'NGÀY - SỐ ĐƠN HÀNG:', style: 'title' },
                { text: moment(selectedOrder[i].Ngaydat).format("DD/MM/YYYY") + ' - ' + selectedOrder[i].MaDonhang, style: 'content' }
            ]);
            _rowObject.table.body.push(['', { text: 'NGƯỜI NHẬN & SĐT:', style: 'title' }, { text: selectedOrder[i].TenKh + " - " + selectedOrder[i].Phone, style: 'content' }]);
            _rowObject.table.body.push(['', { text: 'ĐỊA CHỈ NHẬN HÀNG:', style: 'title' }, { text: selectedOrder[i].Address, style: 'content' }]);
            _rowObject.table.body.push(['', { text: 'TÊN HÀNG:', style: 'title' }, { text: selectedOrder[i].ProductName, style: 'content' }]);
            _rowObject.table.body.push(['', { text: 'THU COD:', style: 'title' }, '']);
            _rowObject.table.body.push([{ colSpan: 3, text: 'Nếu có vấn đề gì về đơn hàng vui lòng gọi ngay cho Hotline của chúng tôi, cảm ơn!', style: 'footer', alignment: 'center' }, '', '']);
            //console.log(JSON.stringify(_rowObject));

            _contentToPrint.content.push(_rowObject);

            //console.log(i);
            //console.log(JSON.stringify(_contentToPrint));
            t++;
        }

        _contentToPrint.styles = {
            firstCol: {
                fontSize: 11,
                margin: [0, 8, 0, 5]
            },
            title: {
                fontSize: 10,
                margin: [0, 3, 0, 3],
                alignment: 'left'
            },
            content: {
                fontSize: 12,
                margin: [0, 3, 0, 3],
                alignment: 'left'
            },
            footer: {
                fontSize: 13
            },
            mainTableStyle: {
                height: 500,
                margin: [0, 5, 0, 10]
            },

        };

        _contentToPrint.defaultStyle = { alignment: 'justify' };

        //console.log(JSON.stringify(_contentToPrint));
        // open the PDF in a new window

        pdfMake.createPdf(_contentToPrint).open();

        // print the PDF (not working in this version, will be added back in a couple of days)
        // pdfMake.createPdf(docDefinition).print();

        // download the PDF
        //pdfMake.createPdf(_contentToPrint).download();

    }

    CheckDatetime() {
        if (($('#txtFilterDateFrom').val() === '') && ($('#txtFilterDateTo').val() === '')) {
            if ((this.number1 === '') && (this.number2 === '')) {
                return 1; // 
            } else
                return 2

        } else
            return 1;

    }

    findserver() {
        //  console.log('server --->');
        this.orderselect = 0;
        this.numbercheck = 0;
        this.pendding = !this.pendding;
        let infomartion = {};
        infomartion.TuNgay = $('#txtFilterDateFrom').val();
        infomartion.DenNgay = $('#txtFilterDateTo').val();
        console.log(JSON.stringify(infomartion));
        this.orderService.GetListOrder(infomartion).then((data) => {

            if (data.Result == true) {

                this.listOrder = [];
                this.listOrder = data.Data.ListOrder;
                this.total = data.Data.ListOrder.length;
                //  console.log('Find from server Success!', data.Data.ListOrder.length);
                this.pendding = !this.pendding;
            }
        });

    }
    findclient() {
        //console.log('client --->');
        this.listOrder = this.listOrder.filter(x => (x.Tongtien >= this.number1) && (x.Tongtien <= this.number2));
        //  console.log('Find from client Success!', this.listOrder.length);
        this.total = this.listOrder.length;
        this.pendding = !this.pendding;
    }
    SearchByFilter() {


        switch (this.CheckDatetime()) {
            case 1:
                this.findserver();
                break;
            case 2:
                this.findclient();


        }
    }

    SubmitTimkiem() {
        this.SearchByFilter();
    }






    SelectAllBizProducts() {
        this.numbercheck = 0;
        if (this.checkAll === false) {
            for (var i in this.listOrder) {
                this.listOrder[i].checked = true;

                this.numbercheck += 1;
                this.orderselect = this.numbercheck;

            }
            if (this.orderselect > 20) {
                toastr.warning('Số lượng đơn hàng được chọn để in không vượt quá 20', "Thông báo");
            }
        } else {
            for (var i in this.listOrder) {
                this.listOrder[i].checked = false;
                this.orderselect = 0;
                this.numbercheck = 0;
            }
        }
        this.checkAll = !this.checkAll;


    }
    searchSchoolDistrict() {
        this.numbercheck = 0;
        this.orderselect = 0;
        for (var i in this.listOrder) {
            if (this.listOrder[i].checked == true) {
                this.numbercheck += 1;
                this.orderselect = this.numbercheck;

            }

        }
        if (this.orderselect > 20) {
            toastr.warning('Số lượng đơn hàng được chọn để in không vượt quá 20', "Thông báo");
        }

    }

    ViewOrder(DN) {

        this.dialogService.open({
            viewModel: ViewOrderDlg,
            model: DN
        }).then((result) => {

            // if (!result.wasCancelled) {
            //     if (result.output.Id > 0) {

            //         this.eventSaleService.UpdateEventSale(result.output).then(rs => {

            //             if (rs.Result == true) {
            //                 this.activate();
            //                 toastr.success('Cập nhật EventSale thành công!', "EventSale");
            //             } else {
            //                 this.activate();
            //                 toastr.success('Lỗi không cập nhật EventSale!', "EventSale");

            //             }

            //         })
            //     } else {


            //         this.eventSaleService.InsertEventSale(result.output).then(rs => {
            //             if (rs.Result == true) {

            //                 this.activate();
            //                 toastr.success('Tạo mới EventSale thành công!', "EventSale");

            //             } else {
            //                 toastr.success('Lỗi không Tạo mới EventSale!', "EventSale");
            //                 this.activate();
            //             }

            //         })

            //     }

            // } else {

            // }
        });
    }

}


export class FilterByLoaiDonHangValueConverter {
    toView(array, chinhanh) {
        if (chinhanh != "" && chinhanh != null && typeof chinhanh !== "undefined") {
            return array.filter(x => x.LoaiDonhang != null && x.LoaiDonhang == chinhanh);
        }
        return array;
    }
}
export class FilterByQuanLyDonHangValueConverter {
    toView(array, mndh) {
        if (mndh != "" && mndh != null && typeof mndh !== "undefined") {
            return array.filter(x => x.OrderManagerId != null && x.OrderManagerId == mndh);
        }
        return array;
    }
}

export class FilterByAffValueConverter {
    toView(array, aff) {
        if (aff != "" && aff != null && typeof aff !== "undefined") {
            return array.filter(x => x.AffiliateId != null && x.AffiliateId == aff);
        }
        return array;
    }
}


export class FilterByTrangThaiValueConverter {
    toView(array, tinhtrang) {
        if (tinhtrang != "" && tinhtrang != null && typeof tinhtrang !== "undefined") {
            return array.filter(x => x.Trangthai != null && x.Trangthai == tinhtrang);
        }
        return array;
    }
}


export class FilterByCSValueConverter {
    toView(array, obj) {
        if (obj == "") {
            return array;
        } else {
            return array
                .filter(x => x.Macn === obj);
        }
    }
}
export class FilterchinhanhValueConverter {
    toView(array, chinhanh) {
        if (chinhanh != "" && chinhanh != null && typeof chinhanh !== "undefined") {
            return array.filter(x => x.Macn != null && x.Macn == chinhanh);
        }
        return array;
    }
}


export class FilterByPhoneValueConverter {
    toView(array, obj) {

        if (obj) {
            return array
                .filter(x => ((x.Phone != null) && (x.Phone.toLowerCase().indexOf(obj.trim().toLowerCase()) != -1 ||
                    ((x.TenKh != null) && (x.TenKh.toLowerCase().indexOf(obj.trim().toLowerCase()) != -1)) ||
                    ((x.Email != null) && (x.Email.toLowerCase().indexOf(obj.trim().toLowerCase()) != -1)) ||
                    ((x.MaDonhang != null) && (x.MaDonhang == obj))
                )));
        }
        return array;
    }
}

export class FilterByTongTienValueConverter {
    toView(array, num1, num2) {

        if (num1 === undefined && num2 === undefined) {
            return array;
        } else {
            return array.filter((x) => {
                ((x.Tongtien >= num1) && (x.Tongtien >= num1));
                console.log(array);
            });
        }
    }
}


export class FilterByNameValueConverter {
    toView(array, obj) {
        if (obj) {
            return array
                .filter(x => ((x.Name != null) && (x.Name.toLowerCase().indexOf(obj.trim().toLowerCase()) != -1)) ||
                    ((x.BusinessCode != null) && (x.BusinessCode.toLowerCase().indexOf(obj.trim().toLowerCase()) != -1)) ||
                    ((x.Phone != null) && (x.Phone.toLowerCase().indexOf(obj.trim().toLowerCase()) != -1)) ||
                    ((x.Manhanvien != null) && (x.Manhanvien.toLowerCase().indexOf(obj.trim().toLowerCase()) != -1))

                );
        }
        return array;
    }
}