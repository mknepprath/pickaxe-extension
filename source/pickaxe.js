const {location: {href: currentUrl}, localStorage: {id_token: token}} = window
const editorId = currentUrl.substr(currentUrl.lastIndexOf('/') + 1)
const newUrl = 'http://localhost:3000/editor/' + editorId + '?token=' + token
window.open(newUrl,'_blank')

const emoji = ['✨', '🌟', '💫', '☄', '🚀']

var pickaxeLink = document.createElement('div')
pickaxeLink.className = 'pickaxe-ext-link'
pickaxeLink.innerHTML = newUrl
document.body.appendChild(pickaxeLink)

var pickaxeBtn = document.createElement('button')
pickaxeBtn.className = 'pickaxe-ext-btn'
pickaxeBtn.innerHTML = '⛏'
document.body.appendChild(pickaxeBtn)

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
