# Péguy Editor

Péguy Editor is a small code editor based on [Electron](https://www.electronjs.org/), [Péguy.js](https://github.com/Killfaeh/Peguy.js) and [highlight.js](https://highlightjs.org/). </br>
It offers a library of ready-to-use code blocks that can be customized to suit your needs. 
This allows you to write code quickly without using online chatbots.
It's also a way of centralizing your entire knowledge base.

## Table of Contents

1. [Installation](#installation)
2. [How to use](#how-to-use)
3. [Customize the code blocks library](#customize-the-code-blocks-library)

## Installation

### Install Node.js

You need to install Node.js to run Péguy Editor.

**Windows**

Download the installation file on Node.js web site : [https://nodejs.org/fr/download/prebuilt-installer](https://nodejs.org/fr/download/prebuilt-installer) </br>
Run it as administrator.

**Mac OS**

Open a terminal. </br>
Install Homebrew if you haven't already.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Then, install Node.js and npm.

```bash
brew install node
brew install npm
```

**Linux**

Open a console and run these 2 commands.

```bash
sudo apt install nodejs
sudo apt install npm
```

### Download and extract the archive

Download the project archive via this Google Drive link : [https://drive.google.com/file/d/1f9yL_PD6-LOnLphnlumRJx7D9PujbjhA/view?usp=sharing](https://drive.google.com/file/d/1f9yL_PD6-LOnLphnlumRJx7D9PujbjhA/view?usp=sharing)</br>
Then, extract it.

<div align="center">
<img src="./doc/archiveContent.png"></br>
Archive content
</div>

### Run the application

**Windows**

If you run Péguy Editor for the first time, run install.bat as administrator. 
A DOS console appears, with a small rotating bar in the top left corner, then disappears when installation is complete.</br>
Then, run PeguyEditor.bat as administrator.

**Mac OS**

If you run Péguy Editor for the first time, run Install.app (double clic). </br>
Run PeguyEditor.app (double clic).</br>
You can put PeguyEditor.app in your dock.

**Linux**

If you run Péguy Editor for the first time, run Install in a console. </br>
Run PeguyEditor in a console.

## How to use

<div align="center">
<img src="./doc/screenshot.png">
</div>

You can open a workspace by clicking on the button "Change Workspace".</br>
In the right panel, there is the ready-to-use code blocks library. 
You can paste a code block in your code by double clicking on the label of the row or simple clicking on the corresponding copy/paste icon.

## Customize the code blocks library

If you have run Péguy Editor at least once the directory Peguy/CodeEditor/CodeLists has been created in your Documents directory.</br>
You can create your own library by creating some CSV files in this directory.</br>
Here is how to format each CSV file.

<div align="center">
<img src="./doc/csvFormat.png">
</div></br>

In the first row, put the columns labels : "label", "keywords" and "code".</br>
Then, for each following row, put the label of the row in the first column, the keywords with "," as delimiter in the second column and the code block in the third column.</br>

<div align="center">
<img src="./doc/csvSave.png">
</div></br>

Then, when you save the CSV file, choose UTF-8 as character set, ":" as field delimiter and " as string delimiter.
