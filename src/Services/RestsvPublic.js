import {
    inject
} from 'aurelia-framework';
import axios from 'axios';
import * as toastr from "toastr";
import * as APISettings from 'Configuration/APISettings';
import { Configuration } from '../Services/Configuration';
@inject(Configuration)
export class Restsv {

    constructor(config) {
        this.GiaoDichOnline = config.GiaoDichOnline;
        this.VNPOST = config.WebPublicApiVNPOST;
        this.SimOnline = config.AdmincpTest;
        this.Webcomment = config.Webcomment;
        this.Admincp = config.AdmincpTest;
        this.ConfigURL();
    }
    ConfigURL() {
        this.vnpost = axios.create({
            baseURL: this.VNPOST
        });
        this.Gdonline = axios.create({
            baseURL: this.GiaoDichOnline
        });
        this.SimOnline = axios.create({
            baseURL: this.SimOnline
        });
        this.Webcomment = axios.create({
            baseURL: this.Webcomment
        });
        this.Admincp = axios.create({
            baseURL: this.Admincp
        });
    }

    CheckUser() {
        if (Lockr.get('UserInfo') == null || typeof Lockr.get('UserInfo') === "undefined") {
            return false;
        } else
            return true;

    }


    GetV2(query, EndPoint) {
        let _name
        if (EndPoint == "SimOnline") {
            _name = this.SimOnline;
        }
        if (EndPoint == "Admincp") {
            _name = this.Admincp;
        }
        if (EndPoint == "Gdonline") {
            _name = this.Gdonline;
        }
        if (EndPoint == "vnpost") {
            _name = this.vnpost;
        }
        if (EndPoint == "webcomment") {
            _name = this.Webcomment;
        }
        
        if (this.CheckUser()) {
            return new Promise((resolve, reject) => {
                _name.get(query).then(response => {
                    resolve(response);
                })
                    .catch(error => {
                        if (error.response) {
                            resolve(error.response);
                            toastr.error(error.response.data.Message+'"'+error.response.statusText+'"', "Lỗi: "+error.response.status, "ADMINCP");
                        }

                    })


            })
        }
    }


    PostV2(url, json, EndPoint) {
        let _name
        if (EndPoint == "Admincp") {
            _name = this.Admincp;
        }
        if (EndPoint == "SimOnline") {
            _name = this.SimOnline;
        }
        if (EndPoint == "Gdonline") {
            _name = this.Gdonline;
        }
        if (EndPoint == "vnpost") {
            _name = this.vnpost;
        }
        if (EndPoint == "webcomment") {
            _name = this.Webcomment;
        }
        if (this.CheckUser()) {
            return new Promise((resolve, reject) => {
                _name.post(url, json).then(response => {
                    resolve(response);
                })
                    .catch(error => {
                        if (error.response) {
                            resolve(error.response);
                       
                            toastr.error(error.response.data.Message+'"'+error.response.statusText+'"', "Lỗi: "+error.response.status, "ADMINCP");
                        }

                    })


            })
        }
    }
    PutV2(url, json, EndPoint) {
        let _name
        if (EndPoint == "Admincp") {
            _name = this.Admincp;
        }
        if (EndPoint == "SimOnline") {
            _name = this.SimOnline;
        }
        if (EndPoint == "Gdonline") {
            _name = this.Gdonline;
        }
        if (EndPoint == "vnpost") {
            _name = this.vnpost;
        }
        if (EndPoint == "webcomment") {
            _name = this.Webcomment;
        }
        if (this.CheckUser()) {
            return new Promise((resolve, reject) => {
                _name.put(url, json).then(response => {
                    resolve(response);
                })
                    .catch(error => {
                        if (error.response) {
                        
                            toastr.error(error.response.data.Message+'"'+error.response.statusText+'"', "Lỗi: "+error.response.status, "ADMINCP");
                        }

                    })
            })
        }
    }

}

