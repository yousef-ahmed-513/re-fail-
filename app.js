(() => {
const menu = window.MENU_DATA;
const extrasCategory = menu.find(c=>c.id==='extras');
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const state = {
  lang: localStorage.getItem('twitteyLang') || 'en',
  cart: JSON.parse(localStorage.getItem('twitteyCart') || '[]'),
  activeCategory: null,
  modal: {cat:null,item:null,qty:1,extras:[]}
};
const i18n = {
 en:{waiter:'Waiter',table:'Table',chooseCategory:'Choose a category',tapCategory:'Tap a photo to open the products.',search:'Search products or categories',noResults:'No matching products found.',back:'Back',products:'products',currentOrder:'Current order',emptyOrder:'No items added yet.',orderNote:'Order note',notePlaceholder:'Example: takeaway, no sugar...',total:'Total',copy:'Copy',print:'Print',clear:'Clear',chooseExtras:'Choose extras',itemNote:'Item note',itemNotePlaceholder:'Example: less ice, no sugar...',addOrder:'Add to order',order:'Order',install:'Install',added:'Added to order',copied:'Order copied',cleared:'Order cleared',qty:'Qty'},
 ar:{waiter:'الموظف',table:'الطاولة',chooseCategory:'اختر القسم',tapCategory:'اضغط على الصورة لفتح المنتجات.',search:'ابحث عن منتج أو قسم',noResults:'لا توجد نتائج مطابقة.',back:'رجوع',products:'منتجات',currentOrder:'الطلب الحالي',emptyOrder:'لم تتم إضافة منتجات بعد.',orderNote:'ملاحظة الطلب',notePlaceholder:'مثال: سفري، بدون سكر...',total:'الإجمالي',copy:'نسخ',print:'طباعة',clear:'مسح',chooseExtras:'اختر الإضافات',itemNote:'ملاحظة المنتج',itemNotePlaceholder:'مثال: ثلج خفيف، بدون سكر...',addOrder:'أضف إلى الطلب',order:'الطلب',install:'تثبيت',added:'تمت الإضافة إلى الطلب',copied:'تم نسخ الطلب',cleared:'تم مسح الطلب',qty:'الكمية'}
};
const t = key => i18n[state.lang][key] || key;
const nameOf = obj => state.lang==='ar' ? obj.nameAr : obj.name;
const money = n => `${Number(n).toFixed(3)} OMR`;

function save(){localStorage.setItem('twitteyCart',JSON.stringify(state.cart));localStorage.setItem('twitteyLang',state.lang)}
function applyLanguage(){
  const ar=state.lang==='ar';document.documentElement.lang=ar?'ar':'en';document.documentElement.dir=ar?'rtl':'ltr';
  $$('#langBtn').forEach(b=>b.textContent=ar?'English':'العربية');
  $$('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));
  $$('[data-placeholder]').forEach(el=>el.placeholder=t(el.dataset.placeholder));
  $('#cartFabLabel').textContent=t('order');$('#installBtn').textContent=t('install');
  renderCategories($('#searchInput').value); if(state.activeCategory) renderCategory(state.activeCategory); renderCart();
}
function renderCategories(query=''){
  const q=query.trim().toLowerCase(); const grid=$('#categoryGrid'); grid.innerHTML='';
  const filtered=menu.filter(c=> !q || [c.name,c.nameAr,...c.items.flatMap(i=>[i[0],i[1]])].join(' ').toLowerCase().includes(q));
  filtered.forEach(c=>{
    const btn=document.createElement('button');btn.className='category-card';
    btn.innerHTML=`<div class="cat-banner"><img src="assets/heroes/${c.image}" alt="${nameOf(c)}" loading="lazy"></div><div class="cat-label"><span>${c.icon} ${nameOf(c)}</span><em>${c.items.length} ${t('products')}</em></div>`;
    btn.onclick=()=>openCategory(c.id); grid.appendChild(btn);
  });
  $('#noResults').classList.toggle('hidden',filtered.length>0);
}
function openCategory(id){state.activeCategory=id;renderCategory(id);$('#homeView').classList.remove('active');$('#categoryView').classList.add('active');window.scrollTo({top:0,behavior:'smooth'});}
function renderCategory(id){
  const c=menu.find(x=>x.id===id);if(!c)return;
  $('#categoryHero').style.backgroundImage=`url('assets/heroes/${c.image}')`;$('#heroMeta').textContent=`${c.icon} ${nameOf(c)} · ${c.items.length} ${t('products')}`;
  const grid=$('#productGrid');grid.innerHTML='';c.items.forEach((i,idx)=>{
    const card=document.createElement('article');card.className='product-card';const thumb=i[3]?`<img src="assets/products/${i[3]}" alt="${i[0]}" loading="lazy" onerror="this.parentElement.innerHTML='<span>${c.icon}</span>'">`:`<span>${c.icon}</span>`;card.innerHTML=`<div class="product-thumb">${thumb}</div><div class="product-info"><h3>${state.lang==='ar'?i[1]:i[0]}</h3><p>${state.lang==='ar'?i[0]:i[1]}</p><p class="price">${money(i[2])}</p></div><button class="add-btn" aria-label="Add">+</button>`;
    card.querySelector('.add-btn').onclick=(e)=>{e.stopPropagation();openProductModal(c.id,idx)};card.onclick=()=>openProductModal(c.id,idx);grid.appendChild(card);
  });
}
function showHome(){state.activeCategory=null;$('#categoryView').classList.remove('active');$('#homeView').classList.add('active');window.scrollTo({top:0,behavior:'smooth'});}
function openProductModal(catId,itemIndex){
  const c=menu.find(x=>x.id===catId), i=c.items[itemIndex];state.modal={cat:c,item:i,itemIndex,qty:1,extras:[]};
  $('#modalThumb').style.backgroundImage=i[3]?`url('assets/products/${i[3]}')`:`url('assets/heroes/${c.image}')`;$('#modalCategory').textContent=nameOf(c);$('#modalName').textContent=state.lang==='ar'?i[1]:i[0];$('#modalPrice').textContent=money(i[2]);$('#modalQty').textContent='1';$('#itemNote').value='';
  $('#extrasBox').classList.toggle('hidden',catId==='extras');renderExtras();updateModalTotal();$('#productModal').classList.add('open');
}
function renderExtras(){const box=$('#extrasList');box.innerHTML='';extrasCategory.items.forEach((e,idx)=>{const row=document.createElement('div');row.className='extra-choice';row.innerHTML=`<label><input type="checkbox" data-idx="${idx}"><span>${state.lang==='ar'?e[1]:e[0]}</span></label><strong>+${money(e[2])}</strong>`;row.querySelector('input').onchange=ev=>{const n=Number(ev.target.dataset.idx);if(ev.target.checked)state.modal.extras.push(n);else state.modal.extras=state.modal.extras.filter(x=>x!==n);updateModalTotal()};box.appendChild(row)});}
function updateModalTotal(){const base=state.modal.item?.[2]||0;const ex=state.modal.extras.reduce((s,n)=>s+extrasCategory.items[n][2],0);$('#modalTotal').textContent=money((base+ex)*state.modal.qty)}
function addModalToCart(){
  const m=state.modal;if(!m.item)return;const key=`${m.cat.id}:${m.itemIndex}:${m.extras.sort().join(',')}:${$('#itemNote').value.trim()}`;
  const existing=state.cart.find(x=>x.key===key);const entry={key,catId:m.cat.id,itemIndex:m.itemIndex,qty:m.qty,extras:[...m.extras],note:$('#itemNote').value.trim()};if(existing)existing.qty+=m.qty;else state.cart.push(entry);save();renderCart();closeModal();toast(t('added'));
}
function cartEntryData(line){const c=menu.find(x=>x.id===line.catId),i=c.items[line.itemIndex];const extras=line.extras.map(n=>extrasCategory.items[n]);const unit=i[2]+extras.reduce((s,e)=>s+e[2],0);return {c,i,extras,unit,total:unit*line.qty};}
function renderCart(){
  const wrap=$('#cartItems');wrap.innerHTML='';let total=0,count=0;state.cart.forEach((line,idx)=>{const d=cartEntryData(line);total+=d.total;count+=line.qty;const el=document.createElement('div');el.className='cart-line';const extraText=d.extras.map(e=>state.lang==='ar'?e[1]:e[0]).join(', ');el.innerHTML=`<div><h4>${state.lang==='ar'?d.i[1]:d.i[0]}</h4>${extraText?`<p>+ ${extraText}</p>`:''}${line.note?`<p>📝 ${line.note}</p>`:''}<div class="cart-controls"><button data-act="minus">−</button><strong>${line.qty}</strong><button data-act="plus">+</button><button class="remove-line" data-act="remove">×</button></div></div><div class="line-total">${money(d.total)}</div>`;el.onclick=e=>{const act=e.target.dataset.act;if(!act)return;if(act==='plus')line.qty++;if(act==='minus')line.qty=Math.max(1,line.qty-1);if(act==='remove')state.cart.splice(idx,1);save();renderCart()};wrap.appendChild(el)});
  $('#cartTotal').textContent=money(total);$('#cartCount').textContent=count;$('#cartEmpty').classList.toggle('hidden',state.cart.length>0);wrap.classList.toggle('hidden',state.cart.length===0);
  const waiter=$('#waiterInput').value.trim()||'—',table=$('#tableInput').value.trim()||'—';$('#orderMeta').innerHTML=`<span>${t('waiter')}: ${waiter}</span><span>${t('table')}: ${table}</span><span>${new Date().toLocaleTimeString(state.lang==='ar'?'ar-OM':'en-GB',{hour:'2-digit',minute:'2-digit'})}</span>`;
}
function openCart(){renderCart();$('#cartDrawer').classList.add('open');$('#drawerBackdrop').classList.add('open')}
function closeCart(){$('#cartDrawer').classList.remove('open');$('#drawerBackdrop').classList.remove('open')}
function closeModal(){$('#productModal').classList.remove('open')}
function toast(msg){const el=$('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>el.classList.remove('show'),1600)}
function orderText(){
 const lines=[];lines.push('TWITTEY CAFFE & SWEET');lines.push(`${t('waiter')}: ${$('#waiterInput').value||'—'} | ${t('table')}: ${$('#tableInput').value||'—'}`);lines.push(new Date().toLocaleString(state.lang==='ar'?'ar-OM':'en-GB'));lines.push('--------------------');let total=0;
 state.cart.forEach(l=>{const d=cartEntryData(l);total+=d.total;lines.push(`${l.qty} × ${state.lang==='ar'?d.i[1]:d.i[0]} — ${money(d.total)}`);if(d.extras.length)lines.push(`  + ${d.extras.map(e=>state.lang==='ar'?e[1]:e[0]).join(', ')}`);if(l.note)lines.push(`  📝 ${l.note}`)});lines.push('--------------------');lines.push(`${t('total')}: ${money(total)}`);const note=$('#orderNote').value.trim();if(note)lines.push(`${t('orderNote')}: ${note}`);return lines.join('\n');
}
function buildPrint(){let total=0;let rows='';state.cart.forEach(l=>{const d=cartEntryData(l);total+=d.total;const ex=d.extras.map(e=>state.lang==='ar'?e[1]:e[0]).join(', ');rows+=`<tr><td>${l.qty}</td><td>${state.lang==='ar'?d.i[1]:d.i[0]}${ex?`<br><small>+ ${ex}</small>`:''}${l.note?`<br><small>${l.note}</small>`:''}</td><td>${money(d.total)}</td></tr>`});$('#printArea').innerHTML=`<div class="print-head"><h1>Twittey ☕</h1><p>CAFFE & SWEET</p></div><div class="print-meta"><span>${t('waiter')}: ${$('#waiterInput').value||'—'}</span><span>${t('table')}: ${$('#tableInput').value||'—'}</span><span>${new Date().toLocaleString(state.lang==='ar'?'ar-OM':'en-GB')}</span></div><table class="print-table"><thead><tr><th>${t('qty')}</th><th>${t('order')}</th><th>${t('total')}</th></tr></thead><tbody>${rows}</tbody></table><div class="print-total">${t('total')}: ${money(total)}</div>${$('#orderNote').value.trim()?`<div class="print-note">${t('orderNote')}: ${$('#orderNote').value}</div>`:''}`;}

$('#langBtn').onclick=()=>{state.lang=state.lang==='en'?'ar':'en';save();applyLanguage()};
$('#homeBrand').onclick=showHome;$('#backBtn').onclick=showHome;$('#searchInput').oninput=e=>{renderCategories(e.target.value);$('#clearSearch').classList.toggle('hidden',!e.target.value)};$('#clearSearch').onclick=()=>{$('#searchInput').value='';renderCategories();$('#clearSearch').classList.add('hidden')};
$('#cartFab').onclick=openCart;$('#closeCart').onclick=closeCart;$('#drawerBackdrop').onclick=closeCart;$('#closeModal').onclick=closeModal;$('#productModal').onclick=e=>{if(e.target===$('#productModal'))closeModal()};
$('#qtyMinus').onclick=()=>{state.modal.qty=Math.max(1,state.modal.qty-1);$('#modalQty').textContent=state.modal.qty;updateModalTotal()};$('#qtyPlus').onclick=()=>{state.modal.qty++;$('#modalQty').textContent=state.modal.qty;updateModalTotal()};$('#addToOrder').onclick=addModalToCart;
$('#waiterInput').value=localStorage.getItem('twitteyWaiter')||'';$('#tableInput').value=localStorage.getItem('twitteyTable')||'';$('#orderNote').value=localStorage.getItem('twitteyOrderNote')||'';
['waiterInput','tableInput'].forEach(id=>$('#'+id).oninput=e=>{localStorage.setItem(id==='waiterInput'?'twitteyWaiter':'twitteyTable',e.target.value);renderCart()});$('#orderNote').oninput=e=>localStorage.setItem('twitteyOrderNote',e.target.value);
$('#clearOrder').onclick=()=>{if(!state.cart.length)return;state.cart=[];save();renderCart();toast(t('cleared'))};
$('#copyOrder').onclick=async()=>{try{await navigator.clipboard.writeText(orderText());toast(t('copied'))}catch{const ta=document.createElement('textarea');ta.value=orderText();document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();toast(t('copied'))}};
$('#printOrder').onclick=()=>{buildPrint();window.print()};
setInterval(()=>{$('#clock').textContent=new Date().toLocaleString(state.lang==='ar'?'ar-OM':'en-GB',{weekday:'short',hour:'2-digit',minute:'2-digit'})},1000);
let deferredPrompt;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('#installBtn').classList.remove('hidden')});$('#installBtn').onclick=async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('#installBtn').classList.add('hidden')};
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js'));
applyLanguage();renderCategories();renderCart();
})();