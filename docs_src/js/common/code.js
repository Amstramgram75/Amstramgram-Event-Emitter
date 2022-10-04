
//Called on  window load event
//Insert a COPY button in each code container with a copy class
//Copy code to clipboard when button is clicked
export default function code() {
  const
    w = window,
    d = document
  Array.from(d.querySelectorAll('div.code.copy')).forEach(div => {
    div.insertAdjacentHTML('afterbegin', '<div class="icon-copy"><div class="background"></div><div class="foreground"></div></div>')
    div.querySelector('.icon-copy').addEventListener('click', _ => {
      if (!navigator.clipboard) {
        try {
          const range = d.createRange()
          range.selectNode(div.querySelector('code'))
          w.getSelection().removeAllRanges() // clear current selection
          w.getSelection().addRange(range) // to select text
          d.execCommand("copy")
          w.getSelection().removeAllRanges()// to deselect
          done()
        } catch (e) {
          error()
        }
      } else {
        navigator.clipboard
          .writeText(div.querySelector('code').innerText)
          .then(done, error)
      }
      function done() {
        div.querySelector('.icon-copy').classList.add('clicked')
        setTimeout(_ => div.querySelector('.icon-copy').classList.remove('clicked'), 2000)
      }
      function error() {
        alert("Sorry but I'm unable to copy!!!")
      }
    })
  })
}