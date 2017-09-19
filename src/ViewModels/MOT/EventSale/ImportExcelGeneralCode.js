import { DialogController } from 'aurelia-dialog';
import { inject } from 'aurelia-dependency-injection';
import 'eonasdan-bootstrap-datetimepicker';

import { Validation } from 'aurelia-validation';
import * as toastr from "toastr";

@inject(DialogController, Validation)
export class ImportExcelGeneralCode {
    dialogController: DialogController;

    constructor(dialogController, validation) {
        this.dialogController = dialogController;
    }

    activate() {}


    attached() {

    }

}