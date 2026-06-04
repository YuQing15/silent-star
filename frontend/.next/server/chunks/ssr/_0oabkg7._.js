module.exports=[71330,a=>{"use strict";var b=a.i(87924),c=a.i(72131);let d=(0,c.createContext)(null);a.s(["ThemeProvider",0,function({children:a}){let[e,f]=(0,c.useState)("dark"),[g,h]=(0,c.useState)("dark"),[i,j]=(0,c.useState)("default"),[k,l]=(0,c.useState)(18),[m,n]=(0,c.useState)(1.85);return(0,c.useEffect)(()=>{let a=localStorage.getItem("luminary-theme"),b=localStorage.getItem("luminary-reading-theme"),c=localStorage.getItem("luminary-font-size"),d=localStorage.getItem("luminary-line-height");a&&f(a),b&&j(b),c&&l(parseInt(c)),d&&n(parseFloat(d))},[]),(0,c.useEffect)(()=>{let a=window.matchMedia("(prefers-color-scheme: dark)"),b=()=>{"system"===e?h(a.matches?"dark":"light"):h(e)};return b(),a.addEventListener("change",b),()=>a.removeEventListener("change",b)},[e]),(0,c.useEffect)(()=>{let a=document.documentElement;"dark"===g?a.classList.add("dark"):a.classList.remove("dark")},[g]),(0,c.useEffect)(()=>{document.body.setAttribute("data-reading-theme",i),document.documentElement.style.setProperty("--reader-font-size",`${k}px`),document.documentElement.style.setProperty("--reader-line-height",`${m}`)},[i,k,m]),(0,b.jsx)(d.Provider,{value:{theme:e,resolvedTheme:g,setTheme:a=>{f(a),localStorage.setItem("luminary-theme",a)},readingTheme:i,setReadingTheme:a=>{j(a),localStorage.setItem("luminary-reading-theme",a)},fontSize:k,setFontSize:a=>{l(a),localStorage.setItem("luminary-font-size",String(a)),document.documentElement.style.setProperty("--reader-font-size",`${a}px`)},lineHeight:m,setLineHeight:a=>{n(a),localStorage.setItem("luminary-line-height",String(a)),document.documentElement.style.setProperty("--reader-line-height",`${a}`)}},children:a})},"useTheme",0,function(){let a=(0,c.useContext)(d);if(!a)throw Error("useTheme must be used inside ThemeProvider");return a}])},34549,a=>{"use strict";var b=a.i(87924),c=a.i(72131),d=a.i(38246),e=a.i(50944),f=a.i(5784),g=a.i(16106),h=a.i(70106);let i=(0,h.default)("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);var j=a.i(70880),k=a.i(87532);let l=(0,h.default)("Shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]),m=(0,h.default)("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);var n=a.i(51019),o=a.i(33508),p=a.i(71330),q=a.i(47033),r=a.i(67353),s=a.i(69240),t=a.i(94006),u=a.i(97895);let v=[{href:"/novels",label:"Browse"}],w=["Slow burn fantasy","Villainess","Found family","Regression","Completed novels"];a.s(["Navbar",0,function(){let a=(0,e.usePathname)(),h=(0,e.useRouter)(),{resolvedTheme:x,setTheme:y}=(0,p.useTheme)(),[z,A]=(0,c.useState)(!1),[B,C]=(0,c.useState)(!1),[D,E]=(0,c.useState)(!1),[F,G]=(0,c.useState)(!1),[H,I]=(0,c.useState)(""),[J,K]=(0,c.useState)(null),L=(0,c.useRef)(null),M=a?.includes("/chapters/"),N={user:J,isAuthenticated:!!J},O=(0,q.canAccessAdmin)(N);(0,c.useEffect)(()=>{let a=()=>A(window.scrollY>20);return window.addEventListener("scroll",a,{passive:!0}),()=>window.removeEventListener("scroll",a)},[]),(0,c.useEffect)(()=>{C(!1),G(!1)},[a]),(0,c.useEffect)(()=>{if(!(0,r.hasSupabaseEnv)())return;let a=(0,s.createSupabaseBrowserClient)();a.auth.getUser().then(({data:a})=>K((0,q.mapSupabaseUser)(a.user)));let{data:b}=a.auth.onAuthStateChange((a,b)=>{K((0,q.mapSupabaseUser)(b?.user??null))});return()=>b.subscription.unsubscribe()},[]),(0,c.useEffect)(()=>{D&&setTimeout(()=>L.current?.focus(),80)},[D]),(0,c.useEffect)(()=>{let a=a=>{(a.metaKey||a.ctrlKey)&&"k"===a.key&&(a.preventDefault(),E(a=>!a)),"Escape"===a.key&&(E(!1),G(!1))};return window.addEventListener("keydown",a),()=>window.removeEventListener("keydown",a)},[]);let P=async()=>{await (0,q.signOut)(),K(null),G(!1),C(!1),h.push("/"),h.refresh()},Q=a=>{a.trim()&&(E(!1),I(""),h.push(`/search?q=${encodeURIComponent(a.trim())}`))},R=[];return M?null:(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("header",{className:"fixed top-0 left-0 right-0 z-40 transition-all duration-300",style:{background:z?"var(--nav-bg)":"transparent",borderBottom:z?"1px solid var(--nav-border)":"1px solid transparent",backdropFilter:z?"blur(18px) saturate(1.5)":"none",WebkitBackdropFilter:z?"blur(18px) saturate(1.5)":"none"},children:(0,b.jsx)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:(0,b.jsxs)("div",{className:"flex items-center justify-between h-16",children:[(0,b.jsxs)("div",{className:"flex items-center gap-7",children:[(0,b.jsxs)(d.default,{href:"/",className:"flex items-center gap-2.5 group flex-shrink-0",children:[(0,b.jsx)("img",{src:"/silent-star-logo.svg",alt:"",className:"h-8 w-8 rounded-xl shadow-journal"}),(0,b.jsx)("span",{className:"text-lg font-semibold",style:{fontFamily:"'Cormorant Garamond',Georgia,serif",color:"var(--text-primary)"},children:"Silent Star"})]}),(0,b.jsx)("nav",{className:"hidden md:flex items-center gap-1",children:v.map(({href:c,label:e})=>(0,b.jsx)(d.default,{href:c,className:(0,u.cn)("nav-link",(a===c||"/"!==c&&a?.startsWith(c))&&"active"),children:e},c))})]}),(0,b.jsxs)("div",{className:"flex items-center gap-1",children:[(0,b.jsxs)("button",{onClick:()=>E(!0),className:"hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm transition-colors hover:bg-[var(--accent-dim)]",style:{color:"var(--text-muted)",border:"1px solid var(--border)"},children:[(0,b.jsx)(k.Search,{size:14}),(0,b.jsx)("span",{className:"hidden lg:block",children:"Search..."}),(0,b.jsx)("kbd",{className:"hidden lg:block text-[10px] px-1.5 py-0.5 rounded border",style:{borderColor:"var(--border)",color:"var(--text-muted)"},children:"Ctrl K"})]}),(0,b.jsx)("button",{onClick:()=>E(!0),className:"sm:hidden btn-ghost p-2 rounded-xl","aria-label":"Search",children:(0,b.jsx)(k.Search,{size:17,style:{color:"var(--text-tertiary)"}})}),(0,b.jsx)("button",{onClick:()=>y("dark"===x?"light":"dark"),className:"btn-ghost p-2 rounded-xl","aria-label":"Toggle theme",children:"dark"===x?(0,b.jsx)(m,{size:16,style:{color:"var(--accent-light)"}}):(0,b.jsx)(j.Moon,{size:16,style:{color:"var(--text-tertiary)"}})}),(0,b.jsxs)("div",{className:"relative hidden md:block",children:[(0,b.jsxs)("button",{onClick:()=>G(a=>!a),className:"flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-sm transition-colors hover:bg-[var(--accent-dim)]",style:{borderColor:"var(--border)",color:"var(--text-secondary)"},"aria-label":"Open account menu","aria-expanded":F,children:[(0,b.jsx)(n.UserRound,{size:17}),(0,b.jsx)(f.ChevronDown,{size:13})]}),F&&(0,b.jsx)("div",{className:"frosted-panel absolute right-0 mt-2 w-52 rounded-2xl p-2 shadow-journal",children:N.isAuthenticated&&N.user?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsxs)(d.default,{href:"/profile",className:"flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium hover:bg-[var(--accent-dim)]",style:{color:"var(--text-primary)"},children:[(0,b.jsx)(t.UserAvatar,{name:N.user.name,avatarUrl:N.user.avatarUrl,size:"sm"}),"Reader dashboard"]}),O&&(0,b.jsxs)(d.default,{href:"/admin",className:"flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium hover:bg-[var(--accent-dim)]",style:{color:"var(--text-secondary)"},children:[(0,b.jsx)(l,{size:15}),"Admin desk"]}),(0,b.jsx)("button",{onClick:P,className:"block w-full rounded-xl px-3 py-2 text-left text-sm font-medium hover:bg-[var(--accent-dim)]",style:{color:"var(--text-secondary)"},children:"Log out"})]}):(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(d.default,{href:"/login",className:"block rounded-xl px-3 py-2 text-sm font-medium hover:bg-[var(--accent-dim)]",style:{color:"var(--text-secondary)"},children:"Sign In"}),(0,b.jsx)(d.default,{href:"/signup",className:"block rounded-xl px-3 py-2 text-sm font-medium hover:bg-[var(--accent-dim)]",style:{color:"var(--text-secondary)"},children:"Create Account"})]})})]}),(0,b.jsx)("button",{className:"md:hidden btn-ghost p-2 rounded-xl",onClick:()=>C(!B),"aria-label":"Menu",children:B?(0,b.jsx)(o.X,{size:17,style:{color:"var(--text-primary)"}}):(0,b.jsx)(i,{size:17,style:{color:"var(--text-primary)"}})})]})]})})}),B&&(0,b.jsx)("div",{className:"fixed inset-0 z-30 md:hidden pt-16",style:{background:"var(--bg-base)"},children:(0,b.jsxs)("div",{className:"px-5 py-6 space-y-1",children:[[{href:"/",label:"Home"},...v,...N.isAuthenticated?[{href:"/profile",label:"Dashboard"}]:[],...O?[{href:"/admin",label:"Admin desk"}]:[],...N.isAuthenticated?[]:[{href:"/login",label:"Sign In"},{href:"/signup",label:"Create Account"}]].map(({href:c,label:e})=>(0,b.jsx)(d.default,{href:c,className:"block px-4 py-3 rounded-xl text-base font-medium transition-colors",style:{color:a===c?"var(--accent)":"var(--text-secondary)",background:a===c?"var(--accent-dim)":"transparent"},children:e},c)),N.isAuthenticated&&(0,b.jsx)("button",{onClick:P,className:"block w-full px-4 py-3 rounded-xl text-left text-base font-medium transition-colors",style:{color:"var(--text-secondary)"},children:"Log out"})]})}),D&&(0,b.jsx)("div",{className:"fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4",style:{background:"rgba(49,60,69,0.45)",backdropFilter:"blur(6px)"},onClick:a=>{a.target===a.currentTarget&&E(!1)},children:(0,b.jsxs)("div",{className:"w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl animate-scale-in",style:{background:"var(--bg-surface)",border:"1px solid var(--border)"},children:[(0,b.jsxs)("div",{className:"flex items-center gap-3 px-4 py-3.5",style:{borderBottom:"1px solid var(--border)"},children:[(0,b.jsx)(k.Search,{size:16,style:{color:"var(--text-muted)",flexShrink:0}}),(0,b.jsx)("input",{ref:L,value:H,onChange:a=>I(a.target.value),onKeyDown:a=>{"Enter"===a.key&&Q(H)},placeholder:"Search novels, authors, genres...",className:"flex-1 bg-transparent outline-none text-sm",style:{color:"var(--text-primary)"}}),H&&(0,b.jsx)("button",{onClick:()=>I(""),style:{color:"var(--text-muted)",flexShrink:0},"aria-label":"Clear search",children:(0,b.jsx)(o.X,{size:14})}),(0,b.jsx)("kbd",{className:"hidden sm:block text-[10px] px-1.5 py-0.5 rounded border flex-shrink-0",style:{borderColor:"var(--border)",color:"var(--text-muted)"},children:"Esc"})]}),R.length>0?(0,b.jsxs)("div",{className:"py-1.5",children:[R.map(a=>(0,b.jsxs)(d.default,{href:`/novels/${a.slug}`,onClick:()=>E(!1),className:"flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-[var(--bg-muted)]",children:[(0,b.jsx)("img",{src:a.coverUrl,alt:"",className:"w-8 h-12 rounded-lg object-cover flex-shrink-0"}),(0,b.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,b.jsx)("p",{className:"text-sm font-medium truncate",style:{color:"var(--text-primary)"},children:a.title}),(0,b.jsxs)("p",{className:"text-xs truncate",style:{color:"var(--text-muted)"},children:[a.authorName," - ",a.genres[0]]})]})]},a.id)),(0,b.jsx)("div",{className:"px-4 py-2.5",style:{borderTop:"1px solid var(--border)"},children:(0,b.jsxs)("button",{onClick:()=>Q(H),className:"text-sm font-medium flex items-center gap-1.5",style:{color:"var(--accent)"},children:[(0,b.jsx)(k.Search,{size:13}),' See all results for "',H,'"']})})]}):H.length>1?(0,b.jsxs)("div",{className:"px-4 py-8 text-center text-sm",style:{color:"var(--text-muted)"},children:['No novels matching "',(0,b.jsx)("span",{style:{color:"var(--accent)"},children:H}),'"']}):(0,b.jsxs)("div",{className:"p-3",children:[(0,b.jsx)("p",{className:"px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider mb-1",style:{color:"var(--text-muted)"},children:"Reader searches"}),w.map(a=>(0,b.jsxs)("button",{onClick:()=>Q(a),className:"flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-left transition-colors hover:bg-[var(--bg-muted)]",style:{color:"var(--text-secondary)"},children:[(0,b.jsx)(g.Flame,{size:13,style:{color:"var(--profile-accent)"},className:"flex-shrink-0"}),a]},a))]})]})})]})}],34549)},12452,a=>{"use strict";var b=a.i(87924),c=a.i(38246),d=a.i(50944),e=a.i(81010);let f=(0,a.i(70106).default)("Compass",[["path",{d:"m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z",key:"9ktpf1"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);var g=a.i(87532),h=a.i(30617);let i=[{href:"/",icon:e.Home,label:"Home"},{href:"/novels",icon:f,label:"Browse"},{href:"/search",icon:g.Search,label:"Search"},{href:"/profile",icon:h.LayoutDashboard,label:"Dashboard"}];a.s(["MobileBottomNav",0,function(){let a=(0,d.usePathname)();return a?.includes("/chapters/")?null:(0,b.jsx)("nav",{className:"fixed bottom-0 left-0 right-0 z-40 md:hidden",style:{background:"var(--nav-bg)",backdropFilter:"blur(18px) saturate(1.5)",WebkitBackdropFilter:"blur(18px) saturate(1.5)",borderTop:"1px solid var(--nav-border)",paddingBottom:"env(safe-area-inset-bottom)"},children:(0,b.jsx)("div",{className:"flex items-center justify-around h-16 px-1",children:i.map(({href:d,icon:e,label:f})=>{let g="/"===d?"/"===a:a?.startsWith(d);return(0,b.jsxs)(c.default,{href:d,className:"flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-all duration-200",style:{opacity:g?1:.55},children:[(0,b.jsx)(e,{size:21,strokeWidth:g?2:1.75,style:{color:g?"var(--accent)":"var(--text-tertiary)"}}),(0,b.jsx)("span",{className:"text-[9px] font-medium leading-none",style:{color:g?"var(--accent)":"var(--text-muted)"},children:f}),g&&(0,b.jsx)("span",{className:"absolute bottom-1 w-1 h-1 rounded-full",style:{background:"var(--profile-accent)"}})]},d)})})})}],12452)},6704,a=>{"use strict";let b,c;var d,e=a.i(72131);let f={data:""},g=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,h=/\/\*[^]*?\*\/|  +/g,i=/\n+/g,j=(a,b)=>{let c="",d="",e="";for(let f in a){let g=a[f];"@"==f[0]?"i"==f[1]?c=f+" "+g+";":d+="f"==f[1]?j(g,f):f+"{"+j(g,"k"==f[1]?"":b)+"}":"object"==typeof g?d+=j(g,b?b.replace(/([^,])+/g,a=>f.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,b=>/&/.test(b)?b.replace(/&/g,a):a?a+" "+b:b)):f):null!=g&&(f="-"==f[1]?f:f.replace(/[A-Z]/g,"-$&").toLowerCase(),e+=j.p?j.p(f,g):f+":"+g+";")}return c+(b&&e?b+"{"+e+"}":e)+d},k={},l=a=>{if("object"==typeof a){let b="";for(let c in a)b+=c+l(a[c]);return b}return a};function m(a){let b,c,d=this||{},e=a.call?a(d.p):a;return((a,b,c,d,e)=>{var f;let m=l(a),n=k[m]||(k[m]=(a=>{let b=0,c=11;for(;b<a.length;)c=101*c+a.charCodeAt(b++)>>>0;return"go"+c})(m));if(!k[n]){let b=m!==a?a:(a=>{let b,c,d=[{}];for(;b=g.exec(a.replace(h,""));)b[4]?d.shift():b[3]?(c=b[3].replace(i," ").trim(),d.unshift(d[0][c]=d[0][c]||{})):d[0][b[1]]=b[2].replace(i," ").trim();return d[0]})(a);k[n]=j(e?{["@keyframes "+n]:b}:b,c?"":"."+n)}let o=c&&k.g;return c&&(k.g=k[n]),f=k[n],o?b.data=b.data.replace(o,f):-1===b.data.indexOf(f)&&(b.data=d?f+b.data:b.data+f),n})(e.unshift?e.raw?(b=[].slice.call(arguments,1),c=d.p,e.reduce((a,d,e)=>{let f=b[e];if(f&&f.call){let a=f(c),b=a&&a.props&&a.props.className||/^go/.test(a)&&a;f=b?"."+b:a&&"object"==typeof a?a.props?"":j(a,""):!1===a?"":a}return a+d+(null==f?"":f)},"")):e.reduce((a,b)=>Object.assign(a,b&&b.call?b(d.p):b),{}):e,d.target||f,d.g,d.o,d.k)}m.bind({g:1});let n,o,p,q=m.bind({k:1});function r(a,b){let c=this||{};return function(){let d=arguments;function e(f,g){let h=Object.assign({},f),i=h.className||e.className;c.p=Object.assign({theme:o&&o()},h),c.o=/go\d/.test(i),h.className=m.apply(c,d)+(i?" "+i:""),b&&(h.ref=g);let j=a;return a[0]&&(j=h.as||a,delete h.as),p&&j[0]&&p(h),n(j,h)}return b?b(e):e}}var s=(a,b)=>"function"==typeof a?a(b):a,t=(b=0,()=>(++b).toString()),u="default",v=(a,b)=>{let{toastLimit:c}=a.settings;switch(b.type){case 0:return{...a,toasts:[b.toast,...a.toasts].slice(0,c)};case 1:return{...a,toasts:a.toasts.map(a=>a.id===b.toast.id?{...a,...b.toast}:a)};case 2:let{toast:d}=b;return v(a,{type:+!!a.toasts.find(a=>a.id===d.id),toast:d});case 3:let{toastId:e}=b;return{...a,toasts:a.toasts.map(a=>a.id===e||void 0===e?{...a,dismissed:!0,visible:!1}:a)};case 4:return void 0===b.toastId?{...a,toasts:[]}:{...a,toasts:a.toasts.filter(a=>a.id!==b.toastId)};case 5:return{...a,pausedAt:b.time};case 6:let f=b.time-(a.pausedAt||0);return{...a,pausedAt:void 0,toasts:a.toasts.map(a=>({...a,pauseDuration:a.pauseDuration+f}))}}},w=[],x={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},y={},z=(a,b=u)=>{y[b]=v(y[b]||x,a),w.forEach(([a,c])=>{a===b&&c(y[b])})},A=a=>Object.keys(y).forEach(b=>z(a,b)),B=(a=u)=>b=>{z(b,a)},C={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},D=(a={},b=u)=>{let[c,d]=(0,e.useState)(y[b]||x),f=(0,e.useRef)(y[b]);(0,e.useEffect)(()=>(f.current!==y[b]&&d(y[b]),w.push([b,d]),()=>{let a=w.findIndex(([a])=>a===b);a>-1&&w.splice(a,1)}),[b]);let g=c.toasts.map(b=>{var c,d,e;return{...a,...a[b.type],...b,removeDelay:b.removeDelay||(null==(c=a[b.type])?void 0:c.removeDelay)||(null==a?void 0:a.removeDelay),duration:b.duration||(null==(d=a[b.type])?void 0:d.duration)||(null==a?void 0:a.duration)||C[b.type],style:{...a.style,...null==(e=a[b.type])?void 0:e.style,...b.style}}});return{...c,toasts:g}},E=a=>(b,c)=>{let d,e=((a,b="blank",c)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:b,ariaProps:{role:"status","aria-live":"polite"},message:a,pauseDuration:0,...c,id:(null==c?void 0:c.id)||t()}))(b,a,c);return B(e.toasterId||(d=e.id,Object.keys(y).find(a=>y[a].toasts.some(a=>a.id===d))))({type:2,toast:e}),e.id},F=(a,b)=>E("blank")(a,b);F.error=E("error"),F.success=E("success"),F.loading=E("loading"),F.custom=E("custom"),F.dismiss=(a,b)=>{let c={type:3,toastId:a};b?B(b)(c):A(c)},F.dismissAll=a=>F.dismiss(void 0,a),F.remove=(a,b)=>{let c={type:4,toastId:a};b?B(b)(c):A(c)},F.removeAll=a=>F.remove(void 0,a),F.promise=(a,b,c)=>{let d=F.loading(b.loading,{...c,...null==c?void 0:c.loading});return"function"==typeof a&&(a=a()),a.then(a=>{let e=b.success?s(b.success,a):void 0;return e?F.success(e,{id:d,...c,...null==c?void 0:c.success}):F.dismiss(d),a}).catch(a=>{let e=b.error?s(b.error,a):void 0;e?F.error(e,{id:d,...c,...null==c?void 0:c.error}):F.dismiss(d)}),a};var G=1e3,H=(a,b="default")=>{let{toasts:c,pausedAt:d}=D(a,b),f=(0,e.useRef)(new Map).current,g=(0,e.useCallback)((a,b=G)=>{if(f.has(a))return;let c=setTimeout(()=>{f.delete(a),h({type:4,toastId:a})},b);f.set(a,c)},[]);(0,e.useEffect)(()=>{if(d)return;let a=Date.now(),e=c.map(c=>{if(c.duration===1/0)return;let d=(c.duration||0)+c.pauseDuration-(a-c.createdAt);if(d<0){c.visible&&F.dismiss(c.id);return}return setTimeout(()=>F.dismiss(c.id,b),d)});return()=>{e.forEach(a=>a&&clearTimeout(a))}},[c,d,b]);let h=(0,e.useCallback)(B(b),[b]),i=(0,e.useCallback)(()=>{h({type:5,time:Date.now()})},[h]),j=(0,e.useCallback)((a,b)=>{h({type:1,toast:{id:a,height:b}})},[h]),k=(0,e.useCallback)(()=>{d&&h({type:6,time:Date.now()})},[d,h]),l=(0,e.useCallback)((a,b)=>{let{reverseOrder:d=!1,gutter:e=8,defaultPosition:f}=b||{},g=c.filter(b=>(b.position||f)===(a.position||f)&&b.height),h=g.findIndex(b=>b.id===a.id),i=g.filter((a,b)=>b<h&&a.visible).length;return g.filter(a=>a.visible).slice(...d?[i+1]:[0,i]).reduce((a,b)=>a+(b.height||0)+e,0)},[c]);return(0,e.useEffect)(()=>{c.forEach(a=>{if(a.dismissed)g(a.id,a.removeDelay);else{let b=f.get(a.id);b&&(clearTimeout(b),f.delete(a.id))}})},[c,g]),{toasts:c,handlers:{updateHeight:j,startPause:i,endPause:k,calculateOffset:l}}},I=q`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,J=q`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,K=q`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,L=r("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${a=>a.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${I} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${J} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${a=>a.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${K} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,M=q`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,N=r("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${a=>a.secondary||"#e0e0e0"};
  border-right-color: ${a=>a.primary||"#616161"};
  animation: ${M} 1s linear infinite;
`,O=q`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,P=q`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,Q=r("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${a=>a.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${O} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${P} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${a=>a.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,R=r("div")`
  position: absolute;
`,S=r("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,T=q`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,U=r("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${T} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,V=({toast:a})=>{let{icon:b,type:c,iconTheme:d}=a;return void 0!==b?"string"==typeof b?e.createElement(U,null,b):b:"blank"===c?null:e.createElement(S,null,e.createElement(N,{...d}),"loading"!==c&&e.createElement(R,null,"error"===c?e.createElement(L,{...d}):e.createElement(Q,{...d})))},W=r("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,X=r("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Y=e.memo(({toast:a,position:b,style:d,children:f})=>{let g=a.height?((a,b)=>{let d=a.includes("top")?1:-1,[e,f]=c?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*d}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*d}%,-1px) scale(.6); opacity:0;}
`];return{animation:b?`${q(e)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${q(f)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(a.position||b||"top-center",a.visible):{opacity:0},h=e.createElement(V,{toast:a}),i=e.createElement(X,{...a.ariaProps},s(a.message,a));return e.createElement(W,{className:a.className,style:{...g,...d,...a.style}},"function"==typeof f?f({icon:h,message:i}):e.createElement(e.Fragment,null,h,i))});d=e.createElement,j.p=void 0,n=d,o=void 0,p=void 0;var Z=({id:a,className:b,style:c,onHeightUpdate:d,children:f})=>{let g=e.useCallback(b=>{if(b){let c=()=>{d(a,b.getBoundingClientRect().height)};c(),new MutationObserver(c).observe(b,{subtree:!0,childList:!0,characterData:!0})}},[a,d]);return e.createElement("div",{ref:g,className:b,style:c},f)},$=m`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;a.s(["CheckmarkIcon",0,Q,"ErrorIcon",0,L,"LoaderIcon",0,N,"ToastBar",0,Y,"ToastIcon",0,V,"Toaster",0,({reverseOrder:a,position:b="top-center",toastOptions:d,gutter:f,children:g,toasterId:h,containerStyle:i,containerClassName:j})=>{let{toasts:k,handlers:l}=H(d,h);return e.createElement("div",{"data-rht-toaster":h||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...i},className:j,onMouseEnter:l.startPause,onMouseLeave:l.endPause},k.map(d=>{let h,i,j=d.position||b,k=l.calculateOffset(d,{reverseOrder:a,gutter:f,defaultPosition:b}),m=(h=j.includes("top"),i=j.includes("center")?{justifyContent:"center"}:j.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:c?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${k*(h?1:-1)}px)`,...h?{top:0}:{bottom:0},...i});return e.createElement(Z,{id:d.id,key:d.id,onHeightUpdate:l.updateHeight,className:d.visible?$:"",style:m},"custom"===d.type?s(d.message,d):g?g(d):e.createElement(Y,{toast:d,position:j}))}))},"default",0,F,"resolveValue",0,s,"toast",0,F,"useToaster",0,H,"useToasterStore",0,D],6704)}];

//# sourceMappingURL=_0oabkg7._.js.map