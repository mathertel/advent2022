// templateloader.js

class TemplateLoader extends HTMLTemplateElement {
  #isLoaded = false;
  loadProm;
  autoLoad;

  toBool(s = 'false') {
    if (!s) { return false; }
    switch (s.toLowerCase().trim()) {
      case 'true':
      case 'yes':
        return true;
      case 'false':
      case 'no':
      case '0':
        return false;
      default:
        return Boolean(s);
    }
  } // toBool()


  constructor() {
    super();
    console.info('TemplateLoader:', 'constructor()');
  } // constructor

  connectedCallback() {
    // ... is called when the html element and descendants are ready
    // this.load();
    this.autoLoad = this.toBool(this.getAttribute('autoLoad'));

    if (this.autoLoad) {
      this.load();
    }
  }


  async load() {
    console.info('TemplateLoader:', 'load()');

    if (this.loadProm) {
      console.info('TemplateLoader:', 'done.');

    } else {
      this.loadProm = new Promise((resolve, _reject) => {
        const url = this.getAttribute('url');
        if (!url) {
          // just use the embedded content
          resolve();

        } else {
          fetch(url)
            .then(r => r.text())
            .then(txt => {
              this.innerText = txt;
              this.#isLoaded = true;
              console.info('TemplateLoader:', 'loaded.');
              resolve();
            });
        }
      });
    }
    return (this.loadProm);
  } // load

  async start(insMark, param) {
    let insParent = document.documentElement;
    let insBefore;
    let clone;

    console.info('TemplateLoader:', 'start()');

    if (insMark) {
      insBefore = document.querySelector(insMark);
      insParent = insBefore.parentElement;
    }

    // wait for template to be ready with content
    await this.load();

    if (this.#isLoaded) {
      // take text only, create tags from it and activate scripts
      clone = document.createRange().createContextualFragment(this.innerText);

    } else {
      // standard template content with inline tags
      clone = this.content.cloneNode(true);
    } // if

    const top = clone.firstElementChild;
    insParent.insertBefore(clone, insBefore);

    if (top) {
      const event = new CustomEvent('start', { detail: param });
      top.dispatchEvent(event);
    }
  } // start

} // class

customElements.define('template-loader', TemplateLoader, { extends: 'template' });
