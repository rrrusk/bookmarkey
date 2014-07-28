var { Hotkey } = require("sdk/hotkeys");
var tabs = require("sdk/tabs");
var panel = require("sdk/panel");
var self = require("sdk/self");
var ss = require("sdk/simple-storage");

if (!ss.storage.bookmark){
	ss.storage.bookmark = [];
}

var panelShow;
var mypanel = panel.Panel({
	height: 400,
	witdh: 400,
	onShow: function(){ panelShow = true},
	onHide: function(){ panelShow = false},
  contentURL: self.data.url("bookmark.html"),
	contentScriptFile: self.data.url("panelscript.js")
});

mypanel.port.emit("bookmark", ss.storage.bookmark);

mypanel.port.on("newbkm", function(nkm){
	if(ss.storage.bookmark.length < 9){ // <=だと9この時にも実行されるので上限数が10になる
	ss.storage.bookmark.push({"name": tabs.activeTab.title, "url": tabs.activeTab.url});
	mypanel.port.emit("bookmark", ss.storage.bookmark);
	}
});

mypanel.port.on("del", function(num){
	// deleteボタンに対応した配列を削除
	ss.storage.bookmark.splice(num, 1);
	mypanel.port.emit("bookmark", ss.storage.bookmark);
});

function panelToggle(){
	if(panelShow){
		mypanel.hide();
	}else{
		mypanel.show();
	}
};
// ショートカットキーでpanelを出したり消したりする。
var showHotKey = Hotkey({
  combo: "accel-shift-o",
  onPress: panelToggle //パネルがshowならhideにしてhideならshowにする
});

// panelがshowになったらpanelに"show"と送信
mypanel.on("show", function() {
  mypanel.port.emit("show");
});

// タブを開いたらpanelを閉じる
mypanel.port.on("hide", function(){
	mypanel.hide();
});

// 送られてきたurlを新しいタブで開く
mypanel.port.on("url", function(url) {
	tabs.open(url);
});
