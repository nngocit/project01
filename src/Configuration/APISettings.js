//Use for localhost
//export const AdminCpApiUrlBase = 'http://apiadmincp.vienthonga.vn/';
//export const AdminCpApiUrlBase = 'http://localhost:10495/';
//export const AdminCpApiUrlBase = 'http://localhost:10496/';
export const AdminCpApiUrlBase = 'http://10.10.40.171:8082/'; //Testing mode
export const Webcomment = 'http://10.10.40.171:8083/';
//export const Webcomment = 'http://10.10.40.171:8084/';
//export const Webcomment = 'http://localhost:10495/';
export const WebPublicApiUrlBase = 'https://publicapi.vienthonga.vn/';

//export const AdminCpApiUrlBase = 'http://localhost:10495/';
//export const WebPublicApiUrlBase = 'http://localhost:65387/';
export const WebPublicApiVNPOST = 'https://apivnpost.vienthonga.vn/';
//export const WebPublicApiVNPOST = 'http://10.10.41.171:8081/';

//export const LocalApiUrlBase = 'http://local.vienthonga.com/';
export const LocalApiUrlBase = 'http://10.10.40.141:8880/';
//export const LocalApiUrlBase = 'http://localhost:65381/';
//export const LocalApiUrlBase = 'http://localhost:10494/';
export const GiaoDichOnline = 'http://10.10.40.171:8082/'; 
//export const GiaoDichOnline = 'http://localhost:10496/';

export const PushNotificationApi = 'http://10.10.40.171:8085/';
//export const PushNotificationApi = 'http://localhost:8085/';

export const Environment = "TEST"; //TEST or LIVE


//List API URLS for QuaySoService
export const APIGetListQuaySoGift = "quayso-api/GetListQuaySoGift";
export const APIGetListQuaySoCondition = "quayso-api/GetListQuaySoCondition";
export const APIGetListQuaySoConditionGift = "quayso-api/GetListQuaySoConditionGift";
export const APIInsertOrUpdateQuaySoGift = "quayso-api/InsertOrUpdateQuaySoGift";
export const APIInsertOrUpdateQuaySoCondition = "quayso-api/InsertOrUpdateQuaySoCondition";
export const APIInsertOrUpdateQuaySoConditionGift = "quayso-api/InsertOrUpdateQuaySoConditionGift";
export const APIGetListQuaySoResult = "quayso-api/GetListQuaySoResult";
export const APIUpdateQuaySoResult = "quayso-api/UpdateQuaySoResult";
export const APISearchQuaySoResult = "quayso-api/SearchQuaySoResult?key=";
export const APIGetListQuaySoBranch = "branch-api/AllConfigData";
export const APIGetListAllBranch = "branch-api/ListAllBranch";
export const APIGetListQuaySoBranchSapHetHang = "quayso-api/GetListBranchSapHetQua";
export const APIGetListQuaySoCampaign = "quayso-api/GetListQuaySoCampaign";
export const APIUpdateQuaySoCampaign = "quayso-api/UpdateQuaySoCampaign";
export const APIGetListQuaTuongUngBranch = "quayso-api/GetListQuaTuongUngBranch";
export const APIGetKetQuaQuaySoHangThang = "quayso-api/GetKetQuaQuaySoHangThang";


//WebQuaySo
export const APIGetKetQuaKhachhangtrunggiai = "webquayso-api/GetKetQuaKhachhangtrunggiai";
export const APIGetKetQuaQuaySo = "webquayso-api/GetKetQuaQuaySo";
export const APIGetListQuaySoKhachHang = "webquayso-api/GetDanhsachKhachhangImport";
// WebQuaySoMKT
export const APIGetKetQuaKhachHangMKT = "webquayso-api/GetKetQuaQuaySoMKT";
export const APIGetListKetQuaKhachHangMKT = "webquayso-api/GetListKetQuaKhachHangTrungGiaiTV";
export const APIGetListQuaTangMKT = "webquayso-api/GetListQuaTang";
export const APIUpdateQuaTangMKT = "webquayso-api/UpdateQuaTang";


//QuaySo Prime - 20170225
export const APIGetKetQuaKhachHangPrime = "webquayso-api/GetKetQuaQuaySoPrime";

//QuaySoTrungVang
export const APIGetKetQuaQuaySoTV = "webquayso-api/GetKetQuaQuaySoSamsung";
export const APIGetKetQuaKhachHangTrungGiaiTV = "webquayso-api/GetKetQuaKhachHangTrungGiaiTV";

//List APIs for Notification
export const APIGetListAppDevice = "notification-api/GetListAppDevice";
export const APIInsertNotificationLog = "notification-api/InsertNotificationLog";
export const APISendMesageNotiAndroid = "notification-api/SendMesageNotiAndroid";
export const APISendMesageNotiIOS = "notification-api/SendMesageNotiIOS";
// export const APISendNotification = "notification-api/SendNotification";
export const APISendNotificationv2 = "notification-api/SendNotificationv2";

export const APIGetPushProgressInfo = "notification-api/GetPushProgressInfo";
export const APIGetListAppEmployee = "notification-api/GetListAppEmployee";
export const APISearchListAppEmployee = "notification-api/SearchListAppEmployee";
export const APISearchListAppEmployeeV2 = "notification-api/SearchListAppEmployeeV2";
export const APIGetListBuAllConfig = "notification-api/GetAppEmployeeConfigData";
//List API URLs for UserService
export const APILogIn = "user-api/login";
export const APILogOut = "user-api/logout";
export const APIGetListRoles = "user-api/GetRoles";
export const APIGetListUserbyCompanyId = "user-api/GetListUserbyCompanyId";
export const APIGetListTeamleadbyCompanyId = "user-api/GetListTeamleadbyCompanyId";
export const APIUpdateUser = "user-api/UpdateUser";
export const APIResetPassword = "user-api/ResetPassword";
export const APIUserChangePass = "user-api/UserChangePass";
export const APIUpdateUserInfo = "user-api/UpdateUserInfo";
export const APIDoanhNghiepGetListProduct = "doanhnghiep-api/GetListProduct";
export const APIDoanhNghiepGetListProductColor = "doanhnghiep-api/GetListProductColor";
export const APIDoanhNghiepGetListOrders = "doanhnghiep-api/GetListOrders";
export const APIDoanhNghiepListDoanhNghiep = "doanhnghiep-api/ListDoanhNghiep";
export const APIDoanhNghiepInsertOrderCash = "doanhnghiep-api/InsertOrder";
export const APIDoanhNghiepGetListStatusOrder = "doanhnghiep-api/GetListstatus";
export const APIDoanhNghiepGetListOrdersDetail = "doanhnghiep-api/GetOrderDetail";
export const APIDoanhNghiepGetListCategory = "product-api/GetListCategory";
export const APIDoanhNghiepGetListAddress = "doanhnghiep-api/ListDiaChi";
export const APIDoanhNghiepDeleteOrder = "doanhnghiep-api/DeleteOrder";
export const APIDoanhNghiepUpdateOrder = "doanhnghiep-api/UpdateOrder";
export const APIDoanhNghiepInsertBusiness = "doanhnghiep-api/InsertBusiness";
export const APIDoanhNghiepUpdateBusiness = "doanhnghiep-api/UpdateBusiness";
export const APIDoanhNghiepOrderToPos = "doanhnghiep-api/OrderToPos";
export const APIDoanhNghiepDelBusiness = "doanhnghiep-api/DeleteBusiness";
export const APIDoanhNghiepListKhachHangDN = "doanhnghiep-api/ListKhachhangDN";
export const APIDoanhNghiepUpdateKhachHangDN = "doanhnghiep-api/UpdateKhachhangDoanhnghiep";
export const APIDoanhNghiepDeleteKhachHangDN = "doanhnghiep-api/DeleteKhachhangDoanhnghiep";
export const APIDoanhNghiepUpdateListStatusKhachHangDN = "doanhnghiep-api/UpdateListStatuskh";
export const APIDoanhNghiepListDanhSachLienHe = "doanhnghiep-api/DanhsachLienHe";
export const APIGetListBlock = "product-api/GetListBlock";
export const APIGetListSponsor = "product-api/GetListSponsor";
export const APIInsertSponsorProduct = "product-api/InsertSponsor";
//List API URLS for EnterpriseService
export const APIGetListBizProducts = "doanhnghiep-api/GetListProductsDetail";
export const APIUpdateBusinessProduct = "doanhnghiep-api/UpdateBusinessProduct";
export const APIDeleteListProduct = "doanhnghiep-api/DeleteListProduct";
export const APIUpdateCampaignAllProductCode = "doanhnghiep-api/UpdateCampaignAllProductCode";
export const APIUpdateStatusListProduct = "doanhnghiep-api/UpdateStatusListProduct";
export const APITinhTien = "doanhnghiep-api/TinhTragop?tongtien=";
export const APILisTraGop = "doanhnghiep-api/ListTragop?unit=PPF";

//User
export const APIInsertRoles = "user-api/CreateRole";
export const APIListMenu = "user-api/GetMenus";
export const APIInsertMenu = "user-api/InsertMenus";
export const APIUpdateMenu = "user-api/UpdateMenus";
export const APIDoanhNghiepListDanhSachTon = "ton-api/GetListInventoryStock";

//Co-Brand
export const APISearchCoBrandItem = "cobrand-api/SearchCoBrandItem?keyword=";
export const APIInsertCoBrandItem = "cobrand-api/InsertCoBrandItem";

//Quản lý đơn hàng
export const APIMOTGetListOrder = `order-api/GetListOrder`;

//Quản lý report Order
export const APIMOTGetReportOrderFlashDeal = `order-api/GetReportOrderFlashDeal`;
export const APIMOTGetReportPreOrder = `order-api/GetReportPreOrder`;
//Quản lý report Order Private Sale
export const APIMOTGetOrderCamPaignBusinessPrivateSale = `v2/PrivateSale/GetOrderBusinessCampaignPrivate`;
export const APIMOTGetOrderPrivateSale = `v2/PrivateSale/GetListOrderBusinessCampaignOfPrivateSale`;

//Quan ly event EventSale
export const APIMOTGetListEventSale = `event-api/GetListEventSale`;
export const APIMOTInsertEventSale = `event-api/InsertEventSale`;
export const APIMOTUpdateEventSale = `event-api/UpdateEventSale`;
export const APIMOTDeactiveEventSale = `event-api/DeactiveEventSale?id=`;

//Tra cứu hàng tồn
export const APISearchProduct = `search-api/SearchProduct`;


export const APISearchCombo = `combokm-api/Listcombo`;
export const APISearchGiamGiaTyle = `combokm-api/GetListGiamGiaTyLe`;

export const APIInsertAdminCpLog = `log-api/InsertAdminCpLog`;



// Api Webcomment

export const comments = `comments/`;


// GiaoDichOnline
export const GetAllconfig = `qlgdonline-api/GetAllConfigData`;

export const SearchCardOrder = `qlgdonline-api/SearchCardOrderV2`;
export const UpdateStatusCardOrder = `qlgdonline-api/UpdateStatusCardOrder`;
export const GetCardOrderDetail = `qlgdonline-api/GetCardOrderDetail`;
export const SmsCard = `qlgdonline-api/SendSms`;

// Quay số gà vàng
export const KhachhangtrungGaVangDongTien = `webquayso-api/GetKetQuaQuaySoGaVangDongTien`;
export const DsKhachhangtrungGaVangDongTien = `webquayso-api/GetKetQuaQuaySoGaVangDongTienForDropDownList`;


// Reset ket qua quay so
export const ResetKqquayso = `webquayso-api/ResetKetQua`;

//FlashDeal,HotDeal
export const GetListCampaignForPrivateSale = 'mobileapp-api/GetListCampaignForPrivateSale';
export const GetListProductByCampaignId = 'mobileapp-api/GetListProductByCampaignId';
export const APISendNotificationv2Test = "notification-api/SendNotificationv2Test";

// Block HTML
export const GetListBanner='api/Banner/GetListBanner'
export const GetListBlockHtmlByCampainName='banner-api/GetListBlockHtmlByCampainName'
export const Banner_InsertOrEditBlockHtml='api/Banner/InsertOrEditBlockHtml'
export const Bannerdelete='api/Banner/DeleteBlockHtml'
export const GetListBlockThongTinKM='banner-api/GetListBlockHtmlThongTinKhuyenMai'
export const InsertOrUpdateBlockHtmlThongTinKhuyenMai='banner-api/InsertOrUpdateBlockHtmlThongTinKhuyenMai'

// DoiTra-Xahang
export const GetConfigXahang='v2/xa-hang/configs'
export const GetSearchXahang='v2/xa-hang/searchV3/?'
export const ReportXahang='v2/xa-hang/report'
export const UpdateImageSearchXahang='v2/xa-hang/images' 
export const UpdateChiTietXaHang='v2/xa-hang/'

//SimSoOnline
export const SimSo='v2/simso/'
export const AllConfigData ='branch-api/ListAllBranch'


//PrivateSales
export const privateSales='/v2/PrivateSale'

