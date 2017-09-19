import toastjss from 'toastjss';
import * as jquery from 'jquery'

export class ShowMsg {

    Msg() {
        $.toast({
            heading: 'QUẢN LÝ GIAO DỊCH ONLINE',
            text: 'Cập nhật trạng thái giao dịch thẻ cào Online thành công.',
            icon: 'success',
            loader: true, // Change it to false to disable loader
            loaderBg: '#9EC600', // To change the background,
            position: 'bottom-right',
        })
    }
}