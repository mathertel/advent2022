/* scripting for displaying script blocks and logs in pages */

let logScript;
let logDiv;
let logTar;

// check for placing and creating logging containters
function _spCheck() {
  if (logScript !== document.currentScript) {
    if (logScript && logDiv) {
      // add logDiv after script Tag
      const p = logScript.parentElement;
      p.insertBefore(logDiv, logScript.nextElementSibling);
    }
    logScript = undefined;
    logDiv = undefined;
    if (document.currentScript) {
      logScript = document.currentScript;
      // logScript.classList.add('sp-script');
      logTar = logDiv = _spAddElement(document.documentElement, 'pre', 'sp-log output');
    }
  }
  if (!logTar) {
    logTar = logDiv = _spAddElement(document.documentElement, 'pre', 'sp-log output');
  }

  return (logTar);
} // _spCheck

// create a new Element utility
function _spAddElement(parent, tagName, cl, props, txt) {
  const obj = document.createElement(tagName);
  for (k in props) { obj.setAttribute(k, props[k]); }
  if (cl) obj.className = cl;
  if (txt) obj.innerText = txt;
  parent.appendChild(obj);
  return (obj);
} // _spAddElement()


// draw a table in the log area
function spLogTable(_level, [obj, cols]) {
  const logTarget = _spCheck();
  const t = _spAddElement(logTarget, 'table');
  const hr = _spAddElement(t, 'tr');
  cols.forEach(c => {
    _spAddElement(hr, 'th', undefined, undefined, c);
  });

  if (obj && !('forEach' in obj)) {
    obj = Object.values(obj);
  }

  obj.forEach(d => {
    const r = _spAddElement(t, 'tr');
    cols.forEach(c => {
      _spAddElement(r, 'td', undefined, undefined, d[c], 'here');
    });
  });
} // uLogTable()


// log some text and objects
function spLogger(level, args) {
  const logTarget = _spCheck();

  const fmtObj = [];

  for (let n = 0; n < args.length; n++) {
    const a = args[n];
    if (Array.isArray(a)) {
      fmtObj.push(JSON.stringify(a));
    } else {
      fmtObj.push(String(a));
    }
  } // for
  _spAddElement(logTarget, 'div', level, {}, fmtObj.join(' '));
}

function spGroup(_level, [label]) {
  let logTarget = _spCheck();
  logTarget = _spAddElement(logTarget, 'details', '', { open: 1 });
  logTar = logTarget;
  _spAddElement(logTarget, 'summary', undefined, {}, label);
}

function spGroupCollapsed(_level, [label]) {
  let logTarget = _spCheck();
  logTarget = _spAddElement(logTarget, 'details', '', {});
  logTar = logTarget;
  _spAddElement(logTarget, 'summary', undefined, {}, label);
}


function spGroupEnd(_label) {
  const logTarget = _spCheck();
  if (logTarget.tagName === 'DETAILS') {
    logTar = logTarget.parentElement;
  }
}


if (!document.title) {
  document.writeln('<h1>script page...</h1>');
  document.writeln('<style>script,.sp-log{display: block;white-space: pre;}</style>');
}
window.addEventListener('DOMContentLoaded', _spCheck);


(() => {
  function intersectLogger(fName, spFunc = spLogger) {
    const f = console[fName];
    console[fName] = function () { spFunc(fName, arguments); f(...arguments); };
  }

  intersectLogger('info');
  intersectLogger('log');
  intersectLogger('error');
  intersectLogger('warn');
  intersectLogger('table', spLogTable);
  intersectLogger('group', spGroup);
  intersectLogger('groupCollapsed', spGroupCollapsed);
  intersectLogger('groupEnd', spGroupEnd);
})();

