[![Github 100MByte Limit Hook v1.3.5](https://img.shields.io/badge/Github_100MByte_Limit_Hook-v1.3.5-6479ff.svg)](https://marketplace.visualstudio.com/items?itemName=komiyamma.github100mbyteslimithook)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)
![Windows 10|11](https://img.shields.io/badge/Windows-_10_|_11-6479ff.svg?logo=windows&logoColor=white)

# Github 100MByte Limit Hook

Git(ローカル)リポジトリに100MBを超えるファイルをコミットしようとした際に、自動的にエラーメッセージを表示し、コミットをキャンセルする拡張機能です。

この拡張機能は、該当するリポジトリのフォルダをVSCodeで開いた際に自動的に設定されます。  
これにより、誤って100Mを超える巨大なファイルをコミットしてしまうことを防ぎ、  
「Github(サーバー)へのプッシュ時に巨大ファイルをコミットしていたことに気づき一大事」といったことを解消できます。

## 動作環境
- MS-Windows (他の環境での動作は未チェック)

## 使い方
- 拡張機能をインストールするだけで利用可能となります。

## 挙動内容
とても単純で

- gitリポジトリなのかどうなのかの判定  
「現在開いているフォルダ」の「直下」に「.git/config」というファイルがあるかどうかチェック

- LFS (Github Large File Storage) リポジトリなのかどうなのかの判定  
.git/hooks 以下に「post-checkout」「post-commit」「post-merge」「pre-push」の「４ファイル全て」が存在する場合は、何もしない

- pre-commit が既に存在するかどうかの判定  
すでに「pre-commit」ファイルが存在する場合は、何もしない

- pre-commit が存在しない場合  
以下の内容で「.git/hooks/pre-commit」というファイルを作成

```bash
#!/bin/sh

toplevel=$(git rev-parse --show-toplevel)
if [ -z "$toplevel" ]; then
    exit 0
fi

if [ -f "$toplevel/.git/hooks/post-checkout" ] && 
    [ -f "$toplevel/.git/hooks/post-commit" ] &&
    [ -f "$toplevel/.git/hooks/post-merge" ] &&
    [ -f "$toplevel/.git/hooks/pre-push" ]; then
    exit 0
fi

limit=104857600 # 100MB in bytes
for file in $(git diff --cached --name-only); do
    file_size=$(stat -c %s "$file")
    if [ $file_size -gt $limit ]; then
        echo "Error: Cannot commit a file larger than 100 MB. Abort commit."
        exit 1
    fi
done

```

## マーケットプレイス
[github100mbyteslimithook](https://marketplace.visualstudio.com/items?itemName=komiyamma.github100mbyteslimithook) で公開されています。

## Change Log

## 1.3.5

説明文の修正

## 1.3.4

pre-commitファイルについて、「カレントディレクトリ」が「リポジトリのルート」でなくても機能するように対応

## 1.3.3

リポジトリのアドレスの変更

## 1.3.2

アイコン作成

## 1.2.0

Readme.mdで改行されていなかっため改修

## 1.1.0

マーケットプレイスへの公開版

## 1.1.0

試験的な初版