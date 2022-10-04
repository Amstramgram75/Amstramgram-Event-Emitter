import main from './common/main'
import aside from './common/aside'
import code from './common/code'
import Prism from 'prismjs'

//Redirect to error.html if the browser does not understand our code...
window.addEventListener('error', e => {
  console.log(e)
  const nameModule = window.location.origin + '/js/index.js',
    nameNoModule = window.location.origin + '/js/noModule/index.js'
  if (e.filename == nameModule || e.filename == nameNoModule) window.location.href = './error.html'
})

//Prevent the 'from:' string to be interpreted as a keyword by Prism
//'from:' is used as option by the plugins posthtml and postcss
const myStrings = ['from']
Prism.languages.insertBefore('javascript', 'constant', {
  'my-strings': {
    pattern: new RegExp("\\b(?:" + myStrings.join("|") + ")\\b(?=:)"),
  }
});

//Set all the used variables names as custom keywords for Prism
//This has to be done before DOM load
if (window.location.pathname == '/index.html') {
  const myVars = ['src', 'dev', 'prod', 'dest', 'babelModule', 'babelNoModule', 'moduleExport', 'noModuleExport', 'polyfillExport']
  Prism.languages.insertBefore('javascript', 'constant', {
    'my-vars': {
      pattern: new RegExp("\\b(?:" + myVars.join("|") + ")\\b(?=}?)(?!:)"),
    }
  });
}

//Prevent Prism to run at startup
//because we want to add our keywords
//before it proceeds
// Prism.manual = true

window.addEventListener("load", function () {
  main()
  aside()
  code()
}, false)