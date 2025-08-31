[To Japanese Version README](README.ja.md)

[![Version](https://img.shields.io/badge/version-v1.4.4-4094ff.svg)](https://marketplace.visualstudio.com/items?itemName=komiyamma.github100mbyteslimithook)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)
![Windows 10|11](https://img.shields.io/badge/Windows-_10_|_11-6479ff.svg?logo=windows&logoColor=white)

# Github 100MByte Limit Hook

This extension automatically displays an error message and cancels the commit when you try to commit a file larger than 100MB to a Git (local) repository.

The extension is automatically configured when you open the relevant repository folder in VSCode.  
This prevents you from accidentally committing huge files over 100MB,  
and helps you avoid the situation where you only notice the large file when pushing to Github (server).

## Supported Environment
- MS-Windows (Operation on other environments is untested)

## Usage
- Just install the extension to use it.

## Behavior
Very simple:

- Check if the folder is a git repository  
Checks if there is a `.git/config` file directly under the "currently opened folder".

- Check if it is an LFS (Github Large File Storage) repository  
If all four files "post-checkout", "post-commit", "post-merge", and "pre-push" exist under `.git/hooks`, do nothing.

- Check if "pre-commit" already exists  
If the "pre-commit" file already exists, do nothing.

- If "pre-commit" does not exist  
Create a file named `.git/hooks/pre-commit` with the following content:

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
git diff --cached --name-only -z | while IFS= read -r -d $'\0' file; do
    file_size=$(stat -c %s "$file" 2>/dev/null)
    if [ -n "$file_size" ]; then
        if [ "$file_size" -gt "$limit" ]; then
            echo "Error: Cannot commit a file larger than 100 MB. Abort commit."
            exit 1
        fi
    fi
done
```

## Marketplace
Available at [github100mbyteslimithook](https://marketplace.visualstudio.com/items?itemName=komiyamma.github100mbyteslimithook).

## Change Log

## 1.4.5

- Fixed an issue with the version badge.

## 1.4.4

- Added an English version of the README.

## 1.4.1

- Fixed an issue where files with multibyte characters in the filename (which are escaped by the git command) could not have their file size checked correctly if they exceeded 100MB.

## 1.4.0

Fixed an issue where, if the file size could not be obtained for some reason, an error was output to standard error.

## 1.3.9

Fixed an issue that was not completely resolved previously.

## 1.3.8

Fixed an issue where the file size check did not work correctly if the file name contained spaces.

## 1.3.5

Revised the description.

## 1.3.4

Updated the pre-commit file to work even if the "current directory" is not the "repository root".

## 1.3.3

Changed the repository address.

## 1.3.2

Created an icon.

## 1.2.0
