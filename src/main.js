import 'bootstrap';
import 'cookie-monster';
import 'lockr';
import 'jquery';


//import 'semantic';

import regeneratorRuntime from 'babel-runtime/regenerator';
window.regeneratorRuntime = regeneratorRuntime;


export function configure(aurelia) {
    aurelia.use
        .standardConfiguration()
        .developmentLogging()

    .plugin('aurelia-validation')
        .plugin('toastr')
        .plugin('Helpers/ValueConverterHelper')
        .plugin('tungptvn/aurelia-paginator').plugin('aurelia-ui-virtualization')

    .plugin('aurelia-dialog', config => {
            config.useDefaults();
            config.settings.lock = true;
            config.settings.centerHorizontalOnly = false;
            config.settings.startingZIndex = 1000;
              config.settings.enableEscClose = true;
        })
        .plugin('aurelia-api', config => {
            config.registerEndpoint('apilocal', 'http://local.vienthonga.com/');
            config.registerEndpoint('comment', 'http://10.10.40.171:8083/');
        })

    .plugin('ag-grid-aurelia')
    aurelia.start().then(a => a.setRoot());

}