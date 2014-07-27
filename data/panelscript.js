// simple-storageの中身ぶちまける
self.port.on("bookmark", function(bkm){
	var list = document.getElementById('list');
	// listの中身をカラにしてから処理実行
	list.innerHTML = "";
	for (var i=0; i < bkm.length; i++){
		var element = document.createElement('li');
		element.id = i;
		element.innerHTML = bkm[i].name;
		element.dataset.link = bkm[i].url;
		var del = document.createElement('button');
		del.innerHTML = 'delete';
		del.className = 'delete';
		element.appendChild(del);
		list.appendChild(element);
	};
	clickli();
	clickdel();
});

// 現在のページを追加
document.getElementById("addbkm").addEventListener("click", function(event){
	self.port.emit("newbkm");
});
window.document.addEventListener("keydown", function(event) {
	var keynum = event.keyCode - 48;
	if (keynum === 0){
	self.port.emit("newbkm");
	}
}, false);

// liタグをクリックしたらdata-linkのurlを新しいタブで開く
var tags = document.getElementsByTagName("li");
function clickli(){
	for (var i=0; i < tags.length; i++){
		tags[i].addEventListener("click", function(event){
				self.port.emit("url", event.target.dataset.link);
				self.port.emit("hide");
			},
		false);
	}
}
clickli();

// deleteボタンが押されたら、ブックマークを削除
var classDel = document.getElementsByClassName('delete');
function clickdel(){
	for (var i=0; i < classDel.length; i++){
		classDel[i].addEventListener("click", function(event){
			var linum = event.target.parentNode.id;
			if(window.confirm(Number(linum) + 1 + '番目のものを削除します')){
				self.port.emit("del", event.target.parentNode.id);
			}	
		},
		false);
	}
}
clickdel();

// パネルが表示された時にmain.jsから"show"と送られてくる
// 送られてきたらpanelウインドウにフォーカス(フォーカスされてないとkeydownが使えない)
self.port.on("show", function onShow(){
	window.focus();
});

// keyが押されたらなんか実行
window.document.addEventListener("keydown", function(event) {
	var keynum = event.keyCode - 48;
	if (keynum <= tags.length){
		self.port.emit("url", tags[keynum - 1].dataset.link);
		// panelを閉じさせる
		self.port.emit("hide");
	}
}, false);


/* document.onkeydown = keycode;
function keycode(event){
	self.port.emit('keycode', event.keyCode);
};	*/
