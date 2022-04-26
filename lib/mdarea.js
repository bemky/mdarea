import markdown from './markdown';

export default class MDArea {
    
    constructor (options) {
        this.el = document.createElement('div');
        
        if (options instanceof Element) {
            this.textarea = options
            this.textarea.parentNode.insertBefore(this.el, this.textarea);
            this.rows = this.textarea.rows
        } else {
            this.textarea = document.createElement('textarea');
        
            Object.keys(options).forEach(key => {
                this.textarea.setAttribute(key, options[key]);
            })
            if (options.value) {
                this.textarea.value = options.value
            }
        }
        
        this.el.classList.add('mdarea');
        
        this.textarea.addEventListener('keyup', this.checkEnter.bind(this));
        window.addEventListener('keydown', this.windowKeyDown.bind(this))
        
        const tools = document.createElement('div');
        tools.addEventListener('click', this.toolClick.bind(this));
        tools.classList.add('mdarea-tools')
        this.constructor.buttons.forEach(buttonAttributes => {
            const button = document.createElement('button');
            button.innerHTML = buttonAttributes.html;
            button.setAttribute('type', "button")
            button.setAttribute('role', buttonAttributes.role)
            tools.append(button);
        })
        
        const views = document.createElement('div');
        views.addEventListener('click', this.viewClick.bind(this));
        views.classList.add('mdarea-views')
        
        let button = document.createElement('button');
        button.innerHTML = 'Write';
        button.setAttribute('type', "button")
        button.setAttribute('role', 'write')
        button.classList.add('-active')
        views.append(button);
        
        button = document.createElement('button');
        button.innerHTML = 'Preview';
        button.setAttribute('type', "button")
        button.setAttribute('role', 'preview')
        views.append(button);
        
        const toolBar = document.createElement('div');
        toolBar.classList.add('mdarea-toolbar')
        toolBar.append(views);
        toolBar.append(tools)
        
        this.el.append(toolBar);
        this.el.append(this.textarea);
        
        /*
            SET STYLE
        */
        if (!document.querySelector('style#mdarea')) {
            const style = document.createElement('style')
            style.id = "mdarea"
            style.innerHTML = `
                .mdarea {
                    position: relative;
                }
                .mdarea .mdarea-toolbar {
                    border-style: solid;
                    border-color: var(--border-color);
                    border-width: var(--border-width);
                    border-top-right-radius: var(--border-radius);
                    border-top-left-radius: var(--border-radius);
                    background-color: var(--background-color);
                    display: flex;
                    position:absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    padding: 0.25em 0.5em;
                    z-index: 2;
                    align-items: end
                }
                .mdarea .mdarea-views {
                    margin-right: 1em;
                    display:flex;
                }
                mdarea .mdarea-tools {
                    display:flex;
                }
                .mdarea .mdarea-toolbar button { 
                    background: none;
                    border: none;
                    appearance: none;
                }
                .mdarea .mdarea-tools button {
                    padding: 0.5em;
                    border-radius: 0.25em;
                    opacity: 0.60;
                }
                .mdarea .mdarea-toolbar button:hover {
                    color: blue;
                    background: rgba(0, 0, 255, 0.05);
                    opacity: 1;
                }
                .mdarea .mdarea-views button {
                    margin-bottom: calc(-0.25em - 1px);
                    padding: 0.35em 1em 0.5em;
                    border-top-right-radius: var(--border-radius);
                    border-top-left-radius: var(--border-radius);
                    border: 1px solid transparent;
                    opacity: 0.6;
                }
                .mdarea .mdarea-views button.-active{
                    background: var(--background-color);
                    border-color: var(--border-color);
                    border-bottom-color: var(--background-color);
                    color: currentColor;
                    opacity: 1;
                }
                .mdarea-preview {
                    border-style: solid;
                    border-color: var(--border-color);
                    border-width: var(--border-width);
                    padding-top: var(--padding-top);
                    padding-right: var(--padding-right);
                    padding-bottom: var(--padding-bottom);
                    padding-left: var(--padding-left);
                    background-color: var(--background-color);
                    border-radius: var(--border-radius);
                    color: var(--color);
                }
                .mdarea textarea {
                    padding-top: var(--padding-top);
                }
            `
            document.getElementsByTagName('head')[0].appendChild(style);
        }
        
        // In situations where el is rendered before being appended,
        // we have to throw it on the DOM to read style information
        let removeAfterStyle;
        if (!this.el.closest('body')) {
            removeAfterStyle = true;
            document.body.append(this.el)
        }
        const textareaStyle = getComputedStyle(this.textarea);
        
        this.el.style.setProperty('--color', textareaStyle["color"]);
        this.el.style.setProperty('--border-color', textareaStyle["border-top-color"]);
        this.el.style.setProperty('--border-width', textareaStyle["border-top-width"]);
        this.el.style.setProperty('--border-radius', textareaStyle["border-top-left-radius"]);
        this.el.style.setProperty('--background-color', textareaStyle["background-color"]);
        this.el.style.setProperty('--padding-top', `calc(${toolBar.offsetHeight}px + ${textareaStyle["padding-top"]} + ${textareaStyle["border-top-width"]})`)
        this.el.style.setProperty('--padding-right', textareaStyle["padding-right"]);
        this.el.style.setProperty('--padding-left', textareaStyle["padding-left"]);
        this.el.style.setProperty('--padding-bottom', textareaStyle["padding-bottom"]);
        /*
            END STYLE SETUP
        */
        
        if (removeAfterStyle) {
            document.body.removeChild(this.el)
        }
    }
    
    toolClick (role) {
        if (role instanceof Event) {
            let button = role.target
            if (!button.role) {
                button = button.closest('[role]')
            }
            if (!button) return
            role = button.getAttribute('role')
        }

        const buttonAttributes = this.constructor.buttons.find(x => x.role == role)
        buttonAttributes.transform(this.textarea, this.textarea.selectionStart, this.textarea.selectionEnd);
        this.textarea.focus();
    }
    
    viewClick (e) {
        let button = e.target
        if (!button.role) {
            button = button.closest('[role]')
        }
        if (!button) return
        let preview = this.el.querySelector('.mdarea-preview')
        // Write
        if (button.getAttribute('role') == "write") {
            if (preview) {
                this.el.removeChild(preview);
            }
            this.textarea.style.display = "block";
            this.el.querySelector('button.-active').classList.remove('-active');
            this.el.querySelector('button[role="write"]').classList.add('-active')
        // Preview
        } else {
            if (!preview) {
                preview = document.createElement('div')
                preview.innerHTML = markdown(this.textarea.value)
                preview.classList.add('mdarea-preview')
                this.el.append(preview)
            }
            preview.style['min-height'] = getComputedStyle(this.textarea)['height'];
            this.textarea.style.display = "none";
            this.el.querySelector('button.-active').classList.remove('-active');
            this.el.querySelector('button[role="preview"]').classList.add('-active')
        }
    }
    
    checkEnter (e) {
        if (e.key == "Enter") {
            let previousLine = this.textarea.value.substring(0, this.textarea.selectionEnd).match(/(.*)\n$/)
            if (previousLine) {
                previousLine = previousLine[1]
            } else {
                return
            }
            if (!previousLine[0]) return;
            
            if (previousLine.slice(0, 2) == "- ") {
                if (previousLine == "- ") {
                    this.textarea.setRangeText("", this.textarea.selectionEnd - 3, this.textarea.selectionEnd, "end");
                } else {
                    this.textarea.setRangeText("- ", this.textarea.selectionEnd, this.textarea.selectionEnd, "end");
                } 
            } else if (previousLine.match(/\d+\./)) {
                let prefix = previousLine.match(/\d+\.\s/)[0]
                if (prefix.length == previousLine.length) {
                    this.textarea.setRangeText("", this.textarea.selectionEnd - prefix.length - 1, this.textarea.selectionEnd, "end");
                } else {
                    prefix = parseInt(prefix)
                    this.textarea.setRangeText(prefix + 1 + ". ", this.textarea.selectionEnd, this.textarea.selectionEnd, "end");
                    // TODO check order of all numbers
                }
            }
        }
    }
    
    windowKeyDown (e) {
        if (e.metaKey || e.ctrlKey) {
            const key = e.key.toUpperCase()
            if (["B", "I", "K", "H"].includes(key)) {
                switch (key) {
                    case "B":
                        this.toolClick("bold");
                        break;
                    case "I":
                        this.toolClick("italic")
                        break;
                    case "K":
                        this.toolClick("link")
                        break;
                    case "H":
                        this.toolClick("header")
                        break;
                }

                e.preventDefault()
                e.stopPropagation()
            }
            if (key == "Enter" && this.textarea.form) {
                this.textarea.submit();
                e.preventDefault();
            }
        }
    }
    
    static buttons = [{
        role: 'bold',
        html: `<svg height="16" viewBox="0 0 16 16" version="1.1" width="16" fill="currentColor">
    <path fill-rule="evenodd" d="M4 2a1 1 0 00-1 1v10a1 1 0 001 1h5.5a3.5 3.5 0 001.852-6.47A3.5 3.5 0 008.5 2H4zm4.5 5a1.5 1.5 0 100-3H5v3h3.5zM5 9v3h4.5a1.5 1.5 0 000-3H5z"></path>
</svg>
        `,
        transform: (textarea, start, end) => wrapSelection(textarea, start, end, "**")
    },{
        role: 'italic',
        html: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>`,
        transform: (textarea, start, end) => wrapSelection(textarea, start, end, "_")
    },{
        role: 'header',
        html: `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" fill="currentColor"><path d="M3.75 2a.75.75 0 01.75.75V7h7V2.75a.75.75 0 011.5 0v10.5a.75.75 0 01-1.5 0V8.5h-7v4.75a.75.75 0 01-1.5 0V2.75A.75.75 0 013.75 2z"></path></svg>`,
        transform: (textarea, start, end) => prefixLine(textarea, start, end, "### ")
    },{
        role: 'link',
        html: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`,
        transform: (textarea, start, end) => {
            const selection = textarea.value.substring(start, end)
            textarea.setRangeText(`[${selection}](url)`);
            if (selection.length == 0) {
                textarea.setSelectionRange(start + 1, start + 1 + selection.length);
            } else {
                textarea.setSelectionRange(start + 3 + selection.length, start + 3 + selection.length + 3);
            }
        }
    },{
        role: 'bullets',
        html: `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" fill="currentColor"><path d="M2 4a1 1 0 100-2 1 1 0 000 2zm3.75-1.5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 5a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zM3 8a1 1 0 11-2 0 1 1 0 012 0zm-1 6a1 1 0 100-2 1 1 0 000 2z"></path></svg>`,
        transform: (textarea, start, end) => prefixLine(textarea, start, end, "- ")
    },{
        role: 'numbers',
        html: `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" fill="currentColor"><path d="M2.003 2.5a.5.5 0 00-.723-.447l-1.003.5a.5.5 0 00.446.895l.28-.14V6H.5a.5.5 0 000 1h2.006a.5.5 0 100-1h-.503V2.5zM5 3.25a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 015 3.25zm0 5a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 015 8.25zm0 5a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5h-8.5a.75.75 0 01-.75-.75zM.924 10.32l.003-.004a.851.851 0 01.144-.153A.66.66 0 011.5 10c.195 0 .306.068.374.146a.57.57 0 01.128.376c0 .453-.269.682-.8 1.078l-.035.025C.692 11.98 0 12.495 0 13.5a.5.5 0 00.5.5h2.003a.5.5 0 000-1H1.146c.132-.197.351-.372.654-.597l.047-.035c.47-.35 1.156-.858 1.156-1.845 0-.365-.118-.744-.377-1.038-.268-.303-.658-.484-1.126-.484-.48 0-.84.202-1.068.392a1.858 1.858 0 00-.348.384l-.007.011-.002.004-.001.002-.001.001a.5.5 0 00.851.525zM.5 10.055l-.427-.26.427.26z"></path></svg>`,
        transform: (textarea, start, end) => prefixLine(textarea, start, end, "1. ")
    }]
}

function wrapSelection(textarea, start, end, wrapText) {
    let selection = textarea.value.substring(start, end)
    
    // If no selection, wrap word cursor is in
    if (selection.length == 0) {
        const firstHalf = textarea.value.substring(0, start).match(/\S*$/)[0]
        const secondHalf = textarea.value.substring(end).match(/^\S*/)[0]
        selection = firstHalf + secondHalf
        start = start - firstHalf.length
        end = end + secondHalf.length
    }
    
    let selectStart = start
    let selectEnd = end
    
    // If selection includes existing wrap, then disable
    if (selection.substring(0, wrapText.length) == wrapText && selection.substring(selection.length - wrapText.length) == wrapText) {
        selection = selection.substring(wrapText.length, selection.length - wrapText.length)
        selectEnd = selectStart + selection.length
    // If selection is wrapped, then disable
    } else if (textarea.value.substring(start - wrapText.length, start) == wrapText && textarea.value.substring(end, end + wrapText.length) == wrapText) {
        start = start - wrapText.length
        end = end + wrapText.length
        selectStart = selectStart - wrapText.length
        selectEnd = selectStart + selection.length
    // Else enable
    } else {
        selectStart += wrapText.length
        selectEnd = selectStart + selection.length
        selection = [wrapText, selection, wrapText].join("")
    }
    textarea.setRangeText(selection, start, end);
    textarea.setSelectionRange(selectStart, selectEnd);
}
function prefixLine(textarea, start, end, prefix) {
    start = start - textarea.value.substring(0, start).match(/.*$/)[0].length
    end = end + textarea.value.substring(end).match(/^.*/)[0].length
    let selection = textarea.value.substring(start, end)
    
    // If enabled then disable
    if (selection.substring(0, prefix.length) == prefix) {
        selection = selection.substring(prefix.length)
        textarea.setRangeText(selection, start, end);
        textarea.setSelectionRange(arguments[1] - prefix.length, arguments[1] - prefix.length);
    // If else enable
    } else {
        selection = `${prefix}${selection}`;
        if (start != 0 && textarea.value.charCodeAt(start-1) != 10) {
            selection = "\n" + selection
        }
        if (end != textarea.value.length && textarea.value.charCodeAt(end+1) != 10) {
            selection = selection + "\n"
        }
        textarea.setRangeText(selection, start, end);
        textarea.setSelectionRange(arguments[1] + prefix.length, arguments[2] + prefix.length);
    }
}