(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hero=document.querySelector('.hero'),slides=[].slice.call(document.querySelectorAll('.slide')),
      flash=document.querySelector('.flash'),focusB=document.querySelector('.focus b'),
      frameEl=document.getElementById('frame'),shutter=document.getElementById('shutter');
  var W=0,H=0,cx=0,cy=0,tx=0,ty=0,cur=0,z=1,last=-9999,auto=null;
  function size(){var r=hero.getBoundingClientRect();W=r.width;H=r.height;hero.style.setProperty('--r',Math.max(200,Math.min(W,H)*0.34)+'px');if(!cx&&!cy){cx=tx=W*.5;cy=ty=H*.5}}
  size();window.addEventListener('resize',size);
  slides.forEach(function(s,i){s.style.zIndex=i===0?1:0});
  function paint(){hero.style.setProperty('--x',cx+'px');hero.style.setProperty('--y',cy+'px')}
  paint();
  hero.addEventListener('pointermove',function(e){if(e.pointerType==='touch')return;var r=hero.getBoundingClientRect();tx=e.clientX-r.left;ty=e.clientY-r.top;last=performance.now()});
  hero.addEventListener('pointerleave',function(){last=-9999});
  function tick(now){
    if(!reduce){
      if(now-last>2600){var t=now/1000;tx=W*(.5+.3*Math.sin(t*.42));ty=H*(.5+.2*Math.sin(t*.31+1.2))}
      cx+=(tx-cx)*.1;cy+=(ty-cy)*.1;paint();
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  function shoot(x,y){
    var n=(cur+1)%slides.length,s=slides[n];
    z+=1;s.style.zIndex=z;cur=n;
    frameEl.textContent='Frame '+(cur+1)+'/'+slides.length;
    if(!reduce){
      var rad=Math.hypot(Math.max(x,W-x),Math.max(y,H-y))+4;
      s.animate([{clipPath:'circle(0px at '+x+'px '+y+'px)'},{clipPath:'circle('+rad+'px at '+x+'px '+y+'px)'}],{duration:1000,easing:'cubic-bezier(.2,.7,.2,1)'});
      flash.animate([{opacity:.9},{opacity:0}],{duration:560,easing:'ease-out'});
      focusB.animate([{transform:'scale(1)',borderColor:'#fff'},{transform:'scale(.62)',borderColor:'#E4572E',offset:.25},{transform:'scale(1)',borderColor:'#fff'}],{duration:520,easing:'ease-out'});
    }
  }
  hero.addEventListener('click',function(e){
    if(e.target.closest('nav'))return;
    var r=hero.getBoundingClientRect(),x,y;
    if(e.detail===0||e.target.closest('#shutter')){x=cx;y=cy}else{x=e.clientX-r.left;y=e.clientY-r.top;if(e.pointerType==='touch'){tx=x;ty=y;last=performance.now()}}
    shoot(x,y);resetAuto();
  });
  function resetAuto(){clearInterval(auto);if(!reduce){auto=setInterval(function(){if(!document.hidden)shoot(cx,cy)},7000)}}
  resetAuto();

  var fb=[].slice.call(document.querySelectorAll('.filters button')),its=[].slice.call(document.querySelectorAll('.mas .it'));
  fb.forEach(function(b){b.addEventListener('click',function(){var f=b.getAttribute('data-f');fb.forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',x===b?'true':'false')});its.forEach(function(it){it.hidden=!(f==='all'||it.getAttribute('data-cat').split(' ').indexOf(f)>-1)})})});
  var lb=document.getElementById('lb'),lbi=document.getElementById('lbi'),lbc=document.getElementById('lbc'),cur=0,list=[],opener=null,sx=0;
  function vis(){return its.filter(function(x){return !x.hidden})}
  function show(k){list=vis();if(!list.length)return;cur=(k+list.length)%list.length;var it=list[cur];lbi.style.backgroundImage=it.style.getPropertyValue('--img').trim();lbi.setAttribute('aria-label',it.getAttribute('data-cap'));lbc.textContent=(cur+1)+' / '+list.length}
  function openLb(it){opener=it;list=vis();show(list.indexOf(it));lb.hidden=false;document.documentElement.style.overflow='hidden';document.getElementById('lbx').focus()}
  function closeLb(){lb.hidden=true;document.documentElement.style.overflow='';if(opener)opener.focus()}
  its.forEach(function(it){it.addEventListener('click',function(){openLb(it)})});
  document.getElementById('lbx').addEventListener('click',closeLb);
  document.getElementById('lbp').addEventListener('click',function(){show(cur-1)});
  document.getElementById('lbn').addEventListener('click',function(){show(cur+1)});
  lb.addEventListener('click',function(e){if(e.target===lb||e.target===lbi)closeLb()});
  lb.addEventListener('touchstart',function(e){sx=e.changedTouches[0].clientX},{passive:true});
  lb.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)show(cur+(dx<0?1:-1))},{passive:true});
  document.addEventListener('keydown',function(e){if(lb.hidden)return;if(e.key==='Escape')closeLb();else if(e.key==='ArrowLeft')show(cur-1);else if(e.key==='ArrowRight')show(cur+1)});


  var rv=[].slice.call(document.querySelectorAll('.rv'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in-v');io.unobserve(e.target)}})},{threshold:.12});
    rv.forEach(function(el){io.observe(el)});
  }else{rv.forEach(function(el){el.classList.add('in-v')})}

  var pxs=[].slice.call(document.querySelectorAll('[data-px]')),tk=false;
  function par(){tk=false;var vh=window.innerHeight;pxs.forEach(function(el){var r=el.getBoundingClientRect();if(r.bottom<-60||r.top>vh+60)return;var p=(r.top+r.height/2-vh/2)/vh;el.firstElementChild.style.setProperty('--py',(p*-r.height*.14).toFixed(1)+'px')})}
  if(!reduce){window.addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(par)}},{passive:true});par()}
})();
(function(){var f=document.getElementById('mf');if(!f||window.self!==window.top||!/^https?:$/.test(location.protocol))return;var i=document.createElement('iframe');i.title='BIMART STUDIO location on the map';i.loading='lazy';i.referrerPolicy='no-referrer-when-downgrade';i.src='https://maps.google.com/maps?q=12460%20W%2062nd%20Terrace%2C%20Shawnee%2C%20KS&z=15&output=embed';f.appendChild(i)})();
