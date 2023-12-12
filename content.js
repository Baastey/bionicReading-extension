let isBionicReadingActive = false;
let interval;
let originalContent = new Map(); // Zum Speichern des ursprünglichen Inhalts

function bionicRead(text) {
  // Hervorheben der ersten Hälfte (oder mehr) der Buchstaben jedes Wortsegments
  return text.replace(/(^|\s|[\.,;!?()])([a-zA-ZäöüÄÖÜß]+)(?=\s|[\.,;!?()]|$)/g, (match, prefix, word) => {
    if (!isNaN(word)) {
      return match;
    }
    let halfLength = word.length === 1 ? 0 : word.length === 3 ? 1 : Math.ceil(word.length / 2);
    return `${prefix}<strong>${word.substring(0, halfLength)}</strong>${word.substring(halfLength)}`;
  });
}

function saveOriginalContent(target = document.body) {
  originalContent.clear();
  target.querySelectorAll("*:not(script):not(noscript):not(style)").forEach((element) => {
    originalContent.set(element, element.innerHTML);
  });
}

function applyBionicReading(target = document.body) {
  target.querySelectorAll("*:not(script):not(noscript):not(style):not([data-bionic])").forEach((element) => {
    Array.from(element.childNodes).forEach(child => {
      if (child.nodeType === 3 && child.textContent.trim().length > 0) {
        const newElement = document.createElement('span');
        newElement.innerHTML = child.textContent.split('-').map(bionicRead).join('-');
        newElement.setAttribute('data-bionic', 'true');
        element.replaceChild(newElement, child);
      }
    });
  });
}

function resetBionicReading() {
  originalContent.forEach((html, element) => {
    element.innerHTML = html;
  });
  originalContent.clear();
}

function toggleBionicReading() {
  isBionicReadingActive = !isBionicReadingActive;
  if (isBionicReadingActive) {
    if (!originalContent.size) {
      saveOriginalContent();
    }
    interval = setInterval(() => applyBionicReading(document.body), 500);
  } else {
    clearInterval(interval);
    resetBionicReading();
  }
}

function createPopupSwitch() {
  const switchContainer = document.createElement('div');
  switchContainer.id = 'bionic-switch-container';
  switchContainer.style.position = 'fixed';
  switchContainer.style.bottom = '20px';
  switchContainer.style.right = '20px';
  switchContainer.style.zIndex = '1000';
  switchContainer.style.backgroundColor = 'white';
  switchContainer.style.border = '1px solid black';
  switchContainer.style.padding = '10px';
  switchContainer.style.borderRadius = '5px';
  switchContainer.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';

  const switchButton = document.createElement('button');
  switchButton.innerText = 'Toggle Bionic Reading';
  switchButton.onclick = toggleBionicReading;
  switchContainer.appendChild(switchButton);
  document.body.appendChild(switchContainer);
}

window.addEventListener('load', createPopupSwitch);
