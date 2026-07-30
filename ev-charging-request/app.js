(()=>{
  'use strict';
  const cfg=window.FE_EV_CHARGING_CONFIG||{},$=selector=>document.querySelector(selector),form=$('#evRequestForm');
  const reviewToken=new URLSearchParams(location.search).get('review')||'';
  let policy=null,currentStep=1,submitting=false;

  function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function values(){return Object.fromEntries(new FormData(form).entries())}
  function setMessage(element,text,type='error'){element.textContent=text;element.className='message '+type;element.classList.toggle('hidden',!text)}
  function fordEmail(value){return/^[^@\s]+@(?:[A-Za-z0-9-]+\.)*ford\.com$/i.test(String(value||'').trim())}

  function jsonpRequest(action,params={},timeoutMs=20000){
    return new Promise((resolve,reject)=>{
      if(!cfg.API_URL||cfg.API_URL.includes('PASTE_')){reject(new Error('The VISTA API URL is not configured.'));return}
      const callback=`__vistaEV_${Date.now()}_${Math.random().toString(36).slice(2)}`,script=document.createElement('script');
      let settled=false;
      const finish=(fn,value)=>{if(settled)return;settled=true;clearTimeout(timer);script.remove();try{delete window[callback]}catch{window[callback]=undefined}fn(value)};
      window[callback]=data=>finish(resolve,data);
      script.onerror=()=>finish(reject,new Error('The VISTA service could not be reached.'));
      const url=new URL(cfg.API_URL);url.searchParams.set('action',action);url.searchParams.set('callback',callback);url.searchParams.set('_',Date.now());
      Object.entries(params).forEach(([key,value])=>url.searchParams.set(key,value));
      script.src=url.toString();document.head.appendChild(script);
      const timer=setTimeout(()=>finish(reject,new Error('The VISTA service request timed out.')),timeoutMs);
    });
  }

  function bridgeSubmit(action,payload){
    return new Promise((resolve,reject)=>{
      const requestId=`EV-${Date.now()}-${Math.random().toString(36).slice(2)}`,iframeName=`vista-ev-${requestId.replace(/[^A-Za-z0-9_-]/g,'')}`;
      const iframe=document.createElement('iframe'),bridge=document.createElement('form');
      iframe.name=iframeName;iframe.title='VISTA EV charging request submission';iframe.hidden=true;
      bridge.method='POST';bridge.action=cfg.API_URL;bridge.target=iframeName;bridge.enctype='application/x-www-form-urlencoded';bridge.hidden=true;
      const field=(name,value)=>{const input=document.createElement('input');input.type='hidden';input.name=name;input.value=value;bridge.appendChild(input)};
      field('transport','iframe');field('action',action);field('requestId',requestId);field('parentOrigin',location.origin);field('payload',JSON.stringify(payload));
      let settled=false,pollTimer=null,attempts=0;
      const cleanup=()=>{window.removeEventListener('message',onMessage);clearTimeout(timeoutTimer);clearTimeout(pollTimer);setTimeout(()=>{iframe.remove();bridge.remove()},200)};
      const finish=(fn,value)=>{if(settled)return;settled=true;cleanup();fn(value)};
      const handle=result=>{if(!result)return;if(result.ok)finish(resolve,result);else finish(reject,new Error(result.error||'The request could not be processed.'))};
      const onMessage=event=>{
        const message=event.data;if(!message||message.type!=='FE_VISTA_SUBMISSION_RESULT'||message.requestId!==requestId)return;
        const trusted=event.origin==='https://script.google.com'||event.origin==='https://script.googleusercontent.com'||event.origin.endsWith('.googleusercontent.com');
        if(trusted)handle(message.data);
      };
      const poll=async()=>{
        if(settled)return;attempts++;
        try{const status=await jsonpRequest('submissionStatus',{requestId},15000);if(status?.pending===false&&status.result){handle(status.result);return}}catch(error){console.warn('VISTA EV status check will retry.',error)}
        pollTimer=setTimeout(poll,attempts<5?2000:4000);
      };
      const timeoutTimer=setTimeout(()=>finish(reject,new Error('The request timed out after three minutes. Check the EVChargingRequests sheet before submitting again.')),180000);
      window.addEventListener('message',onMessage);document.body.append(iframe,bridge);bridge.submit();pollTimer=setTimeout(poll,2000);
    });
  }

  function policyItems(text){return String(text||'').split(/\r?\n/).filter(Boolean).map(item=>`<p class="policy-item">${escapeHtml(item)}</p>`).join('')}
  async function loadPolicy(){
    try{
      const data=await jsonpRequest('getEVChargingPolicy');
      if(!data.ok||!data.policy)throw new Error(data.error||'The charging policy is unavailable. Deploy the VISTA 2.4.0 Apps Script backend, then refresh this page.');
      policy=data.policy;
      $('#policyTitle').textContent=policy.title;
      $('#policyVersion').textContent=`Policy ${policy.version} · Effective ${policy.effectiveDate}`;
      $('#sitePolicyText').innerHTML=policyItems(policy.sitePolicy);
      $('#stateTermsText').innerHTML=policyItems(policy.stateAndUseTerms);
      $('#policyLoading').classList.add('hidden');$('#policyContent').classList.remove('hidden');
    }catch(error){
      $('#policyLoading').textContent=error.message;
      $('#policyLoading').classList.add('message','error');
      $('#continueButton').disabled=true;
    }
  }

  function validateStepOne(){
    const fields=[...$('#formStep1').querySelectorAll('input,select')],invalid=fields.find(field=>!field.checkValidity());
    if(invalid){invalid.reportValidity();invalid.focus();return false}
    const data=values();
    if(!fordEmail(data.email)||!fordEmail(data.managerEmail)){setMessage($('#step1Message'),'Employee and manager email addresses must be Ford email addresses, such as name@ford.com.');return false}
    setMessage($('#step1Message'),'');return true;
  }

  function renderSummary(){
    const data=values(),summary=[
      ['Employee',`${data.firstName} ${data.lastName}`],['CDSID',data.cdsid],['Cell phone',data.cellPhone],['Email',data.email],['Department',data.department],
      ['Manager',data.managerName],['Manager CDSID',data.managerCDSID],['Manager email',data.managerEmail],
      ['Vehicle',`${data.vehicleMake} ${data.vehicleModel}`],['License plate',`${data.licensePlate.toUpperCase()} · ${data.plateState}`]
    ];
    $('#reviewSummary').innerHTML=summary.map(([label,value])=>`<div class="review-card"><b>${escapeHtml(label)}</b>${escapeHtml(value||'—')}</div>`).join('');
  }

  function showStep(step){
    currentStep=step;
    $('#formStep1').classList.toggle('active',step===1);$('#formStep2').classList.toggle('active',step===2);
    $('#stepNav1').className='step '+(step===1?'active':'complete');$('#stepNav2').className='step '+(step===2?'active':'');
    $('#heroStep').textContent=`Step ${step} of 2`;$('#heroStepName').textContent=step===1?'Employee & Vehicle':'Review & Acknowledge';$('#progressBar').style.width=step===1?'50%':'100%';
    if(step===2)renderSummary();
    scrollTo({top:0,behavior:'smooth'});
  }

  function requestPayload(){
    const data=values(),submissionKey='vistaEVClientSubmissionId';
    let clientSubmissionId=sessionStorage.getItem(submissionKey);
    if(!clientSubmissionId){clientSubmissionId=`EVCLIENT-${Date.now()}-${Math.random().toString(36).slice(2)}`;sessionStorage.setItem(submissionKey,clientSubmissionId)}
    return{...data,licensePlate:String(data.licensePlate||'').toUpperCase(),policyVersion:policy.version,policyContentHash:policy.contentHash,policyAcknowledged:$('#policyAcknowledged').checked,clientSubmissionId,clientLanguage:navigator.language,clientTimeZone:Intl.DateTimeFormat().resolvedOptions().timeZone,userAgent:navigator.userAgent,clientTimestamp:new Date().toISOString(),referrer:document.referrer};
  }

  function renderConfirmation(data,payload){
    $('#confirmationNumber').textContent=data.confirmationNumber||'—';
    $('#confirmationSummary').innerHTML=[
      ['Employee',data.fullName],['Vehicle',`${payload.vehicleMake} ${payload.vehicleModel}`],['License plate',`${payload.licensePlate} · ${payload.plateState}`],['Manager',payload.managerName],['Status',data.status],['Policy',data.policyVersion||policy.version]
    ].map(([label,value])=>`<div class="review-card"><b>${escapeHtml(label)}</b>${escapeHtml(value||'—')}</div>`).join('');
    const notifications=data.notifications||{},state=(sent,label)=>`<span class="${sent?'notice-ok':'notice-warn'}">${sent?'✓':'⚠'} ${escapeHtml(label)} ${sent?'':'could not be confirmed'}</span>`;
    $('#confirmationNotifications').innerHTML=`<strong>Notification status</strong>${state(Boolean(notifications.employeeSent),'Employee confirmation email sent')}${state(Boolean(notifications.managerSent),'Manager approval email sent')}${notifications.operationsConfigured?state(Boolean(notifications.operationsSent),'EV program notification sent'):''}`;
    $('#confirmationDialog').showModal();
  }

  async function submitRequest(event){
    event.preventDefault();
    if(submitting)return;
    if(currentStep!==2){if(validateStepOne())showStep(2);return}
    if(!policy){setMessage($('#submitMessage'),'The current charging policy is not available. Refresh and try again.');return}
    if(!$('#policyAcknowledged').checked){setMessage($('#submitMessage'),'You must acknowledge the charging policy and Terms of Use before submitting.');$('#policyAcknowledged').focus();return}
    const button=$('#submitButton'),payload=requestPayload();submitting=true;button.disabled=true;button.textContent='Submitting…';setMessage($('#submitMessage'),'Recording request and sending manager approval email…','info');
    try{
      const result=await bridgeSubmit('createEVChargingRequest',payload);
      sessionStorage.removeItem('vistaEVClientSubmissionId');renderConfirmation(result,payload);setMessage($('#submitMessage'),'','success');
    }catch(error){setMessage($('#submitMessage'),error.message);button.disabled=false;button.textContent='Submit EV Charging Request';submitting=false}
  }

  function reviewCards(request){
    return[['Employee',request.fullName],['CDSID',request.cdsid],['Department',request.department],['Vehicle',`${request.vehicleMake} ${request.vehicleModel}`],['License plate',`${request.licensePlate} · ${request.plateState}`],['Policy version',request.policyVersion],['Confirmation',request.confirmationNumber],['Submitted',request.createdAt]].map(([label,value])=>`<div class="review-card"><b>${escapeHtml(label)}</b>${escapeHtml(value||'—')}</div>`).join('');
  }

  function renderDecisionComplete(request){
    $('#managerDecisionForm').classList.add('hidden');const box=$('#managerDecisionComplete');box.className='decision-complete '+(request.status==='Denied'?'denied':'');box.innerHTML=`<h3>Request ${escapeHtml(request.status)}</h3><p>The decision for ${escapeHtml(request.fullName)} was recorded${request.managerDecisionAt?` on ${escapeHtml(request.managerDecisionAt)}`:''}. The employee has been notified.</p>`;
  }

  async function loadManagerReview(){
    $('#requestApplication').classList.add('hidden');$('#managerReview').classList.remove('hidden');
    try{
      const data=await jsonpRequest('getEVManagerReview',{token:reviewToken});
      if(!data.ok||!data.request)throw new Error(data.error||'This manager review link is invalid, or the VISTA 2.4.0 Apps Script backend has not been deployed.');
      const request=data.request;$('#managerReviewLoading').classList.add('hidden');$('#managerReviewContent').classList.remove('hidden');
      $('#managerReviewTitle').textContent=`${request.fullName} · ${request.confirmationNumber}`;$('#managerReviewStatus').textContent=request.status;$('#managerRequestSummary').innerHTML=reviewCards(request);
      if(!data.reviewable){
        if(data.expired){$('#managerDecisionForm').classList.add('hidden');setMessage($('#managerReviewError'),'This manager review link has expired. The employee must submit a new request.')}
        else renderDecisionComplete(request);
      }
    }catch(error){$('#managerReviewLoading').classList.add('hidden');setMessage($('#managerReviewError'),error.message)}
  }

  async function submitManagerDecision(decision){
    const cdsid=$('#managerConfirmCDSID').value.trim();
    if(!cdsid){setMessage($('#managerMessage'),'Enter your manager CDSID to record this decision.');$('#managerConfirmCDSID').focus();return}
    if(decision==='Denied'&&!$('#managerComments').value.trim()){setMessage($('#managerMessage'),'Enter a reason for denying this request.');$('#managerComments').focus();return}
    if(decision==='Denied'&&!confirm('Deny this EV charging access request?'))return;
    const buttons=[$('#approveRequest'),$('#denyRequest')];buttons.forEach(button=>button.disabled=true);setMessage($('#managerMessage'),'Recording your decision…','info');
    try{
      const result=await bridgeSubmit('submitEVManagerDecision',{token:reviewToken,managerCDSID:cdsid,decision,comments:$('#managerComments').value.trim()});
      setMessage($('#managerMessage'),'');$('#managerReviewStatus').textContent=result.request.status;renderDecisionComplete(result.request);
    }catch(error){setMessage($('#managerMessage'),error.message);buttons.forEach(button=>button.disabled=false)}
  }

  if(reviewToken){
    loadManagerReview();
  }else{
    loadPolicy();
    $('#continueButton').onclick=()=>{if(validateStepOne())showStep(2)};
    $('#backButton').onclick=()=>showStep(1);
    $('#stepNav1').onclick=()=>showStep(1);
    $('#stepNav2').onclick=()=>{if(validateStepOne())showStep(2)};
    form.addEventListener('submit',submitRequest);
  }
  $('#approveRequest').onclick=()=>submitManagerDecision('Approved');
  $('#denyRequest').onclick=()=>submitManagerDecision('Denied');
})();
