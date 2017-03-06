// Initialization of the popup
document.getElementById('clear-storage').onclick = function(){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {storage: 'clear'}, function(response) {
      if (response.status === 'complete') {
        getEditors()
      }
    })
  })
}

const getEditors = function () {
  chrome.storage.local.get(null, function(editors) {
    document.getElementById('storage').innerHTML = ''

    for (let id in editors) {
      const token = editors[id]

      // Create editor listing
      let editorItem = document.createElement('li')

      // Create button that opens editor
      let editorOpenBtn = document.createElement('button')
      editorOpenBtn.className = 'open'
      editorOpenBtn.innerHTML = 'open'
      editorOpenBtn.onclick = function () {
        const urlBases = document.getElementById('urlBase')
        let urlBase = urlBases.options[urlBases.selectedIndex].value
        if (urlBase.endsWith(':'))
          urlBase += document.getElementById('port').value
        window.open('http://' + urlBase + '/editor/' + id + '?token=' + token, '_blank')
      }

      const urlBases = document.getElementById('urlBase')
      for (base in urlBases.options) {
        if (urlBases.options[base].value !== undefined) {
          // Create link for copy button
          let pickaxeLink = document.createElement('div')
          pickaxeLink.className = 'pickaxe-copy-link'
          const urlBase = urlBases.options[base].value
          pickaxeLink.id = urlBase + '-' + id
          pickaxeLink.innerHTML = 'http://' + urlBase + '/editor/' + id + '?token=' + token
          document.body.appendChild(pickaxeLink)
        }
      }

      // Create button that copies editor url + token
      let editorCopyBtn = document.createElement('button')
      editorCopyBtn.className = 'copy'
      editorCopyBtn.innerHTML = 'copy'
      editorCopyBtn.onclick = function () {
        var range = document.createRange()
        const urlBases = document.getElementById('urlBase')
        const urlBase = urlBases.options[urlBases.selectedIndex].value
        const pickaxeLink = document.getElementById(urlBase + '-' + id)
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

      // Create button that deletes editor sessions
      let editorDeleteBtn = document.createElement('button')
      editorDeleteBtn.className = 'delete'
      editorDeleteBtn.innerHTML = '&times;'
      editorDeleteBtn.onclick = function () {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {remove: id}, function(response) {
            if (response.status === 'complete') {
              editorItem.parentNode.removeChild(editorItem)
            }
          })
        })
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
      editorItem.append(editorDeleteBtn)
      editorItem.append(editorCopyBtn)
      editorItem.append(editorOpenBtn)

      // Add editor listing to popup
      document.getElementById('storage').prepend(editorItem)
    }
  })
}

getEditors()
