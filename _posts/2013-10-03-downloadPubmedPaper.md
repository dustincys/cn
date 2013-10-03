---
layout: post
category : tool
title: 批量下载Pubmed文献
tags : [python, Pubmed, XML, 下载, bioinformatics]
---
小代码写了就扔，下次再用再花个1个小时从头写真是头疼。
多少次百度`pyhon+正则式`都记不清了————，
引用牛博士的话说：“各有慧根”。
唉…书呆很呆。
批量从Pubmed网站下载文献摘要、Mesh Terms有木有？


{% highlight python %}
#coding:	utf-8
"""
Function: Download literature base on PubMed ID
Author:  Chu Yanshuo
Version: Python 2.75
Contact: chu at yanshuo.name
"""
import sys
import xml.dom.minidom
from urllib import urlopen
import re

def getWebPage(url):
	wp = urlopen(url)
	return wp.read()
	pass

def urlGenerator(id):
	return "http://www.ncbi.nlm.nih.gov/pubmed/{}?report=xml&format=text".format(id)
	pass

def htmlunquote(s):
	import HTMLParser
	html_parser = HTMLParser.HTMLParser()
	r = html_parser.unescape(s)
	return r

def getXMLBody(webpage):
	page=str(webpage)
	start=page.find("<pre>")
	end=page.find("</pre>")
	page=page[start+5:end]
	page=htmlunquote(page)
	return page

def ncbifetch(id):
	return getXMLBody(getWebPage(urlGenerator(id)))

def generateXMLFile(idFilePath,xmlFilePath):
	idFile=open(idFilePath)
	idPattern=re.compile(r"[0-9]+")
	for line in idFile:
		print line
		line=line.strip()
		if line == "":
			continue
		idList=idPattern.findall(line)
		for idItem in idList:
			saveXmlFile = xmlFilePath + idItem + ".xml"
			xmlFile=open(saveXmlFile,'w')
			xmlFile.write('<?xml version="1.0" encoding="utf-8"?>\n<root>')
			xmlFile.write(ncbifetch(idItem))
			xmlFile.write("</root>")
			xmlFile.close()
		pass
	pass

def main():
	#generateXMLFile(idFilePath,xmlFilePath)

if __name__ == '__main__':
        reload(sys)
        sys.setdefaultencoding('utf-8')
        main()
{% endhighlight %}

