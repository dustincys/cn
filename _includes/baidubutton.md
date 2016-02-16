<div class="shareto">
<span class="hidden-xs">分享给小伙伴们吧：</span>
<div class="bdsharebuttonbox" data-tag="share_1">
	<a class="bds_tsina" data-cmd="tsina" href="#"></a>
	<a class="bds_renren" data-cmd="renren" href="#"></a>
	<a class="bds_qzone" data-cmd="qzone" href="#"></a>
	<a class="bds_tqq" data-cmd="tqq" href="#"></a>
	<a class="bds_weixin" data-cmd="weixin" href="#"></a>
	<a class="bds_more" data-cmd="more" href="#"></a>
</div>
</div>
<div>
<span>小伙伴觉得好也可以<a class="fancybox" rel="donate" href="http://ww3.sinaimg.cn/large/61dccbaajw1f11ag3tq66j20he0nn75l.jpg" title="title">捐赠</a>我……</span>
</div>
<script>
	function getImgs() {
		var all = document.getElementsByTagName('img');
		var elements = new Array();
		for (var e = 0; e < all.length; e++) {
			elements[elements.length] = all[e];
		}
		return elements;
	}

	var sharePicture;
	var imgs = getImgs();

	if(imgs != null && imgs.length > 1){
		sharePicture = imgs[1].src;
	}

	sharePicture = sharePicture || 'https://2s66lw.bl3301.livefilestore.com/y2pIlAqf_XWwsDHjEaTPBHGkXmKLncn3uUoXwx-ViqlHkaF8BT-1wp1teBnSgDDnVcu7MsqiOeARHr_LfRos5IJfaCkMLBqp-L9NX7_9gpIDvU_cwqRQ0PCaOwVN1_rDQCeIijX4pW8dIhZxLcy_j_TQQ/h_large_LtVW_53710001b3612f76.jpg';

	var shareText = document.title;
	var shareUrl = window.location.href;
	var myList = document.getElementsByTagName("p");
	var shareDesc;

	for(var i = 0; i < myList.length; i++) {
		shareDesc += myList[i].innerHTML;
		if(shareDesc.length > 50)
			break;
	}
	if(shareDesc.length > 50){
		shareDesc = shareDesc.slice(9, 50);
	}
	shareDesc += "……";

	window._bd_share_config = {
		common : {
			bdText : shareText,
			bdUrl : shareUrl,
			bdPic : sharePicture,
			bdDesc : shareDesc
		},
		share : [{
			"tag" : "share_1",
			"bdSize" : 32
		}]
	}
	with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?cdnversion='+~(-new Date()/36e5)];
</script>
