# README

## 準備

- PhantomJS[http://phantomjs.org/]をインストール
- CasperJS[http://casperjs.org/]をインストール

## 使い方
- `input`フォルダ内の`capture-list.json`にキャプチャしたいURLと保存時のファイル名を記述

- capture.jsを実行

コマンドラインで以下を実行する
```
//PCサイズでキャプチャしたい場合
casperjs capture.js

//SPサイズでキャプチャしたい場合
casperjs capture.js sp

//TABLETサイズでキャプチャしたい場合
casperjs capture.js tablet
```

Basic認証を行う場合は以下のようにオプションを指定して実行する
```
casperjs capture.js --id=yourid --pass=yourpass
```

- `image`フォルダ内にキャプチャした画像が保存される