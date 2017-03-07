const {location: {href: currentUrl}, localStorage} = window
const editorId = currentUrl.substr(currentUrl.lastIndexOf('/') + 1)
const {localStorage: {[editorId]: token}} = window
const url = 'http://localhost:3000/editor/' + editorId + '?token=' + token

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.storage) {
      window.localStorage.clear()
      chrome.storage.local.clear()
      sendResponse({status: 'complete'})
    } else if (request.remove) {
      delete window.localStorage[request.remove]
      chrome.storage.local.remove(request.remove)
      sendResponse({status: 'complete'})
    }
  }
)

// Pushes all editor ids and tokens from localStorage to storage (ids are 24 characters long)
for (let editor in localStorage) {
  if (editor.length === 24) {
    chrome.storage.local.get(editor, function (storedEditor) {
      // If stored editor obj is empty, set new editor from localStorage
      if (!Object.keys(storedEditor).length) {
        chrome.storage.local.set({
          [editor]: {
            token: localStorage[editor],
            name: editor
          }
        })
      }
    })
  }
}

// Creates and places corner shortcut buttons
const emoji = ['✨', '🌟', '💫', '☄', '🚀', '⛏']

let pickaxeLink = document.createElement('div')
pickaxeLink.className = 'pickaxe-ext-link'
pickaxeLink.innerHTML = url
document.body.appendChild(pickaxeLink)

let pickaxeCopy = document.createElement('button')
pickaxeCopy.className = 'pickaxe-ext-btn'
pickaxeCopy.innerHTML = '🚀'
pickaxeCopy.onclick = function () {
  let range = document.createRange()
  range.selectNode(pickaxeLink)
  window.getSelection().addRange(range)
  document.execCommand('copy')
  window.getSelection().removeAllRanges()
  pickaxeCopy.innerHTML = emoji[Math.floor(Math.random() * emoji.length)]
}
document.body.appendChild(pickaxeCopy)

let pickaxeOpen = document.createElement('button')
pickaxeOpen.className = 'pickaxe-ext-local-btn'
pickaxeOpen.innerHTML = '🏠'
pickaxeOpen.onclick = function () {
  window.open(url,'_blank')
  pickaxeOpen.innerHTML = '🏚'
}
document.body.appendChild(pickaxeOpen)
