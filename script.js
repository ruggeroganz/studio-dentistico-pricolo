/* Studio Dentistico Pricolo: script condiviso */
(function(){
  // Header e menu mobile
  var header=document.querySelector('.header');
  var burger=document.querySelector('.burger');
  var nav=document.querySelector('.nav');
  function onScroll(){ if(header) header.classList.toggle('scrolled',window.scrollY>10); }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
  if(burger&&nav){
    burger.addEventListener('click',function(){
      var open=nav.classList.toggle('open');
      burger.classList.toggle('open',open);
      document.body.classList.toggle('menu-open',open);
      burger.setAttribute('aria-expanded',open?'true':'false');
    });
  }
  // Voce di menu attiva
  var here=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav a').forEach(function(a){
    var href=a.getAttribute('href');
    if(href===here||(here==='index.html'&&href==='index.html')) a.classList.add('active');
  });

  // Trattamenti: carosello orizzontale automatico
  var SPEED=40*1.75; // pixel al secondo: velocita base 40, moltiplicata 1,75
  document.querySelectorAll('.tlist').forEach(function(list){
    if(list.closest('.marquee')) return;
    var box=document.createElement('div');
    box.className='marquee reveal';
    list.parentNode.insertBefore(box,list);
    box.appendChild(list);
    var items=Array.prototype.slice.call(list.children);
    items.forEach(function(it){ it.classList.remove('reveal','d1','d2','d3'); });
    items.forEach(function(it){
      var c=it.cloneNode(true);
      c.setAttribute('aria-hidden','true');
      list.appendChild(c);
    });
    function setDur(){ list.style.setProperty('--dur',(list.scrollWidth/2/SPEED)+'s'); }
    setDur();
    window.addEventListener('resize',setDur);
    window.addEventListener('load',setDur);
    var t;
    box.addEventListener('touchstart',function(){ clearTimeout(t); box.classList.add('paused'); },{passive:true});
    box.addEventListener('touchend',function(){ clearTimeout(t); t=setTimeout(function(){ box.classList.remove('paused'); },2500); },{passive:true});
  });

  // Reveal allo scroll
  var els=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
    },{threshold:.12});
    els.forEach(function(el){ io.observe(el); });
  } else { els.forEach(function(el){ el.classList.add('in'); }); }

  // Email composta lato client (anti spam)
  var user='info', domain='studiodentisticopricolo.it';
  var email=user+'@'+domain;
  document.querySelectorAll('[data-email]').forEach(function(el){
    el.textContent=email;
    if(el.tagName==='A') el.setAttribute('href','mailto:'+email);
  });

  // Modulo FormSubmit
  var form=document.querySelector('form[data-formsubmit]');
  if(form){
    form.setAttribute('action','https://formsubmit.co/'+email);
    var msg=form.querySelector('.msg');
    form.addEventListener('submit',function(ev){
      var hp=form.querySelector('input[name="_honey"]');
      if(hp&&hp.value){ ev.preventDefault(); return; }
      var priv=form.querySelector('input[name="privacy"]');
      if(priv&&!priv.checked){
        ev.preventDefault();
        if(msg){ msg.className='msg err'; msg.textContent='Per inviare la richiesta serve il consenso al trattamento dei dati.'; }
        return;
      }
      var next=form.querySelector('input[name="_next"]');
      if(next){
        var base=location.href.replace(/[^\/]*$/,'');
        next.value=base+'grazie.html';
      }
    });
  }

  // Cookie banner
  var KEY='sdp_cookie_consent';
  var banner=document.querySelector('.cookie');
  if(banner){
    var seen=null;
    try{ seen=localStorage.getItem(KEY); }catch(e){}
    if(!seen){ setTimeout(function(){ banner.classList.add('show'); },800); }
    banner.querySelectorAll('[data-consent]').forEach(function(b){
      b.addEventListener('click',function(){
        try{ localStorage.setItem(KEY,b.getAttribute('data-consent')); }catch(e){}
        banner.classList.remove('show');
      });
    });
  }


  // Team: apertura card
  var people=document.querySelectorAll('.person');
  people.forEach(function(card){
    var btn=card.querySelector('.person-btn');
    if(!btn) return;
    btn.addEventListener('click',function(){
      var willOpen=!card.classList.contains('open');
      people.forEach(function(c){ c.classList.remove('open'); var b=c.querySelector('.person-btn'); if(b) b.setAttribute('aria-expanded','false'); });
      if(willOpen){ card.classList.add('open'); btn.setAttribute('aria-expanded','true'); }
    });
  });

  // Anno nel footer
  document.querySelectorAll('[data-year]').forEach(function(el){ el.textContent=new Date().getFullYear(); });
})();
