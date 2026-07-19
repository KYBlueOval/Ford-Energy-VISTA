(()=>{
  const cfg=window.FE_SECURITY_CONFIG||{};
  let token=sessionStorage.getItem('feVistaToken')||'', currentUser=null, permissions={}, records=[], badges=[], activeVisitors=[], activeLoadedAt=Date.now(), selectedVisitId='', selectedPhotoDataUrl='', selectedPhotoFileName='visitor-photo.jpg', operationCloseTimer=null;
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
      const d=await api('listVisits',{query:q,status});records=d.visits||[];renderRows();renderKpis(d.kpis||{});await loadActiveOperations();
      if(selectedVisitId){const updated=records.find(x=>x.visitId===selectedVisitId);if(updated)openRecord(updated);else selectedVisitId=''}
    } finally {$('#refreshBtn').disabled=false}
  }
  function renderKpis(k){$('#kExpected').textContent=k.expectedToday||0;$('#kOnsite').textContent=k.onsite||0;$('#kOut').textContent=k.checkedOutToday||0;$('#kOverdue').textContent=k.overdue||0}
  function durationText(minutes){const value=Math.max(0,Number(minutes||0)),hours=Math.floor(value/60),mins=value%60;return hours?`${hours}h ${mins}m`:`${mins}m`}
  async function loadActiveOperations(){
    try{const d=await api('listActiveOperations',{});activeVisitors=d.visits||[];activeLoadedAt=Date.now();$('#aOnsite').textContent=d.summary?.onsite||0;$('#aBadgesOut').textContent=d.summary?.badgesOut||0;$('#aOverdue').textContent=d.summary?.overdue||0;$('#aExceptions').textContent=d.summary?.badgeExceptions||0;$('#activeGenerated').textContent='Updated '+(d.generatedAt||'just now');renderActiveOperations(d.exceptions||[])}catch(e){$('#activeGenerated').textContent='Live accountability unavailable: '+e.message}
  }
  function renderActiveOperations(exceptions){const host=$('#activeVisitorRows');host.innerHTML=activeVisitors.map((v,i)=>`<article class="active-visitor ${v.overdue?'overdue':''}"><div class="active-identity"><div class="active-initial">${esc((v.fullName||'?').charAt(0))}</div><div><h3>${esc(v.fullName)}</h3><p>${esc(v.company||'—')} · Sponsor ${esc(v.sponsorName||'—')}</p></div></div><div class="active-facts"><span><b>Onsite</b><strong class="live-duration" data-base-minutes="${esc(v.onsiteMinutes||0)}">${durationText(v.onsiteMinutes)}</strong></span><span><b>Badge</b><strong>${esc(v.badgeNumber?'Visitor '+v.badgeNumber:v.badgeUid||'—')}</strong></span><span><b>Expected out</b><strong>${esc(v.expectedDeparture||'—')}</strong></span><span><b>Escort</b><strong>${esc(v.escortRequired||'Not specified')}</strong></span></div><div class="active-actions">${v.overdue?'<span class="overdue-flag">Overdue</span>':'<span class="onsite-flag">Onsite</span>'}<button data-active-open="${i}">Open / Check Out</button></div></article>`).join('');$('#activeEmpty').classList.toggle('hidden',activeVisitors.length>0);document.querySelectorAll('[data-active-open]').forEach(b=>b.onclick=()=>{const v=activeVisitors[+b.dataset.activeOpen];openRecord(v);document.querySelector('#detailPanel')?.scrollIntoView({behavior:'smooth',block:'start'})});const queue=$('#badgeExceptionQueue');queue.classList.toggle('hidden',!exceptions.length);queue.innerHTML=exceptions.length?`<div class="exception-title"><strong>Badge Exception Queue</strong><span>Administration review required</span></div>${exceptions.map(b=>`<div><b>Visitor Badge ${esc(b.badgeNumber||'Unnumbered')}</b><span>${esc(b.status)} · ${esc(b.badgeUid)}</span><small>${esc(b.notes||'No condition notes recorded.')}</small></div>`).join('')}`:'';updateActiveTimers()}
  function updateActiveTimers(){const extra=Math.floor((Date.now()-activeLoadedAt)/60000);document.querySelectorAll('.live-duration').forEach(el=>{el.textContent=durationText(Number(el.dataset.baseMinutes||0)+extra)})}
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
  async function loadBadgeInventory(){const d=await api('listBadges',{});badges=d.badges||[];return badges}
  function badgeByUid(uid){const wanted=normalizeBadgeUid(uid);return badges.find(b=>normalizeBadgeUid(b.badgeUid)===wanted)}
  async function openCheckInDialog(r){
    try{await loadBadgeInventory()}catch(e){notify('Badge inventory could not be loaded: '+e.message,'error');return}
    const available=badges.filter(b=>b.status==='Available');
    openOperationModal({eyebrow:'ARRIVAL & BADGE ASSIGNMENT',title:'Assign Badge and Check In',body:`<div class="operation-step"><p>Select an available visitor badge or scan its UID. Inventory status is verified again when check-in is submitted.</p><label>Available visitor badges<select id="modalAvailableBadge"><option value="">Scan a badge or choose from ${available.length} available</option>${available.map(b=>`<option value="${esc(b.badgeUid)}">Visitor Badge ${esc(b.badgeNumber||'Unnumbered')} · ${esc(b.badgeUid)}</option>`).join('')}</select></label><label>Badge UID<input id="modalBadgeUid" autocomplete="off" placeholder="Scan or enter badge UID"></label><div id="modalBadgeState" class="badge-state neutral">Waiting for a badge.</div><div id="unknownBadgeOverride" class="unknown-badge-override hidden">${permissions.registerUnknownBadge?`<label class="check-row"><input id="modalRegisterUnknown" type="checkbox"> Register this unknown UID during supervised check-in</label><label>New visitor badge number<input id="modalNewBadgeNumber" placeholder="Example: 0017"></label>`:'<strong>This UID is not registered.</strong> A Security Supervisor or Administrator must register it before check-in.'}</div><label>Officer name<input id="modalOfficerName" value="${esc(currentUser?.fullName||'')}"></label><label class="check-row"><input id="modalSponsorNotified" type="checkbox" checked> Sponsor has been notified</label><label class="check-row"><input id="modalIdRetained" type="checkbox" checked> Government ID retained when required</label><label>Operational notes<textarea id="modalCheckInNotes" placeholder="Escort, sponsor response, access restrictions, or other notes"></textarea></label></div>`,footer:`<button class="secondary" data-close-operation>Cancel</button><button id="modalReviewCheckIn">Review Check-In</button>`,onOpen:()=>{const uidInput=$('#modalBadgeUid'),select=$('#modalAvailableBadge'),state=$('#modalBadgeState'),override=$('#unknownBadgeOverride');const inspect=()=>{const value=uidInput.value.trim(),badge=badgeByUid(value);override.classList.add('hidden');if(!value){state.className='badge-state neutral';state.textContent='Waiting for a badge.';return}if(badge){state.className='badge-state '+(badge.status==='Available'?'available':'unavailable');state.innerHTML=`<strong>Visitor Badge ${esc(badge.badgeNumber||'Unnumbered')}</strong><span>${esc(badge.status)} · ${esc(badge.badgeUid)}</span>`}else{state.className='badge-state unknown';state.textContent='Unknown badge UID — supervisor registration required.';override.classList.remove('hidden')}};select.onchange=()=>{uidInput.value=select.value;inspect();uidInput.focus()};uidInput.addEventListener('input',inspect);uidInput.addEventListener('keydown',e=>{if(e.key==='Enter'){$('#modalReviewCheckIn').click()}});uidInput.focus();$('#modalReviewCheckIn').onclick=()=>{const badgeUid=uidInput.value.trim(),officerName=$('#modalOfficerName').value.trim(),badge=badgeByUid(badgeUid),registerUnknown=Boolean($('#modalRegisterUnknown')?.checked),badgeNumber=$('#modalNewBadgeNumber')?.value.trim()||'';if(!badgeUid||!officerName){notify('Badge UID and officer name are required.','error');return}if(badge&&badge.status!=='Available'){notify('This badge is '+badge.status.toLowerCase()+' and cannot be issued.','error');return}if(!badge&&!registerUnknown){notify('This badge is not registered. A supervisor override is required.','error');return}if(!badge&&registerUnknown&&!badgeNumber){notify('Enter the new visitor badge number.','error');return}const payload={badgeUid,officerName,badgeNumber,allowRegisterUnknownBadge:registerUnknown,notes:$('#modalCheckInNotes').value.trim(),idRetained:$('#modalIdRetained').checked,sponsorNotified:$('#modalSponsorNotified').checked};const displayNumber=badge?.badgeNumber||badgeNumber;openOperationModal({eyebrow:'CONFIRM CHECK-IN',title:'Confirm Badge Assignment',body:`${badgeSummary({...r,badgeNumber:displayNumber},badgeUid)}${!badge?'<div class="confirmation-warning supervisor">Supervisor override will register this UID as Visitor Badge '+esc(badgeNumber)+'.</div>':''}<div class="confirmation-warning">This will assign the badge and mark the visitor as <strong>Checked In</strong>.</div>`,footer:`<button id="modalBackCheckIn" class="secondary">Back</button><button id="modalConfirmCheckIn">Confirm Check-In</button>`,onOpen:()=>{$('#modalBackCheckIn').onclick=()=>openCheckInDialog(r);$('#modalConfirmCheckIn').onclick=async()=>{if(await act('checkInVisit',r.visitId,payload,'Visitor checked in and badge assigned.')){const updated=records.find(x=>x.visitId===r.visitId)||{...r,badgeUid,badgeNumber:displayNumber,status:'Checked In'};showOperationSuccess('Visitor Checked In','Badge assigned and visitor marked onsite.',updated);}}}})}}});
  }
  function openCheckOutDialog(r){
    openOperationModal({eyebrow:'CHECKOUT & BADGE RETURN',title:'Return Badge and Check Out',body:`<div class="operation-step"><p>Verify the returned badge UID and record its physical condition.</p><label>Returned badge UID<input id="modalReturnBadgeUid" value="${esc(r.badgeUid||'')}" autocomplete="off"></label><label>Badge condition<select id="modalBadgeCondition"><option>Available</option><option>Broken</option><option>Lost</option></select></label><div class="condition-guidance">Broken and Lost badges remain unavailable after checkout and require Administration review.</div><label>Officer name<input id="modalOutOfficerName" value="${esc(currentUser?.fullName||'')}"></label><label class="check-row"><input id="modalIdReturned" type="checkbox" checked> Retained government ID returned</label><label>Checkout notes<textarea id="modalOutNotes" placeholder="Badge condition, escort completion, or other notes"></textarea></label></div>`,footer:`<button class="secondary" data-close-operation>Cancel</button><button id="modalReviewCheckOut">Review Checkout</button>`,onOpen:()=>{$('#modalReturnBadgeUid').focus();$('#modalReviewCheckOut').onclick=()=>{const badgeUid=$('#modalReturnBadgeUid').value.trim(),officerName=$('#modalOutOfficerName').value.trim(),badgeCondition=$('#modalBadgeCondition').value;if(!badgeUid||!officerName){notify('Returned badge UID and officer name are required.','error');return}const payload={badgeUid,officerName,badgeCondition,notes:$('#modalOutNotes').value.trim(),idReturned:$('#modalIdReturned').checked};openOperationModal({eyebrow:'CONFIRM CHECKOUT',title:'Confirm Badge Return',body:`${badgeSummary(r,badgeUid)}<div class="confirmation-warning checkout">This will mark the visitor <strong>Checked Out</strong> and set the badge to <strong>${esc(badgeCondition)}</strong>.</div>`,footer:`<button id="modalBackCheckOut" class="secondary">Back</button><button id="modalConfirmCheckOut">Confirm Checkout</button>`,onOpen:()=>{$('#modalBackCheckOut').onclick=()=>openCheckOutDialog(r);$('#modalConfirmCheckOut').onclick=async()=>{if(await act('checkOutVisit',r.visitId,payload,'Visitor checked out and badge condition recorded.')){const updated=records.find(x=>x.visitId===r.visitId)||{...r,status:'Checked Out'};showOperationSuccess('Visitor Checked Out','Badge return and condition recorded.',updated);}}}})}}});
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
  $('#activeRefresh').onclick=loadActiveOperations;setInterval(updateActiveTimers,30000);
  $('#searchInput').addEventListener('keydown',e=>{if(e.key==='Enter')load()});
  $('#logoutBtn').onclick=async()=>{try{await api('logout')}catch(e){}sessionStorage.clear();location.reload()};
  if(!token)setTimeout(()=>$('#loginBadgeUid')?.focus(),100);
  if(token){try{currentUser=JSON.parse(sessionStorage.getItem('feVistaUser')||'null');permissions=JSON.parse(sessionStorage.getItem('feVistaPermissions')||'{}');showApp();load().catch(()=>{sessionStorage.clear();location.reload()})}catch(e){sessionStorage.clear()}}
})();
