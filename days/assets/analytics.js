// Analytics loads only after a visitor opts in. No advertising features.
const measurementId='G-CKQ6HEGFQX', preferenceKey='sd-analytics-choice-v1';
let consent='unknown', started=false;
try{consent=localStorage.getItem(preferenceKey)||'unknown';}catch{}
window.dataLayer=window.dataLayer||[];
function gtag(){window.dataLayer.push(arguments);}
const cleanLocation=new URL(location.origin+location.pathname);
const allowed=/^(?:instagram|youtube|newsletter|social|organic|referral|IG-\d{3}(?:-[a-z0-9]+)?|SEO-\d{3})$/i;
for(const key of ['utm_source','utm_medium','utm_campaign','utm_content']){
  const value=new URLSearchParams(location.search).get(key);
  if(value&&allowed.test(value))cleanLocation.searchParams.set(key,value);
}
function startAnalytics(){
  if(started)return;started=true;
  window['ga-disable-'+measurementId]=false;
  gtag('js',new Date());
  gtag('config',measurementId,{page_location:cleanLocation.href,page_referrer:document.referrer?new URL(document.referrer).origin:'',allow_google_signals:false,allow_ad_personalization_signals:false});
  const tag=document.createElement('script');tag.async=true;
  tag.src='https://www.googletagmanager.com/gtag/js?id='+measurementId;
  document.head.append(tag);
}
function sdEvent(name,params={}){
  if(consent!=='yes'||!started)return;
  if(name==='site_search')gtag('event','sd_site_search',{results:Number(params.results)||0});
  else if(name==='guide_click')gtag('event','sd_guide_click',{guide:String(params.guide||'').slice(0,100)});
  else if(name==='outbound_click')gtag('event','sd_outbound_click',{destination:String(params.destination||''),category:String(params.category||'source')});
}
function choose(value){
  consent=value;try{localStorage.setItem(preferenceKey,value);}catch{}
  if(value==='yes'){window['ga-disable-'+measurementId]=false;startAnalytics();}
  else{
    window['ga-disable-'+measurementId]=true;
    for(const part of document.cookie.split(';')){
      const name=part.split('=')[0].trim();
      if(name==='_ga'||name.startsWith('_ga_')){
        document.cookie=name+'=; Max-Age=0; path=/';
        document.cookie=name+'=; Max-Age=0; path=/; domain='+location.hostname;
      }
    }
  }
  panel.hidden=true;
}
const style=document.createElement('style');
style.textContent='.sd-privacy-panel{position:fixed;z-index:9999;bottom:12px;left:12px;right:12px;max-width:640px;margin:auto;background:#fff;color:#173f3e;border:1px solid #b8d6d3;border-radius:12px;padding:16px;box-shadow:0 5px 24px #0002;font-size:14px;line-height:1.55}.sd-privacy-panel[hidden]{display:none}.sd-privacy-panel p{margin:8px 0}.sd-privacy-actions{display:flex;flex-wrap:wrap;gap:8px}.sd-privacy-actions button,.sd-privacy-settings{border:1px solid #286662;background:#fff;color:#173f3e;border-radius:6px;padding:8px 12px;font:inherit;cursor:pointer}.sd-privacy-settings{display:block;margin:12px auto;font-size:14px}';
document.head.append(style);
const panel=document.createElement('section');panel.className='sd-privacy-panel';
panel.setAttribute('aria-label','Privacy and analytics preferences');
panel.innerHTML='<strong>Help us improve Shirahama Days</strong><p>Optional Google Analytics measures visits, guide clicks and links to local information. Google may use cookies and process usage data. We do not send search text or contact information through our custom events. Choose whether to allow analytics; you can change your choice at any time.</p><p><a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener">How Google uses information</a> · <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">Google Analytics opt-out</a></p><div class="sd-privacy-actions"><button type="button" class="sd-accept">Allow analytics</button><button type="button" class="sd-decline">Reject analytics</button></div>';
const settings=document.createElement('button');settings.className='sd-privacy-settings';settings.type='button';settings.textContent='Privacy & analytics settings';
settings.addEventListener('click',()=>{panel.hidden=!panel.hidden;if(!panel.hidden)panel.querySelector('button').focus();});
panel.querySelector('.sd-accept').addEventListener('click',()=>choose('yes'));
panel.querySelector('.sd-decline').addEventListener('click',()=>choose('no'));
document.body.append(panel);
(document.querySelector('footer')||document.body).append(settings);
panel.hidden=consent==='yes'||consent==='no';
if(consent==='yes')startAnalytics();else window['ga-disable-'+measurementId]=true;
document.addEventListener('click', (event) => {
  const link=event.target.closest('a'); if(!link)return;
  const url=new URL(link.href,location.href);
  if(!['http:','https:'].includes(url.protocol))return;
  if(url.origin!==location.origin)sdEvent('outbound_click',{destination:url.origin+url.pathname,category:link.dataset.category||'source',page:location.pathname});
  else if(link.dataset.guide)sdEvent('guide_click',{guide:link.dataset.guide,page:location.pathname});
});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  document.querySelectorAll('[data-topic]').forEach(card=>card.hidden=button.dataset.filter!=='all'&&!card.dataset.topic.split(' ').includes(button.dataset.filter));
}));
