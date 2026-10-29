/* ============================================================
   MegaDownloader Revival — 概念版官网脚本
   模块:开场幕布 / 主题 / 双语 / 进场与滚动 / GitHub 同步 /
        粒子网络 + 下载光束 / 仿真窗口(进度·曲线·配额·3D 倾斜)/
        解密文字 / 磁吸按钮 / 光标光晕 / 时间线点亮 / 水印视差
   ============================================================ */
(function(){
"use strict";
var $=function(s,c){return (c||document).querySelector(s)}, $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
var finePointer=matchMedia('(pointer: fine)').matches;
var REPO='a1175815821/MegaDownloader-Revival';

/* ========== 开场幕布(每会话只放一次) ========== */
var intro=$('#intro');
if(intro){
  var seenIntro=false; try{seenIntro=sessionStorage.getItem('mdr-intro')==='1'}catch(e){}
  if(reduceMotion||seenIntro){intro.remove()}
  else{
    try{sessionStorage.setItem('mdr-intro','1')}catch(e){}
    intro.hidden=false;
    setTimeout(function(){intro.classList.add('done')},420);
    setTimeout(function(){intro.remove()},1200);
  }
}

/* ========== 主题 ========== */
var themeBtn=$('#themeBtn');
var SUN='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/></svg>';
var MOON='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z"/></svg>';
var MOCK_THEME={zh:{dark:'深色主题',light:'浅色主题'},en:{dark:'dark theme',light:'light theme'}};
function syncMockTheme(){
  var el=$('#mockTheme');if(!el)return;
  var mode=document.documentElement.getAttribute('data-theme')==='dark'?'dark':'light';
  el.textContent=MOCK_THEME[(typeof langNow==='string'&&langNow==='en')?'en':'zh'][mode];
}
function setTheme(t,persist){
  document.documentElement.setAttribute('data-theme',t);
  themeBtn.innerHTML=(t==='dark')?SUN:MOON;
  if(persist!==false){savedTheme=t;try{localStorage.setItem('mdr-theme',t)}catch(e){}}
  var m=$('meta[name="theme-color"]'); if(m) m.setAttribute('content',t==='dark'?'#05060b':'#f4f5fa');
  syncMockTheme();
  syncShots();
}
var savedTheme=null; try{savedTheme=localStorage.getItem('mdr-theme')}catch(e){}
if(savedTheme!=='light'&&savedTheme!=='dark')savedTheme=null;
setTheme(savedTheme||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'),false);
themeBtn.addEventListener('click',function(){
  setTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark');
});
/* 跟随系统实时切换(未手动指定过主题时) */
var mqLight=matchMedia('(prefers-color-scheme: light)');
if(mqLight.addEventListener){
  mqLight.addEventListener('change',function(e){if(!savedTheme)setTheme(e.matches?'light':'dark',false)});
}

/* ========== 双语 ========== */
var I18N={
en:{
 'nav.story':'The Revival','nav.workbench':'Workbench','nav.features':'Capabilities','nav.vs':'vs v1.8','nav.download':'Download','nav.changelog':'Changelog','nav.faq':'FAQ','nav.star':'Star',
 'hero.badge':'Stable releases on GitHub · actively maintained',
 'hero.flag':'2.6 workbench rebuild',
 'hero.h1a':'The classic MEGA downloader','hero.h1b':'2.6 — a rebuilt workbench.',
 'hero.sub':'Not a patch: the whole UI layer was torn down and rebuilt — <b>two-step batch add</b>, file-tree selection, <b>Ctrl+F task search</b>, scheduled downloads. Multi-threaded speed, resume and quota recovery are all still here, still a <b>single portable exe</b>.',
 'hero.cta1':'Free download','hero.cta2':'GitHub Star',
 'hero.note':'✓ Free &amp; open source&nbsp;&nbsp;✓ No admin rights&nbsp;&nbsp;✓ <em>No ads, no bundleware, no tracking</em>',
 'stats.stars':'GitHub Stars','stats.dls':'Total downloads','stats.boot':'cold start','stats.fixes':'fixes & hardening','stats.langs':'UI languages',
 'mobile.note':'Win 7 SP1+ · portable · MIT',
 'mock.theme':'dark theme','mock.speed':'total throughput',
 'mock.tab1':'All','mock.tab2':'Active','mock.tab3':'Done','mock.tab4':'Failed','mock.running':'running',
 'quota.wait':'quota recovery in','quota.done':'recovered · resuming',
 'story.kicker':'The Revival','story.title':'It froze in 2018.<br>We brought it <span class="grad-text">back</span>.',
 'story.desc':'Not a clone, not a wrapper — the original v1.8 was decompiled to recover its source, then welded back to today\u2019s MEGA through hundreds of hours of fixes.',
 'story.t1h':'The legend','story.t1p':'Created by Spanish developer <b>Andres Soli\u00f1o</b>, MegaDownloader was famous for being lightweight, stable and multi-threaded — the most-loved third-party MEGA downloader.',
 'story.t2h':'The freeze','story.t2p':'Upstream stopped at v1.8. Closed source, no word from the author.',
 'story.t3h':'The outage','story.t3p':'MEGA changed its link formats (<b>mega.nz/file, /folder</b>). The old build couldn\u2019t recognize new links and its core features died. Users went hunting for alternatives.',
 'story.t4h':'The revival','story.t4p':'v1.8 was decompiled, then fixed and refactored continuously: <b>200+ fixes and hardening</b>, semantic-versioned releases, every Issue answered.',
 'story.t5h':'The rebuild','story.t5p':'The interface was torn down and rebuilt: <b>a new workbench, two-step batch add, file-tree selection, task search, scheduled downloads</b>. Same engine, new shell — the biggest update since the revival.',
 'wb.kicker':'Workbench · 2.6',
 'wb.title':'Not a reskin.<br>It is a <span class="grad-text">rebuilt workbench</span>.',
 'wb.desc':'A 2018 Win7-grey shell cannot carry a 2026 queue. 2.6 rebuilds the entire UI layer — palette, type scale, spacing, icons, list, details panel — and it is still native WinForms. No framework swap, no web wrapper.',
 'wb.t1t':'One window, two steps','wb.t1d':'Paste links → pick files. No more input → preview → confirm dialogs stacked on each other.',
 'wb.t2t':'File tree · tri-state','wb.t2d':'Expand the shared-folder hierarchy, tick whole folders, half-selected states, invert a filter. Duplicates and dead links are skipped.',
 'wb.t3t':'Ctrl+F task search','wb.t3d':'Package names, filenames and relative paths at once; searched in the background, Esc clears it.',
 'wb.t4t':'Scheduled downloads','wb.t4d':'A daily window or a one-off appointment: crosses midnight, pauses at the end, survives restarts.',
 'wb.hint':'↑ Pick one — the window on the right is clickable',
 'wb.winTitle':'Workbench','wb.toolAdd':'Add links','wb.toolSearch':'Search','wb.toolSched':'Schedule',
 'wb.g1':'All tasks','wb.g2':'Downloading','wb.g3':'Completed','wb.g4':'Failed','wb.disk':'Free space',
 'wb.details':'Task details','wb.dName':'Name','wb.dSize':'Size','wb.dThreads':'Threads','wb.dSpeed':'Speed','wb.dState':'State',
 'wb.empty':'No matching tasks. Esc clears the search.',
 'wb.s1t':'Paste MEGA links','wb.s1d':'Paste several at once — file / folder / legacy #! / mega:// / ELC are all recognised.',
 'wb.s1note':'Parsing runs in the background and can be stopped','wb.s1btn':'Parse and pick files →',
 'wb.s2t':'Pick files','wb.s2d':'3 folders · 214 files · 6.8 GB total','wb.treeSearchPh':'Filter by name or path',
 'wb.s2btn':'Add to queue','wb.selUnit':'files','wb.freePrefix':'Target disk free','wb.treeEmpty':'No matching files.',
 'wb.searchPh':'Search tasks / files / paths',
 'wb.schTitle':'Scheduled downloads','wb.schMode':'Start mode','wb.daily':'Daily','wb.once':'Once','wb.schWin':'Window',
 'wb.recent':'Recently used','wb.nextRun':'Next start','wb.today':'today',
 'wb.pauseAtEnd':'Pause when the window ends','wb.midnight':'Crosses midnight','wb.persist':'Kept after restart',
 'wb.schNote':'The app must stay running; a quota wait is never bypassed by the schedule, and manually paused tasks are never resumed behind your back.',
 'wb.shot1':'Workbench','wb.shot2':'Two-step add · file tree','wb.shot3':'Settings · schedule',
 'boot.k':'cold start','boot.h':'From 5–7 seconds to <span class="grad-text">0.15–0.2 s</span>.',
 'boot.p':'2.6 moves the first-paint performance counters and WMI sampling to after the window is shown, so startup no longer waits on the OS. Double-click to usable is effectively instant.',
 'boot.c1':'measured locally','boot.c2':'no warm-up','boot.c3':'sampling after first paint','boot.faster':'about',
 'vs.rb':'Cold start','vs.nob':'✕ 5–7 s before the window appears','vs.yb':'0.15–0.2 s, effectively instant',
 'd.1h':'Adding links','d.1o':'Input → preview dialog → confirm dialog; going back loses your ticks','d.1n':'Two steps in one window; back keeps everything, unchanged links reuse the preview',
 'd.2h':'Importing 500 files','d.2o':'A control per row, every tick scans the whole table, the UI goes white','d.2n':'Virtual list + incremental counts + background build, cancellable halfway',
 'd.3h':'Everyday use','d.3o':'Find a task by eyeballing the list; night downloads mean staying up','d.3n':'Ctrl+F jumps straight there; the schedule starts itself',
 'feat.kicker':'Capability Matrix','feat.title':'Not just a downloader.<br>A whole <span class="grad-text">download experience</span>.',
 'feat.f1h':'Multi-threaded speed','feat.f1p':'Multiple concurrent connections per file with smart chunk scheduling — until your bandwidth is maxed out.',
 'feat.f2h':'Quota breaker + breakthrough','feat.f2p':'MEGA quota exhausted? Auto-pause with a countdown, then resume seamlessly. Can\u2019t wait? Enable “breakthrough mode” to hard-retry.',
 'feat.f2chip':'509 / -17 handled automatically',
 'feat.f3h':'Two-step batch add','feat.f3p':'Paste a batch of links, parse, then tick what you want — one window. Cancel adds nothing; back keeps your selection.',
 'feat.f3a':'Paste links','feat.f3b':'Pick files','feat.f3c':'Queue',
 'feat.f4h':'File tree · tri-state','feat.f4p':'Expand by folder, tick a whole directory, half-selected states, invert a filter — 500 files stay smooth.',
 'feat.f4skip':'skipped',
 'feat.f5h':'Ctrl+F task search','feat.f5p':'Package name, filename and relative path all match; debounced background search, Esc clears it.','feat.f5a':'hits',
 'feat.f6h':'Scheduled downloads','feat.f6p':'A daily window or a one-off appointment: crosses midnight, pauses at the end, survives restarts. Quota waits are not bypassed.',
 'feat.f7h':'Stream while downloading','feat.f7p':'Integrated VLC playback — start watching before the download finishes.',
 'feat.f8h':'Web remote control','feat.f8p':'Built-in HTTP server: push tasks and watch progress from your phone, with LAN access support.',
 'feat.f8chip':'CSRF + PBKDF2 hardened',
 'feat.f9h':'Resume · self-healing','feat.f9p':'Pause, resume, survive restarts. Failed tasks retry automatically; permanently dead ones are excluded.',
 'feat.f9a':'resumable state persisted',
 'feat.f10h':'Dark / light themes','feat.f10p':'Follows the system in real time, or set manually. <b>Try the 🌙 toggle in the top-right</b> — the app does exactly this.',
 'feat.f11h':'…and a whole toolbox','feat.f11p':'Steganography, ELC containers, auto-decompression — each one polished until it just works.',
 'feat.f11a':'🖼️ image/video steganography','feat.f11b':'🔐 ELC containers','feat.f11c':'🗜️ RAR/7Z/ZIP auto-extract','feat.f11d':'🌐 10 UI languages',
 'vs.kicker':'2018 → 2026','vs.title':'Compared to the old days,<br><span class="grad-text">it\u2019s stronger.</span>',
 'vs.old':'Original v1.8 (abandoned 2018)',
 'vs.r1':'New mega.nz/file · /folder links','vs.no1':'✕ not recognized','vs.y1':'fully supported',
 'vs.r2':'Adding links','vs.no2':'✕ one link at a time, dialogs on dialogs','vs.y2':'one window, two steps, batch + file tree',
 'vs.r3':'Task search','vs.no3':'✕ no search at all','vs.y3':'Ctrl+F on package / file / path',
 'vs.r4':'Scheduled downloads','vs.no4':'✕ babysit it yourself','vs.y4':'daily window / one-off appointment',
 'vs.r5':'Large batch import','vs.no5':'✕ confirm each item, UI goes white','vs.y5':'virtual list + background build, cancellable',
 'vs.r6':'When MEGA quota runs out','vs.no6':'✕ hangs, errors out','vs.y6':'auto-pause + countdown resume',
 'vs.r7':'UI themes','vs.no7':'system grey only','vs.y7':'2.6 workbench, dark / light follows system',
 'vs.r8':'Maintenance','vs.no8':'✕ abandoned','vs.y8':'200+ fixes, Issues answered',
 'dl.kicker':'Download','dl.title':'Two packages,<span class="grad-text">one program</span>.','dl.desc':'Get the latest stable release from GitHub. Download counts are checked every 5 minutes.',
 'dl.a1':'Portable <small data-asset-size="zip">.ZIP</small>','dl.a2':'Extract and run. No installer or admin rights needed.',
 'dl.avsafe':'extract and run','dl.noadmin':'no admin needed','dl.btn':'Download portable',
 'dl.b1':'Single file <small data-asset-size="exe">.EXE</small>','dl.b2':'Download and double-click — dependencies are embedded. The effortless option.',
 'dl.onedrop':'single-file launch','dl.noinstall':'no install','dl.btn2':'Download single-file',
 'dl.cfg':'Settings &amp; queue live in <b>%LOCALAPPDATA%\\MegaDownloader\\</b> — upgrading is just replacing the exe','dl.req':'Windows 7 SP1+ · .NET Framework 4.8 (built into Win10 1903+)',
 'cl.kicker':'Release highlights','cl.title':'Every release counts.',
 'cl.major':'major release','cl.h26':'The biggest UI rewrite since the revival — same engine, new shell.',
 'cl.a1':'Whole workbench rebuilt: unified dark / light palette, type scale and spacing; the toolbar promotes “Add links” and gains a schedule entry; sidebar groups get their own counts; the list gains a title, package count and empty state',
 'cl.a2':'Adding is now two steps in one window — no stacked preview dialog; going back keeps links, settings, search, expansion and ticks, and an unchanged link reuses the cached preview',
 'cl.a3':'Large batches: virtual list + debounced filtering + incremental counts, background build with a live processed counter and cancel; links copied mid-import are held for the next batch',
 'cl.a4':'Ctrl+F task search (package / filename / relative path) and scheduled downloads (daily window or one-off, crosses midnight, pauses at the end, survives restarts) land',
 'cl.a5':'Startup path rewritten: no synchronous performance counters or WMI on first paint, so cold start drops from 5–7 s to 0.15–0.2 s; icons align per-DPI, the details pane collapses, dark list backgrounds are complete, and all 10 language packs gained the new strings',
 'cl.b1':'Same-name downloads no longer corrupt each other; extraction no longer overwrites same-named originals',
 'cl.b2':'After an interrupted extraction or verification, the finished file is verified and reused',
 'cl.b3':'Short byte-range requests for streaming return the correct bytes',
 'cl.c1':'Slow downloads are no longer killed by the “stall watchdog” — if progress moves, it never aborts',
 'cl.c2':'RAR multi-volume fixed: legacy .r00/.r01 naming + password-protected volumes',
 'cl.c3':'Dark-mode menu bar reskinned; silent config loss cured at the root',
 'cl.d1':'Stability sweep: 36 audited fixes (crashes / silent data loss / deadlocks)',
 'cl.d2':'Friendly errors for shared-folder network failures (Issue #6)',
 'cl.d3':'Folder packages show their real MEGA names',
 'cl.more':'All releases & full changelog',
 'faq.kicker':'FAQ','faq.title':'Frequently asked.',
 'faq.q1':'My antivirus flags it.','faq.a1':'If your antivirus flags a download, check its warning and verify the source before running it. You can inspect the <a href="https://github.com/a1175815821/MegaDownloader-Revival/actions/workflows/build.yml" target="_blank" rel="noopener">build workflow</a>, try the ZIP package, or build from source yourself. A different package does not guarantee that a warning will disappear.',
 'faq.q2':'It says quota exceeded.','faq.a2':'MEGA limits free accounts and IPs. The app <b>auto-pauses and resumes after a countdown</b>; if you can\u2019t wait, enable “quota breakthrough mode” in Settings.',
 'faq.q3':'Do I need to reconfigure or rebuild my queue for 2.6?','faq.a3':'No. Settings and the queue still live in <b>%LOCALAPPDATA%\\MegaDownloader\\</b> — upgrading replaces the program files only, and your queue, resume points and language survive.',
 'faq.q4':'Does the schedule need the app running?','faq.a4':'Yes — 2.6 offers no wake timers or background service, so the app must stay open. The window crosses midnight, pauses at the end and survives a restart; manually paused tasks are not resumed, and a quota wait is not bypassed.',
 'faq.q5':'Is download speed limited?','faq.a5':'Not by the app — multi-threading will max out your bandwidth. Global or per-task speed caps are there when you want them.',
 'faq.q6':'Do old links still work? Admin rights?','faq.a6':'Legacy #! links, mega:// encrypted links and ELC containers are all supported. It\u2019s portable and needs no admin rights.',
 'faq.q7':'Mac / Linux version?','faq.a7':'No — it\u2019s WinForms, Windows only. Enable the built-in web interface to manage downloads from any device\u2019s browser.',
 'cta.kicker':'Ready?','cta.h':'Download the classic.<br><span class="grad-text">Again.</span>',
 'cta.sub':'2.6 is the biggest interface rewrite since the revival — this project has no marketing budget, so a Star is how it reaches more people.',
 'cta.btn1':'Get the latest','cta.btn2':'Give a Star',
 'cta.note':'Found a bug? File an Issue — many recent fixes started as user reports.',
 'foot.tag':'The classic MEGA downloader, back at full power. 2.6 rebuilt the whole workbench; the promise is unchanged — portable, multi-threaded, continuously fixed.',
 'foot.h1':'Project','foot.l1':'GitHub repo','foot.l2':'Download latest','foot.l3':'Report an issue',
 'foot.h2':'Site','foot.l4':'Site source','foot.l5':'Production site','foot.l6':'FAQ',
 'foot.legal1':'Unofficial project, not affiliated with MEGA Ltd. Derived from decompilation of third-party published software, solely to fix compatibility and restore usability.',
 'ticker':['v2.6 workbench ✓','two-step batch add ✓','file tree · tri-state ✓','Ctrl+F search ✓','scheduled downloads ✓','virtual list · no stalls ✓','mega.nz/file ✓','mega.nz/folder ✓','legacy #! links ✓','mega://enc2 ✓','ELC containers ✓','RAR / 7Z / ZIP auto-extract ✓','stream while downloading ✓','10 UI languages ✓','MIT open source ✓']
},
zh:{
 'quota.done':'已恢复，继续下载','quota.wait':'配额恢复倒计时',
 'ticker':['v2.6 工作台 ✓','两步批量添加 ✓','文件树三态勾选 ✓','Ctrl+F 搜索 ✓','定时下载 ✓','虚拟列表不卡顿 ✓','mega.nz/file ✓','mega.nz/folder ✓','旧版 #! 链接 ✓','mega://enc2 ✓','ELC 容器 ✓','RAR / 7Z / ZIP 自动解压 ✓','边下边播 ✓','10 种界面语言 ✓','MIT 开源 ✓']
}};

var langNow='zh';
try{var sl=localStorage.getItem('mdr-lang');if(sl==='en'||sl==='zh')langNow=sl;else if(!sl&&/^en/i.test(navigator.language))langNow='en';}catch(e){}
var langBtn=$('#langBtn');
/* 保存内联中文原件:zh 是页面默认文案,en 才走字典 */
$$('[data-i18n],[data-i18n-html]').forEach(function(el){el.setAttribute('data-orig',el.innerHTML)});
$$('[data-i18n-ph]').forEach(function(el){el.setAttribute('data-orig-ph',el.getAttribute('placeholder')||'')});
function t(k){return (I18N[langNow]&&I18N[langNow][k])||I18N.en[k]||''}
function applyLang(l){
  langNow=l; document.documentElement.lang=l==='en'?'en':'zh-CN';
  try{localStorage.setItem('mdr-lang',l)}catch(e){}
  langBtn.textContent=(l==='en')?'中':'EN';
  langBtn.setAttribute('aria-label',l==='en'?'切换到中文':'Switch to English');
  themeBtn.setAttribute('aria-label',l==='en'?'Toggle theme':'切换主题');
  $$('[data-i18n],[data-i18n-html]').forEach(function(el){
    if(l==='zh'){el.innerHTML=el.getAttribute('data-orig');return}
    var k=el.getAttribute('data-i18n')||el.getAttribute('data-i18n-html');
    var v=t(k);if(!v)return;
    if(el.hasAttribute('data-i18n-html'))el.innerHTML=v;else el.textContent=v;
  });
  $$('[data-i18n-ph]').forEach(function(el){
    var v=l==='zh'?el.getAttribute('data-orig-ph'):t(el.getAttribute('data-i18n-ph'));
    if(v)el.setAttribute('placeholder',v);
  });
  buildTicker();
  document.title=l==='en'?'MegaDownloader Revival 2.6 — a rebuilt workbench for the classic MEGA downloader':'MegaDownloader Revival 2.6 — 经典 MEGA 下载器，重造工作台';
  scramble($('.hero h1 .grad-text'));
  syncMockTheme();
  syncQuotaLabel();
  renderLive();
  wbSyncPanelTitle();
}
langBtn.addEventListener('click',function(){applyLang(langNow==='en'?'zh':'en')});

/* 跑马灯 */
function buildTicker(){
  var items=(I18N[langNow]&&I18N[langNow].ticker)||I18N.en.ticker;
  var html=items.map(function(s){return '<span><i>▸</i>'+s+'</span>'}).join('');
  var track=$('#tickerTrack'); if(track) track.innerHTML=html+html;
}

/* ========== 解密式文字动画(致敬 MEGA 加密) ========== */
var GLYPHS='█▓▒░</\\|#*+=01';
function scramble(el,forceText){
  if(!el)return;
  if(el._scToken)el._scToken.cancel=true;
  var token={cancel:false};el._scToken=token;
  var orig=forceText||el.textContent;
  if(reduceMotion||!orig){el.textContent=orig;return}
  var len=orig.length,frame=0,total=Math.max(16,Math.round(len*1.15));
  (function step(){
    if(token.cancel)return;
    frame++;
    var reveal=Math.floor((frame/total)*len),out='';
    for(var i=0;i<len;i++){
      var ch=orig[i];
      out+=(i<reveal||ch===' ')?ch:GLYPHS[(Math.random()*GLYPHS.length)|0];
    }
    el.textContent=out;
    if(frame<total)requestAnimationFrame(step);
    else{el.textContent=orig;if(el._scToken===token)el._scToken=null}
  })();
}

/* ========== 滚动:进度条 / 导航 / 时间线 / 水印视差 ========== */
var nav=$('#nav'),progress=$('#progress');
function onScroll(){
  var y=scrollY;
  nav.classList.toggle('scrolled',y>14);
  var h=document.documentElement.scrollHeight-innerHeight;
  progress.style.width=(h>0?(y/h*100):0)+'%';
  var tl=$('.timeline');
  if(tl){
    var r=tl.getBoundingClientRect();
    var p=Math.min(1,Math.max(0,(innerHeight*0.8-r.top)/r.height));
    tl.style.setProperty('--tlp',p.toFixed(3));
    $$('.tl-item',tl).forEach(function(it){
      it.classList.toggle('lit',it.getBoundingClientRect().top<innerHeight*0.75);
    });
  }
  $$('.watermark').forEach(function(w){
    var wr=w.getBoundingClientRect();
    var off=(wr.top+wr.height/2-innerHeight/2)*-0.09;
    w.style.transform='translate3d(0,'+off.toFixed(1)+'px,0)';
  });
}
addEventListener('scroll',onScroll,{passive:true});
addEventListener('resize',onScroll,{passive:true});

/* ========== 进场动画(IO 不可用时整页直接可见) ========== */
try{
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}});
  },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  document.documentElement.classList.add('js');
  $$('[data-reveal]').forEach(function(el){io.observe(el)});
}catch(e){
  document.documentElement.classList.remove('js');
}

/* ========== 数字滚动 ========== */
var fmt=function(n){return n>=1000?n.toLocaleString('en-US'):String(n)};
function countUp(el,val,animate){
  if(!el)return;
  var token=(el._countToken||0)+1;el._countToken=token;
  var suffix=el.getAttribute('data-suffix')||'';
  var dec=parseInt(el.getAttribute('data-decimals')||'0',10)||0;
  var paint=function(v){return (dec?v.toFixed(dec):fmt(Math.round(v)))+suffix};
  if(reduceMotion||animate===false){el.textContent=paint(val);return}
  var t0=null,dur=1300;
  function step(ts){
    if(el._countToken!==token)return;
    if(!t0)t0=ts;
    var p=Math.min((ts-t0)/dur,1),e=1-Math.pow(1-p,3);
    el.textContent=paint(val*e);
    if(p<1)requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
/* 未取得数据时保留 --，不把写死的快照冒充实时统计。 */
var LIVE={stars:null,dls:null,release:null},updated={stars:0,dls:0,release:0};
var counted=false;
function showCounts(){
  if(counted)return;counted=true;
  ['stars','dls'].forEach(function(k){if(validCount(LIVE[k]))countUp($('[data-count="'+k+'"]'),LIVE[k])});
  countUp($('[data-count="boot"]'),0.2);
  countUp($('[data-count="fixes"]'),200);
  countUp($('[data-count="langs"]'),10);
}
var statsEl=$('.stats');
if(statsEl&&typeof IntersectionObserver==='function'){
  var cio=new IntersectionObserver(function(es){
    if(es.some(function(e){return e.isIntersecting})){cio.disconnect();showCounts()}
  },{threshold:.4});
  cio.observe(statsEl);
}else{showCounts()}
function paintStars(n){
  var s='★ '+(n>=1000?(n/1000).toFixed(1)+'k':n);
  ['#ghStars','#ghStars2','#ghStars3'].forEach(function(id){var el=$(id);if(el)el.textContent=s});
}

/* ========== GitHub 同步：统计 5 分钟、稳定版元数据 6 小时；失败保留成功缓存 ========== */
var CACHE_KEY='mdr2-cache-v2',STATS_TTL=5*60*1000,RELEASE_TTL=6*3600*1000;
var API_ROOT='https://api.github.com/repos/'+REPO;
var syncing=false,syncFailed=false,lastAttempt=0,syncTimer=null;
function validCount(n){return typeof n==='number'&&Number.isSafeInteger(n)&&n>=0}
function validTime(n){return typeof n==='number'&&n>0&&n<=Date.now()}
function validRelease(r){
  return r&&typeof r.tag==='string'&&r.tag.length>0&&r.tag.length<=100&&
    typeof r.publishedAt==='string'&&Number.isFinite(Date.parse(r.publishedAt))&&Array.isArray(r.assets);
}
function dateLabel(value){
  var d=new Date(value);
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function renderLive(){
  if(!LIVE)return;
  ['stars','dls'].forEach(function(k){
    if(!validCount(LIVE[k]))return;
    if(k==='stars')paintStars(LIVE[k]);
    if(counted)countUp($('[data-count="'+k+'"]'),LIVE[k],false);
  });
  var r=LIVE.release;
  if(validRelease(r)){
    var date=dateLabel(r.publishedAt),en=langNow==='en';
    $$('[data-ver]').forEach(function(el){el.textContent=r.tag});
    var badge=$('[data-i18n="hero.badge"]');
    if(badge)badge.textContent=r.tag+(en?' stable · ':' 正式版 · ')+date+(en?' · actively maintained':' · 活跃维护中');
    var desc=$('[data-i18n-html="dl.desc"]');
    if(desc)desc.textContent=en?'Current stable release '+r.tag+' ('+date+'). Download counts are checked every 5 minutes.':'当前稳定版本 '+r.tag+'（'+date+'）。下载量每 5 分钟检查更新。';
    document.documentElement.style.setProperty('--lbl-new',JSON.stringify(r.tag+' · '));
    ['zip','exe'].forEach(function(kind){
      var asset=r.assets.find(function(a){
        return a&&typeof a.name==='string'&&a.name.toLowerCase().endsWith('.'+kind)&&
          validCount(a.size)&&typeof a.url==='string'&&a.url.indexOf('https://github.com/'+REPO+'/releases/download/')===0;
      });
      var size=$('[data-asset-size="'+kind+'"]'),link=$('[data-download="'+kind+'"]');
      if(size)size.textContent='.'+kind.toUpperCase()+(asset?' · ≈ '+(asset.size/1000000).toFixed(1)+' MB':'');
      if(link)link.href=asset?asset.url:'https://github.com/'+REPO+'/releases/latest';
    });
    var ld=$('script[type="application/ld+json"]');
    if(ld){try{var j=JSON.parse(ld.textContent);j.softwareVersion=r.tag.replace(/^v/,'');ld.textContent=JSON.stringify(j)}catch(e){}}
  }
  var status=$('#syncStatus');
  if(status){
    var hasStats=validCount(LIVE.stars)&&validCount(LIVE.dls),at=Math.min(updated.stars,updated.dls);
    status.textContent=langNow==='en'?
      (syncFailed?'GitHub update unavailable; '+(hasStats?'showing saved counts.':'counts unavailable.')+' Retrying every 5 minutes.':
        hasStats?'GitHub · updated '+new Date(at).toLocaleString('en-US')+' · checked every 5 minutes':'Fetching GitHub data…'):
      (syncFailed?'GitHub 更新暂不可用；'+(hasStats?'显示上次成功数据。':'暂无法获取统计。')+'每 5 分钟重试。':
        hasStats?'GitHub · 更新于 '+new Date(at).toLocaleString('zh-CN')+' · 每 5 分钟检查':'正在获取 GitHub 数据…');
    status.setAttribute('aria-busy',String(syncing));
  }
}
function readCache(){
  try{
    var c=JSON.parse(localStorage.getItem(CACHE_KEY));
    if(!c||c.version!==2||!c.data||!c.updated)return;
    ['stars','dls','release'].forEach(function(k){
      if(validTime(c.updated[k])&&(k==='release'?validRelease(c.data[k]):validCount(c.data[k]))){
        LIVE[k]=c.data[k];updated[k]=c.updated[k];
      }
    });
  }catch(e){}
}
function saveCache(){
  try{localStorage.setItem(CACHE_KEY,JSON.stringify({version:2,data:LIVE,updated:updated}))}catch(e){}
}
async function github(path){
  var controller=new AbortController(),timer=setTimeout(function(){controller.abort()},12000);
  try{
    var response=await fetch(API_ROOT+path,{signal:controller.signal,cache:'no-cache',headers:{Accept:'application/vnd.github+json'}});
    if(!response.ok)throw new Error('GitHub HTTP '+response.status);
    return {data:await response.json(),next:/<[^>]+>;\s*rel="next"/.test(response.headers.get('Link')||'')};
  }finally{clearTimeout(timer)}
}
async function totalDownloads(){
  var total=0,page=1,result;
  do{
    result=await github('/releases?per_page=100&page='+page++);
    if(!Array.isArray(result.data))throw new Error('Invalid releases');
    result.data.forEach(function(r){
      if(r.draft)return;
      if(!Array.isArray(r.assets))throw new Error('Invalid release assets');
      r.assets.forEach(function(a){
        if(!validCount(a.download_count))throw new Error('Invalid download count');
        total+=a.download_count;
      });
    });
  }while(result.next);
  if(!validCount(total))throw new Error('Invalid download total');
  return total;
}
async function latestRelease(){
  var r=(await github('/releases/latest')).data;
  if(r.draft||r.prerelease)throw new Error('Not a stable release');
  var release={tag:r.tag_name,publishedAt:r.published_at,assets:(r.assets||[]).map(function(a){
    return {name:a.name,size:a.size,url:a.browser_download_url};
  })};
  if(!validRelease(release))throw new Error('Invalid release metadata');
  return release;
}
function scheduleSync(delay){
  clearTimeout(syncTimer);syncTimer=setTimeout(sync,delay||STATS_TTL);
}
async function sync(){
  if(syncing)return;
  if(document.hidden){scheduleSync();return}
  if(Date.now()-lastAttempt<60000){scheduleSync(60000-(Date.now()-lastAttempt));return}
  var now=Date.now(),jobs=[];
  function refresh(key,ttl,fetchValue){
    if(updated[key]&&now-updated[key]<ttl)return;
    jobs.push(Promise.resolve().then(fetchValue).then(function(value){
      LIVE[key]=value;updated[key]=Date.now();saveCache();renderLive();
    }));
  }
  refresh('stars',STATS_TTL,async function(){
    var n=(await github('')).data.stargazers_count;
    if(!validCount(n))throw new Error('Invalid star count');
    return n;
  });
  refresh('dls',STATS_TTL,totalDownloads);
  refresh('release',RELEASE_TTL,latestRelease);
  if(!jobs.length){
    var due=Math.min(updated.stars+STATS_TTL,updated.dls+STATS_TTL,updated.release+RELEASE_TTL);
    scheduleSync(Math.max(1000,due-now));return;
  }
  syncing=true;lastAttempt=now;renderLive();
  var results=await Promise.allSettled(jobs);
  syncFailed=results.some(function(r){return r.status==='rejected'});
  syncing=false;renderLive();scheduleSync();
}
readCache();renderLive();sync();
addEventListener('focus',sync);
addEventListener('online',sync);
document.addEventListener('visibilitychange',function(){if(!document.hidden)sync()});

/* ========== 粒子网络 + 下载光束 ========== */
var cv=$('#net'),ctx=cv?cv.getContext('2d'):null;
if(ctx){
var DPR=Math.min(devicePixelRatio||1,2),W=0,H=0,pts=[],beams=[],mouse={x:-9e3,y:-9e3};
function sizeNet(){
  W=innerWidth;H=innerHeight;cv.width=W*DPR;cv.height=H*DPR;cv.style.width=W+'px';cv.style.height=H+'px';
  ctx.setTransform(DPR,0,0,DPR,0,0);
  var n=Math.min(84,Math.round(W*H/17000));
  pts=[];for(var i=0;i<n;i++)pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.34,vy:(Math.random()-.5)*.34,r:Math.random()*1.5+.7,c:Math.random()<.72?0:1});
}
function drawNet(){
  ctx.clearRect(0,0,W,H);
  for(var i=0;i<pts.length;i++){
    var p=pts[i];
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<-20)p.x=W+20;if(p.x>W+20)p.x=-20;if(p.y<-20)p.y=H+20;if(p.y>H+20)p.y=-20;
    var dm=Math.hypot(p.x-mouse.x,p.y-mouse.y);
    if(dm<130){p.x+=(mouse.x-p.x)*.0022;p.y+=(mouse.y-p.y)*.0022}
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.2832);
    ctx.fillStyle=p.c?'rgba(139,92,255,.55)':'rgba(255,70,85,.5)';ctx.fill();
  }
  for(var a=0;a<pts.length;a++){
    for(var b=a+1;b<pts.length;b++){
      var dx=pts[a].x-pts[b].x,dy=pts[a].y-pts[b].y,d2=dx*dx+dy*dy;
      if(d2<16900){
        ctx.strokeStyle='rgba(160,120,255,'+(0.14*(1-d2/16900))+')';
        ctx.beginPath();ctx.moveTo(pts[a].x,pts[a].y);ctx.lineTo(pts[b].x,pts[b].y);ctx.stroke();
      }
    }
    var mx=pts[a].x-mouse.x,my=pts[a].y-mouse.y,md2=mx*mx+my*my;
    if(md2<25600){
      ctx.strokeStyle='rgba(255,70,85,'+(0.20*(1-md2/25600))+')';
      ctx.beginPath();ctx.moveTo(pts[a].x,pts[a].y);ctx.lineTo(mouse.x,mouse.y);ctx.stroke();
    }
  }
  /* 下载光束:偶发划过的“数据流星” */
  if(beams.length<4&&Math.random()<.008){
    var ang=(Math.random()<.5?-1:1)*(Math.PI/5)+(Math.random()-.5)*.3;
    beams.push({x:Math.random()*W,y:Math.random()*H*.8,a:ang,sp:11+Math.random()*8,life:1});
  }
  if(beams.length){
    ctx.save();ctx.globalCompositeOperation='lighter';
    for(var k=beams.length-1;k>=0;k--){
      var bm=beams[k];
      bm.x+=Math.cos(bm.a)*bm.sp;bm.y+=Math.sin(bm.a)*bm.sp;bm.life-=.014;
      if(bm.life<=0||bm.x<-140||bm.x>W+140||bm.y>H+140){beams.splice(k,1);continue}
      var tail=95*bm.life;
      var tx=bm.x-Math.cos(bm.a)*tail,ty=bm.y-Math.sin(bm.a)*tail;
      var g=ctx.createLinearGradient(bm.x,bm.y,tx,ty);
      g.addColorStop(0,'rgba(255,120,90,'+(0.85*bm.life)+')');
      g.addColorStop(.35,'rgba(255,70,85,'+(0.4*bm.life)+')');
      g.addColorStop(1,'rgba(255,70,85,0)');
      ctx.strokeStyle=g;ctx.lineWidth=2;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(bm.x,bm.y);ctx.lineTo(tx,ty);ctx.stroke();
      ctx.beginPath();ctx.arc(bm.x,bm.y,2.1,0,6.2832);
      ctx.fillStyle='rgba(255,200,150,'+(0.9*bm.life)+')';ctx.fill();
    }
    ctx.restore();
  }
}
sizeNet();addEventListener('resize',sizeNet);
addEventListener('pointermove',function(e){mouse.x=e.clientX;mouse.y=e.clientY},{passive:true});
addEventListener('pointerleave',function(){mouse.x=-9e3;mouse.y=-9e3});
if(reduceMotion){drawNet()}else{
  (function loop(){if(!document.hidden)drawNet();requestAnimationFrame(loop)})();
}
}

/* ========== 光标光晕(与粒子网络同一 rAF 节奏) ========== */
var glowEl=$('#glow'),gx=innerWidth/2,gy=innerHeight/2,gtx=gx,gty=gy,glowOn=false;
if(glowEl&&finePointer&&!reduceMotion){
  addEventListener('pointermove',function(e){gtx=e.clientX;gty=e.clientY;if(!glowOn){glowOn=true;glowEl.classList.add('on')}},{passive:true});
  (function glowLoop(){
    gx+=(gtx-gx)*.11;gy+=(gty-gy)*.11;
    glowEl.style.transform='translate('+gx.toFixed(1)+'px,'+gy.toFixed(1)+'px) translate(-50%,-50%)';
    requestAnimationFrame(glowLoop);
  })();
}

/* ========== 仿真窗口:进度 / 速度 / 配额 / 3D 倾斜 ========== */
var spark=$('#spark'),sctx=spark?spark.getContext('2d'):null;
var SPARK_H=52,SPARK_W=0;
function fitSpark(){
  if(!spark)return;
  var dpr=Math.min(devicePixelRatio||1,2);
  SPARK_W=Math.max(120,Math.round(spark.clientWidth||320));
  spark.width=Math.round(SPARK_W*dpr);
  spark.height=Math.round(SPARK_H*dpr);
  if(sctx)sctx.setTransform(dpr,0,0,dpr,0,0);
}
var S=[3,4,3.6,5,4.2,6,5.5,7,6.4,8,7.2,9,8.4,10,9.1,11,10,12,11,13,12.2,14,13,15,14,16,15,17,16,18];
var rows=$$('.row').map(function(r){return{el:r,bar:$('[data-bar]',r),pct:$('[data-pct]',r),spd:$('[data-spd]',r),rate:parseFloat(r.getAttribute('data-rate')),base:parseFloat(r.getAttribute('data-base')),p:Math.random()*60}});
var quota=$('#quotaChip'),qTime=$('#quotaTime'),qIco=$('#quotaIco'),qLabelEl=$('#quotaLabel');
var qSec=287,qMode='wait';
function fmtQ(s){var m=Math.floor(s/60),ss=Math.floor(s%60);return (m<10?'0':'')+m+':'+(ss<10?'0':'')+ss}
function syncQuotaLabel(){
  if(!qLabelEl)return;
  var key=(qMode==='resume')?'quota.done':'quota.wait';
  qLabelEl.setAttribute('data-i18n',key);
  qLabelEl.textContent=t(key)||(key==='quota.done'?'已恢复，继续下载':'配额恢复倒计时');
}
function drawSpark(){
  if(!sctx)return;
  if(!SPARK_W)fitSpark();
  var w=SPARK_W||320,h=SPARK_H;
  sctx.clearRect(0,0,w,h);
  var mx=20;
  var grad=sctx.createLinearGradient(0,0,w,0);
  grad.addColorStop(0,'#ff4655');grad.addColorStop(1,'#ffc53d');
  sctx.beginPath();
  for(var i=0;i<S.length;i++){
    var x=i/(S.length-1)*w, y=h-4-(S[i]/(mx+6))*(h-10);
    i?sctx.lineTo(x,y):sctx.moveTo(x,y);
  }
  sctx.strokeStyle=grad;sctx.lineWidth=2;sctx.lineJoin='round';sctx.stroke();
  sctx.lineTo(w,h);sctx.lineTo(0,h);sctx.closePath();
  var fg=sctx.createLinearGradient(0,0,0,h);
  fg.addColorStop(0,'rgba(255,70,85,.22)');fg.addColorStop(1,'rgba(255,70,85,0)');
  sctx.fillStyle=fg;sctx.fill();
  var li=S.length-1,ly=h-4-(S[li]/(mx+6))*(h-10);
  sctx.beginPath();sctx.arc(w-2,ly,3,0,6.2832);sctx.fillStyle='#ffc53d';sctx.fill();
}
function miniGraph(){
  var c=$('#miniGraph');if(!c)return;var g2=c.getContext('2d');if(!g2)return;
  var w=0,h=72,phase=0;
  function fit(){
    var dpr=Math.min(devicePixelRatio||1,2);
    w=Math.max(120,Math.round(c.clientWidth||320));
    c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);
    g2.setTransform(dpr,0,0,dpr,0,0);
  }
  fit();
  function draw(){
    g2.clearRect(0,0,w,h);phase+=reduceMotion?0:.05;
    for(var k=0;k<3;k++){
      g2.beginPath();
      for(var x=0;x<=w;x+=4){
        var y=h/2+Math.sin(x*.021+phase+k*1.9)*(10+k*7)*Math.sin(phase*.6+k)*.9+Math.sin(x*.05-phase*1.3+k*3)*4;
        x?g2.lineTo(x,y):g2.moveTo(x,y);
      }
      g2.strokeStyle=k===0?'rgba(255,70,85,.9)':k===1?'rgba(255,138,61,.55)':'rgba(139,92,255,.4)';
      g2.lineWidth=k===0?2:1.3;g2.stroke();
    }
  }
  addEventListener('resize',function(){fit();if(reduceMotion)draw()});
  if(reduceMotion){draw()}else{
    var visible=false,raf=null;
    function loop(){if(!visible){raf=null;return}draw();raf=requestAnimationFrame(loop)}
    if(typeof IntersectionObserver!=='function'){draw();return}
    var vio=new IntersectionObserver(function(es){
      es.forEach(function(e){
        visible=e.isIntersecting;
        if(visible&&raf===null)raf=requestAnimationFrame(loop);
      });
    },{threshold:.12});
    vio.observe(c);
  }
}
function tick(ts){
  if(document.hidden){tick.last=ts;requestAnimationFrame(tick);return}
  var dt=Math.min((ts-(tick.last||ts))/1000,.05);tick.last=ts;
  var total=0;
  rows.forEach(function(r){
    if(!reduceMotion){
      r.p+=r.rate*dt*7;
      if(r.p>=100){r.p=Math.random()*6}
    }else{r.p=66+r.rate*5}
    var pc=r.p;
    if(r.bar)r.bar.style.width=pc+'%';
    if(r.pct)r.pct.textContent=Math.round(pc)+'%';
    var jit=1+Math.sin(ts/470+r.rate*9)*.06+(Math.random()-.5)*.015;
    var s=r.base*jit*(0.8+pc/250);
    if(r.spd)r.spd.textContent=s.toFixed(1)+' MB/s';
    total+=s;
  });
  var tt=$$('[data-total]');
  if(tt.length){var tv=total.toFixed(1)+' MB/s';tt.forEach(function(el){el.textContent=tv})}
  if(sctx){
    if(!reduceMotion){
      spark.t=(spark.t||0)+dt;
      if(spark.t>.09){spark.t=0;S.push(Math.max(2,Math.min(19,total/2.1)));S.shift();drawSpark()}
    }
  }
  if(quota){
    qSec-=dt;
    if(qMode==='wait'){
      if(qSec<=0){qMode='resume';quota.classList.add('resume');qIco.textContent='🚀';qSec=4;syncQuotaLabel();}
    }else{
      if(qSec<=0){qMode='wait';quota.classList.remove('resume');qIco.textContent='⏳';qSec=287;syncQuotaLabel();}
    }
    if(qTime)qTime.textContent=qMode==='wait'?fmtQ(Math.max(qSec,0)):'';
  }
  requestAnimationFrame(tick);
}
if(!reduceMotion){requestAnimationFrame(tick)}else{
  rows.forEach(function(r){if(r.bar)r.bar.style.width='66%';if(r.pct)r.pct.textContent='66%';if(r.spd)r.spd.textContent=r.base.toFixed(1)+' MB/s'});
  if(qTime)qTime.textContent=fmtQ(179);drawSpark();
}
miniGraph();

/* 3D 倾斜 + 玻璃反光 */
var mock=$('.mock'),mockCol=$('.mock-col');
if(mock&&mockCol&&finePointer&&!reduceMotion){
  mockCol.addEventListener('pointermove',function(e){
    var r=mock.getBoundingClientRect();
    var px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
    mock.style.setProperty('--ry',((px-.5)*9).toFixed(2)+'deg');
    mock.style.setProperty('--rx',((.5-py)*6.5).toFixed(2)+'deg');
    mock.style.setProperty('--gx',(px*100).toFixed(1)+'%');
    mock.style.setProperty('--gy',(py*100).toFixed(1)+'%');
  },{passive:true});
  mockCol.addEventListener('pointerleave',function(){
    mock.style.setProperty('--ry','0deg');mock.style.setProperty('--rx','0deg');
  });
}

/* ========== 磁吸按钮 ========== */
if(finePointer&&!reduceMotion){
  $$('.btn').forEach(function(b){
    b.addEventListener('pointermove',function(e){
      var r=b.getBoundingClientRect();
      var dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);
      b.style.transform='translate('+(dx*.14).toFixed(1)+'px,'+(dy*.22).toFixed(1)+'px)';
    },{passive:true});
    b.addEventListener('pointerleave',function(){b.style.transform=''});
  });
}

/* ========== Bento 聚光灯 ========== */
$$('.cell').forEach(function(c){
  c.addEventListener('pointermove',function(e){
    var b=c.getBoundingClientRect();
    c.style.setProperty('--mx',(e.clientX-b.left)+'px');
    c.style.setProperty('--my',(e.clientY-b.top)+'px');
  },{passive:true});
});

/* ========== 工作台 2.6 演示(两步添加 / 文件树 / 搜索 / 定时) ========== */
var wbWin=$('.wb-win'),wbPanelTitle=$('#wbPanelTitle'),wbView='add';
var WB_TITLE={zh:{add:'粘贴 MEGA 链接',pick:'选择文件',sched:'定时下载'},en:{add:'Paste MEGA links',pick:'Pick files',sched:'Scheduled downloads'}};
if(wbPanelTitle)wbPanelTitle.removeAttribute('data-i18n');
function wbSyncPanelTitle(){
  if(!wbPanelTitle)return;
  var l=(langNow==='en')?'en':'zh';
  wbPanelTitle.textContent=WB_TITLE[l][wbView]||'';
}
function wbShowView(v){
  wbView=v;
  $$('.wb-view').forEach(function(el){el.classList.toggle('on',el.getAttribute('data-view')===v)});
  if(wbWin){
    wbWin.setAttribute('data-step',v==='pick'?'2':'1');
    var dots=$$('.wb-steps i');
    if(dots[0])dots[0].classList.add('on');
    if(dots[1])dots[1].classList.toggle('on',v==='pick');
  }
  wbSyncPanelTitle();
}
function wbSetMode(mode){
  if(!wbWin)return;
  wbWin.setAttribute('data-mode',mode);
  $$('.wb-tab').forEach(function(b){
    var on=b.getAttribute('data-wb-mode')===mode;
    b.classList.toggle('is-on',on);b.setAttribute('aria-selected',on?'true':'false');
  });
  if(mode==='flow')wbShowView('add');
  else if(mode==='tree')wbShowView('pick');
  else if(mode==='schedule')wbShowView('sched');
  else if(mode==='search'){
    var inp=$('#wbSearch');
    if(inp){wbFilterTasks();try{inp.focus({preventScroll:true})}catch(e){inp.focus()}}
  }
  if(mode==='list')wbPanelTitle&&(wbPanelTitle.textContent='');
}
$$('.wb-tab').forEach(function(b){
  b.addEventListener('click',function(){wbSetMode(b.getAttribute('data-wb-mode'))});
});
$('#wbNext')&&$('#wbNext').addEventListener('click',function(){wbShowView('pick')});
$('#wbPanelClose')&&$('#wbPanelClose').addEventListener('click',function(){wbSetMode('list')});
$('#wbPanelClose')&&$('#wbPanelClose').addEventListener('keydown',function(e){
  if(e.key==='Enter'||e.key===' '){e.preventDefault();wbSetMode('list')}
});

/* 文件树:三态勾选 + 统计 */
var wbTree=$('#wbTree');
function wbCb(row){return $('.cb',row)}
function wbSetCb(row,state){
  var cb=wbCb(row);if(!cb)return;
  cb.classList.toggle('on',state==='on');
  cb.classList.toggle('part',state==='part');
  cb.checked=state==='on';
  cb.indeterminate=state==='part';
}
function wbKids(dir){
  var out=[],n=dir.nextElementSibling;
  while(n&&!(n.classList&&n.classList.contains('dir'))){
    if(n.classList&&n.classList.contains('file'))out.push(n);
    n=n.nextElementSibling;
  }
  return out;
}
function wbVisible(row){return !row.classList.contains('hide')}
function wbFormatSize(v){return (Math.round(v*100)/100).toFixed(2).replace(/\.?0+$/,'')+' GB'}
function wbRefreshTree(){
  if(!wbTree)return;
  $$('.tr.dir',wbTree).forEach(function(dir){
    var kids=wbKids(dir),on=0;
    kids.forEach(function(k){var c=wbCb(k);if(c&&c.classList.contains('on'))on++});
    wbSetCb(dir,on===0?'off':(on===kids.length?'on':'part'));
  });
  var count=0,size=0;
  $$('.tr.file',wbTree).forEach(function(f){
    var c=wbCb(f);
    if(c&&c.classList.contains('on')){count++;size+=parseFloat(f.getAttribute('data-size')||'0')}
  });
  var cEl=$('[data-pick-count]'),sEl=$('[data-pick-size]');
  if(cEl)cEl.textContent=String(count);
  if(sEl)sEl.textContent=wbFormatSize(size);
}
if(wbTree){
  wbTree.addEventListener('click',function(e){
    var row=e.target.closest?e.target.closest('.tr'):null;
    if(!row||e.target===wbCb(row))return;
    wbCb(row).click();
  });
  wbTree.addEventListener('change',function(e){
    var row=e.target.closest?e.target.closest('.tr'):null;
    if(!row||e.target!==wbCb(row))return;
    if(row.classList.contains('dir')){
      var kids=wbKids(row),checked=e.target.checked;
      kids.forEach(function(k){wbSetCb(k,checked?'on':'off')});
    }else{
      wbSetCb(row,e.target.checked?'on':'off');
    }
    wbRefreshTree();
  });
  var treeSearch=$('#wbTreeSearch');
  treeSearch&&treeSearch.addEventListener('input',function(){
    var q=this.value.trim().toLowerCase(),files=$$('.tr.file',wbTree),visible=0;
    files.forEach(function(f){
      var dir=f.previousElementSibling;
      while(dir&&!dir.classList.contains('dir'))dir=dir.previousElementSibling;
      var name=$('.tx',f),parent=dir&&$('.tx',dir);
      var path=(parent?parent.textContent+'/':'')+(name?name.textContent:'');
      var hit=!q||path.toLowerCase().indexOf(q.replace(/\\/g,'/'))>-1;
      f.classList.toggle('hide',!hit);if(hit)visible++;
    });
    $$('.tr.dir',wbTree).forEach(function(dir){
      var kids=wbKids(dir),any=kids.some(wbVisible),self=!q||dir.textContent.toLowerCase().indexOf(q)>-1;
      if(q&&self&&!any){kids.forEach(function(k){k.classList.remove('hide')});visible+=kids.length}
      dir.classList.toggle('hide',q&&!self&&!any);
    });
    wbTree.classList.toggle('empty',Boolean(q)&&visible===0);
  });
  wbRefreshTree();
}
wbShowView('add');
$('#wbConfirm')&&$('#wbConfirm').addEventListener('click',function(){
  var n=$$('.tr.file',wbTree||document).filter(function(f){
    var c=wbCb(f);return c&&c.classList.contains('on');
  }).length;
  var el=$('#wbToast');if(!el)return;
  el.textContent=(langNow==='en'?'Added to queue':'已加入下载队列')+' · '+n+' '+(langNow==='en'?'files':'个文件');
  el.classList.add('on');
  clearTimeout(el._t);el._t=setTimeout(function(){el.classList.remove('on')},2600);
});

/* 任务搜索 */
var wbSearchInput=$('#wbSearch');
function wbFilterTasks(){
  if(!wbSearchInput)return;
  var q=wbSearchInput.value.trim().toLowerCase(),rows=$$('.wb-row'),shown=0;
  rows.forEach(function(r){
    var hay=((r.getAttribute('data-name')||'')+' '+r.textContent).toLowerCase();
    var hit=!q||hay.indexOf(q)>-1;
    r.classList.toggle('hide',!hit);if(hit)shown++;
  });
  var list=$('#wbList');
  if(list)list.classList.toggle('empty',shown===0);
}
if(wbSearchInput){
  wbSearchInput.addEventListener('input',wbFilterTasks);
  wbSearchInput.addEventListener('keydown',function(e){
    if(e.key==='Escape'){this.value='';wbFilterTasks();this.blur()}
  });
}

/* 截图槽位:逐张验证并跟随网站主题,缺少当前主题时使用另一张 */
var shotStates;
function syncShots(){
  if(!shotStates)return;
  var theme=document.documentElement.getAttribute('data-theme')==='light'?1:0,shown=0;
  shotStates.forEach(function(s){
    var src=s.loaded[theme]?s.urls[theme]:(s.loaded[1-theme]?s.urls[1-theme]:null);
    s.fig.hidden=!src;
    if(src){if(s.img.getAttribute('src')!==src)s.img.setAttribute('src',src);shown++}
  });
  var host=$('[data-shots]');if(host)host.hidden=shown===0;
}
(function(){
  var host=$('[data-shots]'),figs=$$('.shot',host||document);
  if(!host||!figs.length)return;
  shotStates=[];
  figs.forEach(function(fig){
    var state={fig:fig,img:$('img',fig),urls:(fig.getAttribute('data-shot')||'').split(',').map(function(s){return s.trim()}),loaded:[false,false]};
    if(!state.img)return;
    shotStates.push(state);
    state.urls.slice(0,2).forEach(function(url,i){
      if(!url)return;
      var probe=new Image();
      probe.onload=function(){state.loaded[i]=true;syncShots()};
      probe.onerror=function(){state.loaded[i]=false;syncShots()};
      probe.src=url;
    });
  });
  syncShots();
})();

/* ========== FAQ 手风琴 ========== */
$$('.faq-item').forEach(function(it,i){
  var q=$('.faq-q',it),a=$('.faq-a',it);
  if(a){a.id='faq-a-'+(i+1);a.setAttribute('role','region');q.setAttribute('aria-controls',a.id)}
  q.setAttribute('aria-expanded','false');
  q.addEventListener('click',function(){
    var open=it.classList.contains('open');
    $$('.faq-item.open').forEach(function(o){o.classList.remove('open');$('.faq-q',o).setAttribute('aria-expanded','false')});
    if(!open){it.classList.add('open');q.setAttribute('aria-expanded','true')}
  });
});

/* ========== 启动 ========== */
applyLang(langNow);
fitSpark();
drawSpark();
onScroll();
addEventListener('resize',function(){fitSpark();drawSpark()});
/* 幕布掀开后再播一次解码(仅中文首屏;英文下 forceText 会把中文快照写回去) */
if(!reduceMotion)setTimeout(function(){
  var el=$('.hero h1 .grad-text');
  if(el)scramble(el,langNow==='zh'?(el.getAttribute('data-orig')||undefined):undefined);
},680);
})();
