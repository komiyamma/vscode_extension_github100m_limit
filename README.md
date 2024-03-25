# Github 100MByte Limit Hook

VSCodeで一度でも開いたGitリポジトリを開けば、100M以上のファイルをコミットしようとすると事前にエラーが出るようにするための拡張機能。

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
以下の内容で「.git/hooks/pre-commit」というファイルを作成します。

```bash
#!/bin/sh

if [ -f .git/hooks/post-checkout ] && [ -f .git/hooks/post-commit ] && [ -f .git/hooks/post-merge ] && [ -f .git/hooks/pre-push ]; then
    limit=999999999 # no use
else
    limit=104857600 # 100MB in bytes
    for file in $(git diff --cached --name-only); do
        file_size=$(stat -c %s "$file")
        if [ $file_size -gt $limit ]; then
            echo "Error: Cannot commit a file larger than 100 MB. Abort commit."
            exit 1
        fi
    done
fi

```
