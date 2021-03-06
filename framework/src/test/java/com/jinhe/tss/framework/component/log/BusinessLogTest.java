package com.jinhe.tss.framework.component.log;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.util.List;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.jinhe.tss.framework.TxTestSupport;
import com.jinhe.tss.framework.mock.model._Group;
import com.jinhe.tss.framework.mock.model._User;
import com.jinhe.tss.framework.mock.service._IUMSerivce;

import freemarker.template.TemplateException;

/**
 * 测试了日志解析、日志Annotation、线程池、异步输出日志
 * 
 */
public class BusinessLogTest extends TxTestSupport {
    
    @Autowired private _IUMSerivce umSerivce;
    @Autowired private LogService logService;
    
    @Test
    public void testParseMacro() throws IOException, TemplateException {
        String template = "<#if args[1]=1>停用<#else>启用</#if>了节点${args[0]}";
        Object[] objects = new Object[]{new Long(12), new Integer(0)};
        BusinessLogInterceptor intercepter = new BusinessLogInterceptor();
        assertEquals("启用了节点12", intercepter.parseMacro(template, objects, null));
    }
    
    /**
     * 测试日志Annotation、线程池、异步输出日志
     */
    @Test
    public void testUMToCreateLog() throws InterruptedException {
        log.info("test start......");
        
        for(int i = 0; i < 10; i++) {
            for(int j = 0; j < 10; j++) {
                _Group group = new _Group();
                group.setCode("RD" + i + "_" + j);
                group.setName("研发");
                umSerivce.createGroup(group);
                
                _User user = new _User();
                user.setGroup(group);
                user.setUserName("JohnXa" + i + "_" + j);
                user.setPassword("123456");
                user.setAge(new Integer(25));
                user.setAddr("New York");
                user.setEmail("john@hotmail.com");
                umSerivce.createUser(user);
            }
        }
        
        Thread.sleep(3*1000);
        
        List<_User> result = umSerivce.queryAllUsers();
        assertTrue(result.size() > 50);
        
        LogQueryCondition condition = new LogQueryCondition();
        Object[] logsInfo = logService.getLogsByCondition(condition);
        assertEquals(50, ((List<?>)logsInfo[0]).size());
        assertTrue( (Integer)logsInfo[1] >= 180 ); // 还有10条没输出Test就over了
    }

}
