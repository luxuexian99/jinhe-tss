<!--
	控件名称：单选or多选树

	功能说明：	1、单选or多选树的显示，重载
				2、枝节点的打开关闭（响应鼠标事件、接口对象提供方法）
				3、兄弟节点间的移动位置（响应鼠标事件、接口对象提供方法）
				4、节点的增、删、改
				5、节点选择状态的更改（响应鼠标事件、接口对象提供方法），参数控制是否和激活节点相关联
				6、返回选中节点（参数控制是否包括半选节点），返回对象或数组，提供方法转换成xml
				7、TreeNode接口对象。
 -->
/*
 * 树类型
 */
var _TREE_TYPE_SINGLE = "single";
var _TREE_TYPE_MULTI  = "multi";
var _TREE_TYPE_MENU   = "menu";
/*
 * 树控件属性名称
 */
var _TREE_BASE_URL = "baseurl";
var _TREE_BASE_URL_DEFAULT_VALUE = "common/Tree/";	// 默认控件所在目录

var _TREE_TREE_TYPE = "treeType";         // 树的类型 :value: multi/single
var _TREE_SELECTED_IDS = "selectedIds";   // 选中节点id字符串
var _TREE_CAN_MOVE_NODE = "canMoveNode";  // 是否可以移动树节点，默认为false
var _TREE_SELECTED_AND_ACTIVE = "treeNodeSelectAndActive"; 	// 选中、激活节点是否同步(单选树默认为true，多选树默认为false)
var _TREE_OPEN_WITH_CLICK = "treeNodeToOpenOnClick";	    // 点击文字是否展开/收缩节点
var _TREE_DISABLED_ALL_CHECKTYPE = "allCheckTypeDisabled";	// 禁止所有节点改变选中状态
var _TREE_JUST_SELECT_SELF = "selectSelf";	                // 选中节点时只改变自己的选择状态，与父、子节点无关
var _TREE_FOCUS_NEW_TREE_NODE = "focusNewTreeNode";	        // 新增节点焦点不自动移到新节点上
var _TREE_DEFAULT_OPEN   = "defaultOpen";	                // 是否自动打开节点
var _TREE_DEFAULT_ACTIVE = "defaultActive";	                // 默认激活节点方式：none-不选中；root-选中根节点；valid-选中第一个有效节点

/*
 * 节点属性名称
 */
var _DEFAULT_OPENED_TREE_NODE_ID = "openednodeid";
var _TREE_NODE_ID = "id";
var _TREE_NODE_NAME = "name";
var _TREE_NODE_FULLNAME = "fullname";
var _TREE_NODE_CANSELECTED = "canselected";
var _TREE_NODE_CHECKTYPE = "checktype";
var _TREE_NODE_DISPLAY = "display";

var _TREE_NODE = "treeNode";        /* 节点名称 */
var _TREE_ROOT_NODE = "actionSet";  /* 根节点名称 */
var _TREE_ROOT_NODE_ID = "_rootId"; /* “全部”节点的ID值  */

/*
 * 选中状态图标地址（控件所在目录为根目录，起始不能有“/”）
 */
var _MULTI_NO_CHECKED_IMAGE   = "images/no_checked.gif";
var _MULTI_CHECKED_IMAGE      = "images/checked.gif";
var _MULTI_HALF_CHECKED_IMAGE = "images/half_checked.gif";
var _SINGLE_NO_SELECTED_IMAGE = "images/no_selected.gif";
var _SINGLE_SELECTED_IMAGE    = "images/selected.gif";
var _MULTI_CAN_NOT_CHECK_IMAGE  = "images/checkbox_disabled.gif";
var _RADIO_CAN_NOT_SELECT_IMAGE = "images/radio_disabled.gif";
/*
 * 伸缩状态图标地址
 */
var _TREE_NODE_CONTRACT_IMAGE = "images/contract.gif";
var _TREE_NODE_EXPAND_IMAGE   = "images/expand.gif";
var _TREE_NODE_LEAF_IMAGE     = "images/leaf.gif";
var _TREE_ROOT_CONTRACT_IMAGE = "images/root_contract.gif";
var _TREE_ROOT_EXPAND_IMAGE = "images/root_expand.gif";
var _TREE_ROOT_NODE_LEAF_IMAGE = "images/root_leaf.gif";

/*
 * Tree相关样式名称
 */
var _TREE_WAIT_LOAD_DATA_MSG = '<span style="margin:5 0 0 8;font-size:12px;color:#666">正在加载数据...</span>';
var _TREE_NODE_MOVE_TO_LINE_STYLE = "1px solid #333399"; // 目标节点划线样式
var _TREE_NODE_MOVE_TO_HIDDEN_LINE_STYLE = "1px solid #ffffff"; // 目标节点隐藏划线样式

var _TREE_STYLE = "Tree"; // 控件样式名
var _TREE_NODE_OVER_STYLE       = "hover";    // 鼠标移到节点上方样式
var _TREE_NODE_MOVED_STYLE      = "moved";    // 节点移动样式名称
var _TREE_NODE_FINDED_STYLE     = "finded";   // 查询结果节点样式名称
var _TREE_NODE_SELECTED_STYLE   = "selected"; // 节点选中样式名称
var _TREE_NODE_ICON_STYLE       = "icon";     // 节点自定义图标样式名称
var _TREE_NODE_FOLDER_STYLE     = "folder";   // 节点伸缩图标样式名称
var _TREE_NODE_CHECK_TYPE_STYLE = "checkType";// 节点选择状态图标样式名称

/*
 * 节点显示的行高（象素），只用于计算显示的行数，不能控制显示时行的高度
 * 如果要修改显示的行高，修改样式文件
 */
var _TREE_NODE_DISPLAY_ROW_HEIGHT = 20;	
var _TREE_SCROLL_BAR_WIDTH = 17; // 滚动条的宽度（象素）
var _TREE_BOX_MIN_WIDTH = 10;    // 树控件显示区最小宽度（象素）
var _TREE_BOX_MIN_HEIGHT = 22;   // 树控件显示区最小高度（象素）

var _TREE_SCROLL_DELAY_TIME = 0;          // 滚动条的滚动事件延迟时间（毫妙）
var _TREE_SCROLL_REPEAT_DELAY_TIME = 300; // 拖动节点到最上、下行时循环滚动事件每次延迟时间（毫妙）


/* 节点自定义图标尺寸 */
var _TREE_NODE_ICON_WIDTH = 16;
var _TREE_NODE_ICON_HEIGHT = 16;
var _TREE_NODE_ICON_ATTRIBUTE = "icon"; // 节点自定义图标属性名
 

var SingleCheckTree = function(element) {
	Tree.call(this, element);
	
	this.setAttribute(_TREE_TREE_TYPE, _TREE_TYPE_SINGLE);
	this.setAttribute(_TREE_SELECTED_AND_ACTIVE, getValue(_TREE_SELECTED_AND_ACTIVE, "true"));
		
	/*
	 * 获取节点的下一选中状态（单选）
	 */
	this.getNextState = function() {
		return 1;
	};
	
	/*
	 * 根据节点选择状态，获取图标地址（单选树）
	 */
	this.getCheckTypeImageSrc = function(node) {
		var checkType   = node.getAttribute(_TREE_NODE_CHECKTYPE);
		var canSelected = node.getAttribute(_TREE_NODE_CANSELECTED);
		if(canSelected == 0) {
			return this._baseUrl + _RADIO_CAN_NOT_SELECT_IMAGE;
		}
		if(checkType == 1) {
			return this._baseUrl + _SINGLE_SELECTED_IMAGE;
		}
		return this._baseUrl + _SINGLE_NO_SELECTED_IMAGE;
	};

	/*
	 * 清除特定节点以外的其他节点的选中状态
	 */
	this.refreshStates = function(treeNode) {
		var childNodes = this.getXmlRoot().selectNodes(".//treeNode[@checktype='1']");
		for(var i = 0, len = childNodes.length; i < len; i++) {
			if(childNodes[i] == treeNode.getXmlNode()) {
				continue;
			}
			setNodeState(childNodes[i], "0");
		}
	};
	
	/*
	 * 获取选中节点的TreeNode对象（单选树）
	 */
	this.getSelectedTreeNode = function() {
		var node = this.getXmlRoot().selectSingleNode(".//treeNode[@checktype='1']");
		return instanceTreeNode(node);
	};
	
	/*
	 * 获取选中节点的Xml对象（单选树）
	 */
	this.getSelectedXmlNode = function() {
		return this.getXmlRoot().selectSingleNode(".//treeNode[@checktype='1']");
	};
	
}


var MultiCheckTree = function(element) {
	Tree.call(this, element);
	
	this.setAttribute(_TREE_TREE_TYPE, _TREE_TYPE_MULTI);
	this.setAttribute(_TREE_SELECTED_AND_ACTIVE, getValue(_TREE_SELECTED_AND_ACTIVE, "false"));

	/*
	 * 获取节点的下一选中状态（多选1、2 -> 0; 0 -> 1）
	 */
	this.getNextState = function () {
		if(/^(2|1)$/.test(this.getSelectedState())) {	// 半选、全选时，置为不选
			return 0;
		}	
		return 1;	// 不选时，置为全选
	};		
	
	/*
	 * 根据节点选择状态，获取图标地址（多选树）
	 */
	this.getCheckTypeImageSrc = function(node) {
		var checkType   = node.getAttribute(_TREE_NODE_CHECKTYPE);
		var canSelected = node.getAttribute(_TREE_NODE_CANSELECTED);
		if(canSelected == 0) {
			return this._baseUrl + _MULTI_CAN_NOT_CHECK_IMAGE;
		}
		if(checkType == 1) {
			return this._baseUrl + _MULTI_CHECKED_IMAGE;
		}
		if(checkType == 2) {
			return this._baseUrl + _MULTI_HALF_CHECKED_IMAGE;
		}
		return this._baseUrl + _MULTI_NO_CHECKED_IMAGE;
	};
	
	/*
	 * 刷新相关节点的选中状态（多选树），同时根据参数决定是否激活当前节点
	 * 参数：	treeNode	TreeNode节点对象
	 *			noChildren	选中节点时，不包含子节点
	 */
	this.refreshStates = function (treeNode, noChildren) {
		if (this.getAttribute(_TREE_JUST_SELECT_SELF) == "true") {
			return;
		}
		refreshParentNodeState(treeNode.getXmlNode());

		if(noChildren && treeNode.getSelectedState() == 2) {
			return;
		}
		refreshChildrenNodeState(treeNode.getXmlNode());
	}
	
	/*
	 * 获取选中节点的TreeNode对象数组（多选树）
	 * 参数：	includeHalfChecked	是否包含半选节点
	 * 返回值：	TreeNode对象数组，数组对象还提供toElement方法，将数组直接转换成xml字符串。
	 */
	this.getSelectedTreeNode = function (includeHalfChecked) {	
		var treeNodeArray = this.getSelectedXmlNode(includeHalfChecked);			
		for(var i = 0; i < treeNodeArray.length; i++) {
			treeNodeArray[i] = instanceTreeNode(treeNodeArray[i]);
		}
			
		return treeNodeArray;
	}
	
	/*
	 * 获取选中节点的Xml对象数组（多选树）
	 * 参数：	includeHalfChecked	是否包含半选节点
	 * 返回值：	xmlNode对象数组，数组对象还提供toElement方法，将数组直接转换成xml字符串。
	 */
	this.getSelectedXmlNode  = function (includeHalfChecked) {	
		var treeNodes;
		if(includeHalfChecked) { // 包括半选状态
			treeNodes = this.getXmlRoot().selectNodes(".//treeNode[@checktype='1' or @checktype='2']");
		} else { // 不包括半选状态
			treeNodes = this.getXmlRoot().selectNodes(".//treeNode[@checktype='1']");
		}
		
		var treeNodeArray = new Array();
		for(var i = 0; i < treeNodes.length; i++) {
			treeNodeArray[i] = treeNodes[i];
		}
		try{
			treeNodeArray.rootNode = this.getXmlRoot().cloneNode(false); // 获取actionSet节点
		} catch(e) {
			throw(e);
		}
		treeNodeArray.includeHalfChecked = includeHalfChecked;
		
		/* 
		 * 给数组提供toElement方法，根据是否包括半选状态，分别以不同的方式返回xml节点。
		 * 如果不包括半选状态的节点，生成的xml将所有TreeNode都放到根节点actionSet节点下；		 
		 * 否则将给出包括全选、半选的所有节点，并按原有的节点层次关系给出xml字符串。
		 */
		treeNodeArray.toElement = function() {
			for(var i = 0; i < this.length; i++) {				
				var xmlNode = (this[i] instanceof TreeNode) ? this[i].getXmlNode() : this[i];
				var parentNode = this.includeHalfChecked ? xmlNode.parentNode : this.rootNode;
				parentNode.appendChild(xmlNode.cloneNode(false));
			}
			return this.rootNode;
		};
		
		return treeNodeArray;
	}
}


/*
 * 初始化树对象
 */
function instanceTree(element) {
	
	var treeObj;
	
	var _treeType = getValue(_TREE_TREE_TYPE, _TREE_TYPE_SINGLE);
	if(_treeType == _TREE_TYPE_MULTI) {
		treeObj = new Tree(element)
	} 
	else {
		treeObj = new Tree(element)
	}
	
}


 
/*
 * 对象名称：Tree	
 */
var Tree = function(element) {	

	var _baseUrl = getValue(_TREE_BASE_URL, _TREE_BASE_URL_DEFAULT_VALUE);
	var _treeType = getValue(_TREE_TREE_TYPE, _TREE_TYPE_SINGLE);
	var _selectedIds = getValue(_TREE_SELECTED_IDS);
	var _canMoveNode = getValue(_TREE_CAN_MOVE_NODE, "false");
	var _justSelectSelf = getValue(_TREE_JUST_SELECT_SELF, "false");
	var _focusNewNode = getValue(_TREE_FOCUS_NEW_TREE_NODE, "true");
	var _defaultOpen = getValue(_TREE_DEFAULT_OPEN, "true");
	var _defaultActive = getValue(_TREE_DEFAULT_ACTIVE, "none");
	
	var _treeNodeSelectAndActive = getValue(_TREE_SELECTED_AND_ACTIVE, "false");
	var _treeNodeToOpenOnClick = getValue(_TREE_OPEN_WITH_CLICK, "false");
	var _allCheckTypeDisabled = getValue(_TREE_DISABLED_ALL_CHECKTYPE, "false");
	
	
	var _activedNode ;
	var _movedNode;
	var _treeXMLDom;
	var _scrollTimer;
	var _findedNode;
	
	this.element = element;
	this.element.className = _TREE_STYLE;
	
	this.displayObj = new Display(this);
	this.searchObj  = new Search(this);
	
	this.loadData();
	this.setNodesChecked();
	this.setDefaultActive();
	displayObj.resetTotalTreeNodes();
	displayObj.reload();
	
	// 触发载入完成事件
	eventTreeReady.fire(createEventObject()); 
	
	//增加isLoaded属性表示是否初始化完成
	this.element.isLoaded = true;

	// 触发控件初始化完成事件
	eventComponentReady.fire(createEventObject()); 
	
	
	/*
	 * 设定控件的数据，数据来源为xml字符串
	 */
	this.loadData = function (dataXML) {
		_treeXMLDom = loadXmlToNode(dataXML);
		
		if(_treeXMLDom && _defaultOpen == "true") {			
			// 获取定义的默认打开的节点
			var openedNodeId = _treeXMLDom.getAttribute(_DEFAULT_OPENED_TREE_NODE_ID) || "noDefaultOpened";	
			var openedNode = _treeXMLDom.selectSingleNode(".//treeNode[@id='" + openedNodeId + "']");;
			if( openedNode == null) {
				openedNode = _treeXMLDom.selectSingleNode(".//treeNode[@" + _TREE_NODE_CANSELECTED + "='1' or not(@" + _TREE_NODE_CANSELECTED + ")]");
			}
		
			var defaultOpenedNode = (openedNode ? openedNode : _treeXMLDom.firstChild);  // 默认打开第一个子节点
			openNode(defaultOpenedNode);
		}
	}
	
	this.isMenu = function() {
		return this._treeType == _TREE_TYPE_MENU;
	}

	/*
	 * 获取默认选择状态数据：xml字符串
	 * 参数：	selectedDataXML	 节点选中状态的数据源
	 *			clearOldSelected 是否清除原先选中节点
	 */
	this.setNodesChecked = function (selectedDataXML, clearOldSelected) {
		var checkedNodeDom = loadXmlToNode(selectedDataXML);
		if(_treeXMLDom == null || checkedNodeDom == null) {
			return;
		}
		
		
		if(_treeType == _TREE_TYPE_SINGLE) {	// 单选树
			var checkedNode = checkedNodeDom.selectSingleNode("//treeNode[@checktype='1']");
			if(checkedNode == null) {
				return;
			}
			var fNodeId = checkedNode.getAttribute(_TREE_NODE_ID);
			var fNode = _treeXMLDom.selectSingleNode("//treeNode[@id='" + fNodeId + "']");
			var treeNode = instanceTreeNode(fNode);
			if( treeNode ) {
				treeNode.changeSelectedState(false, true);
				treeNode.focus();
			}
		}
		else {
			if(clearOldSelected) {
				clearSelected(_treeXMLDom);
			}

			// 选节点时是否考虑父子关系
			if (treeObj.getAttribute(_TREE_JUST_SELECT_SELF) == "true") {
				var checkedNodes = checkedNodeDom.selectNodes("//treeNode[@checktype='1']");
				for(var i = 0; i < checkedNodes.length; i++) {
					var fNodeId = checkedNodes[i].getAttribute(_TREE_NODE_ID);
					var fNode = _treeXMLDom.selectSingleNode("//treeNode[@id='" + fNodeId + "']");
					setNodeState(fNode, 1);
					openNode(fNode);
				}
			} 
			else { 
				// 子节点(包括自己)被选中，且父节点未被选中的节点
				var checkedNodes = checkedNodeDom.selectNodes("//treeNode[@checktype='1' " 
												+ " && ..[not(@checktype='1') || not(@checktype)]]");
				for(var i = 0; i < checkedNodes.length; i++) {
					var fNodeId = checkedNodes[i].getAttribute(_TREE_NODE_ID);
					var fNode = _treeXMLDom.selectSingleNode("//treeNode[@id='" + fNodeId + "']");
					if( fNode ) {
						setNodeState(fNode, 1);
						refreshParentNodeState(fNode);
						refreshChildrenNodeState(fNode);
					}
				}
			}
		}
	}
	
	/*
	 * 获取默认选择状态数据：id字符串，多id之间用","隔开
	 * 参数：	selectedIds	节点选中状态的Id字符串
	 *			clearOldSelected	是否清除原先选中节点
	 *			isDependParent 下溯，设置全部子节点为选中
	 */
	this.setNodesCheckedByNodeIDs = function (selectedIds, clearOldSelected, isDependParent) {
		if(isNullOrEmpty(selectedIds)) {
			selectedIds = _selectedIds;
		}
		if(selectedIds == null) return;
		
		if(_treeType == _TREE_TYPE_SINGLE) { // 单选树
			eval("var selectedIds = '" + selectedIds + "';");
			var node = _treeXMLDom.selectSingleNode("//treeNode[@id='" + selectedIds + "']");
			var treeNode = instanceTreeNode(node);
			if( treeNode ) {
				treeNode.setSelectedState(1, false, true);
				treeNode.focus();
			}
		} else {
			if(clearOldSelected) {
				clearSelected(_treeXMLDom);
			}
		 
			var checkedNodeIds = selectedIds.split(',');
			if (_justSelectSelf == "true") {
				
				for(var i = 0; i < checkedNodeIds.length; i++) {
					var fNode = _treeXMLDom.selectSingleNode("//treeNode[@id='" + checkedNodeIds[i] + "']");
					if( fNode ) {
						setNodeState(fNode, 1);
						openNode(fNode);
					}
				}
			} 
			else {
				for(var i = 0; i < checkedNodeIds.length; i++) {
					var fNode = _treeXMLDom.selectSingleNode("//treeNode[@id='" + checkedNodeIds[i] + "']");
					if( fNode ) {
						setNodeState(fNode, 1);
			 
						if( isDependParent ) {
							var subnodes = fNode.selectNodes(".//treeNode");
							for(var j = 0; j < subnodes.length; j++) {
								setNodeState(subnodes[j], 1);
							}
						}
					}
				}
				
				// 把包含选中节点的所有父节点为选中（.//treeNode 表示 满足and之前条件的node的子节点）
				var xpath = "//treeNode[ not(@checktype and @checktype = '1') and .//treeNode[@checktype = '1'] ]";
				var nodes = _treeXMLDom.selectNodes(xpath);
				for(var i = 0; i < nodes.length; i++) {
					setNodeState(nodes[i], 1);
				}
				
				// 把所有全选节点中包含未全选节点的节改为半选
				xpath = "//treeNode[ @checktype = '1' and .//treeNode[not(@checktype = '1') || not(@checktype)] ]";
				nodes = _treeXMLDom.selectNodes(xpath);
				for(var i = 0; i < nodes.length; i++) {
					setNodeState(nodes[i], 2);
				}
			}
		}
	}
	
	/*
	 * 获取数据的根节点
	 */
	this.getXmlRoot = function () {
		return _treeXMLDom || loadXmlToNode("<actionSet/>");
	}
	/*
	 * 设定当前高亮（激活）的节点
	 */
	this.setActiveNode = function (treeNode) {
	    _activedNode = treeNode.getXmlNode();
	}
	/*
	 * 根据属性配置，点击节点文字标签时是否改变节点选择状态
	 */
	this.isSelectByActived = function () {
		return _treeNodeSelectAndActive == "true";
	}

	/*
	 * 根据属性配置，点击节点文字标签时是否改变节点伸缩状态
	 */
	this.isTreeNodeToOpenOnClick = function () {
		return _treeNodeToOpenOnClick == "true";
	}

	/*
	 * 设定对象属性值
	 */
	this.setAttribute = function (name, value) {
	    switch (name) {
	        case _TREE_BASE_URL:
				_baseUrl = value;
	            break;
	        case _TREE_TREE_TYPE:
				_treeType = value;
	            break;
	        case _TREE_CAN_MOVE_NODE:
				_canMoveNode = value;
	            break;
	        case _TREE_SELECTED_AND_ACTIVE:
				_treeNodeSelectAndActive = value;
	            break;
	        case _TREE_OPEN_WITH_CLICK:
				_treeNodeToOpenOnClick = value;
	            break;
	        case _TREE_DISABLED_ALL_CHECKTYPE:
				_allCheckTypeDisabled = value;
	            break;
	        case _TREE_JUST_SELECT_SELF:
				_justSelectSelf = value;
	            break;
	        default :
				alert("Tree对象：没有属性[" + name + "]!");
	    }
	}
	/*
	 * 获取对象属性
	 */
	this.getAttribute = function (name) {
	    switch (name) {
	        case _TREE_BASE_URL:
				return _baseUrl;
	        case _TREE_TREE_TYPE:
				return _treeType;
	        case _TREE_CAN_MOVE_NODE:
				return _canMoveNode;
	        case _TREE_SELECTED_AND_ACTIVE:
				return _treeNodeSelectAndActive;
	        case _TREE_OPEN_WITH_CLICK:
				return _treeNodeToOpenOnClick;
	        case _TREE_DISABLED_ALL_CHECKTYPE:
				return _allCheckTypeDisabled;
	        case _TREE_JUST_SELECT_SELF:
				return _justSelectSelf;
	        default :
				alert("Tree对象：没有属性[" + name + "]!");
	    }
	}
	/*
	 * 根据节点不同的checkType属性值获取选择状态图标的地址
	 */
	this.getCheckTypeImageSrc = function (node) {
	    alert("Tree对象：此方法[getCheckTypeImageSrc]尚未初始化！");
	}
	/*
	 * 判断节点是否高亮（激活）
	 */
	this.isActiveNode = function (node) {
	    return _activedNode == node;
	}
	/*
	 * 判断节点是否为被拖动的节点
	 */
	this.isMovedNode = function (node) {
	    return _movedNode == node;
	}
	/*
	 * 判断节点是否为查选结果节点
	 */
	this.isFindedNode = function (node) {
	    return _findedNode == node;
	}
	/*
	 * 获取节点文字链接的样式名
	 */
	this.getStyleClass = function (node, defaultStyle) {
		if(this.isMovedNode(node)) {
			return _TREE_NODE_MOVED_STYLE;
		} else if(this.isActiveNode(node)) {
			return _TREE_NODE_SELECTED_STYLE;
		} else if(this.isFindedNode(node)) {
			return _TREE_NODE_FINDED_STYLE;
		}
		return defaultStyle;
	}
	
	/*
	 * 节点被选中时是否需要激活（高亮）节点
	 */
	this.isActiveBySelected = function (state) {
		return _treeNodeSelectAndActive == "true" && state == 1;
	}
	/*
	 * 设定被拖动的节点
	 */
	this.setMovedNode = function (node) {
	    _movedNode = node;
	}

	/*
	 * 树是否可以移动节点
	 */
	this.isCanMoveNode = function () {
	    return _canMoveNode == "true";
	}
	
	/*
	 * 树是否禁止改变所有的选择状态
	 */
	this.isAllDisabledCheckType = function () {
	    return _allCheckTypeDisabled == "true";
	}

	/*
	 * 禁止所有节点改变选中状态
	 */
	this.disable = function () {
		_allCheckTypeDisabled = "true";
	}
	/*
	 * 允许没有被特殊指定不能选中的节点改变选中状态
	 */
	this.enable = function () {
		_allCheckTypeDisabled = "false";
	}
	/*
	 * 新增节点后，是否需要将焦点移到新节点上
	 * 参数：
	 * 返回值：	true	需要移到新节点上
	 *			false	不需要移到新节点上
	 */
	this.isFocusNewTreeNode = function() {
		return _focusNewNode == "true";
	}

	/*
	 * 设定查询结果中的当前节点为特殊高亮显示
	 */
	this.setFindedNode = function (node) {
	    _findedNode = node;
	}
}

/*
 * 根据id返回TreeNode对象，如果对象不存在，则返回null
 */
Tree.prototype.getTreeNodeById = function(id) {
	var node = this.getXmlRoot().selectSingleNode(".//treeNode[@id='" + id + "']");
	return instanceTreeNode(node);
}

/*
 * 获取当前高亮（激活）的节点（被激活的节点一次只有一个）。如果没有激活的节点，则返回null。
 */
Tree.prototype.getActiveTreeNode = function () {
	return instanceTreeNode(_activedNode);
}

/*
 * 设定相应id的节点为激活状态。如果相应id的节点尚未被打开，也就是其父节点或父节点的父节点等没有被打开，那么先打开此节点。
 * 参数：id 字符串，所要激活的节点的id，必须提供，否则会报错。
 */
Tree.prototype.setActiveTreeNode = function(id) {
	var treeNode = this.getTreeNodeById(id);
	if(treeNode instanceof TreeNode) {
		treeNode.setActive(); // 激活节点，同时根据treeNodeSelectAndActive属性，确定是否同时改变节点选择状态。
		this.setActiveNode(treeNode); 
		treeNode.focus(); // 打开节点，让节点出现在可视区域内。
	}
}
 
/*
 * 新增子节点，同时激活新节点
 * 参数：	newNodeXML	新节点的xml
 *			parent	    父节点（TreeNode对象）
 * 返回：	true/false
 */
Tree.prototype.insertTreeNodeXml = function(newNodeXML, parent) {
	if( !(parent instanceof TreeNode) ) {
		return false;
	}
	
	var treeNode = parent.appendChild(newNodeXML);	// 新增子节点
	if( !(treeNode instanceof TreeNode) ) {
		return false;
	}
	
	if(this.isFocusNewTreeNode()) {
		treeNode.setActive();	// 激活节点，同时根据treeNodeSelectAndActive属性，确定是否同时改变节点选择状态。
		treeNode.focus();		// 打开节点，让节点出现在可视区域内。
	} else {
		parent.setActive();
		parent.open();
	}
	return true;
}

/*
 * 删除节点
 */
Tree.prototype.removeTreeNode(treeNode) {
	if( !(treeNode instanceof TreeNode) ) {
		return false;
	}
	
	var result = treeNode.remove();		// 删除节点
	this.displayObj.reload();
	return result;
}

/*
 * 跟据目标节点和移动状态，移动节点位置。
 * 参数：	movedTreeNode	移动节点TreeNode对象
 *			toTreeNode		目标节点TreeNode对象
 *			moveState		移动状态，-1为目标节点上方，1为目标节点下方
 */
Tree.prototype.moveTreeNode(movedTreeNode, toTreeNode, moveState) {
	if( !this.isCanMoveNode() 
	    || !(movedTreeNode instanceof TreeNode)
		|| !(toTreeNode instanceof TreeNode) ) {
		return false;
	}
	var result = movedTreeNode.moveTo(toTreeNode, moveState);
	this.displayObj.reload();
	return result;
}

/*
 * 跟据目标节点和移动状态，从外部（其他树）移动节点位置。
 * 参数：	movedTreeNode	移动外部（其他树）的节点TreeNode对象
 *			toTreeNode		目标节点TreeNode对象
 *			moveState		移动状态，-1为目标节点上方，1为目标节点下方
 */
Tree.prototype.moveExternalTreeNode(movedTreeNode, toTreeNode, moveState) {
	var movedTreeNodeId  = movedTreeNode.getId();
	var movedTreeNodeXml = movedTreeNode.getXmlNode().xml;
	var toTreeNodeParent = toTreeNode.getParent();

	if(toTreeNodeParent.getXmlNode().nodeName == "actionSet") { // 根节点
		var newRootTreeNode = new TreeNode();		// 新增根节点
		newRootTreeNode.appendRoot(movedTreeNodeXml);
	} else { // 枝节点
		this.insertTreeNodeXml(movedTreeNodeXml, toTreeNodeParent);
	}
		
	var newNode = this.getTreeNodeById(movedTreeNodeId);
	this.moveTreeNode(newNode, toTreeNode, moveState);

	var newNode = this.getTreeNodeById(movedTreeNodeId);
	newNode.setActive();	// 激活节点，同时根据treeNodeSelectAndActive属性，确定是否同时改变节点选择状态。
	newNode.focus();		// 打开节点，让节点出现在可视区域内。
}

/*
 * 获取树的标题
 */
Tree.prototype.getTreeTitle = function() {
	if(this.getXmlRoot()) {
		var title = this.getXmlRoot().getAttribute("title");
		if ( !isNullOrEmpty(title) ) {
			return title;
		}
	}
	return "选择";
}

/*
 * 设置默认激活节点
 * 参数：	type	默认激活类型
 */
Tree.prototype.setDefaultActive = function (type) {
	if( isNullOrEmpty(type) ) {
		type = _defaultActive;
	}
	if(_treeXMLDom == null || type == "none") {
		return;
	}
	
	var path;
	if(type == "root") {
		path = ".//treeNode[@id='" + _TREE_ROOT_NODE_ID + "']";
	} else if(type == "valid") {
		path = ".//treeNode[(@" + _TREE_NODE_CANSELECTED + "='1' or not(@" + _TREE_NODE_CANSELECTED + ")) and @id!='" + _TREE_ROOT_NODE_ID + "']";
	}
	
	var activeNode = this._treeXMLDom.selectSingleNode(path);
	var treeNode = instanceTreeNode(activeNode);
	if( treeNode ) {
		treeNode.setActive();
		treeNode.focus();
	}
}
		
/*
 * 通过xml字符串，重新载入数据源
 */
Tree.prototype.load = function (dataXML) {
	this.loadData(dataXML);
	this.setDefaultActive();
	this.reload();
	
	//触发载入完成事件
	eventTreeReady.fire(createEventObject()); 
}

Tree.prototype.reload = function () {
	this.displayObj.resetTotalTreeNodes();
	this.displayObj.reload();
}

/*
 * 根据给定的数据，处理树节点的默认选中状态
 * 参数： selectedSrc	默认选中的数据
 *		  clearOldSelected	是否清除原先选中节点
 */
Tree.prototype.loadDefaultChecked = function(selectedSrc, clearOldSelected) {
	this.setNodesChecked(selectedSrc, clearOldSelected);
	this.reload();
	
	var eventObj = createEventObject();
	eventObj.type = "_SelectedDefalt";
	eventSelectedDefault.fire(eventObj);
}

/*
 * 根据给定的数据，处理树节点的默认选中状态
 * 参数: selectedIds	默认选中的数据(id字符串，多个id用“,”隔开)
 *		 clearOldSelected	是否清除原先选中节点
 *		 isDependParent	    是否依赖父节点(父节点选中，则所有子节点均选中)
 */
Tree.prototype.loadDefaultCheckedByIds(selectedIds, clearOldSelected, isDependParent) {
	this.setNodesCheckedByNodeIDs(selectedIds, clearOldSelected, isDependParent);
	this.reload();
	
	var eventObj = createEventObject();
	eventObj.type = "_SelectedDefalt";
	eventSelectedDefault.fire(eventObj);
}

/*
 * 获取ids，默认为所有选中状态(全选、半选)的节点id字符串
 * 参数：isAll	是否为全部节点的Id
 *       onlySelected	只包括全选的
 *	 	 exIdPatterns	匹配不包含的Id的正则表达式数组
 * 返回：字符串：id1,id2,id3
 */
Tree.prototype.getIds = function(isAll, onlySelected, exIdPatterns) {
	if (isAll) {
		var path = ".//treeNode" ;
	} else {
		if(onlySelected) {
			var path = ".//treeNode[@checktype='1']";
		} else {
			var path = ".//treeNode[@checktype='1' or @checktype='2']";
		}
	}
	var nodes = this.getXmlRoot().selectNodes(path);
	
	var ids = "";
	L:for(var i = 0; i < nodes.length; i++) {
		var id = nodes[i].getAttribute(_TREE_NODE_ID);
		if(id == _TREE_ROOT_NODE_ID) continue;

		if( exIdPatterns ) {
			for(var j = 0; j < exIdPatterns.length; j++) {
				if( exIdPatterns[j].test(id) ) {
					continue L;
				}
			}
		}
		
		if(ids.length > 0) {
			ids += ",";
		}
		ids += id;
	}
	return ids;
}


/*
 * 查询得到所有符合要求的结果
 * 参数：	searchStr	查询的字符串
 *			searchField	查询的属性名称
 *			searchType	查询方式：hazy(模糊)/rigor(精确)，默认为rigor
 *			direct		查询方向
 */	
Tree.prototype.searchNode = function(searchStr, searchField, searchType, direct) {
	if(this.searchObj.search(searchStr, searchField, searchType)) {
		this.searchObj.first(direct);
	}
}

/*
 * 获取查询结果的下一个结果
 * 参数：	查询方向：默认为向下查询
 *			isCircle	是否循环查询，默认为不循环查询
 */	
Tree.prototype.searchNext = function(direct, isCircle) {
	this.searchObj.next(direct, isCircle);
}


//////////////////////////////////////////////////////////////////////////////
///////////////////             	自定义事件				    //////////////
//////////////////////////////////////////////////////////////////////////////
 

/**
 * 事件触发混乱问题，暂时改用模拟事件
 */
function createEventObject() {
	return new Object();
}
function EventFirer(name) {
	var _name = name;
	this.fire = function (event) {
		var func = element.getAttribute(_name);
		if( func ) {
			var funcType = typeof(func);
			if("string" == funcType) {
				eval(func);
			}
			else if ("function" == funcType) {
				func(event);
			}
		}
	}
}

var eventComponentReady  = new EventFirer("oncomponentready");
var eventTreeReady       = new EventFirer("onLoad");
var eventNodeExpand      = new EventFirer("onTreeNodeExpand");
var eventNodeSelected    = new EventFirer("onTreeNodeSelected");
var eventNodeActived     = new EventFirer("onTreeNodeActived");
var eventNodeDoubleClick = new EventFirer("onTreeNodeDoubleClick");
var eventNodeMoved       = new EventFirer("onTreeNodeMoved");
var eventTreeChange      = new EventFirer("onChange");
var eventSelectedDefault = new EventFirer("onInitDefaultSelected");
var eventBeforeSelected  = new EventFirer("onBeforeSelected");
var eventBeforeActived   = new EventFirer("onBeforeActived");
var eventNodeRightClick  = new EventFirer("onTreeNodeRightClick");
var eventBeforeSelectedAndActived = new EventFirer("onBeforeSelectedAndActived");

  
///////////////////////////////////////////////////////////////////////////
//	对象名称：TreeNode											         //
//	参数：	node	xml节点                                              //
//  职责：	树节点对象接口。负责处理节点状态变化。	                     //
///////////////////////////////////////////////////////////////////////////
 
var TreeNode = function (node) {
	this.node = node;
}

TreeNode.prototype = new function() {
	/*
	 * 获取xml节点
	 */
	this.getXmlNode = function() {
		return this.node;
	}
	/*
	 * 是否为子节点已经打开的节点
	 * 返回：	true/false
	 */
	this.isOpened = function() {
		return this.node.getAttribute("_open") == "true";
	}
	/*
	 * 是否为可选择节点
	 * 返回：	true/false
	 */
	this.isCanSelected = function() {
		return this.node.getAttribute(_TREE_NODE_CANSELECTED) != "0";
	}
	/*
	 * 是否为可用链接节点，即display!=0
	 * 返回：	tree/false
	 */
	this.isEnabled = function() {
		return this.node.getAttribute(_TREE_NODE_DISPLAY) != '0';
	}
	/*
	 * 是否为激活节点
	 * 返回：	true/false
	 */
	this.isActive = function() {
		return treeObj.isActiveNode(this.node);
	}
	/*
	 * 获取节点的选择状态
	 * 返回：	多选树：0/1/2；单选数：1/0
	 */
	this.getSelectedState = function() {
		var state = this.node.getAttribute(_TREE_NODE_CHECKTYPE);
		if(/^(1|2)$/.test(state)) {
			return parseInt(state);
		} 
		return 0;
	}
	/*
	 * 点击节点文字标签时，根据现有状态改成下一个选择状态
	 * 参数：	noChildren	不包含子节点
	 * 根据原有的选择状态，改变状态。如为1，2则返回0，否则返回1
	 */
	this.changeSelectedStateByActive = function(noChildren) {
		treeObj.changeCheckedStateByActive(this, noChildren);
	}
	/*
	 * 根据现有状态改成下一个选择状态
	 * 参数：noChildren	选中节点时不包含子节点
	 *		 noFireChangeEvent	是否触发onChange事件
	 * 根据原有的选择状态，改变状态。如为1，2则返回0，否则返回1
	 */
	this.changeSelectedState = function(noChildren, noFireChangeEvent) {
		this.setSelectedState(treeObj.getNextState(this), noChildren, noFireChangeEvent);
	}
	/*
	 * 设置选中状态，同时刷新相关节点的选择状态
	 * 参数：	state	选择状态
	 *			noChildren	只选中自己节点（只对选中时有效）
	 *			noFireChangeEvent	是否触发onChange事件
	 */
	this.setSelectedState = function(state, noChildren, noFireChangeEvent) {
		if(!this.isCanSelected() || treeObj.isAllDisabledCheckType()) {	//不可选择则返回
			return;
		}
		if(state == 1 && treeObj.isActiveBySelected(state)) {
			var eventObj = createEventObject();
			eventObj.treeNode = this;
			eventObj.returnValue = true;
			eventObj.type = "_BeforeSelectedAndActived(Selected)";
			eventBeforeSelectedAndActived.fire(eventObj);
			if(!eventObj.returnValue) {
				return;
			}
		}
		if(state == 1) {
			var eventObj = createEventObject();
			eventObj.treeNode = this;
			eventObj.returnValue = true;
			eventObj.type = "_BeforeSelected";
			eventBeforeSelected.fire(eventObj);
			if(!eventObj.returnValue) {
				return;
			}
		}
		justSelected(this, state, noChildren, noFireChangeEvent);
		if(!this.isActive() && treeObj.isActiveBySelected(state)) {
			var eventObj = createEventObject();
			eventObj.treeNode = this;
			eventObj.returnValue = true;
			eventObj.type = "_BeforeActivedBySelected";
			eventBeforeActived.fire(eventObj);
			if(!eventObj.returnValue) {
				return;
			}
			justActive(this);
		}
	}

	/*
	 * 获取父节点的TreeNode对象
	 * 返回：	TreeNode/null
	 */
	this.getParent = function() {
		return instanceTreeNode(this.node.parentNode);
	}
	/*
	 * 获取ids，自己和子节点的id字符串，默认为自己和全部子节点中选中状态(全选、半选)的节点id字符串
	 * 参数：isAll	是否为全部自己、子节点的Id
	 *       onlySelected	只包括全选的
	 * 返回：	id，字符串：id1,id2,id3
	 */
	this.getIds = function(isAll, onlySelected) {
		if(isAll) {
			var path = ". | .//treeNode";  // 当前节点及其所有的子节点
		} 
		else {
			if(onlySelected) {
				var path = ".[@checktype='1'] | .//treeNode[@checktype='1']";
			} else {
				var path = ".[@checktype='1' or @checktype='2'] | " 
						 + ".//treeNode[@checktype='1' or @checktype='2']";
			}
		}
		var nodes = this.node.selectNodes(path);
		var ids = "";
		for(var i = 0; i < nodes.length; i++) {
			var id = nodes[i].getAttribute(_TREE_NODE_ID);
			if(id == _TREE_ROOT_NODE_ID) continue;
			
			if (i > 0) {
				ids += ",";
			}
			ids += id;
		}
		return ids;
	}
	
	/*
	 * 获取id
	 */
	this.getId = function() {
		return this.node.getAttribute(_TREE_NODE_ID);
	}
	/*
	 * 设定id
	 */
	this.setId = function(id) {
		var node = treeObj.getXmlRoot().selectSingleNode(".//treeNode[@id='" + id + "']");
		if( node && node != this.node ) {
			return alert("同id的节点已经存在！[id:" + id + "]");
		}
		
		//设置xml对象的id
		this.node.setAttribute(_TREE_NODE_ID, id);
	}
	/*
	 * 获取Name
	 * 返回：	name，字符串
	 */
	this.getName = function() {
		return this.node.getAttribute(_TREE_NODE_NAME);
	}
	/*
	 * 设定Name
	 */
	this.setName = function(name) {
		this.node.setAttribute(_TREE_NODE_NAME, name);
	}
	/*
	 * 获取FullName
	 * 返回：	fullName，字符串
	 */
	this.getFullName = function() {
		return this.node.getAttribute(_TREE_NODE_FULLNAME);
	}
	/*
	 * 设定FullName
	 */
	this.setFullName = function(fullName) {
		this.node.setAttribute(_TREE_NODE_FULLNAME, fullName);
	}
	/*
	 * 激活节点
	 * 参数：noChildren		选中节点时，是否不包含子节点
	 */
	this.setActive = function(noChildren) {
		if( !this.isCanSelected() ) {
			return;
		}
		
        justActive(this);
		justSelected(this, treeObj.getNextState(this), noChildren);
	}
	/*
	 * 打开节点，让节点出现在可视区域内。
	 */
	this.focus = function() {
		// 打开未被打开的父节点，父节点的父节点，以此类推。
		openNode(this.node.parentNode);

		displayObj.resetTotalTreeNodes();

		// 如果节点没有在可视区域内，则滚动节点到可是区域
		displayObj.scrollTo(this.node);
	}
	/*
	 * 设置链接为可用
	 * 参数：isAllParent	是否同时启用所有停用的父节点
	 */
	this.enabled = function(isAllParent) {
		if( isAllParent ) {
			var node = this.node;
			while( node && node.getAttribute(_TREE_NODE_ID) != _TREE_ROOT_NODE_ID
					&& node.getAttribute(_TREE_NODE_DISPLAY) == '0') {
				node.setAttribute(_TREE_NODE_DISPLAY, "1");
				node = node.parentNode;
			}
		}
		else {
			this.node.setAttribute(_TREE_NODE_DISPLAY, "1");
		}
	}

	/*
	 * 设置链接为不可用
	 * 参数：isAllChildren	是否同时停用子节点
	 */
	this.disabled = function(isAllChildren) {
		if(isAllChildren) {
			var nodes = this.node.selectNodes(".|.//" + _TREE_NODE);
			for(var i = 0; i < nodes.length; i++) {
				nodes[i].setAttribute(_TREE_NODE_DISPLAY, "0");
			}
		}
		else {
			this.node.setAttribute(_TREE_NODE_DISPLAY, "0");
		}
	}
	/*
	 * 设定节点的可选择属性
	 * 参数：	canSelected:	1/0 前者代表可选择，后者代表不可选
	 */
	this.setCanSelected = function(canSelected) {
		this.node.setAttribute(_TREE_NODE_CANSELECTED, canSelected);
	}

	/*
	 * 点击文字标签时，改变节点伸缩状态
	 */
	this.changeFolderStateByActive = function() {
		treeObj.changeOpenStateByActive(this);
	}

	/*
	 * 改变节点的伸缩状态
	 */
	this.changeFolderState = function() {
		if(this.isOpened()) {	
			this.close();	// 关闭子节点
		} 
		else {
			this.open();	// 打开子节点
		}
	}
	/*
	 * 打开子节点
	 */
	this.open = function() {
		this.node.setAttribute("_open", "true");	// 标记当前节点为打开状态

		// 此节点打开，打开因此节点关闭而关闭的子枝节点，同时去除标记。
		openChildNodesCloseByThisNode(this.node);

		displayObj.resetTotalTreeNodes();
		
		// 如果节点或其打开的子节点没有在可视区域内，则滚动节点使其及其子节点全部出现在可视区或使其在最上端
		displayObj.scrollTo(this.node);
	}
	/*
	 * 关闭子节点
	 */
	this.close = function() {
		this.node.setAttribute("_open", "false");	//标记当前节点为关闭状态

		//此节点关闭，关闭此节点的打开的子枝节点，同时标记关闭的原因。
		closeOpendChildNodes(this.node);

		displayObj.resetTotalTreeNodes();
	}
	/*
	 * 删除当前节点
	 * 返回：	true/false	前者表删除成功，后者表失败
	 */
	this.remove = function() {
		//删除xml中的此节点
		this.node.parentNode.removeChild(this.node);

		displayObj.resetTotalTreeNodes();
		return true;
	}
 
	this.appendChild = function(xml) {
		return _appendChild(xml, this.node);
	}
 
	this.appendRoot = function(xml) {
		return return _appendChild(xml, treeObj.getXmlRoot());;
	}
	/*
	 * 移动当前节点
	 * 参数：	toTreeNode	目标节点的TreeNode对象
	 *			moveState	移动状态：-1，移动到目标节点的上面，1，移动到目标节点的下面，1为缺省状态
	 * 返回：	true/false	是否移动节点成功
	 */
	this.moveTo = function(toTreeNode, moveState) {
		if( !(toTreeNode instanceof TreeNode) || this.node.parentNode == null ) {
			return false;
		}
		
		var beforeNode = (moveState == -1 ? toTreeNode.getXmlNode() : toTreeNode.getXmlNode().nextSibling;
		toTreeNode.getXmlNode().parentNode.insertBefore(this.node, beforeNode);
		
		displayObj.resetTotalTreeNodes();
		return true;
	}
	/*
	 * 获取当前节点的XML节点对象，该对象是一个浅拷贝对象（不包含当前节点子节点）。
	 */
	this.toElement = function() {
		return this.node.cloneNode(false);
	}
	/*
	 * 获取当前节点的XML节点对象的xml字符串
	 * 返回：	xml字符串，当前节点的浅拷贝对象的xml字符串
	 */
	this.toString = function() {
		return this.toElement().xml;
	}
	/*
	 * 获取节点属性字符串
	 */
	this.getAttribute = function(name) {
		return this.node.getAttribute(name);
	}
	/*
	 * 设置节点属性字符串
	 */
	this.setAttribute = function(name, value) {
		value = value || "";

		if(name == _TREE_NODE_ID) {	//修改id
			this.setId(value);
		}
		else if(name == _TREE_NODE_NAME) {	//修改name
			this.setName(value);
		}
		else if(name == _TREE_NODE_FULLNAME) { //修改fullname
			this.setFullName(value);
		}
		else if(name == _TREE_NODE_DISPLAY) {	// 修改display
			if(value == 1) {
				this.enabled();
			} else {
				this.disabled();
			}
		} else if(name == _TREE_NODE_CHECKTYPE) { //修改checkType
			this.setSelectedState(value);
		} 
		else if(name == _TREE_NODE_CANSELECTED) { //修改canSelected
			this.setCanSelected(value);
		}
		else {	// 修改其他属性
			this.node.setAttribute(name, value);
		}
	}
	/*
	 * 使用一段合法的xml字符串更新该节点的所有属性信息。
	 */
	this.setAttrbutesByXmlStr = function(xml) {
		var newNodeXML = loadXmlToNode(xml);
		if(newNodeXML && newNodeXML.documentElement) {
			var attributes = newNodeXML.documentElement.attributes;
			for(var i = 0; i < attributes.length; i++) {
				this.setAttribute(attributes[i].name, attributes[i].value);
			}
		}		
	}
	/*
	 * 刷新页面显示
	 */
	this.reload = function () {
		displayObj.reload();
	}

	
	/*
	 * 添加节点
	 * 参数：	xml	合法的节点xml字符串
	 * 返回：	TreeNode/null	前者表添加根节点成功，返回新节点的TreeNode; 后者表失败
	 */
	function appendChild(xml, parent) {
		//生成新节点
		var xmlDom = loadXmlToNode(xml);
		if(xmlDom == null || xmlDom.documentElement == null || xmlDom.documentElement.nodeName != _TREE_NODE) {
			return alert("TreeNode对象：新增节点xml数据不能正常解析！");
		}
		
		var newNode = parent.appendChild(xmlDom.documentElement);

		var treeNode = instanceTreeNode(newNode);
		if(treeNode instanceof TreeNode) {
			refreshStatesByNode(treeNode);	 // 根据新节点的选择状态刷新相关节点
		}

		displayObj.resetTotalTreeNodes();
		return treeNode;
	}
	
	/*
	 * 打开因此节点关闭而关闭的节点，即子节点本身是打开的，只是此节点关闭才不显示的
	 */
	function openChildNodesCloseByThisNode(node) {
		var nodes = node.selectNodes(".//treeNode[@_closeBy = '" + node.getAttribute(_TREE_NODE_ID) + "']");
		for(var i = 0; i < nodes.length; i++) {
			nodes[i].setAttribute("_open", "true");
			nodes[i].removeAttribute("_closeBy");	//去除因父节点关闭而不显示的标记
		}
	}
	/*
	 * 关闭此节点下已经打开的子节点，即此节点关闭的话，打开的字节点也应关闭
	 */
	function closeOpendChildNodes(node) {
		var nodes = node.selectNodes(".//treeNode[@_open = 'true']");
		for(var i = 0; i < nodes.length; i++) {
			nodes[i].setAttribute("_open", "false");
			nodes[i].setAttribute("_closeBy", node.getAttribute(_TREE_NODE_ID));	// 因此节点关闭而不显示
		}
	}
	/*
	 * 激活节点，触发相应事件
	 */
	function justActive(treeNode) {
		// 设置节点为激活
		treeObj.setActiveNode(treeNode);
	}

	/*
	 * 选中节点 
	 */
	function justSelected(treeNode, state, noChildren) {
        if(false == treeObj.isMenu()) {
            if(state == 1 && noChildren && treeNode.node.hasChildNodes()) {
                setNodeState(treeNode.node, 2);
            } else {
                setNodeState(treeNode.node, state);
            }
			
			// 刷新相应节点的选中状态
            refreshStatesByNode(treeNode, noChildren);	 
        }
	}
	
	/*
	 * 根据给定的节点的选中状态，刷新相应节点的选中状态
	 * 参数：	TreeNode节点对象
	 *			noChildren	选中节点时，只选中自己节点，不影响子节点
	 */
	function refreshStatesByNode(treeNode, noChildren) {
		treeObj.refreshStates(treeNode, noChildren);
	}
}


/*
 * 根据xml节点获取TreeNode对象的一个实例
 * 参数：	node	xml节点
 * 返回值：	TreeNode
 */
function instanceTreeNode(node) {
	if(node == null) {
		return null;
	}
	return new TreeNode(node);
}
 
///////////////////////////////////////////////////////////////////////////
//	对象名称：Row	 												     //
//	职责：	负责页面上tr对象中显示节点。							     //
//			只要给定一个xml节点，此对象负责将节点显示到对应的tr中。	     //
///////////////////////////////////////////////////////////////////////////
 
function Row(tr) {
	this.row = tr;
	this.node;
	
	this.nobr;
	this.line;
	this.folder;  // 页面显示的伸缩状态对象
	this.icon;
	this.checkType; // 页面显示的选择状态对象
	this.label;    // 页面显示的文字链接对象
}

Row.prototype = new function () {
	/*
	 * 重新设定相关xml节点
	 * 参数：	node	树节点的xml节点
	 */
	this.setXmlNode = function (node) {
	
	// 初始化参数（获取指向行内个对象的链接）
		if(this.nobr == null) {
			try {
				this.nobr   = this.row.cells[0].firstChild;
				this.line   = this.nobr.firstChild;
				this.folder = this.line.nextSibling;
				this.label  = this.icon.nextSibling;
				this.icon   = this.folder.nextSibling;

				if( !treeObj.isMenu() ) {
					this.checkType = this.folder.nextSibling;
					this.icon = this.checkType.nextSibling;				
				}
			} catch(e) {
				this.nobr = createObjByTagName("nobr");
				this.row.cells[0].appendChild(this.nobr);
				
				this.line   = this.nobr.appendChild(createObjByTagName("span"));
				this.folder = this.nobr.appendChild(createObjByTagName("img", _TREE_NODE_FOLDER_STYLE));
				this.icon   = this.nobr.appendChild(createObjByTagName("img", _TREE_NODE_ICON_STYLE));
				this.label  = this.nobr.appendChild(createObjByTagName("a"));
				if( !treeObj.isMenu() ) {
					this.checkType = this.nobr.appendChild(createObjByTagName("img", _TREE_NODE_CHECK_TYPE_STYLE));
				}	
			}
		}
		
		if(node == null) {
			this.setClassName();
			this.nobr.removeNode(true);
			
			this.nobr = null;
			this.line = null;
			this.folder = null;
			this.icon = null;
			this.checkType = null;
			this.label = null;
			this.node = null;
			return;
		}
		
	    this.line.innerHTML = getFrontStr(this.row, node, treeObj.getXmlRoot());
		this.setFolder(node);
		this.setIcon(node);
		this.setLabel(node);
		this.node = node;
		
		if( !treeObj.isMenu() ) {
			this.checkType.src = treeObj.getCheckTypeImageSrc(node);
		}
	}
 
	/*
	 * 创建页面显示的元素
	 * 参数：	name	对象标记名(小写)
	 *			className	样式类型名
	 * 返回值：页面元素对象
	 */
	function createObjByTagName(name, className) {
   		var obj = document.createElement(name);
		if( className ) {
			obj.setAttribute("className", className);
		}
		if( name == "a" ) {
			obj.setAttribute("hideFocus", "1");
			obj.setAttribute("href", "");
		}
		return obj;
	}
 
	/*
	 * 设置伸缩图标
	 */
	this.setFolder = function(node) {
		var folderImage;
		var hasChild = node.hasChildNodes() || node.getAttribute("hasChild") == "1";
		var isOpen = node.getAttribute("_open") == "true"
		
		if( node.parentNode && treeObj.getXmlRoot() == node.parentNode) { // 是第一层树节点
			folderImage = hasChild ? (isOpen ? _TREE_ROOT_CONTRACT_IMAGE : _TREE_ROOT_EXPAND_IMAGE) : _TREE_ROOT_NODE_LEAF_IMAGE;
		} 
		else {
			folderImage = hasChild ? (isOpen ? _TREE_NODE_CONTRACT_IMAGE : _TREE_NODE_EXPAND_IMAGE) : _TREE_NODE_LEAF_IMAGE;		
		}
		this.folder.src = _baseUrl + folderImage;
	}
 
	/*
	 * 设定文字链接
	 */
	this.setLabel = function(node) {
		var name     = node.getAttribute(_TREE_NODE_NAME);
		var fullName = node.getAttribute(_TREE_NODE_FULLNAME);
		var canSelected = node.getAttribute(_TREE_NODE_CANSELECTED);
		var display  = node.getAttribute(_TREE_NODE_DISPLAY);
		
		this.label.innerText = name;
		this.label.title = fullName || name;
		this.label.setAttribute("disabled", (display == '0' || canSelected == '0'));
		
		this.setClassName(treeObj.getStyleClass(node));
	}
 
	/*
	 * 设定文字链接的样式
	 */
	this.setClassName = function (className) {		
		if( isNullOrEmpty(className) ) {
			this.row.className = "";
			this.label.removeAttribute("className");
		} 
		else {
			this.row.className = this.label.className = className;
		}
	}
 
	/*
	 * 设置自定义图标
	 */
	this.setIcon = function(node) {
		var iconSrc = node.getAttribute(_TREE_NODE_ICON_ATTRIBUTE);
		if( !isNullOrEmpty(iconSrc) ) {
			this.icon.src    = iconSrc;
			this.icon.width  = _TREE_NODE_ICON_WIDTH;
			this.icon.height = _TREE_NODE_ICON_HEIGHT;
			this.icon.style.display = "";
		} else {
			this.icon.style.display = "none";
		}
	}

	/*
	 * 获取节点前面的制表符字符串
	 * 参数：	node	节点
	 *			rootNode	根节点
	 * 返回值：	string	制表符字符串
	 */
	function getFrontStr(row, node, rootNode) {
		if(node.parentNode == rootNode) {
			node.setAttribute("_childFrontStr", '');
			return '<span class="rootSpace"></span>';
		}
		
		if(isFirstLine(row) || node.parentNode.getAttribute("_childFrontStr") == null) {
			getFrontStr(row, node.parentNode, rootNode);
		}
		var parentFrontStr = node.parentNode.getAttribute("_childFrontStr");
		
		if( isLastChild(node) ) {
			node.setAttribute("_childFrontStr", parentFrontStr + '<span class="space"></span>');
			return parentFrontStr + '<span class="vHalfLine"></span>';
		}  
		node.setAttribute("_childFrontStr", parentFrontStr + '<span class="onlyVLine"></span>');
		return parentFrontStr + '<span class="vline"></span>';
	}

}



////////////////////////////////////////////////////////////////////////////////
//	对象名称：Display														   //
//	职责：	负责处理将用户可视部分的节点显示到页面上。						   //
//			控件一切页面上的元素都有此对象生成和调度（tr对象有Row对象专门处理）//
////////////////////////////////////////////////////////////////////////////////
 
function Display(treeObj) {
	var _windowHeight = Math.max(element.offsetHeight - _TREE_SCROLL_BAR_WIDTH, _TREE_BOX_MIN_HEIGHT);
	var _windowWidth  = Math.max(element.offsetWidth - _TREE_SCROLL_BAR_WIDTH, _TREE_BOX_MIN_WIDTH);
	var _rowHeight    = _TREE_NODE_DISPLAY_ROW_HEIGHT;
	var _pageSize     = Math.floor(_windowHeight / _rowHeight);
	
	var _totalTreeNodes = treeObj.getXmlRoot().selectNodes(".//treeNode[../@_open = 'true']");
	var _totalTreeNodesNum = _totalTreeNodes.length;
	
	var _vScrollBox;
	var _vScrollDiv;
	var _hScrollBox;
	var _hScrollDiv;
	var _rootBox;
	var _rootTable;
	var _scrollTimer;
	var _startNum;
	
	var _Rows = new Array(_pageSize);
	
	element.style.overflow = 'hidden';
	element.onresize = resize;
	element.onmousewheel = function() {
		_vScrollBox.scrollTop += -Math.round(window.event.wheelDelta / 120) * _rowHeight;
	}
	element.onkeydown = function() {
		switch (event.keyCode) {
		    case 33:	//PageUp
				_vScrollBox.scrollTop -= _pageSize * _rowHeight;
				return false;
		    case 34:	//PageDown
				_vScrollBox.scrollTop += _pageSize * _rowHeight;
				return false;
		    case 35:	//End
				_vScrollBox.scrollTop = _vScrollDiv.offsetHeight - _windowHeight;
				return false;
		    case 36:	//Home
				_vScrollBox.scrollTop = 0;
				return false;
		    case 37:	//Left
				_hScrollBox.scrollLeft -= 10;
				return false;
		    case 38:	//Up
				_vScrollBox.scrollTop -= _rowHeight;
				return false;
		    case 39:	//Right
				_hScrollBox.scrollLeft += 10;
				return false;
		    case 40:	//Down
				_vScrollBox.scrollTop += _rowHeight;
				return false;
		}
	}
	this.init();
	
	/*
	 * 生成默认展示的树节点。
	 */
	this.init = function() {
		element.innerHTML = "";
		
		// 生成滚动条
		var vScrollStr = '<div id="treeVScrollBox" style="position:absolute;overflow-y:auto;heigth:100%;width:17px;top:0px;right:0px;"><div id="treeVScrollDiv" style="width:1px"></div></div>';
		var hScrollStr = '<div id="treeHScrollBox" style="position:absolute;overflow-x:auto;overflow-y:hidden;heigth:17px;width:100%;bottom:0px;left:0px"><div id="treeHScrollDiv" style="higth:1px"></div></div>';
		element.insertAdjacentHTML('afterBegin', vScrollStr + hScrollStr);
		_vScrollBox = element.all("treeVScrollBox");
		_vScrollDiv = element.all("treeVScrollDiv");
		_hScrollBox = element.all("treeHScrollBox");
		_hScrollDiv = element.all("treeHScrollDiv");
		_vScrollBox.onscroll = onVScroll;
		_hScrollBox.onscroll = onHScroll;
		
		// 生成页面上显示节点的table对象。
		var tableStr = '<div id="treeRootBox" style="position:absolute;overflow:hidden;top:0px;left:0px"><table id="treeRootTable" cellspacing="0"></table></div>';
		element.insertAdjacentHTML('afterBegin', tableStr);
		_rootBox   = element.all("treeRootBox");
		_rootTable = element.all("treeRootTable");
		for(var i = 0; i < _pageSize; i++) {
			var tr = _rootTable.insertRow();
			tr.insertCell();
			_Rows[i] = new Row(tr);
		}
		
		// 设置滚动条的大小
		vScrollBox.style.height = _windowHeight;
		_vScrollDiv.style.height = (_totalTreeNodesNum - _pageSize) * _rowHeight + _windowHeight;
		_hScrollBox.style.width = _windowWidth;
		_hScrollDiv.style.width = _rootTable.style.width; 
		
		// 设置显示节点的table对象的大小
		_rootBox.style.height = _windowHeight;
		_rootBox.style.width = _windowWidth;
	}
 
	/*
	 * 根据滚动状态，显示可视范围内的树节点。
	 */
	this.reload = function refresh() {
		var startTime = new Date();
		if(_totalTreeNodesNum <= _pageSize) {
			_startNum = 0;
		} else {
			_startNum = Math.ceil(_vScrollBox.scrollTop  / _rowHeight);
		}
		//显示节点
		for(var i = 0; i < _pageSize; i++) {
			var nodeIndex = i + _startNum;
			if(nodeIndex < _totalTreeNodesNum) {
				_Rows[i].setXmlNode(_totalTreeNodes[nodeIndex]);
			} else {
				_Rows[i].setXmlNode();
			}
		}
		//同步横向滚动条的大小
		_hScrollDiv.style.width = _rootTable.offsetWidth;

		refreshUI();

		window.status = new Date() - startTime;  // 看看效率如何
	}
	
	/*
	 * 根据页面上的行数，获取相应的Row对象
	 * 参数：	index	行序号
	 * 返回值：	Row对象/null
	 */
	this.getRowByIndex = function (index) {
		if(index >= _pageSize || index < 0) {
			alert("Display对象：行序号[" + index + "]超出允许范围[0 - " + _pageSize + "]！");
			return null;
		}
		return _Rows[index];
	}
	
	/*
	 * 重新获取所有可以显示的节点数组
	 */
	this.resetTotalTreeNodes = function() {
		_totalTreeNodes = treeObj.getXmlRoot().selectNodes(".//treeNode[../@_open = 'true']");
		_totalTreeNodesNum = _totalTreeNodes.length;

		_vScrollDiv.style.height = Math.max(1, (_totalTreeNodesNum - _pageSize) * _rowHeight + _windowHeight);
	}
	
	/*
	 * 获取页面table对象
	 */
	this.getRootTable = function() {
		return _rootTable;
	}
	
	/*
	 * 将节点滚动到可视范围之内
	 */
	this.scrollTo = function(node) {
		var nodeIndex = null;
		for(var i = 0; i < _totalTreeNodesNum; i++) {
			if(_totalTreeNodes[i] == node) {
				nodeIndex = i;
				break;
			}
		}
		if(nodeIndex == null) return;

		var childNums = node.selectNodes(".//treeNode[../@_open = 'true']").length;
		if(childNums + 1 > _pageSize || nodeIndex < _startNum  || nodeIndex >= _startNum + _pageSize) {
            _vScrollBox.style.display = 'block';
			_vScrollBox.scrollTop = nodeIndex * _rowHeight;
		}
		else if (nodeIndex + childNums + 1 - _pageSize > _startNum) {
            _vScrollBox.style.display = 'block';
			_vScrollBox.scrollTop = (nodeIndex + childNums + 1 - _pageSize) * _rowHeight;
		} 
		else {
			this.reload();
		}
	}
	
	/*
	 * 向上滚动一个节点
	 */
	this.scrollUp = function() {
		_vScrollBox.scrollTop -= _rowHeight;
	}
	
	/*
	 * 向下滚动一个节点
	 */
	this.scrollDown = function() {
		_vScrollBox.scrollTop += _rowHeight;
	}
	
	/*
	 * 获取滚动条的位置
	 */
	this.getScrollTop = function() {
		return _vScrollBox.scrollTop;
	}
	
	/*
	 * 纵向滚动事件触发后，延时执行reload，如果第二次触发时，上次的事件还没有执行，
	 * 则取消上次事件，触发本次事件。为的是防止多次触发，屏幕抖动。
	 */
	function onVScroll() {
 		if (_scrollTimer) {
			window.clearTimeout(_scrollTimer);
		}
		_scrollTimer = window.setTimeout(refresh, _TREE_SCROLL_DELAY_TIME);
	}
	
	/*
	 * 横向滚动事件
	 */
	function onHScroll() {
		_rootBox.scrollLeft = this.scrollLeft;
	}
	
	/*
	 * 当窗口大小改变后，初始化所有相关参数，并且重新计算所要显示的节点。
	 */
	function resize() {
		// 增加延时，避免极短时间内重复触发多次
		clearTimeout(element._resizeTimeout);
		element._resizeTimeout = setTimeout(function() {
			var tempWindowHeight = Math.max(element.offsetHeight - _TREE_SCROLL_BAR_WIDTH, _TREE_BOX_MIN_HEIGHT);
			var tempWindowWidth  = Math.max(element.offsetWidth  - _TREE_SCROLL_BAR_WIDTH, _TREE_BOX_MIN_WIDTH);

			if(_windowHeight != tempWindowHeight || _windowWidth != tempWindowWidth) {
				_windowHeight = tempWindowHeight;
				_windowWidth = tempWindowWidth;
			} else {				
				return ; // 触发前后尺寸无变化
			}
				
			var pageSize = Math.floor(_windowHeight / _rowHeight);
			_vScrollBox.style.height = _windowHeight;
			_hScrollBox.style.width = _windowWidth;

			_rootBox.style.height = _windowHeight;
			_rootBox.style.width = _windowWidth;
			
			if(pageSize == _pageSize) {
				refreshUI();
				return;
			}

			// 修正尺寸变化时行数显示错误问题
			_Rows = new Array(pageSize);
			if(pageSize > _pageSize) { // 高度增加时
				for(var i = 0; i < pageSize; i++) {
					if(i < _pageSize) {
						var tr = _rootTable.rows[i];
					} else {
						var tr = _rootTable.insertRow();
						tr.insertCell();
					}
					_Rows[i] = new Row(tr);
				}
			}
			else if (pageSize < _pageSize) { // 高度减少时				
				for(var i = 0; i < pageSize; i++) {
					var tr = _rootTable.rows[i];
					_Rows[i] = new Row(tr);
				}
				for(var i = pageSize; i < _pageSize; i++) {
					_rootTable.deleteRow(pageSize);
				}
			}
			_pageSize = pageSize;
			refresh();
		}, 20);
	}
	
	/*
	 * 刷新页面展示：数据展示框、滚动条等
	 */
	function refreshUI() {
		if(_totalTreeNodesNum > _pageSize) {
			_vScrollBox.style.display = 'block';
			_hScrollBox.style.width = _windowWidth;
			_rootBox.style.width = _windowWidth;
		} else {
			_vScrollBox.style.display = 'none';
			_hScrollBox.style.width = _windowWidth + _TREE_SCROLL_BAR_WIDTH;
			_rootBox.style.width = _windowWidth + _TREE_SCROLL_BAR_WIDTH;
		}
		if(_rootTable.offsetWidth > _windowWidth) {
			_hScrollBox.style.display = 'block';
			_vScrollBox.style.height = _windowHeight;
			_rootBox.style.height = _windowHeight;
		}else{
			_hScrollBox.style.display = 'none';
			_vScrollBox.style.height = _windowHeight + _TREE_SCROLL_BAR_WIDTH;
			_rootBox.style.height = _windowHeight + _TREE_SCROLL_BAR_WIDTH;
		}
	}
	
	/*
	 * 获取页面上所能展示的行数
	 */
	this.getPageSize = function () {
	    return _pageSize;
	}
}


//////////////////////////////////////////////////////////////////////////////
///////////////////     	对象名称：Search					//////////////
//////////////////      	职责：	查询树上节点。				//////////////
//////////////////////////////////////////////////////////////////////////////
 
/* 查询方式 */
var _TREE_SEARCH_TYPE_INEXACT_SEARCH = "hazy";	// 模糊查询
var _TREE_SEARCH_TYPE_EXACT_SEARCH   = "rigor";	// 精确查询

/*
 * 对象说明：负责查询树节点对象的对象
 */
function Search(treeObj) {
	var _findedNodes = new Array();
	var _findedIndex;
	var _findedNode;
	
	/*
	 * 查询得到所有符合要求的结果
	 * 参数：	searchStr	查询的字符串
	 *			searchField	查询的属性名称
	 *			searchType	查询方式：hazy(模糊)/rigor(精确)，默认为rigor
	 */	
	this.search = function(searchStr, searchField, searchType) {
		_findedNodes = new Array();
		if(isNullOrEmpty(searchStr)) {
			alert("查询条件不能为空！");
			return false;
		}
		if(isNullOrEmpty(searchField)) {
			alert("查询条件的属性名称不能为空！");
			return false;
		}
		
		if(searchType == _TREE_SEARCH_TYPE_INEXACT_SEARCH) {
			var allNodes = treeObj.getXmlRoot().selectNodes(".//treeNode" );
			for(var i = 0; i < allNodes.length; i++) {	// 模糊查询所有节点
				var fieldValue = allNodes[i].getAttribute(searchField);
				if( fieldValue && fieldValue.indexOf(searchStr) != -1) {
					_findedNodes[_findedNodes.length] = allNodes[i];
				}
			}
		} else {
			var xpath = ".//treeNode[@" + searchField + "='" + searchStr + "']";
			_findedNodes = treeObj.getXmlRoot().selectNodes(xpath);
		}
		_findedIndex = -1;
		return true;
	}
	/*
	 * 是否拥有查询结果
	 */	
	this.hasResult = function() {
		return _findedNodes.length > 0;
	}
	/*
	 * 获取查询得到的第一个结果
	 * 参数： direct	查询方向：默认为向下查询
	 */	
	this.first = function (direct) {
		_findedIndex = (direct == "down") ? 0 : _findedNodes.length - 1;
		showFindedTreeNode(_findedIndex);
	}
	/*
	 * 获取查询结果的下一个结果
	 * 参数：   direct		查询方向：默认为向下查询
	 *			isCircle	是否循环查询，默认为不循环查询
	 */	
	this.next = function (direct, isCircle) {
		if(direct == "down") {
			_findedIndex += 1;
			if(_findedNodes.length <= _findedIndex) {
				_findedIndex = isCircle ? 0 : _findedNodes.length - 1;
			}
		}else{
			_findedIndex -= 1;
			if(_findedIndex < 0) {
				_findedIndex = isCircle ? _findedNodes.length - 1 : 0;
			}
		}
		showFindedTreeNode(_findedIndex);
	}
	/*
	 * 展示查询结果，将查询得到的节点以查询结果特定的样式高亮
	 */
	function showFindedTreeNode(index) {
		if(_findedNodes.length == 0) {
			alert("没有查询到相应的结果！");
			setFindedNode(null);
			return;
		}
		setFindedNode(_findedNodes[index]);
	}
	/*
	 * 设定查询结果节点高亮
	 */
	function setFindedNode(node) {
		_findedNode = node;
		treeObj.setFindedNode(node);
		treeNode = instanceTreeNode(node);
		if( treeNode instanceof TreeNode ) {
			treeNode.focus();
			return
		} 
		
		// 没找到则刷新树
		displayObj.resetTotalTreeNodes();
		displayObj.reload();
	}
}


//////////////////////////////////////////////////////////////////////////////
//		                       公用函数	   	                                //
//////////////////////////////////////////////////////////////////////////////

/*
 * 获取控件参数
 */
function getValue(name, defaultValue) {
	return eval("element." + name) || defaultValue;
}

/*
 * 判断节点是否为父节点的最后一个节点
 * 参数：node	xml节点对象
 * 返回值：true/false
 */
function isLastChild(node) {
	return node == node.parentNode.lastChild;
}

/*
 * 打开默认打开节点
 * 参数：	openedNode	xml对象中需要打开的节点
 */
function openNode(openedNode) {
	while( openedNode ) {
		openedNode.setAttribute("_open", "true");
		if(openedNode == treeObj.getXmlRoot()) {
			return;
		}
		openedNode = openedNode.parentNode;
	}
}

/*
 * 设定节点的选择状态。
 * 参数：	node			节点的xml对象
 *			state			选择状态
 */
function setNodeState(node, state) {
	if(node == null) return;

	if( state ) {
		node.setAttribute(_TREE_NODE_CHECKTYPE, state);	//在xml节点中标记选择状态
	} else { 
		node.removeAttribute(_TREE_NODE_CHECKTYPE);
	}
}

/*
 * 刷新所有子节点
 */
function refreshChildrenNodeState(node) {
	var childNodes = node.selectNodes(".//treeNode" );
	for(var i = 0; i < childNodes.length; i++) {
		setNodeState(childNodes[i], node.getAttribute(_TREE_NODE_CHECKTYPE));
	}
}

/*
 * 去除所有选中节点的选中状态(包括半选和全选)
 */
function clearSelected(node) {
	var nodes = node.selectNodes(".//treeNode[@checktype='1' or @checktype='2']");
	for(var i = 0; i < nodes.length; i++) {
		setNodeState(nodes[i], 0);
	}
}

/*
 * 刷新所有父节点的选择状态
 */
function refreshParentNodeState(node) {
	var parent = node.parentNode;
	while (parent != treeObj.getXmlRoot()) {		
		var nodeChildNum   = parent.childNodes.length;	// 总子节点数
		var checkedNum     = parent.selectNodes("./treeNode[@checktype='1']").length;	// 全选子节点数
		var halfCheckedNum = parent.selectNodes("./treeNode[@checktype='2']").length; //半选子节点数
		
		var state;
		if(checkedNum == 0 && halfCheckedNum == 0) {	
			state = 0;	// 所有子节点都没有选中，则parent节点标记为未选中
		}else if(nodeChildNum == checkedNum) {
			state = 1;	// 所有子节点都被全选，则parent节点标记全选
		} else {
			state = 2;  // 否则为半选
		}
	
		setNodeState(parent, state);
		parent = parent.parentNode;
	}
}
 
/*
 * 获取对象在树控件可视区域中的位置（对象上边缘距可视区域上边缘的距离）, 获取对象相对于控件顶部的距离。
 * 参数：	objElement	对象
 * 返回：	int
 */
function getTop(objElement) {
	var top = 0;
	var obj = objElement;
	while (obj != element) {
		top = top + obj.offsetTop;
		obj = obj.offsetParent;
	}
	return top;
}

/*
 * 根据显示的对象，获取相应的Row对象
 * 参数：	obj	节点显示在页面上的对象
 * 返回值：	Row对象
 */
function getRow(obj) {
	if(!/^(a|img)$/.test(obj.tagName.toLowerCase())) {
		return null;
	}
	 
	try{
		var index = getRowIndex(obj);
		return displayObj.getRowByIndex(index);
	} catch(e) {		
	}	
}

/*
 * 如果拖到页面的最上、下方，相应的滚动树
 * 参数：	obj	事件触发对象
 */
function startScrollTree(obj) {
    if(obj == null) return;
	
	if(isLastLine(obj)) {
		scrollDown();
	}
	if(isFirstLine(obj)) {
		scrollUp();
	}
}

/*
 * 定时向上滚动
 */
function scrollUp() {
	if(element.scroller) {
		clearTimeout(element.scroller);
		element.scroller = null;
	}
	displayObj.scrollUp();
	element.scroller = setTimeout(scrollUp, _TREE_SCROLL_REPEAT_DELAY_TIME);
}

/*
 * 定时向下滚动
 */
function scrollDown() {
	if(element.scroller ) {
		clearTimeout(element.scroller);
		element.scroller=null;
	}
	displayObj.scrollDown();
	element.scroller = setTimeout(scrollDown, _TREE_SCROLL_REPEAT_DELAY_TIME);
}

/*
 * 如果拖到的不是页面的最上、下方，或者停止拖动，则停止滚动树
 * 参数：	obj	事件触发对象
 */
function stopScrollTree(obj) {
	if(obj && (isLastLine(obj) || isFirstLine(obj))) {
		return;
	}
	
	if (element.scroller) {
		window.clearTimeout(element.scroller);
		element.scroller = null;
	}
}

/*
 * 对象是否在最下面的行中
 */
function isLastLine(obj) {
	return getRowIndex(obj) == (displayObj.getPageSize() - 1);
}

/*
 * 对象是否在最上面的行中
 */
function isFirstLine(obj) {
    return getRowIndex(obj) == 0;
}

/*
 * 获取对象所在行序号
 */
function getRowIndex(obj) {
    while(obj.tagName != null && obj.tagName.toLowerCase() != "tr") {
		obj = obj.parentNode;
	}
	return obj.rowIndex;
}

