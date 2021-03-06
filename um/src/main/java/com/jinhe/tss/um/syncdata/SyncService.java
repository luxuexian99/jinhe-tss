package com.jinhe.tss.um.syncdata;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.dom4j.Document;
import org.dom4j.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jinhe.tss.framework.component.progress.Progress;
import com.jinhe.tss.framework.component.progress.Progressable;
import com.jinhe.tss.framework.exception.BusinessException;
import com.jinhe.tss.framework.persistence.ICommonDao;
import com.jinhe.tss.um.UMConstants;
import com.jinhe.tss.um.dao.IApplicationDao;
import com.jinhe.tss.um.dao.IGroupDao;
import com.jinhe.tss.um.entity.Application;
import com.jinhe.tss.um.entity.Group;
import com.jinhe.tss.um.entity.GroupUser;
import com.jinhe.tss.um.entity.User;
import com.jinhe.tss.um.helper.dto.GroupDTO;
import com.jinhe.tss.um.helper.dto.UserDTO;
import com.jinhe.tss.um.permission.ResourcePermission;
import com.jinhe.tss.util.EasyUtils;
import com.jinhe.tss.util.XMLDocUtil;
 
@Service("SyncData")
public class SyncService implements ISyncService, Progressable {
	
    @Autowired private ICommonDao commonDao;
    @Autowired private IGroupDao  groupDao;
    @Autowired private IApplicationDao  applicationDao;
    @Autowired private ResourcePermission resourcePermission;

    private Map<String, String> initParam(String paramDescXML){
        Map<String, String> param = new HashMap<String, String>();
        if ( EasyUtils.isNullOrEmpty(paramDescXML) ) 
            return param;
        
        Document doc = XMLDocUtil.dataXml2Doc(paramDescXML);
        for (Iterator<?> it = doc.getRootElement().elementIterator(); it.hasNext();) {
            Element element = (Element) it.next();
            param.put(element.getName(), element.getTextTrim());
        }
        return param;
    }
    
    public Map<String, Object> getCompleteSyncGroupData(Long mainGgroupId, String applicationId, String dbGroupId) {
        Application application = applicationDao.getApplication(applicationId);
        if(application == null) {
            throw new BusinessException("未找到其它应用系统（" + applicationId + ")配置信息");
        }
        
        // 保存UM用户组对其它应用用户组 的 ID对应的关系 key:dbGroupId -- value:mainGgroupId
        Map<String, Long> idMapping = new HashMap<String, Long>();
        
        // 取已经同步的用户组. 设置父子节点关系时用到（其实只需”同步节点“的父节点 ＋ 子枝）
        List<?> allGroups = commonDao.getEntitiesByNativeSql("select t.* from um_group t where t.dbGroupId is not null ", Group.class); 
        for(Iterator<?> it = allGroups.iterator();it.hasNext();){
            Group group = (Group)it.next();
            idMapping.put(group.getDbGroupId(), group.getId());
        }

        Map<String, String> appParams = initParam(application.getParamDesc());
        Integer dataSourceType = application.getDataSourceType();
        List<?> groups = getGroups(dataSourceType, appParams, dbGroupId); //从其它系统获取需要同步的所有用户组
        List<?> users  = getUsers (dataSourceType, appParams, dbGroupId); //从其它系统获取需要同步的所有用户
        
        Map<String, Object> paramsMap = new HashMap<String, Object>();
        paramsMap.put("groupId", mainGgroupId);
        paramsMap.put("groups", groups);
        paramsMap.put("users", users);
        paramsMap.put("idMapping", idMapping);

        return paramsMap;
    }
    
    private List<?> getGroups(Integer dataSourceType, Map<String, String> appParams, String groupId){
        String sql = appParams.get(SyncDataHelper.QUERY_GROUP_SQL_NAME);
        return SyncDataHelper.getOutDataDao(dataSourceType).getOtherGroups(appParams, sql, groupId);
    }

    private List<?> getUsers(Integer dataSourceType, Map<String, String> appParams, String groupId){
        String sql = appParams.get(SyncDataHelper.QUERY_USER_SQL_NAME);
        return SyncDataHelper.getOutDataDao(dataSourceType).getOtherUsers( appParams, sql, groupId );
    }
    
    @SuppressWarnings("unchecked")
	public void execute(Map<String, Object> paramsMap, Progress progress) {
        Long groupId = (Long)paramsMap.get("groupId");
        List<?> groups = (List<?>)paramsMap.get("groups");
        List<?> users  = (List<?>)paramsMap.get("users");
        Map<String, Long> idMapping = (Map<String, Long>)paramsMap.get("idMapping");
        
        deleteDataInSyncGroup(groupId); // 删除um系统中同步组下的用户组、用户、以及GroupUser
        syncGroups(groups, idMapping, progress);
        syncUsers (users, idMapping, progress);
    }

    private void syncGroups(List<?> otherGroups, Map<String, Long> idMapping, Progress progress) {
        for (int i = 0; i < otherGroups.size(); i++) {
            GroupDTO groupDto = (GroupDTO) otherGroups.get(i);
            Group group = new Group();
            SyncDataHelper.setGroupByDTO(group, groupDto);
            group.setDbGroupId(groupDto.getId());
            
            Long parentId = idMapping.get(groupDto.getParentId()); // 获取其它应用组的父组对应UMS中组的ID
            parentId = (parentId == null) ? UMConstants.MAIN_GROUP_ID : parentId;
            group.setParentId(parentId);
            group.setSeqNo(groupDao.getNextSeqNo(parentId));
            group.setGroupType(Group.MAIN_GROUP_TYPE);
            
            commonDao.create(group);
            idMapping.put(groupDto.getId(), group.getId()); // 保存对应结果
            
            // 补齐权限
            resourcePermission.addResource(group.getId(), group.getResourceType());
            
            updateProgressInfo(progress, otherGroups.size(), i);
        }
    }
    
    private void syncUsers(List<?> otherUsers, Map<String, Long> idMapping, Progress progress) {
        List<String> loginNames = new ArrayList<String>();
        for (int i = 0; i < otherUsers.size(); i++) {
            UserDTO userDto = (UserDTO) otherUsers.get(i);
            
            // 如果用户登陆名相同，只保存第一个
            if(loginNames.contains(userDto.getLoginName())) continue;
            
            // 如果用户所属的组不存在，则不导入该用户
            Long mainGroupId = idMapping.get(userDto.getGroupId());
            if(mainGroupId == null) continue;

            User user = new User();
            SyncDataHelper.setUserByDTO(user, userDto);
            user.setGroupId(mainGroupId);
            commonDao.create(user);
            commonDao.create(new GroupUser(user.getId(), mainGroupId));
            
            loginNames.add(user.getLoginName());
                
            updateProgressInfo(progress, otherUsers.size(), i);
        }
    }
    
    /** 更新进度信息 */
    private void updateProgressInfo(Progress progress, long total, int index){
        commonDao.flush();
        
        index = index + 1; // index 从0开始计数
        if(index % 20 == 0) {
            progress.add(20); // 每同步20个更新一次进度信息
        } 
        else if(index == total) {
            progress.add(index % 20); // 如果已经同步完，则将总数除以20取余数做为本次完成个数来更新进度信息
        }
    }

    static String queryChildrenByGroupIdSQL = "select g.id from um_group g, (select t.decode from um_group t where t.id = ?) m "
        + " where g.decode like m.decode||'%'";
    
    /**
     * 删除同步组下所有数据
     */
    private void deleteDataInSyncGroup(Long groupId) {
 
        String sql = "select t.* from um_group t, (select g.decode from um_group g where g.id = ?) m "
            + " where t.decode like m.decode||'%' ";
        commonDao.deleteAll(commonDao.getEntitiesByNativeSql(sql, Group.class, groupId));
        
        sql = "select u.* from um_user u, (" + queryChildrenByGroupIdSQL + " ) x, um_groupuser gu"
            + " where x.id = gu.groupid and u.id = gu.userid ";
        commonDao.deleteAll(commonDao.getEntitiesByNativeSql(sql, User.class, groupId));
        
        sql = "select gu.* from um_groupuser gu, (" + queryChildrenByGroupIdSQL + " ) x, um_user u "
            + " where gu.groupid = x.id and u.id = gu.userId ";
        commonDao.deleteAll(commonDao.getEntitiesByNativeSql(sql, GroupUser.class, groupId));
    }
}
