(()=>{
  const cfg=window.FE_SECURITY_CONFIG||{};
  let pin=sessionStorage.getItem('feSecurityPin')||'', records=[], selectedVisitId='';
  const $=s=>document.querySelector(s);
  const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  async function api(action,payload={}){
    if(!cfg.API_URL||cfg.API_URL.includes('PASTE_')) throw new Error('Configure security-console/config.js with the Apps Script URL.');
    const r=await fetch(cfg.API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action,pin,payload})});
    const d=await r.json();
    if(!d.ok) throw new Error(d.error||'Request failed');
    return d;
  }

  function notify(message,type='success'){
    const toast=$('#toast');
    toast.textContent=message;
    toast.className=`toast ${type}`;
    clearTimeout(notify.timer);
    notify.timer=setTimeout(()=>toast.classList.add('hidden'),3800);
  }

  async function login(){
    pin=$('#pinInput').value.trim();
    try{await api('securityLogin');sessionStorage.setItem('feSecurityPin',pin);showApp();await load()}
    catch(e){$('#loginMsg').textContent=e.message}
  }
  function showApp(){
    $('#loginView').classList.add('hidden');$('#appView').classList.remove('hidden');$('#logoutBtn').classList.remove('hidden');
    $('#apiStatus').textContent='Connected';$('#apiStatus').classList.add('online');
  }
  async function load(){
    $('#refreshBtn').disabled=true;
    try{
      const q=$('#searchInput').value.trim(),status=$('#statusFilter').value;
      const d=await api('listVisits',{query:q,status});records=d.visits||[];renderRows();renderKpis(d.kpis||{});
      if(selectedVisitId){const updated=records.find(x=>x.visitId===selectedVisitId);if(updated)openRecord(updated);else selectedVisitId=''}
    } finally {$('#refreshBtn').disabled=false}
  }
  function renderKpis(k){$('#kExpected').textContent=k.expectedToday||0;$('#kOnsite').textContent=k.onsite||0;$('#kOut').textContent=k.checkedOutToday||0;$('#kOverdue').textContent=k.overdue||0}
  function renderRows(){
    const body=$('#visitorRows');
    body.innerHTML=records.map((r,i)=>`<tr class="${r.visitId===selectedVisitId?'selected':''}"><td><b>${esc(r.fullName)}</b><br><small>${esc(r.company)}</small></td><td>${esc(r.startDate)} ${esc(r.arrivalTime)}<br><small>${esc(r.confirmationNumber)}</small></td><td>${esc(r.sponsorName)}<br><small>${esc(r.department)}</small></td><td><span class="status ${statusClass(r.status)}">${esc(r.status)}</span></td><td>${esc(r.badgeUid||'—')}</td><td><button class="row-btn" data-i="${i}">Open</button></td></tr>`).join('');
    $('#emptyState').classList.toggle('hidden',records.length>0);
    document.querySelectorAll('.row-btn').forEach(b=>b.onclick=()=>openRecord(records[Number(b.dataset.i)]));
  }
  function statusClass(status){return String(status||'').toLowerCase().replaceAll(' ','-')}
  function photoPlaceholder(){return `<div class="photo photo-placeholder" id="visitorPhoto"><span>👤</span><small>No photo</small></div>`}
  async function loadPhoto(r){
    if(!r.hasPhoto)return;
    const host=$('#visitorPhoto');if(!host)return;
    host.classList.add('loading');host.innerHTML='<span class="spinner"></span><small>Loading photo</small>';
    try{
      const d=await api('getVisitPhoto',{visitId:r.visitId});
      if(selectedVisitId!==r.visitId)return;
      if(d.hasPhoto&&d.dataUrl){host.outerHTML=`<img id="visitorPhoto" class="photo" src="${d.dataUrl}" alt="Visitor photograph">`}
      else{host.classList.remove('loading');host.innerHTML='<span>👤</span><small>No photo</small>'}
    }catch(e){host.classList.remove('loading');host.innerHTML='<span>⚠</span><small>Photo unavailable</small>';notify(e.message,'error')}
  }
  function openRecord(r){
    selectedVisitId=r.visitId;renderRows();
    const checkedIn=r.status==='Checked In', checkedOut=r.status==='Checked Out', approved=r.status==='Approved';
    $('#detailPanel').innerHTML=`
      <div class="detail-head">${photoPlaceholder()}<div><p class="record-id">${esc(r.visitId)}</p><h2>${esc(r.fullName)}</h2><p>${esc(r.company)}</p><span class="status ${statusClass(r.status)}">${esc(r.status)}</span></div></div>
      <div class="detail-grid">${field('Confirmation',r.confirmationNumber)}${field('Sponsor',r.sponsorName)}${field('Department',r.department)}${field('Phone',r.phone)}${field('Visit period',`${r.startDate} ${r.arrivalTime} – ${r.endDate} ${r.departureTime}`)}${field('Access',r.accessScope)}${field('Reason',r.reason)}${field('Plate',[r.licensePlate,r.plateState].filter(Boolean).join(' · ')||'—')}${field('Check in',r.checkInTime||'—')}${field('Check out',r.checkOutTime||'—')}</div>
      <div class="actions">
        ${!checkedIn&&!checkedOut?`<div class="action-section"><h3>Arrival & Badge Assignment</h3><label>Badge UID<input id="badgeUid" placeholder="Scan or enter badge UID"></label><label>Officer name<input id="officerName" placeholder="Security officer"></label><label>Sponsor notification notes<textarea id="checkNotes" placeholder="Sponsor contacted, response, escort details..."></textarea></label><button id="checkInAction">Check In Visitor</button></div>`:''}
        ${checkedIn?`<div class="action-section"><h3>Visitor Checkout</h3><label>Returned badge UID<input id="returnBadgeUid" value="${esc(r.badgeUid||'')}"></label><label>Officer name<input id="outOfficerName" placeholder="Security officer"></label><label>Checkout notes<textarea id="outNotes" placeholder="Badge condition, ID returned, exceptions..."></textarea></label><button id="checkOutAction">Check Out Visitor</button></div>`:''}
        <div class="status-actions">${!approved&&!checkedIn&&!checkedOut?'<button id="approveAction" class="secondary">Mark Approved</button>':''}${!checkedIn&&!checkedOut&&r.status!=='No Show'?'<button id="noShowAction" class="danger">Mark No Show</button>':''}</div>
      </div>`;
    $('#checkInAction')?.addEventListener('click',()=>act('checkInVisit',r.visitId,{badgeUid:$('#badgeUid').value.trim(),officerName:$('#officerName').value.trim(),notes:$('#checkNotes').value.trim(),idRetained:true,sponsorNotified:true},'Visitor checked in successfully.'));
    $('#checkOutAction')?.addEventListener('click',()=>act('checkOutVisit',r.visitId,{badgeUid:$('#returnBadgeUid').value.trim(),officerName:$('#outOfficerName').value.trim(),notes:$('#outNotes').value.trim(),idReturned:true},'Visitor checked out successfully.'));
    $('#approveAction')?.addEventListener('click',()=>act('updateVisitStatus',r.visitId,{status:'Approved'},'Visit marked approved.'));
    $('#noShowAction')?.addEventListener('click',()=>act('updateVisitStatus',r.visitId,{status:'No Show'},'Visit marked as no show.'));
    loadPhoto(r);
  }
  function field(k,v){return`<div class="field"><b>${esc(k)}</b><span>${esc(v||'—')}</span></div>`}
  async function act(action,visitId,extra,message){
    if(!visitId){notify('This record is missing its Visit ID. Refresh after deploying the updated Apps Script.','error');return}
    try{await api(action,{visitId,...extra});notify(message);await load()}
    catch(e){notify(e.message,'error')}
  }

  $('#loginBtn').onclick=login;$('#pinInput').addEventListener('keydown',e=>{if(e.key==='Enter')login()});
  $('#refreshBtn').onclick=load;$('#searchBtn').onclick=load;$('#statusFilter').onchange=load;
  $('#searchInput').addEventListener('keydown',e=>{if(e.key==='Enter')load()});
  $('#logoutBtn').onclick=()=>{sessionStorage.clear();location.reload()};
  if(pin){showApp();load().catch(()=>{sessionStorage.clear();location.reload()})}
})();
