## library
* express
* nodemon
* cors
* mysql
* cookie-parser

# MEMO(For mie)
* 還是要解決middleware在沒有cookie的時候要呼叫createTId的問題

## Console
> SET DEBUG=director name:index & npm run devstart
> npm run devstart
> *記得f12 打開application查看cookie tId狀況，我那邊沒寫好，如果tId不見了(有效時間15分鐘)就回菜單重新call API設定cookie*