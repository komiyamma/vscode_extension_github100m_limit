# github100mbyteslimithook

VScodeで一度でも開いたGitリポジトリであれば、.git/hooks/pre-commit のファイルが存在しないのであれば、.git/hooks/pre-commit ファイルを生成する。
生成する中身は「100M以上のファイルをコミットしようとすればエラーを出す」というもの。

## 動作環境
- MS-Windows (他の環境での動作は未チェック)

## 使い方
- 拡張機能をインストールするだけで利用可能となります。

## 挙動内容
-. とても単純で、「現在開いているフォルダ」の「直下」に「.git/config」というファイルがあるかどうかチェック
  - 存在すれば、次に同様に「現在開いているフォルダ」の「直下」に「.git/hooks/pre-commit」というファイルがあるかどうかチェック
    - すでに「pre-commit」ファイルが存在する場合は、何もしません。
    - すでに「post-checkout」「post-commit」「post-merge」「pre-push」の４つのファイルが存在する場合は、何もしません。  
      - (ほぼ間違いなくLFS (Github Large File Storage) が使われていると思われるため)
    - 「pre-commit」ファイルが存在しなければ、以下の内容で「.git/hooks/pre-commit」というファイルを作成します。

```bash
#!/bin/sh

# Check if any file being committed exceeds 100MB
limit=104857600 # 100MB in bytes
for file in $(git diff --cached --name-only); do
    file_size=$(stat -c %s "$file")
    if [ $file_size -gt $limit ]; then
        echo "Error: Cannot commit a file larger than 100 MB. Abort commit."
        exit 1
    fi
done

```
