  import _ from 'lodash';
  export const QuanLySanPhamaff = ["AFFILIATEADMIN", "ADMIN", "SaleOnline", "NVSALEONLINE"];

  export class RoSanPhamAffPermission {

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
              if (_.includes(QuanLySanPhamaff, i) == true) {
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