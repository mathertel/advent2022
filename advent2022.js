// some global included code for the Advent Calendar 2022

function codeCopy(evt) {
  const t = evt.target;
  const box = t.getBoundingClientRect();
  if ((evt.clientX > box.right - 32) && (evt.clientY < box.top + 32)) {
    console.log(t.innerText);
    navigator.clipboard.writeText(t.innerText);
  }
}
document.querySelectorAll('pre>code').forEach(e => {
  e.addEventListener('click', codeCopy);
});
