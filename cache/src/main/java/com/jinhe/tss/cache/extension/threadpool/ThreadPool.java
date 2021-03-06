/* ==================================================================   
 * Created [2007-1-9] by Jon.King 
 * ==================================================================  
 * TSS 
 * ================================================================== 
 * mailTo:jinpujun@hotmail.com
 * Copyright (c) Jon.King, 2012-2015 
 * ================================================================== 
*/
package com.jinhe.tss.cache.extension.threadpool;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

import com.jinhe.tss.cache.Cacheable;
import com.jinhe.tss.cache.Pool;
import com.jinhe.tss.cache.TimeWrapper;
import com.jinhe.tss.cache.extension.ReusablePool;
import com.jinhe.tss.cache.extension.workqueue.Task;

/** 
 * 采用缓存池机制实现的线程池。<br/>
 * 通过继承并扩展ReusablePool来实现。<br/>
 * 
 * 每次运行excute()方法，都会唤醒free池中的工作线程。<br/>
 * 对池中的所有线程来说，它们都共享池的工作队列。<br/>
 * 所以工作队列要求能实现同步，通过Collections.synchronizedList(list)实现。<br/>
 * 如果队列不为空的话，那么线程将反复的执行，来完成工作队列中的每个工作，直到工作队列为空。<br/>
 * 
 */
public class ThreadPool extends ReusablePool implements IThreadPool{  
    
    private Pool taskpool;

    private final List<Cacheable> workQueue ;

    public ThreadPool() {
        workQueue = Collections.synchronizedList(new LinkedList<Cacheable>());
    }
    
    public void excute(Task task) {
        excute(null, new TimeWrapper(task, task));
    }

    public void excute(Pool taskpool, Cacheable task) {
        this.taskpool = taskpool;
        
        // 如果池中工作线程都已被销毁，则重新开始初始化（注：单单size()=0，有可能正在初始化）。
        if(size() == 0 && released) {
            super.flush();
            super.init();
        }
        
        synchronized (workQueue) {
            log.debug("工作队列新增任务【" + task.getValue() + "】");
            workQueue.add(task);
            workQueue.notifyAll();  // workQueue在ThreadPoolWorker.run方法里wait()
        }
    }
    
    public Thread createWorkThread() {
    	String threadName = TimeWrapper.createRandomKey("WorkThread");
        return new ThreadPoolWorker(threadName);
    }
    
    class ThreadPoolWorker extends Thread {
        
        public ThreadPoolWorker(String name){
            super(name);
        }
        
        public void run() {
            Cacheable taskWrapper;
            while (true) {
                synchronized (workQueue) {
                	/* 当工作队列为空时，当前工作线程（即this）进入等待状态
                	 * 线程进入workQueue对象的等待队列，需要由workQueue对象唤醒，see Object.wait() */
                    while (workQueue.isEmpty()) {
                        try {
                            workQueue.wait(); 
                        } catch (InterruptedException ignored) {
                        }
                    }
                    
                    // 工作队列不为空时，将任务从队列中移出来。
                    taskWrapper = workQueue.remove(0); 
                }
                
                // 执行任务队列中的任务，由ThreadPool中的一个Worker来执行
                try {
                    if (taskWrapper != null) {
                        Task task = (Task) taskWrapper.getValue();
                        log.debug( this + "开始执行任务: 【" + task + "】");
                        task.excute(); // 执行任务
                        
                        if(taskpool != null) {
                            taskpool.checkIn(taskWrapper);
                        }
                        
                        // 设置线程池、缓存项的命中率
                        ThreadPool.this.addRequests(); // 如此可以引用到外围类的实例
                        ThreadPool.this.addHits();
                        ThreadPool.this.getObjectOnly(getName()).addHit();
                    }
                } catch (RuntimeException e) {
                    log.error("ThreadPoolWorker执行任务时候出错", e);
                } 
            }
        }
        
        public String toString(){
            return getName();
        }
    }
}

