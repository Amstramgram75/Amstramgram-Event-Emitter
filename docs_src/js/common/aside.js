
//Called on  window load event
export default function aside() {
  const
    w = window,
    d = document,
    b = d.body,
    needSubMenu = (d.querySelectorAll('.content h2[id]').length > 1),
    menuButton = d.querySelector('#menu-btn')

  let init = false,
    windowWith, windowHeight
  w.addEventListener('resize', onWindowResize)
  function onWindowResize() {
    windowWith = (w.visualViewport) ? w.visualViewport.width : w.innerWidth || d.documentElement.clientWidth || b.clientWidth
    windowHeight = (w.visualViewport) ? w.visualViewport.height : w.innerHeight || d.documentElement.clientHeight || b.clientHeight
  }
  onWindowResize()

  //Hide the menu if window width is less than 1200px
  menuButton.checked = (windowWith < 1200)

  //We toggle the menu-is-closed class to the body when menu is opened/closed
  menuButton.addEventListener('change', e => {
    menuButton.checked ? b.classList.add('menu-is-closed') : b.classList.remove('menu-is-closed')
  })
  menuButton.dispatchEvent(new CustomEvent('change'))

  //Building the subMenu if necessary.
  //subMenu lists all the h2 with an id found in the content.
  //Each found h2 generates a line with a class whose name is equal to the h2 id.
  //The line contains a anchor pointing to the h2.
  //The anchor content is equal to the h2 content.
  if (needSubMenu) {
    if (history.scrollRestoration) {
      history.scrollRestoration = 'manual';
    }

    const myHash = function () { return w.location.hash.substring(1) }
    let
      lastPos = 0,
      internalScroll = false,
      userScroll = false,
      targetHash = myHash()
    //If there is no hash, hash is set to the first anchor found in the content
    if (!targetHash) targetHash = d.querySelector('.content h2[id]').getAttribute('id')
    let subMenuHtml = '<ul class="sub-menu">'
    Array.from(d.querySelectorAll('.content h2')).forEach(h => {
      subMenuHtml += `<li class="${h.getAttribute('id')}"><a href="#${h.getAttribute('id')}">${h.innerHTML}</a></li>`
    })
    subMenuHtml += '</ul>'
    d.querySelector('aside .aside').insertAdjacentHTML('beforeend', subMenuHtml)
    Array.from(d.querySelectorAll('.sub-menu li')).forEach(l => {
      l.addEventListener('click', function () {
        if (this.classList.contains('active')) {
          return
        } else {
          internalScroll = true
          targetHash = this.getAttribute('class')
          updateHashSubMenu(targetHash)
          waitForInternalScrollEnd()
          if (windowWith < 600) menuButton.checked = true
        }
      })
    })

    //https://stackoverflow.com/a/49071358
    function goToHash(){
      let event
      if (typeof (MouseEvent) === 'function') {
        event = new MouseEvent('click', { bubbles: true })
      } else {//IE11 & co
        event = document.createEvent('Event')
        event.initEvent('click', true, true)
      }
      d.querySelector(`.sub-menu li.${targetHash} a`).dispatchEvent(event)
    }
    goToHash()

    function waitForInternalScrollEnd() {
      const pos = d.querySelector(`.content h2[id=${targetHash}]`).getBoundingClientRect().top
      if (pos >= -1 && pos <= 1) {
        internalScroll = false
        if (!init) {
          d.querySelector('html').classList.add('smooth-scroll')
          init = true
        }
      } else {
        if (!init && pos == lastPos) goToHash()//IE11
        w.requestAnimationFrame(waitForInternalScrollEnd)
      }
      lastPos = pos
    }

    function onOptimizedScroll() {
      if (!internalScroll) {
        const myH2 = Array.from(d.querySelectorAll('.content h2[id]')).filter(h => h.getBoundingClientRect().top <= 1).slice(-1)[0]
        if (myH2 && myHash() != myH2.getAttribute('id')) {
          const location = w.location.toString().split('#')[0]
          history.replaceState(null, null, location + '#' + myH2.getAttribute('id'))
          updateHashSubMenu()
        }
      }
    }

    function updateHashSubMenu(hash = myHash()) {
      if (d.querySelector('.sub-menu .active')) {
        d.querySelector('.sub-menu .active').classList.remove('active')
      }
      d.querySelector(`.sub-menu .${hash}`).classList.add('active')
      const r = d.querySelector(`.sub-menu .${hash}`).getBoundingClientRect(),
        aside = d.querySelector('.aside'),
        margin = 20,
        top = r.height + r.top + aside.scrollTop + margin - windowHeight
      if (r.top > windowHeight || r.top < 60) aside.scrollTop = top
    }

    w.addEventListener('scroll', _ => {
      if (userScroll || internalScroll) return
      userScroll = true
      requestAnimationFrame(() => {
        w.dispatchEvent(new CustomEvent('amst__scroll'))
        userScroll = false
      })
    })
    w.addEventListener('amst__scroll', onOptimizedScroll)
  }
}