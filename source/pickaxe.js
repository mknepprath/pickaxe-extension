const {location: {href: currentUrl}} = window
const editorId = currentUrl.substr(currentUrl.lastIndexOf('/') + 1)
const {localStorage, localStorage: {[editorId]: token}} = window
const url = 'http://localhost:3000/editor/' + editorId + '?token=' + token

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.storage === 'clear') {
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
    chrome.storage.local.get(editor, function (obj) {
      if (Object.keys(obj).length === 0 && obj.constructor === Object) {
        chrome.storage.local.set({[editor]: localStorage[editor]})
      }
    })
  }
}

// Removes editors from storage if not in localStorage
chrome.storage.local.get(null, function (editors) {
  for (let editor in editors) {
    if (localStorage[editor] === undefined) {
      chrome.storage.local.remove(editor)
    }
  }
})

// Creates and places corner shortcut buttons
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
