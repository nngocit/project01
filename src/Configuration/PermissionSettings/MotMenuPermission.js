import _ from 'lodash';
export const VTAAPP = ["ADMIN", "VTAAPP", "AFFILIATEADMIN", "ReportVTAAPP"];
export const SanPham = ["ADMIN", "AFFILIATEADMIN", "SaleOnline", "NVSALEONLINE", "QLGSDoiTraHang"];
export const Event = ["ADMIN", "SaleOnline"];
export const Report = ["ADMIN", "SaleOnline", "Report"];
export const QlDonHang = ["ADMIN", "SaleOnline", "NVSALEONLINE", "GiaodichOnline","SimSo_AdminSO","SimSo_NhanVienSO"];
export const Factory = ["VTA-DOANHNGHIEP", "TEAMLEAD", "DEV", "ADMIN", "SaleOnline", "NVSALEONLINE"];
export const AFFILIATE = ["AFFILIATEADMIN", "ADMIN", "SaleOnline"];
export const CommentMot = ["ADMIN", "CM_AdminSO", "CM_NhanVienSO"];
export const BlockHTML = ["ADMIN", "AFFILIATEADMIN"];

export const AdminDoiTraHang = ["ADMIN", "AFFILIATEADMIN", "SaleOnline",];
export const NhanvienQLGSDoiTraHang = ["QLGSDoiTraHang"];



export class MotMenuPermission {

    arr = [];
    kq = 0;
    IsLength() {
        return this.arr.length;
    }
    IsArray(item) {

        this.arr.push(item);
    }
    CommentMot() {
        for (let i of this.arr) {
            if (_.includes(CommentMot, i) == true) {
                this.kq += 1;
            }
        }

        if (this.kq == 0) {
            return false;

        } else {
            this.kq = 0;
            return true;
        }
    }
    BlockHTMLMot() {
        for (let i of this.arr) {
            if (_.includes(BlockHTML, i) == true) {
                this.kq += 1;
            }
        }
        if (this.kq == 0) {
            return false;
        } else {
            this.kq = 0;
            return true;
        }
    }
    isAff() {
        for (let i of this.arr) {
            if (_.includes(AFFILIATE, i) == true) {
                this.kq += 1;
            }
        }

        if (this.kq == 0) {
            return false;

        } else {
            this.kq = 0;
            return true;
        }
    }
    isFactory() {
        for (let i of this.arr) {
            if (_.includes(Factory, i) == true) {
                this.kq += 1;
            }
        }

        if (this.kq == 0) {
            return false;

        } else {
            this.kq = 0;
            return true;
        }
    }
    isQlDonHang() {
        for (let i of this.arr) {
            if (_.includes(QlDonHang, i) == true) {
                this.kq += 1;
            }
        }

        if (this.kq == 0) {
            return false;

        } else {
            this.kq = 0;
            return true;
        }
    }
    isVTAAPP() {
        for (let i of this.arr) {
            if (_.includes(VTAAPP, i) == true) {
                this.kq += 1;
            }
        }

        if (this.kq == 0) {
            return false;

        } else {
            this.kq = 0;
            return true;
        }
    }

    isSanPham() {
        for (let i of this.arr) {
            if (_.includes(SanPham, i) == true) {
                this.kq += 1;
            }
        }

        if (this.kq == 0) {
            return false;
        } else {
            this.kq = 0;
            return true;
        }
    }
    isEvent() {
        for (let i of this.arr) {
            if (_.includes(Event, i) == true) {
                this.kq += 1;
            }
        }

        if (this.kq == 0) {
            return false;
        } else {
            this.kq = 0;
            return true;
        }
    }
    isReport() {
        for (let i of this.arr) {
            if (_.includes(Report, i) == true) {
                this.kq += 1;
            }
        }

        if (this.kq == 0) {
            return false;
        } else {
            this.kq = 0;
            return true;
        }
    }
    isQuanLyGiamSat() {
        for (let i of this.arr) {
            if (_.includes(NhanvienQLGSDoiTraHang, i) == true) {
                this.kq += 1;
            }
        }
        if (this.kq > 0) {
            return true;
        }
        else{
             return false;
        }
    }
     isQuanLyDHSimSo() {
        for (let i of this.arr) {
            if (_.includes(AdminQLDHSimSo, i) == true) {
                this.kq += 1;
            }
        }
        if (this.kq > 0) {
            return true;
        }
        else{
             return false;
        }
    }
}