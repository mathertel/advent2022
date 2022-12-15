// FormJsonData.js

class FormJsonData extends HTMLFormElement {
  // private
  analyzed = false;
  emptyRecord = {};
  booleanAttributes = new Set();

  // connectedCallback() {
  //   ... is called when the html element is ready, but form elements may not be there at this time.
  //   console.log("conn");
  //   document.addEventListener('DOMContentLoaded', this.analyze.bind(this));
  // }

  // analyse all form element types that can be used as input to create an empty record
  // including all known form elements.
  analyze() {
    this.querySelectorAll('input[name],textarea[name]').forEach(e => this.emptyRecord[e.name] = '');
    this.querySelectorAll('select[name]').forEach(e => this.emptyRecord[e.name] = e.value || '');
    this.querySelectorAll('input[name][type=range]').forEach(e => this.emptyRecord[e.name] = 0);
    this.querySelectorAll('input[name][type=color]').forEach(e => this.emptyRecord[e.name] = '#000000');
    this.querySelectorAll('input[name][type=checkbox]').forEach(e => {
      this.emptyRecord[e.name] = false;
      this.booleanAttributes.add(e.name);
    });
    this.analyzed = true;
    console.log(this.emptyRecord);
    // not: output, meter
  }


  // return the formData as Object including empty values.
  getJsonData() {
    if (!this.analyzed) this.analyze();
    const formData = new FormData(this);
    let jData = Object.fromEntries(formData);
    jData = Object.assign({}, this.emptyRecord, jData);

    Object.entries(jData).forEach(([name, value]) => {
      if (this.booleanAttributes.has(name)) {
        jData[name] = Boolean(value === 'on');
      }
    });
    return (jData);
  } // getJsonData()


  // set the value of the form elements according the name including form output elements
  setJsonData(jData) {
    if (!this.analyzed) this.analyze();
    Object.entries(jData).forEach(([name, value]) => {
      this.querySelectorAll(`*[name=${name}]`).forEach(el => {
        if (el.type === 'radio') {
          el.checked = (el.value === value);
        } else if (el.type === 'checkbox') {
          el.checked = (!!value);
        } else {
          el.value = value;
        }
      });
    });
  } // setJsonData()

} // class

customElements.define('form-json', FormJsonData, { extends: 'form' });
