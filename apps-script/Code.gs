const FE = {
  VERSION: '2.0A-identity-security-core',
  SHEETS: { VISITS:'VisitRequests', ACTIVITY:'VisitActivity', BADGES:'BadgeInventory', CONFIG:'Config', AGREEMENTS:'Agreements', ACKS:'AgreementAcknowledgements', SPONSORS:'Sponsors', USERS:'Users', FRONTDESK:'FrontDesk', SECURITY:'Security', SESSIONS:'AuthSessions', AUDIT:'AuditLog' },
  VISIT_HEADERS: ['VisitID','ConfirmationNumber','CreatedAt','Status','FirstName','MiddleName','LastName','FullName','Email','Phone','Company','JobTitle','Relationship','Street','City','State','PostalCode','Country','EmergencyName','EmergencyPhone','SponsorID','SponsorSource','SponsorName','SponsorEmail','Department','SecondaryContact','Reason','Project','VisitorType','StartDate','ArrivalTime','EndDate','DepartureTime','AccessScope','EscortRequired','LineTour','SpecialItems','Driving','VehicleMake','VehicleModel','VehicleYear','VehicleColor','LicensePlate','PlateState','PhotoFileId','PhotoFileName','PhotoUrl','AgreementVersion','AcknowledgementName','AcknowledgementDate','AgreementTimestamp','AgreementCompletionCount','AgreementCompletionStatus','SessionID','ClientLanguage','ClientTimeZone','UserAgent','ClientTimestamp','Referrer','AgreeSecurity','AgreeBiometric','AgreePrivacy','AgreeSafety','AgreeConduct','AgreeTraining','AgreeRestricted','CheckInTime','CheckOutTime','BadgeUID','CheckInOfficer','CheckOutOfficer','SponsorNotified','IDRetained','IDReturned','ActualDurationMinutes','LastUpdatedAt'],
  ACTIVITY_HEADERS: ['ActivityID','VisitID','EventType','EventTime','PerformedBy','BadgeUID','Details'],
  BADGE_HEADERS: ['BadgeUID','BadgeNumber','Status','CurrentVisitID','IssuedAt','ReturnedAt','Notes'],
  AGREEMENT_HEADERS: ['AgreementID','Title','Version','EffectiveDate','ContentHash','Active','LastUpdatedAt'],
  ACK_HEADERS: ['AcknowledgementID','VisitID','ConfirmationNumber','VisitorName','VisitorEmail','AgreementID','AgreementTitle','AgreementVersion','DatePresented','TimePresented','PresentedTimestamp','DateAccepted','TimeAccepted','AcceptedTimestamp','VisitorEnteredAcceptanceDate','TypedElectronicSignature','CheckboxAcknowledged','SessionID','ClientIP','UserAgent','ClientLanguage','ClientTimeZone','ClientTimestamp','Referrer','AgreementContentHash','CompletionStatus'],
  CONFIG_HEADERS: ['Key','Value'],
  SPONSOR_HEADERS: ['SponsorID','SponsorName','SponsorEmail','Department','Active','SearchKeywords','LastUpdatedAt'],
  USER_HEADERS: ['UserID','EmployeeID','FullName','Email','Department','Company','BadgeUID','Username','PINHash','Role','ApprovalScope','Active','CreatedAt','LastLoginAt','FailedLoginCount','Notes'],
  FRONTDESK_HEADERS: ['EmployeeID','FullName','Email','Department','Company','BadgeUID','Shift','Location','Active','LastUpdatedAt'],
  SECURITY_HEADERS: ['EmployeeID','FullName','Email','Department','Company','BadgeUID','SecurityLevel','Active','LastUpdatedAt'],
  SESSION_HEADERS: ['SessionToken','UserID','Username','Role','CreatedAt','ExpiresAt','LastSeenAt','UserAgent'],
  AUDIT_HEADERS: ['AuditID','Timestamp','UserID','Username','Role','Action','VisitID','ConfirmationNumber','Result','Details'],

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
    let result;
    if (action === 'listSponsors') {
      result = listSponsors_({ query: (e.parameter && e.parameter.query) || '' });
    } else if (action === 'submissionStatus') {
      result = getSubmissionStatus_((e.parameter && e.parameter.requestId) || '');
    } else {
      result = {ok:true, service:'Ford Energy VISTA API', version:FE.VERSION};
    }
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
      req = { action:String((e.parameter && e.parameter.action)||''), payload:JSON.parse(String((e.parameter && e.parameter.payload)||'{}')) };
    } else {
      req = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    }
    const action=String(req.action||'');
    let result;
    if(action==='createVisit') result=createVisit_(req.payload||{});
    else if(action==='listSponsors') result=listSponsors_(req.payload||{});
    else if(action==='login'||action==='pinLogin') result=loginUser_(req.payload||{}, e);
    else if(action==='badgeLogin') result=badgeLoginUser_(req.payload||{}, e);
    else {
      const session=requireSession_(req.token||'');
      if(action==='logout') result=logoutUser_(session,req.token||'');
      else if(action==='whoAmI') result={ok:true,user:publicSessionUser_(session),permissions:permissionsForRole_(session.Role)};
      else if(action==='listVisits') result=listVisitsForSession_(req.payload||{},session);
      else if(action==='getVisitPhoto') { requirePermission_(session,'viewPhoto'); result=getVisitPhoto_(req.payload||{}); }
      else if(action==='checkInVisit') { requirePermission_(session,'checkIn'); result=checkInVisitAuthorized_(req.payload||{},session); }
      else if(action==='checkOutVisit') { requirePermission_(session,'checkOut'); result=checkOutVisitAuthorized_(req.payload||{},session); }
      else if(action==='updateVisitStatus') result=updateVisitStatusAuthorized_(req.payload||{},session);
      else throw new Error('Unknown action: '+action);
    }
    if(bridge&&requestId)storeSubmissionResult_(requestId,result);
    return bridge?bridgeResponse_(result,requestId,parentOrigin):json_(result);
  } catch(err) {
    const result={ok:false,error:String(err.message||err)};
    if(bridge&&requestId)storeSubmissionResult_(requestId,result);
    return bridge?bridgeResponse_(result,requestId,parentOrigin):json_(result);
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
    '<script>(function(){try{window.top.postMessage(' + message + ',' + origin + ');}catch(e){}try{window.parent.postMessage(' + message + ',' + origin + ');}catch(e){}})();<\/script>' +
    '<noscript>VISTA registration processed. Return to the registration window.</noscript></body></html>';
  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function submissionCacheKey_(requestId) {
  return 'VISTA_SUBMISSION_' + String(requestId || '').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 180);
}

function storeSubmissionResult_(requestId, result) {
  if (!requestId) return;
  CacheService.getScriptCache().put(submissionCacheKey_(requestId), JSON.stringify(result), 600);
}

function getSubmissionStatus_(requestId) {
  const id = String(requestId || '').trim();
  if (!id) return {ok:false,error:'Missing requestId'};
  const raw = CacheService.getScriptCache().get(submissionCacheKey_(id));
  if (!raw) return {ok:true,pending:true};
  try {
    return {ok:true,pending:false,result:JSON.parse(raw)};
  } catch (err) {
    return {ok:false,error:'Stored submission result could not be parsed.'};
  }
}

function setupVisitorManagement() {
  const ss = SpreadsheetApp.getActive();
  ensureSheet_(ss, FE.SHEETS.VISITS, FE.VISIT_HEADERS);
  ensureSheet_(ss, FE.SHEETS.ACTIVITY, FE.ACTIVITY_HEADERS);
  ensureSheet_(ss, FE.SHEETS.BADGES, FE.BADGE_HEADERS);
  ensureSheet_(ss, FE.SHEETS.AGREEMENTS, FE.AGREEMENT_HEADERS);
  ensureSheet_(ss, FE.SHEETS.ACKS, FE.ACK_HEADERS);
  ensureSheet_(ss, FE.SHEETS.SPONSORS, FE.SPONSOR_HEADERS);
  ensureSheet_(ss, FE.SHEETS.USERS, FE.USER_HEADERS);
  ensureSheet_(ss, FE.SHEETS.FRONTDESK, FE.FRONTDESK_HEADERS);
  ensureSheet_(ss, FE.SHEETS.SECURITY, FE.SECURITY_HEADERS);
  ensureSheet_(ss, FE.SHEETS.SESSIONS, FE.SESSION_HEADERS);
  ensureSheet_(ss, FE.SHEETS.AUDIT, FE.AUDIT_HEADERS);
  const config = ensureSheet_(ss, FE.SHEETS.CONFIG, FE.CONFIG_HEADERS);
  const defaults = {
    SECURITY_PIN:'1937', PHOTO_FOLDER_ID:'', SITE_TIMEZONE:'America/New_York', NOTIFICATION_EMAIL:'',
    SECURITY_CONSOLE_URL:'https://kyblueoval.github.io/Ford-Energy-VISTA/security-console/',
    PUBLIC_REGISTRATION_URL:'https://kyblueoval.github.io/Ford-Energy-VISTA/public-registration/',
    VGS_NAVIGATION_URL:'', TRAINING_VIDEO_URL:'', AGREEMENT_VERSION:'2026.2',
    ARRIVAL_INSTRUCTIONS:'Proceed to the Main Security Building and park in Ford Energy / Visitor Parking.',
    PARKING_INSTRUCTIONS:'Use designated Ford Energy / Visitor Parking and follow posted VGS or site signage.',
    AUTH_SESSION_HOURS:'8', AUTH_SALT:'FORD-ENERGY-VISTA-CHANGE-ME'
  };
  const existing = config.getDataRange().getValues().slice(1).reduce((o,r)=>(o[String(r[0])]=r[1],o),{});
  Object.keys(defaults).forEach(k=>{ if (existing[k] === undefined || existing[k] === '') config.appendRow([k,defaults[k]]); });
  seedAgreements_();
  seedInitialAdmin_();
  [FE.SHEETS.VISITS,FE.SHEETS.ACTIVITY,FE.SHEETS.BADGES,FE.SHEETS.AGREEMENTS,FE.SHEETS.ACKS,FE.SHEETS.SPONSORS,FE.SHEETS.USERS,FE.SHEETS.FRONTDESK,FE.SHEETS.SECURITY,FE.SHEETS.SESSIONS,FE.SHEETS.AUDIT].forEach(n=>ss.getSheetByName(n).setFrozenRows(1));
  return 'VISTA v1.3.0 Sprint 1.9 setup complete. Users, FrontDesk, Security, AuthSessions and AuditLog tabs are ready.';
}

function seedAgreements_(){
  const cfg=config_(), version=cfg.AGREEMENT_VERSION||'2026.2', sheet=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.AGREEMENTS);
  const rows=readObjects_(FE.SHEETS.AGREEMENTS);
  FE.AGREEMENT_DEFINITIONS.forEach(d=>{
    const hash=sha256_(`${d.id}|${d.title}|${version}|${d.body}`), existing=rows.find(r=>String(r.AgreementID)===d.id&&String(r.Version)===version);
    if(!existing) sheet.appendRow([d.id,d.title,version,new Date(),hash,'Yes',new Date()]);
  });
}



function resolveSponsorPrivate_(sponsorId){
  const id=String(sponsorId||'').trim().toLowerCase();
  const sponsor=readObjects_(FE.SHEETS.SPONSORS).find(r=>
    String(r.SponsorID||'').trim().toLowerCase()===id&&truthyActive_(r.Active)
  );
  if(!sponsor)throw new Error('The selected sponsor is not available. Please select another sponsor.');
  return{sponsorId:String(sponsor.SponsorID||''),name:String(sponsor.SponsorName||''),email:String(sponsor.SponsorEmail||''),department:String(sponsor.Department||'')};
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
  p=p||{};
  if(p.sponsorSource!=='Manual'&&p.sponsorId){
    const resolved=resolveSponsorPrivate_(p.sponsorId);
    p.sponsorName=resolved.name;
    p.sponsorEmail=resolved.email;
    p.department=resolved.department;
    p.sponsorSource='Directory';
  }

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
  appendObjectRow_(sheet, record, FE.VISIT_HEADERS);
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
    appendObjectRow_(sheet, row, FE.ACK_HEADERS);
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
  if(String(rec.Status)!=='Approved')throw new Error('Check-in prohibited: the reservation must be Approved before a badge UID can be assigned.');
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
function getVisitPhoto_(p) {
  validateRequired_(p,['visitId']);
  const rec=findVisitRow_(p.visitId).obj;
  const fileId=extractDriveFileId_(rec.PhotoFileId||rec.PhotoUrl||'');
  if(!fileId)return{ok:true,hasPhoto:false,dataUrl:'',fileName:''};
  try{
    const file=DriveApp.getFileById(fileId),blob=file.getBlob(),mime=blob.getContentType()||'image/jpeg';
    const ext=mime.indexOf('png')>=0?'png':mime.indexOf('webp')>=0?'webp':'jpg';
    const fileName=`${safeFilePart_(rec.FullName)||'Visitor'}-${safeFilePart_(rec.Company)||'Unknown Company'}.${ext}`;
    return{ok:true,hasPhoto:true,dataUrl:`data:${mime};base64,${Utilities.base64Encode(blob.getBytes())}`,fileName:fileName,mimeType:mime,sourceFileName:file.getName()};
  }catch(err){throw new Error('Visitor photograph could not be loaded. Confirm the PhotoFileId/PhotoUrl value and Apps Script access to the configured photo folder.');}
}
function extractDriveFileId_(value){
  const text=String(value||'').trim();
  if(!text)return'';
  if(/^[A-Za-z0-9_-]{20,}$/.test(text))return text;
  const matches=[text.match(/\/d\/([A-Za-z0-9_-]{20,})/),text.match(/[?&]id=([A-Za-z0-9_-]{20,})/),text.match(/([A-Za-z0-9_-]{25,})/)];
  for(let i=0;i<matches.length;i++)if(matches[i])return matches[i][1];
  return'';
}
function savePhoto_(dataUrl,fullName,company,visitId){
  const m=String(dataUrl).match(/^data:(image\/[^;]+);base64,(.+)$/);if(!m)throw new Error('Invalid photograph data.');
  const cfg=config_(),folder=cfg.PHOTO_FOLDER_ID?DriveApp.getFolderById(cfg.PHOTO_FOLDER_ID):DriveApp.getRootFolder(),ext=m[1].includes('png')?'png':'jpg';
  const person=safeFilePart_(fullName)||safeFilePart_(visitId)||'Visitor', business=safeFilePart_(company)||'Unknown Company';
  const fileName=`${person}-${business}.${ext}`,blob=Utilities.newBlob(Utilities.base64Decode(m[2]),m[1],fileName),file=folder.createFile(blob);
  return{id:file.getId(),name:fileName,url:`https://drive.google.com/uc?export=view&id=${file.getId()}`}
}
function safeFilePart_(value){return String(value||'').trim().replace(/[\\\/:*?"<>|#%{}~&]/g,' ').replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').replace(/[. ]+$/g,'').slice(0,100)}
function emailBrandAssets_(){
  return{
    primaryLogo:'https://kyblueoval.github.io/Ford-Energy-VISTA/shared/assets/ford-energy-primary-logo.png',
    bwrdoLogo:'https://kyblueoval.github.io/Ford-Energy-VISTA/shared/assets/ford-energy-bwrdo.png'
  };
}
function brandedEmail_(options){
  const o=options||{},assets=emailBrandAssets_(),preheader=html_(o.preheader||''),title=html_(o.title||'VISTA Notification'),kicker=html_(o.kicker||'FORD ENERGY · VISTA');
  const body=o.body||'',footerNote=html_(o.footerNote||'This message was generated by the Ford Energy VISTA Visitor Management System.');
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="x-apple-disable-message-reformatting"><title>${title}</title></head><body style="margin:0;padding:0;background:#edf3f9;font-family:Arial,Helvetica,sans-serif;color:#16283d"><div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${preheader}</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#edf3f9"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="680" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:680px;background:#ffffff;border:1px solid #d5e0eb;border-radius:16px;overflow:hidden"><tr><td style="background:#003478;padding:0"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td style="padding:24px 28px"><img src="${assets.primaryLogo}" width="210" alt="Ford Energy" style="display:block;width:210px;max-width:100%;height:auto;border:0"><div style="font-size:11px;line-height:16px;letter-spacing:1.7px;font-weight:bold;color:#bfe4ff;margin-top:18px">${kicker}</div><div style="font-size:28px;line-height:34px;font-weight:bold;color:#ffffff;margin-top:5px">${title}</div></td></tr></table></td></tr><tr><td style="padding:28px 30px 22px;line-height:1.58;font-size:15px">${body}</td></tr><tr><td style="padding:0 30px"><div style="height:1px;background:#dce6f0;line-height:1px;font-size:1px">&nbsp;</div></td></tr><tr><td align="center" style="padding:22px 26px 26px;background:#f7f9fc"><img src="${assets.bwrdoLogo}" width="118" alt="BlueOval Rechargeable Battery Development Organization" style="display:block;width:118px;height:auto;border:0;margin:0 auto 12px"><div style="font-size:12px;line-height:18px;color:#516477"><strong style="color:#003478">Ford Energy · BlueOval Glendale Kentucky</strong><br>Visitor Administration · Main Security Building<br>2022 Battery Park Drive, Glendale, KY 42740 USA<br><span style="color:#75869a">${footerNote}</span></div></td></tr></table></td></tr></table></body></html>`;
}
function emailButton_(url,label){
  if(!url)return'';
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:22px 0"><tr><td bgcolor="#003478" style="border-radius:7px"><a href="${html_(url)}" style="display:inline-block;padding:13px 20px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:18px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:7px">${html_(label)}</a></td></tr></table>`;
}
function emailDetailsTable_(r,visitPeriod,vehicle){
  const rows=[['Visitor',`${html_(r.FullName)}<br><span style="color:#667587">${html_(r.Company)}</span>`],['Visit',html_(visitPeriod)],['Department',html_(r.Department)],['Reason',html_(r.Reason)],['Requested access',html_(r.AccessScope)],['Vehicle',html_(vehicle)],['Confirmation',`<strong style="color:#003478;font-size:17px">${html_(r.ConfirmationNumber)}</strong>`]];
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border:1px solid #dce6f0;border-radius:10px;border-collapse:separate;overflow:hidden">${rows.map((x,i)=>`<tr><td width="34%" valign="top" style="padding:11px 13px;background:${i%2===0?'#f6f9fc':'#ffffff'};border-bottom:${i===rows.length-1?'0':'1px solid #e2eaf2'};font-size:12px;line-height:18px;text-transform:uppercase;letter-spacing:.55px;font-weight:bold;color:#667587">${x[0]}</td><td valign="top" style="padding:11px 13px;background:${i%2===0?'#f6f9fc':'#ffffff'};border-bottom:${i===rows.length-1?'0':'1px solid #e2eaf2'};font-size:14px;line-height:20px;color:#16283d">${x[1]}</td></tr>`).join('')}</table>`;
}
function notifySubmission_(r){
  const cfg=config_(),reviewUrl=cfg.SECURITY_CONSOLE_URL||'',result={sponsorSent:false,visitorSent:false,securitySent:false,securityConfigured:Boolean(cfg.NOTIFICATION_EMAIL),errors:[]};
  const visitPeriod=[r.StartDate,r.ArrivalTime].filter(Boolean).join(' ')+' through '+[r.EndDate,r.DepartureTime].filter(Boolean).join(' ');
  const vehicle=r.Driving==='Yes'?[r.VehicleYear,r.VehicleMake,r.VehicleModel,r.VehicleColor,r.LicensePlate,r.PlateState].filter(Boolean).join(' '):'Not driving';
  const details=emailDetailsTable_(r,visitPeriod,vehicle);
  try{
    if(r.SponsorEmail){
      const sponsorBody=`<p style="margin:0 0 16px">Hello ${html_(r.SponsorName)},</p><p style="margin:0 0 20px">A visitor identified you as the Ford Energy sponsor for the request below. Please review the visit details and coordinate with Security Operations.</p>${details}<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:20px"><tr><td style="padding:14px 16px;background:#fff4dc;border-left:5px solid #ff7a00;border-radius:7px;color:#684300;font-size:14px;line-height:20px"><strong>Action required:</strong> Submission does not authorize site access. Sponsor and Security review must be completed before check-in.</td></tr></table>${emailButton_(reviewUrl,'Review Visitor Request')}`;
      MailApp.sendEmail({to:r.SponsorEmail,subject:`Action requested: Visitor request ${r.ConfirmationNumber} for ${r.FullName}`,htmlBody:brandedEmail_({title:'Sponsor Approval Required',kicker:'FORD ENERGY · VISTA',preheader:`Review visitor request ${r.ConfirmationNumber} for ${r.FullName}`,body:sponsorBody})});
      result.sponsorSent=true;
    }
  }catch(err){result.errors.push('Sponsor email: '+String(err.message||err));}
  try{
    if(cfg.NOTIFICATION_EMAIL){
      const securityBody=`<p style="margin:0 0 20px">A new visitor registration has been submitted and is ready for review.</p>${details}${emailButton_(reviewUrl,'Open VISTA Security Console')}`;
      MailApp.sendEmail({to:cfg.NOTIFICATION_EMAIL,subject:`VISTA visitor request ${r.ConfirmationNumber}: ${r.FullName}`,htmlBody:brandedEmail_({title:'New Visitor Registration',preheader:`New VISTA request ${r.ConfirmationNumber}`,body:securityBody})});
      result.securitySent=true;
    }
  }catch(err){result.errors.push('Security email: '+String(err.message||err));}
  try{
    if(r.Email){
      const arrival=html_(cfg.ARRIVAL_INSTRUCTIONS||'Proceed to the Main Security Building and bring a valid government-issued photo ID.');
      const parking=html_(cfg.PARKING_INSTRUCTIONS||'Use designated visitor parking.');
      const visitorBody=`<p style="margin:0 0 16px">Hello ${html_(r.FullName)},</p><p style="margin:0 0 20px">Your Ford Energy visitor registration has been received. Your request is currently pending sponsor and Security review.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 20px"><tr><td style="padding:14px 16px;background:#eaf4ff;border-left:5px solid #0b67ad;border-radius:7px"><div style="font-size:12px;text-transform:uppercase;letter-spacing:.7px;font-weight:bold;color:#326288">Current status</div><div style="font-size:17px;line-height:24px;font-weight:bold;color:#003478;margin-top:3px">Submitted · Pending Review</div></td></tr></table>${details}<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:20px"><tr><td style="padding:15px 17px;background:#f3f8fd;border:1px solid #d7e6f3;border-radius:8px;font-size:14px;line-height:21px"><strong style="color:#003478">Arrival reminder</strong><br>${arrival}<br>${parking}</td></tr></table>${emailButton_(cfg.VGS_NAVIGATION_URL,'Open Visitor Navigation')}<p style="margin:20px 0 0">Keep confirmation number <strong style="color:#003478">${html_(r.ConfirmationNumber)}</strong> available for check-in.</p>`;
      MailApp.sendEmail({to:r.Email,subject:`Ford Energy visitor registration ${r.ConfirmationNumber}`,htmlBody:brandedEmail_({title:'Registration Received',preheader:`Your Ford Energy visitor request ${r.ConfirmationNumber} was received`,body:visitorBody})});
      result.visitorSent=true;
    }
  }catch(err){result.errors.push('Visitor email: '+String(err.message||err));}
  if(result.errors.length)console.log('VISTA notification errors: '+result.errors.join(' | '));
  return result;
}
function ensureBadgeAvailable_(uid,visitId){const s=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.BADGES),rows=readObjects_(FE.SHEETS.BADGES),b=rows.find(x=>String(x.BadgeUID)===String(uid));if(b&&b.Status==='Issued'&&String(b.CurrentVisitID)!==String(visitId))throw new Error('Badge is already issued to another visitor.');if(!b)s.appendRow([uid,'','Available','','','','Auto-created']);}
function assignBadge_(uid,visitId,now){upsertBadge_(uid,{Status:'Issued',CurrentVisitID:visitId,IssuedAt:now,ReturnedAt:''})}
function returnBadge_(uid,now){upsertBadge_(uid,{Status:'Available',CurrentVisitID:'',ReturnedAt:now})}
function upsertBadge_(uid,updates){const s=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.BADGES),data=s.getDataRange().getValues(),headers=data[0],idx=headers.indexOf('BadgeUID');let row=-1;for(let i=1;i<data.length;i++)if(String(data[i][idx])===String(uid)){row=i+1;break}if(row<0){s.appendRow(FE.BADGE_HEADERS.map(h=>h==='BadgeUID'?uid:(updates[h]??'')));return}Object.entries(updates).forEach(([k,v])=>{const c=headers.indexOf(k);if(c>=0)s.getRange(row,c+1).setValue(v)})}
function logActivity_(visitId,type,by,badge,details){SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.ACTIVITY).appendRow(['ACT-'+Utilities.getUuid().slice(0,12).toUpperCase(),visitId,type,new Date(),by||'',badge||'',details||''])}
function findVisitRow_(visitId){const s=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.VISITS),data=s.getDataRange().getValues(),h=data[0],idx=h.indexOf('VisitID');for(let i=1;i<data.length;i++)if(String(data[i][idx])===String(visitId))return{row:i+1,obj:h.reduce((o,k,j)=>(o[k]=data[i][j],o),{})};throw new Error('Visit record not found.')}
function updateVisitRow_(row,updates){const s=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.VISITS),h=s.getRange(1,1,1,s.getLastColumn()).getValues()[0];Object.entries(updates).forEach(([k,v])=>{const c=h.indexOf(k);if(c>=0)s.getRange(row,c+1).setValue(v)})}
function publicVisit_(r){
  const photoFileId=String(r.PhotoFileId||'').trim();
  const photoFileName=String(r.PhotoFileName||'').trim();
  const photoUrl=String(r.PhotoUrl||'').trim();
  return{visitId:String(r.VisitID||''),confirmationNumber:String(r.ConfirmationNumber||''),fullName:String(r.FullName||''),email:String(r.Email||''),phone:String(r.Phone||''),company:String(r.Company||''),sponsorName:String(r.SponsorName||''),sponsorEmail:String(r.SponsorEmail||''),department:String(r.Department||''),reason:String(r.Reason||''),project:String(r.Project||''),visitorType:String(r.VisitorType||''),startDate:dateOnly_(r.StartDate),arrivalTime:timeOnly_(r.ArrivalTime),endDate:dateOnly_(r.EndDate),departureTime:timeOnly_(r.DepartureTime),accessScope:String(r.AccessScope||''),escortRequired:String(r.EscortRequired||''),lineTour:String(r.LineTour||''),specialItems:String(r.SpecialItems||''),driving:String(r.Driving||''),vehicleMake:String(r.VehicleMake||''),vehicleModel:String(r.VehicleModel||''),vehicleYear:String(r.VehicleYear||''),vehicleColor:String(r.VehicleColor||''),licensePlate:String(r.LicensePlate||''),plateState:String(r.PlateState||''),hasPhoto:Boolean(photoFileId||photoFileName||photoUrl),photoFileId,photoFileName,photoUrl,status:String(r.Status||''),agreementCompletionStatus:String(r.AgreementCompletionStatus||''),agreementCompletionCount:String(r.AgreementCompletionCount||''),checkInTime:dateTime_(r.CheckInTime),checkOutTime:dateTime_(r.CheckOutTime),badgeUid:String(r.BadgeUID||''),actualDurationMinutes:r.ActualDurationMinutes||''}
}
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

function setupVistaIdentityAndRoles(){
  const result=setupVisitorManagement();
  syncRosterUsers_();
  return result+' Initial admin username: vistaadmin. PIN uses Config SECURITY_PIN until changed.';
}
function syncVistaRoleRosters(){syncRosterUsers_();return 'FrontDesk and Security roster users synchronized into Users.';}
function createVistaUser(employeeId,fullName,email,role,pin,department,company,badgeUID){
  const allowed=['Sponsor','Approver','FrontDesk','Security','Admin'];if(!allowed.includes(String(role)))throw new Error('Role must be Sponsor, Approver, FrontDesk, Security, or Admin.');
  if(!email)throw new Error('Email is required.');const username=String(email).split('@')[0].toLowerCase();
  try{findUserRow_(username);throw new Error('A user with this username already exists.');}catch(err){if(String(err.message).indexOf('not found')<0)throw err;}
  const rec={UserID:'USR-'+Utilities.getUuid().slice(0,10).toUpperCase(),EmployeeID:employeeId||'',FullName:fullName||username,Email:email,Department:department||'',Company:company||'Ford Energy',BadgeUID:badgeUID||'',Username:username,PINHash:pinHash_(username,pin),Role:role,ApprovalScope:role==='Sponsor'||role==='Approver'?'OWN_SPONSORED_VISITS':'ALL',Active:'Yes',CreatedAt:new Date(),LastLoginAt:'',FailedLoginCount:0,Notes:'Created with createVistaUser.'};
  appendObjectRow_(SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.USERS),rec,FE.USER_HEADERS);return 'Created '+role+' user '+username;
}
function seedInitialAdmin_(){
  const sheet=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.USERS); if(!sheet)return;
  const rows=readObjects_(FE.SHEETS.USERS); if(rows.some(r=>String(r.Username).toLowerCase()==='vistaadmin'))return;
  const pin=config_().SECURITY_PIN||'1937', now=new Date();
  const rec={UserID:'USR-'+Utilities.getUuid().slice(0,10).toUpperCase(),EmployeeID:'',FullName:'VISTA Administrator',Email:'',Department:'Global Security',Company:'Ford Energy',BadgeUID:'',Username:'vistaadmin',PINHash:pinHash_('vistaadmin',pin),Role:'Admin',ApprovalScope:'ALL',Active:'Yes',CreatedAt:now,LastLoginAt:'',FailedLoginCount:0,Notes:'Initial account created by setupVistaIdentityAndRoles. Change PIN immediately.'};
  appendObjectRow_(sheet,rec,FE.USER_HEADERS);
}
function syncRosterUsers_(){
  syncRoleRoster_(FE.SHEETS.FRONTDESK,'FrontDesk');
  syncRoleRoster_(FE.SHEETS.SECURITY,'Security');
}
function syncRoleRoster_(sheetName,role){
  const rows=readObjects_(sheetName), users=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.USERS), existing=readObjects_(FE.SHEETS.USERS);
  rows.forEach(r=>{
    if(!truthyActive_(r.Active)||!r.Email)return;
    const username=String(r.Email).split('@')[0].toLowerCase();
    if(existing.some(u=>String(u.Username).toLowerCase()===username))return;
    const rec={UserID:'USR-'+Utilities.getUuid().slice(0,10).toUpperCase(),EmployeeID:r.EmployeeID||'',FullName:r.FullName||'',Email:r.Email||'',Department:r.Department||'',Company:r.Company||'Ford Energy',BadgeUID:r.BadgeUID||'',Username:username,PINHash:'',Role:role,ApprovalScope:'',Active:'Yes',CreatedAt:new Date(),LastLoginAt:'',FailedLoginCount:0,Notes:'PIN not set. Run setVistaUserPin.'};
    appendObjectRow_(users,rec,FE.USER_HEADERS);
  });
}
function setVistaUserPin(username,pin){
  if(String(pin||'').length<4)throw new Error('PIN must be at least 4 characters.');
  const row=findUserRow_(username); updateObjectRow_(FE.SHEETS.USERS,row.row,{PINHash:pinHash_(String(row.obj.Username).toLowerCase(),pin),FailedLoginCount:0});
  return 'PIN updated for '+row.obj.Username;
}
function pinHash_(username,pin){return sha256_(String(username).toLowerCase()+'|'+String(pin)+'|'+(config_().AUTH_SALT||'FORD-ENERGY-VISTA'));}

function normalizeBadgeUid_(value){
  return String(value||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'');
}
function badgeUidList_(value){
  return String(value||'').split(/[:;,|\r\n]+/).map(normalizeBadgeUid_).filter(Boolean);
}
function userForBadge_(badgeUid){
  const scanned=normalizeBadgeUid_(badgeUid);
  if(!scanned)throw new Error('Badge UID is required.');
  const matches=readObjects_(FE.SHEETS.USERS).filter(user=>
    truthyActive_(user.Active)&&badgeUidList_(user.BadgeUID).includes(scanned)
  );
  if(matches.length===0)throw new Error('This badge is not authorized for VISTA.');
  if(matches.length>1)throw new Error('This badge UID is assigned to more than one active VISTA account. Contact an administrator.');
  return matches[0];
}
function createAuthenticatedSession_(user,p,method){
  const token=Utilities.getUuid().replace(/-/g,'')+Utilities.getUuid().replace(/-/g,'');
  const now=new Date(),cfg=config_();
  const hours=Math.max(1,Number(cfg.AUTH_SESSION_HOURS||8));
  const expires=new Date(now.getTime()+hours*3600000);
  appendObjectRow_(SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.SESSIONS),{
    SessionToken:token,UserID:user.UserID,Username:user.Username,Role:user.Role,
    CreatedAt:now,ExpiresAt:expires,LastSeenAt:now,UserAgent:String((p&&p.userAgent)||'')
  },FE.SESSION_HEADERS);
  const row=findUserRow_(user.Username);
  updateObjectRow_(FE.SHEETS.USERS,row.row,{LastLoginAt:now,FailedLoginCount:0});
  audit_(user,'LOGIN_'+method,'','','Success','Authentication method: '+method);
  return {ok:true,token,user:publicSessionUser_(user),permissions:permissionsForRole_(user.Role),expiresAt:expires};
}
function loginUser_(p,e){
  validateRequired_(p,['username','pin']);
  const username=String(p.username).trim().toLowerCase(),row=findUserRow_(username),user=row.obj;
  if(!truthyActive_(user.Active))throw new Error('This VISTA account is disabled.');
  const maxFailures=Math.max(3,Number(config_().AUTH_MAX_FAILED_LOGINS||5));
  const failures=Number(user.FailedLoginCount||0);
  if(failures>=maxFailures)throw new Error('This account is locked due to repeated failed sign-in attempts. Contact a VISTA administrator.');
  if(!user.PINHash||String(user.PINHash)!==pinHash_(username,p.pin)){
    const next=failures+1;
    updateObjectRow_(FE.SHEETS.USERS,row.row,{FailedLoginCount:next});
    audit_(user,'LOGIN_PIN','','','Denied','Invalid PIN; failed attempt '+next);
    throw new Error(next>=maxFailures?'Account locked after repeated failed attempts. Contact an administrator.':'Invalid username or PIN.');
  }
  return createAuthenticatedSession_(user,p,'PIN');
}
function badgeLoginUser_(p,e){
  validateRequired_(p,['badgeUid']);
  const scanned=normalizeBadgeUid_(p.badgeUid);
  let user;
  try{user=userForBadge_(scanned);}
  catch(err){
    audit_({UserID:'',Username:'UNKNOWN',Role:'Unknown'},'LOGIN_BADGE','','','Denied','Unrecognized badge fingerprint '+sha256_(scanned).slice(0,12));
    throw err;
  }
  if(!truthyActive_(user.Active))throw new Error('This VISTA account is disabled.');
  return createAuthenticatedSession_(user,p,'BADGE');
}
function logoutUser_(session,token){deleteSession_(token);audit_(session,'LOGOUT','','','Success','');return{ok:true};}
function requireSession_(token){
  if(!token)throw new Error('Your VISTA session is not signed in.');
  const rows=readObjects_(FE.SHEETS.SESSIONS),s=rows.find(r=>String(r.SessionToken)===String(token));
  if(!s)throw new Error('Your VISTA session has expired. Sign in again.');
  const now=new Date();
  if(new Date(s.ExpiresAt)<now){deleteSession_(token);throw new Error('Your VISTA session has expired. Sign in again.');}
  const idleMinutes=Math.max(5,Number(config_().AUTH_IDLE_MINUTES||30));
  const lastSeen=new Date(s.LastSeenAt||s.CreatedAt);
  if(now.getTime()-lastSeen.getTime()>idleMinutes*60000){
    deleteSession_(token);throw new Error('Your VISTA session ended after inactivity. Sign in again.');
  }
  const user=findUserRow_(s.Username).obj;
  if(!truthyActive_(user.Active))throw new Error('This VISTA account is disabled.');
  touchSession_(token,now);
  return Object.assign({},user,{SessionToken:token});
}
function touchSession_(token,when){
  const s=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.SESSIONS);
  if(!s||s.getLastRow()<2)return;
  const data=s.getDataRange().getValues(),h=data[0],tokenIdx=h.indexOf('SessionToken'),seenIdx=h.indexOf('LastSeenAt');
  for(let i=1;i<data.length;i++)if(String(data[i][tokenIdx])===String(token)){s.getRange(i+1,seenIdx+1).setValue(when||new Date());return;}
}
function deleteSession_(token){
  const s=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.SESSIONS);
  if(!s||s.getLastRow()<2)return;
  const data=s.getDataRange().getValues(),h=data[0],idx=h.indexOf('SessionToken');
  for(let i=data.length-1;i>=1;i--)if(String(data[i][idx])===String(token))s.deleteRow(i+1);
}
function cleanupExpiredVistaSessions(){
  const s=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.SESSIONS);
  if(!s||s.getLastRow()<2)return 'No sessions to clean.';
  const data=s.getDataRange().getValues(),h=data[0],idx=h.indexOf('ExpiresAt'),now=new Date();let removed=0;
  for(let i=data.length-1;i>=1;i--)if(idx>=0&&new Date(data[i][idx])<now){s.deleteRow(i+1);removed++;}
  return 'Removed '+removed+' expired VISTA session(s).';
}
function findUserRow_(username){
  const s=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.USERS),data=s.getDataRange().getValues(),h=data[0],idx=h.indexOf('Username');
  for(let i=1;i<data.length;i++)if(String(data[i][idx]).trim().toLowerCase()===String(username).trim().toLowerCase())
    return{row:i+1,obj:h.reduce((o,k,j)=>(o[k]=data[i][j],o),{})};
  throw new Error('VISTA user account not found.');
}
function updateObjectRow_(sheetName,row,updates){const s=SpreadsheetApp.getActive().getSheetByName(sheetName),h=s.getRange(1,1,1,s.getLastColumn()).getValues()[0];Object.entries(updates).forEach(([k,v])=>{const c=h.indexOf(k);if(c>=0)s.getRange(row,c+1).setValue(v)});}
function truthyActive_(v){return !['no','false','0','inactive','disabled',''].includes(String(v||'Yes').trim().toLowerCase());}

function permissionsForRole_(role){
  const r=String(role||'').trim().toLowerCase();
  const none={viewVisits:false,viewPhoto:false,approve:false,deny:false,checkIn:false,checkOut:false,noShow:false,admin:false,manageUsers:false,manageConfig:false,viewAudit:false};
  if(r==='admin')return {viewVisits:true,viewPhoto:true,approve:true,deny:true,checkIn:true,checkOut:true,noShow:true,admin:true,manageUsers:true,manageConfig:true,viewAudit:true};
  if(r==='security')return {viewVisits:true,viewPhoto:true,approve:true,deny:true,checkIn:true,checkOut:true,noShow:true,admin:false,manageUsers:false,manageConfig:false,viewAudit:true};
  if(r==='frontdesk')return {viewVisits:true,viewPhoto:true,approve:false,deny:false,checkIn:true,checkOut:true,noShow:true,admin:false,manageUsers:false,manageConfig:false,viewAudit:false};
  if(r==='sponsor'||r==='approver')return {viewVisits:true,viewPhoto:true,approve:true,deny:true,checkIn:false,checkOut:false,noShow:false,admin:false,manageUsers:false,manageConfig:false,viewAudit:false};
  return none;
}
function requirePermission_(session,key){if(!permissionsForRole_(session.Role)[key])throw new Error('Your '+session.Role+' role is not authorized to perform this action.');}
function publicSessionUser_(u){return{userId:String(u.UserID||''),employeeId:String(u.EmployeeID||''),fullName:String(u.FullName||u.Username||''),email:String(u.Email||''),department:String(u.Department||''),username:String(u.Username||''),role:String(u.Role||'')};}
function listVisitsForSession_(p,session){requirePermission_(session,'viewVisits');let result=listVisits_(p);if(String(session.Role).toLowerCase()==='sponsor'||String(session.Role).toLowerCase()==='approver'){const email=String(session.Email||'').toLowerCase();result.visits=result.visits.filter(v=>String(v.sponsorEmail||'').toLowerCase()===email);result.kpis={expectedToday:result.visits.length,onsite:result.visits.filter(v=>v.status==='Checked In').length,checkedOutToday:result.visits.filter(v=>v.status==='Checked Out').length,overdue:0};}return result;}
function checkInVisitAuthorized_(p,session){requirePermission_(session,'checkIn');p.officerName=p.officerName||session.FullName||session.Username;const result=checkInVisit_(p);auditVisit_(session,'CHECK_IN',p.visitId,'Success','Badge '+p.badgeUid);return result;}
function checkOutVisitAuthorized_(p,session){requirePermission_(session,'checkOut');p.officerName=p.officerName||session.FullName||session.Username;const result=checkOutVisit_(p);auditVisit_(session,'CHECK_OUT',p.visitId,'Success','Badge '+p.badgeUid);return result;}
function updateVisitStatusAuthorized_(p,session){
  validateRequired_(p,['visitId','status']);const status=String(p.status),role=String(session.Role).toLowerCase(),rec=findVisitRow_(p.visitId).obj;
  if(status==='Approved'){requirePermission_(session,'approve');if((role==='sponsor'||role==='approver')&&String(rec.SponsorEmail).toLowerCase()!==String(session.Email).toLowerCase())throw new Error('Sponsors may only approve visits assigned to their own email address.');}
  else if(status==='Denied'||status==='Rejected'){requirePermission_(session,'deny');if((role==='sponsor'||role==='approver')&&String(rec.SponsorEmail).toLowerCase()!==String(session.Email).toLowerCase())throw new Error('Sponsors may only deny visits assigned to their own email address.');}
  else if(status==='No Show')requirePermission_(session,'noShow');
  else throw new Error('This status transition is not permitted through the Security Console.');
  const result=updateVisitStatus_(p);auditVisit_(session,'STATUS_'+status.toUpperCase().replace(/\s+/g,'_'),p.visitId,'Success','');return result;
}
function auditVisit_(session,action,visitId,result,details){let confirmation='';try{confirmation=findVisitRow_(visitId).obj.ConfirmationNumber||''}catch(e){}audit_(session,action,visitId,confirmation,result,details);}
function audit_(u,action,visitId,confirmation,result,details){const rec={AuditID:'AUD-'+Utilities.getUuid().slice(0,12).toUpperCase(),Timestamp:new Date(),UserID:u.UserID||'',Username:u.Username||'',Role:u.Role||'',Action:action,VisitID:visitId||'',ConfirmationNumber:confirmation||'',Result:result||'',Details:details||''};appendObjectRow_(SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.AUDIT),rec,FE.AUDIT_HEADERS);}

function appendObjectRow_(sheet, record, canonicalHeaders){
  if(!sheet)throw new Error('Destination sheet is unavailable.');
  const lastColumn=Math.max(sheet.getLastColumn(),canonicalHeaders.length);
  if(sheet.getLastColumn()<canonicalHeaders.length)sheet.insertColumnsAfter(Math.max(1,sheet.getLastColumn()),canonicalHeaders.length-sheet.getLastColumn());
  let headers=sheet.getRange(1,1,1,lastColumn).getDisplayValues()[0].map(x=>String(x||'').trim());
  canonicalHeaders.forEach(h=>{if(!headers.includes(h)){const col=headers.length+1;sheet.getRange(1,col).setValue(h);headers.push(h)}});
  sheet.appendRow(headers.map(h=>Object.prototype.hasOwnProperty.call(record,h)?(record[h]??''):''));
}

function repairVisitRequestsHeaders(){
  const ss=SpreadsheetApp.getActive();
  const sheet=ss.getSheetByName(FE.SHEETS.VISITS);
  if(!sheet)throw new Error('VisitRequests sheet was not found.');
  const stamp=Utilities.formatDate(new Date(),tz_(),'yyyyMMdd-HHmmss');
  const backup=sheet.copyTo(ss).setName(`VisitRequests-BACKUP-${stamp}`);
  const required=FE.VISIT_HEADERS.length;
  if(sheet.getMaxColumns()<required)sheet.insertColumnsAfter(sheet.getMaxColumns(),required-sheet.getMaxColumns());
  sheet.getRange(1,1,1,required).setValues([FE.VISIT_HEADERS]);
  if(sheet.getLastColumn()>required)sheet.getRange(1,required+1,1,sheet.getLastColumn()-required).clearContent();
  sheet.getRange(1,1,1,required).setFontWeight('bold').setBackground('#003478').setFontColor('#ffffff');
  sheet.setFrozenRows(1);
  return `VisitRequests headers repaired. Backup created: ${backup.getName()}`;
}

function ensureSheet_(ss,name,headers){let s=ss.getSheetByName(name);if(!s)s=ss.insertSheet(name);if(s.getLastRow()===0)s.appendRow(headers);else{const current=s.getRange(1,1,1,s.getLastColumn()).getValues()[0];headers.forEach(h=>{if(!current.includes(h)){s.getRange(1,s.getLastColumn()+1).setValue(h);current.push(h)}})}s.getRange(1,1,1,s.getLastColumn()).setFontWeight('bold').setBackground('#003478').setFontColor('#ffffff');return s}
function sha256_(text){return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,String(text),Utilities.Charset.UTF_8).map(b=>(b+256)%256).map(b=>('0'+b.toString(16)).slice(-2)).join('')}
function html_(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function json_(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON)}
function jsonp_(o,callback){
  const cb=String(callback||'').replace(/[^A-Za-z0-9_.$]/g,'');
  if(!cb) return json_(o);
  return ContentService.createTextOutput(cb+'('+JSON.stringify(o)+');').setMimeType(ContentService.MimeType.JAVASCRIPT);
}


function applyVista20ASecurityDefaults(){
  const sheet=ensureSheet_(SpreadsheetApp.getActive(),FE.SHEETS.CONFIG,FE.CONFIG_HEADERS);
  const defaults={AUTH_SESSION_HOURS:'8',AUTH_IDLE_MINUTES:'30',AUTH_MAX_FAILED_LOGINS:'5',PUBLIC_SPONSOR_EMAILS:'NO',SECURITY_BASELINE:'VISTA-2.0A'};
  const rows=sheet.getDataRange().getValues();
  Object.keys(defaults).forEach(key=>{
    let found=false;
    for(let i=1;i<rows.length;i++)if(String(rows[i][0]).trim()===key){sheet.getRange(i+1,2).setValue(defaults[key]);found=true;break;}
    if(!found)sheet.appendRow([key,defaults[key]]);
  });
  cleanupExpiredVistaSessions();
  return 'VISTA 2.0A security defaults applied.';
}
