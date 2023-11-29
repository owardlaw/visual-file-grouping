# Visual File Grouping README

This is a VS Code extension for ogranizing files based on colors. A console window will open display files and their associated groups, a marked file will be denoted by a ⚑ and a bright color in the left explorer panel. 

# Usage

Simply right click a file in the explorer menu and select mark. Select mark again to unmark the file. 

A prompt will open and a group name will be requested, if left empty a default group name will be added. Next a line number will be requested, if left empty no line number will be added. 

In the console window below paths of the files can be clicked on to display the saved file. Click on the file with `cmd+click` Mac or `ctrl+click` Win.

### Key Commands 
Mark file: `cmd+k` Mac or `ctrl+k` Win

Unmark file: `cmd+k` Mac or `ctrl+k` Win 

# Contributing
### Getting Started
1. Open `Run and Debug` panel
2. Click `Run Extension` in the top right of the `Run and Debug` panel
3. A new VS Code window will open with the extension enabled 
4. To view changes to code when developing click the green refresh button

# Build Commands
`vsce package`