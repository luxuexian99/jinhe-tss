package com.jinhe.tss.framework.sso.identity;

import com.jinhe.tss.framework.sso.appserver.AppServer;
import com.jinhe.tss.framework.sso.appserver.IAppServerStorer;
import com.jinhe.tss.framework.sso.context.ApplicationContext;

/**
 * 应用系统上下文对象模拟器
 */
public class MockApplicationContext extends ApplicationContext {
    private String currentAppCode;
 
    public MockApplicationContext(IAppServerStorer storer, String currentAppCode) {
        super();
        this.storer = storer;
        this.currentAppCode = currentAppCode;
    }
 
    public String getCurrentAppCode() {
        return this.currentAppCode;
    }
 
    public void setAppCode(String appCode) {
        this.currentAppCode = appCode;
    }

    public static MockApplicationContext getDefaultApplicationContext() {
        MockAppServerStorer storer = new MockAppServerStorer();
        
        AppServer server1 = new AppServer();
        server1.setCode("TSS");
        server1.setName("TSS");
        server1.setUserDepositoryCode("tss");
        storer.putAppServer(server1.getCode(), server1);
        
        AppServer server2 = new AppServer();
        server2.setCode("CMS");
        server2.setName("CMS");
        server2.setUserDepositoryCode("tss");
        storer.putAppServer(server2.getCode(), server2);
        
        AppServer server3 = new AppServer();
        server3.setCode("Domino");
        server3.setName("Domino");
        server3.setUserDepositoryCode("domino");
        storer.putAppServer(server3.getCode(), server3);
        
        return new MockApplicationContext(storer, server1.getCode());
    }
}
