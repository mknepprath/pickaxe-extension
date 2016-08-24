const {location: {href: currentUrl}, localStorage: {id_token: token}} = window
const editorId = currentUrl.substr(currentUrl.lastIndexOf('/') + 1)
const newUrl = 'http://localhost:3000/editor/' + editorId + '?token=' + token
window.open(newUrl,'_blank')
