const {location: {href: currentUrl}} = window
const editorId = currentUrl.substr(currentUrl.lastIndexOf('/') + 1)
const {localStorage, localStorage: {[editorId]: token}} = window
const url = 'http://localhost:3000/editor/' + editorId + '?token=' + token

// Clears Chrome local storage (not localStorage)
chrome.storage.local.clear()

// Pushes all editor ids and tokens from localStorage to storage
for (let editor in localStorage) {
  if (editor.length === 24) {
    chrome.storage.local.set({[editor]: localStorage[editor]})
  }
}

const emoji = ['✨', '🌟', '💫', '☄', '🚀', '⛏']

var pickaxeLink = document.createElement('div')
pickaxeLink.className = 'pickaxe-ext-link'
pickaxeLink.innerHTML = url
document.body.appendChild(pickaxeLink)

var pickaxeBtn = document.createElement('button')
pickaxeBtn.className = 'pickaxe-ext-btn'
pickaxeBtn.innerHTML = '🚀'
document.body.appendChild(pickaxeBtn)

var localBtn = document.createElement('button')
localBtn.className = 'pickaxe-ext-local-btn'
localBtn.innerHTML = '🏠'
document.body.appendChild(localBtn)

localBtn.onclick = function () {
  window.open(url,'_blank')
  localBtn.innerHTML = '🏚'
}

pickaxeBtn.onclick = function () {
  var range = document.createRange()
  range.selectNode(pickaxeLink)
  window.getSelection().addRange(range)
  try {
    // Now that we've selected the anchor text, execute the copy command
    document.execCommand('copy')
    pickaxeBtn.innerHTML = emoji[Math.floor(Math.random() * emoji.length)]
  } catch(err) {
    console.log('Oops, unable to copy')
  }
  window.getSelection().removeAllRanges()
}
