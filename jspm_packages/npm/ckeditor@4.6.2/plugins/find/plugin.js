/* */ 
"format cjs";
﻿/*
 Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or http://ckeditor.com/license
*/
CKEDITOR.plugins.add("find",{requires:"dialog",lang:"af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn",icons:"find,find-rtl,replace",hidpi:!0,init:function(a){var b=a.addCommand("find",new CKEDITOR.dialogCommand("find"));b.canUndo=!1;b.readOnly=1;a.addCommand("replace",new CKEDITOR.dialogCommand("replace")).canUndo=
!1;a.ui.addButton&&(a.ui.addButton("Find",{label:a.lang.find.find,command:"find",toolbar:"find,10"}),a.ui.addButton("Replace",{label:a.lang.find.replace,command:"replace",toolbar:"find,20"}));CKEDITOR.dialog.add("find",this.path+"dialogs/find.js");CKEDITOR.dialog.add("replace",this.path+"dialogs/find.js")}});CKEDITOR.config.find_highlight={element:"span",styles:{"background-color":"#004",color:"#fff"}};