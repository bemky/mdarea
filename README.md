<img src="https://raw.githubusercontent.com/bemky/mdarea/master/mdarea.svg" width="300" alt="MDAREA">
MDArea is a textarea augmentation that adds a toolbar and keyboard shortcuts to any textarea to turn it into a lightweight markdown editor.

[Demo and Installation Guide](https://bemky.github.io/mdarea/)

## Installation

    npm install github:bemky/mdarea

## Import and Initialize

```javascript
import MDArea from 'mdarea';
    
new MDArea(document.querySelector('textarea'));
````

MDArea will also render it's own textarea if not given one. Instead it can take an object where each key is an attribute of the textarea. 
```javascript
import MDArea from 'mdarea';

const area = new MDArea({
    name: "building[details]",
    rows: 10,
    class: "uniformInput"
});
document.append(area.el);
```

## Markdown Parser
The Preview view renders with a small built-in markdown parser. To use a different parser (e.g. [marked](https://github.com/markedjs/marked) or [snarkdown](https://github.com/developit/snarkdown)), assign a function that takes a markdown string and returns an HTML string to `MDArea.parser`:

```javascript
import MDArea from 'mdarea';
import { marked } from 'marked';

MDArea.parser = marked.parse;
```

```javascript
import MDArea from 'mdarea';
import snarkdown from 'snarkdown';

MDArea.parser = snarkdown;
```

This applies to every `<md-area>` instance on the page.

# Development
Docs are generated using [Middleman](https://middlemanapp.com/)

To run server

    middleman server

To package:

    middleman build