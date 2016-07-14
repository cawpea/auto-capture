# Auto Capture

## 概要

PhantomJSとCasperJSを使用して、Webページを自動でキャプチャします。
レンダリングはヘッドレスブラウザのPhantomJSを使用するので、Webkitベースのレンダリングになります。

## 事前準備

- [PhantomJS](http://phantomjs.org/)をインストール
- [CasperJS](http://casperjs.org/)をインストール

## 使い方
1. `input`フォルダ内の`capture-list.json`にキャプチャしたいURLと保存時のファイル名を記述

2. コマンドラインでcapture.jsを実行

```bash
//PCサイズでキャプチャしたい場合
casperjs capture.js

//SPサイズでキャプチャしたい場合
casperjs capture.js sp

//TABLETサイズでキャプチャしたい場合
casperjs capture.js tablet
```

Basic認証を行う場合は以下のようにオプションを指定して実行

```bash
casperjs capture.js --id=yourid --pass=yourpass
```

`image`フォルダ内にキャプチャした画像が保存されます。