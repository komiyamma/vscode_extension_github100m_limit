# Github 100MByte Limit Hook

GitリポジトリフォルダをVSCodeで開いたタイミングで、自動的に、100M以上のファイルをコミットしようとすると事前にエラーが出るように設定するための拡張機能。

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