import { inject } from 'aurelia-framework';
import { RouteMenu } from 'Helpers/RouteMenuHelper';
import * as RouteMenuSettings from 'Configuration/RouteMenuSettings';
import { MotMenuPermission } from 'Configuration/PermissionSettings/MotMenuPermission';
@inject(RouteMenu, MotMenuPermission)
export class MOTMenu {

    constructor(routeMenu, motMenuPermission) {
        this.routeMenu = routeMenu;
        this.motMenuPermission = motMenuPermission;

        this.showDropdownComment = false;
        this.showDropdownEvent = false;
        this.showDropdownReport = false;
        this.showDropdownQuanLyDonHang = false;
        this.showDropdownSanPham = false;
        this.showDropdownEnterpriseVM = false;
        this.showDropdownAffiliate = false;
        this.showDropdownNotification == false;
        this.showDropdownBlockHTML == false;

    }
    activate() {

        var listrole = Lockr.get('UserInfo').Roles;


        for (let i of listrole) {
            this.motMenuPermission.IsArray(i.Code);
        }
      
        this.showDropdownSanPham = this.motMenuPermission.isSanPham();
        this.showDropdownEvent = this.motMenuPermission.isEvent();
        this.showDropdownReport = this.motMenuPermission.isReport();
        this.showDropdownQuanLyDonHang = this.motMenuPermission.isQlDonHang();
        this.showDropdownEnterpriseVM = this.motMenuPermission.isFactory();
        this.showDropdownAffiliate = this.motMenuPermission.isAff();
        this.showDropdownComment = this.motMenuPermission.CommentMot();
        this.showDropdownBlockHTML = this.motMenuPermission.BlockHTMLMot();
        this.showDropdownNotification = this.motMenuPermission.isVTAAPP();

    }
    configureRouter(config, router) {
        config.map([RouteMenuSettings.MOTMenus[0]]);
        config.map([RouteMenuSettings.MOTMenuAction]);
        this.routeMenu.SetMenuCon(config, RouteMenuSettings.MOTMenus, "MOTMenus");
        this.router = router;



    }
    attached() {
        $("div").scroll(function () {

            if ($(window).scrollTop() > 1) {
                $('#nav_bar').removeClass('navbar-fixed');

            }
            if ($(window).scrollTop() < 2) {
                $('#nav_bar').addClass('navbar-fixed');

            }
        });
    }
}