/* ==================================================================   
 * Created [2009-4-27 下午11:32:55] by Jon.King 
 * ==================================================================  
 * TSS 
 * ================================================================== 
 * mailTo:jinpujun@hotmail.com
 * Copyright (c) Jon.King, 2009-2012 
 * ================================================================== 
*/

package com.jinhe.tss.util;

import static org.junit.Assert.assertEquals;

import org.junit.Test;

public class XmlUtilTest {
 
	@Test
    public void testToXmlForm() {
		new XmlUtil();
		assertEquals("", XmlUtil.toFormXml(null));
        assertEquals("&lt;qqq&amp;www\\&gt;", XmlUtil.toFormXml("<qqq&www\\>"));
    }
    
	@Test
    public void testReplaceXMLPropertyValue() {
        assertEquals("&lt;qqq&amp;www code=&quot;TSS&quot; \\&gt;", XmlUtil.replaceXMLPropertyValue("<qqq&www code=\"TSS\" \\>"));
    }
    
	@Test
    public void testStripNonValidXMLCharacters() {
		assertEquals("", XmlUtil.stripNonValidXMLCharacters(null));
		
        String value = XmlUtil.stripNonValidXMLCharacters("<server code=\"TSS\" userDepositoryCode=\"tss\" />");
        assertEquals("<server code=\"TSS\" userDepositoryCode=\"tss\" />", value);
    }
}

