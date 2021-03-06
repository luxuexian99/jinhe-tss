package com.jinhe.tss.um.action;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.dom4j.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.jinhe.tss.framework.persistence.pagequery.PageInfo;
import com.jinhe.tss.framework.sso.AnonymousOperator;
import com.jinhe.tss.framework.sso.Environment;
import com.jinhe.tss.framework.sso.context.Context;
import com.jinhe.tss.framework.sso.online.OnlineUserManagerFactory;
import com.jinhe.tss.framework.web.dispaly.grid.GridDataEncoder;
import com.jinhe.tss.framework.web.dispaly.tree.LevelTreeParser;
import com.jinhe.tss.framework.web.dispaly.tree.TreeEncoder;
import com.jinhe.tss.framework.web.dispaly.xform.XFormEncoder;
import com.jinhe.tss.framework.web.dispaly.xmlhttp.XmlHttpEncoder;
import com.jinhe.tss.framework.web.mvc.BaseActionSupport;
import com.jinhe.tss.um.UMConstants;
import com.jinhe.tss.um.entity.User;
import com.jinhe.tss.um.helper.UMQueryCondition;
import com.jinhe.tss.um.service.IUserService;
import com.jinhe.tss.util.EasyUtils;
import com.jinhe.tss.util.XMLDocUtil;

@Controller
@RequestMapping("/auth/user") 
public class UserAction extends BaseActionSupport {

	@Autowired private IUserService userService;

    /**
     * 获取一个User（用户）对象的明细信息、用户对用户组信息、用户对角色的信息
     */
	@RequestMapping("/detail/{groupId}/{userId}")
    public void getUserInfoAndRelation(HttpServletResponse response, 
    		@PathVariable("userId")  Long userId, 
    		@PathVariable("groupId") Long groupId) {
		
        TreeEncoder existRoleTree = new TreeEncoder(null);
        Map<String, Object> data;
        Map<String, Object> map = new HashMap<String, Object>(); 
        if ( !UMConstants.DEFAULT_NEW_ID.equals(userId) ) { // 编辑用户
            data =  userService.getInfo4UpdateExsitUser(userId);
            User user = (User) data.get("UserInfo");
            map.putAll(user.getAttributesForXForm()); 
           
            // 用户已经对应的角色
            existRoleTree = new TreeEncoder(data.get("User2RoleExistTree"));
        }
        else {
            data =  userService.getInfo4CreateNewUser(groupId);
        }
        
        // 所有该用户自己建立的角色
        TreeEncoder roleTree = new TreeEncoder(data.get("User2RoleTree"), new LevelTreeParser());
        roleTree.setNeedRootNode(false);
        
        // 用户对组
        TreeEncoder groupTree = new TreeEncoder(data.get("User2GroupExistTree"));
 
        Document baseinfoXForm = XMLDocUtil.createDoc(UMConstants.USER_BASEINFO_XFORM);
        Document authenXForm   = XMLDocUtil.createDoc(UMConstants.USER_AUTHINFO_XFORM);
        XFormEncoder baseinfoXFormEncoder = new XFormEncoder(baseinfoXForm, map, true, false);
        XFormEncoder authenXFormEncoder   = new XFormEncoder(authenXForm,   map, true, false); 
        
        print(new String[]{"UserInfo", "AuthInfo", "User2GroupExistTree", "User2RoleTree", "User2RoleExistTree"}, 
                new Object[]{baseinfoXFormEncoder, authenXFormEncoder, groupTree, roleTree, existRoleTree});
    }

	/**
	 * 认证方式
	 */
	@RequestMapping("/auth/{groupId}")
	public void initAuthenticateMethod(HttpServletResponse response, @PathVariable("groupId") Long groupId) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("groupId", groupId);
		XFormEncoder authXFormEncoder = new XFormEncoder(UMConstants.AUTH_METHOD_XFORM, map);
		print("AuthenticateInfo", authXFormEncoder);
	}
	
	@RequestMapping("/uniteAuth/{groupId}/{authenticateMethod}")
	public void uniteAuthenticateMethod(HttpServletResponse response, 
			@PathVariable("groupId") Long groupId, @PathVariable("authMethod") String authMethod) {
		
		userService.uniteAuthenticateMethod(groupId, authMethod);
        printSuccessMessage();
	}
	
	/**
	 * 新增或修改一个User对象的明细信息、用户对用户组信息、用户对角色的信息
	 */
	@RequestMapping(method = RequestMethod.POST)
	public void saveUser(HttpServletResponse response, HttpServletRequest request, User user) {
		String user2GroupExistTree = request.getParameter("User2GroupExistTree");
    	String user2RoleExistTree  = request.getParameter("User2RoleExistTree");
		userService.createOrUpdateUser(user, user2GroupExistTree, user2RoleExistTree);
        printSuccessMessage();
	}
	
	/**
	 * 启用或者停用用户
	 */
	@RequestMapping(value = "/disable/{groupId}/{id}/{state}")
	public void startOrStopUser(HttpServletResponse response, 
			@PathVariable("groupId") Long groupId, 
			@PathVariable("id") Long id, 
			@PathVariable("state")  int state) {
		
		userService.startOrStopUser(id, state, groupId);
        printSuccessMessage();
	}
 
	/**
	 * 删除用户
	 */
	@RequestMapping(value = "/{groupId}/{userId}", method = RequestMethod.DELETE)
	public void deleteUser(HttpServletResponse response, 
			@PathVariable("groupId") Long groupId, 
			@PathVariable("userId")  Long userId) {
		
		userService.deleteUser(groupId, userId);
        printSuccessMessage();
	}
	
	/**
	 * 搜索用户
	 */
	@RequestMapping("/search/{page}")
	public void searchUser(HttpServletResponse response, UMQueryCondition userQueryCon) {
		int page = userQueryCon.getPage().getPageNum();
        PageInfo users = userService.searchUser(userQueryCon, page);
        GridDataEncoder gridEncoder = new GridDataEncoder(users.getItems(), XMLDocUtil.createDoc(UMConstants.MAIN_USER_GRID));
        print(new String[]{"SourceList", "PageInfo"}, new Object[]{gridEncoder, users});
	}

	/**
     * 根据用户组的id获取所在用户组的所有用户
     */
	@RequestMapping("/list/{groupId}/{page}")
    public void getUsersByGroupId(HttpServletResponse response, 
    		@PathVariable("groupId") Long groupId, 
    		@PathVariable("page") int page) {
    	
        PageInfo users = userService.getUsersByGroupId(groupId, page, " u.id asc ");
        GridDataEncoder gridEncoder = new GridDataEncoder(users.getItems(), UMConstants.MAIN_USER_GRID);
        print(new String[]{"SourceList", "PageInfo"}, new Object[]{gridEncoder, users});
    }
 
	/**
	 * 初始化密码
	 */
	@RequestMapping(value = "/initpwd/{groupId}/{userId}/{password}", method = RequestMethod.POST)
	public void initPassword(HttpServletResponse response, 
			@PathVariable("groupId") Long groupId, 
			@PathVariable("userId") Long userId, 
			@PathVariable("password") String password) {	
		
		userService.initPasswordByGroupId(groupId, userId, password);
        printSuccessMessage("初始化密码成功！");
	}
	
	/**
	 * 用户自注册
	 */
	@RequestMapping(value = "/register", method = RequestMethod.POST)
	public void registerUser(HttpServletResponse response, User user) {
        user.setGroupId(UMConstants.SELF_REGISTER_GROUP_ID_NOT_AUTHEN);
		userService.registerUser(user);
        printSuccessMessage("用户注册成功！");
	}
    
    /**
     * 用户自己修改个人信息
     */
	@RequestMapping(value = "/self", method = RequestMethod.PUT)
    public void modifyUserSelf(HttpServletResponse response, User user) {
        userService.updateUser(user);
        printSuccessMessage();
    }

	/**
	 * 获得用户个人信息(注册信息)。
     * 用于用户修改自己的注册信息和密码时用。
	 */
    @RequestMapping("/self/detail")
	public void getUserInfo(HttpServletResponse response) {
        // 匿名用户,返回空模版给其注册 
        if(Context.getIdentityCard().isAnonymous()) {
            print("UserInfo", new XFormEncoder(UMConstants.USER_REGISTER_XFORM, new User()));
        }
        else {
        	User user = userService.getUserById(Environment.getOperatorId());
        	XFormEncoder userEncoder = new XFormEncoder(UMConstants.USER_BASEINFO_XFORM, user);
        	userEncoder.setColumnAttribute("loginName", "editable", "false");
            userEncoder.setColumnAttribute("password",  "editable", "false");
            
            Map<String, Object> tempMap = new HashMap<String, Object>();
            tempMap.put("userId", Environment.getOperatorId());
            tempMap.put("userName", Environment.getUserName());
            tempMap.put("loginName", Environment.getOperatorName());
            XFormEncoder pwdEncoder = new XFormEncoder(UMConstants.PASSWORD_CHANGE_XFORM, tempMap);
            userEncoder.setColumnAttribute("userName", "editable", "false");
            
            print(new String[]{"UserInfo", "PasswordInfo"}, new Object[]{userEncoder, pwdEncoder});
        }
	}
    
    /**
     * 密码提示模板
     */
    @RequestMapping("/forgetpwd")
    public void getForgetPasswordInfo(HttpServletResponse response) {
        print("ForgetInfo", new XFormEncoder(UMConstants.PASSWORD_FORGET_XFORM));
    }
    
    /**
     * 获取当前在线用户信息
     */
    @RequestMapping("/operatorInfo")
    public void getOperatorInfo(HttpServletResponse response) {
        XmlHttpEncoder encoder = new XmlHttpEncoder();
        encoder.put("id", Environment.getOperatorId());
        if(Context.getIdentityCard().isAnonymous()){
            encoder.put("loginName", AnonymousOperator.anonymous.getLoginName());
            encoder.put("name", AnonymousOperator.anonymous.getLoginName());
        }
        else {
            encoder.put("loginName", Environment.getOperatorName());
            encoder.put("name", Environment.getUserName());
        }
        
        encoder.print(getWriter());
    }
    
    /**
     * 读取所有在线用户列表信息
     */
    @RequestMapping("/online")
    public void getOnlineUserInfo(HttpServletResponse response) {
        Collection<String> list = OnlineUserManagerFactory.getManager().getOnlineUserNames();
        print(new String[] {"size", "users"},  new Object[]{list.size(), EasyUtils.list2Str(list, " | ")});
    }
}