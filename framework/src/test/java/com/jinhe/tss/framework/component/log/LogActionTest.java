package com.jinhe.tss.framework.component.log;

import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.jinhe.tss.framework.TxTestSupport;
import com.jinhe.tss.framework.mock.model._Group;
import com.jinhe.tss.framework.mock.model._User;
import com.jinhe.tss.framework.mock.service._IUMSerivce;
import com.jinhe.tss.framework.sso.Environment;
import com.jinhe.tss.framework.web.dispaly.XmlPrintWriter;
import com.jinhe.tss.framework.web.dispaly.grid.GridDataDecoder;
import com.jinhe.tss.framework.web.dispaly.grid.GridDataEncoder;

public class LogActionTest extends TxTestSupport {

	@Autowired private LogAction action;
	@Autowired private LogService logService;

	@Autowired private _IUMSerivce umSerivce;
 
	@Test
	public void testLogAction() {
		for (int i = 0; i < 10; i++) {
			final int index = i;
			for (int j = 0; j < 10; j++) {
				_Group group = new _Group();
				group.setCode("RD" + index + "_" + j);
				group.setName("研发");
				umSerivce.createGroup(group);

				_User user = new _User();
				user.setGroup(group);
				user.setUserName("JohnXa" + index + "_" + j);
				user.setPassword("123456");
				user.setAge(new Integer(25));
				user.setAddr("New York");
				user.setEmail("john@hotmail.com");
				umSerivce.createUser(user);
			}
		}

		try {
			Thread.sleep(3 * 1000);
		} catch (InterruptedException e) {
		}
		
		action.getAllApps4Tree(response);
		
		LogQueryCondition condition = new LogQueryCondition();
		condition.setAppCode("TSS");
		condition.setOperateTimeFrom(new Date(System.currentTimeMillis() - 1000*10));
		condition.setOperateTimeTo(new Date());
		condition.setOperatorName(Environment.getOperatorName());
		
		Map<String, Object> conditionsMap = condition.getConditionsMap();
		conditionsMap.put("operateTimeFrom", new Date(System.currentTimeMillis() - 1000*10));
		conditionsMap.put("operateTimeTo", new Date());
		conditionsMap.put("operatorName", Arrays.asList(Environment.getOperatorName()));
		conditionsMap.put("operatorIP", null);
		
		action.queryLogs4Grid(null, condition, 1);
		
		Object[] logsInfo = logService.getLogsByCondition(condition);
        List<?> logs = (List<?>)logsInfo[0];
        Assert.assertTrue(logs.size() > 0);
        action.getLogInfo(response, ((Log)logs.get(0)).getId());
        
        // 顺带测试一下Grid的功能
        GridDataEncoder encoder = new GridDataEncoder(logs, LogAction.LOG_GRID_TEMPLET_PATH);
        try {
			encoder.print(new XmlPrintWriter(response.getWriter()));
		} catch (IOException e) {
			Assert.fail();
		}
        
        encoder.getTemplete().setColumnAttribute("id", "align", "center");
        
        logs = GridDataDecoder.decode(encoder.toXml(), Log.class);
        Assert.assertTrue(logs.size() > 0);
        Log log = (Log)logs.get(0);
		action.getLogInfo(response, log.getId());
	}

}
