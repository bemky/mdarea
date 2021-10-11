# MDArea
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

# Development
Docs are generated using [Middleman](https://middlemanapp.com/)

To run server

    middleman server

To package:

    middleman build