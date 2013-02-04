/*
 *	气球唯一编号名前缀
 */
_UNIQUE_ID_MENU_PREFIX = "menu__id";
_UNIQUE_ID_MENU_ITEM_PREFIX = "menu_item__id";
_UNIQUE_ID_DEFAULT_PREFIX = "default__id";

/*
 *	样式名称
 */
_STYLE_NAME_MENU = "menu";
_STYLE_NAME_MENU_ITEM_ACITVE = "active";
_STYLE_NAME_MENU_SEPARATOR = "separator";

/*
 *	文件地址
 */
_FILE_ICON_HAS_CHILD = "icon_has_child.gif";


/*
 *	对象名称：Menus（全局静态对象）
 *	职责：负责管理所有右键菜单
 */
var Menus = {};
Menus.nextDepth = 1000;
Menus.items = {};

/*
 *	函数说明：获取下一个层次
 *	参数：  
 *	返回值：number:nextPath     下一个层次
 */
Menus.getNextDepth = function() {
	var nextDepth = this.nextDepth;
	this.nextDepth ++;
	return nextDepth;
}

/*
 *	函数说明：将Menu实例加入集合
 *	参数：  instance:menu		Menu实例
 */
Menus.add = function(menu) {
	var uniqueID = menu.uniqueID;
	if(null != this.items[uniqueID]) {
		this.items[uniqueID].dispose();
	}
	this.items[uniqueID] = menu;
}

/*
 *	函数说明：将Menu实例从集合中去除
 *	参数：  instance:menu		Menu实例
 */
Menus.del = function(menu) {
	var uniqueID = menu.uniqueID;
	if(null != this.items[uniqueID]) {
		this.items[uniqueID].dispose();
		delete this.items[uniqueID];
	}
}
/*
 *	函数说明：统计所有Menu实例数量
 *	参数：
 *	返回值：number:count	Menu实例数量
 */
Menus.count = function(){
	var count = 0;
	for(var item in this.items){
		count ++;
	}
	return count;
}

/*
 *	函数说明：不激活所有Menu实例
 */
Menus.inactiveAllMenus = function() {
	for(var item in this.items) {
		this.items[item].inactive();
	}
}

/*
 *	函数说明：隐藏所有Menu实例
 */
Menus.hideAllMenus = function() {
	for(var item in this.items) {
		curthis.items[item]Menu.hide();
	}
}

/*
 *	函数说明：获取当前激活Menu实例
 *	参数：
 *	返回值：instance:menu	Menu实例
 */
Menus.getActiveMenu = function(){
	for(var item in this.items){
		var curMenu = this.items[item];
		if(curMenu.isActive){
			return curMenu;
		}
	}
	return null;
}

/*
 *	函数说明：根据菜单项ID获取所属Menu实例
 */
Menus.getMenuByItemID = function(id) {
	for(var item in this.items){
		var curMenu = this.items[item];
		var menuItem = curMenu.items[id];
		if(null != menuItem){
			return curMenu;
		}
	}
	return null;
}

/*
 *	函数说明：以文本方式输出对象信息
 */
Menus.toString = function(){
	var str = [];
	str[str.length] = "[Menus 对象]";
	str[str.length] = "items:" + this.count();
	return str.join("\r\n");

}


/*
 *	对象名称：Menu
 *	职责：负责展示右键菜单
 */
function Menu() {
	this.uniqueID = null;
	this.items = {};
	this.object = null;
	this.srcElement = null;
	this.isActive = false;
	this.parentMenuItem = null;
	this.init();
}

/*
 *	函数说明：Menu初始化
 */
Menu.prototype.init = function() {
	this.create();        
	this.setVisible(false);
	this.attachEvents();
	Menus.add(this);
}

/*
 *	函数说明：创建界面
 */
Menu.prototype.create = function() {
	this.uniqueID = UniqueID.generator(_UNIQUE_ID_MENU_PREFIX);

	var object = document.createElement("div");
	object.id = this.uniqueID;
	object.className = _STYLE_NAME_MENU;

	this.object = object;
}

/*
 *	函数说明：绑定事件
 */
Menu.prototype.attachEvents = function() {
	if(null != this.object){
		this.object.onselectstart = _Menu_onSelectStart;

		Event.attachEvent(document, "mousedown", _Menu_Document_onMouseDown);
		Event.attachEvent(window, "resize", _Menu_Window_onResize);
	}
}
/*
 *	函数说明：将实例绑定到指定对象
 *	参数：  object:srcElement       HTML对象
			string:eventName		事件名称
 */
Menu.prototype.attachTo = function(srcElement, eventName){
	this.srcElement = srcElement;
	var thisObj = this;
	Event.attachEvent(srcElement, eventName, function(eventObj) {
		Event.cancel(eventObj);

		var x = eventObj.clientX + document.body.scrollLeft;
		var y = eventObj.clientY + document.body.scrollTop;
		thisObj.show(x,y);
	});
}

/*
 *	函数说明：显示菜单
 *	参数：  number:x            菜单参考点位置
			number:y            菜单参考点位置
			boolean:autofit		是否需要启用自适应
			number:offX         当自适应时反向位置的补正值
			number:offY         当自适应时反向位置的补正值
 */
Menu.prototype.show = function(x, y, autofit, offX, offY) {
	Menus.inactiveAllMenus();
	
	var visibleItemsCount = this.refreshItems();
	if(0 == visibleItemsCount) {
		return; // 可见菜单项只要要有一个才显示菜单
	}

	this.active();
	this.refreshSeparators();

	if(null == $(this.uniqueID)) {
		this.appendToDocument();
	}
	this.bringToTop();

	var w = this.object.offsetWidth;
	var h = this.object.offsetHeight;

	if(false != autofit) {
		if( (x + w) > (document.body.clientWidth + document.body.scrollLeft) ) {
			var dx = 0;
			if(null != this.parentMenuItem){
				dx = w + this.parentMenuItem.object.offsetWidth - 2;
			} 
			else {
				dx = w;
				if(null != offX){
					dx -= offX;
				}
			}
			if( 0 < (x - dx) ) {
				x -= dx;
			}
		}
		if( (y + h) > (document.body.clientHeight + document.body.scrollTop) ) {
			var dy = 0;
			if(null != this.parentMenuItem) {
				dy = h - this.parentMenuItem.object.offsetHeight;
			}
			else {
				dy = h;
				if(null != offY){
					dy -= offY;
				}
			}
			if(0 < (y - dy) ) {
				y -= dy;
			}
			else {
				if(h > document.body.clientHeight) {
					y = 0;
				} else {
					y = document.body.clientHeight + document.body.scrollTop - h;
				}
			}
		}
	}
	this.moveTo(x, y);
	this.setVisible(true);

	// 隐藏select控件
	if( "undefined" != typeof(Element) ) {
		Element.hideConflict(this.object);
	}
}

/*
 *	函数说明：隐藏菜单
 */
Menu.prototype.hide = function(){
	this.setVisible(false);
	this.moveTo(0,0);
	this.inactive();

	// 恢复显示select控件
	if( "undefined" != typeof(Element) ) {
		Element.showConflict(this.object);
	}
}

/*
 *	函数说明：激活当前菜单
 */
Menu.prototype.active = function() {
	this.isActive = true;
}

/*
 *	函数说明：不激活当前菜单
 */
Menu.prototype.inactive = function() {
	this.isActive = false;
}

/*
 *	函数说明：不激活当前菜单的所有菜单项
 */
Menu.prototype.inactiveAllItems = function() {
	for(var item in this.items) {
		this.items[item].inactive();
	}
}

/*
 *	函数说明：刷新菜单项状态
 *	参数：  
 *	返回值：number:visibleItemsCount   可见菜单项的数量
 */
Menu.prototype.refreshItems = function() {
	var visibleItemsCount = 0;
	for(var item in this.items) {
		var curMenuItem = this.items[item];
		curMenuItem.refresh();
		if(curMenuItem.isVisible) {
			visibleItemsCount ++;
		}
	}
	return visibleItemsCount;
}

/*
 *	函数说明：调整分隔线
 */
Menu.prototype.refreshSeparators = function() {
	// 先获取所有可见菜单项数组(含分隔线)
	var vChilds = [];
	var childs = this.object.childNodes;
	for(var i = 0; i < childs.length; i++) {
		var curChild = childs[i];
		if(_STYLE_NAME_MENU_SEPARATOR == curChild.className) { // 分隔线
			vChilds[vChilds.length] = curChild;
		}
		else {
			if("none" != curChild.style.display) {
				vChilds[vChilds.length] = curChild;
			}
		}
	}

	//第一遍过滤，排除连续分隔线
	var flag = false;
	var lastChild = null;
	for(var i = 0; i < vChilds.length; i++) {
		var curChild = vChilds[i];
		if(_STYLE_NAME_MENU_SEPARATOR == curChild.className){//分隔线
			if(true == flag){
				lastChild = curChild;
				curChild.style.display = "";
				flag = false;
			}
			else {
				curChild.style.display = "none";
			}
		}
		else { // 菜单项
			lastChild = curChild;
			flag = true;
		}
	}

	// 第二遍过滤，排除末尾分隔线
	if(_STYLE_NAME_MENU_SEPARATOR == lastChild.className){
		lastChild.style.display = "none";
	}
}

/*
 *	函数说明：将菜单加入到页面文档
 */
Menu.prototype.appendToDocument = function() {
	if(null != this.object) {
		document.body.appendChild(this.object);
	}
}

/*
 *	函数说明：设置菜单是否可见
 *	参数：  boolean:visible     菜单是否可见
 */
Menu.prototype.setVisible = function(visible) {
	if(null != this.object) {
		this.object.style.visibility = visible ? "visible":"hidden";
	}
}

/*
 *	函数说明：设置菜单位置
 *	参数：  number:x        菜单参考点位置
			number:y        菜单参考点位置
 */
Menu.prototype.moveTo = function(x, y) {
	if(null != this.object) {
		this.object.style.left = x;
		this.object.style.top = y;
	}
}

/*
 *	函数说明：将菜单置于顶层
 */
Menu.prototype.bringToTop = function() {
	if(null != this.object) {
		this.object.style.zIndex = Menus.getNextDepth();
	}
}

/*
 *	函数说明：添加菜单项
 *	参数：      object:menuItem     菜单项定义
 *	返回值：    string:uniqueID     菜单项唯一ID
 */
Menu.prototype.addItem = function(menuItem) {
	var menuItem = new MenuItem(menuItem);
	menuItem.dockTo(this.object);

	this.items[menuItem.uniqueID] = menuItem;
	return menuItem.uniqueID;
}

/*
 *	函数说明：删除菜单项
 *	参数：      string:uniqueID     菜单项唯一ID
 */
Menu.prototype.delItem = function(uniqueID) {
	var menuItem = this.items[uniqueID];
	if(null != menuItem) {
		menuItem.dispose();
		delete this.items[uniqueID];
	}
}

/*
 *	函数说明：添加分隔线
 */
Menu.prototype.addSeparator = function(){
	var separator = document.createElement("div");
	separator.className = _STYLE_NAME_MENU_SEPARATOR;

	this.object.appendChild(separator);
}

/*
 *	函数说明：统计所有MenuItem实例数量
 *	参数：
 *	返回值：number:count	Menu实例数量
 */
Menu.prototype.count = function() {
	var count = 0;
	for(var item in this.items) {
		count ++;
	}
	return count;
}

/*
 *	函数说明：释放实例
 */
Menu.prototype.dispose = function() {
	for(var item in this.items) {
		this.delItem(item);
	}
	Element.removeNode(this.object);

	for(var item in this) {
		delete this[item];
	}
}

/*
 *	函数说明：以文本方式输出对象信息
 */
Menu.prototype.toString = function() {
	var str = [];
	str[str.length] = "[Menu 对象]";
	str[str.length] = "uniqueID:" + this.uniqueID;
	str[str.length] = "items:" + this.count();
	str[str.length] = "isActive:" + this.isActive;
	return str.join("\r\n");
}


/*
 *	对象名称：MenuItem
 *	职责：负责控制右键菜单项
 */
function MenuItem(menuItem) {
	this.uniqueID = null;
	for(var item in menuItem) {
		this[item] = menuItem[item];
	}
	this.object = null;
	this.isEnable = true;
	this.isVisible = true;
	this.init();
}

/*
 *	函数说明：菜单项初始化
 */
MenuItem.prototype.init = function() {
	this.create();
	this.attachEvents();
	if(null != this.submenu) {
		this.submenu.parentMenuItem = this;
	}
}

/*
 *	函数说明：创建菜单项
 */
MenuItem.prototype.create = function() {
	this.uniqueID = UniqueID.generator(_UNIQUE_ID_MENU_ITEM_PREFIX);

	var object = document.createElement("div");
	object.id = this.uniqueID;
	object.noWrap = true;
	object.title = this.label;

	var str = this.label;
	if(this.bold) {
		str = "<b>" + str + "</b>";
	}
	object.innerHTML = str;

	if(null != this.icon && "" != this.icon) {
		var img = document.createElement("img");
		img.src = this.icon;
		object.appendChild(img);
	}
	if(null != this.submenu) {
		var img = document.createElement("div");
		img.className = "hasChild";
		object.appendChild(img);
	}

	this.object = object;
}

/*
 *	函数说明：绑定事件
 */
MenuItem.prototype.attachEvents = function(){
	if(null != this.object) {
		this.object.onmouseover   = _Menu_Item_onMouseOver;
		this.object.onmouseout    = _Menu_Item_onMouseOut;
		this.object.onmousedown   = _Menu_Item_onMouseDown;
		this.object.onclick       = _Menu_Item_onClick;
		this.object.oncontextmenu = _Menu_Item_onContextMenu;
	}
}

/*
 *	函数说明：将菜单项插入指定容器
 *	参数：  object:container        HTML容器对象
 */
MenuItem.prototype.dockTo = function(container) {
	if(null != this.object) {
		container.appendChild(this.object);
	}
}

/*
 *	函数说明：高亮菜单项
 */
MenuItem.prototype.active = function() {
	if(null != this.object && true == this.isEnable) {
		this.object.className = _STYLE_NAME_MENU_ITEM_ACITVE;
	}
}

/*
 *	函数说明：低亮菜单项
 */
MenuItem.prototype.inactive = function(){
	if(null != this.object && this.isEnable) {
		this.object.className = "";
	}
	if(null != this.submenu) {
		this.submenu.inactiveAllItems();
		this.submenu.hide();
	}
}

/*
 *	函数说明：设置菜单项可见性
 *	参数：  boolean:visible     是否可见
 */
MenuItem.prototype.setVisible = function(visible) {
	if(null != this.object) {
		this.object.style.display = visible ? "block" : "none";
		this.isVisible = visible;
	}
}

/*
 *	函数说明：设置菜单项是否可用
 *	参数：  boolean:enable     是否可用
 */
MenuItem.prototype.setEnable = function(enable) {
	if(null != this.object) {
		this.object.className = enable ? "" : "disable";
		this.isEnable = enable;
	}
}

/*
 *	函数说明：刷新菜单项状态
 */
MenuItem.prototype.refresh = function() {
	var visible = true;
	if(null != this.visible) {
		visible = Public.executeCommand(this.visible);
	}

	var enable = true;
	if(null != this.enable){
		enable = Public.executeCommand(this.enable);
	}

	this.setVisible(visible);
	this.setEnable(enable);
}

/*
 *	函数说明：执行菜单项回调方法
 */
MenuItem.prototype.execCallBack = function() {
	if(this.isEnable) {
		Public.executeCommand(this.callback);
	}
}

/*
 *	函数说明：显示子菜单
 */
MenuItem.prototype.showSubMenu = function() {
	if(null!=this.submenu) {
		var x = Element.absLeft(this.object) + this.object.offsetWidth;
		var y = Element.absTop(this.object);
		this.submenu.show(x, y);
	}
}

/*
 *	函数说明：释放实例
 */
MenuItem.prototype.dispose = function() {
	Element.removeNode(this.object);

	for(var item in this) {
		delete this[item];
	}
}

/*
 *	函数说明：以文本方式输出对象信息
 */
MenuItem.prototype.toString = function(){
	var str = [];
	str[str.length] = "[MenuItem 对象]";
	str[str.length] = "uniqueID:" + this.uniqueID;
	str[str.length] = "label:"    + this.label;
	str[str.length] = "callback:" + this.callback;
	str[str.length] = "enable:"   + this.enable;
	str[str.length] = "visible:"  + this.visible;
	return str.join("\r\n");
}


/*
 *	函数说明：鼠标在页面文档中按下
 */
function _Menu_Document_onMouseDown(eventObj) {
	eventObj = eventObj || window.event;
	var srcElement = this;

	_Menu_onCloseAll();
}

/*
 *	函数说明：窗口改变尺寸
 */
function _Menu_Window_onResize(eventObj) {
	eventObj = eventObj || window.event;	
	var srcElement = this;

	_Menu_onCloseAll();
}
/*
 *	函数说明：鼠标按下
 */
function _Menu_Item_onMouseDown(eventObj) {
	eventObj = eventObj || window.event;
	Event.cancelBubble(eventObj);
}

/*
 *	函数说明：鼠标悬停
 */
function _Menu_Item_onMouseOver(eventObj) {
	eventObj = eventObj || window.event;
	var srcElement = this;
	_Menu_Item_onActive(srcElement, eventObj);
}

/*
 *	函数说明：鼠标离开
 */
function _Menu_Item_onMouseOut(eventObj) {
	eventObj = eventObj || window.event;
	var srcElement = this;
	_Menu_Item_onInActive(srcElement, eventObj);
}

/*
 *	函数说明：鼠标点击
 */
function _Menu_Item_onClick(eventObj) {
	eventObj = eventObj || window.event;
	var srcElement = this;
	_Menu_Item_onCallBack(srcElement, eventObj);
}

/*
 *	函数说明：鼠标右键点击
 */
function _Menu_Item_onContextMenu(eventObj) {
	eventObj = eventObj || window.event;
	var srcElement = this;
	Event.cancel(eventObj);
}

/*
 *	函数说明：鼠标拖动选择文本
 */
function _Menu_onSelectStart(eventObj) {
	eventObj = eventObj || window.event;
	Event.cancel(eventObj);
}

/*
 *	函数说明：隐藏所有菜单(虚拟事件)
 */
function _Menu_onCloseAll(){
	Menus.hideAllMenus();
}

/*
 *	函数说明：高亮菜单项(虚拟事件)
 */
function _Menu_Item_onActive(srcElement, eventObj) {
	var id = srcElement.id;
	var menu = Menus.getMenuByItemID(id);
	if(null != menu) {
		menu.inactiveAllItems();
		var menuItem = menu.items[id];
		menuItem.active();
		menuItem.showSubMenu();
	}
}

/*
 *	函数说明：低亮菜单项(虚拟事件)
 */
function _Menu_Item_onInActive(srcElement, eventObj) {
	var id = srcElement.id;
	var menu = Menus.getMenuByItemID(id);
	if(null != menu) {
		var menuItem = menu.items[id];
		if(null == menuItem.submenu || false == menuItem.submenu.isActive){
			menuItem.inactive();            
		}
	}
}

/*
 *	函数说明：执行菜单项回调方法(虚拟事件)
 */
function _Menu_Item_onCallBack(srcElement, eventObj) {
	var id = srcElement.id;
	var menu = Menus.getMenuByItemID(id);
	if(null != menu) {
		var menuItem = menu.items[id];
		if(menuItem.isEnable) {
			if(null != menuItem.callback){
				_Menu_onCloseAll();
			}
			menuItem.execCallBack();

			if(null == menuItem.submenu) {
				Menus.inactiveAllMenus();
				Menus.hideAllMenus();
			}
		}
	}
}