// 將檔案路徑設定為你的CSV檔案位置
const csvFilePath = 'index.files/change_list.csv';

// 運用fetch API讀取CSV檔案
fetch(csvFilePath)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.arrayBuffer();
    })
    .then(buffer => {
        // 使用TextDecoder解碼CSV檔案
        const decoder = new TextDecoder('utf-8'); // 請根據你的CSV檔案實際編碼來修改
        const csvData = decoder.decode(buffer);

        // 將CSV轉換為HTML表格
        const table = csvToHtmlTable(csvData);

        // 將表格內容插入到網頁中
        document.getElementById('csv-content').innerHTML = table;
    })
    .catch(error => console.error('Error fetching the CSV file:', error));

// 將CSV轉換為HTML表格的函數
function csvToHtmlTable(csv) {
    const rows = csv.split('\n');
    const table = ['<table border="1">'];

    rows.forEach(row => {
        const columns = row.split(',');
        const tr = ['<tr>'];

        columns.forEach(column => {
            tr.push(`<td>${column}</td>`);
        });

        tr.push('</tr>');
        table.push(tr.join(''));
    });

    table.push('</table>');
    return table.join('');
}
