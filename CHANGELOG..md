# Change Log

## 1.4.6

- Refactored to use the VS Code Git extension API to detect/open repositories and install the hook when relevant, reducing unnecessary checks and improving performance.
- UX: Displays a short status bar message when the hook is enabled instead of showing popup dialogs.
- Updated engine/dependency requirements to align with the Git extension API usage.

## 1.4.5

- Fixed an issue with the version badge.

## 1.4.3

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
