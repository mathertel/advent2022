// some global included code for the Advent Calendar 2022

function codeCopy(evt) {
  const t = evt.target;
  const box = t.getBoundingClientRect();
  if ((evt.clientX > box.right - 32) && (evt.clientY < box.top + 32)) {
    console.log(t.innerText);
    navigator.clipboard.writeText(t.innerText);
  }
}


document.querySelectorAll('pre>code,pre.output').forEach(e => {
  e.addEventListener('click', codeCopy);
  // remove any leading and trailing empty lines and spaces
  const c = e.innerHTML;

  const fc = e.firstChild;
  if (fc.nodeType === document.TEXT_NODE) {
    fc.textContent = fc.textContent.replace(/^\s+/, '');
  }

  const lc = e.lastChild;
  if (lc.nodeType === document.TEXT_NODE) {
    lc.textContent = lc.textContent.replace(/\s+$/, '');
  }
});
