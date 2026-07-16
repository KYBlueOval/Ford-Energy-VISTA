(()=>{
  const cfg=window.FE_SECURITY_CONFIG||{};
  let token=sessionStorage.getItem('feVistaToken')||'', currentUser=null, permissions={}, records=[], selectedVisitId='', selectedPhotoDataUrl='', selectedPhotoFileName='visitor-photo.jpg';
  const $=s=>document.querySelector(s);
  const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  async function api(action,payload={}){
    if(!cfg.API_URL||cfg.API_URL.includes('PASTE_')) throw new Error('Configure security-console/config.js with the Apps Script URL.');
    const r=await fetch(cfg.API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action,token,payload})});
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
    const username=$('#usernameInput').value.trim(), pin=$('#pinInput').value.trim();
    try{
      const r=await fetch(cfg.API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:'login',payload:{username,pin,userAgent:navigator.userAgent}})});
      const d=await r.json();if(!d.ok)throw new Error(d.error||'Login failed');
      token=d.token;currentUser=d.user;permissions=d.permissions||{};sessionStorage.setItem('feVistaToken',token);sessionStorage.setItem('feVistaUser',JSON.stringify(currentUser));sessionStorage.setItem('feVistaPermissions',JSON.stringify(permissions));showApp();await load();
    }catch(e){$('#loginMsg').textContent=e.message}
  }
  function showApp(){ $('#loginView').classList.add('hidden');$('#appView').classList.remove('hidden');$('#logoutBtn').classList.remove('hidden');$('#apiStatus').textContent='Connected';$('#apiStatus').classList.add('online'); const label=$('#userRole');if(label)label.textContent=`${currentUser?.fullName||currentUser?.username||''} · ${currentUser?.role||''}`; }
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
    body.innerHTML=records.map((r,i)=>`<tr class="${r.visitId===selectedVisitId?'selected ':''}${rowStatusClass(r.status)}"><td><b>${esc(r.fullName)}</b><br><small>${esc(r.company)}</small></td><td>${esc(r.startDate)} ${esc(r.arrivalTime)}<br><small>${esc(r.confirmationNumber)}</small></td><td>${esc(r.sponsorName)}<br><small>${esc(r.department)}</small></td><td><span class="status ${statusClass(r.status)}">${esc(r.status)}</span></td><td>${esc(r.badgeUid||'—')}</td><td><button class="row-btn" data-i="${i}">Open</button></td></tr>`).join('');
    $('#emptyState').classList.toggle('hidden',records.length>0);
    document.querySelectorAll('.row-btn').forEach(b=>b.onclick=()=>openRecord(records[Number(b.dataset.i)]));
  }
  function statusClass(status){return 'status-'+String(status||'submitted').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
  function rowStatusClass(status){return 'row-'+String(status||'submitted').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
  function photoPlaceholder(){return `<div class="photo photo-placeholder" id="visitorPhoto"><span>👤</span><small>No photo</small></div>`}
  async function loadPhoto(r){
    if(!r.hasPhoto)return;
    const host=$('#visitorPhoto');if(!host)return;
    host.classList.add('loading');host.innerHTML='<span class="spinner"></span><small>Loading photo</small>';
    try{
      const d=await api('getVisitPhoto',{visitId:r.visitId});
      if(selectedVisitId!==r.visitId)return;
      if(d.hasPhoto&&d.dataUrl){
        selectedPhotoDataUrl=d.dataUrl;selectedPhotoFileName=validDownloadName(d.fileName)?d.fileName:photoFileName(r,d.mimeType);
        host.outerHTML=`<img id="visitorPhoto" class="photo" src="${d.dataUrl}" alt="Visitor photograph" title="${esc(selectedPhotoFileName)}">`;
        const download=$('#downloadPhotoBtn');if(download){download.disabled=false;download.textContent=`Download ${selectedPhotoFileName}`}
      }
      else{host.classList.remove('loading');host.innerHTML='<span>👤</span><small>No photo</small>'}
    }catch(e){host.classList.remove('loading');host.innerHTML='<span>⚠</span><small>Photo unavailable</small>';notify(e.message,'error')}
  }
  function openRecord(r){
    selectedVisitId=r.visitId;selectedPhotoDataUrl='';selectedPhotoFileName=r.photoFileName||photoFileName(r);renderRows();
    const checkedIn=r.status==='Checked In', checkedOut=r.status==='Checked Out', approved=r.status==='Approved';
    const terminal=['Denied','Rejected','No Show','Cancelled'].includes(r.status);
    const canCheckIn=approved&&!checkedIn&&!checkedOut&&permissions.checkIn;
    const showLocked=!checkedIn&&!checkedOut&&!canCheckIn&&permissions.checkIn;
    $('#detailPanel').innerHTML=`
      <div class="detail-head"><div class="photo-stack">${photoPlaceholder()}${r.hasPhoto?'<button id="downloadPhotoBtn" class="photo-download" disabled>Loading photo…</button>':''}</div><div><p class="record-id">${esc(r.visitId)}</p><h2>${esc(r.fullName)}</h2><p>${esc(r.company)}</p><span class="status ${statusClass(r.status)}">${esc(r.status)}</span></div></div>
      <div class="detail-grid">${field('Confirmation',r.confirmationNumber)}${field('Sponsor',r.sponsorName)}${field('Department',r.department)}${field('Phone',r.phone)}${field('Visit period',`${r.startDate} ${r.arrivalTime} – ${r.endDate} ${r.departureTime}`)}${field('Access',r.accessScope)}${field('Reason',r.reason)}${field('Plate',[r.licensePlate,r.plateState].filter(Boolean).join(' · ')||'—')}${field('Check in',r.checkInTime||'—')}${field('Check out',r.checkOutTime||'—')}</div>
      <div class="actions">
        ${canCheckIn?`<div class="action-section approval-ready"><h3>Arrival & Badge Assignment</h3><div class="approval-banner allowed">Approved reservation — badge assignment and check-in are authorized.</div><label>Badge UID<input id="badgeUid" placeholder="Scan or enter badge UID"></label><label>Officer name<input id="officerName" value="${esc(currentUser?.fullName||'')}"></label><label>Sponsor notification notes<textarea id="checkNotes" placeholder="Sponsor contacted, response, escort details..."></textarea></label><button id="checkInAction">Check In Visitor</button></div>`:''}
        ${showLocked?`<div class="action-section approval-locked"><h3>Arrival & Badge Assignment</h3><div class="approval-banner blocked"><strong>Check-in prohibited.</strong><span>Status is ${esc(r.status)}. Badge assignment remains locked until the visit is Approved.</span></div><label>Badge UID<input disabled placeholder="Approval required before badge scan"></label><label>Officer name<input disabled placeholder="Approval required"></label><button disabled>Check In Visitor — Approval Required</button></div>`:''}
        ${checkedIn&&permissions.checkOut?`<div class="action-section"><h3>Visitor Checkout</h3><label>Returned badge UID<input id="returnBadgeUid" value="${esc(r.badgeUid||'')}"></label><label>Officer name<input id="outOfficerName" value="${esc(currentUser?.fullName||'')}"></label><label>Checkout notes<textarea id="outNotes"></textarea></label><button id="checkOutAction">Check Out Visitor</button></div>`:''}
        <div class="status-actions">${permissions.approve&&!approved&&!checkedIn&&!checkedOut&&!terminal?'<button id="approveAction" class="approved-button">Approve</button>':''}${permissions.deny&&!checkedIn&&!checkedOut&&!terminal?'<button id="denyAction" class="danger">Deny / Reject</button>':''}${permissions.noShow&&!checkedIn&&!checkedOut&&!terminal?'<button id="noShowAction" class="no-show-button">Mark No Show</button>':''}</div>
      </div>`;
    $('#downloadPhotoBtn')?.addEventListener('click',()=>downloadPhoto(r));
    $('#checkInAction')?.addEventListener('click',()=>act('checkInVisit',r.visitId,{badgeUid:$('#badgeUid').value.trim(),officerName:$('#officerName').value.trim(),notes:$('#checkNotes').value.trim(),idRetained:true,sponsorNotified:true},'Visitor checked in successfully.'));
    $('#checkOutAction')?.addEventListener('click',()=>act('checkOutVisit',r.visitId,{badgeUid:$('#returnBadgeUid').value.trim(),officerName:$('#outOfficerName').value.trim(),notes:$('#outNotes').value.trim(),idReturned:true},'Visitor checked out successfully.'));
    $('#approveAction')?.addEventListener('click',()=>act('updateVisitStatus',r.visitId,{status:'Approved'},'Visit approved.'));
    $('#denyAction')?.addEventListener('click',()=>act('updateVisitStatus',r.visitId,{status:'Denied'},'Visit denied/rejected.'));
    $('#noShowAction')?.addEventListener('click',()=>act('updateVisitStatus',r.visitId,{status:'No Show'},'Visit marked as no show.'));
    if(permissions.viewPhoto)loadPhoto(r);
  }
  function validDownloadName(name){return /.+-.+\.(?:jpe?g|png|webp)$/i.test(String(name||''))}
  function photoFileName(r,mimeType){
    const clean=v=>String(v||'').trim().replace(/[\\\/:*?"<>|#%{}~&]/g,' ').replace(/\s+/g,' ').replace(/[. ]+$/g,'').slice(0,100);
    const name=clean(r.fullName)||'Visitor',company=clean(r.company)||'Unknown Company';const ext=String(mimeType||'').includes('png')?'png':String(mimeType||'').includes('webp')?'webp':'jpg';return `${name}-${company}.${ext}`;
  }
  function downloadPhoto(r){
    if(!selectedPhotoDataUrl){notify('The visitor photo is still loading.','error');return}
    const link=document.createElement('a');link.href=selectedPhotoDataUrl;link.download=selectedPhotoFileName||photoFileName(r);document.body.appendChild(link);link.click();link.remove();
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
  $('#logoutBtn').onclick=async()=>{try{await api('logout')}catch(e){}sessionStorage.clear();location.reload()};
  if(token){try{currentUser=JSON.parse(sessionStorage.getItem('feVistaUser')||'null');permissions=JSON.parse(sessionStorage.getItem('feVistaPermissions')||'{}');showApp();load().catch(()=>{sessionStorage.clear();location.reload()})}catch(e){sessionStorage.clear()}}
})();
