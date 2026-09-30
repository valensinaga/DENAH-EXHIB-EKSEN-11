const SB_URL='https://otjcspxxeptsfapwknhg.supabase.co',SB_KEY='sb_publishable_FQAlcfV-KemT4cZ_CRJSUA_XBRF1dKN';
const DEMO=SB_URL.startsWith('ISI'),sb=DEMO?null:supabase.createClient(SB_URL,SB_KEY);
const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const rp=n=>'Rp '+(+n||0).toLocaleString('id-ID'),KB=d=>d.kebutuhan||[],sum=(a,f)=>a.reduce((s,x)=>s+(+f(x)||0),0);
const pc=d=>{const k=KB(d);return k.length?Math.round(k.filter(x=>x.done).length/k.length*100):0},cls=d=>'p'+(pc(d)>=100?2:pc(d)>0?1:0);
const SEED=[{id:'d1',nama:'Gapura Masuk',kategori:'Gapura',x:47,y:83.5,p:6,l:.8,t:4,pj:'Divisi Dekor',keterangan:'Gapura bambu di pintu masuk trotoar.',catatan:'',kebutuhan:[{nama:'Bambu',pcs:20,m:0,biaya:1200000,done:true},{nama:'Kain hitam',pcs:0,m:15,biaya:450000,done:false},{nama:'Tali ijuk',pcs:0,m:30,biaya:150000,done:false}]},
{id:'d2',nama:'Tenan 1',kategori:'Tenan',x:46,y:72,p:3,l:3,t:2.5,pj:'Divisi Acara',keterangan:'Tenan sisi kiri.',catatan:'',kebutuhan:[{nama:'bambu',pcs:10,m:0,biaya:600000,done:true},{nama:'Kain hitam',pcs:0,m:9,biaya:270000,done:true}]},
{id:'d3',nama:'Panggung Modern',kategori:'Panggung',x:14,y:22,p:8,l:5,t:.7,pj:'Divisi Acara',keterangan:'',catatan:'',kebutuhan:[]}];
let data=[],admin=false,z=1,filt='',q='',tab='l',kb=[];
const db={async all(){if(DEMO){try{return JSON.parse(localStorage.getItem('dm')||'null')||SEED}catch(e){return SEED}}const r=await sb.from('titik').select('*').order('created_at');if(r.error)throw r.error;return r.data},
async put(o){if(DEMO){if(!o.id)o.id='d'+Date.now();const i=data.findIndex(x=>x.id==o.id);i<0?data.push(o):data[i]=Object.assign(data[i],o);try{localStorage.setItem('dm',JSON.stringify(data))}catch(e){}return}
const {id,...w}=o,r=id?await sb.from('titik').update(w).eq('id',id):await sb.from('titik').insert(w);if(r.error)throw r.error},
async del(id){if(DEMO){data=data.filter(x=>x.id!=id);try{localStorage.setItem('dm',JSON.stringify(data))}catch(e){}return}const r=await sb.from('titik').delete().eq('id',id);if(r.error)throw r.error},
async img(b){if(DEMO)return new Promise(r=>{const f=new FileReader();f.onload=()=>r(f.result);f.readAsDataURL(b)});const p=Date.now()+'.jpg',u=await sb.storage.from('ref').upload(p,b,{contentType:'image/jpeg'});if(u.error)throw u.error;return sb.storage.from('ref').getPublicUrl(p).data.publicUrl}};
const toast=m=>{const t=$('#toast');t.textContent=m;t.style.display='block';setTimeout(()=>t.style.display='none',3500)};
async function load(){try{data=await db.all()}catch(e){return toast(e.message)}render()}
function rekap(){const m={};data.forEach((d,i)=>KB(d).forEach(k=>{const key=String(k.nama).trim().toLowerCase().replace(/\s+/g,' '),r=m[key]||(m[key]={nama:String(k.nama).trim(),pcs:0,m:0,biaya:0,dn:0,n:0,at:new Set()});r.pcs+=+k.pcs||0;r.m+=+k.m||0;r.biaya+=+k.biaya||0;r.n++;if(k.done)r.dn++;r.at.add(i+1)}));return Object.values(m).sort((a,b)=>a.nama.localeCompare(b.nama))}
function render(){const all=data.flatMap(KB),dn=all.filter(k=>k.done),pct=all.length?Math.round(dn.length/all.length*100):0;
$('#tot').textContent=rp(sum(all,k=>k.biaya));$('#real').textContent=rp(sum(dn,k=>k.biaya));$('#pct').textContent=pct+'%';$('#pb').style.width=pct+'%';$('#dn').textContent=dn.length;$('#al').textContent=all.length;$('#cnt').textContent=data.length;
const cats=[...new Set(data.map(d=>d.kategori).filter(Boolean))];$('#cat').innerHTML='<option value="">Semua kategori</option>'+cats.map(c=>`<option ${c==filt?'selected':''}>${esc(c)}</option>`).join('');
const L=data.map((d,i)=>({...d,n:i+1})).filter(d=>(!filt||d.kategori==filt)&&(!q||[d.nama,d.kategori,d.keterangan,d.pj].join(' ').toLowerCase().includes(q)));
$('#pins').innerHTML=L.map(d=>`<div class="pin ${cls(d)}" data-id="${d.id}" style="left:${d.x}%;top:${d.y}%">${d.n}</div>`).join('');
$('#list').innerHTML=L.map(d=>`<div class="row" data-id="${d.id}"><b class="n ${cls(d)}">${d.n}</b><div><div>${esc(d.nama)}</div><small>${esc(d.kategori)} · ${rp(sum(KB(d),k=>k.biaya))} · ${pc(d)}%</small></div></div>`).join('')||'<p class="mu">Belum ada titik.</p>';
const R=rekap();$('#rk').innerHTML=R.length?`<table><tr><th>Kebutuhan</th><th>Pcs</th><th>Meter</th><th>Biaya</th><th>Selesai</th><th>Titik</th></tr>${R.map(r=>`<tr><td>${esc(r.nama)}</td><td class="r">${r.pcs||'-'}</td><td class="r">${r.m||'-'}</td><td class="r">${rp(r.biaya)}</td><td>${r.dn}/${r.n}</td><td>${[...r.at].join(', ')}</td></tr>`).join('')}<tr><th>Total biaya</th><th></th><th></th><th class="r">${rp(sum(R,r=>r.biaya))}</th><th></th><th></th></tr></table>`:'<p class="mu">Belum ada kebutuhan.</p>'}
const M=h=>{$('#md').innerHTML=h;$('#ov').style.display='flex'},closeM=()=>$('#ov').style.display='none';$('#ov').onclick=e=>{if(e.target.id=='ov')closeM()};
function open(id){const d=data.find(x=>x.id==id),i=data.indexOf(d)+1;admin?form(d,i):view(d,i)}
function view(d,i){const k=KB(d);M(`<h2>#${i} ${esc(d.nama)}</h2><small>${esc(d.kategori)}</small>${d.gambar?`<img src="${esc(d.gambar)}">`:''}
<dl><dt>Ukuran P×L×T</dt><dd>${d.p||0} × ${d.l||0} × ${d.t||0} m</dd><dt>PJ</dt><dd>${esc(d.pj)||'-'}</dd><dt>Total biaya</dt><dd><b>${rp(sum(k,x=>x.biaya))}</b></dd><dt>Progres</dt><dd>${pc(d)}% <div class="bar"><i style="width:${pc(d)}%"></i></div></dd></dl>
<h4>Kebutuhan</h4>${k.map(x=>`<div class="ki ${x.done?'d':''}"><span>${x.done?'☑':'☐'} ${esc(x.nama)}</span><span>${x.pcs?x.pcs+' pcs ':''}${x.m?x.m+' m ':''}${rp(x.biaya)}</span></div>`).join('')||'<p class="mu">Belum ada.</p>'}
<h4>Keterangan</h4><p>${esc(d.keterangan)||'-'}</p><h4>Catatan</h4><p>${esc(d.catatan)||'-'}</p><div class="bt"><button id="cl">Tutup</button></div>`);$('#cl').onclick=closeM}
const kbH=()=>kb.map((k,i)=>`<div class="kr" data-i="${i}"><input data-f="nama" placeholder="Nama kebutuhan" value="${esc(k.nama)}"><input data-f="pcs" type="number" step="any" placeholder="Pcs" value="${k.pcs||''}"><input data-f="m" type="number" step="any" placeholder="Meter" value="${k.m||''}"><input data-f="biaya" type="number" step="any" placeholder="Biaya Rp" value="${k.biaya||''}"><label class="ck"><input data-f="done" type="checkbox" ${k.done?'checked':''}>✓</label><button data-x="1">✕</button></div>`).join('');
function form(d,i){kb=KB(d).map(x=>({...x}));const f=(k,t,n)=>`<label>${t}<input id="f_${k}" ${n?'type="number" step="any"':''} value="${esc(d[k])}"></label>`;
M(`<h2>${d.id?'Edit titik #'+i:'Titik baru'}</h2>${f('nama','Nama objek')}<label>Kategori<input id="f_kategori" list="kl" value="${esc(d.kategori)}"><datalist id="kl">${['Gapura','Sketsel','Stand','Tenan','Panggung','Torch','Dekor overhead','Pohon','Parkir','Lainnya'].map(x=>`<option>${x}`).join('')}</datalist></label>
<div class="g3">${f('p','Panjang (m)',1)}${f('l','Lebar (m)',1)}${f('t','Tinggi (m)',1)}</div>${f('pj','PJ')}
<h4>Daftar kebutuhan (centang jika sudah selesai)</h4><div id="kbl">${kbH()}</div><button id="kadd">＋ Tambah kebutuhan</button>
<label>Keterangan<textarea id="f_keterangan">${esc(d.keterangan)}</textarea></label><label>Catatan<textarea id="f_catatan">${esc(d.catatan)}</textarea></label>
<label>Gambar referensi<input type="file" id="f_file" accept="image/*"></label>${d.gambar?`<img src="${esc(d.gambar)}">`:''}
<div class="bt"><button class="pri" id="sv">Simpan</button>${d.id?'<button class="dg" id="dl">Hapus</button>':''}<button id="cl">Batal</button></div>`);
$('#cl').onclick=closeM;$('#sv').onclick=()=>save(d);$('#kadd').onclick=()=>{kb.push({nama:'',pcs:0,m:0,biaya:0,done:false});$('#kbl').innerHTML=kbH()};
$('#kbl').oninput=e=>{const r=e.target.closest('.kr'),k=e.target.dataset.f;if(r&&k)kb[r.dataset.i][k]=k=='done'?e.target.checked:e.target.value};
$('#kbl').onclick=e=>{if(e.target.dataset.x){kb.splice(e.target.closest('.kr').dataset.i,1);$('#kbl').innerHTML=kbH()}};
if(d.id)$('#dl').onclick=async()=>{if(!confirm('Hapus titik ini?'))return;try{await db.del(d.id);closeM();load()}catch(e){toast(e.message)}}}
const shrink=f=>new Promise(res=>{const im=new Image();im.onload=()=>{const k=Math.min(1,1200/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;c.getContext('2d').drawImage(im,0,0,c.width,c.height);c.toBlob(res,'image/jpeg',.8)};im.src=URL.createObjectURL(f)});
async function save(d){const g=k=>$('#f_'+k).value.trim(),n=k=>+$('#f_'+k).value||0;
const o={id:d.id,nama:g('nama')||'Tanpa nama',kategori:g('kategori'),p:n('p'),l:n('l'),t:n('t'),pj:g('pj'),keterangan:g('keterangan'),catatan:g('catatan'),x:d.x,y:d.y,gambar:d.gambar||null,kebutuhan:kb.filter(k=>String(k.nama).trim()).map(k=>({nama:String(k.nama).trim(),pcs:+k.pcs||0,m:+k.m||0,biaya:+k.biaya||0,done:!!k.done}))};
const fl=$('#f_file').files[0];$('#sv').disabled=true;try{if(fl)o.gambar=await db.img(await shrink(fl));await db.put(o);closeM();load()}catch(e){toast('Gagal: '+e.message);$('#sv').disabled=false}}
$('#list').onclick=e=>{const r=e.target.closest('.row');if(r)open(r.dataset.id)};
$('#pins').addEventListener('pointerdown',e=>{const p=e.target.closest('.pin');if(!p)return;const d=data.find(x=>x.id==p.dataset.id),r=$('#inner').getBoundingClientRect();let mv=false;
const m=ev=>{if(!admin)return;if(Math.hypot(ev.clientX-e.clientX,ev.clientY-e.clientY)>6)mv=true;if(mv){d.x=Math.min(100,Math.max(0,(ev.clientX-r.left)/r.width*100));d.y=Math.min(100,Math.max(0,(ev.clientY-r.top)/r.height*100));p.style.left=d.x+'%';p.style.top=d.y+'%'}};
addEventListener('pointermove',m);addEventListener('pointerup',async()=>{removeEventListener('pointermove',m);if(mv&&admin){try{await db.put({id:d.id,x:+d.x.toFixed(2),y:+d.y.toFixed(2)})}catch(e){toast(e.message)}}else open(d.id)},{once:true})});
$('#adminbar').onclick=()=>{document.body.classList.toggle('add');toast(document.body.classList.contains('add')?'Ketuk posisi di denah':'Batal')};
$('#inner').addEventListener('click',e=>{if(!document.body.classList.contains('add')||e.target.classList.contains('pin'))return;const r=$('#inner').getBoundingClientRect();document.body.classList.remove('add');form({x:+((e.clientX-r.left)/r.width*100).toFixed(2),y:+((e.clientY-r.top)/r.height*100).toFixed(2)},data.length+1)});
const setAdmin=a=>{admin=a;document.body.classList.toggle('admin',a);$('#auth').textContent=a?'Logout':'Login admin'};
$('#auth').onclick=async()=>{if(admin){if(!DEMO)await sb.auth.signOut();else setAdmin(false);return}if(DEMO)return setAdmin(true);
M(`<h2>Login admin</h2><label>Email<input id="em" type="email"></label><label>Password<input id="pw" type="password"></label><div class="bt"><button class="pri" id="go">Masuk</button><button id="cl">Batal</button></div>`);$('#cl').onclick=closeM;
$('#go').onclick=async()=>{const r=await sb.auth.signInWithPassword({email:$('#em').value,password:$('#pw').value});if(r.error)return toast(r.error.message);closeM()}};
if(DEMO)$('#demo').style.display='block';else sb.auth.onAuthStateChange((_,s)=>setAdmin(!!s));
const zm=k=>{z=Math.min(3,Math.max(1,z+k));$('#inner').style.width=z*100+'%'};$('#zi').onclick=()=>zm(.5);$('#zo').onclick=()=>zm(-.5);
const tb=t=>{tab=t;$('#tl').classList.toggle('on',t=='l');$('#tr').classList.toggle('on',t=='r');$('#list').style.display=$('#fl').style.display=t=='l'?'':'none';$('#rk').style.display=t=='r'?'':'none'};$('#tl').onclick=()=>tb('l');$('#tr').onclick=()=>tb('r');
$('#q').oninput=e=>{q=e.target.value.toLowerCase();render()};$('#cat').onchange=e=>{filt=e.target.value;render()};
load();