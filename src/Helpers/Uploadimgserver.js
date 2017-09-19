import { inject, transient, NewInstance } from 'aurelia-framework';
import { HttpClient, json } from 'aurelia-fetch-client';
@inject(NewInstance.of(HttpClient))
export class Uploadimgserver {
    rs="";
    constructor(http) {
        this.http = http;
        this.httpInstance = http;
    }

    UploadImageSimSo(listImage, Fileno) {
       
        let fileArray = listImage;
        let formData = new FormData()
        for (let i = 0; i < fileArray.length; i++) {
            console.log(fileArray[i].name)
            formData.append("userfilename", fileArray[i].name);
            formData.append("userfile", fileArray[i]);

            var req = new XMLHttpRequest();
            req.open('POST', 'http://10.10.40.142:8899/v2/upload-image', true);
            req.onload = function () {
                this.rs = this.response.substring(1, this.response.length - 1);
            };
            req.onerror = () => {
            }
            req.send(formData);

        }
        console.log(this.rs)
        return this.rs;
    }
} 