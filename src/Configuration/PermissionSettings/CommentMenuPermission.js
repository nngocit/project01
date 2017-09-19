  import _ from 'lodash';
  export const CsMenuMain = ["ADMIN", "CM_AdminCS", "CM_NhanVienCS"]; // Role cho cac main page
  export const MotMenuMain = ["ADMIN", "CM_AdminSO", "CM_NhanVienSO"]; // Role cho cac main page
  export class CommentMenuPermission {

      arr = [];
      cs = 0;
      mot
      IsLength() {
          return this.arr.length;
      }
      IsArray(item) {

          this.arr.push(item);
          //console.log('Role Users', JSON.stringify(this.arr));
      }

      isCs() {
          for (let i of this.arr) {
              //  console.log('> Kiểm tra', i, '---',
              //   _.includes(CsMenuMain, i));
              if (_.includes(CsMenuMain, i) == true) {
                  //  console.log('>', 'Successfull');
                  this.cs += 1;
              }
          }

          if (this.cs == 0) {
              return false;
          } else {
              return true;
          }
      }
      isSO() {
          for (let i of this.arr) {
              //  console.log('> Kiểm tra', i, '---',
              //     _.includes(MotMenuMain, i));
              if (_.includes(MotMenuMain, i) == true) {
                  //  console.log('>', 'Successfull');
                  this.mot += 1;
              }
          }

          if (this.mot == 0) {
              return false;
          } else {
              return true;
          }
      }

  }