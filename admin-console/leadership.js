(()=>{
  const cfg=window.FE_ADMIN_CONFIG||{};
  const $=selector=>document.querySelector(selector);
  const esc=value=>String(value??'').replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  let directory=[];

  const section=document.createElement('section');
  section.id='workspaceSponsorLeadership';
  section.className='card sponsor-leadership-admin admin-workspace hidden';
  section.dataset.adminWorkspace='sponsors';
  section.innerHTML=`
    <div class="leadership-admin-hero">
      <div>
        <p class="leadership-admin-kicker">PLANT LEADERSHIP &amp; SPONSOR GOVERNANCE</p>
        <h2>Sponsor Leadership Hierarchy</h2>
        <p>Build a governed chain of accountability from Plant Leadership through the OCM Sponsor and requestor to every visitor.</p>
      </div>
      <div class="leadership-admin-actions">
        <button id="sendLeadershipReports" class="secondary" type="button">Send Executive Reports</button>
        <button id="addSponsorLeadership" type="button">+ Build Sponsor Hierarchy</button>
      </div>
    </div>
    <div class="leadership-admin-body">
      <div class="leadership-workflow" aria-label="Sponsor governance hierarchy">
        <article class="plant"><i>01</i><b>Plant Leadership</b><span>Executive visibility, performance reporting, and governance oversight.</span></article>
        <article class="ocm"><i>02</i><b>OCM Sponsor · LL5</b><span>Organizational owner for Sponsor performance and two-week planning.</span></article>
        <article class="sponsor"><i>03</i><b>Sponsor / Requestor</b><span>Primary accountability for visitor approval, access, and visit planning.</span></article>
        <article class="visitor"><i>04</i><b>Visitor</b><span>Intake, arrival, day-of-visit supervision, and complete activity history.</span></article>
      </div>
      <div class="leadership-workflow-footer">
        <p><strong>Operational responsibility:</strong> Open a visitor in the Sponsor Portal to assign a salaried VISTA user for day-of-visit supervision and arrival notifications.</p>
        <a class="leadership-workflow-cta" href="../sponsor-portal/" target="_blank" rel="noopener">Open Sponsor Visitors →</a>
      </div>
      <div class="leadership-admin-section-head"><h3>Active hierarchy assignments</h3><span id="sponsorLeadershipCount">0 hierarchies</span></div>
      <div id="sponsorLeadershipRows" class="leadership-admin-rows"></div>
      <div id="sponsorLeadershipEmpty" class="leadership-empty">
        <span class="leadership-empty-icon">⌁</span><div><h3>No Sponsor hierarchy configured</h3><p>Create the first four-level relationship to activate OCM and executive oversight.</p></div>
        <button id="emptyAddSponsorLeadership" type="button">Build First Hierarchy</button>
      </div>
      <p id="sponsorLeadershipError" class="error hidden"></p>
    </div>`;
  $('#workspaceSponsorGovernance')?.after(section);

  const dialog=document.createElement('dialog');
  dialog.id='sponsorLeadershipDialog';
  dialog.className='sponsor-hierarchy-dialog';
  dialog.innerHTML=`
    <form method="dialog" id="sponsorLeadershipForm">
      <div class="dialog-head"><div><p class="eyebrow">GOVERNED SPONSOR ACCOUNTABILITY</p><h2>Build Sponsor Hierarchy</h2><p>Define each accountable level from Plant Leadership to the visitor requestor.</p></div><button id="sponsorLeadershipClose" type="button" class="close">×</button></div>
      <div class="hierarchy-preview" aria-hidden="true"><span>Plant Leadership</span><b>↓</b><span>OCM Sponsor · LL5</span><b>↓</b><span>Sponsor / Requestor</span><b>↓</b><span>Visitor</span></div>
      <div class="form-grid">
        <label>Plant Leader *<select id="leadershipLeader" required></select></label>
        <label>Plant leadership level *<input id="leadershipLevel" value="Plant Leadership" required placeholder="Plant Manager, APM, Site Director"></label>
        <label>OCM Sponsor / LL5 *<select id="leadershipOCM" required></select></label>
        <label>OCM hierarchy label<input id="leadershipOCMLevel" value="OCM Sponsor · LL5" placeholder="OCM Sponsor · LL5"></label>
        <label class="wide">Primary Sponsor / Requestor *<select id="leadershipSponsor" required></select></label>
        <label class="check"><input id="leadershipNotifications" type="checkbox" checked> Email hierarchy notifications</label>
        <label class="check"><input id="leadershipReports" type="checkbox" checked> Executive and two-week report access</label>
        <label class="wide">Governance notes<textarea id="leadershipNotes" placeholder="Operating area, reporting scope, or governance notes"></textarea></label>
      </div>
      <div class="dialog-actions"><button id="sponsorLeadershipCancel" type="button" class="secondary">Cancel</button><button id="sponsorLeadershipSave" type="submit">Create Hierarchy</button></div>
      <p id="sponsorLeadershipDialogMsg" class="error"></p>
    </form>`;
  document.body.append(dialog);

  ['#role','#roleFilter'].forEach(selector=>{
    const select=$(selector);
    if(select&&![...select.options].some(option=>option.value==='Plant Leader')){
      const option=document.createElement('option');option.textContent='Plant Leader';option.value='Plant Leader';
      const reporting=[...select.options].find(item=>item.value==='Reporting');reporting?select.insertBefore(option,reporting):select.append(option);
    }
  });
  const badgeStatus=$('#permanentBadgeStatus');
  if(badgeStatus){badgeStatus.innerHTML='<option value="">All processing stages</option><option>Pending Security Review</option><option>Approved for Production</option><option>Returned for Correction</option><option>In Production</option><option>Ready for Pickup</option><option>Issued</option><option>Denied</option><option>Closed</option><option>Cancelled</option>';badgeStatus.value='Pending Security Review';}

  async function api(action,payload={}){
    const token=sessionStorage.getItem('feVistaToken')||'';
    if(!cfg.API_URL)throw new Error('Administration API URL is not configured.');
    const response=await fetch(cfg.API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},cache:'no-store',body:JSON.stringify({action,token,payload})});
    const raw=await response.text();let data;
    try{data=JSON.parse(raw);}catch(_error){throw new Error('VISTA received a Google service page. Verify the current Apps Script deployment.');}
    if(!response.ok||!data.ok)throw new Error(data.error||'VISTA request failed.');
    return data;
  }

  function hierarchyRow(row){
    const missingOCM=!row.ocmSponsorName;
    return `<article class="leadership-admin-row ${missingOCM?'legacy-hierarchy':''}">
      <div class="leadership-hierarchy-path">
        <div class="hierarchy-node plant"><small>${esc(row.leaderLevel||'Plant Leadership')}</small><strong>${esc(row.leaderName||'Not assigned')}</strong><span>${esc(row.leaderEmail||'')}</span></div>
        <span class="hierarchy-arrow">→</span>
        <div class="hierarchy-node ocm"><small>${esc(row.ocmSponsorLevel||'OCM Sponsor · LL5')}</small><strong>${esc(row.ocmSponsorName||'OCM Sponsor not assigned')}</strong><span>${esc(row.ocmSponsorEmail||'Legacy hierarchy')}</span></div>
        <span class="hierarchy-arrow">→</span>
        <div class="hierarchy-node sponsor"><small>Primary Sponsor / Requestor</small><strong>${esc(row.sponsorName)}</strong><span>${esc(row.sponsorEmail)}</span></div>
        <span class="hierarchy-arrow">→</span>
        <div class="hierarchy-node visitor"><small>Visitor accountability</small><strong>Sponsored Visitors</strong><span>Intake · approval · arrival · activity</span></div>
      </div>
      <div class="hierarchy-row-footer"><div><span class="leadership-level-badge">${missingOCM?'OCM SETUP REQUIRED':'ACTIVE HIERARCHY'}</span><small>Reports ${row.reportAccess?'enabled':'disabled'} · Notifications ${row.notificationsEnabled?'enabled':'disabled'}${row.notes?' · '+esc(row.notes):''}</small></div><button type="button" data-end-leadership="${esc(row.hierarchyId)}">End Hierarchy</button></div>
    </article>`;
  }

  async function load(){
    const error=$('#sponsorLeadershipError');error.classList.add('hidden');
    try{
      const [leadership,governance]=await Promise.all([api('listSponsorLeadership',{}),api('listSponsorGovernance',{})]);
      directory=governance.directory||[];
      const rows=leadership.assignments||[];
      $('#sponsorLeadershipCount').textContent=`${rows.length} ${rows.length===1?'hierarchy':'hierarchies'}`;
      $('#sponsorLeadershipRows').innerHTML=rows.map(hierarchyRow).join('');
      $('#sponsorLeadershipEmpty').classList.toggle('hidden',rows.length>0);
      document.querySelectorAll('[data-end-leadership]').forEach(button=>button.onclick=()=>endAssignment(button.dataset.endLeadership));
    }catch(exception){error.textContent=exception.message;error.classList.remove('hidden');}
  }

  function optionList(prompt){return `<option value="">${prompt}</option>`+directory.map(user=>`<option value="${esc(user.userId)}">${esc(user.fullName)} · ${esc(user.role)} · ${esc(user.email)}</option>`).join('');}
  function open(){
    $('#leadershipLeader').innerHTML=optionList('Select Plant Leadership');
    $('#leadershipOCM').innerHTML=optionList('Select OCM Sponsor / LL5');
    $('#leadershipSponsor').innerHTML=optionList('Select primary Sponsor / requestor');
    $('#leadershipLevel').value='Plant Leadership';$('#leadershipOCMLevel').value='OCM Sponsor · LL5';$('#leadershipNotes').value='';$('#sponsorLeadershipDialogMsg').textContent='';
    dialog.showModal();
  }
  async function save(event){
    event.preventDefault();const button=$('#sponsorLeadershipSave'),message=$('#sponsorLeadershipDialogMsg');
    const payload={leaderUserId:$('#leadershipLeader').value,leaderLevel:$('#leadershipLevel').value.trim(),ocmSponsorUserId:$('#leadershipOCM').value,ocmSponsorLevel:$('#leadershipOCMLevel').value.trim(),sponsorUserId:$('#leadershipSponsor').value,notificationsEnabled:$('#leadershipNotifications').checked,reportAccess:$('#leadershipReports').checked,notes:$('#leadershipNotes').value.trim()};
    button.disabled=true;button.textContent='Creating…';
    try{const result=await api('saveSponsorLeadership',payload);dialog.close();alert(result.message);await load();}
    catch(exception){message.textContent=exception.message;}
    finally{button.disabled=false;button.textContent='Create Hierarchy';}
  }
  async function endAssignment(id){if(!confirm('End this complete Sponsor leadership hierarchy?'))return;try{const result=await api('endSponsorLeadership',{hierarchyId:id});alert(result.message);await load();}catch(exception){alert(exception.message);}}
  async function sendReports(){if(!confirm('Send the current Sponsor performance and two-week outlook email to enabled hierarchy leaders?'))return;const button=$('#sendLeadershipReports');button.disabled=true;try{const result=await api('sendSponsorLeadershipReports',{});alert(result.message+(result.failed?' '+result.failed+' failed.':''));}catch(exception){alert(exception.message);}finally{button.disabled=false;}}

  $('#addSponsorLeadership').onclick=open;$('#emptyAddSponsorLeadership').onclick=open;$('#sendLeadershipReports').onclick=sendReports;$('#sponsorLeadershipForm').onsubmit=save;$('#sponsorLeadershipClose').onclick=()=>dialog.close();$('#sponsorLeadershipCancel').onclick=()=>dialog.close();
  $('#navSponsorGovernance')?.addEventListener('click',()=>setTimeout(load,0));
  window.addEventListener('hashchange',()=>{if(location.hash==='#admin-sponsors')load();});
  if(location.hash==='#admin-sponsors')setTimeout(load,300);
})();
