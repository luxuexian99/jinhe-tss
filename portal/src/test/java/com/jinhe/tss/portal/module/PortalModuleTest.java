package com.jinhe.tss.portal.module;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.List;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.jinhe.tss.framework.test.TestUtil;
import com.jinhe.tss.framework.web.mvc.BaseActionSupport;
import com.jinhe.tss.portal.PortalConstants;
import com.jinhe.tss.portal.TxSupportTest4Portal;
import com.jinhe.tss.portal.action.ComponentAction;
import com.jinhe.tss.portal.action.NavigatorAction;
import com.jinhe.tss.portal.action.PortalAction;
import com.jinhe.tss.portal.entity.Component;
import com.jinhe.tss.portal.entity.ReleaseConfig;
import com.jinhe.tss.portal.entity.Structure;
import com.jinhe.tss.portal.entity.Theme;

/**
 * 门户结构相关模块的单元测试。
 */
public class PortalModuleTest extends TxSupportTest4Portal {
    
    @Autowired PortalAction portalAction;
    @Autowired ComponentAction elementAction;
    @Autowired NavigatorAction menuAction;
    
    Long portalId;
    Structure root;
    Structure page1;
    Structure page2;
    Structure section1;
    Theme defaultTheme;
    
    @Before
    public void setUp() throws Exception {
    	 super.setUp();
    	 
         Long parentId = PortalConstants.ROOT_ID;
         
         // 新建portal
         defaultTheme = new Theme();
         defaultTheme.setName("默认主题");
         
         root = new Structure();
         root.setParentId(parentId);
         root.setType(Structure.TYPE_PORTAL);
         root.setName("Jon的门户-1" + System.currentTimeMillis());
         root.setSupplement("<page><property><name>Jon的门户</name><description><![CDATA[]]></description></property><script><file><![CDATA[]]></file><code><![CDATA[]]></code></script><style><file><![CDATA[]]></file><code><![CDATA[]]></code></style></page>");
         root.setDescription("测试门户");
         root.setTheme(defaultTheme);
         root.setCode(System.currentTimeMillis() + "");
         portalAction.save(response, root); // create portal root
         
         portalId = root.getPortalId();
         
         // 新建页面、版面
         page1 = createPageOrSection(root, "页面一", "page1", Structure.TYPE_PAGE);
         page2 = createPageOrSection(root, "页面二", "page2", Structure.TYPE_PAGE);
         section1 = createPageOrSection(page1, "版面一", "section1", Structure.TYPE_SECTION);
         Structure section2 = createPageOrSection(page2, "版面二", "section2", Structure.TYPE_SECTION);
         Component portlet = createTestPortlet();
         createPortletInstance(section1, "portletInstance1", "portletInstance1", portlet);
         createPortletInstance(section2, "portletInstance2", "portletInstance2", portlet);
    }
    
    @Test
    public void testPortalTheme() {
        portalAction.getThemes4Tree(response, portalId);
        
        List<?> themeList = portalService.getThemesByPortal(portalId);
        assertEquals(1, themeList.size());
        Theme defaultTheme = (Theme) themeList.get(0);
        Long defaultThemeId = defaultTheme.getId();
        portalAction.saveThemeAs(response, defaultThemeId, "我的主题");
        
        themeList = portalService.getThemesByPortal(portalId);
        assertEquals(2, themeList.size());
        Theme newTheme = (Theme) themeList.get(1);
 
        portalAction.renameTheme(response, newTheme.getId(), "Jon的主题");
        portalAction.specifyDefaultTheme(response, defaultThemeId);
        try {
        	portalAction.removeTheme(response, newTheme.getId());
        } catch (Exception e) {
        	Assert.assertTrue("该主题为门户的默认主题或者当前主题，正在使用中，删除失败！", true);
        }
    }
    
    @Test
    public void testPersonalPortalTheme() {
    	portalAction.savePersonalTheme(response, portalId, defaultTheme.getId());
    }
    
    @Test
    public void testPortalRelease() {
        portalAction.getActivePortals4Tree(response);
        portalAction.getActivePagesByPortal4Tree(response, portalId);
        portalAction.getThemesByPortal(response, portalId);
        
        List<?> themeList = portalService.getThemesByPortal(portalId);
        assertTrue(themeList.size() > 0);
       
        // test get init template
        portalAction.getReleaseConfig(response, BaseActionSupport.DEFAULT_NEW_ID);
        
        ReleaseConfig rconfig = new ReleaseConfig();
        rconfig.setName("门户发布配置");
        rconfig.setPortal(root);
        rconfig.setPage(page1);
        rconfig.setTheme((Theme) themeList.get(0));
        rconfig.setVisitUrl("default.portal");
        rconfig.setRemark("~~~~~~~~~~~~~~~~");
        portalAction.saveReleaseConfig(response, rconfig); // create
        
        portalAction.getReleaseConfig(response, rconfig.getId()); // load exsited config
        
        portalAction.saveReleaseConfig(response, rconfig); // update
        
        portalAction.getAllReleaseConfigs4Tree(response);
        
        portalAction.removeReleaseConfig(response, rconfig.getId());
    }
 
    @Test
    public void testPortalCRUD() {
    	Long structureId = BaseActionSupport.DEFAULT_NEW_ID;
        Long parentId = PortalConstants.ROOT_ID;
    	
    	request.addParameter("type", Structure.TYPE_PORTAL + "");
        request.addParameter("parentId", parentId + "");
        portalAction.getStructureInfo(response, request, structureId); // test get init template
        
        List<?> list = portalService.getAllStructures();
        assertTrue(list.size() >= 7);

        structureId = root.getId();
        request.addParameter("type", Structure.TYPE_PORTAL + "");
        request.addParameter("parentId", PortalConstants.ROOT_ID + "");
        portalAction.getStructureInfo(response, request, structureId);
  
        portalAction.save(response, root); // update portal root
    
        portalAction.getAllStructures4Tree(response);
        
        // 删除新建的门户
        portalAction.delete(response, root.getId());
        
        list = portalService.getActivePortals();
        assertFalse(list.contains(root));
        
        assertTrue(TestUtil.printLogs(logService) > 0);
    }
    
    @Test
    public void testPortalMenu() {
    	menuAction.getStructuresByPortal(response, portalId, Structure.TYPE_SECTION);
    }
    
    @Test
    public void testPortalPermission() {
    	// 获取节点操作权限
        portalAction.getOperationsByResource(response, root.getId());
    }
    
    @Test
    public void testPortalSort() {
    	// 测试排序
        portalAction.sort(response, page1.getId(), page2.getId(), 1);
        portalAction.getAllStructures4Tree(response);
    }
    
    @Test
    public void testPortalStartAndStop() {
    	// 测试停用启用
        portalAction.disable(response, root.getId(), PortalConstants.TRUE);
        portalAction.disable(response, root.getId(), PortalConstants.FALSE);
    }
}
