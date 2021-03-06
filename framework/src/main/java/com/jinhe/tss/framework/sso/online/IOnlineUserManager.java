package com.jinhe.tss.framework.sso.online;

import java.util.Collection;
import java.util.Set;

/**
 * <p>
 * 在线用户管理类接口
 * </p>
 */
public interface IOnlineUserManager {

    /**
     * <p>
     * 根据token判断用户是否已经登录其他系统，如果登录则返回True，否则返回false
     * </p>
     * @param token
     * @return
     */
    boolean isOnline(String token);

    /**
     * <p>
     * 注册用户登录当前系统
     * </p>
     * @param token 令牌
     * @param appCode 当前系统Code
     * @param sessionId 当前SessionID
     * @param userId 当前系统用户ID
     * @param userName 当前用户名称
     */
    void register(String token, String appCode, String sessionId, Long userId, String userName);

    /**
     * <p>
     * 销毁在线用户或访问应用：根据应用Code，SessionId销毁相应的记录。
     * 注：一次只注销一个应用，即一次登录、多次登出。用户有可能不想退出一次性退出全部应用。
     * SessionDestroyedListener，此监听器会在session超时时自动销毁在线用户信息。
     * </p>
     *
     * @param appCode
     * @param sessionId
     */
    String logout(String appCode, String sessionId);

    /**
     * <p>
     * 根据Token获取当前用户登录的所有系统的相关信息
     * </p>
     * @param token
     */
    Set<OnlineUser> getOnlineUsersByToken(String token);
    
    /**
     * 获取所有在线用户名称
     * @return
     */
    Collection<String> getOnlineUserNames();
}
