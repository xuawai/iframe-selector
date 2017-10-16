window.onload = function(){
	//阻止默认事件
	$(this).click(function (event) {event.preventDefault(); });
	//对所有的元素添加点击事件，获取xpath
	$("#iframe").contents().find("*").click(function(event){
		event.stopPropagation();
		console.log($shadow.domXpath(this));
	});
}



var $shadow = new Object();  
/** 
	获取元素的xpath 
	特性： 
	- 转换xpath为csspath进行jQuery元素获取 
	- 仅生成自然表述路径（不支持非、或） 
	@param dom {String/Dom} 目标元素 
	@returns {String} dom的xpath路径 
*/  
$shadow.domXpath = function(dom) {  
	dom = $(dom).get(0);  
	var path = "";  
	for (; dom && dom.nodeType == 1; dom = dom.parentNode) {  
		var index = 1;  
		for (var sib = dom.previousSibling; sib; sib = sib.previousSibling) {  
			if (sib.nodeType == 1 && sib.tagName == dom.tagName)  
				index++;  
		}  
		var xname =  dom.tagName.toLowerCase();  
		if (dom.id) {  
			xname += "[@id=\"" + dom.id + "\"]";  
		} else {  
			if (index > 0)  
				xname += "[" + index + "]";  
		}  
		path = "/" + xname + path;  
	}  

	path = path.replace("html[1]/body[1]/","html/body/");  

	return path;  
}; 

/** 
    根据xpath获取元素 
    特性： 
    - 转换xpath为csspath进行jQuery元素获取 
    - 仅支持自然表述（不支持非、或元素选取） 
    @param xpath {String} 目标元素xpath 
    @returns {jQuery Object} 元素/元素集合 
    */  
$shadow.xpathDom = function(xpath){  
	// 开始转换 xpath 为 css path  
	// 转换 // 为 " "  
	xpath = xpath.replace(/\/\//g, " ");  
	// 转换 / 为 >  
	xpath = xpath.replace(/\//g, ">");  
	// 转换 [elem] 为 :eq(elem) ： 规则 -1  
	xpath = xpath.replace(/\[([^@].*?)\]/ig, function(matchStr,xPathIndex){  
		var cssPathIndex = parseInt(xPathIndex)-1;  
		return ":eq(" + cssPathIndex + ")";  
	});  
	// 1.2 版本后需要删除@  
	xpath = xpath.replace(/\@/g, "");  
	// 去掉第一个 >  
	xpath = xpath.substr(1);  
	alert(xpath);  
	    // 返回jQuery元素  
	    return $(xpath);  
};