// handles messaging from the popup
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.storage) {
      // clear storage
      window.localStorage.clear()
      chrome.storage.local.clear()
      sendResponse({status: 'complete'})
    } else if (request.remove) {
      // remove specific editor
      delete window.localStorage[request.remove]
      chrome.storage.local.remove(request.remove)
      sendResponse({status: 'complete'})
    }
  }
)

// Pushes all editor ids and tokens from localStorage to storage (ids are 24 characters long)
for (let editor in window.localStorage) {
  if (editor.length === 24) {
    chrome.storage.local.get(editor, function (storedEditor) {
      // If stored editor obj is empty, set new editor from localStorage
      if (!Object.keys(storedEditor).length) {
        chrome.storage.local.set({
          [editor]: {
            token: window.localStorage[editor],
            name: editor
          }
        })
      }
    })
  }
}
