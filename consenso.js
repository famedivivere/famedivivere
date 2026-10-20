/* Carica i contenuti di terze parti (mappa, questionario, GoFundMe) solo dopo il clic dell'utente. */
document.querySelectorAll('.consent[data-embed="iframe"]').forEach(function(box){
  var btn=box.querySelector('button');
  if(!btn) return;
  btn.addEventListener('click',function(){
    var f=document.createElement('iframe');
    f.src=box.dataset.src;
    f.title=box.dataset.title||'';
    f.setAttribute('allowfullscreen','');
    f.referrerPolicy='no-referrer-when-downgrade';
    if(box.dataset.height){f.style.height=box.dataset.height+'px';f.className='emb-fixed';}
    box.replaceWith(f);
  });
});
