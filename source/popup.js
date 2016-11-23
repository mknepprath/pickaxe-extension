// Initialization of the popup (print initial information?)
chrome.storage.local.get(null, function(editors) {
  for (let id in editors) {
    let token = editors[id]
    let url = 'http://localhost:3000/editor/' + id + '?token=' + token

    // Create editor listing
    let editorItem = document.createElement('li')

    // Create button that opens editor locally
    let editorLocalBtn = document.createElement('button')
    editorLocalBtn.className = 'local'
    editorLocalBtn.innerHTML = 'local'
    editorLocalBtn.onclick = function () {
      window.open(url,'_blank')
    }

    // Create link for copy button
    let pickaxeLink = document.createElement('div')
    pickaxeLink.className = 'pickaxe-copy-link'
    pickaxeLink.innerHTML = url
    document.body.appendChild(pickaxeLink)

    // Create button that copies editor url + token
    let editorCopyBtn = document.createElement('button')
    editorCopyBtn.className = 'copy'
    editorCopyBtn.innerHTML = 'copy url'
    editorCopyBtn.onclick = function () {
      var range = document.createRange()
      range.selectNode(pickaxeLink)
      window.getSelection().addRange(range)
      try {
        // Now that we've selected the anchor text, execute the copy command
        document.execCommand('copy')
      } catch(err) {
        console.log('Oops, unable to copy')
      }
      window.getSelection().removeAllRanges()
    }

    // Get current tab
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      let currentUrl = tabs[0].url
      let currentId = currentUrl.substr(currentUrl.lastIndexOf('/') + 1)
      if (id === currentId) {
        editorItem.className = 'current'
      }
    })

    // Add elements to editor listing
    editorItem.append(id)
    editorItem.append(editorCopyBtn)
    editorItem.append(editorLocalBtn)

    // Add editor listing to popup
    document.getElementById('storage').prepend(editorItem)
  }
})
