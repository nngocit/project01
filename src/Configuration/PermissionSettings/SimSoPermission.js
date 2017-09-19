import _ from 'lodash';
export const AdminQLDHSimSo = ["SimSo_AdminSO"];
export const NhanvienQLDHSimSo = ["SimSo_NhanVienSO"];
export class SimSoPermission {

    arr = [];
    kq = 0;
    nv = 0;
    rp = 0;
    IsLength() {
        return this.arr.length;
    }
    IsArray(item) {

        this.arr.push(item);
    }

    isFull() {
        for (let i of this.arr) {
            if (_.includes(AdminQLDHSimSo, i) == true) {
                this.kq += 1;
            }
        }
        if (this.kq > 0) {
            return true;
        }
    }


    isLimit() {
        for (let i of this.arr) {
            if (_.includes(NhanvienQLDHSimSo, i) == true) {
                this.nv += 1;
            }
        }
        if (this.nv > 0) {
            return true;
        }
    }

}