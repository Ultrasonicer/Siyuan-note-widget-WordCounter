import { sql } from './api.js';
import { getBlockByID } from './api.js';

// 绑定事件
document.getElementById('get_data').addEventListener('click', function () {
	var page_data = count_pages().then((res) => {
		// 统计页面数量
		var resLength = res.length;
		document.getElementById('page_number').innerHTML = resLength;
	});
	var block_data = count_blocks().then((res) => {
		// 统计块数量和总字数
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
	var present_block_data = count_present_blocks().then((res) => {
		// 统计当前块数量和字数
		// console.log(res);
		var resLength = res.length;
		var count_character = 0;
		for (var i = 0; i < resLength; i++) {
			count_character += res[i].content.length;
		}
		document.getElementById('present_block_number').innerHTML = resLength;
		document.getElementById('present_character_number').innerHTML = count_character;
	});
});

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
