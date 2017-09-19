  import _ from 'lodash';
  export const Admin = ["ADMIN", "CM_AdminSO"]; // Role cho cac action
  export const Nhanvien = ["CM_NhanVienSO"]; // Role cho cac action


  export class CommentSOPermission {

      arr = [];
      kq = 0;
      nv = 0;
      IsLength() {
          return this.arr.length;
      }
      IsArray(item) {

          this.arr.push(item);
          // console.log('Role Users', JSON.stringify(this.arr));
      }

      isLimit() {

          //  console.log('> Nhanvien');
          for (let i of this.arr) {
              //    console.log('> Kiểm tra', i, '---',
              //      _.includes(Nhanvien, i));
              if (_.includes(Nhanvien, i) == true) {
                  //  console.log('>Nhanvien', 'Successfull');
                  this.nv += 1;
              }
          }
          if (this.nv > 0) {
              return true;
          }

      }
      isFull() {
          //  console.log('> Admin');
          for (let i of this.arr) {
              //    console.log('> Kiểm tra', i, '---',
              //       _.includes(Admin, i));
              if (_.includes(Admin, i) == true) {
                  //       console.log('>Admin', 'Successfull');
                  this.kq += 1;
              }
          }

          if (this.kq > 0) {
              return true;
          }
          //   console.log('> Admin');
          //   for (let i of this.arr) {
          //       console.log('> Kiểm tra', i, '---',
          //           _.includes(Admin, i));
          //       if (_.includes(Admin, i) == true) {
          //           console.log('>Admin', 'Successfull');
          //           this.kq += 1;
          //       } else {
          //           this.kq = 0;
          //       }
          //   }
          //   if (this.kq > 0) {
          //       return true;
          //   }
      }
  }