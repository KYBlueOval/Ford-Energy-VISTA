(() => {
  const cfg = window.FE_VISITOR_CONFIG || {};
  const form = document.querySelector('#registrationForm');
  const steps = [...document.querySelectorAll('.form-step')];
  const stepButtons = [...document.querySelectorAll('.step')];
  let currentStep = 1;
  let photoDataUrl = '';
  let stream;

  const $ = s => document.querySelector(s);
  const nextBtn = $('#nextBtn'), backBtn = $('#backBtn'), submitBtn = $('#submitBtn');

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
    if (n === 5) renderReview();
    scrollTo({top: 0, behavior: 'smooth'});
  }

  function validateStep(n) {
    const section = steps.find(x => Number(x.dataset.step) === n);
    const fields = [...section.querySelectorAll('[required]')];
    for (const field of fields) {
      if (!field.checkValidity()) { field.reportValidity(); field.focus(); return false; }
    }
    if (n === 3 && !photoDataUrl) { alert('Please upload or capture a visitor photograph.'); return false; }
    if (n === 4) {
      const unchecked = [...section.querySelectorAll('input[type=checkbox][required]')].find(x => !x.checked);
      if (unchecked) { alert('Please acknowledge every agreement tab.'); return false; }
    }
    return true;
  }

  nextBtn.addEventListener('click', () => { if (validateStep(currentStep)) showStep(Math.min(5, currentStep + 1)); });
  backBtn.addEventListener('click', () => showStep(Math.max(1, currentStep - 1)));
  stepButtons.forEach(btn => btn.addEventListener('click', () => { const n = Number(btn.dataset.step); if (n < currentStep || validateStep(currentStep)) showStep(n); }));

  $('#drivingToggle').addEventListener('change', e => $('#vehicleFields').classList.toggle('hidden', !e.target.checked));
  document.querySelectorAll('.agreement-tab').forEach(tab => tab.addEventListener('click', () => {
    document.querySelectorAll('.agreement-tab,.agreement-content').forEach(x => x.classList.remove('active'));
    tab.classList.add('active'); document.querySelector(`.agreement-content[data-agreement="${tab.dataset.agreement}"]`).classList.add('active');
  }));

  async function fileToCompressedDataUrl(file) {
    const data = await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)});
    const img = await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=data});
    const max=1200, scale=Math.min(1,max/Math.max(img.width,img.height));
    const c=document.createElement('canvas');c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);
    c.getContext('2d').drawImage(img,0,0,c.width,c.height); return c.toDataURL('image/jpeg',.82);
  }
  function setPhoto(data){photoDataUrl=data;$('#photoPreview').src=data;$('#photoPreview').style.display='block';$('#photoPlaceholder').style.display='none';$('#removePhotoBtn').classList.remove('hidden')}
  $('#photoInput').addEventListener('change', async e => { if(e.target.files[0]) setPhoto(await fileToCompressedDataUrl(e.target.files[0])); });
  $('#removePhotoBtn').addEventListener('click',()=>{photoDataUrl='';$('#photoPreview').removeAttribute('src');$('#photoPreview').style.display='none';$('#photoPlaceholder').style.display='block';$('#removePhotoBtn').classList.add('hidden')});
  $('#cameraBtn').addEventListener('click', async()=>{try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false});$('#cameraVideo').srcObject=stream;$('#cameraArea').classList.remove('hidden')}catch(e){alert('Camera access was unavailable. Use Choose Photo instead.')}});
  $('#captureBtn').addEventListener('click',()=>{const v=$('#cameraVideo'),c=document.createElement('canvas');c.width=v.videoWidth;c.height=v.videoHeight;c.getContext('2d').drawImage(v,0,0);setPhoto(c.toDataURL('image/jpeg',.82));stream?.getTracks().forEach(t=>t.stop());$('#cameraArea').classList.add('hidden')});

  function formObject(){const o=Object.fromEntries(new FormData(form).entries());o.driving=$('#drivingToggle').checked?'Yes':'No';o.photoDataUrl=photoDataUrl;o.agreementVersion=cfg.AGREEMENT_VERSION||'2026.1';o.clientTimestamp=new Date().toISOString();o.userAgent=navigator.userAgent;return o}
  function renderReview(){const d=formObject();const fields={Visitor:`${d.firstName||''} ${d.middleName||''} ${d.lastName||''}`.replace(/\s+/g,' ').trim(),Company:d.company,Email:d.email,Phone:d.phone,Sponsor:d.sponsorName,Department:d.department,'Visit period':`${d.startDate} ${d.arrivalTime} through ${d.endDate} ${d.departureTime}`,'Reason for visit':d.reason,'Requested access':d.accessScope,Vehicle:d.driving==='Yes'?`${d.vehicleYear||''} ${d.vehicleMake||''} ${d.vehicleModel||''} — ${d.licensePlate||''}`:'Not driving'};$('#reviewSummary').innerHTML=Object.entries(fields).map(([k,v])=>`<div class="review-card"><b>${k}</b>${escapeHtml(v||'—')}</div>`).join('')}
  function escapeHtml(v){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}

  $('#saveDraftBtn').addEventListener('click',()=>{localStorage.setItem('feVisitorDraft',JSON.stringify(formObject()));alert('Draft saved on this device.')});
  function restoreDraft(){try{const d=JSON.parse(localStorage.getItem('feVisitorDraft')||'null');if(!d)return;Object.entries(d).forEach(([k,v])=>{const el=form.elements[k];if(!el)return;if(el.type==='checkbox')el.checked=v==='Yes'||v===true;else el.value=v||''});if(d.photoDataUrl)setPhoto(d.photoDataUrl);$('#vehicleFields').classList.toggle('hidden',!$('#drivingToggle').checked)}catch{}}
  restoreDraft();
  const today=new Date().toISOString().slice(0,10);form.acknowledgementDate.value=today;form.startDate.min=today;form.endDate.min=today;

  form.addEventListener('submit', async e=>{
    e.preventDefault(); if(!validateStep(5))return;
    const msg=$('#submitMessage');msg.className='message';msg.textContent='Submitting registration…';msg.classList.remove('hidden');submitBtn.disabled=true;
    try{
      if(!cfg.API_URL||cfg.API_URL.includes('PASTE_')) throw new Error('The API URL has not been configured. Update public-registration/config.js.');
      const res=await fetch(cfg.API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action:'createVisit',payload:formObject()})});
      const data=await res.json();if(!data.ok)throw new Error(data.error||'Submission failed.');
      localStorage.removeItem('feVisitorDraft');$('#confirmationNumber').textContent=data.confirmationNumber;$('#confirmationDialog').showModal();msg.classList.add('hidden');
    }catch(err){msg.className='message error';msg.textContent=err.message;submitBtn.disabled=false}
  });
})();
