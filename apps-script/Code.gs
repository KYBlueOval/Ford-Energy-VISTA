const FE = {
  VERSION: '1.3.0-sprint1.7.1',
  SHEETS: { VISITS:'VisitRequests', ACTIVITY:'VisitActivity', BADGES:'BadgeInventory', CONFIG:'Config', AGREEMENTS:'Agreements', ACKS:'AgreementAcknowledgements', SPONSORS:'Sponsors' },
  VISIT_HEADERS: ['VisitID','ConfirmationNumber','CreatedAt','Status','FirstName','MiddleName','LastName','FullName','Email','Phone','Company','JobTitle','Relationship','Street','City','State','PostalCode','Country','EmergencyName','EmergencyPhone','SponsorID','SponsorSource','SponsorName','SponsorEmail','Department','SecondaryContact','Reason','Project','VisitorType','StartDate','ArrivalTime','EndDate','DepartureTime','AccessScope','EscortRequired','LineTour','SpecialItems','Driving','VehicleMake','VehicleModel','VehicleYear','VehicleColor','LicensePlate','PlateState','PhotoFileId','PhotoFileName','PhotoUrl','AgreementVersion','AcknowledgementName','AcknowledgementDate','AgreementTimestamp','AgreementCompletionCount','AgreementCompletionStatus','SessionID','ClientLanguage','ClientTimeZone','UserAgent','ClientTimestamp','Referrer','AgreeSecurity','AgreeBiometric','AgreePrivacy','AgreeSafety','AgreeConduct','AgreeTraining','AgreeRestricted','CheckInTime','CheckOutTime','BadgeUID','CheckInOfficer','CheckOutOfficer','SponsorNotified','IDRetained','IDReturned','ActualDurationMinutes','LastUpdatedAt'],
  ACTIVITY_HEADERS: ['ActivityID','VisitID','EventType','EventTime','PerformedBy','BadgeUID','Details'],
  BADGE_HEADERS: ['BadgeUID','BadgeNumber','Status','CurrentVisitID','IssuedAt','ReturnedAt','Notes'],
  AGREEMENT_HEADERS: ['AgreementID','Title','Version','EffectiveDate','ContentHash','Active','LastUpdatedAt'],
  ACK_HEADERS: ['AcknowledgementID','VisitID','ConfirmationNumber','VisitorName','VisitorEmail','AgreementID','AgreementTitle','AgreementVersion','DatePresented','TimePresented','PresentedTimestamp','DateAccepted','TimeAccepted','AcceptedTimestamp','VisitorEnteredAcceptanceDate','TypedElectronicSignature','CheckboxAcknowledged','SessionID','ClientIP','UserAgent','ClientLanguage','ClientTimeZone','ClientTimestamp','Referrer','AgreementContentHash','CompletionStatus'],
  CONFIG_HEADERS: ['Key','Value'],
  SPONSOR_HEADERS: ['SponsorID','SponsorName','SponsorEmail','Department','Active','SearchKeywords','LastUpdatedAt'],
  AGREEMENT_DEFINITIONS: [
    {id:'SECURITY',title:'Security Agreement',body:'Visitors are subject to screening, access restrictions, badge-control requirements, escort requirements, and Ford Energy Security direction. Unauthorized access, recording, removal of property or information, and bypass of security controls are prohibited.'},
    {id:'BIOMETRIC',title:'Biometric and Facial Recognition Consent',body:'The submitted photograph and approved identity-verification technologies may be used to support visitor identification, access control, safety, and security where authorized.'},
    {id:'PRIVACY',title:'Privacy Agreement',body:'Visitor information is collected and used for legitimate safety, security, access-control, emergency-accountability, compliance, audit, and operational purposes and handled under applicable requirements.'},
    {id:'SAFETY',title:'Safety Golden Rules / SGR Compliance',body:'Visitors must follow energy isolation, PPE, seatbelt, speed, equipment authorization, incident reporting, industrial-vehicle awareness, emergency, and safety-device requirements.'},
    {id:'CONDUCT',title:'Anti-Harassment and Zero-Tolerance Agreement',body:'Bullying, harassment, threats, discrimination, retaliation, violence, and disruptive behavior are prohibited and may result in immediate removal and cancellation of access.'},
    {id:'TRAINING',title:'Site Awareness Training',body:'The visitor confirms completion of the required Ford Energy site-awareness and security briefing and agrees to follow the instructions presented.'},
    {id:'RESTRICTED_ITEMS',title:'Restricted Items and Electronic Device Rules',body:'Weapons, unauthorized tools, removable storage, external drives, and prohibited items are not permitted. Secured electronics and recording devices must be declared, approved, and controlled.'}
  ]
};

function doGet(e) {
  const callback = String((e && e.parameter && e.parameter.callback) || '');
  try {
    const action = String((e && e.parameter && e.parameter.action) || '');
    const result = action === 'listSponsors'
      ? listSponsors_({ query: (e.parameter && e.parameter.query) || '' })
      : {ok:true, service:'Ford Energy VISTA API', version:FE.VERSION};
    return callback ? jsonp_(result, callback) : json_(result);
  } catch (err) {
    const result = {ok:false,error:String(err.message || err)};
    return callback ? jsonp_(result, callback) : json_(result);
  }
}
function doPost(e) {
  const bridge = String((e && e.parameter && e.parameter.transport) || '') === 'iframe';
  const requestId = String((e && e.parameter && e.parameter.requestId) || '');
  const parentOrigin = safeParentOrigin_((e && e.parameter && e.parameter.parentOrigin) || '');
  try {
    let req;
    if (bridge) {
      req = {
        action: String((e.parameter && e.parameter.action) || ''),
        payload: JSON.parse(String((e.parameter && e.parameter.payload) || '{}'))
      };
    } else {
      req = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    }
    const action = req.action || '';
    let result;
    if (action === 'createVisit') result = createVisit_(req.payload || {});
    else if (action === 'listSponsors') result = listSponsors_(req.payload || {});
    else {
      requireSecurity_(req.pin);
      if (action === 'securityLogin') result = {ok:true};
      else if (action === 'listVisits') result = listVisits_(req.payload || {});
      else if (action === 'getVisitPhoto') result = getVisitPhoto_(req.payload || {});
      else if (action === 'checkInVisit') result = checkInVisit_(req.payload || {});
      else if (action === 'checkOutVisit') result = checkOutVisit_(req.payload || {});
      else if (action === 'updateVisitStatus') result = updateVisitStatus_(req.payload || {});
      else throw new Error('Unknown action: ' + action);
    }
    return bridge ? bridgeResponse_(result, requestId, parentOrigin) : json_(result);
  } catch (err) {
    const result = {ok:false,error:String(err.message || err)};
    return bridge ? bridgeResponse_(result, requestId, parentOrigin) : json_(result);
  }
}

function safeParentOrigin_(origin) {
  const value = String(origin || '').trim();
  const allowed = [
    'https://kyblueoval.github.io',
    'http://localhost',
    'http://127.0.0.1'
  ];
  return allowed.some(x => value === x || value.indexOf(x + ':') === 0) ? value : 'https://kyblueoval.github.io';
}

function bridgeResponse_(data, requestId, targetOrigin) {
  const message = JSON.stringify({
    type:'FE_VISTA_SUBMISSION_RESULT',
    requestId:String(requestId || ''),
    data:data
  }).replace(/</g, '\\u003c');
  const origin = JSON.stringify(String(targetOrigin || 'https://kyblueoval.github.io'));
  const html = '<!doctype html><html><head><meta charset="utf-8"><title>VISTA Submission</title></head><body>' +
    '<script>window.parent.postMessage(' + message + ',' + origin + ');<\\/script>' +
    '<noscript>VISTA registration processed. Return to the registration window.</noscript></body></html>';
  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function setupVisitorManagement() {
  const ss = SpreadsheetApp.getActive();
  ensureSheet_(ss, FE.SHEETS.VISITS, FE.VISIT_HEADERS);
  ensureSheet_(ss, FE.SHEETS.ACTIVITY, FE.ACTIVITY_HEADERS);
  ensureSheet_(ss, FE.SHEETS.BADGES, FE.BADGE_HEADERS);
  ensureSheet_(ss, FE.SHEETS.AGREEMENTS, FE.AGREEMENT_HEADERS);
  ensureSheet_(ss, FE.SHEETS.ACKS, FE.ACK_HEADERS);
  ensureSheet_(ss, FE.SHEETS.SPONSORS, FE.SPONSOR_HEADERS);
  const config = ensureSheet_(ss, FE.SHEETS.CONFIG, FE.CONFIG_HEADERS);
  const defaults = {
    SECURITY_PIN:'1937', PHOTO_FOLDER_ID:'', SITE_TIMEZONE:'America/New_York', NOTIFICATION_EMAIL:'',
    SECURITY_CONSOLE_URL:'https://kyblueoval.github.io/Ford-Energy-VISTA/security-console/',
    PUBLIC_REGISTRATION_URL:'https://kyblueoval.github.io/Ford-Energy-VISTA/public-registration/',
    VGS_NAVIGATION_URL:'', TRAINING_VIDEO_URL:'', AGREEMENT_VERSION:'2026.2',
    ARRIVAL_INSTRUCTIONS:'Proceed to the Main Security Building and park in Ford Energy / Visitor Parking.',
    PARKING_INSTRUCTIONS:'Use designated Ford Energy / Visitor Parking and follow posted VGS or site signage.'
  };
  const existing = config.getDataRange().getValues().slice(1).reduce((o,r)=>(o[String(r[0])]=r[1],o),{});
  Object.keys(defaults).forEach(k=>{ if (existing[k] === undefined || existing[k] === '') config.appendRow([k,defaults[k]]); });
  seedAgreements_();
  [FE.SHEETS.VISITS,FE.SHEETS.ACTIVITY,FE.SHEETS.BADGES,FE.SHEETS.AGREEMENTS,FE.SHEETS.ACKS,FE.SHEETS.SPONSORS].forEach(n=>ss.getSheetByName(n).setFrozenRows(1));
  return 'VISTA v1.3.0 Sprint 1 setup complete. Searchable sponsor picker and SponsorID/source tracking are enabled.';
}

function seedAgreements_(){
  const cfg=config_(), version=cfg.AGREEMENT_VERSION||'2026.2', sheet=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.AGREEMENTS);
  const rows=readObjects_(FE.SHEETS.AGREEMENTS);
  FE.AGREEMENT_DEFINITIONS.forEach(d=>{
    const hash=sha256_(`${d.id}|${d.title}|${version}|${d.body}`), existing=rows.find(r=>String(r.AgreementID)===d.id&&String(r.Version)===version);
    if(!existing) sheet.appendRow([d.id,d.title,version,new Date(),hash,'Yes',new Date()]);
  });
}


function listSponsors_(p) {
  const q = String((p && p.query) || '').trim().toLowerCase();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(FE.SHEETS.SPONSORS);
  if (!sheet) return {ok:true,sponsors:[],count:0,warning:'Sponsors sheet not found.'};
  if (sheet.getLastRow() < 2) return {ok:true,sponsors:[],count:0};

  const values = sheet.getDataRange().getDisplayValues();
  const headers = values.shift().map(h => String(h || '').trim());
  const key = name => headers.findIndex(h => h.toLowerCase() === name.toLowerCase());
  const col = {
    id: key('SponsorID'),
    name: key('SponsorName'),
    email: key('SponsorEmail'),
    department: key('Department'),
    active: key('Active'),
    keywords: key('SearchKeywords')
  };

  const valueAt = (row, index) => index >= 0 ? String(row[index] || '').trim() : '';
  const isActive = value => {
    const v = String(value || 'Yes').trim().toLowerCase();
    return !['no','false','0','inactive','disabled'].includes(v);
  };

  const sponsors = values.map(row => ({
      sponsorId: valueAt(row, col.id),
      name: valueAt(row, col.name),
      email: valueAt(row, col.email),
      department: valueAt(row, col.department),
      keywords: valueAt(row, col.keywords),
      active: isActive(valueAt(row, col.active))
    }))
    .filter(s => s.active && s.name && s.email)
    .filter(s => !q || [s.name,s.email,s.department,s.keywords].join(' ').toLowerCase().includes(q))
    .map(({active, ...s}) => s)
    .sort((a,b) => a.name.localeCompare(b.name));

  return {ok:true,sponsors:sponsors.slice(0,500),count:sponsors.length};
}

function createVisit_(p) {
  validateRequired_(p,['firstName','lastName','email','phone','company','sponsorName','sponsorEmail','department','reason','startDate','endDate','accessScope','acknowledgementName','acknowledgementDate']);
  const requiredAgreementIds=FE.AGREEMENT_DEFINITIONS.map(x=>x.id), submitted=Array.isArray(p.agreements)?p.agreements:[];
  requiredAgreementIds.forEach(id=>{const a=submitted.find(x=>String(x.agreementId)===id);if(!a||!truthy_(a.checkboxAcknowledged)||a.completionStatus!=='Completed')throw new Error('All agreements and training sections must be completed. Missing: '+id)});
  const ss=SpreadsheetApp.getActive(), sheet=ss.getSheetByName(FE.SHEETS.VISITS); if(!sheet)throw new Error('Run setupVisitorManagement first.');
  const visitId='VST-'+Utilities.formatDate(new Date(),tz_(),'yyyyMMdd')+'-'+Utilities.getUuid().slice(0,8).toUpperCase();
  const confirmation='FE-'+Utilities.getUuid().replace(/-/g,'').slice(0,8).toUpperCase();
  const now=new Date(), fullName=[p.firstName,p.middleName,p.lastName].filter(Boolean).join(' '), completionCount=submitted.filter(a=>truthy_(a.checkboxAcknowledged)).length;
  let photoFileId='', photoFileName='', photoUrl='';
  if(p.photoDataUrl){const saved=savePhoto_(p.photoDataUrl,fullName,p.company,visitId);photoFileId=saved.id;photoFileName=saved.name;photoUrl=saved.url}
  const record={VisitID:visitId,ConfirmationNumber:confirmation,CreatedAt:now,Status:'Submitted',FirstName:p.firstName,MiddleName:p.middleName||'',LastName:p.lastName,FullName:fullName,Email:p.email,Phone:p.phone,Company:p.company,JobTitle:p.jobTitle||'',Relationship:p.relationship||'',Street:p.street||'',City:p.city||'',State:p.state||'',PostalCode:p.postalCode||'',Country:p.country||'',EmergencyName:p.emergencyName||'',EmergencyPhone:p.emergencyPhone||'',SponsorID:p.sponsorId||'',SponsorSource:p.sponsorSource||'Manual',SponsorName:p.sponsorName,SponsorEmail:p.sponsorEmail,Department:p.department,SecondaryContact:p.secondaryContact||'',Reason:p.reason,Project:p.project||'',VisitorType:p.visitorType||'',StartDate:p.startDate,ArrivalTime:p.arrivalTime||'',EndDate:p.endDate,DepartureTime:p.departureTime||'',AccessScope:p.accessScope,EscortRequired:p.escortRequired||'',LineTour:p.lineTour||'',SpecialItems:p.specialItems||'',Driving:p.driving||'No',VehicleMake:p.vehicleMake||'',VehicleModel:p.vehicleModel||'',VehicleYear:p.vehicleYear||'',VehicleColor:p.vehicleColor||'',LicensePlate:p.licensePlate||'',PlateState:p.plateState||'',PhotoFileId:photoFileId,PhotoFileName:photoFileName,PhotoUrl:photoUrl,AgreementVersion:p.agreementVersion||config_().AGREEMENT_VERSION||'2026.2',AcknowledgementName:p.acknowledgementName,AcknowledgementDate:p.acknowledgementDate,AgreementTimestamp:now,AgreementCompletionCount:completionCount,AgreementCompletionStatus:completionCount===requiredAgreementIds.length?'Completed':'Incomplete',SessionID:p.sessionId||'',ClientLanguage:p.clientLanguage||'',ClientTimeZone:p.clientTimeZone||'',UserAgent:p.userAgent||'',ClientTimestamp:p.clientTimestamp||'',Referrer:p.referrer||'',AgreeSecurity:'Yes',AgreeBiometric:'Yes',AgreePrivacy:'Yes',AgreeSafety:'Yes',AgreeConduct:'Yes',AgreeTraining:'Yes',AgreeRestricted:'Yes',LastUpdatedAt:now};
  sheet.appendRow(FE.VISIT_HEADERS.map(h=>record[h]??''));
  saveAcknowledgements_(record,submitted,now);
  logActivity_(visitId,'REGISTRATION_SUBMITTED','Visitor','',`Confirmation ${confirmation}; agreements ${completionCount}/${requiredAgreementIds.length}`);
  const notifications=notifySubmission_(record);
  return {ok:true,visitId,confirmationNumber:confirmation,fullName,status:'Submitted – Pending Sponsor/Security Review',qrPayload:`FORD-ENERGY-VISTA|${confirmation}|${visitId}`,photoFileName:photoFileName,notifications:notifications};
}

function saveAcknowledgements_(record,submitted,acceptedAt){
  const sheet=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.ACKS), version=record.AgreementVersion;
  submitted.forEach(a=>{
    const def=FE.AGREEMENT_DEFINITIONS.find(x=>x.id===String(a.agreementId)); if(!def)return;
    const presented=parseDateSafe_(a.presentedAt)||acceptedAt, hash=sha256_(`${def.id}|${def.title}|${version}|${def.body}`);
    const row={AcknowledgementID:'ACK-'+Utilities.getUuid().slice(0,12).toUpperCase(),VisitID:record.VisitID,ConfirmationNumber:record.ConfirmationNumber,VisitorName:record.FullName,VisitorEmail:record.Email,AgreementID:def.id,AgreementTitle:def.title,AgreementVersion:version,DatePresented:dateOnly_(presented),TimePresented:timeOnly_(presented),PresentedTimestamp:presented,DateAccepted:dateOnly_(acceptedAt),TimeAccepted:timeOnly_(acceptedAt),AcceptedTimestamp:acceptedAt,VisitorEnteredAcceptanceDate:record.AcknowledgementDate,TypedElectronicSignature:record.AcknowledgementName,CheckboxAcknowledged:truthy_(a.checkboxAcknowledged)?'Yes':'No',SessionID:record.SessionID,ClientIP:'Unavailable through Google Apps Script Web App',UserAgent:record.UserAgent,ClientLanguage:record.ClientLanguage,ClientTimeZone:record.ClientTimeZone,ClientTimestamp:record.ClientTimestamp,Referrer:record.Referrer,AgreementContentHash:hash,CompletionStatus:a.completionStatus||'Completed'};
    sheet.appendRow(FE.ACK_HEADERS.map(h=>row[h]??''));
  });
}

function listVisits_(p) {
  const rows=readObjects_(FE.SHEETS.VISITS), q=String(p.query||'').toLowerCase(), status=String(p.status||'');
  const visits=rows.filter(r=>!status||r.Status===status).filter(r=>!q||[r.FullName,r.ConfirmationNumber,r.SponsorName,r.Company,r.LicensePlate,r.BadgeUID,r.VisitID].join(' ').toLowerCase().includes(q)).sort((a,b)=>new Date(b.CreatedAt)-new Date(a.CreatedAt)).slice(0,500).map(publicVisit_);
  const today=Utilities.formatDate(new Date(),tz_(),'yyyy-MM-dd'), now=new Date();
  const kpis={expectedToday:rows.filter(r=>dateKey_(r.StartDate)===today&&!['Checked Out','Denied','Cancelled','No Show'].includes(r.Status)).length,onsite:rows.filter(r=>r.Status==='Checked In').length,checkedOutToday:rows.filter(r=>r.Status==='Checked Out'&&dateKey_(r.CheckOutTime)===today).length,overdue:rows.filter(r=>r.Status==='Checked In'&&r.EndDate&&new Date(`${dateKey_(r.EndDate)}T${timeOnly_(r.DepartureTime)||'23:59'}`)<now).length};
  return {ok:true,visits,kpis};
}

function checkInVisit_(p) {
  validateRequired_(p,['visitId','badgeUid','officerName']); const row=findVisitRow_(p.visitId), rec=row.obj;
  if(rec.Status==='Checked In')throw new Error('Visitor is already checked in.'); if(rec.Status==='Checked Out')throw new Error('Visitor is already checked out.');
  ensureBadgeAvailable_(p.badgeUid,p.visitId); const now=new Date();
  updateVisitRow_(row.row,{Status:'Checked In',CheckInTime:now,BadgeUID:p.badgeUid,CheckInOfficer:p.officerName,SponsorNotified:p.sponsorNotified?'Yes':'No',IDRetained:p.idRetained?'Yes':'No',LastUpdatedAt:now});
  assignBadge_(p.badgeUid,p.visitId,now); logActivity_(p.visitId,'CHECK_IN',p.officerName,p.badgeUid,p.notes||''); return {ok:true};
}
function checkOutVisit_(p) {
  validateRequired_(p,['visitId','badgeUid','officerName']); const row=findVisitRow_(p.visitId), rec=row.obj;
  if(rec.Status!=='Checked In')throw new Error('Visitor is not currently checked in.'); if(String(rec.BadgeUID)!==String(p.badgeUid))throw new Error('Returned badge UID does not match the issued badge.');
  const now=new Date(), duration=Math.max(0,Math.round((now-new Date(rec.CheckInTime))/60000));
  updateVisitRow_(row.row,{Status:'Checked Out',CheckOutTime:now,CheckOutOfficer:p.officerName,IDReturned:p.idReturned?'Yes':'No',ActualDurationMinutes:duration,LastUpdatedAt:now});
  returnBadge_(p.badgeUid,now); logActivity_(p.visitId,'CHECK_OUT',p.officerName,p.badgeUid,p.notes||''); return {ok:true,durationMinutes:duration};
}
function updateVisitStatus_(p) { validateRequired_(p,['visitId','status']); const row=findVisitRow_(p.visitId),now=new Date();updateVisitRow_(row.row,{Status:p.status,LastUpdatedAt:now});logActivity_(p.visitId,'STATUS_UPDATED',p.officerName||'Security','',p.status);return {ok:true}; }
function getVisitPhoto_(p) { validateRequired_(p,['visitId']); const rec=findVisitRow_(p.visitId).obj;if(!rec.PhotoFileId)return{ok:true,hasPhoto:false,dataUrl:'',fileName:''};try{const file=DriveApp.getFileById(String(rec.PhotoFileId)),blob=file.getBlob(),mime=blob.getContentType()||'image/jpeg',fileName=String(rec.PhotoFileName||file.getName()||'visitor-photo.jpg');return{ok:true,hasPhoto:true,dataUrl:`data:${mime};base64,${Utilities.base64Encode(blob.getBytes())}`,fileName:fileName,mimeType:mime}}catch(err){throw new Error('Visitor photograph could not be loaded. Confirm Apps Script access to the configured photo folder.')} }
function savePhoto_(dataUrl,fullName,company,visitId){
  const m=String(dataUrl).match(/^data:(image\/[^;]+);base64,(.+)$/);if(!m)throw new Error('Invalid photograph data.');
  const cfg=config_(),folder=cfg.PHOTO_FOLDER_ID?DriveApp.getFolderById(cfg.PHOTO_FOLDER_ID):DriveApp.getRootFolder(),ext=m[1].includes('png')?'png':'jpg';
  const person=safeFilePart_(fullName)||safeFilePart_(visitId)||'Visitor', business=safeFilePart_(company)||'Unknown Company';
  const fileName=`${person}-${business}.${ext}`,blob=Utilities.newBlob(Utilities.base64Decode(m[2]),m[1],fileName),file=folder.createFile(blob);
  return{id:file.getId(),name:fileName,url:`https://drive.google.com/uc?export=view&id=${file.getId()}`}
}
function safeFilePart_(value){return String(value||'').trim().replace(/[\\\/:*?"<>|#%{}~&]/g,' ').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').replace(/[. ]+$/g,'').slice(0,100)}
function notifySubmission_(r){
  const cfg=config_(), reviewUrl=cfg.SECURITY_CONSOLE_URL||'', result={sponsorSent:false,visitorSent:false,securitySent:false,securityConfigured:Boolean(cfg.NOTIFICATION_EMAIL),errors:[]};
  const visitPeriod=[r.StartDate,r.ArrivalTime].filter(Boolean).join(' ')+' through '+[r.EndDate,r.DepartureTime].filter(Boolean).join(' ');
  const vehicle=r.Driving==='Yes'?[r.VehicleYear,r.VehicleMake,r.VehicleModel,r.VehicleColor,r.LicensePlate,r.PlateState].filter(Boolean).join(' '):'Not driving';
  const wrapper=body=>`<div style="font-family:Arial,sans-serif;background:#eef4fb;padding:24px"><div style="max-width:680px;margin:auto;background:white;border-radius:16px;overflow:hidden;border:1px solid #d8e0e8"><div style="background:linear-gradient(135deg,#003478,#0b67b2);color:white;padding:22px 28px"><div style="font-size:13px;letter-spacing:1.2px;font-weight:bold">FORD ENERGY · VISTA</div><h2 style="margin:8px 0 0">Visitor Registration</h2></div><div style="padding:26px;color:#16283d;line-height:1.55">${body}</div></div></div>`;
  const details=`<table style="width:100%;border-collapse:collapse"><tr><td style="padding:7px 0;color:#667587">Visitor</td><td style="padding:7px 0"><b>${html_(r.FullName)}</b> · ${html_(r.Company)}</td></tr><tr><td style="padding:7px 0;color:#667587">Visit</td><td style="padding:7px 0">${html_(visitPeriod)}</td></tr><tr><td style="padding:7px 0;color:#667587">Department</td><td style="padding:7px 0">${html_(r.Department)}</td></tr><tr><td style="padding:7px 0;color:#667587">Reason</td><td style="padding:7px 0">${html_(r.Reason)}</td></tr><tr><td style="padding:7px 0;color:#667587">Access</td><td style="padding:7px 0">${html_(r.AccessScope)}</td></tr><tr><td style="padding:7px 0;color:#667587">Vehicle</td><td style="padding:7px 0">${html_(vehicle)}</td></tr><tr><td style="padding:7px 0;color:#667587">Confirmation</td><td style="padding:7px 0"><b>${html_(r.ConfirmationNumber)}</b></td></tr></table>`;
  try{
    if(r.SponsorEmail){
      MailApp.sendEmail({to:r.SponsorEmail,subject:`Action requested: Visitor request ${r.ConfirmationNumber} for ${r.FullName}`,htmlBody:wrapper(`<p>Hello ${html_(r.SponsorName)},</p><p>A visitor identified you as the Ford Energy sponsor for the request below.</p>${details}<p style="background:#fff4d6;border-left:4px solid #ff7a00;padding:12px">Please review the request and coordinate with Security Operations. Submission does not automatically authorize access.</p>${reviewUrl?`<p><a style="display:inline-block;background:#003478;color:white;text-decoration:none;padding:11px 16px;border-radius:8px" href="${html_(reviewUrl)}">Open VISTA Security Console</a></p>`:''}`)});
      result.sponsorSent=true;
    }
  }catch(err){result.errors.push('Sponsor email: '+String(err.message||err));}
  try{
    if(cfg.NOTIFICATION_EMAIL){
      MailApp.sendEmail({to:cfg.NOTIFICATION_EMAIL,subject:`VISTA visitor request ${r.ConfirmationNumber}: ${r.FullName}`,htmlBody:wrapper(`<p>A new visitor registration has been submitted.</p>${details}${reviewUrl?`<p><a style="display:inline-block;background:#003478;color:white;text-decoration:none;padding:11px 16px;border-radius:8px" href="${html_(reviewUrl)}">Review in Security Console</a></p>`:''}`)});
      result.securitySent=true;
    }
  }catch(err){result.errors.push('Security email: '+String(err.message||err));}
  try{
    if(r.Email){
      MailApp.sendEmail({to:r.Email,subject:`Ford Energy visitor registration ${r.ConfirmationNumber}`,htmlBody:wrapper(`<p>Hello ${html_(r.FullName)},</p><p>Your Ford Energy visitor registration has been received.</p>${details}<p><b>Status:</b> Submitted – Pending Sponsor/Security Review</p><div style="background:#eaf4ff;border-left:4px solid #003478;padding:12px"><b>Arrival reminder</b><br>${html_(cfg.ARRIVAL_INSTRUCTIONS||'Proceed to the Main Security Building and bring a valid government-issued photo ID.')}<br>${html_(cfg.PARKING_INSTRUCTIONS||'Use designated visitor parking.')}</div>${cfg.VGS_NAVIGATION_URL?`<p><a style="display:inline-block;background:#003478;color:white;text-decoration:none;padding:11px 16px;border-radius:8px" href="${html_(cfg.VGS_NAVIGATION_URL)}">Open Visitor Navigation</a></p>`:''}<p>Keep confirmation number <b>${html_(r.ConfirmationNumber)}</b> for check-in.</p>`)});
      result.visitorSent=true;
    }
  }catch(err){result.errors.push('Visitor email: '+String(err.message||err));}
  if(result.errors.length) console.log('VISTA notification errors: '+result.errors.join(' | '));
  return result;
}
function ensureBadgeAvailable_(uid,visitId){const s=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.BADGES),rows=readObjects_(FE.SHEETS.BADGES),b=rows.find(x=>String(x.BadgeUID)===String(uid));if(b&&b.Status==='Issued'&&String(b.CurrentVisitID)!==String(visitId))throw new Error('Badge is already issued to another visitor.');if(!b)s.appendRow([uid,'','Available','','','','Auto-created']);}
function assignBadge_(uid,visitId,now){upsertBadge_(uid,{Status:'Issued',CurrentVisitID:visitId,IssuedAt:now,ReturnedAt:''})}
function returnBadge_(uid,now){upsertBadge_(uid,{Status:'Available',CurrentVisitID:'',ReturnedAt:now})}
function upsertBadge_(uid,updates){const s=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.BADGES),data=s.getDataRange().getValues(),headers=data[0],idx=headers.indexOf('BadgeUID');let row=-1;for(let i=1;i<data.length;i++)if(String(data[i][idx])===String(uid)){row=i+1;break}if(row<0){s.appendRow(FE.BADGE_HEADERS.map(h=>h==='BadgeUID'?uid:(updates[h]??'')));return}Object.entries(updates).forEach(([k,v])=>{const c=headers.indexOf(k);if(c>=0)s.getRange(row,c+1).setValue(v)})}
function logActivity_(visitId,type,by,badge,details){SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.ACTIVITY).appendRow(['ACT-'+Utilities.getUuid().slice(0,12).toUpperCase(),visitId,type,new Date(),by||'',badge||'',details||''])}
function findVisitRow_(visitId){const s=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.VISITS),data=s.getDataRange().getValues(),h=data[0],idx=h.indexOf('VisitID');for(let i=1;i<data.length;i++)if(String(data[i][idx])===String(visitId))return{row:i+1,obj:h.reduce((o,k,j)=>(o[k]=data[i][j],o),{})};throw new Error('Visit record not found.')}
function updateVisitRow_(row,updates){const s=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.VISITS),h=s.getRange(1,1,1,s.getLastColumn()).getValues()[0];Object.entries(updates).forEach(([k,v])=>{const c=h.indexOf(k);if(c>=0)s.getRange(row,c+1).setValue(v)})}
function publicVisit_(r){return{visitId:String(r.VisitID||''),confirmationNumber:String(r.ConfirmationNumber||''),fullName:String(r.FullName||''),email:String(r.Email||''),phone:String(r.Phone||''),company:String(r.Company||''),sponsorName:String(r.SponsorName||''),sponsorEmail:String(r.SponsorEmail||''),department:String(r.Department||''),reason:String(r.Reason||''),project:String(r.Project||''),visitorType:String(r.VisitorType||''),startDate:dateOnly_(r.StartDate),arrivalTime:timeOnly_(r.ArrivalTime),endDate:dateOnly_(r.EndDate),departureTime:timeOnly_(r.DepartureTime),accessScope:String(r.AccessScope||''),escortRequired:String(r.EscortRequired||''),lineTour:String(r.LineTour||''),specialItems:String(r.SpecialItems||''),driving:String(r.Driving||''),vehicleMake:String(r.VehicleMake||''),vehicleModel:String(r.VehicleModel||''),vehicleYear:String(r.VehicleYear||''),vehicleColor:String(r.VehicleColor||''),licensePlate:String(r.LicensePlate||''),plateState:String(r.PlateState||''),hasPhoto:Boolean(r.PhotoFileId),photoFileName:String(r.PhotoFileName||''),photoUrl:String(r.PhotoUrl||''),status:String(r.Status||''),agreementCompletionStatus:String(r.AgreementCompletionStatus||''),agreementCompletionCount:String(r.AgreementCompletionCount||''),checkInTime:dateTime_(r.CheckInTime),checkOutTime:dateTime_(r.CheckOutTime),badgeUid:String(r.BadgeUID||''),actualDurationMinutes:r.ActualDurationMinutes||''}}
function readObjects_(name){const s=SpreadsheetApp.getActive().getSheetByName(name);if(!s||s.getLastRow()<2)return[];const d=s.getDataRange().getValues(),h=d.shift();return d.map(r=>h.reduce((o,k,i)=>(o[k]=r[i],o),{}))}
function config_(){return readObjects_(FE.SHEETS.CONFIG).reduce((o,r)=>(o[String(r.Key)]=String(r.Value),o),{})}
function requireSecurity_(pin){const expected=config_().SECURITY_PIN||'1937';if(String(pin)!==String(expected))throw new Error('Invalid Security PIN.')}
function tz_(){return config_().SITE_TIMEZONE||Session.getScriptTimeZone()||'America/New_York'}
function dateKey_(v){if(!v)return'';if(v instanceof Date)return Utilities.formatDate(v,tz_(),'yyyy-MM-dd');return String(v).slice(0,10)}
function dateOnly_(v){if(!v)return'';if(v instanceof Date)return Utilities.formatDate(v,tz_(),'yyyy-MM-dd');return String(v).slice(0,10)}
function timeOnly_(v){if(!v)return'';if(v instanceof Date)return Utilities.formatDate(v,tz_(),'HH:mm');const text=String(v),match=text.match(/(?:T|\s)(\d{2}:\d{2})/);return match?match[1]:text.slice(0,5)}
function dateTime_(v){if(!v)return'';if(v instanceof Date)return Utilities.formatDate(v,tz_(),'yyyy-MM-dd HH:mm:ss');return String(v)}
function parseDateSafe_(v){if(!v)return null;const d=new Date(v);return isNaN(d.getTime())?null:d}
function validateRequired_(o,keys){keys.forEach(k=>{if(o[k]===undefined||o[k]===null||String(o[k]).trim()==='')throw new Error('Missing required field: '+k)})}
function truthy_(v){return v===true||v==='true'||v==='on'||v==='Yes'}
function ensureSheet_(ss,name,headers){let s=ss.getSheetByName(name);if(!s)s=ss.insertSheet(name);if(s.getLastRow()===0)s.appendRow(headers);else{const current=s.getRange(1,1,1,s.getLastColumn()).getValues()[0];headers.forEach(h=>{if(!current.includes(h)){s.getRange(1,s.getLastColumn()+1).setValue(h);current.push(h)}})}s.getRange(1,1,1,s.getLastColumn()).setFontWeight('bold').setBackground('#003478').setFontColor('#ffffff');return s}
function sha256_(text){return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,String(text),Utilities.Charset.UTF_8).map(b=>(b+256)%256).map(b=>('0'+b.toString(16)).slice(-2)).join('')}
function html_(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function json_(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON)}
function jsonp_(o,callback){
  const cb=String(callback||'').replace(/[^A-Za-z0-9_.$]/g,'');
  if(!cb) return json_(o);
  return ContentService.createTextOutput(cb+'('+JSON.stringify(o)+');').setMimeType(ContentService.MimeType.JAVASCRIPT);
}
