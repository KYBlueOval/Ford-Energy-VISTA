(() => {
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
    const url = cfg.TRAINING_VIDEO_URL || '';
    if (!url) return;
    const box = $('#trainingVideoContainer');
    const youtube = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{6,})/i);
    if (youtube) box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtube[1])}" title="Ford Energy Site Awareness Training" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    else box.innerHTML = `<video controls preload="metadata"><source src="${escapeHtml(url)}">Your browser cannot play the training video.</video>`;
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
    const btn=$('#preparePhotoBtn'); btn.disabled=true; btn.textContent='Preparing…';
    try{ setPhoto(await replaceSimpleBackground(originalPhotoDataUrl)); btn.textContent='ID Photo Prepared'; }
    catch(err){ alert('The automatic background preparation could not confidently isolate the background. The cropped original photo has been retained.'); btn.textContent='Prepare ID Photo'; }
    finally{btn.disabled=false}
  });

  async function replaceSimpleBackground(dataUrl){
    const img=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=dataUrl});
    const c=document.createElement('canvas');c.width=900;c.height=1200;const ctx=c.getContext('2d');ctx.drawImage(img,0,0,c.width,c.height);
    const im=ctx.getImageData(0,0,c.width,c.height),d=im.data,w=c.width,h=c.height;
    const samples=[]; const step=20,band=50;
    for(let x=0;x<w;x+=step){for(let y=0;y<band;y+=step)samples.push(pixel(d,w,x,y));for(let y=h-band;y<h;y+=step)samples.push(pixel(d,w,x,y));}
    for(let y=0;y<h;y+=step){for(let x=0;x<band;x+=step)samples.push(pixel(d,w,x,y));for(let x=w-band;x<w;x+=step)samples.push(pixel(d,w,x,y));}
    const bg=samples.reduce((a,p)=>[a[0]+p[0],a[1]+p[1],a[2]+p[2]],[0,0,0]).map(v=>v/samples.length);
    const blue=[214,234,248];
    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      const i=(y*w+x)*4,dist=Math.hypot(d[i]-bg[0],d[i+1]-bg[1],d[i+2]-bg[2]);
      const edge=Math.min(x,y,w-1-x,h-1-y); const threshold=edge<80?92:58;
      if(dist<threshold){const a=Math.max(0,Math.min(1,(threshold-dist)/24));d[i]=d[i]*(1-a)+blue[0]*a;d[i+1]=d[i+1]*(1-a)+blue[1]*a;d[i+2]=d[i+2]*(1-a)+blue[2]*a;}
    }
    ctx.putImageData(im,0,0);return c.toDataURL('image/jpeg',.88);
  }
  function pixel(d,w,x,y){const i=(Math.floor(y)*w+Math.floor(x))*4;return[d[i],d[i+1],d[i+2]]}

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
  restoreDraft(); updateAgreementProgress();
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
