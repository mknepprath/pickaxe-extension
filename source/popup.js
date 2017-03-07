// Initialization of the popup
const urlBases = document.getElementById('urlBase')
const port = document.getElementById('port')
const clearStorage = document.getElementById('clear-storage')

chrome.storage.local.get(null, function (editors) {
  for (let id in editors) {
    // Create editor listing
    let editorItem = document.createElement('li')
    editorItem.id = id
    let editorName = document.createElement('input')
    editorName.className = 'editor-name'
    editorName.value = editors[id].name
    editorName.size = editors[id].name.length + 3
    editorName.onchange = updateEditorName
    editorItem.append(editorName)
    editorItem.append(
      createButton(
        'delete',
        '&times;',
        deleteEditor
      )
    )
    editorItem.append(
      createButton(
        'copy',
        'copy',
        copy
      )
    )
    editorItem.append(
      createButton(
        'open',
        'open',
        open
      )
    )

    // Add editor listing to popup
    document.getElementById('storage').prepend(editorItem)

    // Adds hidden divs with links for copying
    document.body.appendChild(
      createPickaxeLink(
        urlBases.options[urlBases.selectedIndex].value,
        document.getElementById('port').value,
        id,
        editors[id].token
      )
    )
  }
})

// Highlight current tab
chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  const currentUrl = tabs[0].url
  const currentId = currentUrl.substr(currentUrl.lastIndexOf('/') + 1)
  document.getElementById(currentId).className = 'current'
})

// Clears storage when Clear Editors button is clicked
clearStorage.onclick = function () {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {storage: 'clear'}, function (response) {
      if (response.status === 'complete') {
        document.getElementById('storage').innerHTML = ''
        displayClearStorage()
      }
    })
  })
}

// Updates display of port input when url base is changed
urlBases.onchange = function () {
  const selectedBase = this.options[this.selectedIndex]
  displayPort(selectedBase)
  updatePickaxeLinks(
    selectedBase.value,
    document.getElementById('port').value
  )
}

port.onchange = function () {
  updatePickaxeLinks(
    urlBases.options[urlBases.selectedIndex].value,
    this.value
  )
}

const updateEditorName = function () {
  const {id} = this.parentNode
  const newEditorName = this.value
  chrome.storage.local.get(id, function (editors) {
    chrome.storage.local.set({
      [id]: {
        token: editors[id].token,
        name: newEditorName
      }
    })
  })
}

const createButton = function (className, text, onclick) {
  let btn = document.createElement('button')
  btn.className = className
  btn.innerHTML = text
  btn.onclick = onclick
  return btn
}

const createPickaxeLink = function (base, port, id, token) {
  let pickaxeLink = document.createElement('div')
  pickaxeLink.className = 'pickaxe-copy-link'
  pickaxeLink.id = 'copy-' + id
  pickaxeLink.innerHTML = 'http://' + base + (base.endsWith(':') ? port : '') + '/editor/' + id + '?token=' + token
  return pickaxeLink
}

const updatePickaxeLinks = function (base, port) {
  chrome.storage.local.get(null, function (editors) {
    for (let id in editors) {
      document.getElementById('copy-' + id).innerHTML = 'http://' + base + (base.endsWith(':') ? port : '') + '/editor/' + id + '?token=' + editors[id].token
    }
  })
}

const displayPort = function (base) {
  const displayPort = base.value.endsWith(':')
  document.getElementById('port-section').style.display = displayPort ? 'inline-block' : 'none'
}

const displayClearStorage = function () {
  chrome.storage.local.get(null, function (editors) {
    clearStorage.style.display = (!Object.keys(editors).length) ? 'none' : 'block'
  })
}

const open = function () {
  const {id} = this.parentNode
  const selectedBase = urlBases.options[urlBases.selectedIndex]
  const portRequired = selectedBase.value.endsWith(':')
  chrome.storage.local.get(id, function (editors) {
    window.open('http://' + selectedBase.value + (portRequired ? document.getElementById('port').value : '') + '/editor/' + id + '?token=' + editors[id].token, '_blank')
  })
}

const copy = function () {
  const {id} = this.parentNode
  const selectedBase = urlBases.options[urlBases.selectedIndex]
  const pickaxeLink = document.getElementById('copy-' + id)
  let range = document.createRange()
  range.selectNode(pickaxeLink)
  window.getSelection().addRange(range)
  document.execCommand('copy')
  window.getSelection().removeAllRanges()
}

const deleteEditor = function () {
  const {id} = this.parentNode
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {remove: id}, function (response) {
      if (response.status === 'complete') {
        const deletion = document.getElementById(id)
        deletion.parentNode.removeChild(deletion)
      }
    })
  })
}
