
// ── REVIEWS ──────────────────────────────────────────
const reviews=[
  {name:'Rahim Uddin',text:'Router টা অনেক ভালো, সিগন্যাল একদম স্ট্রং। দ্রুত ডেলিভারিও পেয়েছি।'},
  {name:'Nasrin Akter',text:'Voltage stabilizer কাজ করছে দারুণ, আমার ফ্রিজ এখন নিরাপদ।'},
  {name:'Kamal Hossain',text:'অরিজিনাল পণ্য পেয়েছি, দাম অনেক কম। আবার অর্ডার করবো।'},
  {name:'Sumaiya Islam',text:'UPS টা নিলাম, লোডশেডিংয়ে এখন আর সমস্যা নেই।'},
  {name:'Milon Chandra',text:'TP-Link router সেটআপ অনেক সহজ ছিল। ভালো সার্ভিস।'},
  {name:'Fatema Begum',text:'পণ্য হাতে পেয়ে টাকা দিয়েছি, কোনো ঝামেলা নেই।'},
  {name:'Jakir Hossain',text:'Converter নিলাম CCTV এর জন্য। পারফেক্ট কাজ হচ্ছে।'},
];
const track=document.getElementById('reviewsTrack');
[...reviews,...reviews].forEach(r=>{
  const c=document.createElement('div');
  c.className='review-card';
  c.innerHTML=`<div class="r-name">${r.name}</div><p>${r.text}</p><div class="r-stars">★★★★★</div>`;
  track.appendChild(c);
});

// ── ORDER LOGIC ───────────────────────────────────────
const pkgs=[
  {name:'TP-Link AC1200 Router',price:3500,icon:'📡'},
  {name:'TP-Link 300Mbps Router',price:1800,icon:'🌐'},
  {name:'Voltage Stabilizer 1000VA',price:2200,icon:'⚡'},
  {name:'UPS 650VA',price:4500,icon:'🔋'},
];
let selPkg=1, shipCost=100, shipLabel='ঢাকার বাইরে', payType='cod', qty=1;

const adminNumbers={
  'বিকাশ':'01518-380199',
  'নগদ':  '01518-469198',
  'রকেট': '01518-380199'
};

function fmt(n){return n.toLocaleString('en-BD')+'৳';}

function updateSummary(){
  const p=pkgs[selPkg];
  const subtotal=p.price*qty;
  const total=subtotal+shipCost;
  document.getElementById('sumThumb').textContent=p.icon;
  document.getElementById('sumProdName').textContent=p.name+' × '+qty;
  document.getElementById('sumProdPrice').textContent=fmt(subtotal);
  document.getElementById('sumSubtotal').textContent=fmt(subtotal);
  document.getElementById('sumShipping').textContent=shipLabel+': '+fmt(shipCost);
  document.getElementById('sumTotal').textContent=fmt(total);
  document.getElementById('confirmTotalBtn').textContent=fmt(total);
}

function changeQty(delta){
  qty=Math.max(1,Math.min(20,qty+delta));
  document.getElementById('qtyNum').textContent=qty;
  updateSummary();
}

function selectPkg(idx){
  selPkg=idx;
  document.querySelectorAll('.pkg-opt').forEach((el,i)=>{
    el.classList.toggle('selected',i===idx);
    el.querySelector('input').checked=(i===idx);
  });
  updateSummary();
}

function selectShip(el,cost,label){
  document.querySelectorAll('.ship-opt').forEach(o=>{
    o.classList.remove('selected');
    o.querySelector('input').checked=false;
  });
  el.classList.add('selected');
  el.querySelector('input').checked=true;
  shipCost=cost; shipLabel=label;
  updateSummary();
}

function orderProduct(name){
  const idx=pkgs.findIndex(p=>p.name.includes(name.split(' ')[0]));
  if(idx>=0) selectPkg(idx);
  document.getElementById('order').scrollIntoView({behavior:'smooth'});
}

function setPayType(type){
  payType=type;
  if(type==='cod'){
    document.getElementById('codInfo').style.display='block';
    document.getElementById('onlinePayFields').style.display='none';
    document.getElementById('btnCOD').className='pay-type-btn active-cod';
    document.getElementById('btnOnline').className='pay-type-btn inactive';
  } else {
    document.getElementById('codInfo').style.display='none';
    document.getElementById('onlinePayFields').style.display='block';
    document.getElementById('btnOnline').className='pay-type-btn active-online';
    document.getElementById('btnCOD').className='pay-type-btn inactive';
  }
}

function showPayInfo(){
  const method=document.getElementById('payMethod').value;
  const infoBox=document.getElementById('payInfo');
  if(method==='N/A'){ infoBox.style.display='none'; }
  else {
    infoBox.style.display='block';
    infoBox.innerHTML=`✅ <strong>${method}</strong> নম্বর: <strong>${adminNumbers[method]}</strong> — এই নম্বরে পেমেন্ট করুন`;
  }
}

function confirmOrder(){
  const n=document.getElementById('cname').value.trim();
  const a=document.getElementById('caddress').value.trim();
  const p=document.getElementById('cphone').value.trim();
  if(!n||!a||!p){ alert('অনুগ্রহ করে নাম, ঠিকানা ও ফোন নম্বর দিন।'); return; }

  const payMethod=payType==='cod'?'COD':(document.getElementById('payMethod').value||'N/A');
  const payNum=payType==='cod'?'N/A':(document.getElementById('payNumber').value.trim()||'N/A');
  const trx=payType==='cod'?'N/A':(document.getElementById('trxID').value.trim()||'N/A');

  const confirmBtn=document.querySelector('.btn-confirm');
  const origText=confirmBtn.innerHTML;
  confirmBtn.disabled=true;
  confirmBtn.innerHTML='⌛ অর্ডার প্রসেস হচ্ছে...';

  const p_data=pkgs[selPkg];
  const subtotal=p_data.price*qty;
  const total_val=subtotal+shipCost;

  const orderData={
    name:n, address:a, phone:p,
    product:p_data.name,
    quantity:qty,
    totalPrice:fmt(total_val),
    paymentMethod:payMethod,
    paymentNumber:payNum,
    trxID:trx
  };

  const scriptUrl="https://script.google.com/macros/s/AKfycbxSE0t15RoJ4eSBtJDB6oCjh2Z_oA8PzsujbG6QBAix9DXpXWtIIpXbCZnbziqrrrKgHA/exec";

  fetch(scriptUrl,{method:'POST',mode:'no-cors',cache:'no-cache',body:JSON.stringify(orderData)})
  .then(()=>{
    document.getElementById('cname').value='';
    document.getElementById('caddress').value='';
    document.getElementById('cphone').value='';
    qty=1; document.getElementById('qtyNum').textContent='1';
    if(payType==='online'){
      document.getElementById('payNumber').value='';
      document.getElementById('trxID').value='';
      document.getElementById('payMethod').value='N/A';
      document.getElementById('payInfo').style.display='none';
    }
    setPayType('cod');
    confirmBtn.disabled=false;
    confirmBtn.innerHTML=origText;
    updateSummary();
    const t=document.getElementById('toast');
    t.style.display='block';
    setTimeout(()=>{t.style.display='none';},5000);
  })
  .catch(err=>{
    console.error(err);
    alert('অর্ডারটি নেওয়া হয়েছে (টেস্ট মোড)।');
    confirmBtn.disabled=false;
    confirmBtn.innerHTML=origText;
  });
}
