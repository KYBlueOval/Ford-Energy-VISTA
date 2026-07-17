(()=>{
  const cfg=window.FE_SECURITY_CONFIG||{};
  let token=sessionStorage.getItem('feVistaToken')||'', currentUser=null, permissions={}, records=[], selectedVisitId='', selectedPhotoDataUrl='', selectedPhotoFileName='visitor-photo.jpg', operationCloseTimer=null;
  const visitPhotoCache=new Map(),visitPhotoLoads=new Map();
  const $=s=>document.querySelector(s);
  const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const roleAvatarClass=role=>{const k=String(role||'').toLowerCase().replace(/[^a-z]/g,'');if(k==='admin'||k==='superadministrator'||k==='superadmin')return'avatar-admin';if(k==='securitysupervisor')return'avatar-security-supervisor';if(k==='security'||k==='securityofficer'||k==='frontdesk')return'avatar-security';if(k==='sponsor')return'avatar-sponsor';if(k==='approver')return'avatar-approver';return'avatar-neutral'};

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

  function normalizeBadgeUid(value){return String(value||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'');}
  async function completeLogin(action,payload){
    const msg=$('#loginMsg');msg.textContent='Signing in…';
    try{
      const r=await fetch(cfg.API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action,payload:Object.assign({},payload,{userAgent:navigator.userAgent})})});
      const d=await r.json();if(!d.ok)throw new Error(d.error||'Login failed');
      token=d.token;currentUser=d.user;permissions=d.permissions||{};
      sessionStorage.setItem('feVistaToken',token);sessionStorage.setItem('feVistaUser',JSON.stringify(currentUser));sessionStorage.setItem('feVistaPermissions',JSON.stringify(permissions));
      msg.textContent='';showApp();await load();
    }catch(e){msg.textContent=e.message;if(action==='badgeLogin'){const input=$('#loginBadgeUid');if(input){input.value='';input.focus();}}}
  }
  async function login(){
    const username=$('#usernameInput').value.trim(),pin=$('#pinInput').value.trim();
    if(!username||!pin){$('#loginMsg').textContent='Enter your username and PIN.';return;}
    await completeLogin('pinLogin',{username,pin});
  }
  async function badgeLogin(){
    const badgeUid=normalizeBadgeUid($('#loginBadgeUid').value);
    if(!badgeUid){$('#loginMsg').textContent='Scan or enter a Ford Energy badge UID.';return;}
    await completeLogin('badgeLogin',{badgeUid});
  }
  function showApp(){ $('#loginView').classList.add('hidden');$('#appView').classList.remove('hidden');$('#logoutBtn').classList.remove('hidden');$('#apiStatus').textContent='Connected';$('#apiStatus').classList.add('online'); const label=$('#userRole');if(label)label.textContent=`${currentUser?.fullName||currentUser?.username||''} · ${currentUser?.role||''}`;const avatar=$('#sessionAvatar');avatar.classList.remove('avatar-admin','avatar-security','avatar-security-supervisor','avatar-sponsor','avatar-approver','avatar-neutral');avatar.classList.add(roleAvatarClass(currentUser?.role));loadSessionAvatar(); }
  async function loadSessionAvatar(){try{const d=await api('getUserPhoto',{}),img=$('#sessionAvatar');if(d.hasPhoto){img.src=d.dataUrl;img.classList.remove('hidden')}else img.classList.add('hidden')}catch(e){}}
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
    body.innerHTML=records.map((r,i)=>`<tr class="${r.visitId===selectedVisitId?'selected ':''}${rowStatusClass(r.status)}"><td><div class="visitor-cell"><div class="visitor-thumb ${r.hasPhoto?'photo-pending':''}" data-visit-photo="${esc(r.visitId)}" aria-label="${esc(r.fullName)} visitor photo"><span>${esc((r.fullName||'?').charAt(0))}</span></div><div><b>${esc(r.fullName)}</b><br><small>${esc(r.company)}</small></div></div></td><td>${esc(r.startDate)} ${esc(r.arrivalTime)}<br><small>${esc(r.confirmationNumber)}</small></td><td>${esc(r.sponsorName)}<br><small>${esc(r.department)}</small></td><td><span class="status ${statusClass(r.status)}">${esc(r.status)}</span></td><td>${esc(r.badgeUid||'—')}</td><td><button class="row-btn" data-i="${i}">Open</button></td></tr>`).join('');
    $('#emptyState').classList.toggle('hidden',records.length>0);
    document.querySelectorAll('.row-btn').forEach(b=>b.onclick=()=>openRecord(records[Number(b.dataset.i)]));
    loadVisitorThumbnails();
  }

  function cachedVisitPhoto(visitId){return visitPhotoCache.get(String(visitId||''))||null}
  async function fetchVisitPhoto(visitId){
    const key=String(visitId||'');if(!key)return null;
    if(visitPhotoCache.has(key))return visitPhotoCache.get(key);
    if(visitPhotoLoads.has(key))return visitPhotoLoads.get(key);
    const job=api('getVisitPhoto',{visitId:key}).then(d=>{const value=d.hasPhoto&&d.dataUrl?d:null;visitPhotoCache.set(key,value);return value}).catch(()=>{visitPhotoCache.set(key,null);return null}).finally(()=>visitPhotoLoads.delete(key));
    visitPhotoLoads.set(key,job);return job;
  }
  function paintVisitorThumbnail(visitId,data){document.querySelectorAll(`[data-visit-photo="${CSS.escape(String(visitId))}"]`).forEach(host=>{host.classList.remove('photo-pending');if(data&&data.dataUrl){host.innerHTML=`<img src="${data.dataUrl}" alt="" loading="lazy">`;host.classList.add('has-photo')}else host.classList.remove('has-photo')})}
  async function loadVisitorThumbnails(){
    const queue=records.filter(r=>r.hasPhoto).slice();let cursor=0;
    const worker=async()=>{while(cursor<queue.length){const r=queue[cursor++],cached=cachedVisitPhoto(r.visitId);if(cached!==null){paintVisitorThumbnail(r.visitId,cached);continue}const data=await fetchVisitPhoto(r.visitId);paintVisitorThumbnail(r.visitId,data)}};
    await Promise.all(Array.from({length:Math.min(4,queue.length)},worker));
  }
  function statusClass(status){return 'status-'+String(status||'submitted').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
  function rowStatusClass(status){return 'row-'+String(status||'submitted').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
  function photoPlaceholder(){return `<div class="photo photo-placeholder" id="visitorPhoto"><span>👤</span><small>No photo</small></div>`}
  function closeOperationModal(){clearInterval(operationCloseTimer);operationCloseTimer=null;const modal=$('#operationModal');modal.classList.add('hidden');$('#operationModalBody').innerHTML='';$('#operationModalFooter').innerHTML='';}
  function openOperationModal({eyebrow='VISITOR OPERATIONS',title,body,footer,onOpen}){
    $('#operationModalEyebrow').textContent=eyebrow;$('#operationModalTitle').textContent=title;$('#operationModalBody').innerHTML=body;$('#operationModalFooter').innerHTML=footer||'';$('#operationModal').classList.remove('hidden');if(onOpen)onOpen();
  }
  function badgeDisplay(r,badgeUid){const uid=String(badgeUid||r.badgeUid||'').trim(),number=String(r.badgeNumber||'').trim();return number?`Visitor Badge ${esc(number)} <span class="badge-divider">|</span> <span class="mono">${esc(uid||'Unknown UID')}</span>`:`<span class="mono">${esc(uid||'Unknown')}</span>`}
  function showOperationSuccess(title,message,r){let seconds=12;openOperationModal({eyebrow:'OPERATION COMPLETE',title,body:`<div class="operation-success"><div class="success-check">✓</div><p>${esc(message)}</p>${r?.badgeUid?`<div class="success-badge">${badgeDisplay(r,r.badgeUid)}</div>`:''}<p class="success-countdown">Returning to Visitor Operations in <strong id="operationCountdown">${seconds}</strong> seconds.</p></div>`,footer:'<button id="operationCloseNow">Close Now</button>',onOpen:()=>{$('#operationCloseNow').onclick=closeOperationModal;operationCloseTimer=setInterval(()=>{seconds--;const el=$('#operationCountdown');if(el)el.textContent=seconds;if(seconds<=0)closeOperationModal()},1000)}})}
  function badgeSummary(r,badgeUid){return `<div class="confirmation-summary"><div><b>Visitor</b><span>${esc(r.fullName)}</span></div><div><b>Confirmation</b><span>${esc(r.confirmationNumber)}</span></div><div><b>Badge UID</b><span class="mono">${esc(badgeUid||'—')}</span></div><div><b>Current status</b><span>${esc(r.status)}</span></div></div>`}
  function openCheckInDialog(r){
    openOperationModal({eyebrow:'ARRIVAL & BADGE ASSIGNMENT',title:'Assign Badge and Check In',body:`<div class="operation-step"><p>Scan or enter the visitor badge UID, then verify the check-in details.</p><label>Badge UID<input id="modalBadgeUid" autocomplete="off" placeholder="Scan or enter badge UID"></label><label>Officer name<input id="modalOfficerName" value="${esc(currentUser?.fullName||'')}"></label><label class="check-row"><input id="modalSponsorNotified" type="checkbox" checked> Sponsor has been notified</label><label class="check-row"><input id="modalIdRetained" type="checkbox" checked> Government ID retained when required</label><label>Operational notes<textarea id="modalCheckInNotes" placeholder="Escort, sponsor response, access restrictions, or other notes"></textarea></label></div>`,footer:`<button class="secondary" data-close-operation>Cancel</button><button id="modalReviewCheckIn">Review Check-In</button>`,onOpen:()=>{$('#modalBadgeUid').focus();$('#modalBadgeUid').addEventListener('keydown',e=>{if(e.key==='Enter')$('#modalReviewCheckIn').click()});$('#modalReviewCheckIn').onclick=()=>{const badgeUid=$('#modalBadgeUid').value.trim(),officerName=$('#modalOfficerName').value.trim();if(!badgeUid||!officerName){notify('Badge UID and officer name are required.','error');return}const payload={badgeUid,officerName,notes:$('#modalCheckInNotes').value.trim(),idRetained:$('#modalIdRetained').checked,sponsorNotified:$('#modalSponsorNotified').checked};openOperationModal({eyebrow:'CONFIRM CHECK-IN',title:'Confirm Badge Assignment',body:`${badgeSummary(r,badgeUid)}<div class="confirmation-warning">This will assign the badge and mark the visitor as <strong>Checked In</strong>.</div>`,footer:`<button id="modalBackCheckIn" class="secondary">Back</button><button id="modalConfirmCheckIn">Confirm Check-In</button>`,onOpen:()=>{$('#modalBackCheckIn').onclick=()=>openCheckInDialog(r);$('#modalConfirmCheckIn').onclick=async()=>{if(await act('checkInVisit',r.visitId,payload,'Visitor checked in and badge assigned.')){const updated=records.find(x=>x.visitId===r.visitId)||{...r,badgeUid,status:'Checked In'};showOperationSuccess('Visitor Checked In','Badge assigned and visitor marked onsite.',updated);}}}})}}});
  }
  function openCheckOutDialog(r){
    openOperationModal({eyebrow:'CHECKOUT & BADGE RETURN',title:'Return Badge and Check Out',body:`<div class="operation-step"><p>Verify the returned badge UID before completing checkout.</p><label>Returned badge UID<input id="modalReturnBadgeUid" value="${esc(r.badgeUid||'')}" autocomplete="off"></label><label>Officer name<input id="modalOutOfficerName" value="${esc(currentUser?.fullName||'')}"></label><label class="check-row"><input id="modalIdReturned" type="checkbox" checked> Retained government ID returned</label><label>Checkout notes<textarea id="modalOutNotes" placeholder="Badge condition, escort completion, or other notes"></textarea></label></div>`,footer:`<button class="secondary" data-close-operation>Cancel</button><button id="modalReviewCheckOut">Review Checkout</button>`,onOpen:()=>{$('#modalReturnBadgeUid').focus();$('#modalReviewCheckOut').onclick=()=>{const badgeUid=$('#modalReturnBadgeUid').value.trim(),officerName=$('#modalOutOfficerName').value.trim();if(!badgeUid||!officerName){notify('Returned badge UID and officer name are required.','error');return}const payload={badgeUid,officerName,notes:$('#modalOutNotes').value.trim(),idReturned:$('#modalIdReturned').checked};openOperationModal({eyebrow:'CONFIRM CHECKOUT',title:'Confirm Badge Return',body:`${badgeSummary(r,badgeUid)}<div class="confirmation-warning checkout">This will return the badge to inventory and mark the visitor as <strong>Checked Out</strong>.</div>`,footer:`<button id="modalBackCheckOut" class="secondary">Back</button><button id="modalConfirmCheckOut">Confirm Checkout</button>`,onOpen:()=>{$('#modalBackCheckOut').onclick=()=>openCheckOutDialog(r);$('#modalConfirmCheckOut').onclick=async()=>{if(await act('checkOutVisit',r.visitId,payload,'Visitor checked out and badge returned.')){const updated=records.find(x=>x.visitId===r.visitId)||{...r,status:'Checked Out'};showOperationSuccess('Visitor Checked Out','Badge returned and visitor marked offsite.',updated);}}}})}}});
  }
  async function loadBadgeHistory(r){
    const host=$('#badgeHistoryBody');if(!host)return;host.innerHTML='<div class="history-loading"><span class="spinner"></span> Loading activity…</div>';
    try{const d=await api('listVisitActivity',{visitId:r.visitId,badgeUid:r.badgeUid||''}),events=d.events||[];if(!events.length){host.innerHTML='<p class="history-empty">No badge or visitor activity has been recorded yet.</p>';return}host.innerHTML=events.map(e=>`<div class="history-event ${e.currentVisit?'current-visit':''}"><div class="history-dot"></div><div><b>${esc(String(e.eventType||'Activity').replace(/_/g,' '))}</b><span>${esc(e.eventTime)}</span><small>${esc([e.performedBy,e.badgeUid,e.details].filter(Boolean).join(' · '))}</small>${!e.currentVisit?`<em>Related badge history · ${esc(e.visitId)}</em>`:''}</div></div>`).join('')}catch(e){host.innerHTML=`<p class="history-empty error">${esc(e.message)}</p>`}
  }
  async function loadPhoto(r){
    if(!r.hasPhoto)return;
    const host=$('#visitorPhoto');if(!host)return;
    host.classList.add('loading');host.innerHTML='<span class="spinner"></span><small>Loading photo</small>';
    try{
      const d=await fetchVisitPhoto(r.visitId);
      if(selectedVisitId!==r.visitId)return;
      if(!d){host.classList.remove('loading');host.innerHTML='<span>👤</span><small>No photo</small>';return;}
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
        ${canCheckIn?`<div class="action-section approval-ready"><h3>Arrival & Badge Assignment</h3><div class="approval-banner allowed">Approved reservation — badge assignment and check-in are authorized.</div><button id="openCheckInDialog">Assign Badge & Check In</button></div>`:''}
        ${showLocked?`<div class="action-section approval-locked"><h3>Arrival & Badge Assignment</h3><div class="approval-banner blocked"><strong>Check-in prohibited.</strong><span>Status is ${esc(r.status)}. Badge assignment remains locked until the visit is Approved.</span></div><button disabled>Assign Badge & Check In — Approval Required</button></div>`:''}
        ${checkedIn&&permissions.checkOut?`<div class="action-section"><h3>Visitor Checkout</h3><div class="approval-banner allowed"><strong>Badge currently issued:</strong><span>${badgeDisplay(r,r.badgeUid)}</span></div><button id="openCheckOutDialog">Return Badge & Check Out</button></div>`:''}
        <div class="status-actions">${permissions.approve&&!approved&&!checkedIn&&!checkedOut&&!terminal?'<button id="approveAction" class="approved-button">Approve</button>':''}${permissions.deny&&!checkedIn&&!checkedOut&&!terminal?'<button id="denyAction" class="danger">Deny / Reject</button>':''}${permissions.noShow&&!checkedIn&&!checkedOut&&!terminal?'<button id="noShowAction" class="no-show-button">Mark No Show</button>':''}</div>
      </div>
      <section class="badge-history"><div class="badge-history-head"><div><p class="eyebrow">ACTIVITY & BADGE HISTORY</p><h3>Operational Timeline</h3></div><button id="refreshBadgeHistory" class="secondary compact">Refresh</button></div><div id="badgeHistoryBody"></div></section>`;
    $('#downloadPhotoBtn')?.addEventListener('click',()=>downloadPhoto(r));
    $('#openCheckInDialog')?.addEventListener('click',()=>openCheckInDialog(r));
    $('#openCheckOutDialog')?.addEventListener('click',()=>openCheckOutDialog(r));
    $('#approveAction')?.addEventListener('click',()=>confirmAct('Approve this visitor reservation?', 'updateVisitStatus',r.visitId,{status:'Approved'},'Visit approved.'));
    $('#denyAction')?.addEventListener('click',()=>confirmAct('Deny this visitor reservation?', 'updateVisitStatus',r.visitId,{status:'Denied'},'Visit denied/rejected.'));
    $('#noShowAction')?.addEventListener('click',()=>confirmAct('Mark this visitor as a no-show?', 'updateVisitStatus',r.visitId,{status:'No Show'},'Visit marked as no show.'));
    $('#refreshBadgeHistory')?.addEventListener('click',()=>loadBadgeHistory(r));
    if(permissions.viewPhoto)loadPhoto(r);loadBadgeHistory(r);
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
  async function confirmAct(question,action,visitId,extra,message){if(window.confirm(question))await act(action,visitId,extra,message)}
  async function act(action,visitId,extra,message){
    if(!visitId){notify('This record is missing its Visit ID. Refresh after deploying the updated Apps Script.','error');return}
    const buttons=[...document.querySelectorAll('.actions button')];buttons.forEach(b=>b.disabled=true);
    try{await api(action,{visitId,...extra});notify(message);await load();return true}
    catch(e){notify(e.message,'error');return false}
    finally{buttons.forEach(b=>b.disabled=false)}
  }

  $('#operationModalClose').onclick=closeOperationModal;document.querySelectorAll('[data-close-operation]').forEach(x=>x.addEventListener('click',closeOperationModal));$('#operationModal').addEventListener('click',e=>{if(e.target.matches('[data-close-operation]'))closeOperationModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#operationModal').classList.contains('hidden'))closeOperationModal()});
  $('#loginBtn').onclick=login;
  $('#badgeLoginBtn').onclick=badgeLogin;
  $('#loginBadgeUid').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();badgeLogin();}});
  $('#pinInput').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();login();}});
  $('#showPinLoginBtn').onclick=()=>{$('#badgeLoginPanel').classList.add('hidden');$('#pinLoginPanel').classList.remove('hidden');$('#showPinLoginBtn').classList.add('hidden');$('#usernameInput').focus();};
  $('#showBadgeLoginBtn').onclick=()=>{$('#pinLoginPanel').classList.add('hidden');$('#badgeLoginPanel').classList.remove('hidden');$('#showPinLoginBtn').classList.remove('hidden');$('#loginBadgeUid').focus();};
  $('#refreshBtn').onclick=load;$('#searchBtn').onclick=load;$('#statusFilter').onchange=load;
  $('#searchInput').addEventListener('keydown',e=>{if(e.key==='Enter')load()});
  $('#logoutBtn').onclick=async()=>{try{await api('logout')}catch(e){}sessionStorage.clear();location.reload()};
  if(!token)setTimeout(()=>$('#loginBadgeUid')?.focus(),100);
  if(token){try{currentUser=JSON.parse(sessionStorage.getItem('feVistaUser')||'null');permissions=JSON.parse(sessionStorage.getItem('feVistaPermissions')||'{}');showApp();load().catch(()=>{sessionStorage.clear();location.reload()})}catch(e){sessionStorage.clear()}}
})();
