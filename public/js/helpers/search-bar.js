// helpers/search-bar.js
class _updateKeywords extends EventTarget {
    fire() {
        this.dispatchEvent(new CustomEvent('update-keywords'));
    }
}

export class SearchBar {
    #resultBox;
    #inputBox;
    #keywords;
    #resultSource;

    constructor(resultBox, inputBox, keywords, resultSource) {
        this.#resultBox = resultBox;
        this.#inputBox = inputBox;
        this.#keywords = keywords;
        this.#resultSource = resultSource;

        this.#inputBox.addEventListener('keyup', this.onkeyup.bind(this));
    }

    get resultBox() { return this.#resultBox; }
    get inputBox() { return this.#inputBox; }
    get keywords() { return this.#keywords; }
    get resultSource() { return this.#resultSource; }

    set keywords(value) { this.#keywords = value; }
    set resultBox(value) { this.#resultBox = value; }

    onkeyup() {
        this.updateKeywords.fire();
        this.display(this.keywords);
    }

    display(result) {
        const content = result.map((resultData) => {
            const template = Handlebars.compile(this.resultSource);
            return template(resultData);
        });
        this.resultBox.innerHTML = "<ul>" + content.join('') + "</ul>";
    }

    updateKeywords = new _updateKeywords();
}
