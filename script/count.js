import { sql } from './api.js';
import { getBlockByID } from './api.js';

var flag = 0;
var auto_counter;

// 绑定事件
document.getElementById('manual_get_data').addEventListener('click', function () {
	document.getElementById('manual_get_data').innerHTML = '查询中';
	count();
	document.getElementById('manual_get_data').innerHTML = '手动查询统计数据';
});

document.getElementById('auto_get_data').addEventListener('click', function () {
	if (flag == 0) {
		flag = 1;
		auto_counter = setInterval(count, 1000);
		document.getElementById('auto_get_data').innerHTML = '关闭自动查询';
		// console.log(flag);
	} else if (flag == 1) {
		flag = 0;
		clearInterval(auto_counter);
		document.getElementById('auto_get_data').innerHTML = '开启自动查询(间隔5s)';
		// console.log(flag);
	}
});
document.getElementById('auto_get_data_realtime').addEventListener('click', function () {
	if (flag == 0) {
		flag = 1;
		if (window.parent.siyuan.ws.ws) {
			window.parent.siyuan.ws.ws.addEventListener('message', (msg) => {
				console.log(msg);
				let msgdata = msg.data;
				count(msgdata);
			});
		}
		document.getElementById('auto_get_data_realtime').innerHTML = '关闭自动查询';
		// console.log(flag);
	} else if (flag == 1) {
		flag = 0;
		if (window.parent.siyuan.ws.ws) {
			window.parent.siyuan.ws.ws.removeEventListener('message', count);
		}
		document.getElementById('auto_get_data_realtime').innerHTML = '开启自动查询(全自动)';
		// console.log(flag);
	}
});

count();

function count() {
	// 统计页面数量
	var page_data = count_pages().then((res) => {
		var resLength = res.length;
		document.getElementById('page_number').innerHTML = resLength;
	});
	// 统计块数量和总字数
	var block_data = count_blocks().then((res) => {
		var resLength = res.length;
		var count_character = 0;
		for (var i = 0; i < resLength; i++) {
			count_character += res[i].length;
			// console.log(res[i]);
			// console.log(res[i].length);
			// console.log(count_character);
		}
		document.getElementById('block_number').innerHTML = resLength;
		document.getElementById('character_number').innerHTML = count_character;
	});
	// 统计当前块数量和字数
	var present_block_data = count_present_blocks().then((res) => {
		// console.log(res);
		var resLength = res.length;
		var count_character = 0;
		for (var i = 0; i < resLength; i++) {
			count_character += res[i].content.length;
		}
		document.getElementById('present_block_number').innerHTML = resLength;
		document.getElementById('present_character_number').innerHTML = count_character;
	});
	// 统计今日字数
	var today_character_data = count_today_character().then((res) => {
		// console.log(res);
		var resLength = res.length;
		var count_character = 0;
		for (var i = 0; i < resLength; i++) {
			count_character += res[i].length;
		}
		document.getElementById('today_character_number').innerHTML = count_character;
	});
}

async function count_pages() {
	var sql_sentence = 'select * from blocks where type = "d"';
	const res = await sql(sql_sentence);
	return res;
}
async function count_blocks() {
	var sql_sentence = 'select * from blocks where type = "p"';
	const res = await sql(sql_sentence);
	return res;
}

async function count_present_blocks() {
	//var selfId = window.frameElement.parentElement.parentElement.getAttribute('data-node-id');
	var self = window.frameElement.parentElement.parentElement;
	const self_id = await getBlockByID(self.getAttribute('data-node-id'));
	var page_id = self_id.root_id;
	// console.log(page_id);
	var sql_sentence = "select * from blocks where type = 'p' and (root_id = '" + page_id + "'" + " or path like '%" + page_id + "%')";
	const res = await sql(sql_sentence);
	return res;
}

// 统计今日字数
async function count_today_character() {
	var today = new Date();
	var year = today.getFullYear();
	// console.log(year);
	var month = today.getMonth() + 1;
	if (month < 10) {
		month = '0' + month;
	}
	// console.log(month);
	var day = today.getDate();
	if (day < 10) {
		day = '0' + day;
	}
	// console.log(day);
	var today_string = year + '' + month + '' + day + '';
	// console.log(today_string);
	var sql_sentence = "select * from blocks where type = 'p' and updated like '%" + today_string + "%'";
	const res = await sql(sql_sentence);
	return res;
}
