import _ from 'lodash';
export const Admin = ["ADMIN", "CM_AdminCS"]; // Role cho cac action
export const Nhanvien = ["CM_NhanVienCS"]; // Role cho cac action
export const exportexcel = ["WebcommentcsExport"]
export class CommentCSPermission {

    arr = [];
    kq = 0;
    nv = 0;
    rp=0;
    IsLength() {
        return this.arr.length;
    }
    IsArray(item) {

        this.arr.push(item);

    }

    isFull() {
        for (let i of this.arr) {
            if (_.includes(Admin, i) == true) {
                this.kq += 1;
            }
        }
        if (this.kq > 0) {
            return true;
        }
    }


    isLimit() {

        for (let i of this.arr) {

            if (_.includes(Nhanvien, i) == true) {

                this.nv += 1;
            }
        }
        if (this.nv > 0) {
            return true;
        }

    }
    isExportFnc() {
        for (let i of this.arr) {
            if (_.includes(exportexcel, i) == true) {
                this.rp += 1;
            }
            else{
                this.rp=0;
            }
        }
       
      if (this.rp > 0) {
            return true;
        }
        else{
            return false;
        }
        
    }
    isFullFnc() {


        for (let i of this.arr) {

            if (_.includes(Admin, i) == true) {

                this.kq += 1;
            }
        }
        if (this.nv > 0) {
            return true;
        } else {
            return false;
        }

    }
}