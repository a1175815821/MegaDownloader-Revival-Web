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
  if(persist!==false){try{localStorage.setItem('mdr-theme',t)}catch(e){}}
  var m=$('meta[name="theme-color"]'); if(m) m.setAttribute('content',t==='dark'?'#05060b':'#f4f5fa');
  syncMockTheme();
}
var savedTheme=null; try{savedTheme=localStorage.getItem('mdr-theme')}catch(e){}
setTheme(savedTheme||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'));
themeBtn.addEventListener('click',function(){
  setTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark');
});
/* 跟随系统实时切换(未手动指定过主题时) */
var mqLight=matchMedia('(prefers-color-scheme: light)');
if(!savedTheme&&mqLight.addEventListener){
  mqLight.addEventListener('change',function(e){setTheme(e.matches?'light':'dark',false)});
}

/* ========== 双语 ========== */
var I18N={
en:{
 'nav.story':'The Revival','nav.features':'Capabilities','nav.vs':'vs v1.8','nav.download':'Download','nav.changelog':'Changelog','nav.faq':'FAQ','nav.star':'Star',
 'hero.badge':'v2.5.8 stable · 2026-10-22 · actively maintained',
 'hero.h1a':'The classic MEGA downloader,','hero.h1b':'back at full power.',
 'hero.sub':'Built for the <b>new mega.nz links</b> — multi-threaded speed, resume, automatic quota recovery. A <b>single portable executable</b> that runs on Windows 7 SP1+. MIT open source.',
 'hero.cta1':'Free download','hero.cta2':'GitHub Star',
 'hero.note':'✓ Free &amp; open source&nbsp;&nbsp;✓ No admin rights&nbsp;&nbsp;✓ <em>No ads, no bundleware, no tracking</em>',
 'stats.stars':'GitHub Stars','stats.dls':'Total downloads','stats.fixes':'fixes & hardening','stats.langs':'UI languages',
 'mock.theme':'dark theme','mock.speed':'total throughput',
 'mock.tab1':'All','mock.tab2':'Active','mock.tab3':'Done','mock.running':'running',
 'quota.wait':'quota recovery in','quota.done':'recovered · resuming',
 'story.kicker':'The Revival','story.title':'It froze in 2018.<br>We brought it <span class="grad-text">back</span>.',
 'story.desc':'Not a clone, not a wrapper — the original v1.8 was decompiled to recover its source, then welded back to today\u2019s MEGA through hundreds of hours of fixes.',
 'story.t1h':'The legend','story.t1p':'Created by Spanish developer <b>Andres Soli\u00f1o</b>, MegaDownloader was famous for being lightweight, stable and multi-threaded — the most-loved third-party MEGA downloader.',
 'story.t2h':'The freeze','story.t2p':'Upstream stopped at v1.8. Closed source, no word from the author.',
 'story.t3h':'The outage','story.t3p':'MEGA changed its link formats (<b>mega.nz/file, /folder</b>). The old build couldn\u2019t recognize new links and its core features died. Users went hunting for alternatives.',
 'story.t4h':'The revival','story.t4p':'v1.8 was decompiled, then fixed and refactored continuously: <b>200+ fixes and hardening</b>, semantic-versioned releases, every Issue answered. That\u2019s the project behind the Star you\u2019re about to click.',
 'feat.kicker':'Capability Matrix','feat.title':'Not just a downloader.<br>A whole <span class="grad-text">download experience</span>.',
 'feat.f1h':'Multi-threaded speed','feat.f1p':'Multiple concurrent connections per file with smart chunk scheduling — until your bandwidth is maxed out.',
 'feat.f2h':'Quota breaker + breakthrough','feat.f2p':'MEGA quota exhausted? Auto-pause with a countdown, then resume seamlessly. Can\u2019t wait? Enable “breakthrough mode” to hard-retry.',
 'feat.f2chip':'509 / -17 handled automatically',
 'feat.f3h':'Whole-folder downloads','feat.f3p':'Recursively parse an entire shared folder and tick exactly what you need, like a file manager.',
 'feat.f3skip':'skipped',
 'feat.f4h':'Stream while downloading','feat.f4p':'Integrated VLC playback — start watching before the download finishes.',
 'feat.f5h':'Web remote control','feat.f5p':'Built-in HTTP server: push tasks and watch progress from your phone, with LAN access support.',
 'feat.f5chip':'CSRF + PBKDF2 hardened',
 'feat.f6h':'Resume · self-healing','feat.f6p':'Pause, resume, survive restarts. Failed tasks retry automatically; permanently dead ones are excluded.',
 'feat.f6a':'resumable state persisted',
 'feat.f7h':'Dark / light themes','feat.f7p':'Follows the system in real time, or set manually. <b>Try the 🌙 toggle in the top-right</b> — the app does exactly this.',
 'feat.f8h':'…and a whole toolbox','feat.f8p':'Steganography, ELC containers, auto-decompression — each one polished until it just works.',
 'feat.f8a':'🖼️ image/video steganography','feat.f8b':'🔐 ELC containers','feat.f8c':'🗜️ RAR/7Z/ZIP auto-extract','feat.f8d':'🌐 10 UI languages',
 'vs.kicker':'2018 → 2026','vs.title':'Compared to the old days,<br><span class="grad-text">it\u2019s stronger.</span>',
 'vs.old':'Original v1.8 (abandoned 2018)',
 'vs.r1':'New mega.nz/file · /folder links','vs.no1':'✕ not recognized','vs.y1':'fully supported',
 'vs.r2':'When MEGA quota runs out','vs.no2':'✕ hangs, errors out','vs.y2':'auto-pause + countdown resume',
 'vs.r3':'Failed tasks','vs.no3':'✕ manual retry only','vs.y3':'scheduled self-healing',
 'vs.r4':'UI themes','vs.no4':'system grey only','vs.y4':'dark / light, follows system',
 'vs.r5':'Stability','vs.y5':'200+ crash / data-loss / security fixes',
 'vs.r6':'Maintenance','vs.no6':'✕ abandoned','vs.y6':'active, Issues answered',
 'dl.kicker':'Download','dl.title':'Two packages,<span class="grad-text">one program</span>.','dl.desc':'Current release <b>v2.5.8</b> (2026-10-22). Version &amp; download counts sync every 6 hours.',
 'dl.a1':'Portable <small>.ZIP · ≈ 10.6 MB</small>','dl.a2':'Extract anywhere and run. No installer, no admin rights — also the pick if your antivirus flags the single-file build.',
 'dl.avsafe':'AV-false-positive safe','dl.noadmin':'no admin needed','dl.btn':'Download portable',
 'dl.b1':'Single file <small>.EXE · ≈ 12.3 MB</small>','dl.b2':'Download and double-click — all 15 dependency DLLs are embedded. The effortless option.',
 'dl.onedrop':'single-file launch','dl.noinstall':'no install','dl.btn2':'Download single-file',
 'dl.cfg':'Settings &amp; queue live in <b>%LOCALAPPDATA%\\MegaDownloader\\</b> — upgrading is just replacing the exe','dl.req':'Windows 7 SP1+ · .NET Framework 4.8 (built into Win10 1903+)',
 'cl.kicker':'Changelog','cl.title':'Every release counts.',
 'cl.a1':'Slow downloads no longer killed by the “stall watchdog” — if progress moves, it never aborts','cl.a2':'RAR multi-volume fixed: legacy .r00/.r01 naming + password-protected volumes','cl.a3':'Dark-mode menu bar reskinned; silent config-loss cured at the root',
 'cl.b1':'Stability sweep: 36 audited fixes (crashes / silent data loss / deadlocks)','cl.b2':'Friendly errors for shared-folder network failures (Issue #6)','cl.b3':'Folder packages show their real MEGA names',
 'cl.c1':'Quota breakthrough mode returns: no breaker, hard retry on the self-heal cycle','cl.c2':'Loose multi-file links auto-group into a “New package” folder','cl.c3':'True-name write-back, empty-dir cleanup on delete',
 'cl.more':'All releases & full changelog',
 'faq.kicker':'FAQ','faq.title':'Frequently asked.',
 'faq.q1':'My antivirus flags it.','faq.a1':'The single-file build is packed with <b>mpress</b>, which a few antivirus products false-positive on. Use the zip build or compile from source — every official Release is built automatically from source by GitHub Actions.',
 'faq.q2':'It says quota exceeded.','faq.a2':'MEGA limits free accounts and IPs. The app <b>auto-pauses and resumes after a countdown</b>; if you can\u2019t wait, enable “quota breakthrough mode” in Settings.',
 'faq.q3':'Is download speed limited?','faq.a3':'Not by the app — multi-threading will max out your bandwidth. Global or per-task speed caps are there when you want them.',
 'faq.q4':'Where are settings and the queue stored?','faq.a4':'In <b>%LOCALAPPDATA%\\MegaDownloader\\</b>. Move or delete the program folder freely; back that directory up before reinstalling Windows.',
 'faq.q5':'Do old links still work? Admin rights?','faq.a5':'Legacy #! links, mega:// encrypted links and ELC containers are all supported. It\u2019s portable and needs no admin rights.',
 'faq.q6':'Mac / Linux version?','faq.a6':'No — it\u2019s WinForms, Windows only. Enable the built-in web interface to manage downloads from any device\u2019s browser.',
 'cta.kicker':'Ready?','cta.h':'Download the classic.<br><span class="grad-text">Again.</span>',
 'cta.sub':'This tool has no marketing budget — your Star is how it reaches more people.',
 'cta.btn1':'Get the latest','cta.btn2':'Give a Star',
 'cta.note':'Found a bug? File an Issue — many recent fixes started as user reports.',
 'foot.tag':'The classic MEGA downloader, back at full power. Portable, multi-threaded, continuously fixed — community-driven, for the community.',
 'foot.h1':'Project','foot.l1':'GitHub repo','foot.l2':'Download latest','foot.l3':'Report an issue',
 'foot.h2':'Site','foot.l4':'Site source','foot.l5':'Production site','foot.l6':'FAQ',
 'foot.legal1':'Unofficial project, not affiliated with MEGA Ltd. Derived from decompilation of third-party published software, solely to fix compatibility and restore usability.',
 'ticker':['mega.nz/file ✓','mega.nz/folder ✓','legacy #! links ✓','mega://enc2 ✓','ELC containers ✓','RAR / 7Z / ZIP auto-extract ✓','stream while downloading ✓','web remote control ✓','dark / light themes ✓','10 UI languages ✓','MIT open source ✓']
},
zh:{
 'quota.done':'已恢复，继续下载','quota.wait':'配额恢复倒计时',
 'ticker':['mega.nz/file ✓','mega.nz/folder ✓','旧版 #! 链接 ✓','mega://enc2 ✓','ELC 容器 ✓','RAR / 7Z / ZIP 自动解压 ✓','边下边播 ✓','Web 远程管理 ✓','深浅双主题 ✓','10 种界面语言 ✓','MIT 开源 ✓']
}};

var langNow='zh';
try{var sl=localStorage.getItem('mdr-lang');if(sl==='en'||sl==='zh')langNow=sl;else if(!sl&&/^en/i.test(navigator.language))langNow='en';}catch(e){}
var langBtn=$('#langBtn');
/* 保存内联中文原件:zh 是页面默认文案,en 才走字典 */
$$('[data-i18n],[data-i18n-html]').forEach(function(el){el.setAttribute('data-orig',el.innerHTML)});
function t(k){return (I18N[langNow]&&I18N[langNow][k])||I18N.en[k]||''}
function applyLang(l){
  langNow=l; document.documentElement.lang=l==='en'?'en':'zh-CN';
  try{localStorage.setItem('mdr-lang',l)}catch(e){}
  langBtn.textContent=(l==='en')?'中':'EN';
  $$('[data-i18n],[data-i18n-html]').forEach(function(el){
    if(l==='zh'){el.innerHTML=el.getAttribute('data-orig');return}
    var k=el.getAttribute('data-i18n')||el.getAttribute('data-i18n-html');
    var v=t(k);if(!v)return;
    if(el.hasAttribute('data-i18n-html'))el.innerHTML=v;else el.textContent=v;
  });
  buildTicker();
  document.title=l==='en'?'MegaDownloader Revival — The classic MEGA downloader, back at full power':'MegaDownloader Revival — 经典 MEGA 下载器，满血复活';
  scramble($('.hero h1 .grad-text'));
  syncMockTheme();
  syncQuotaLabel();
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
function countUp(el,val){
  var suffix=el.getAttribute('data-suffix')||'';
  if(reduceMotion){el.textContent=fmt(val)+suffix;return}
  var t0=null,dur=1300;
  function step(ts){
    if(!t0)t0=ts;
    var p=Math.min((ts-t0)/dur,1),e=1-Math.pow(1-p,3);
    el.textContent=fmt(Math.round(val*e))+suffix;
    if(p<1)requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
/* 兜底快照(2026-10-25 实测:53 Stars / 25 个 Release 合计 2,172 次下载),API 可达时会被实时值覆盖 */
var LIVE={stars:53,dls:2172};
var counted=false;
var cio=new IntersectionObserver(function(es){
  es.forEach(function(e){
    if(!e.isIntersecting||counted)return;counted=true;cio.disconnect();
    countUp($('[data-count="stars"]'),LIVE.stars);
    countUp($('[data-count="dls"]'),LIVE.dls);
    var f=$('[data-count="fixes"]');if(f)countUp(f,200);
    var g=$('[data-count="langs"]');if(g)countUp(g,10);
  });
},{threshold:.4});
var statsEl=$('.stats'); if(statsEl)cio.observe(statsEl);
function paintStars(n){
  var s='★ '+(n>=1000?(n/1000).toFixed(1)+'k':n);
  ['#ghStars','#ghStars2','#ghStars3'].forEach(function(id){var el=$(id);if(el)el.textContent=s});
}
paintStars(LIVE.stars);

/* ========== GitHub 实时同步(6h 缓存 + 降级) ========== */
var CACHE_KEY='mdr2-cache-v1',TTL=6*3600*1000;
function tmout(){var c=new AbortController();setTimeout(function(){c.abort()},7000);return c.signal}
function render(d){
  if(d.stars){LIVE.stars=d.stars;paintStars(d.stars);var a=$('[data-count="stars"]');if(a&&counted)a.textContent=fmt(d.stars)}
  if(d.dls){LIVE.dls=d.dls;var b=$('[data-count="dls"]');if(b&&counted)b.textContent=fmt(d.dls)+'+'}
  if(d.tag){
    $$('[data-ver]').forEach(function(el){el.textContent=d.tag});
    document.documentElement.style.setProperty('--lbl-new',String(d.tag)+' · ');
    var ld=$('script[type="application/ld+json"]');
    if(ld){try{var j=JSON.parse(ld.textContent);j.softwareVersion=String(d.tag).replace(/^v/,'');ld.textContent=JSON.stringify(j)}catch(e){}}
  }
}
function sync(){
  var c=null;try{c=JSON.parse(localStorage.getItem(CACHE_KEY))}catch(e){}
  if(c&&Date.now()-c.ts<TTL){render(c.data);return}
  Promise.all([
    fetch('https://api.github.com/repos/'+REPO,{signal:tmout()}).then(function(r){return r.ok?r.json():null}).catch(function(){return null}),
    fetch('https://api.github.com/repos/'+REPO+'/releases?per_page=100',{signal:tmout()}).then(function(r){return r.ok?r.json():[]}).catch(function(){return []})
  ]).then(function(res){
    var repo=res[0],rels=res[1]||[];
    if(!repo&&!rels.length)return;
    var dls=0;rels.forEach(function(r){(r.assets||[]).forEach(function(a){dls+=a.download_count||0})});
    var data={ts:Date.now(),stars:repo?repo.stargazers_count:null,dls:dls||null,
      tag:rels.length?rels[0].tag_name:null};
    try{localStorage.setItem(CACHE_KEY,JSON.stringify(data))}catch(e){}
    render(data);
  });
}
sync();

/* ========== 粒子网络 + 下载光束 ========== */
var cv=$('#net'),ctx=cv.getContext('2d');
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
var qSec=287,qMode='wait',qLast=0;
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
  var c=$('#miniGraph');if(!c)return;var g2=c.getContext('2d');
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
  if(quota&&ts-qLast>140){
    qLast=ts;
    if(qMode==='wait'){
      qSec-=1.4;
      if(qSec<=0){qMode='resume';quota.classList.add('resume');qIco.textContent='🚀';qSec=4;syncQuotaLabel();}
      if(qTime)qTime.textContent=fmtQ(Math.max(qSec,0));
    }else{
      qSec-=1;
      if(qSec<=0){qMode='wait';quota.classList.remove('resume');qIco.textContent='⏳';qSec=287;syncQuotaLabel();}
    }
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
