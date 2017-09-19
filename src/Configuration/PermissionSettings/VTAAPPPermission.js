  import _ from 'lodash';
export const VTAAPP = ["ADMIN", "VTAAPP", "AFFILIATEADMIN", "ReportVTAAPP"];

  export class VTAAPPPermission {

      arr = [];
      kq = 0;
      IsLength() {
          return this.arr.length;
      }
      IsArray(item) {

          this.arr.push(item);
          //   console.log('Role Users', JSON.stringify(this.arr));
      }
      IsPermission() {

          for (let i of this.arr) {
              //   console.log('> Kiểm tra', i, '---',
              //       _.includes(QuanLySanPhamaff, i));
              if (_.includes(VTAAPP, i) == true) {
                  //      console.log('>', 'Successfull');
                  this.kq += 1;
              }
          }

          if (this.kq == 0) {
              return false;
          } else {
              return true;
          }
      }

  }