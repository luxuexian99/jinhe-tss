package com.jinhe.tss.framework.component.param;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;

import com.jinhe.tss.framework.Global;
import com.jinhe.tss.framework.exception.BusinessException;
import com.jinhe.tss.framework.persistence.connpool._Connection;

/**
 *  调用参数管理功能入口
 */
public class ParamManager {

    private static ParamService getService() {
        return (ParamService) Global.getContext().getBean("ParamService");
    }
    
    /**
     * 获取简单类型参数
     * @param code
     * @return
     */
    public static Param getSimpleParam(String code){
    	try{
            return getService().getParam(code);
    	} catch (ClassCastException e) {
			throw new BusinessException("获取参数信息失败，指定的code：" + code + " 不是简单型参数!");
		}
    }
    
    /**
     * 获取下拉类型参数列表
     * @param code
     * @return
     */
	public static List<Param> getComboParam(String code){
    	try{
            return getService().getComboParam(code);
    	}catch (ClassCastException e) {
    		throw new BusinessException("获取参数信息失败，指定的code：" + code + " 不是下拉型参数!");
		}
    }
    
    /**
     * 获取树型类型参数列表
     * @param code
     * @return
     */
	public static List<Param> getTreeParam(String code){
    	try{
            return getService().getTreeParam(code);
            
    	} catch (ClassCastException e) {
    		throw new BusinessException("获取参数信息失败，指定的code：" + code + " 不是树型参数!");
		}
    }
    
    /**
     * 根据参数Code读取参数值
     * @param code
     * @return
     */
    public static String getValue(String code){
		Param param = (Param)getService().getParam(code);
        if(param == null) { 
            throw new BusinessException("code:" + code + " 的参数没有被创建");
        }
        
    	return param.getValue().replace("\n", ""); // 去掉回车
    }
    
    public static String getValueNoSpring(String code){
        String value = null;
        String sql = "select p.value from component_param p where p.type = " + ParamConstants.NORMAL_PARAM_TYPE
                   + " and p.code='" + code + "' and p.hidden <> 1 and p.disabled <> 1";
        
        Connection conn = _Connection.getInstanse().getConnection();
        try {
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql);
            while (rs.next()) {
                value = rs.getString("value");
                break;
            } 
            if(value == null){
                throw new BusinessException("code:" + code + " 的参数没有被创建");
            }
        } catch(Exception e){
            throw new BusinessException("读取code:" + code + " 的参数出错", e);
        } finally {
            _Connection.getInstanse().releaseConnection(conn);
        }
        return value;
    }
}

	