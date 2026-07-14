(() => {
  console.info('Ford Energy VISTA public registration v1.3.0 Sprint 1.5 loaded');
  const cfg = window.FE_VISITOR_CONFIG || {};
  const form = document.querySelector('#registrationForm');
  const steps = [...document.querySelectorAll('.form-step')];
  const stepButtons = [...document.querySelectorAll('.step')];
  const agreementState = {};
  const sessionId = (() => {
    let value = sessionStorage.getItem('feVistaSessionId');
    if (!value) { value = (crypto.randomUUID?.() || `SES-${Date.now()}-${Math.random().toString(16).slice(2)}`); sessionStorage.setItem('feVistaSessionId', value); }
    return value;
  })();
  let currentStep = 1;
  let photoDataUrl = '';
  let originalPhotoDataUrl = '';
  let stream;

  const $ = s => document.querySelector(s);
  const nextBtn = $('#nextBtn'), backBtn = $('#backBtn'), submitBtn = $('#submitBtn');
  const agreementCheckboxes = [...document.querySelectorAll('[data-agreement-id]')];
  let sponsorDirectory = [];

  let selectedSponsor = null;
  let sponsorActiveIndex = -1;

  async function loadSponsorDirectory(){
    const search = $('#sponsorSearch');
    if (!search) return;

    search.placeholder = 'Loading saved Ford Energy sponsors…';
    search.disabled = true;

    try {
      const directoryUrl = new URL('./data/sponsors.json', window.location.href);
      directoryUrl.searchParams.set('v', '13015');
      const response = await fetch(directoryUrl.toString(), {
        method: 'GET',
        cache: 'no-store',
        credentials: 'same-origin'
      });

      if (!response.ok) {
        throw new Error(`Sponsor directory HTTP ${response.status}`);
      }

      const data = await response.json();
      const rows = Array.isArray(data) ? data : (Array.isArray(data.sponsors) ? data.sponsors : []);

      sponsorDirectory = rows.map(s => ({
        sponsorId: String(s.sponsorId || s.SponsorID || '').trim(),
        name: String(s.name || s.SponsorName || '').trim(),
        email: String(s.email || s.SponsorEmail || '').trim(),
        department: String(s.department || s.Department || '').trim(),
        keywords: String(s.keywords || s.SearchKeywords || '').trim()
      })).filter(s => s.name && s.email);

      search.placeholder = sponsorDirectory.length
        ? `Search ${sponsorDirectory.length} saved sponsor${sponsorDirectory.length === 1 ? '' : 's'} by name, email, department, or keyword`
        : 'No saved sponsors are configured — use manual entry';
      search.dataset.directoryCount = String(sponsorDirectory.length);
      delete search.dataset.directoryError;
      console.info('VISTA sponsor directory loaded from same-origin JSON:', sponsorDirectory.length, data.generatedAt || '');
    } catch (err) {
      console.error('Sponsor directory could not be loaded:', err);
      sponsorDirectory = [];
      search.placeholder = 'Sponsor directory unavailable — use manual entry';
      search.dataset.directoryError = String(err && err.message || err);
    } finally {
      search.disabled = false;
    }
  }

  function sponsorMatches(query){
    const q=String(query||'').trim().toLowerCase();
    if(!q)return sponsorDirectory.slice(0,12);
    return sponsorDirectory.filter(s=>[s.name,s.email,s.department,s.keywords].join(' ').toLowerCase().includes(q)).slice(0,12);
  }

  function renderSponsorResults(){
    const box=$('#sponsorResults'), search=$('#sponsorSearch');
    if(!box||!search||$('#manualSponsorToggle')?.checked){box?.classList.add('hidden');return}
    const matches=sponsorMatches(search.value);
    sponsorActiveIndex=-1;
    if(!matches.length){
      box.innerHTML='<div class="sponsor-empty">No saved sponsor matched. Select “My sponsor is not listed” to enter one manually.</div>';
    }else{
      box.innerHTML=matches.map((s,i)=>`<button type="button" class="sponsor-result" role="option" data-index="${i}" data-email="${escapeHtml(s.email)}"><strong>${escapeHtml(s.name)}</strong><span>${escapeHtml(s.department||'Department not listed')}</span><small>${escapeHtml(s.email)}</small></button>`).join('');
      box.querySelectorAll('.sponsor-result').forEach(btn=>btn.addEventListener('click',()=>selectSponsor(matches[Number(btn.dataset.index)])));
    }
    box.classList.remove('hidden');
  }

  function selectSponsor(sponsor){
    if(!sponsor)return;
    selectedSponsor=sponsor;
    $('#sponsorId').value=sponsor.sponsorId||'';
    $('#sponsorSource').value='Directory';
    $('#sponsorName').value=sponsor.name||'';
    $('#sponsorEmail').value=sponsor.email||'';
    $('#sponsorDepartment').value=sponsor.department||'';
    $('#sponsorSearch').value=sponsor.name||'';
    $('#sponsorResults').classList.add('hidden');
    $('#sponsorPicker').classList.add('has-selection');
  }

  function clearSponsorSelection(){
    selectedSponsor=null;
    $('#sponsorId').value='';
    $('#sponsorName').value='';
    $('#sponsorEmail').value='';
    $('#sponsorDepartment').value='';
    $('#sponsorPicker').classList.remove('has-selection');
  }

  function setManualSponsorMode(enabled){
    const search=$('#sponsorSearch');
    clearSponsorSelection();
    $('#sponsorSource').value=enabled?'Manual':'Directory';
    [$('#sponsorName'),$('#sponsorEmail'),$('#sponsorDepartment')].forEach(el=>{el.readOnly=!enabled;el.classList.toggle('manual-entry',enabled)});
    search.disabled=enabled;
    search.value='';
    search.placeholder=enabled?'Manual sponsor entry enabled':'Search by sponsor name, email, department, or keyword';
    $('#sponsorResults').classList.add('hidden');
    if(enabled)$('#sponsorName').focus();
  }

  $('#sponsorSearch')?.addEventListener('input',()=>{if(selectedSponsor&&$('#sponsorSearch').value!==selectedSponsor.name)clearSponsorSelection();renderSponsorResults()});
  $('#sponsorSearch')?.addEventListener('focus',renderSponsorResults);
  $('#sponsorSearch')?.addEventListener('keydown',e=>{
    const items=[...document.querySelectorAll('.sponsor-result')];
    if(e.key==='Escape'){$('#sponsorResults').classList.add('hidden');return}
    if(!items.length)return;
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){
      e.preventDefault();sponsorActiveIndex=(sponsorActiveIndex+(e.key==='ArrowDown'?1:-1)+items.length)%items.length;
      items.forEach((x,i)=>x.classList.toggle('active',i===sponsorActiveIndex));items[sponsorActiveIndex].scrollIntoView({block:'nearest'});
    }else if(e.key==='Enter'&&sponsorActiveIndex>=0){e.preventDefault();items[sponsorActiveIndex].click()}
  });
  $('#manualSponsorToggle')?.addEventListener('change',e=>setManualSponsorMode(e.target.checked));
  document.addEventListener('click',e=>{if(!e.target.closest('#sponsorPicker'))$('#sponsorResults')?.classList.add('hidden')});
  loadSponsorDirectory();

  function nowIso(){ return new Date().toISOString(); }
  function markAgreementPresented(key){
    if (!agreementState[key]) agreementState[key] = { presentedAt: nowIso() };
  }
  markAgreementPresented('SECURITY');

  function showStep(n) {
    currentStep = n;
    steps.forEach(x => x.classList.toggle('active', Number(x.dataset.step) === n));
    stepButtons.forEach(x => {
      const sn = Number(x.dataset.step);
      x.classList.toggle('active', sn === n); x.classList.toggle('complete', sn < n);
    });
    $('#progressText').textContent = `Step ${n} of 5`;
    $('#progressBar').style.width = `${n * 20}%`;
    backBtn.disabled = n === 1;
    nextBtn.classList.toggle('hidden', n === 5);
    submitBtn.classList.toggle('hidden', n !== 5);
    if (n === 4) markAgreementPresented(document.querySelector('.agreement-tab.active [data-agreement-id]')?.dataset.agreementId || 'SECURITY');
    if (n === 5) renderReview();
    scrollTo({top: 0, behavior: 'smooth'});
  }

  function validateStep(n) {
    const section = steps.find(x => Number(x.dataset.step) === n);
    const fields = [...section.querySelectorAll('[required]')];
    for (const field of fields) {
      if (!field.checkValidity()) { field.reportValidity(); field.focus(); return false; }
    }
    if (n === 2 && !$('#manualSponsorToggle').checked && !$('#sponsorId').value) {
      alert('Please search for and select a saved Ford Energy sponsor, or choose “My sponsor is not listed” for manual entry.');
      $('#sponsorSearch').focus();
      return false;
    }
    if (n === 3 && !photoDataUrl) { alert('Please upload or capture a government ID / passport-style visitor photograph.'); return false; }
    if (n === 4) {
      const unchecked = agreementCheckboxes.find(x => !x.checked);
      if (unchecked) {
        const panel = unchecked.closest('.agreement-content');
        document.querySelector(`.agreement-tab[data-agreement="${panel.dataset.agreement}"]`)?.click();
        alert('Please open, review, and acknowledge every required agreement and training section.');
        return false;
      }
    }
    return true;
  }

  nextBtn.addEventListener('click', () => { if (validateStep(currentStep)) showStep(Math.min(5, currentStep + 1)); });
  backBtn.addEventListener('click', () => showStep(Math.max(1, currentStep - 1)));
  stepButtons.forEach(btn => btn.addEventListener('click', () => { const n = Number(btn.dataset.step); if (n < currentStep || validateStep(currentStep)) showStep(n); }));

  $('#drivingToggle').addEventListener('change', e => $('#vehicleFields').classList.toggle('hidden', !e.target.checked));
  document.querySelectorAll('.agreement-tab').forEach(tab => tab.addEventListener('click', () => {
    document.querySelectorAll('.agreement-tab,.agreement-content').forEach(x => x.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.querySelector(`.agreement-content[data-agreement="${tab.dataset.agreement}"]`);
    panel.classList.add('active');
    const checkbox = panel.querySelector('[data-agreement-id]');
    if (checkbox) markAgreementPresented(checkbox.dataset.agreementId);
  }));

  agreementCheckboxes.forEach(box => box.addEventListener('change', () => {
    const id = box.dataset.agreementId;
    markAgreementPresented(id);
    agreementState[id].checked = box.checked;
    agreementState[id].checkedAt = box.checked ? nowIso() : '';
    box.closest('.agreement-content')?.classList.toggle('acknowledged', box.checked);
    const tab = document.querySelector(`.agreement-tab[data-agreement="${box.closest('.agreement-content').dataset.agreement}"]`);
    tab?.classList.toggle('acknowledged', box.checked);
    updateAgreementProgress();
  }));
  function updateAgreementProgress(){
    const done = agreementCheckboxes.filter(x => x.checked).length;
    $('#agreementProgressText').textContent = `${done} of ${agreementCheckboxes.length} acknowledged`;
    $('#agreementProgressBar').style.width = `${Math.round(done / agreementCheckboxes.length * 100)}%`;
  }

  function loadTrainingVideo(){
    const rawUrl = String(cfg.TRAINING_VIDEO_URL || '').trim();
    if (!rawUrl) return;
    const box = $('#trainingVideoContainer');
    const youtube = rawUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/i);
    const drive = rawUrl.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:[^#]*&)?id=)([a-zA-Z0-9_-]+)/i);
    const escaped = escapeHtml(rawUrl);
    if (youtube) {
      box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtube[1])}?rel=0" title="Ford Energy Site Awareness Training" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
      return;
    }
    if (drive) {
      box.innerHTML = `<iframe src="https://drive.google.com/file/d/${encodeURIComponent(drive[1])}/preview" title="Ford Energy Site Awareness Training" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
      return;
    }
    const video = document.createElement('video');
    video.controls = true;
    video.preload = 'metadata';
    video.playsInline = true;
    video.src = rawUrl;
    video.setAttribute('controlsList','nodownload');
    box.innerHTML = '';
    box.appendChild(video);
    const fallback = document.createElement('div');
    fallback.className = 'video-fallback hidden';
    fallback.innerHTML = `The embedded player could not load this file. <a href="${escaped}" target="_blank" rel="noopener">Open the training video in a new tab</a>.`;
    box.appendChild(fallback);
    video.addEventListener('error',()=>fallback.classList.remove('hidden'));
  }
  loadTrainingVideo();

  async function fileToCompressedDataUrl(file) {
    const data = await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)});
    return imageToIdCrop(data);
  }
  async function imageToIdCrop(dataUrl){
    const img = await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=dataUrl});
    const outW=900,outH=1200,target=outW/outH,source=img.width/img.height;
    let sx=0,sy=0,sw=img.width,sh=img.height;
    if(source>target){sw=img.height*target;sx=(img.width-sw)/2}else{sh=img.width/target;sy=(img.height-sh)/2}
    const c=document.createElement('canvas');c.width=outW;c.height=outH;
    c.getContext('2d').drawImage(img,sx,sy,sw,sh,0,0,outW,outH);
    return c.toDataURL('image/jpeg',.86);
  }
  function setPhoto(data){
    photoDataUrl=data; if(!originalPhotoDataUrl) originalPhotoDataUrl=data;
    $('#photoPreview').src=data;$('#photoPreview').style.display='block';$('#photoPlaceholder').style.display='none';
    $('#removePhotoBtn').classList.remove('hidden');$('#preparePhotoBtn').classList.remove('hidden');
  }
  $('#photoInput').addEventListener('change', async e => { if(e.target.files[0]) { originalPhotoDataUrl=''; setPhoto(await fileToCompressedDataUrl(e.target.files[0])); } });
  $('#removePhotoBtn').addEventListener('click',()=>{photoDataUrl='';originalPhotoDataUrl='';$('#photoPreview').removeAttribute('src');$('#photoPreview').style.display='none';$('#photoPlaceholder').style.display='block';$('#removePhotoBtn').classList.add('hidden');$('#preparePhotoBtn').classList.add('hidden')});
  $('#cameraBtn').addEventListener('click', async()=>{try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:1280},height:{ideal:1280}},audio:false});$('#cameraVideo').srcObject=stream;$('#cameraArea').classList.remove('hidden')}catch(e){alert('Camera access was unavailable. Use Upload Photo instead.')}});
  $('#captureBtn').addEventListener('click',async()=>{const v=$('#cameraVideo'),c=document.createElement('canvas');c.width=v.videoWidth;c.height=v.videoHeight;c.getContext('2d').drawImage(v,0,0);originalPhotoDataUrl='';setPhoto(await imageToIdCrop(c.toDataURL('image/jpeg',.9)));stream?.getTracks().forEach(t=>t.stop());$('#cameraArea').classList.add('hidden')});

  $('#preparePhotoBtn').addEventListener('click', async()=>{
    if(!originalPhotoDataUrl) originalPhotoDataUrl=photoDataUrl;
    const btn=$('#preparePhotoBtn'); btn.disabled=true; btn.textContent='Removing Background…';
    try{
      setPhoto(await removeBackgroundWithSegmentation(originalPhotoDataUrl));
      btn.textContent='Background Removed';
    } catch(err){
      console.error(err);
      alert('Background removal could not be completed. Confirm that the browser is online and try again. The original cropped photo has been retained.');
      setPhoto(originalPhotoDataUrl);
      btn.textContent='Remove Background';
    } finally { btn.disabled=false; }
  });

  async function removeBackgroundWithSegmentation(dataUrl){
    if(typeof SelfieSegmentation==='undefined') throw new Error('The background-removal model did not load.');
    const img=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=dataUrl});
    const segmenter=new SelfieSegmentation({locateFile:file=>`https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`});
    segmenter.setOptions({modelSelection:1,selfieMode:false});
    const result=await new Promise(async(resolve,reject)=>{
      let settled=false;
      const timer=setTimeout(()=>{if(!settled){settled=true;reject(new Error('Background removal timed out.'));}},20000);
      segmenter.onResults(r=>{if(!settled){settled=true;clearTimeout(timer);resolve(r);}});
      try{await segmenter.send({image:img});}catch(e){if(!settled){settled=true;clearTimeout(timer);reject(e);}}
    });
    const w=900,h=1200,c=document.createElement('canvas'),ctx=c.getContext('2d');c.width=w;c.height=h;
    ctx.save();
    ctx.clearRect(0,0,w,h);
    ctx.drawImage(result.segmentationMask,0,0,w,h);
    ctx.globalCompositeOperation='source-in';
    ctx.drawImage(img,0,0,w,h);
    ctx.globalCompositeOperation='destination-over';
    ctx.fillStyle='#d8eaf8';
    ctx.fillRect(0,0,w,h);
    ctx.restore();
    if(segmenter.close) await segmenter.close();
    return c.toDataURL('image/jpeg',.9);
  }

  function agreementRecords(){
    return agreementCheckboxes.map(box=>{
      const id=box.dataset.agreementId, panel=box.closest('.agreement-content'), state=agreementState[id]||{};
      return {agreementId:id,title:panel.dataset.title||'',version:cfg.AGREEMENT_VERSION||'2026.2',presentedAt:state.presentedAt||nowIso(),clientCheckedAt:state.checkedAt||'',checkboxAcknowledged:box.checked,completionStatus:box.checked?'Completed':'Incomplete'};
    });
  }
  function formObject(){
    const o=Object.fromEntries(new FormData(form).entries());
    o.driving=$('#drivingToggle').checked?'Yes':'No';o.photoDataUrl=photoDataUrl;
    o.agreementVersion=cfg.AGREEMENT_VERSION||'2026.2';o.clientTimestamp=nowIso();o.userAgent=navigator.userAgent;
    o.sessionId=sessionId;o.clientLanguage=navigator.language||'';o.clientTimeZone=Intl.DateTimeFormat().resolvedOptions().timeZone||'';o.referrer=document.referrer||'';
    o.agreements=agreementRecords(); return o;
  }
  function renderReview(){const d=formObject();const fields={Visitor:`${d.firstName||''} ${d.middleName||''} ${d.lastName||''}`.replace(/\s+/g,' ').trim(),Company:d.company,Email:d.email,Phone:d.phone,Sponsor:d.sponsorName,Department:d.department,'Visit period':`${d.startDate} ${d.arrivalTime} through ${d.endDate} ${d.departureTime}`,'Reason for visit':d.reason,'Requested access':d.accessScope,Vehicle:d.driving==='Yes'?`${d.vehicleYear||''} ${d.vehicleMake||''} ${d.vehicleModel||''} — ${d.licensePlate||''}`:'Not driving',Agreements:`${agreementCheckboxes.filter(x=>x.checked).length} of ${agreementCheckboxes.length} completed`};$('#reviewSummary').innerHTML=Object.entries(fields).map(([k,v])=>`<div class="review-card"><b>${k}</b>${escapeHtml(v||'—')}</div>`).join('')}
  function escapeHtml(v){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}

  $('#saveDraftBtn').addEventListener('click',()=>{localStorage.setItem('feVisitorDraft',JSON.stringify(formObject()));alert('Draft saved on this device.')});
  function restoreDraft(){try{const d=JSON.parse(localStorage.getItem('feVisitorDraft')||'null');if(!d)return;Object.entries(d).forEach(([k,v])=>{const el=form.elements[k];if(!el)return;if(el.type==='checkbox')el.checked=v==='Yes'||v===true||v==='on';else el.value=v||''});if(d.photoDataUrl){originalPhotoDataUrl='';setPhoto(d.photoDataUrl)}$('#vehicleFields').classList.toggle('hidden',!$('#drivingToggle').checked);agreementCheckboxes.forEach(b=>b.dispatchEvent(new Event('change')))}catch{}}
  restoreDraft();
  if ($('#sponsorSource').value === 'Manual') {
    $('#manualSponsorToggle').checked=true;
    $('#sponsorSearch').disabled=true;
    [$('#sponsorName'),$('#sponsorEmail'),$('#sponsorDepartment')].forEach(el=>{el.readOnly=false;el.classList.add('manual-entry')});
  }
  updateAgreementProgress();
  const today=new Date().toISOString().slice(0,10);form.acknowledgementDate.value=form.acknowledgementDate.value||today;form.startDate.min=today;form.endDate.min=today;

  form.addEventListener('submit', async e=>{
    e.preventDefault(); if(!validateStep(5))return;
    const msg=$('#submitMessage');msg.className='message';msg.textContent='Submitting registration…';msg.classList.remove('hidden');submitBtn.disabled=true;
    try{
      if(!cfg.API_URL||cfg.API_URL.includes('PASTE_')) throw new Error('The API URL has not been configured. Update public-registration/config.js.');
      const payload=formObject();
      const res=await fetch(cfg.API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:'createVisit',payload})});
      const data=await res.json();if(!data.ok)throw new Error(data.error||'Submission failed.');
      localStorage.removeItem('feVisitorDraft');$('#confirmationNumber').textContent=data.confirmationNumber;
      const qrPayload=data.qrPayload||JSON.stringify({confirmationNumber:data.confirmationNumber,visitId:data.visitId});
      $('#confirmationQr').innerHTML=''; if(window.QRCode)new QRCode($('#confirmationQr'),{text:qrPayload,width:180,height:180,correctLevel:QRCode.CorrectLevel.H});
      $('#confirmationSummary').innerHTML=[['Visitor',data.fullName||payload.firstName+' '+payload.lastName],['Visit dates',`${payload.startDate} – ${payload.endDate}`],['Sponsor',payload.sponsorName],['Status',data.status||'Submitted – Pending Review']].map(([k,v])=>`<div><b>${k}</b>${escapeHtml(v)}</div>`).join('');
      if(cfg.VGS_NAVIGATION_URL){$('#vgsLink').href=cfg.VGS_NAVIGATION_URL;$('#vgsLink').classList.remove('hidden')}
      $('#confirmationDialog').showModal();msg.classList.add('hidden');
    }catch(err){msg.className='message error';msg.textContent=err.message;submitBtn.disabled=false}
  });
})();
