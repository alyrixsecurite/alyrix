document.addEventListener('DOMContentLoaded',()=>{const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.nav');if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});}document.querySelectorAll('.drop-button').forEach(btn=>btn.addEventListener('click',()=>{const parent=btn.closest('.nav-drop');const open=parent.classList.toggle('open');btn.setAttribute('aria-expanded',String(open));}));const form=document.querySelector('#interest-form');if(form){form.addEventListener('submit',async e=>{e.preventDefault();const result=document.querySelector('#form-result');const button=form.querySelector('[type=submit]');button.disabled=true;button.textContent='Envoi en cours…';result.textContent='';try{const response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'}});if(response.ok){result.textContent='Merci ! Votre réponse a bien été envoyée.';result.classList.add('show');form.reset();}else{let message='L’envoi n’a pas abouti. Réessayez dans quelques instants.';try{const data=await response.json();if(data.errors){message=data.errors.map(error=>error.message).join(' ');}}catch(_){}result.textContent=message;result.classList.add('show');}}catch(_){result.textContent='Impossible de joindre le service pour le moment. Vérifiez votre connexion et réessayez.';result.classList.add('show');}finally{button.disabled=false;button.textContent='Envoyer ma réponse';}});}});
/* Assistant ALYRIX : réponses rapides, sans affichage de tarifs */
document.addEventListener('DOMContentLoaded',()=>{
  if(document.querySelector('.alyrix-chat')) return;
  const style=document.createElement('style');
  style.textContent=`
  .alyrix-chat{position:fixed;right:22px;bottom:22px;z-index:9999;font-family:inherit;color:#f2f6fb}
  .alyrix-chat-launch{display:flex;align-items:center;gap:10px;border:1px solid #3199ef;background:#087de3;color:#fff;border-radius:28px;padding:12px 17px;box-shadow:0 8px 28px #0006;font:600 14px/1.2 inherit;cursor:pointer}
  .alyrix-chat-launch:hover{background:#1592ff}.alyrix-chat-launch .chat-bubble{font-size:20px}
  .alyrix-chat-window{display:none;position:absolute;right:0;bottom:62px;width:min(360px,calc(100vw - 32px));max-height:min(510px,calc(100dvh - 110px));overflow:hidden;background:#0c1726;border:1px solid #2d4b69;border-radius:16px;box-shadow:0 18px 60px #0009}
  .alyrix-chat-window.is-open{display:flex;flex-direction:column}
  .alyrix-chat-head{display:flex;align-items:center;justify-content:space-between;padding:15px 16px;background:linear-gradient(120deg,#102a44,#0c1a2b);border-bottom:1px solid #263b55}
  .alyrix-chat-brand{font-weight:700;font-size:14px}.alyrix-chat-sub{display:block;font-size:11px;color:#aabbd0;margin-top:2px}
  .alyrix-chat-close{background:transparent;border:0;color:#d9e8f7;font-size:23px;cursor:pointer;padding:0 3px}
  .alyrix-chat-body{padding:16px;overflow:auto;font-size:13px;line-height:1.55}
  .alyrix-chat-message{background:#14263b;border:1px solid #263b55;border-radius:4px 12px 12px 12px;padding:11px 12px;margin:0 0 13px;color:#edf5ff}
  .alyrix-chat-options{display:grid;gap:8px}
  .alyrix-chat-option{display:block;text-align:left;width:100%;background:#0b1726;color:#dcecff;border:1px solid #315170;border-radius:9px;padding:10px 12px;font:500 13px/1.35 inherit;cursor:pointer}
  .alyrix-chat-option:hover{border-color:#1688ef;background:#10243a}
  .alyrix-chat-option.primary{background:#087de3;border-color:#087de3;color:#fff;text-align:center;font-weight:700}
  .alyrix-chat-note{color:#93a9c0;font-size:10px;margin:12px 0 0}
  @media(max-width:480px){.alyrix-chat{right:14px;bottom:14px}.alyrix-chat-window{bottom:60px;right:-2px;width:calc(100vw - 28px)}.alyrix-chat-launch{padding:11px 14px}}
  @media(prefers-reduced-motion:reduce){.alyrix-chat *{scroll-behavior:auto}}
  `;
  document.head.appendChild(style);
  const root=document.createElement('div');root.className='alyrix-chat';
  root.innerHTML=`
    <section class="alyrix-chat-window" role="dialog" aria-label="Assistant ALYRIX" aria-modal="false">
      <header class="alyrix-chat-head"><div><div class="alyrix-chat-brand">Assistant ALYRIX</div><span class="alyrix-chat-sub">À votre écoute pour vous orienter</span></div><button class="alyrix-chat-close" type="button" aria-label="Fermer le chat">×</button></header>
      <div class="alyrix-chat-body" aria-live="polite">
        <p class="alyrix-chat-message">Bonjour ! 😊 Bienvenue chez ALYRIX. Vous avez une question sur la sécurité ou un projet en tête ? Je peux vous aider à trouver les premières informations.</p>
        <div class="alyrix-chat-options">
          <button class="alyrix-chat-option" data-topic="camera">📹 Caméras et vidéosurveillance</button>
          <button class="alyrix-chat-option" data-topic="alarme">🛡️ Alarmes et protection</button>
          <button class="alyrix-chat-option" data-topic="services">🏠 Autres services</button>
          <button class="alyrix-chat-option" data-topic="zone">📍 Zone d’intervention</button>
          <button class="alyrix-chat-option" data-topic="depannage">🔧 Dépannage ou installation existante</button>
          <button class="alyrix-chat-option" data-topic="prix">💬 Tarifs et devis</button>
        </div>
        <p class="alyrix-chat-note">Assistant d’information : aucune intervention ni aucun tarif ne sont confirmés par ce chat.</p>
      </div>
    </section>
    <button class="alyrix-chat-launch" type="button" aria-expanded="false"><span class="chat-bubble">▢</span><span>Une question ?</span></button>`;
  document.body.appendChild(root);
  const win=root.querySelector('.alyrix-chat-window'),launch=root.querySelector('.alyrix-chat-launch'),body=root.querySelector('.alyrix-chat-body');
  const open=()=>{win.classList.add('is-open');launch.setAttribute('aria-expanded','true')};
  const close=()=>{win.classList.remove('is-open');launch.setAttribute('aria-expanded','false')};
  launch.addEventListener('click',()=>win.classList.contains('is-open')?close():open());
  root.querySelector('.alyrix-chat-close').addEventListener('click',close);
  const answers={
    camera:'ALYRIX étudie des solutions de vidéosurveillance pour les particuliers et les professionnels, avec un accompagnement adapté aux lieux à protéger et à vos besoins. Pour parler de votre projet, vous pouvez nous écrire via le formulaire de contact.',
    alarme:'ALYRIX s’intéresse notamment aux systèmes d’alarme anti-intrusion, pour la maison comme pour les locaux professionnels. Le choix dépend des accès, des habitudes et du niveau de protection souhaité.',
    services:'Les domaines étudiés par ALYRIX comprennent les alarmes, la vidéosurveillance, le contrôle d’accès, la motorisation de portails, la domotique et la petite électricité.',
    zone:'ALYRIX prévoit de se concentrer sur le Nord-Gironde et les communes situées dans un secteur local autour de Cubnezais. La couverture exacte reste à confirmer selon la commune et le projet.',
    depannage:'Pour une installation existante ou un besoin de dépannage, le plus simple est de décrire le matériel, le problème constaté et votre commune dans le formulaire de contact. Une prise en charge n’est pas garantie automatiquement.',
    prix:'Les tarifs ne sont pas communiqués par l’assistant, car chaque installation dépend du matériel et de la configuration des lieux. Le plus adapté est de demander un devis afin que votre besoin puisse être étudié.'
  };
  body.addEventListener('click',e=>{
    const button=e.target.closest('[data-topic]');
    if(!button)return;
    const topic=button.dataset.topic;
    const message=document.createElement('p');message.className='alyrix-chat-message';message.textContent=answers[topic]||'Je vous invite à nous contacter pour cette question.';body.appendChild(message);
    const options=document.createElement('div');options.className='alyrix-chat-options';
    const quote=document.createElement('a');quote.className='alyrix-chat-option primary';quote.href='contact.html';quote.textContent=topic==='prix'?'Demander un devis':'Contacter ALYRIX';options.appendChild(quote);
    const again=document.createElement('button');again.type='button';again.className='alyrix-chat-option';again.textContent='← Choisir un autre sujet';again.addEventListener('click',()=>{body.innerHTML='<p class="alyrix-chat-message">Bien sûr ! Quel sujet souhaitez-vous explorer ?</p>';const menu=document.createElement('div');menu.className='alyrix-chat-options';[['camera','📹 Caméras et vidéosurveillance'],['alarme','🛡️ Alarmes et protection'],['services','🏠 Autres services'],['zone','📍 Zone d’intervention'],['depannage','🔧 Dépannage ou installation existante'],['prix','💬 Tarifs et devis']].forEach(([key,label])=>{const b=document.createElement('button');b.className='alyrix-chat-option';b.dataset.topic=key;b.textContent=label;menu.appendChild(b)});body.appendChild(menu);});options.appendChild(again);body.appendChild(options);body.scrollTop=body.scrollHeight;
  });
});
