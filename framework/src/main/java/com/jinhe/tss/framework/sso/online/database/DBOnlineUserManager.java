package com.jinhe.tss.framework.sso.online.database;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jinhe.tss.framework.persistence.ICommonDao;
import com.jinhe.tss.framework.sso.online.IOnlineUserManager;
import com.jinhe.tss.framework.sso.online.OnlineUser;

/**
 * <p> 在线用户库（数据库） </p>
 * 
 */
@Service
@Transactional
public class DBOnlineUserManager implements IOnlineUserManager {
	
	@Autowired private ICommonDao dao;

    /*
     * 根据 SessionId，应用Code 找到用户并将用户的sessionId置为Null，表示已经注销。
     * 不删除用户记录，方便以后查询用户的登录历史。
     */
    public String logout(String appCode, String sessionId) {
    	String hql = " from DBOnlineUser o where o.appCode = ? and o.sessionId = ?  ";
        List<?> entityList = dao.getEntities(hql, new Object[] {appCode, sessionId});
        
        String token = null;
        if(entityList.size() > 0) {
        	for(Object entity : entityList) {
        		DBOnlineUser temp = (DBOnlineUser) entity;
            	token = temp.getToken();
        		temp.setToken(null);
        		temp.setSessionId(null);
        		dao.create(temp);
        	}
        }
		return token;
    }

    public boolean isOnline(String token) {
        String hql = " from DBOnlineUser o where o.token = ? ";
        List<?> list = dao.getEntities(hql, new Object[] {token});
		return !(list == null || list.isEmpty());
    }

    public Set<OnlineUser> getOnlineUsersByToken(String token) {
    	String hql = " from DBOnlineUser o where o.token = ? ";
    	
    	@SuppressWarnings("unchecked")
    	List<DBOnlineUser> list = (List<DBOnlineUser>) dao.getEntities(hql, new Object[] {token});
    	
    	Set<OnlineUser> onlineUsers = new HashSet<OnlineUser>();
    	for(DBOnlineUser entity : list) {
    		OnlineUser temp = new OnlineUser(entity.getUserId(), entity.getAppCode(), entity.getSessionId(), entity.getToken());
    		onlineUsers.add(temp);
    	}
    	
        return onlineUsers;
    }

    @SuppressWarnings("unchecked")
	public Collection<String> getOnlineUserNames() {
    	String hql = "select distinct o.userName from DBOnlineUser o where o.token is not null ";
        return (Collection<String>) dao.getEntities(hql);
    }

    /*     
     * 如果在线用户库中没有相同的用户存在， 则在在线用户库中添加此记录
     */
    public void register(String token, String appCode, String sessionId, Long userId, String userName) {
    	DBOnlineUser entity = new DBOnlineUser(userId, sessionId, appCode, token, userName);
		dao.create(entity);       
    }

}
