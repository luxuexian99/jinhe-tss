package com.jinhe.tss.framework.component.cache;

import java.lang.reflect.Method;

import org.aopalliance.intercept.MethodInterceptor;
import org.aopalliance.intercept.MethodInvocation;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Component;

import com.jinhe.tss.cache.Cacheable;
import com.jinhe.tss.cache.JCache;
import com.jinhe.tss.cache.Pool;
 
@Component("cacheInterceptor")
public class CacheInterceptor implements MethodInterceptor {

    protected Logger log = Logger.getLogger(this.getClass());

    public Object invoke(MethodInvocation invocation) throws Throwable {
    	Object serviceObj = invocation.getThis();     /* 获取目标对象*/
        Method targetMethod = invocation.getMethod(); /* 获取目标方法 */
        Object[] args = invocation.getArguments();    /* 获取目标方法的参数 */
        
    	Cached annotation = targetMethod.getAnnotation(Cached.class); // 取得注释对象
        if (annotation == null) {
        	return invocation.proceed(); /* 如果没有配置缓存，则直接执行方法并返回结果 */
        }
 
		CacheLife life = annotation.cyclelife();
		Pool dataCache = JCache.getInstance().getPool(life.toString());
		
		String key = serviceObj.getClass().getName() + "." + targetMethod.getName();
        key += "(";
        if(args != null && args.length > 0) {
        	int index = 0;
        	for(Object arg : args) {
        		if( index++ > 0) {
        			key += ", ";
        		}
        		key += arg;
        	}
        }
        key += ")";
		Cacheable cacheItem = dataCache.getObject(key);
		
		Object returnVal;
		if (cacheItem != null) {
			returnVal = cacheItem.getValue();
		} else {
			/* 执行方法，如果非空则Cache结果  */
			returnVal = invocation.proceed();
			if(returnVal != null) {
				dataCache.putObject(key, returnVal); 
			}
		}
 
        return returnVal;
    }
}