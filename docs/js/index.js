class e{#e={};#t={};#s=new Set;#n={};#i;#a;#r(e,t,s=!1){e.split(" ").forEach((e=>{let n=!1;if(!new Set([...this.#e[e]||new Set,...this.#t[e]||new Set]).has(t)){n=!0;const i=s?this.#t:this.#e;(i[e]||(i[e]=new Set)).add(t),this.#o()}this.#i&&this.emit(this.#i,{event:e,callback:t,success:n,list:this.#n})}))}#o(){this.#n={},this.#s=new Set([...Object.keys(this.#e),...Object.keys(this.#t)]),this.#s.forEach((e=>{const t={};t.callbacks=this.#e[e]||new Set,t.callbacksOnce=this.#t[e]||new Set,(t.callbacks.size>0||t.callbacksOnce.size>0)&&(this.#n[e]=t)}))}#l(){[...this.#s].filter((e=>e!=this.#a)).forEach((e=>this.#c(e))),this.#c(this.#a)}#c(e){this.#s.has(e)?[this.#e,this.#t].forEach((t=>{void 0!==t[e]&&t[e].forEach((s=>{this.#u(e,s,!0,t)}))})):this.#a&&this.emit(this.#a,{event:e,callback:"",success:!1,list:this.#n})}#u(e,t,s=!1,n){let i=!1;(s||this.#s.has(e))&&(null==n&&(n=this.#n[e].callbacks.has(t)?this.#e:this.#t),(s||void 0!==n[e])&&(i=n[e].delete(t),0==n[e].size&&delete n[e],this.#o(),this.#a&&this.emit(this.#a,{event:e,callback:t,success:!0,list:this.#n}))),!i&&this.#a&&this.emit(this.#a,{event:e,callback:t,success:!1,list:this.#n})}constructor(e="eventadded",t="eventremoved"){this.#i="string"!=typeof e||/\s/g.test(e)?"":e,this.#a="string"!=typeof t||/\s/g.test(t)?"":t}get eventsAndCallbacks(){return this.#n}get events(){return this.#s}on(e,t){return this.#r(e,t),this}once(e,t){return this.#r(e,t,!0),this}off(e="",t){return"string"==typeof e?""==e?this.#l():e.split(" ").forEach((e=>{null==t?this.#c(e):this.#u(e,t)})):"function"==typeof e&&this.#s.forEach((t=>this.#u(t,e))),this}emit(e,...t){return this.#s.has(e)&&[this.#t[e],this.#e[e]].forEach(((s,n)=>{void 0!==s&&s.forEach(function(s){0==n&&this.#u(e,s,!0,this.#t),s.apply(this,t)}.bind(this))})),this}}const t=document;class s extends e{#d;#h;#g;#p;#f;#v;#m;#y;#b=2;#x=!1;#w=!1;#k=0;#F=3;#A=0;#E=0;#S=0;#$=!1;#L=[];#j=["Click or hit space bar to play !!!","Use your mouse or left and right arrows to move...","Adjust the speed with up and down arrows."];#P(){this.#p=this.#d.width/2,this.#f=this.#d.height/2;let e=Math.random()-.5;e=e<0?-1:1,this.#v=e*this.#b,this.#m=-1*this.#b,this.#y=(this.#d.width-75)/2}#q(){this.#P(),this.#k=0,this.#F=3,this.#A++,this.pause=!0;for(let t=0;t<3;t++){this.#L[t]=[];for(var e=0;e<5;e++)this.#L[t][e]={x:0,y:0,status:1}}this.draw()}#R(){for(let e=0;e<3;e++)for(let t=0;t<5;t++)if(1==this.#L[e][t].status){const s=85*t+30,n=30*e+30;this.#L[e][t].x=s,this.#L[e][t].y=n,this.#g.beginPath(),this.#g.rect(s,n,75,20),this.#g.fillStyle="#cb852a",this.#g.fill(),this.#g.closePath()}}#C(){this.#g.beginPath(),this.#g.arc(this.#p,this.#f,10,0,2*Math.PI),this.#g.fillStyle="#cb852a",this.#g.fill(),this.#g.closePath()}#z(){this.#g.beginPath(),this.#g.rect(this.#y,this.#d.height-10,75,10),this.#g.fillStyle="#cb852a",this.#g.fill(),this.#g.closePath()}#B(){this.#g.font="16px Arial",this.#g.textAlign="left",this.#g.fillStyle="#cb852a"}#O(){this.#B(),this.#g.fillText("Score: "+this.#k,8,20)}#T(){this.#B();const e="Speed: "+this.#b,t=this.#g.measureText(e).width;this.#g.fillText(e,.5*(this.#d.width-t),20)}#_(){this.#B(),this.#g.fillText("Lives: "+this.#F,this.#d.width-65,20)}#M(){this.#g.fillStyle="#111111ee",this.#g.fillRect(0,0,this.#d.width,this.#d.height),this.#g.font="20px Arial",this.#g.textAlign="center",this.#g.fillStyle="#c9be9f","string"==typeof this.#j&&(this.#j=[this.#j]);const e=3==this.#j.length?this.#d.height/2-30:this.#d.height/2;if(this.#g.fillText(this.#j[0],this.#d.width/2,e),this.#j.length>1){const t=this.#g.measureText(this.#j[0]),s=t.actualBoundingBoxAscent+t.actualBoundingBoxDescent+10;for(let t=1;t<this.#j.length;t++)this.#g.fillText(this.#j[t],this.#d.width/2,s*t+e)}}#I(){for(let e=0;e<3;e++)for(let t=0;t<5;t++){const s=this.#L[e][t];if(1==s.status&&this.#p>s.x&&this.#p<s.x+75&&this.#f>s.y&&this.#f<s.y+20&&(this.#m=-this.#m,s.status=0,this.#k++,this.emit("hitbrick",{x:this.#p,y:this.#f}),15==this.#k)){this.#S++;const e=this.#S>1?"games":"game";this.#j=["Congratulations !",`You won ${this.#S} ${e} out of ${this.#A} !`],this.#q(),this.auto&&(this.pause=!1)}}}constructor(e,s=t.body,n=480,i=320){super(),s.insertAdjacentHTML("beforeEnd",`<canvas id="${e}" width="${n}" height="${i}"></canvas>`),this.#d=s.querySelector(`#${e}`),this.#g=this.#d.getContext("2d"),this.#q();const a=this;function r(){a.#h=a.#d.getBoundingClientRect().left}window.addEventListener("resize",r),window.addEventListener("scroll",r),r(),this.pause=!0,this.auto=!1,t.addEventListener("keydown",(e=>{"ArrowRight"==e.code?(this.auto=!1,this.#x=!0):"ArrowLeft"==e.code?(this.auto=!1,this.#w=!0):"ArrowUp"==e.code?(e.preventDefault(),this.speed+=.25):"ArrowDown"==e.code?(e.preventDefault(),this.speed-=.25):"Space"==e.code&&(e.preventDefault(),this.auto=!1,this.toggle())}),!1),t.addEventListener("keyup",(e=>{"ArrowRight"==e.code?this.#x=!1:"ArrowLeft"==e.code&&(this.#w=!1)})),this.#d.addEventListener("mousemove",(e=>{const t=e.clientX-this.#h;t>0&&t<n&&(this.auto=!1,this.#y=t-37.5)}),!1),this.#d.addEventListener("click",(e=>this.toggle()),!1),this.#$=!0,setTimeout((()=>{this.emit("initialization-end")}),1)}toggle(){this.auto=!1,this.pause=!this.pause,this.#$&&this.pause&&(this.#j="Paused..."),this.pause||this.draw()}draw(){if(this.#g.clearRect(0,0,this.#d.width,this.#d.height),this.#R(),this.#C(),this.#z(),this.#O(),this.#T(),this.#_(),this.#I(),this.pause?this.#M():this.emit("playing"),this.auto&&(this.#y=this.#p-37.5),(this.#p+this.#v>this.#d.width-10||this.#p+this.#v<10)&&(this.#p+this.#v>this.#d.width-10?this.emit("hitright"):this.emit("hitleft"),this.#v=-this.#v),this.#f+this.#m<10)this.#m=-this.#m,this.emit("hittop");else if(this.#f+this.#m>this.#d.height-10)if(this.#p>this.#y&&this.#p<this.#y+75)this.emit("hitpaddle",{x:this.#p,y:this.#f}),this.#m=-this.#m;else if(this.emit("hitbottom"),this.#F--,this.#F){const e=this.#F>1?"lives":"live";this.#j=["Oups !!!",`You have ${this.#F} ${e} left !`],this.#P(),this.pause=!0,this.draw()}else{this.#E++;const e=this.#E>1?"games":"game";this.#j=["So sorry !!!",`You lost ${this.#E} ${e} out of ${this.#A} !`],this.#q()}this.#x&&this.#y<this.#d.width-75?this.#y+=7:this.#w&&this.#y>0&&(this.#y-=7),this.#p+=this.#v,this.#f+=this.#m,this.pause?this.#d.style.cursor="pointer":(requestAnimationFrame((e=>this.draw())),this.#d.style.cursor="crosshair")}get score(){return this.#k}get lives(){return this.#F}set speed(e){this.#b=Math.max(.5,Math.min(e,20)),this.#v=this.#v<0?-1*e:e,this.#m=this.#m<0?-1*e:e}get speed(){return this.#b}}class n{static#N=new Set;static ctx;static get size(){return n.#N.size}static draw(){n.#N.forEach((e=>{let t=1-(Date.now()-e.t)/e.duration;if(t>0){const s=e.grow?e.radius/t:e.radius*t;n.ctx.lineWidth=e.grow?e.radius/10/t:t*e.radius/20,n.ctx.strokeStyle=e.strokeColor,n.ctx.fillStyle=e.fillColor,n.ctx.globalAlpha=t,n.ctx.beginPath(),n.ctx.arc(e.x,e.y,s,0,2*Math.PI),n.ctx.stroke(),n.ctx.fill()}else n.#N.delete(e)}))}constructor(e,t,s,i,a,r="transparent",o=!1){"boolean"==typeof r&&!0===r&&(r="transparent",o=!0),this.x=e,this.y=t,this.radius=s,this.duration=i,this.strokeColor=a,this.fillColor=r,this.grow=o,this.t=Date.now(),n.#N.add(this)}}var i="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},a={exports:{}};!function(e){var t=function(e){var t=/(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,s=0,n={},i={manual:e.Prism&&e.Prism.manual,disableWorkerMessageHandler:e.Prism&&e.Prism.disableWorkerMessageHandler,util:{encode:function e(t){return t instanceof a?new a(t.type,e(t.content),t.alias):Array.isArray(t)?t.map(e):t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(e){return Object.prototype.toString.call(e).slice(8,-1)},objId:function(e){return e.__id||Object.defineProperty(e,"__id",{value:++s}),e.__id},clone:function e(t,s){var n,a;switch(s=s||{},i.util.type(t)){case"Object":if(a=i.util.objId(t),s[a])return s[a];for(var r in n={},s[a]=n,t)t.hasOwnProperty(r)&&(n[r]=e(t[r],s));return n;case"Array":return a=i.util.objId(t),s[a]?s[a]:(n=[],s[a]=n,t.forEach((function(t,i){n[i]=e(t,s)})),n);default:return t}},getLanguage:function(e){for(;e;){var s=t.exec(e.className);if(s)return s[1].toLowerCase();e=e.parentElement}return"none"},setLanguage:function(e,s){e.className=e.className.replace(RegExp(t,"gi"),""),e.classList.add("language-"+s)},currentScript:function(){if("undefined"==typeof document)return null;if("currentScript"in document)return document.currentScript;try{throw new Error}catch(n){var e=(/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(n.stack)||[])[1];if(e){var t=document.getElementsByTagName("script");for(var s in t)if(t[s].src==e)return t[s]}return null}},isActive:function(e,t,s){for(var n="no-"+t;e;){var i=e.classList;if(i.contains(t))return!0;if(i.contains(n))return!1;e=e.parentElement}return!!s}},languages:{plain:n,plaintext:n,text:n,txt:n,extend:function(e,t){var s=i.util.clone(i.languages[e]);for(var n in t)s[n]=t[n];return s},insertBefore:function(e,t,s,n){var a=(n=n||i.languages)[e],r={};for(var o in a)if(a.hasOwnProperty(o)){if(o==t)for(var l in s)s.hasOwnProperty(l)&&(r[l]=s[l]);s.hasOwnProperty(o)||(r[o]=a[o])}var c=n[e];return n[e]=r,i.languages.DFS(i.languages,(function(t,s){s===c&&t!=e&&(this[t]=r)})),r},DFS:function e(t,s,n,a){a=a||{};var r=i.util.objId;for(var o in t)if(t.hasOwnProperty(o)){s.call(t,o,t[o],n||o);var l=t[o],c=i.util.type(l);"Object"!==c||a[r(l)]?"Array"!==c||a[r(l)]||(a[r(l)]=!0,e(l,s,o,a)):(a[r(l)]=!0,e(l,s,null,a))}}},plugins:{},highlightAll:function(e,t){i.highlightAllUnder(document,e,t)},highlightAllUnder:function(e,t,s){var n={callback:s,container:e,selector:'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'};i.hooks.run("before-highlightall",n),n.elements=Array.prototype.slice.apply(n.container.querySelectorAll(n.selector)),i.hooks.run("before-all-elements-highlight",n);for(var a,r=0;a=n.elements[r++];)i.highlightElement(a,!0===t,n.callback)},highlightElement:function(t,s,n){var a=i.util.getLanguage(t),r=i.languages[a];i.util.setLanguage(t,a);var o=t.parentElement;o&&"pre"===o.nodeName.toLowerCase()&&i.util.setLanguage(o,a);var l={element:t,language:a,grammar:r,code:t.textContent};function c(e){l.highlightedCode=e,i.hooks.run("before-insert",l),l.element.innerHTML=l.highlightedCode,i.hooks.run("after-highlight",l),i.hooks.run("complete",l),n&&n.call(l.element)}if(i.hooks.run("before-sanity-check",l),(o=l.element.parentElement)&&"pre"===o.nodeName.toLowerCase()&&!o.hasAttribute("tabindex")&&o.setAttribute("tabindex","0"),!l.code)return i.hooks.run("complete",l),void(n&&n.call(l.element));if(i.hooks.run("before-highlight",l),l.grammar)if(s&&e.Worker){var u=new Worker(i.filename);u.onmessage=function(e){c(e.data)},u.postMessage(JSON.stringify({language:l.language,code:l.code,immediateClose:!0}))}else c(i.highlight(l.code,l.grammar,l.language));else c(i.util.encode(l.code))},highlight:function(e,t,s){var n={code:e,grammar:t,language:s};if(i.hooks.run("before-tokenize",n),!n.grammar)throw new Error('The language "'+n.language+'" has no grammar.');return n.tokens=i.tokenize(n.code,n.grammar),i.hooks.run("after-tokenize",n),a.stringify(i.util.encode(n.tokens),n.language)},tokenize:function(e,t){var s=t.rest;if(s){for(var n in s)t[n]=s[n];delete t.rest}var i=new l;return c(i,i.head,e),o(e,i,t,i.head,0),function(e){var t=[],s=e.head.next;for(;s!==e.tail;)t.push(s.value),s=s.next;return t}(i)},hooks:{all:{},add:function(e,t){var s=i.hooks.all;s[e]=s[e]||[],s[e].push(t)},run:function(e,t){var s=i.hooks.all[e];if(s&&s.length)for(var n,a=0;n=s[a++];)n(t)}},Token:a};function a(e,t,s,n){this.type=e,this.content=t,this.alias=s,this.length=0|(n||"").length}function r(e,t,s,n){e.lastIndex=t;var i=e.exec(s);if(i&&n&&i[1]){var a=i[1].length;i.index+=a,i[0]=i[0].slice(a)}return i}function o(e,t,s,n,l,d){for(var h in s)if(s.hasOwnProperty(h)&&s[h]){var g=s[h];g=Array.isArray(g)?g:[g];for(var p=0;p<g.length;++p){if(d&&d.cause==h+","+p)return;var f=g[p],v=f.inside,m=!!f.lookbehind,y=!!f.greedy,b=f.alias;if(y&&!f.pattern.global){var x=f.pattern.toString().match(/[imsuy]*$/)[0];f.pattern=RegExp(f.pattern.source,x+"g")}for(var w=f.pattern||f,k=n.next,F=l;k!==t.tail&&!(d&&F>=d.reach);F+=k.value.length,k=k.next){var A=k.value;if(t.length>e.length)return;if(!(A instanceof a)){var E,S=1;if(y){if(!(E=r(w,F,e,m))||E.index>=e.length)break;var $=E.index,L=E.index+E[0].length,j=F;for(j+=k.value.length;$>=j;)j+=(k=k.next).value.length;if(F=j-=k.value.length,k.value instanceof a)continue;for(var P=k;P!==t.tail&&(j<L||"string"==typeof P.value);P=P.next)S++,j+=P.value.length;S--,A=e.slice(F,j),E.index-=F}else if(!(E=r(w,0,A,m)))continue;$=E.index;var q=E[0],R=A.slice(0,$),C=A.slice($+q.length),z=F+A.length;d&&z>d.reach&&(d.reach=z);var B=k.prev;if(R&&(B=c(t,B,R),F+=R.length),u(t,B,S),k=c(t,B,new a(h,v?i.tokenize(q,v):q,b,q)),C&&c(t,k,C),S>1){var O={cause:h+","+p,reach:z};o(e,t,s,k.prev,F,O),d&&O.reach>d.reach&&(d.reach=O.reach)}}}}}}function l(){var e={value:null,prev:null,next:null},t={value:null,prev:e,next:null};e.next=t,this.head=e,this.tail=t,this.length=0}function c(e,t,s){var n=t.next,i={value:s,prev:t,next:n};return t.next=i,n.prev=i,e.length++,i}function u(e,t,s){for(var n=t.next,i=0;i<s&&n!==e.tail;i++)n=n.next;t.next=n,n.prev=t,e.length-=i}if(e.Prism=i,a.stringify=function e(t,s){if("string"==typeof t)return t;if(Array.isArray(t)){var n="";return t.forEach((function(t){n+=e(t,s)})),n}var a={type:t.type,content:e(t.content,s),tag:"span",classes:["token",t.type],attributes:{},language:s},r=t.alias;r&&(Array.isArray(r)?Array.prototype.push.apply(a.classes,r):a.classes.push(r)),i.hooks.run("wrap",a);var o="";for(var l in a.attributes)o+=" "+l+'="'+(a.attributes[l]||"").replace(/"/g,"&quot;")+'"';return"<"+a.tag+' class="'+a.classes.join(" ")+'"'+o+">"+a.content+"</"+a.tag+">"},!e.document)return e.addEventListener?(i.disableWorkerMessageHandler||e.addEventListener("message",(function(t){var s=JSON.parse(t.data),n=s.language,a=s.code,r=s.immediateClose;e.postMessage(i.highlight(a,i.languages[n],n)),r&&e.close()}),!1),i):i;var d=i.util.currentScript();function h(){i.manual||i.highlightAll()}if(d&&(i.filename=d.src,d.hasAttribute("data-manual")&&(i.manual=!0)),!i.manual){var g=document.readyState;"loading"===g||"interactive"===g&&d&&d.defer?document.addEventListener("DOMContentLoaded",h):window.requestAnimationFrame?window.requestAnimationFrame(h):window.setTimeout(h,16)}return i}("undefined"!=typeof window?window:"undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?self:{});
/**
   * Prism: Lightweight, robust, elegant syntax highlighting
   *
   * @license MIT <https://opensource.org/licenses/MIT>
   * @author Lea Verou <https://lea.verou.me>
   * @namespace
   * @public
   */e.exports&&(e.exports=t),void 0!==i&&(i.Prism=t)}(a);var r=a.exports;Prism.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,lookbehind:!0,greedy:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0,greedy:!0}],string:{pattern:/(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,greedy:!0},"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,lookbehind:!0,inside:{punctuation:/[.\\]/}},keyword:/\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,boolean:/\b(?:false|true)\b/,function:/\b\w+(?=\()/,number:/\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,operator:/[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,punctuation:/[{}[\];(),.:]/},Prism.languages.javascript=Prism.languages.extend("clike",{"class-name":[Prism.languages.clike["class-name"],{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,lookbehind:!0}],keyword:[{pattern:/((?:^|\})\s*)catch\b/,lookbehind:!0},{pattern:/(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,lookbehind:!0}],function:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,number:{pattern:RegExp(/(^|[^\w$])/.source+"(?:"+/NaN|Infinity/.source+"|"+/0[bB][01]+(?:_[01]+)*n?/.source+"|"+/0[oO][0-7]+(?:_[0-7]+)*n?/.source+"|"+/0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source+"|"+/\d+(?:_\d+)*n/.source+"|"+/(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source+")"+/(?![\w$])/.source),lookbehind:!0},operator:/--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/}),Prism.languages.javascript["class-name"][0].pattern=/(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/,Prism.languages.insertBefore("javascript","keyword",{regex:{pattern:RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source+/\//.source+"(?:"+/(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source+"|"+/(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source+")"+/(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),lookbehind:!0,greedy:!0,inside:{"regex-source":{pattern:/^(\/)[\s\S]+(?=\/[a-z]*$)/,lookbehind:!0,alias:"language-regex",inside:Prism.languages.regex},"regex-delimiter":/^\/|\/$/,"regex-flags":/^[a-z]+$/}},"function-variable":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,alias:"function"},parameter:[{pattern:/(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,lookbehind:!0,inside:Prism.languages.javascript},{pattern:/((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,lookbehind:!0,inside:Prism.languages.javascript}],constant:/\b[A-Z](?:[A-Z_]|\dx?)*\b/}),Prism.languages.insertBefore("javascript","string",{hashbang:{pattern:/^#!.*/,greedy:!0,alias:"comment"},"template-string":{pattern:/`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,greedy:!0,inside:{"template-punctuation":{pattern:/^`|`$/,alias:"string"},interpolation:{pattern:/((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,lookbehind:!0,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:Prism.languages.javascript}},string:/[\s\S]+/}},"string-property":{pattern:/((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,lookbehind:!0,greedy:!0,alias:"property"}}),Prism.languages.insertBefore("javascript","operator",{"literal-property":{pattern:/((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,lookbehind:!0,alias:"property"}}),Prism.languages.markup&&(Prism.languages.markup.tag.addInlined("script","javascript"),Prism.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source,"javascript")),Prism.languages.js=Prism.languages.javascript,function(e){var t=e.languages.javadoclike={parameter:{pattern:/(^[\t ]*(?:\/{3}|\*|\/\*\*)\s*@(?:arg|arguments|param)\s+)\w+/m,lookbehind:!0},keyword:{pattern:/(^[\t ]*(?:\/{3}|\*|\/\*\*)\s*|\{)@[a-z][a-zA-Z-]+\b/m,lookbehind:!0},punctuation:/[{}]/};Object.defineProperty(t,"addSupport",{value:function(t,s){"string"==typeof t&&(t=[t]),t.forEach((function(t){!function(t,s){var n="doc-comment",i=e.languages[t];if(i){var a=i[n];if(!a){var r={"doc-comment":{pattern:/(^|[^\\])\/\*\*[^/][\s\S]*?(?:\*\/|$)/,lookbehind:!0,alias:"comment"}};a=(i=e.languages.insertBefore(t,"comment",r))[n]}if(a instanceof RegExp&&(a=i[n]={pattern:a}),Array.isArray(a))for(var o=0,l=a.length;o<l;o++)a[o]instanceof RegExp&&(a[o]={pattern:a[o]}),s(a[o]);else s(a)}}(t,(function(e){e.inside||(e.inside={}),e.inside.rest=s}))}))}}),t.addSupport(["java","javascript","php"],t)}(Prism),function(e){e.languages.typescript=e.languages.extend("javascript",{"class-name":{pattern:/(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,lookbehind:!0,greedy:!0,inside:null},builtin:/\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/}),e.languages.typescript.keyword.push(/\b(?:abstract|declare|is|keyof|readonly|require)\b/,/\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,/\btype\b(?=\s*(?:[\{*]|$))/),delete e.languages.typescript.parameter,delete e.languages.typescript["literal-property"];var t=e.languages.extend("typescript",{});delete t["class-name"],e.languages.typescript["class-name"].inside=t,e.languages.insertBefore("typescript","function",{decorator:{pattern:/@[$\w\xA0-\uFFFF]+/,inside:{at:{pattern:/^@/,alias:"operator"},function:/^[\s\S]+/}},"generic-function":{pattern:/#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,greedy:!0,inside:{function:/^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,generic:{pattern:/<[\s\S]+/,alias:"class-name",inside:t}}}}),e.languages.ts=e.languages.typescript}(Prism),function(e){var t=e.languages.javascript,s=/\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})+\}/.source,n="(@(?:arg|argument|param|property)\\s+(?:"+s+"\\s+)?)";e.languages.jsdoc=e.languages.extend("javadoclike",{parameter:{pattern:RegExp(n+/(?:(?!\s)[$\w\xA0-\uFFFF.])+(?=\s|$)/.source),lookbehind:!0,inside:{punctuation:/\./}}}),e.languages.insertBefore("jsdoc","keyword",{"optional-parameter":{pattern:RegExp(n+/\[(?:(?!\s)[$\w\xA0-\uFFFF.])+(?:=[^[\]]+)?\](?=\s|$)/.source),lookbehind:!0,inside:{parameter:{pattern:/(^\[)[$\w\xA0-\uFFFF\.]+/,lookbehind:!0,inside:{punctuation:/\./}},code:{pattern:/(=)[\s\S]*(?=\]$)/,lookbehind:!0,inside:t,alias:"language-javascript"},punctuation:/[=[\]]/}},"class-name":[{pattern:RegExp(/(@(?:augments|class|extends|interface|memberof!?|template|this|typedef)\s+(?:<TYPE>\s+)?)[A-Z]\w*(?:\.[A-Z]\w*)*/.source.replace(/<TYPE>/g,(function(){return s}))),lookbehind:!0,inside:{punctuation:/\./}},{pattern:RegExp("(@[a-z]+\\s+)"+s),lookbehind:!0,inside:{string:t.string,number:t.number,boolean:t.boolean,keyword:e.languages.typescript.keyword,operator:/=>|\.\.\.|[&|?:*]/,punctuation:/[.,;=<>{}()[\]]/}}],example:{pattern:/(@example\s+(?!\s))(?:[^@\s]|\s+(?!\s))+?(?=\s*(?:\*\s*)?(?:@\w|\*\/))/,lookbehind:!0,inside:{code:{pattern:/^([\t ]*(?:\*\s*)?)\S.*$/m,lookbehind:!0,inside:t,alias:"language-javascript"}}}}),e.languages.javadoclike.addSupport("javascript",e.languages.jsdoc)}(Prism),function(e){function t(e,t){return RegExp(e.replace(/<ID>/g,(function(){return/(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/.source})),t)}e.languages.insertBefore("javascript","function-variable",{"method-variable":{pattern:RegExp("(\\.\\s*)"+e.languages.javascript["function-variable"].pattern.source),lookbehind:!0,alias:["function-variable","method","function","property-access"]}}),e.languages.insertBefore("javascript","function",{method:{pattern:RegExp("(\\.\\s*)"+e.languages.javascript.function.source),lookbehind:!0,alias:["function","property-access"]}}),e.languages.insertBefore("javascript","constant",{"known-class-name":[{pattern:/\b(?:(?:Float(?:32|64)|(?:Int|Uint)(?:8|16|32)|Uint8Clamped)?Array|ArrayBuffer|BigInt|Boolean|DataView|Date|Error|Function|Intl|JSON|(?:Weak)?(?:Map|Set)|Math|Number|Object|Promise|Proxy|Reflect|RegExp|String|Symbol|WebAssembly)\b/,alias:"class-name"},{pattern:/\b(?:[A-Z]\w*)Error\b/,alias:"class-name"}]}),e.languages.insertBefore("javascript","keyword",{imports:{pattern:t(/(\bimport\b\s*)(?:<ID>(?:\s*,\s*(?:\*\s*as\s+<ID>|\{[^{}]*\}))?|\*\s*as\s+<ID>|\{[^{}]*\})(?=\s*\bfrom\b)/.source),lookbehind:!0,inside:e.languages.javascript},exports:{pattern:t(/(\bexport\b\s*)(?:\*(?:\s*as\s+<ID>)?(?=\s*\bfrom\b)|\{[^{}]*\})/.source),lookbehind:!0,inside:e.languages.javascript}}),e.languages.javascript.keyword.unshift({pattern:/\b(?:as|default|export|from|import)\b/,alias:"module"},{pattern:/\b(?:await|break|catch|continue|do|else|finally|for|if|return|switch|throw|try|while|yield)\b/,alias:"control-flow"},{pattern:/\bnull\b/,alias:["null","nil"]},{pattern:/\bundefined\b/,alias:"nil"}),e.languages.insertBefore("javascript","operator",{spread:{pattern:/\.{3}/,alias:"operator"},arrow:{pattern:/=>/,alias:"operator"}}),e.languages.insertBefore("javascript","punctuation",{"property-access":{pattern:t(/(\.\s*)#?<ID>/.source),lookbehind:!0},"maybe-class-name":{pattern:/(^|[^$\w\xA0-\uFFFF])[A-Z][$\w\xA0-\uFFFF]+/,lookbehind:!0},dom:{pattern:/\b(?:document|(?:local|session)Storage|location|navigator|performance|window)\b/,alias:"variable"},console:{pattern:/\bconsole(?=\s*\.)/,alias:"class-name"}});for(var s=["function","function-variable","method","method-variable","property-access"],n=0;n<s.length;n++){var i=s[n],a=e.languages.javascript[i];"RegExp"===e.util.type(a)&&(a=e.languages.javascript[i]={pattern:a});var r=a.inside||{};a.inside=r,r["maybe-class-name"]=/^[A-Z][\s\S]*/}}(Prism),window.addEventListener("error",(e=>{console.log(e);const t=window.location.origin+"/js/index.js",s=window.location.origin+"/js/noModule/index.js";e.filename!=t&&e.filename!=s||(window.location.href="./error.html")}));r.languages.insertBefore("javascript","constant",{"my-vars":{pattern:new RegExp("\\b(?:"+["emitter","EventEmitter"].join("|")+")\\b(?=}?)(?!:)")}});const o=window,l=document,c=l.querySelector(".dot"),u=n.ctx=c.getContext("2d");let d,h,g,p;function f(){g.classList.toggle("active",d.auto),requestAnimationFrame(f)}o.addEventListener("load",(function(){!function(){const e=window,t=document,s=t.querySelector("html");try{Array.from(t.querySelectorAll("aside ul.menu a")).filter((t=>-1!=e.location.toString().indexOf(t.href)))[0].classList.add("selected")}catch(e){t.querySelector("aside ul.menu a").classList.add("selected")}s.addEventListener("transitionend",(function e(){s.classList.remove("loading"),s.classList.remove("loaded"),s.removeEventListener("transitionend",e)})),s.classList.add("loaded"),e.addEventListener("scroll",(e=>{t.documentElement.scrollTop>400?t.querySelector(".up").classList.add("show"):t.querySelector(".up").classList.remove("show")})),t.querySelector(".up").addEventListener("click",(t=>{e.scrollTo(0,0)}))}(),function(){const e=window,t=document,s=t.body,n=t.querySelectorAll(".content h2[id]").length>1,i=t.querySelector("#menu-btn");let a,r,o=!1;function l(){a=e.visualViewport?e.visualViewport.width:e.innerWidth||t.documentElement.clientWidth||s.clientWidth,r=e.visualViewport?e.visualViewport.height:e.innerHeight||t.documentElement.clientHeight||s.clientHeight}if(e.addEventListener("resize",l),l(),i.checked=a<1200,i.addEventListener("change",(e=>{i.checked?s.classList.add("menu-is-closed"):s.classList.remove("menu-is-closed")})),i.dispatchEvent(new CustomEvent("change")),n){history.scrollRestoration&&(history.scrollRestoration="manual");const h=function(){return e.location.hash.substring(1)};let g=0,p=!1,f=!1,v=h();v||(v=t.querySelector(".content h2[id]").getAttribute("id"));let m='<ul class="sub-menu">';function c(){let e;"function"==typeof MouseEvent?e=new MouseEvent("click",{bubbles:!0}):(e=document.createEvent("Event"),e.initEvent("click",!0,!0)),t.querySelector(`.sub-menu li.${v} a`).dispatchEvent(e)}function u(){const s=t.querySelector(`.content h2[id=${v}]`).getBoundingClientRect().top;s>=-1&&s<=1?(p=!1,o||(t.querySelector("html").classList.add("smooth-scroll"),o=!0)):(o||s!=g||c(),e.requestAnimationFrame(u)),g=s}function d(e=h()){t.querySelector(".sub-menu .active")&&t.querySelector(".sub-menu .active").classList.remove("active"),t.querySelector(`.sub-menu .${e}`).classList.add("active");const s=t.querySelector(`.sub-menu .${e}`).getBoundingClientRect(),n=t.querySelector(".aside"),i=s.height+s.top+n.scrollTop+20-r;(s.top>r||s.top<60)&&(n.scrollTop=i)}Array.from(t.querySelectorAll(".content h2")).forEach((e=>{m+=`<li class="${e.getAttribute("id")}"><a href="#${e.getAttribute("id")}">${e.innerHTML}</a></li>`})),m+="</ul>",t.querySelector("aside .aside").insertAdjacentHTML("beforeend",m),Array.from(t.querySelectorAll(".sub-menu li")).forEach((e=>{e.addEventListener("click",(function(){this.classList.contains("active")||(p=!0,v=this.getAttribute("class"),d(v),u(),a<600&&(i.checked=!0))}))})),c(),e.addEventListener("scroll",(t=>{f||p||(f=!0,requestAnimationFrame((()=>{e.dispatchEvent(new CustomEvent("amst__scroll")),f=!1})))})),e.addEventListener("amst__scroll",(function(){if(!p){const s=Array.from(t.querySelectorAll(".content h2[id]")).filter((e=>e.getBoundingClientRect().top<=1)).slice(-1)[0];if(s&&h()!=s.getAttribute("id")){const t=e.location.toString().split("#")[0];history.replaceState(null,null,t+"#"+s.getAttribute("id")),d()}}}))}}(),function(){const e=window,t=document;Array.from(t.querySelectorAll("div.code.copy")).forEach((s=>{s.insertAdjacentHTML("afterbegin",'<div class="icon-copy"><div class="background"></div><div class="foreground"></div></div>'),s.querySelector(".icon-copy").addEventListener("click",(n=>{if(navigator.clipboard)navigator.clipboard.writeText(s.querySelector("code").innerText).then(i,a);else try{const n=t.createRange();n.selectNode(s.querySelector("code")),e.getSelection().removeAllRanges(),e.getSelection().addRange(n),t.execCommand("copy"),e.getSelection().removeAllRanges(),i()}catch(e){a()}function i(){s.querySelector(".icon-copy").classList.add("clicked"),setTimeout((e=>s.querySelector(".icon-copy").classList.remove("clicked")),2e3)}function a(){alert("Sorry but I'm unable to copy!!!")}}))}))}(),function(){const t=new e("","");function n(e){console.log(e.text),e.plus&&console.log(e.plus)}function i(e,t){console.log(e,t)}t.on("firstevent secondevent",n),t.once("thirdevent",i),t.emit("firstevent",{text:"Hello, I'm the FirstEvent!!!"}),t.emit("secondevent",{text:"Hello, I'm the SecondEvent!!!",plus:"Have a nice day !"}),t.emit("thirdevent","Hello, I'm the ThirdEvent!!!","You'll never see me again !!!"),t.emit("thirdevent","You'll never see me !!!"),h=l.querySelector(".controls .button.remove"),g=l.querySelector(".controls .button.auto"),p=l.querySelector(".controls img"),d=new s("game",document.querySelector(".game-container")),d.once("initialization-end",(e=>console.log("Brickwall is ready !"))),d.on("eventadded",(e=>console.log("EventAdded : ",e))),d.on("eventremoved",(e=>console.log("EventRemoved : ",e)));const a={playing:m,hitleft:e=>y("left"),hittop:e=>y("top"),hitright:e=>y("right"),hitbottom:e=>y("bottom"),hitpaddle:b,hitbrick:x};Array.from(l.querySelectorAll("input[type=radio]")).forEach((e=>{e.addEventListener("change",(e=>{d.events.has(e.target.name)&&d.off(e.target.name),"on"==e.target.value?d.on(e.target.name,a[e.target.name]):"once"==e.target.value&&d.once(e.target.name,a[e.target.name]),"playing"==e.target.name&&p.classList.toggle("enabled","on"==e.target.value||"once"==e.target.value),h.classList.toggle("enabled",F())}))})),h.addEventListener("click",(function(){this.classList.contains("enabled")&&(d.off(),Object.keys(a).forEach((e=>w(e))),d.on("eventadded",(e=>console.log("EventAdded : ",e))),d.on("eventremoved",(e=>console.log("EventRemoved : ",e))))})),g.addEventListener("click",(e=>{d.auto=!d.auto,d.auto&&d.pause&&(d.pause=!1,d.draw())})),l.querySelectorAll(".listeners label").forEach((e=>{e.addEventListener("click",(e=>{if(e.ctrlKey){const t=e.target.getAttribute("for"),s=l.querySelector(`#${t}`).value;Array.from(l.querySelectorAll(`.listeners label[data-value=${s}]`)).forEach((e=>{let t;"function"==typeof MouseEvent?t=new MouseEvent("click"):(t=document.createEvent("MouseEvent"),t.initEvent("click",!0,!0)),e.dispatchEvent(t)}))}}))})),f()}()}),!1);let v=0;function m(){v+=5,p.style.transform=`rotate(${v}deg)`,w("playing")}function y(e){l.querySelector(`.${e}`).classList.add("show"),requestAnimationFrame((t=>l.querySelector(`.${e}`).classList.remove("show"))),w("hit"+e)}function b(e){new n(e.x,e.y,10,1e3,"transparent","#a10304",!0),1==n.size&&requestAnimationFrame(k),w("hitpaddle")}function x(e){new n(e.x,e.y,20,1e3,"transparent","#308325",!0),1==n.size&&requestAnimationFrame(k),w("hitbrick")}function w(e){d.events.has(e)||(l.querySelector(`#${e}-off`).checked=!0,"playing"==e&&p.classList.remove("enabled")),h.classList.toggle("enabled",F())}function k(){u.clearRect(0,0,c.width,c.height),n.draw(),n.size>0&&requestAnimationFrame(k)}function F(){return d.events.size>2}
