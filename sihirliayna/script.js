(function(){
'use strict';
var $=function(s){return document.querySelector(s)};
var stage=$('#stage'),realSvg=$('#realSvg'),mirrorSvg=$('#mirrorSvg'),tray=$('#tray'),capText=$('#capText');
var realFrame=$('#realFrame'),mirrorFrame=$('#mirrorFrame');
var scale=1;
function fit(){scale=Math.min(window.innerWidth/1920,window.innerHeight/1080);stage.style.transform='translate(-50%,-50%) scale('+scale+')'}
window.addEventListener('resize',fit);fit();
document.addEventListener('contextmenu',function(e){e.preventDefault()});
function sh(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
function rnd(a){return a[Math.floor(Math.random()*a.length)]}
function wait(ms){return new Promise(function(r){setTimeout(r,ms)})}

/* ---------- AYARLAR ---------- */
var settings={sound:1,help:1,scenes:3};
try{var sv=JSON.parse(localStorage.getItem('sai-settings')||'null');if(sv){settings.sound=sv.sound?1:0;settings.help=sv.help?1:0;settings.scenes=Math.max(1,Math.min(3,sv.scenes|0||3))}}catch(e){}
function saveSettings(){try{localStorage.setItem('sai-settings',JSON.stringify(settings))}catch(e){}}
function paintSettings(){
  var o=document.querySelectorAll('.opt');
  for(var i=0;i<o.length;i++){o[i].classList.toggle('on',String(settings[o[i].dataset.set])===o[i].dataset.v)}
  $('#btnSound').textContent=settings.sound?'🔊':'🔇';
}

/* ---------- SES ---------- */
var ttsOk='speechSynthesis' in window,voice=null,ac=null;
function loadVoice(){if(!ttsOk)return;try{var v=speechSynthesis.getVoices();voice=null;for(var i=0;i<v.length;i++){if(v[i].lang&&v[i].lang.toLowerCase().indexOf('tr')===0){voice=v[i];break}}}catch(e){}}
if(ttsOk){loadVoice();try{speechSynthesis.onvoiceschanged=loadVoice}catch(e){}}
function audio(){try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume()}catch(e){ac=null}return ac}
function tone(f,d,t0,type,vol,f2){var a=audio();if(!a||!settings.sound)return;try{var o=a.createOscillator(),g=a.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f,a.currentTime+t0);if(f2)o.frequency.linearRampToValueAtTime(f2,a.currentTime+t0+d);g.gain.setValueAtTime(vol||.12,a.currentTime+t0);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+t0+d);o.connect(g);g.connect(a.destination);o.start(a.currentTime+t0);o.stop(a.currentTime+t0+d)}catch(e){}}
function ding(){tone(523,.25,0);tone(659,.25,.12);tone(784,.4,.24)}
function oops(){tone(320,.22,0,'triangle',.09,250)}
function magic(){[784,988,1175,1568].forEach(function(f,i){tone(f,.35,i*.1,'sine',.1)})}
var epoch=0;
function say(text){
  capText.textContent=text;
  return new Promise(function(res){
    var done=false,est=900+text.length*75,tm=null;
    function fin(){if(!done){done=true;clearTimeout(tm);res()}}
    if(!settings.sound||!ttsOk){tm=setTimeout(fin,est);return}
    tm=setTimeout(fin,est*2.2);
    try{
      speechSynthesis.cancel();
      var u=new SpeechSynthesisUtterance(text);
      u.lang='tr-TR';if(voice)u.voice=voice;u.rate=.88;u.pitch=1.15;
      u.onend=fin;u.onerror=fin;speechSynthesis.speak(u);
    }catch(e){fin()}
  });
}
function stopSpeech(){if(ttsOk){try{speechSynthesis.cancel()}catch(e){}}}

/* ---------- ÇİZİMLER (merkezi 0,0 olan parçalar) ---------- */
function emo(ch){return '<text text-anchor="middle" y="33" font-size="96">'+ch+'</text>'}
var ANG=[-90,-18,54,126,198];
function sun(n){
  var s='';
  for(var i=0;i<n;i++){var a=ANG[i]*Math.PI/180;
    s+='<line x1="'+(Math.cos(a)*52).toFixed(1)+'" y1="'+(Math.sin(a)*52).toFixed(1)+'" x2="'+(Math.cos(a)*76).toFixed(1)+'" y2="'+(Math.sin(a)*76).toFixed(1)+'" stroke="#ffb400" stroke-width="13" stroke-linecap="round"/>'}
  return s+'<circle r="40" fill="#ffd23f" stroke="#ffb400" stroke-width="6"/><circle cx="-13" cy="-6" r="4.5" fill="#6b4a00"/><circle cx="13" cy="-6" r="4.5" fill="#6b4a00"/><path d="M-14 9Q0 24 14 9" stroke="#6b4a00" stroke-width="5" fill="none" stroke-linecap="round"/>';
}
function apple(c){
  return '<path d="M0 -24C-44 -48 -54 18 -26 40C-12 54 -6 42 0 42C6 42 12 54 26 40C54 18 44 -48 0 -24Z" fill="'+c+'" stroke="rgba(0,0,0,.18)" stroke-width="3"/>'+
  '<path d="M0 -24C0 -40 6 -52 12 -58" stroke="#7a4a2a" stroke-width="6" fill="none" stroke-linecap="round"/>'+
  '<ellipse cx="24" cy="-46" rx="17" ry="8" fill="#4caf50" transform="rotate(-25 24 -46)"/>'+
  '<ellipse cx="-20" cy="-4" rx="8" ry="14" fill="#fff" opacity=".35" transform="rotate(20 -20 -4)"/>';
}
function flower(c){
  var s='<path d="M0 62L0 6" stroke="#3e9b47" stroke-width="9" stroke-linecap="round"/>'+
  '<ellipse cx="-19" cy="40" rx="19" ry="8" fill="#4caf50" transform="rotate(-30 -19 40)"/><ellipse cx="19" cy="30" rx="19" ry="8" fill="#4caf50" transform="rotate(30 19 30)"/>';
  for(var i=0;i<6;i++){var a=i*Math.PI/3;s+='<circle cx="'+(Math.cos(a)*27).toFixed(1)+'" cy="'+(-20+Math.sin(a)*27).toFixed(1)+'" r="18" fill="'+c+'" stroke="rgba(0,0,0,.12)" stroke-width="2"/>'}
  return s+'<circle cy="-20" r="15" fill="#ffb400"/>';
}
function ball(c){
  return '<circle r="44" fill="'+c+'" stroke="rgba(0,0,0,.2)" stroke-width="3"/><path d="M-44 2Q0 32 44 2" stroke="#fff" stroke-width="9" fill="none" opacity=".75"/>'+
  '<ellipse cx="-17" cy="-20" rx="11" ry="6" fill="#fff" opacity=".55" transform="rotate(-30 -17 -20)"/>';
}
var ITEMS={
  sun5:function(){return sun(5)},sun4:function(){return sun(4)},sun3:function(){return sun(3)},
  appleR:function(){return apple('#e8453c')},appleG:function(){return apple('#7ac74f')},
  flowerR:function(){return flower('#ff5a6e')},flowerY:function(){return flower('#ffd23f')},
  ballR:function(){return ball('#e8453c')},ballB:function(){return ball('#3f7ee8')},
  cat:function(){return emo('🐱')},dog:function(){return emo('🐶')},teddy:function(){return emo('🧸')},balloon:function(){return emo('🎈')},
  fish:function(){return emo('🐟')},tropical:function(){return emo('🐠')},crab:function(){return emo('🦀')},
  bird:function(){return emo('🐦')},butterfly:function(){return emo('🦋')},snail:function(){return emo('🐌')}
};
function wrap(id,x,y,s){return '<g transform="translate('+x+','+y+') scale('+(s||1)+')">'+ITEMS[id]()+'</g>'}

/* ---------- SAHNELER (800x560) ---------- */
var SCENES=[
 { name:'Bahçe',
   base:'<rect width="800" height="560" fill="#cfeeff"/>'+
     '<g fill="#fff"><ellipse cx="150" cy="95" rx="72" ry="28"/><ellipse cx="205" cy="78" rx="46" ry="28"/></g>'+
     '<ellipse cx="400" cy="660" rx="720" ry="270" fill="#b5df97"/><ellipse cx="90" cy="610" rx="360" ry="190" fill="#a3d481"/>'+
     '<rect x="560" y="270" width="170" height="140" fill="#ffd9a8" stroke="#c98f55" stroke-width="4"/>'+
     '<polygon points="540,276 645,196 750,276" fill="#e0675a"/><rect x="625" y="338" width="42" height="72" fill="#8a5a3b"/>'+
     '<rect x="578" y="302" width="38" height="38" fill="#cfeeff" stroke="#8a5a3b" stroke-width="5"/>'+
     '<rect x="240" y="262" width="46" height="196" fill="#8a5a3b"/>'+
     '<circle cx="262" cy="200" r="104" fill="#4fae5a"/><circle cx="188" cy="244" r="64" fill="#58b862"/><circle cx="338" cy="244" r="64" fill="#58b862"/>',
   diffs:[
     {id:'sun',item:'sun5',x:680,y:95,s:1,type:'swap',mirror:'sun3',hint:'Güneşin ışınlarına bak. Gerçek resimde kaç ışın var?',ok:'Güneşin bütün ışınları tamamlandı!'},
     {id:'apple',item:'appleR',x:312,y:172,s:.9,type:'missing',hint:'Ağacın üstünde bir şey eksik.',ok:'Elma ağaca geri döndü!'},
     {id:'flower',item:'flowerR',x:105,y:430,s:1,type:'moved',mx:470,my:430,hint:'Çiçek gerçek resimde ağacın solunda. Aynada nerede?',ok:'Çiçek ağacın soluna geldi!'}
   ],
   pieces:['sun5','sun3','appleR','appleG','flowerR','flowerY']},
 { name:'Oda',
   base:'<rect width="800" height="560" fill="#fff0d4"/><rect y="400" width="800" height="160" fill="#e7c598"/><rect y="394" width="800" height="12" fill="#c99f6b"/>'+
     '<rect x="70" y="70" width="190" height="170" fill="#cfeeff" stroke="#b57a41" stroke-width="10"/>'+
     '<path d="M165 70V240M70 155H260" stroke="#b57a41" stroke-width="8"/>'+
     '<path d="M52 56H110V250H52Z" fill="#f4a6c0"/><path d="M280 56H222V250H280Z" fill="#f4a6c0"/>'+
     '<rect x="330" y="235" width="270" height="16" rx="6" fill="#b57a41"/>'+
     '<rect x="348" y="172" width="24" height="63" fill="#e0675a"/><rect x="376" y="188" width="20" height="47" fill="#4fb6a8"/><rect x="400" y="180" width="22" height="55" fill="#f2b632"/>'+
     '<path d="M664 300H732L722 400H674Z" fill="#d9825b"/><ellipse cx="698" cy="268" rx="24" ry="44" fill="#4fae5a"/><ellipse cx="668" cy="284" rx="20" ry="36" fill="#58b862" transform="rotate(-25 668 284)"/><ellipse cx="728" cy="284" rx="20" ry="36" fill="#58b862" transform="rotate(25 728 284)"/>'+
     '<ellipse cx="400" cy="472" rx="280" ry="74" fill="#8fc7e8"/><ellipse cx="400" cy="472" rx="215" ry="50" fill="#bfe2f5"/>',
   diffs:[
     {id:'ball',item:'ballR',x:225,y:452,s:.95,type:'swap',mirror:'ballB',hint:'Topun rengine bak.',ok:'Top yine kırmızı oldu!'},
     {id:'cat',item:'cat',x:565,y:442,s:1,type:'swap',mirror:'dog',hint:'Halının sağındaki hayvana bak. Gerçek resimde kim var?',ok:'Kedi geri geldi!'},
     {id:'teddy',item:'teddy',x:505,y:183,s:.85,type:'missing',hint:'Rafın üstünde bir oyuncak eksik.',ok:'Oyuncak ayı rafa oturdu!'}
   ],
   pieces:['ballR','ballB','cat','dog','teddy','balloon']},
 { name:'Deniz',
   base:'<rect width="800" height="560" fill="#cfeeff"/><g fill="#fff"><ellipse cx="560" cy="85" rx="80" ry="28"/><ellipse cx="615" cy="68" rx="46" ry="28"/></g>'+
     '<rect y="250" width="800" height="200" fill="#5bb8e6"/>'+
     '<path d="M0 290Q50 270 100 290T200 290T300 290T400 290T500 290T600 290T700 290T800 290" stroke="#fff" stroke-width="5" fill="none" opacity=".6"/>'+
     '<path d="M0 410Q60 390 120 410T240 410T360 410T480 410T600 410T720 410T840 410" stroke="#fff" stroke-width="5" fill="none" opacity=".5"/>'+
     '<path d="M0 440Q200 410 400 440T800 430V560H0Z" fill="#f6e2a8"/>'+
     '<polygon points="300,290 500,290 460,342 340,342" fill="#e0675a"/><rect x="395" y="160" width="10" height="132" fill="#8a5a3b"/>'+
     '<polygon points="408,168 408,282 486,282" fill="#fff"/><polygon points="392,190 392,282 326,282" fill="#ffe27a"/>',
   diffs:[
     {id:'fish',item:'fish',x:170,y:345,s:.95,type:'missing',hint:'Denizde bir balık eksik.',ok:'Balık denize geri döndü!'},
     {id:'crab',item:'crab',x:625,y:495,s:.95,type:'moved',mx:175,my:495,hint:'Yengeç gerçek resimde kumsalda, sağ tarafta. Aynada nerede?',ok:'Yengeç sağ tarafa gitti!'},
     {id:'bird',item:'bird',x:150,y:115,s:.95,type:'swap',mirror:'butterfly',hint:'Gökyüzündeki hayvana bak. Gerçek resimde kim var?',ok:'Kuş gökyüzüne döndü!'}
   ],
   pieces:['fish','tropical','crab','bird','butterfly','snail']}
];

/* konum cümleleri */
var POS=[['sol üst köşeye','üst kısma','sağ üst köşeye'],['sol tarafa','tam ortaya','sağ tarafa'],['sol alt köşeye','alt kısma','sağ alt köşeye']];
function posPhrase(x,y){var c=x<267?0:(x>533?2:1),r=y<187?0:(y>373?2:1);return POS[r][c]}

/* ---------- OYUN DURUMU ---------- */
var sceneNo=0,total=1,diffs=[],pieces=[],lock=true,errCount=0,idleT=null,selected=null,drag=null,solvedAll=0;
var ZR=105;
var FX=60,FY=266,MX=1060; /* gerçek ve ayna çerçeve konumları */

function buildProg(){var p=$('#prog');p.innerHTML='';for(var i=0;i<total*3;i++){p.appendChild(document.createElement('span'))}}
function markProg(){var s=$('#prog').children[solvedAll-1];if(s){s.className='on';s.textContent='⭐'}}

function loadScene(i){
  var sc=SCENES[i];
  diffs=sc.diffs.map(function(d){var c={};for(var k in d)c[k]=d[k];c.done=false;c.hl=0;c.piece=d.item;return c});
  var real=sc.base,mir=sc.base;
  diffs.forEach(function(d){
    real+=wrap(d.item,d.x,d.y,d.s);
    var m=d.type==='missing'?'':(d.type==='swap'?wrap(d.mirror,d.x,d.y,d.s):wrap(d.item,d.mx,d.my,d.s));
    mir+='<g id="m-'+d.id+'">'+m+'</g>';
  });
  realSvg.innerHTML=real;mirrorSvg.innerHTML=mir;
  realFrame.classList.remove('swapin');mirrorFrame.classList.remove('swapin');void realFrame.offsetWidth;
  realFrame.classList.add('swapin');mirrorFrame.classList.add('swapin');
  tray.innerHTML='';pieces=[];selected=null;errCount=0;
  sh(sc.pieces).forEach(function(id){
    var el=document.createElement('div');el.className='piece';
    el.innerHTML='<svg viewBox="-80 -80 160 160">'+ITEMS[id]()+'</svg>';
    var p={id:id,el:el};
    el.addEventListener('pointerdown',function(e){pDown(e,p)});
    el.addEventListener('pointermove',function(e){pMove(e,p)});
    el.addEventListener('pointerup',function(e){pUp(e,p)});
    el.addEventListener('pointercancel',function(e){pUp(e,p)});
    tray.appendChild(el);pieces.push(p);
  });
}

async function intro(first){
  var my=epoch;lock=true;
  if(first){await say('Merhaba küçük dedektif! Sihirli ayna yine bir şeyler karıştırmış. Haydi, iki resmi dikkatlice karşılaştıralım.')}
  else{await say('Yeni bir ikiz resim! Sihirli ayna yine bir şeyleri karıştırmış.')}
  if(my!==epoch)return;
  pulse(realFrame);await say('Bu gerçek resim.');if(my!==epoch)return;
  pulse(mirrorFrame);await say('Bu da aynadaki ikizi. Aynada üç şey değişmiş. Doğru parçayı bulup aynadaki resme sürükleyelim.');
  if(my!==epoch)return;
  lock=false;startIdle();
}
function pulse(f){f.classList.remove('pulse');void f.offsetWidth;f.classList.add('pulse');setTimeout(function(){f.classList.remove('pulse')},1500)}

/* ---------- SÜRÜKLE-BIRAK ---------- */
function pt(e){var r=stage.getBoundingClientRect();return{x:(e.clientX-r.left)/scale,y:(e.clientY-r.top)/scale}}
function centerOf(el){var r=el.getBoundingClientRect(),s=stage.getBoundingClientRect();return{x:(r.left+r.width/2-s.left)/scale,y:(r.top+r.height/2-s.top)/scale}}
function pDown(e,p){
  if(lock||drag||p.el.classList.contains('used'))return;
  e.preventDefault();clearIdle();
  var q=pt(e);drag={p:p,sx:q.x,sy:q.y,moved:false,id:e.pointerId,ghost:null};
  try{p.el.setPointerCapture(e.pointerId)}catch(err){}
}
function pMove(e,p){
  if(!drag||drag.p!==p||drag.id!==e.pointerId)return;
  var q=pt(e);
  if(!drag.moved&&Math.hypot(q.x-drag.sx,q.y-drag.sy)>14){
    drag.moved=true;
    var g=document.createElement('div');g.className='ghost';g.innerHTML=p.el.innerHTML;stage.appendChild(g);drag.ghost=g;
    p.el.classList.add('dragging');
  }
  if(drag.moved){drag.ghost.style.left=q.x+'px';drag.ghost.style.top=q.y+'px'}
}
function pUp(e,p){
  if(!drag||drag.p!==p)return;
  var d=drag;drag=null;
  try{p.el.releasePointerCapture(d.id)}catch(err){}
  p.el.classList.remove('dragging');
  if(d.moved){
    var q=pt(e);
    if(e.type==='pointercancel'){giveBack(p,d.ghost);startIdle();return}
    drop(p,q.x,q.y,d.ghost);
  }else if(e.type!=='pointercancel'){toggleSelect(p)}
}
function giveBack(p,gh){
  p.el.classList.remove('shake');void p.el.offsetWidth;p.el.classList.add('shake');
  if(!gh)return;
  var c=centerOf(p.el);gh.style.transition='left .3s ease,top .3s ease';gh.style.left=c.x+'px';gh.style.top=c.y+'px';
  setTimeout(function(){gh.remove()},320);
}
function toggleSelect(p){
  if(selected&&selected.el)selected.el.classList.remove('sel');
  if(selected===p){selected=null;return}
  selected=p;p.el.classList.add('sel');
  say('Şimdi aynadaki resimde parçanın yerine dokun.');startIdle();
}
mirrorFrame.addEventListener('click',function(e){
  if(!selected||lock||drag)return;
  var q=pt(e);drop(selected,q.x,q.y,null);
});

function drop(p,x,y,gh){
  if(selected&&selected.el)selected.el.classList.remove('sel');
  selected=null;
  var inMirror=x>=MX&&x<=MX+800&&y>=FY&&y<=FY+560;
  var inReal=x>=FX&&x<=FX+800&&y>=FY&&y<=FY+560;
  if(!inMirror){
    giveBack(p,gh);
    if(inReal)say('Parçaları sağdaki, aynadaki resme bırakalım.');
    startIdle();return;
  }
  var lx=x-MX,ly=y-FY,un=diffs.filter(function(d){return !d.done}),hit=null,best=1e9;
  un.forEach(function(d){var dist=Math.hypot(lx-d.x,ly-d.y);if(dist<ZR&&dist<best){best=dist;hit=d}});
  if(hit){
    if(p.id===hit.piece){if(gh)gh.remove();success(hit,p);return}
    giveBack(p,gh);fail('Bu parça olmadı. Gerçek resimdeki parçaya tekrar bakalım.');return;
  }
  var mm=un.filter(function(d){return d.type==='moved'&&p.id===d.piece&&Math.hypot(lx-d.mx,ly-d.my)<ZR})[0];
  giveBack(p,gh);
  if(mm)fail('Dikkat! Gerçek resimde burası değil. Konuma bakalım. '+mm.hint);
  else fail(rnd(['Burası değil. Konuma dikkat edelim.','Orada bir fark yok. Gerçek resimle karşılaştıralım.']));
}
function fail(msg){
  oops();errCount++;say(msg);startIdle();
  if(settings.help&&errCount>=2){errCount=0;var my=epoch;setTimeout(function(){if(my===epoch&&!lock)giveHint()},3200)}
}

/* ---------- BAŞARI / KONTROL ---------- */
function ring(svg,x,y,cls,ms){
  var c=document.createElementNS('http://www.w3.org/2000/svg','circle');
  c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('r',88);c.setAttribute('class','ring '+cls);
  svg.appendChild(c);setTimeout(function(){if(c.parentNode)c.parentNode.removeChild(c)},ms||3500);
}
function burst(x,y){
  for(var i=0;i<12;i++){
    var s=document.createElement('div');s.className='spark';s.textContent=rnd(['⭐','✨','🌟']);
    s.style.left=x+'px';s.style.top=y+'px';stage.appendChild(s);
    var a=Math.PI*2*i/12,d=130+Math.random()*100;
    var an=s.animate([{transform:'translate(0,0) scale(.4)',opacity:1},{transform:'translate('+Math.cos(a)*d+'px,'+Math.sin(a)*d+'px) scale(1.2)',opacity:0}],{duration:900,easing:'ease-out'});
    an.onfinish=(function(el){return function(){el.remove()}})(s);
  }
}
async function success(d,p){
  var my=epoch;
  d.done=true;p.el.classList.add('used');clearIdle();errCount=0;
  var g=mirrorSvg.querySelector('#m-'+d.id);
  g.innerHTML='<g class="popin">'+wrap(d.item,d.x,d.y,d.s)+'</g>';
  burst(MX+d.x,FY+d.y);ding();
  ring(realSvg,d.x,d.y,'ok',1800);ring(mirrorSvg,d.x,d.y,'ok',1800);
  solvedAll++;markProg();
  var left=diffs.filter(function(x){return !x.done}).length;
  if(left>0){
    startIdle();
    await say(d.ok+' '+rnd(['İki resimde de aynı yerde.','Şimdi ikisi aynı!','Kontrol ettik, aynı!']));
    return;
  }
  lock=true;
  await say(d.ok);if(my!==epoch)return;
  pulse(realFrame);pulse(mirrorFrame);
  realFrame.classList.add('shine');mirrorFrame.classList.add('shine');magic();
  await say('Kontrol edelim... İki resim de tamamen aynı!');if(my!==epoch)return;
  realFrame.classList.remove('shine');mirrorFrame.classList.remove('shine');
  await wait(600);if(my!==epoch)return;
  if(sceneNo+1>=total){endGame();return}
  sceneNo++;loadScene(sceneNo);intro(false);
}

/* ---------- İPUCU ---------- */
function giveHint(){
  if(lock)return;
  var un=diffs.filter(function(d){return !d.done});
  if(!un.length)return;
  var d=(selected&&un.filter(function(x){return x.item===selected.id})[0])||un[0];
  d.hl++;
  ring(realSvg,d.x,d.y,'hint',3800);
  if(d.hl>=2){
    ring(mirrorSvg,d.x,d.y,'hint',3800);
    var pc=pieces.filter(function(q){return q.id===d.piece})[0];
    if(pc){pc.el.classList.add('hint');setTimeout(function(){pc.el.classList.remove('hint')},3800)}
  }
  say('Gerçek resimde '+posPhrase(d.x,d.y)+' bakalım. '+d.hint);
  startIdle();
}
function startIdle(){
  clearIdle();
  idleT=setTimeout(function(){if(!lock&&settings.help)giveHint();else if(!lock)startIdle()},28000);
}
function clearIdle(){if(idleT){clearTimeout(idleT);idleT=null}}

/* ---------- AKIŞ ---------- */
function startGame(){
  epoch++;stopSpeech();clearIdle();
  total=settings.scenes;sceneNo=0;solvedAll=0;lock=true;
  $('#start').classList.add('hidden');$('#end').classList.add('hidden');$('#settings').classList.add('hidden');
  buildProg();loadScene(0);intro(true);
}
function endGame(){
  lock=true;magic();
  $('#endStars').textContent=new Array(total*3+1).join('⭐');
  $('#end').classList.remove('hidden');
  say('Tebrikler küçük dedektif! Sihirli ayna tamamen düzeldi!');
}

/* ---------- DÜĞMELER ---------- */
$('#btnStart').addEventListener('click',function(){audio();startGame()});
$('#btnAgain').addEventListener('click',function(){audio();startGame()});
$('#btnHint').addEventListener('click',function(){audio();giveHint()});
$('#btnReplay').addEventListener('click',function(){
  if(lock)return;
  say('Gerçek resme bak. Aynadaki resimde neler değişmiş? Doğru parçayı aynaya sürükle.');
});
$('#btnSound').addEventListener('click',function(){
  settings.sound=settings.sound?0:1;saveSettings();paintSettings();if(!settings.sound)stopSpeech();else audio();
});
$('#btnSet').addEventListener('click',function(){paintSettings();$('#settings').classList.remove('hidden')});
$('#btnClose').addEventListener('click',function(){$('#settings').classList.add('hidden')});
$('#btnRestart').addEventListener('click',function(){audio();startGame()});
(function(){
  var o=document.querySelectorAll('.opt');
  for(var i=0;i<o.length;i++){o[i].addEventListener('click',function(){
    var k=this.dataset.set,v=parseInt(this.dataset.v,10);
    settings[k]=v;if(k==='sound'&&!v)stopSpeech();saveSettings();paintSettings();
  })}
})();
$('#btnFull').addEventListener('click',function(){
  try{
    var d=document,el=d.documentElement;
    if(!d.fullscreenElement&&!d.webkitFullscreenElement){(el.requestFullscreen||el.webkitRequestFullscreen).call(el)}
    else{(d.exitFullscreen||d.webkitExitFullscreen).call(d)}
  }catch(e){}
});
paintSettings();
})();
