const FE = {
  SHEETS: { VISITS:'VisitRequests', ACTIVITY:'VisitActivity', BADGES:'BadgeInventory', CONFIG:'Config' },
  VISIT_HEADERS: ['VisitID','ConfirmationNumber','CreatedAt','Status','FirstName','MiddleName','LastName','FullName','Email','Phone','Company','JobTitle','Relationship','Street','City','State','PostalCode','Country','EmergencyName','EmergencyPhone','SponsorName','SponsorEmail','Department','SecondaryContact','Reason','Project','VisitorType','StartDate','ArrivalTime','EndDate','DepartureTime','AccessScope','EscortRequired','LineTour','SpecialItems','Driving','VehicleMake','VehicleModel','VehicleYear','VehicleColor','LicensePlate','PlateState','PhotoFileId','PhotoUrl','AgreementVersion','AcknowledgementName','AcknowledgementDate','AgreementTimestamp','AgreeSecurity','AgreeBiometric','AgreeSafety','AgreeConduct','CheckInTime','CheckOutTime','BadgeUID','CheckInOfficer','CheckOutOfficer','SponsorNotified','IDRetained','IDReturned','ActualDurationMinutes','LastUpdatedAt'],
  ACTIVITY_HEADERS: ['ActivityID','VisitID','EventType','EventTime','PerformedBy','BadgeUID','Details'],
  BADGE_HEADERS: ['BadgeUID','BadgeNumber','Status','CurrentVisitID','IssuedAt','ReturnedAt','Notes'],
  CONFIG_HEADERS: ['Key','Value']
};

function doGet() { return json_({ok:true, service:'Ford Energy Visitor Management API', version:'1.0.0'}); }
function doPost(e) {
  try {
    const req = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const action = req.action || '';
    if (action === 'createVisit') return json_(createVisit_(req.payload || {}));
    requireSecurity_(req.pin);
    if (action === 'securityLogin') return json_({ok:true});
    if (action === 'listVisits') return json_(listVisits_(req.payload || {}));
    if (action === 'checkInVisit') return json_(checkInVisit_(req.payload || {}));
    if (action === 'checkOutVisit') return json_(checkOutVisit_(req.payload || {}));
    if (action === 'updateVisitStatus') return json_(updateVisitStatus_(req.payload || {}));
    throw new Error('Unknown action: ' + action);
  } catch (err) { return json_({ok:false,error:String(err.message || err)}); }
}

function setupVisitorManagement() {
  const ss = SpreadsheetApp.getActive();
  ensureSheet_(ss, FE.SHEETS.VISITS, FE.VISIT_HEADERS);
  ensureSheet_(ss, FE.SHEETS.ACTIVITY, FE.ACTIVITY_HEADERS);
  ensureSheet_(ss, FE.SHEETS.BADGES, FE.BADGE_HEADERS);
  const config = ensureSheet_(ss, FE.SHEETS.CONFIG, FE.CONFIG_HEADERS);
  const existing = config.getDataRange().getValues().slice(1).reduce((o,r)=>(o[r[0]]=r[1],o),{});
  if (!existing.SECURITY_PIN) config.appendRow(['SECURITY_PIN','1937']);
  if (!existing.PHOTO_FOLDER_ID) config.appendRow(['PHOTO_FOLDER_ID','']);
  if (!existing.SITE_TIMEZONE) config.appendRow(['SITE_TIMEZONE','America/New_York']);
  if (!existing.NOTIFICATION_EMAIL) config.appendRow(['NOTIFICATION_EMAIL','']);
  [FE.SHEETS.VISITS,FE.SHEETS.ACTIVITY,FE.SHEETS.BADGES].forEach(n=>ss.getSheetByName(n).setFrozenRows(1));
  return 'Setup complete. Update the Config sheet, then deploy as a Web app.';
}

function createVisit_(p) {
  validateRequired_(p,['firstName','lastName','email','phone','company','sponsorName','sponsorEmail','department','reason','startDate','endDate','accessScope','acknowledgementName','acknowledgementDate']);
  ['agreeSecurity','agreeBiometric','agreeSafety','agreeConduct'].forEach(k=>{if(!truthy_(p[k]))throw new Error('All agreements must be acknowledged.')});
  const ss=SpreadsheetApp.getActive(), sheet=ss.getSheetByName(FE.SHEETS.VISITS); if(!sheet)throw new Error('Run setupVisitorManagement first.');
  const visitId='VST-'+Utilities.formatDate(new Date(),tz_(),'yyyyMMdd')+'-'+Utilities.getUuid().slice(0,8).toUpperCase();
  const confirmation='FE-'+Utilities.getUuid().replace(/-/g,'').slice(0,8).toUpperCase();
  let photoFileId='', photoUrl='';
  if(p.photoDataUrl){const saved=savePhoto_(p.photoDataUrl,visitId);photoFileId=saved.id;photoUrl=saved.url}
  const now=new Date(), fullName=[p.firstName,p.middleName,p.lastName].filter(Boolean).join(' ');
  const record={VisitID:visitId,ConfirmationNumber:confirmation,CreatedAt:now,Status:'Submitted',FirstName:p.firstName,MiddleName:p.middleName||'',LastName:p.lastName,FullName:fullName,Email:p.email,Phone:p.phone,Company:p.company,JobTitle:p.jobTitle||'',Relationship:p.relationship||'',Street:p.street||'',City:p.city||'',State:p.state||'',PostalCode:p.postalCode||'',Country:p.country||'',EmergencyName:p.emergencyName||'',EmergencyPhone:p.emergencyPhone||'',SponsorName:p.sponsorName,SponsorEmail:p.sponsorEmail,Department:p.department,SecondaryContact:p.secondaryContact||'',Reason:p.reason,Project:p.project||'',VisitorType:p.visitorType||'',StartDate:p.startDate,ArrivalTime:p.arrivalTime||'',EndDate:p.endDate,DepartureTime:p.departureTime||'',AccessScope:p.accessScope,EscortRequired:p.escortRequired||'',LineTour:p.lineTour||'',SpecialItems:p.specialItems||'',Driving:p.driving||'No',VehicleMake:p.vehicleMake||'',VehicleModel:p.vehicleModel||'',VehicleYear:p.vehicleYear||'',VehicleColor:p.vehicleColor||'',LicensePlate:p.licensePlate||'',PlateState:p.plateState||'',PhotoFileId:photoFileId,PhotoUrl:photoUrl,AgreementVersion:p.agreementVersion||'',AcknowledgementName:p.acknowledgementName,AcknowledgementDate:p.acknowledgementDate,AgreementTimestamp:now,AgreeSecurity:'Yes',AgreeBiometric:'Yes',AgreeSafety:'Yes',AgreeConduct:'Yes',LastUpdatedAt:now};
  sheet.appendRow(FE.VISIT_HEADERS.map(h=>record[h]??''));
  logActivity_(visitId,'REGISTRATION_SUBMITTED','Visitor','',`Confirmation ${confirmation}`);
  notifySubmission_(record);
  return {ok:true,visitId,confirmationNumber:confirmation};
}

function listVisits_(p) {
  const rows=readObjects_(FE.SHEETS.VISITS), q=String(p.query||'').toLowerCase(), status=String(p.status||'');
  const visits=rows.filter(r=>!status||r.Status===status).filter(r=>!q||[r.FullName,r.ConfirmationNumber,r.SponsorName,r.Company,r.LicensePlate,r.BadgeUID,r.VisitID].join(' ').toLowerCase().includes(q)).sort((a,b)=>new Date(b.CreatedAt)-new Date(a.CreatedAt)).slice(0,500).map(publicVisit_);
  const today=Utilities.formatDate(new Date(),tz_(),'yyyy-MM-dd'), now=new Date();
  const kpis={expectedToday:rows.filter(r=>dateKey_(r.StartDate)===today&&!['Checked Out','Denied','Cancelled','No Show'].includes(r.Status)).length,onsite:rows.filter(r=>r.Status==='Checked In').length,checkedOutToday:rows.filter(r=>r.Status==='Checked Out'&&dateKey_(r.CheckOutTime)===today).length,overdue:rows.filter(r=>r.Status==='Checked In'&&r.EndDate&&new Date(`${dateKey_(r.EndDate)}T${r.DepartureTime||'23:59'}`)<now).length};
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
function updateVisitStatus_(p) { validateRequired_(p,['visitId','status']); const row=findVisitRow_(p.visitId),now=new Date();updateVisitRow_(row.row,{Status:p.status,LastUpdatedAt:now});logActivity_(p.visitId,'STATUS_UPDATED','Security','',p.status);return {ok:true}; }

function savePhoto_(dataUrl,visitId){const m=String(dataUrl).match(/^data:(image\/[^;]+);base64,(.+)$/);if(!m)throw new Error('Invalid photograph data.');const cfg=config_(),folder=cfg.PHOTO_FOLDER_ID?DriveApp.getFolderById(cfg.PHOTO_FOLDER_ID):DriveApp.getRootFolder();const ext=m[1].includes('png')?'png':'jpg';const blob=Utilities.newBlob(Utilities.base64Decode(m[2]),m[1],visitId+'.'+ext);const file=folder.createFile(blob);return{id:file.getId(),url:`https://drive.google.com/uc?export=view&id=${file.getId()}`}}
function notifySubmission_(r){try{const cfg=config_(),to=[r.SponsorEmail,cfg.NOTIFICATION_EMAIL].filter(Boolean).join(',');if(!to)return;MailApp.sendEmail({to,subject:`Visitor request ${r.ConfirmationNumber}: ${r.FullName}`,htmlBody:`<h2>New Ford Energy visitor request</h2><p><b>Visitor:</b> ${html_(r.FullName)} (${html_(r.Company)})</p><p><b>Dates:</b> ${html_(r.StartDate)} through ${html_(r.EndDate)}</p><p><b>Reason:</b> ${html_(r.Reason)}</p><p><b>Access:</b> ${html_(r.AccessScope)}</p><p><b>Confirmation:</b> ${html_(r.ConfirmationNumber)}</p>`})}catch(err){console.log(err)}}
function ensureBadgeAvailable_(uid,visitId){const s=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.BADGES),rows=readObjects_(FE.SHEETS.BADGES);const b=rows.find(x=>String(x.BadgeUID)===String(uid));if(b&&b.Status==='Issued'&&String(b.CurrentVisitID)!==String(visitId))throw new Error('Badge is already issued to another visitor.');if(!b)s.appendRow([uid,'','Available','','','','Auto-created']);}
function assignBadge_(uid,visitId,now){upsertBadge_(uid,{Status:'Issued',CurrentVisitID:visitId,IssuedAt:now,ReturnedAt:''})}
function returnBadge_(uid,now){upsertBadge_(uid,{Status:'Available',CurrentVisitID:'',ReturnedAt:now})}
function upsertBadge_(uid,updates){const s=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.BADGES),data=s.getDataRange().getValues(),headers=data[0],idx=headers.indexOf('BadgeUID');let row=-1;for(let i=1;i<data.length;i++)if(String(data[i][idx])===String(uid)){row=i+1;break}if(row<0){s.appendRow(FE.BADGE_HEADERS.map(h=>h==='BadgeUID'?uid:(updates[h]??'')));return}Object.entries(updates).forEach(([k,v])=>{const c=headers.indexOf(k);if(c>=0)s.getRange(row,c+1).setValue(v)})}
function logActivity_(visitId,type,by,badge,details){const s=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.ACTIVITY);s.appendRow(['ACT-'+Utilities.getUuid().slice(0,12).toUpperCase(),visitId,type,new Date(),by||'',badge||'',details||''])}
function findVisitRow_(visitId){const s=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.VISITS),data=s.getDataRange().getValues(),h=data[0],idx=h.indexOf('VisitID');for(let i=1;i<data.length;i++)if(String(data[i][idx])===String(visitId))return{row:i+1,obj:h.reduce((o,k,j)=>(o[k]=data[i][j],o),{})};throw new Error('Visit record not found.')}
function updateVisitRow_(row,updates){const s=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.VISITS),h=s.getRange(1,1,1,s.getLastColumn()).getValues()[0];Object.entries(updates).forEach(([k,v])=>{const c=h.indexOf(k);if(c>=0)s.getRange(row,c+1).setValue(v)})}
function publicVisit_(r){const out={};['VisitID','ConfirmationNumber','FullName','Email','Phone','Company','SponsorName','SponsorEmail','Department','Reason','Project','VisitorType','StartDate','ArrivalTime','EndDate','DepartureTime','AccessScope','EscortRequired','LineTour','SpecialItems','Driving','VehicleMake','VehicleModel','VehicleYear','VehicleColor','LicensePlate','PlateState','PhotoUrl','Status','CheckInTime','CheckOutTime','BadgeUID','ActualDurationMinutes'].forEach(k=>out[k.charAt(0).toLowerCase()+k.slice(1)]=formatValue_(r[k]));return out}
function readObjects_(name){const s=SpreadsheetApp.getActive().getSheetByName(name);if(!s||s.getLastRow()<2)return[];const d=s.getDataRange().getValues(),h=d.shift();return d.map(r=>h.reduce((o,k,i)=>(o[k]=r[i],o),{}))}
function config_(){return readObjects_(FE.SHEETS.CONFIG).reduce((o,r)=>(o[String(r.Key)]=String(r.Value),o),{})}
function requireSecurity_(pin){const expected=config_().SECURITY_PIN||'1937';if(String(pin)!==String(expected))throw new Error('Invalid Security PIN.')}
function tz_(){return config_().SITE_TIMEZONE||Session.getScriptTimeZone()||'America/New_York'}
function dateKey_(v){if(!v)return'';if(v instanceof Date)return Utilities.formatDate(v,tz_(),'yyyy-MM-dd');return String(v).slice(0,10)}
function formatValue_(v){if(v instanceof Date)return Utilities.formatDate(v,tz_(),'yyyy-MM-dd HH:mm:ss');return v??''}
function validateRequired_(o,keys){keys.forEach(k=>{if(o[k]===undefined||o[k]===null||String(o[k]).trim()==='')throw new Error('Missing required field: '+k)})}
function truthy_(v){return v===true||v==='true'||v==='on'||v==='Yes'}
function ensureSheet_(ss,name,headers){let s=ss.getSheetByName(name);if(!s)s=ss.insertSheet(name);if(s.getLastRow()===0)s.appendRow(headers);else{const current=s.getRange(1,1,1,s.getLastColumn()).getValues()[0];headers.forEach(h=>{if(!current.includes(h)){s.getRange(1,s.getLastColumn()+1).setValue(h);current.push(h)}})}s.getRange(1,1,1,s.getLastColumn()).setFontWeight('bold').setBackground('#003478').setFontColor('#ffffff');return s}
function html_(v){return String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function json_(o){return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON)}
