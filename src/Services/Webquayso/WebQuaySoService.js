import * as APISettings from 'Configuration/APISettings';
import { inject, transient } from 'aurelia-framework';
import { HttpService } from 'Services/HttpService';

@inject(HttpService)
@transient()
export class WebQuaySoService {

    constructor(httpService) {
        this.httpService = httpService;
    }

    //Table Gift
    GetKetQuaKhachhangtrunggiai(jsonToPost) {
        return this.httpService.GetData(APISettings.APIGetKetQuaKhachhangtrunggiai, 'post', jsonToPost);
    }

    GetKetQuaQuaySo(jsonToPost) {
        return this.httpService.GetData(APISettings.APIGetKetQuaQuaySo, 'post', jsonToPost);
    }
    GetListQuaTang() {
        return this.httpService.GetData(APISettings.APIGetListQuaTangMKT, 'get', null);
    }
    UpdateQuaTang(jsonToPost) {
            return this.httpService.GetData(APISettings.APIUpdateQuaTangMKT, 'post', jsonToPost);
        }
        //Table Gift
    GetListQuaySoKhachHang(jsonToPost) {
        return this.httpService.GetData(APISettings.APIGetListQuaySoKhachHang, 'post', jsonToPost);
    }


    GetKetQuaQuaySoTV(jsonToPost) {
        return this.httpService.GetData(APISettings.APIGetKetQuaQuaySoTV, 'post', jsonToPost);
    }

    //Table Gift
    GetKetQuaKhachHangTrungGiaiTV(jsonToPost) {
            return this.httpService.GetData(APISettings.APIGetKetQuaKhachHangTrungGiaiTV, 'post', jsonToPost);
        }
        //Quay số marketing
    GetKetQuaKhachHang(jsonToPost) {
        return this.httpService.GetData(APISettings.APIGetKetQuaKhachHangMKT, 'post', jsonToPost);
    }

    GetKetQuaKhachHangPrime(jsonToPost) {
        return this.httpService.GetData(APISettings.APIGetKetQuaKhachHangPrime, 'post', jsonToPost);
    }

    GetListKetQuaKhachHang(jsonToPost) {
        return this.httpService.GetData(APISettings.APIGetListKetQuaKhachHangMKT, 'post', jsonToPost);
    }
    GetKhachHangTrungGaVangDongTien(jsonToPost) {
        return this.httpService.GetData(APISettings.KhachhangtrungGaVangDongTien, 'post', jsonToPost);
    }
    GetListKhachHangTrungGaVangDongTien(jsonToPost) {
        return this.httpService.GetData(APISettings.DsKhachhangtrungGaVangDongTien, 'post', jsonToPost);
    }
    Resetkqquayso(id) {
        var query = '?LoaiQua=' + id;
        return this.httpService.GetData(APISettings.ResetKqquayso + query, 'get', null);
    }
}