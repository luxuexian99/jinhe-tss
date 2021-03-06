/* ==================================================================   
 * Created [2006-12-31] by Jon.King 
 * ==================================================================  
 * TSS 
 * ================================================================== 
 * mailTo:jinpujun@hotmail.com
 * Copyright (c) Jon.King, 2012-2015 
 * ================================================================== 
 */

package com.jinhe.tss.cache;

import java.util.Set;


/**
 * 缓存池接口，提供了基本的缓存功能，包括存、取、删除、清空、重新载入等  <br/> <br/>
 * 
 * 缓存策略【停用启用功能】的控制用动态代理实现，涉及的操作有:  <br/>
 * getObject，putObject，check-out,check-in  <br/> <br/>
 * 
 * 注:如果缓存池采用ehcache来存储对象, 则key, value值必须继承Serializable接口
 * 
 */
public interface Pool {

	/**
	 * 获取池名称
	 */
	String getName();

	/**
	 * 列举缓存池的所有缓存项
	 * 
	 * @return
	 */
	Set<Cacheable> listItems();

	/**
	 * 列举缓存池的所有缓存项Key值
	 * 
	 * @return
	 */
	Set<Object> listKeys();

	/**
	 * 返回池中对象的个数(对IObjectPool而言包括空闲状态的和check-out的)
	 */
	int size();
	
	/***********************************缓存池的存取（check适合没有key的缓存项）************************************/
	
	/**
	 * 根据key值从缓存池中获取一个对象。<br>
	 * 如果获取不到，会自动调用loader.loadCacheObject(new TimeWrapper(key, null))来加载。<br>
	 * 所以如果实现了ICacheLoader的loadCacheObject方法，应用缓存的地方不需要再手动执行putObject。<br>
	 * 
	 * 同时还要维护池的请求数、点击率的信息。<br>
	 * 
	 * @param key
	 * @return
	 */
	Cacheable getObject(Object key);

	/**
	 * 将对象放入到缓存池中
	 * 
	 * @param key
	 * @param value
	 * @return
	 */
	Cacheable putObject(Object key, Object value);
	
	/**
	 * 从缓存池中移除一个对象。
	 * 
	 * @param key
	 * @return
	 */
	Cacheable removeObject(Object key);
	
	/**
	 * 将元素从free池中取出，放入using池中，并返回该元素。  <br/>
	 * 
	 * 如果没有空置的元素可以获取，则一个新的元素将会创建出来，除非到了池的上限值。 <br/>
	 * 如果一个空置的元素是错误的，它将被移出对象池，将会重新获取另外一个元素出来。 <br/>
	 * 
	 * 如果池中没有空置的元素且已经到达池的最大容量，本方法将在指定的时间内等待， <br/>
	 * 期间如果有对象被check-in则返回该对象。
	 * 
	 * @param timeout
	 * @return 池中的元素，如果没有可用对象返回null
	 * @exception PoolException 创建对象时出错则抛异常
	 */
	Cacheable checkOut(long timeout);

	/**
	 * 将对象重新返回到空闲(free)队列中。  <br/>
	 * 将元素从using池中去除，放入free池中。 <br/>
	 * 如果对象不在using池中，则返回失败。
	 * @param o
	 */
	void checkIn(Cacheable o);

	/**
	 * 根据缓存池中缓存策略设定的访问规则来从free池中移除一个缓存项。 <br/>
	 * 本操作在check-out或者"缓存池溢出"的时候被调用。 <br/>
	 * 如果移除一个后缓存池还是溢出状态，则本方法将会被反复调用，直到缓存池的容量不溢出为止。 <br/>
	 * 
	 * @return 池中的元素，如果没有可用对象返回null
	 */
	Cacheable remove();

	/**
	 * 清除池中过期的对象。  <br/>
	 * 本方法将被cleaner线程调用来清理过期的对象。 <br/>
	 * 
	 * 注意，当类似对门户树进行缓存的时候需要对匿名门户树始终进行缓存， <br/>
	 * 应用需要特殊实现purge()方法来实现缓存池的清理工作，从而替代默认的清除方式。 <br/>
	 * 
	 * @return 
	 * 		如果清除后池为空或者没有清除掉任何缓存项，则返回false，否则true
	 */
	boolean purge();

	/*******************************缓存池（项）的加载、释放以及缓存项销毁等************************************/

	/**
	 * 刷新缓存项目, 将对象重新载入缓存池中.  <br/>
	 * 
	 * 该方法由各个具体应用到缓存池的应用自己继承ICacheLoader接口实现 <br/>
	 * 
	 * @param obj
	 * @return
	 * @throws PoolException
	 */
	Cacheable reload(Cacheable obj) throws RuntimeException;
	
	/**
	 * 销毁缓存项。 <br/>
	 * 本方法会在release缓存池的时候被调用。 <br/>
	 * 
	 * @param o
	 */
	void destroyObject(final Cacheable o);

	/**
	 * 释放所有池中的连接，并且关闭池。
	 * 
	 * @param 是否强制释放（ <br/> 
	 * 			  true: 强制销毁这些连接然后返回, <br/>
	 *            fasle:等所有连接都返回再释放）
	 */
	void release(final boolean forced);

	/**
	 * 异步释放所有池中的连接，并且关闭池。  <br/>
	 * 本方法立即返回，一个后台的线程将被创建出来来释放池中连接。 <br/>
	 * 当销毁对象很耗费时间的情况下，这种方式将会非常有用。 <br/>
	 * 
	 * @param 是否强制释放（  <br/>
	 * 			  true: 强制销毁这些连接然后返回,  <br/>
	 *            fasle:等所有连接都返回再释放）
	 */
	void releaseAsync(final boolean forced);
	
	/**
	 * 刷新缓存，清除池中所有缓存项
	 */
	void flush();

	/************************************缓存池策略配置及监听**********************************/

	/**
	 * 读取池的自定义类
	 * 
	 * @param customizer
	 */
	CacheCustomizer getCustomizer();
	void setCustomizer(CacheCustomizer obj);

	/**
	 * 读取缓存策略信息
	 * 
	 * @param strategy
	 */
	CacheStrategy getCacheStrategy();
	void setCacheStrategy(CacheStrategy obj);
	
	/**
	 * 初始化池
	 */
	void init();
	
	/**
	 * 往事件通知列表里加入一个监听器
	 * 
	 * @param x
	 */
	void addObjectPoolListener(Listener x);

	/**
	 * 根据事件类型触发事件
	 * 
	 * @param eventType
	 */
	void firePoolEvent(int eventType);
	
	/***********************************池命中率统计************************************/

	/**
	 * 池命中率。(requests == 0) ? 0 : (((float)hits / requests) * 100f)  <br/>
	 * 
	 * 请求时获取的连接可能是池中已存在的连接，亦或者是新建出来的连接。 <br/>
	 * 
	 * 池命中率为这两者的比较，越大则说明池的机制越好，因为池的目的就是要尽可能的利用已创建的连接而不用去创建新的。
	 */
	float getHitRate();

	/**
	 * 池总请求数
	 */
	long getRequests();
}
