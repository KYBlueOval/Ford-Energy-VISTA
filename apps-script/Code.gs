const FE = {
  VERSION: '2.5.4-visitor-invitations',
  SHEETS: { VISITS:'VisitRequests', ACTIVITY:'VisitActivity', BADGES:'BadgeInventory', CONFIG:'Config', AGREEMENTS:'Agreements', ACKS:'AgreementAcknowledgements', SPONSORS:'Sponsors', USERS:'Users', FRONTDESK:'FrontDesk', SECURITY:'Security', SESSIONS:'AuthSessions', AUDIT:'AuditLog', HANDOFFS:'ShiftHandoffs', NOTIFICATIONS:'Notifications', NOTIFICATION_ACKS:'NotificationAcknowledgements', INCIDENTS:'Incidents', EV_REQUESTS:'EVChargingRequests', EV_ACTIVITY:'EVChargingActivity', EV_POLICIES:'EVChargingPolicies', SPONSOR_DELEGATIONS:'SponsorDelegations', SPONSOR_REMINDERS:'SponsorReviewReminders' },
  VISIT_HEADERS: ['VisitID','ConfirmationNumber','CreatedAt','Status','FirstName','MiddleName','LastName','FullName','Email','Phone','Company','JobTitle','Relationship','Street','City','State','PostalCode','Country','EmergencyName','EmergencyPhone','SponsorID','SponsorSource','SponsorName','SponsorEmail','Department','SecondaryContact','Reason','Project','VisitorType','StartDate','ArrivalTime','EndDate','DepartureTime','AccessScope','EscortRequired','LineTour','SpecialItems','Driving','VehicleMake','VehicleModel','VehicleYear','VehicleColor','LicensePlate','PlateState','PhotoFileId','PhotoFileName','PhotoUrl','AgreementVersion','AcknowledgementName','AcknowledgementDate','AgreementTimestamp','AgreementCompletionCount','AgreementCompletionStatus','SessionID','ClientLanguage','ClientTimeZone','UserAgent','ClientTimestamp','Referrer','AgreeSecurity','AgreeBiometric','AgreePrivacy','AgreeSafety','AgreeConduct','AgreeTraining','AgreeRestricted','CheckInTime','CheckOutTime','BadgeUID','CheckInOfficer','CheckOutOfficer','SponsorNotified','IDRetained','IDReturned','ActualDurationMinutes','LastUpdatedAt','SponsorNotificationStatus','SponsorNotifiedAt','SponsorNotificationEmail','SponsorNotificationError','VisitorIntakeTokenHash','VisitorIntakeExpiresAt','VisitorIntakeStatus','VisitorIntakeSentAt','VisitorIntakeCompletedAt','VisitorIntakeCompletionNotificationStatus','VisitorIntakeCompletionNotificationAt','VisitorIntakeCompletionNotificationError'],
  ACTIVITY_HEADERS: ['ActivityID','VisitID','EventType','EventTime','PerformedBy','BadgeUID','Details'],
  BADGE_HEADERS: ['BadgeUID','BadgeNumber','Status','CurrentVisitID','IssuedAt','ReturnedAt','Notes'],
  AGREEMENT_HEADERS: ['AgreementID','Title','Version','EffectiveDate','ContentHash','Active','LastUpdatedAt'],
  ACK_HEADERS: ['AcknowledgementID','VisitID','ConfirmationNumber','VisitorName','VisitorEmail','AgreementID','AgreementTitle','AgreementVersion','DatePresented','TimePresented','PresentedTimestamp','DateAccepted','TimeAccepted','AcceptedTimestamp','VisitorEnteredAcceptanceDate','TypedElectronicSignature','CheckboxAcknowledged','SessionID','ClientIP','UserAgent','ClientLanguage','ClientTimeZone','ClientTimestamp','Referrer','AgreementContentHash','CompletionStatus'],
  CONFIG_HEADERS: ['Key','Value'],
  SPONSOR_HEADERS: ['SponsorID','SponsorName','SponsorEmail','Department','Active','SearchKeywords','LastUpdatedAt'],
  USER_HEADERS: ['UserID','EmployeeID','FullName','Email','Department','Company','BadgeUID','Username','PINHash','Role','ApprovalScope','Active','CreatedAt','LastLoginAt','FailedLoginCount','Notes','UserPhotoFileId','UserPhotoFileName','UserPhotoUrl'],
  FRONTDESK_HEADERS: ['EmployeeID','FullName','Email','Department','Company','BadgeUID','Shift','Location','Active','LastUpdatedAt'],
  SECURITY_HEADERS: ['EmployeeID','FullName','Email','Department','Company','BadgeUID','SecurityLevel','Active','LastUpdatedAt'],
  SESSION_HEADERS: ['SessionToken','UserID','Username','Role','CreatedAt','ExpiresAt','LastSeenAt','UserAgent'],
  AUDIT_HEADERS: ['AuditID','Timestamp','UserID','Username','Role','Action','VisitID','ConfirmationNumber','Result','Details'],
  HANDOFF_HEADERS: ['HandoffID','CreatedAt','CreatedByUserID','CreatedBy','Role','ShiftLabel','Notes','VisitorsOnsite','OverdueVisitors','BadgesOut','BadgeExceptions','Status','WorkflowStatus','AcknowledgedAt','AcknowledgedByUserID','AcknowledgedBy','AssignedTo','EscalationLevel','EscalationNotes','ResolutionNotes','ResolvedAt','ResolvedByUserID','ResolvedBy','LastUpdatedAt','SnapshotJSON'],
  NOTIFICATION_HEADERS: ['NotificationID','CreatedAt','CreatedByUserID','CreatedBy','Type','Severity','Title','Message','EffectiveAt','ExpiresAt','RelatedVisitID','RelatedBadgeUID','RelatedHandoffID','PhotoFileId','PhotoFileName','PhotoUrl','TargetRoles','RequireAcknowledgement','Status','AcknowledgedAt','AcknowledgedByUserID','AcknowledgedBy','LastUpdatedAt','DeduplicationKey'],
  NOTIFICATION_ACK_HEADERS: ['AcknowledgementID','NotificationID','UserID','Username','FullName','Role','AcknowledgedAt','UserAgent'],
  INCIDENT_HEADERS: ['IncidentID','CreatedAt','ReportedByUserID','ReportedBy','Role','Category','Severity','Location','Description','RelatedVisitID','RelatedBadgeUID','PhotoFileId','PhotoFileName','PhotoUrl','Status','AssignedTo','ResolutionNotes','ResolvedAt','ResolvedByUserID','ResolvedBy','LastUpdatedAt'],
  EV_REQUEST_HEADERS: ['RequestID','ConfirmationNumber','ClientSubmissionID','CreatedAt','Status','FirstName','LastName','FullName','CDSID','CellPhone','Email','Department','ManagerName','ManagerCDSID','ManagerEmail','ManagerDirectorySource','VehicleMake','VehicleModel','LicensePlate','PlateState','PolicyVersion','PolicyContentHash','PolicyAcknowledged','PolicyAcknowledgedAt','ManagerReviewTokenHash','ManagerReviewExpiresAt','ManagerDecision','ManagerDecisionAt','ManagerDecisionBy','ManagerDecisionCDSID','ManagerComments','EmployeeNotificationSent','ManagerNotificationSent','DecisionNotificationSent','ClientLanguage','ClientTimeZone','UserAgent','ClientTimestamp','Referrer','LastUpdatedAt','DecisionSource','OnboardingBadgeUID','OnboardingLookupStatus','FacilitiesNotificationSent','FacilitiesNotificationStatus','FacilitiesNotificationRecipients','FacilitiesNotificationAt','FacilitiesNotificationError'],
  EV_ACTIVITY_HEADERS: ['ActivityID','RequestID','ConfirmationNumber','EventType','EventTime','PerformedBy','PerformedByCDSID','PerformedByEmail','Details'],
  EV_POLICY_HEADERS: ['PolicyID','Title','Version','EffectiveDate','SitePolicy','StateAndUseTerms','Active','ContentHash','LastUpdatedAt'],
  SPONSOR_DELEGATION_HEADERS: ['DelegationID','CreatedAt','SponsorUserID','SponsorEmployeeID','SponsorUsername','SponsorName','SponsorEmail','DelegateUserID','DelegateEmployeeID','DelegateUsername','DelegateName','DelegateEmail','StartAt','EndAt','Status','Reason','CreatedByUserID','CreatedBy','CancelledAt','CancelledByUserID','CancelledBy','LastUpdatedAt'],
  SPONSOR_REMINDER_HEADERS: ['ReminderID','VisitID','ConfirmationNumber','ReminderType','CreatedAt','RequestAgeHours','SponsorEmail','DelegateEmails','Recipients','DeliveryStatus','DeliveryError','InitiatedByUserID','InitiatedBy','LastUpdatedAt'],

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
    } else if (action === 'getEVChargingPolicy') {
      result = getEVChargingPolicy_();
    } else if (action === 'getEVManagerReview') {
      result = getEVManagerReview_((e.parameter && e.parameter.token) || '');
    } else if (action === 'getVisitorInvitation') {
      result = getVisitorInvitation_((e.parameter && e.parameter.token) || '');
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
    req.payload=normalizeRequestPayload_(req.payload||{});
    let result;
    if(action==='createVisit') result=createVisit_(req.payload||{});
    else if(action==='completeSponsoredVisitIntake') result=completeSponsoredVisitIntake_(req.payload||{});
    else if(action==='createEVChargingRequest') result=createEVChargingRequest_(req.payload||{});
    else if(action==='submitEVManagerDecision') result=submitEVManagerDecision_(req.payload||{});
    else if(action==='listSponsors') result=listSponsors_(req.payload||{});
    else if(action==='login'||action==='pinLogin') result=loginUser_(req.payload||{}, e);
    else if(action==='badgeLogin') result=badgeLoginUser_(req.payload||{}, e);
    else {
      const session=requireSession_(req.token||'');
      if(action==='logout') result=logoutUser_(session,req.token||'');
      else if(action==='whoAmI') result={ok:true,user:publicSessionUser_(session),permissions:permissionsForRole_(session.Role)};
      else if(action==='listVisits') result=listVisitsForSession_(req.payload||{},session);
      else if(action==='listSponsorDashboard') { requirePermission_(session,'sponsorPortal'); result=listSponsorDashboard_(req.payload||{},session); }
      else if(action==='createSponsoredVisit') { requirePermission_(session,'sponsorPortal'); result=createSponsoredVisitAuthorized_(req.payload||{},session); }
      else if(action==='sendVisitorIntakeInvitation') { requirePermission_(session,'sponsorPortal'); result=sendVisitorIntakeInvitationAuthorized_(req.payload||{},session); }
      else if(action==='updateSponsoredVisit') { requirePermission_(session,'sponsorPortal'); result=updateSponsoredVisitAuthorized_(req.payload||{},session); }
      else if(action==='listSponsorDirectory') { requirePermission_(session,'sponsorPortal'); result=listSponsorDirectory_(req.payload||{},session); }
      else if(action==='listSponsorDelegations') { requirePermission_(session,'sponsorPortal'); result=listSponsorDelegations_(req.payload||{},session); }
      else if(action==='saveSponsorDelegation') result=saveSponsorDelegationAuthorized_(req.payload||{},session);
      else if(action==='cancelSponsorDelegation') result=cancelSponsorDelegationAuthorized_(req.payload||{},session);
      else if(action==='listActiveOperations') { requirePermission_(session,'viewVisits'); result=listActiveOperations_(req.payload||{},session); }
      else if(action==='listShiftHandoffs') { requirePermission_(session,'checkOut'); result=listShiftHandoffs_(req.payload||{},session); }
      else if(action==='createShiftHandoff') { requirePermission_(session,'checkOut'); result=createShiftHandoff_(req.payload||{},session); }
      else if(action==='acknowledgeShiftHandoff') { requirePermission_(session,'checkOut'); result=acknowledgeShiftHandoff_(req.payload||{},session); }
      else if(action==='resolveShiftHandoff') { requirePermission_(session,'checkOut'); result=resolveShiftHandoff_(req.payload||{},session); }
      else if(action==='escalateShiftHandoff') { requirePermission_(session,'approve'); result=escalateShiftHandoff_(req.payload||{},session); }
      else if(action==='getVisitPhoto') { requirePermission_(session,'viewPhoto'); result=getVisitPhotoAuthorized_(req.payload||{},session); }
      else if(action==='getUserPhoto') result=getUserPhotoAuthorized_(req.payload||{},session);
      else if(action==='listVisitActivity') { requirePermission_(session,'viewVisits'); result=listVisitActivityAuthorized_(req.payload||{},session); }
      else if(action==='checkInVisit') { requirePermission_(session,'checkIn'); result=checkInVisitAuthorized_(req.payload||{},session); }
      else if(action==='manualVisitorCheckIn') { requirePermission_(session,'manualVisitIntake'); result=manualVisitorCheckInAuthorized_(req.payload||{},session); }
      else if(action==='checkOutVisit') { requirePermission_(session,'checkOut'); result=checkOutVisitAuthorized_(req.payload||{},session); }
      else if(action==='updateVisitStatus') result=updateVisitStatusAuthorized_(req.payload||{},session);
      else if(action==='listUsers') { requirePermission_(session,'manageUsers'); result=listVistaUsers_(req.payload||{},session); }
      else if(action==='saveUser') { requirePermission_(session,'manageUsers'); result=saveVistaUser_(req.payload||{},session); }
      else if(action==='setUserActive') { requirePermission_(session,'manageUsers'); result=setVistaUserActive_(req.payload||{},session); }
      else if(action==='resetUserPin') { requirePermission_(session,'manageUsers'); result=resetVistaUserPin_(req.payload||{},session); }
      else if(action==='unlockUser') { requirePermission_(session,'manageUsers'); result=unlockVistaUserAccountAuthorized_(req.payload||{},session); }
      else if(action==='deleteUser') { requirePermission_(session,'manageUsers'); result=deleteVistaUser_(req.payload||{},session); }
      else if(action==='listBadges') { requirePermission_(session,'viewBadges'); result=listVistaBadges_(req.payload||{},session); }
      else if(action==='saveBadge') { requirePermission_(session,'manageBadges'); result=saveVistaBadge_(req.payload||{},session); }
      else if(action==='setBadgeStatus') { requirePermission_(session,'manageBadges'); result=setVistaBadgeStatus_(req.payload||{},session); }
      else if(action==='listAudit') { requirePermission_(session,'viewAudit'); result=listVistaAudit_(req.payload||{},session); }
      else if(action==='getOperationalAnalytics') { requirePermission_(session,'viewAnalytics'); result=getOperationalAnalytics_(req.payload||{},session); }
      else if(action==='generateOperationalReport') { requirePermission_(session,'viewAnalytics'); result=generateOperationalReport_(req.payload||{},session); }
      else if(action==='recordReportExport') { requirePermission_(session,'viewAnalytics'); result=recordReportExport_(req.payload||{},session); }
      else if(action==='listEVChargingRequests') { requirePermission_(session,'manageConfig'); result=listEVChargingRequests_(req.payload||{},session); }
      else if(action==='submitEVAdminDecision') { requirePermission_(session,'manageConfig'); result=submitEVAdminDecision_(req.payload||{},session); }
      else if(action==='listSponsorGovernance') { requirePermission_(session,'manageConfig'); result=listSponsorGovernance_(req.payload||{},session); }
      else if(action==='sendSponsorReviewReminder') { requirePermission_(session,'manageConfig'); result=sendSponsorReviewReminderAuthorized_(req.payload||{},session); }
      else if(action==='runSponsorReminderCycle') { requirePermission_(session,'manageConfig'); result=runSponsorReminderCycleAuthorized_(req.payload||{},session); }
      else if(action==='listOperationalNotifications') { requirePermission_(session,'viewVisits'); result=listOperationalNotifications_(req.payload||{},session); }
      else if(action==='acknowledgeNotification') { requirePermission_(session,'viewVisits'); result=acknowledgeOperationalNotification_(req.payload||{},session); }
      else if(action==='listAdminNotifications') { requirePermission_(session,'manageConfig'); result=listAdminNotifications_(req.payload||{},session); }
      else if(action==='createBroadcastNotification') { requirePermission_(session,'manageConfig'); result=createBroadcastNotification_(req.payload||{},session); }
      else if(action==='archiveBroadcastNotification') { requirePermission_(session,'manageConfig'); result=archiveBroadcastNotification_(req.payload||{},session); }
      else if(action==='getNotificationPhoto') { requirePermission_(session,'viewVisits'); result=getNotificationPhoto_(req.payload||{},session); }
      else if(action==='listIncidents') { requirePermission_(session,'reportIncident'); result=listIncidents_(req.payload||{},session); }
      else if(action==='createIncident') { requirePermission_(session,'reportIncident'); result=createIncident_(req.payload||{},session); }
      else if(action==='resolveIncident') { requirePermission_(session,'manageIncidents'); result=resolveIncident_(req.payload||{},session); }
      else if(action==='getIncidentPhoto') { requirePermission_(session,'reportIncident'); result=getIncidentPhoto_(req.payload||{},session); }
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


function normalizeRequestPayload_(payload){
  const p=payload&&typeof payload==='object'?payload:{};
  if(!p.visitId)p.visitId=p.VisitID||p.visitID||p.visitid||p.id||'';
  if(!p.badgeUid)p.badgeUid=p.BadgeUID||p.badgeUID||p.badgeuid||'';
  if(!p.officerName)p.officerName=p.OfficerName||p.officer||'';
  if(!p.status)p.status=p.Status||'';
  return p;
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
  ensureSheet_(ss, FE.SHEETS.HANDOFFS, FE.HANDOFF_HEADERS);
  ensureSheet_(ss, FE.SHEETS.NOTIFICATIONS, FE.NOTIFICATION_HEADERS);
  ensureSheet_(ss, FE.SHEETS.NOTIFICATION_ACKS, FE.NOTIFICATION_ACK_HEADERS);
  ensureSheet_(ss, FE.SHEETS.INCIDENTS, FE.INCIDENT_HEADERS);
  ensureSheet_(ss, FE.SHEETS.EV_REQUESTS, FE.EV_REQUEST_HEADERS);
  ensureSheet_(ss, FE.SHEETS.EV_ACTIVITY, FE.EV_ACTIVITY_HEADERS);
  ensureSheet_(ss, FE.SHEETS.EV_POLICIES, FE.EV_POLICY_HEADERS);
  ensureSheet_(ss, FE.SHEETS.SPONSOR_DELEGATIONS, FE.SPONSOR_DELEGATION_HEADERS);
  ensureSheet_(ss, FE.SHEETS.SPONSOR_REMINDERS, FE.SPONSOR_REMINDER_HEADERS);
  const config = ensureSheet_(ss, FE.SHEETS.CONFIG, FE.CONFIG_HEADERS);
  const defaults = {
    SECURITY_PIN:'1937', PHOTO_FOLDER_ID:'', USER_PHOTO_FOLDER_ID:'', INCIDENT_PHOTO_FOLDER_ID:'', SITE_TIMEZONE:'America/New_York', NOTIFICATION_EMAIL:'',
    SECURITY_CONSOLE_URL:'https://kyblueoval.github.io/Ford-Energy-VISTA/security-console/',
    SPONSOR_PORTAL_URL:'https://kyblueoval.github.io/Ford-Energy-VISTA/sponsor-portal/',
    SPONSOR_REMINDERS_ENABLED:'YES',
    SPONSOR_REMINDER_HOURS:'24',
    SPONSOR_ESCALATION_HOURS:'48',
    SPONSOR_REMINDER_COOLDOWN_HOURS:'20',
    SPONSOR_ESCALATION_EMAILS:'',
    SPONSOR_DELEGATION_MAX_DAYS:'90',
    PUBLIC_REGISTRATION_URL:'https://kyblueoval.github.io/Ford-Energy-VISTA/public-registration/',
    VISITOR_INTAKE_INVITATION_DAYS:'14',
    EV_CHARGING_REQUEST_URL:'https://kyblueoval.github.io/Ford-Energy-VISTA/ev-charging-request/',
    EV_MANAGER_REVIEW_DAYS:'14',
    EV_NOTIFICATION_EMAIL:'',
    EV_REQUIRE_FORD_EMAILS:'YES',
    EV_FACILITIES_EMAIL_ENABLED:'NO',
    EV_FACILITIES_EMAILS:'',
    EV_ONBOARDING_SPREADSHEET_ID:'1QSJN0Sx5okbIgT47R2zoze518Lu994ypyTHocevzSjI',
    EV_ONBOARDING_SHEET_NAME:'Onboarding_Raw_Data',
    SPONSOR_ARRIVAL_EMAILS:'YES',
    CHECK_IN_LOCATION:'Main Security Front Desk',
    VGS_NAVIGATION_URL:'', TRAINING_VIDEO_URL:'', AGREEMENT_VERSION:'2026.2',
    ARRIVAL_INSTRUCTIONS:'Proceed to the Main Security Building and park in Ford Energy / Visitor Parking.',
    PARKING_INSTRUCTIONS:'Use designated Ford Energy / Visitor Parking and follow posted VGS or site signage.',
    AUTH_SESSION_HOURS:'8', AUTH_SALT:'FORD-ENERGY-VISTA-CHANGE-ME'
  };
  const existing = config.getDataRange().getValues().slice(1).reduce((o,r)=>(o[String(r[0])]=r[1],o),{});
  Object.keys(defaults).forEach(k=>{ if (existing[k] === undefined) config.appendRow([k,defaults[k]]); });
  seedAgreements_();
  seedEVChargingPolicy_();
  seedInitialAdmin_();
  [FE.SHEETS.VISITS,FE.SHEETS.ACTIVITY,FE.SHEETS.BADGES,FE.SHEETS.AGREEMENTS,FE.SHEETS.ACKS,FE.SHEETS.SPONSORS,FE.SHEETS.USERS,FE.SHEETS.FRONTDESK,FE.SHEETS.SECURITY,FE.SHEETS.SESSIONS,FE.SHEETS.AUDIT,FE.SHEETS.HANDOFFS,FE.SHEETS.NOTIFICATIONS,FE.SHEETS.NOTIFICATION_ACKS,FE.SHEETS.INCIDENTS,FE.SHEETS.EV_REQUESTS,FE.SHEETS.EV_ACTIVITY,FE.SHEETS.EV_POLICIES,FE.SHEETS.SPONSOR_DELEGATIONS,FE.SHEETS.SPONSOR_REMINDERS].forEach(n=>ss.getSheetByName(n).setFrozenRows(1));
  return 'VISTA 2.5.4 setup complete. Secure visitor intake invitations, sponsor completion notices, administrator oversight, and existing workflows are ready.';
}

function seedAgreements_(){
  const cfg=config_(), version=cfg.AGREEMENT_VERSION||'2026.2', sheet=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.AGREEMENTS);
  const rows=readObjects_(FE.SHEETS.AGREEMENTS);
  FE.AGREEMENT_DEFINITIONS.forEach(d=>{
    const hash=sha256_(`${d.id}|${d.title}|${version}|${d.body}`), existing=rows.find(r=>String(r.AgreementID)===d.id&&String(r.Version)===version);
    if(!existing) sheet.appendRow([d.id,d.title,version,new Date(),hash,'Yes',new Date()]);
  });
}

function seedEVChargingPolicy_(){
  const sheet=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.EV_POLICIES);
  if(readObjects_(FE.SHEETS.EV_POLICIES).length)return;
  const version='2026.1';
  const sitePolicy=[
    'Charging access is limited to approved Ford Energy and Ford Motor Company employees and the approved vehicle listed on the request.',
    'Use only designated employee EV charging spaces and compatible charging equipment. Do not use unauthorized adapters, extension cords, damaged cables, or equipment.',
    'Move the vehicle when charging is complete or when directed so charging capacity remains available to other approved employees.',
    'Keep charging areas, access aisles, fire lanes, and accessible spaces clear. Follow posted time limits, parking controls, and Security instructions.',
    'Immediately report damaged equipment, unsafe conditions, collisions, fire, smoke, overheating, or suspected electrical hazards. Do not use equipment that appears damaged.',
    'Access may be suspended or revoked for unsafe use, policy violations, inaccurate request information, or failure to follow site direction.'
  ].join('\n');
  const stateTerms=[
    'Comply with applicable Kentucky law, site traffic rules, posted signs, parking restrictions, fire and life-safety requirements, and all lawful directions from Ford Energy Security or site management.',
    'Operate and park the vehicle safely. The request does not reserve a specific charger, guarantee charger availability, or authorize access to restricted site areas.',
    'The employee is responsible for ensuring the vehicle and charging connection are compatible and in safe operating condition and for promptly disconnecting when required.',
    'Charging records may be retained for safety, security, access control, operational planning, compliance, and audit purposes.'
  ].join('\n');
  const hash=sha256_([version,sitePolicy,stateTerms].join('|'));
  appendObjectRow_(sheet,{PolicyID:'EV-POLICY-'+version.replace(/[^A-Za-z0-9]/g,''),Title:'Ford Energy BlueOval Site Charging Policy and Terms of Use',Version:version,EffectiveDate:new Date(),SitePolicy:sitePolicy,StateAndUseTerms:stateTerms,Active:'Yes',ContentHash:hash,LastUpdatedAt:new Date()},FE.EV_POLICY_HEADERS);
}

function activeEVChargingPolicy_(){
  const rows=readObjects_(FE.SHEETS.EV_POLICIES).filter(r=>truthyActive_(r.Active));
  if(!rows.length)throw new Error('The EV charging policy is not configured. Run setupVista or activate an EVChargingPolicies row.');
  return rows[rows.length-1];
}

function evPolicyContentHash_(r){return sha256_([String(r.Version||''),String(r.SitePolicy||''),String(r.StateAndUseTerms||'')].join('|'))}
function getEVChargingPolicy_(){
  const r=activeEVChargingPolicy_();
  return{ok:true,policy:{policyId:String(r.PolicyID||''),title:String(r.Title||''),version:String(r.Version||''),effectiveDate:dateOnly_(r.EffectiveDate),sitePolicy:String(r.SitePolicy||''),stateAndUseTerms:String(r.StateAndUseTerms||''),contentHash:evPolicyContentHash_(r)}};
}

function fordEmployeeEmail_(value){return/^[^@\s]+@(?:[A-Za-z0-9-]+\.)*ford\.com$/i.test(String(value||'').trim())}
function validEmailAddress_(value){return/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(value||'').trim())}
function validCDSID_(value){return/^[A-Za-z0-9._-]{3,32}$/.test(String(value||'').trim())}
function normalizeCDSID_(value){return String(value||'').trim().toLowerCase()}
function normalizePlate_(value){return String(value||'').toUpperCase().replace(/\s+/g,' ').trim()}

function resolveEVManager_(p){
  const cdsid=normalizeCDSID_(p.managerCDSID),email=String(p.managerEmail||'').trim().toLowerCase();
  const user=readObjects_(FE.SHEETS.USERS).find(u=>truthyActive_(u.Active)&&[u.EmployeeID,u.Username].some(v=>normalizeCDSID_(v)===cdsid));
  if(user&&String(user.Email||'').trim()){
    const directoryEmail=String(user.Email).trim().toLowerCase();
    if(email&&email!==directoryEmail)throw new Error('The manager email does not match the active VISTA user directory record for that CDSID.');
    return{name:String(user.FullName||p.managerName||''),email:directoryEmail,source:'VISTA Users'};
  }
  const sponsor=readObjects_(FE.SHEETS.SPONSORS).find(s=>truthyActive_(s.Active)&&(normalizeCDSID_(s.SponsorID)===cdsid||String(s.SponsorEmail||'').trim().toLowerCase()===email));
  if(sponsor&&String(sponsor.SponsorEmail||'').trim())return{name:String(sponsor.SponsorName||p.managerName||''),email:String(sponsor.SponsorEmail).trim().toLowerCase(),source:'VISTA Sponsors'};
  return{name:String(p.managerName||'').trim(),email:email,source:'Request Form'};
}

function logEVActivity_(requestId,confirmation,eventType,by,cdsid,email,details){
  appendObjectRow_(SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.EV_ACTIVITY),{ActivityID:'EVA-'+Utilities.getUuid().slice(0,12).toUpperCase(),RequestID:requestId,ConfirmationNumber:confirmation,EventType:eventType,EventTime:new Date(),PerformedBy:by||'',PerformedByCDSID:cdsid||'',PerformedByEmail:email||'',Details:details||''},FE.EV_ACTIVITY_HEADERS);
}

function findEVRequestById_(requestId){
  const sheet=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.EV_REQUESTS),data=sheet.getDataRange().getValues(),headers=data[0],idx=headers.indexOf('RequestID');
  for(let i=1;i<data.length;i++)if(String(data[i][idx])===String(requestId))return{sheet:sheet,row:i+1,obj:headers.reduce((o,k,j)=>(o[k]=data[i][j],o),{})};
  throw new Error('EV charging access request was not found.');
}

function findEVRequestByToken_(token){
  const hash=sha256_(String(token||'').trim());
  const row=readObjects_(FE.SHEETS.EV_REQUESTS).find(r=>String(r.ManagerReviewTokenHash||'')===hash);
  if(!row)throw new Error('This manager review link is invalid.');
  return findEVRequestById_(row.RequestID);
}

function publicEVRequest_(r){
  return{requestId:String(r.RequestID||''),confirmationNumber:String(r.ConfirmationNumber||''),createdAt:dateText_(r.CreatedAt),status:String(r.Status||''),fullName:String(r.FullName||''),cdsid:String(r.CDSID||''),department:String(r.Department||''),managerName:String(r.ManagerName||''),vehicleMake:String(r.VehicleMake||''),vehicleModel:String(r.VehicleModel||''),licensePlate:String(r.LicensePlate||''),plateState:String(r.PlateState||''),policyVersion:String(r.PolicyVersion||''),managerDecision:String(r.ManagerDecision||''),managerDecisionAt:dateText_(r.ManagerDecisionAt),managerDecisionBy:String(r.ManagerDecisionBy||''),managerComments:String(r.ManagerComments||'')};
}
function publicAdminEVRequest_(r){
  const item=publicEVRequest_(r);
  return Object.assign(item,{email:String(r.Email||''),cellPhone:String(r.CellPhone||''),managerCDSID:String(r.ManagerCDSID||''),managerEmail:String(r.ManagerEmail||''),managerDirectorySource:String(r.ManagerDirectorySource||''),policyAcknowledged:String(r.PolicyAcknowledged||''),policyAcknowledgedAt:dateText_(r.PolicyAcknowledgedAt),decisionSource:String(r.DecisionSource||''),onboardingBadgeUid:String(r.OnboardingBadgeUID||''),onboardingLookupStatus:String(r.OnboardingLookupStatus||''),facilitiesNotificationSent:truthy_(r.FacilitiesNotificationSent),facilitiesNotificationStatus:String(r.FacilitiesNotificationStatus||''),facilitiesNotificationRecipients:String(r.FacilitiesNotificationRecipients||''),facilitiesNotificationAt:dateText_(r.FacilitiesNotificationAt),facilitiesNotificationError:String(r.FacilitiesNotificationError||'')});
}
function listEVChargingRequests_(p){
  const query=String(p.query||'').trim().toLowerCase(),status=String(p.status||'').trim();
  let rows=readObjects_(FE.SHEETS.EV_REQUESTS);
  if(status)rows=rows.filter(r=>String(r.Status||'')===status);
  if(query)rows=rows.filter(r=>[r.FullName,r.CDSID,r.Email,r.ManagerName,r.ManagerEmail,r.ConfirmationNumber,r.LicensePlate,r.OnboardingBadgeUID].join(' ').toLowerCase().includes(query));
  rows.sort((a,b)=>new Date(b.CreatedAt||0)-new Date(a.CreatedAt||0));
  const all=readObjects_(FE.SHEETS.EV_REQUESTS),statuses=all.reduce((o,r)=>(o[String(r.Status||'Unknown')]=(o[String(r.Status||'Unknown')]||0)+1,o),{});
  return{ok:true,requests:rows.slice(0,300).map(publicAdminEVRequest_),summary:{total:all.length,pending:statuses['Pending Manager Approval']||0,approved:statuses.Approved||0,denied:statuses.Denied||0}};
}

function normalizePersonName_(value){
  let text=String(value||'').trim().toLowerCase();
  try{text=text.normalize('NFKD').replace(/[\u0300-\u036f]/g,'')}catch(e){}
  return text.replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
}
function lookupOnboardingBadge_(fullName){
  const cfg=config_(),spreadsheetId=String(cfg.EV_ONBOARDING_SPREADSHEET_ID||'').trim(),sheetName=String(cfg.EV_ONBOARDING_SHEET_NAME||'Onboarding_Raw_Data').trim();
  if(!spreadsheetId)return{status:'Not Configured',badgeUid:'',matches:0,error:'EV_ONBOARDING_SPREADSHEET_ID is blank.'};
  try{
    const sheet=SpreadsheetApp.openById(spreadsheetId).getSheetByName(sheetName);
    if(!sheet)return{status:'Sheet Not Found',badgeUid:'',matches:0,error:'Worksheet '+sheetName+' was not found.'};
    const lastRow=sheet.getLastRow();if(lastRow<2)return{status:'Not Found',badgeUid:'',matches:0,error:'The onboarding worksheet contains no employee rows.'};
    const names=sheet.getRange(2,4,lastRow-1,1).getDisplayValues(),badges=sheet.getRange(2,43,lastRow-1,1).getDisplayValues(),wanted=normalizePersonName_(fullName),wantedParts=wanted.split(' ').filter(Boolean),rows=[];
    for(let i=0;i<names.length;i++)rows.push({name:normalizePersonName_(names[i][0]),badge:String(badges[i][0]||'').trim()});
    let matches=rows.filter(x=>x.name===wanted).map(x=>x.badge),matchType='Exact Name';
    if(!matches.length&&wantedParts.length>=2){
      const first=wantedParts[0],last=wantedParts[wantedParts.length-1];
      matches=rows.filter(x=>{const parts=x.name.split(' ').filter(Boolean);return parts.length>=2&&parts[0]===first&&parts[parts.length-1]===last}).map(x=>x.badge);
      matchType='First and Last Name';
    }
    const unique=[...new Set(matches.filter(Boolean).map(x=>x.toUpperCase()))];
    if(!matches.length)return{status:'Not Found',badgeUid:'',matches:0,error:'No safe employee-name match was found in Onboarding_Raw_Data column D.'};
    if(unique.length===1)return{status:matchType==='Exact Name'?'Found':'Found · First/Last',badgeUid:unique[0],matches:matches.length,error:''};
    if(!unique.length)return{status:'Badge UID Missing',badgeUid:'',matches:matches.length,error:'Employee name matched, but Onboarding_Raw_Data column AQ is blank.'};
    return{status:'Ambiguous',badgeUid:'',matches:matches.length,error:'Multiple different Badge UIDs were found for this employee name.'};
  }catch(err){return{status:'Lookup Failed',badgeUid:'',matches:0,error:String(err&&err.message||err).replace(/\s+/g,' ').slice(0,500)}}
}
function facilitiesRecipients_(value){
  const emails=String(value||'').split(/[,;\n]+/).map(x=>x.trim().toLowerCase()).filter(Boolean);
  const unique=[...new Set(emails)];
  const invalid=unique.filter(x=>!validEmailAddress_(x));
  return{emails:unique.filter(x=>validEmailAddress_(x)),invalid:invalid};
}
function notifyEVFacilitiesApproval_(r,actor){
  const cfg=config_(),requested=['yes','true','1','on','enabled'].includes(String(cfg.EV_FACILITIES_EMAIL_ENABLED||'NO').trim().toLowerCase()),parsed=facilitiesRecipients_(cfg.EV_FACILITIES_EMAILS),lookup=lookupOnboardingBadge_(r.FullName);
  const result={requested:requested,sent:false,status:'Disabled',recipients:parsed.emails.join(', '),sentAt:'',error:'',badgeUid:lookup.badgeUid,lookupStatus:lookup.status,lookupError:lookup.error};
  if(!requested)return result;
  if(parsed.invalid.length){result.status='Invalid Recipients';result.error='Invalid Facilities email address: '+parsed.invalid.join(', ');return result;}
  if(!parsed.emails.length){result.status='No Recipients';result.error='EV_FACILITIES_EMAILS is blank.';return result;}
  const badgeDisplay=lookup.badgeUid?html_(lookup.badgeUid):'<strong style="color:#b54708">Manual verification required</strong>';
  const rows=[['Employee',html_(r.FullName)],['Employee CDSID',html_(r.CDSID)],['Badge UID',badgeDisplay],['Onboarding lookup',html_(lookup.status)],['Department',html_(r.Department)],['Vehicle',html_([r.VehicleMake,r.VehicleModel].filter(Boolean).join(' '))],['License plate',html_([r.LicensePlate,r.PlateState].filter(Boolean).join(' · '))],['Approved by',html_(actor.FullName||actor.Username||r.ManagerDecisionBy)],['Confirmation',`<strong style="color:#003478">${html_(r.ConfirmationNumber)}</strong>`]];
  const details=`<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border:1px solid #dce6f0;border-radius:10px;border-collapse:separate;overflow:hidden">${rows.map((x,i)=>`<tr><td width="34%" valign="top" style="padding:11px 13px;background:${i%2===0?'#f6f9fc':'#fff'};border-bottom:${i===rows.length-1?'0':'1px solid #e2eaf2'};font-size:12px;text-transform:uppercase;font-weight:bold;color:#667587">${x[0]}</td><td style="padding:11px 13px;background:${i%2===0?'#f6f9fc':'#fff'};border-bottom:${i===rows.length-1?'0':'1px solid #e2eaf2'}">${x[1]}</td></tr>`).join('')}</table>`;
  const body=`<p style="margin:0 0 18px">An employee EV charging access request has been approved and is ready for Facilities processing.</p>${details}${lookup.error?`<p style="margin:18px 0 0;padding:13px 15px;background:#fff4e5;border-left:5px solid #f79009"><strong>Onboarding lookup note:</strong> ${html_(lookup.error)}</p>`:''}`;
  const textBody=`Approved EV charging access request\n\nEmployee: ${r.FullName}\nCDSID: ${r.CDSID}\nBadge UID: ${lookup.badgeUid||'Manual verification required'}\nOnboarding lookup: ${lookup.status}\nVehicle: ${[r.VehicleMake,r.VehicleModel].filter(Boolean).join(' ')}\nLicense plate: ${[r.LicensePlate,r.PlateState].filter(Boolean).join(' · ')}\nConfirmation: ${r.ConfirmationNumber}`;
  try{
    MailApp.sendEmail({to:parsed.emails.join(','),subject:`EV charging approval: ${r.FullName} (${r.ConfirmationNumber})`,body:textBody,htmlBody:brandedEmail_({title:'EV Charging Access Approved',kicker:'FORD ENERGY · FACILITIES NOTIFICATION',preheader:`Approved EV charging request for ${r.FullName}`,body:body,footerNote:'This approval notification and onboarding lookup result are retained in the VISTA audit record.'})});
    result.sent=true;result.status=lookup.badgeUid?'Sent':'Sent · Manual Verification Required';result.sentAt=new Date();return result;
  }catch(err){result.status='Failed';result.error=String(err&&err.message||err).replace(/\s+/g,' ').slice(0,500);return result}
}
function recordEVFacilitiesResult_(r,result,actor){
  const found=findEVRequestById_(r.RequestID),updates={OnboardingBadgeUID:result.badgeUid||'',OnboardingLookupStatus:result.lookupStatus||'',FacilitiesNotificationSent:result.sent?'Yes':'No',FacilitiesNotificationStatus:result.status||'',FacilitiesNotificationRecipients:result.recipients||'',FacilitiesNotificationAt:result.sent?result.sentAt:'',FacilitiesNotificationError:[result.error,result.lookupError].filter(Boolean).join(' · ').slice(0,500),LastUpdatedAt:new Date()};
  updateObjectRow_(FE.SHEETS.EV_REQUESTS,found.row,updates);
  const event=result.sent?'FACILITIES_APPROVAL_EMAIL_SENT':result.requested?'FACILITIES_APPROVAL_EMAIL_FAILED':'FACILITIES_APPROVAL_EMAIL_SKIPPED',details=[result.status,result.recipients,result.lookupStatus,result.badgeUid,result.error,result.lookupError].filter(Boolean).join(' · ').slice(0,1000);
  logEVActivity_(r.RequestID,r.ConfirmationNumber,event,actor.FullName||actor.Username||'',actor.Username||'',actor.Email||'',details);
  audit_(actor,event,r.RequestID,r.ConfirmationNumber,result.sent?'Success':result.requested?'Warning':'Skipped',details);
}

function createEVChargingRequest_(p){
  p=p||{};
  validateRequired_(p,['firstName','lastName','cdsid','cellPhone','email','department','managerName','managerCDSID','managerEmail','vehicleMake','vehicleModel','licensePlate','plateState','policyVersion','policyContentHash']);
  if(!validCDSID_(p.cdsid)||!validCDSID_(p.managerCDSID))throw new Error('Enter valid employee and manager CDSIDs.');
  const requireFordEmails=truthyActive_(config_().EV_REQUIRE_FORD_EMAILS);
  if(!validEmailAddress_(p.email)||!validEmailAddress_(p.managerEmail))throw new Error('Enter valid employee and manager email addresses.');
  if(requireFordEmails&&(!fordEmployeeEmail_(p.email)||!fordEmployeeEmail_(p.managerEmail)))throw new Error('Employee and manager email addresses must be Ford email addresses. For controlled testing, an administrator may set EV_REQUIRE_FORD_EMAILS to NO in Config.');
  if(String(p.cellPhone||'').replace(/\D/g,'').length<7)throw new Error('Enter a valid employee cell phone number.');
  if(normalizePlate_(p.licensePlate).length<2||String(p.plateState||'').trim().length!==2)throw new Error('Enter a valid vehicle license plate number and state.');
  if(!truthy_(p.policyAcknowledged))throw new Error('The charging policy and terms of use must be acknowledged.');
  const policy=activeEVChargingPolicy_();
  const policyHash=evPolicyContentHash_(policy);
  if(String(p.policyVersion)!==String(policy.Version)||String(p.policyContentHash)!==policyHash)throw new Error('The charging policy changed while this request was open. Refresh and review the current policy.');
  const manager=resolveEVManager_(p),sheet=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.EV_REQUESTS);
  const clientSubmissionId=String(p.clientSubmissionId||'').trim();
  if(clientSubmissionId){const duplicate=readObjects_(FE.SHEETS.EV_REQUESTS).find(r=>String(r.ClientSubmissionID||'')===clientSubmissionId);if(duplicate)return{ok:true,requestId:String(duplicate.RequestID),confirmationNumber:String(duplicate.ConfirmationNumber),fullName:String(duplicate.FullName),status:String(duplicate.Status),duplicate:true,notifications:{employeeSent:truthy_(duplicate.EmployeeNotificationSent),managerSent:truthy_(duplicate.ManagerNotificationSent)}};}
  const now=new Date(),requestId='EVR-'+Utilities.formatDate(now,tz_(),'yyyyMMdd')+'-'+Utilities.getUuid().slice(0,8).toUpperCase(),confirmation='EV-'+Utilities.getUuid().replace(/-/g,'').slice(0,8).toUpperCase(),fullName=[p.firstName,p.lastName].map(x=>String(x||'').trim()).join(' '),rawToken=Utilities.getUuid().replace(/-/g,'')+Utilities.getUuid().replace(/-/g,''),cfg=config_(),reviewDays=Math.min(30,Math.max(1,Number(cfg.EV_MANAGER_REVIEW_DAYS||14))),expires=new Date(now.getTime()+reviewDays*86400000);
  const record={RequestID:requestId,ConfirmationNumber:confirmation,ClientSubmissionID:clientSubmissionId,CreatedAt:now,Status:'Pending Manager Approval',FirstName:String(p.firstName).trim(),LastName:String(p.lastName).trim(),FullName:fullName,CDSID:normalizeCDSID_(p.cdsid),CellPhone:String(p.cellPhone).trim(),Email:String(p.email).trim().toLowerCase(),Department:String(p.department).trim(),ManagerName:manager.name,ManagerCDSID:normalizeCDSID_(p.managerCDSID),ManagerEmail:manager.email,ManagerDirectorySource:manager.source,VehicleMake:String(p.vehicleMake).trim(),VehicleModel:String(p.vehicleModel).trim(),LicensePlate:normalizePlate_(p.licensePlate),PlateState:String(p.plateState).trim().toUpperCase(),PolicyVersion:String(policy.Version),PolicyContentHash:policyHash,PolicyAcknowledged:'Yes',PolicyAcknowledgedAt:now,ManagerReviewTokenHash:sha256_(rawToken),ManagerReviewExpiresAt:expires,ManagerDecision:'',ManagerDecisionAt:'',ManagerDecisionBy:'',ManagerDecisionCDSID:'',ManagerComments:'',EmployeeNotificationSent:'No',ManagerNotificationSent:'No',DecisionNotificationSent:'No',ClientLanguage:String(p.clientLanguage||''),ClientTimeZone:String(p.clientTimeZone||''),UserAgent:String(p.userAgent||''),ClientTimestamp:String(p.clientTimestamp||''),Referrer:String(p.referrer||''),LastUpdatedAt:now};
  const lock=LockService.getScriptLock();lock.waitLock(15000);try{if(clientSubmissionId){const duplicate=readObjects_(FE.SHEETS.EV_REQUESTS).find(r=>String(r.ClientSubmissionID||'')===clientSubmissionId);if(duplicate)return{ok:true,requestId:String(duplicate.RequestID),confirmationNumber:String(duplicate.ConfirmationNumber),fullName:String(duplicate.FullName),status:String(duplicate.Status),duplicate:true,notifications:{employeeSent:truthy_(duplicate.EmployeeNotificationSent),managerSent:truthy_(duplicate.ManagerNotificationSent)}};}appendObjectRow_(sheet,record,FE.EV_REQUEST_HEADERS);}finally{lock.releaseLock();}
  logEVActivity_(requestId,confirmation,'REQUEST_SUBMITTED',fullName,record.CDSID,record.Email,'Policy '+record.PolicyVersion+' acknowledged; manager source '+manager.source);
  audit_({UserID:'',Username:record.CDSID,Role:'EV Applicant'},'EV_CHARGING_REQUEST_SUBMITTED',requestId,confirmation,'Success',fullName+' · '+record.LicensePlate);
  const notifications=notifyEVChargingSubmission_(record,rawToken),found=findEVRequestById_(requestId);
  updateObjectRow_(FE.SHEETS.EV_REQUESTS,found.row,{EmployeeNotificationSent:notifications.employeeSent?'Yes':'No',ManagerNotificationSent:notifications.managerSent?'Yes':'No',LastUpdatedAt:new Date()});
  return{ok:true,requestId:requestId,confirmationNumber:confirmation,fullName:fullName,status:'Pending Manager Approval',policyVersion:record.PolicyVersion,notifications:notifications};
}

function getEVManagerReview_(token){
  const found=findEVRequestByToken_(token),r=found.obj,expires=parseDateSafe_(r.ManagerReviewExpiresAt),expired=Boolean(expires&&expires<new Date()&&String(r.Status)==='Pending Manager Approval');
  return{ok:true,request:publicEVRequest_(r),manager:{name:String(r.ManagerName||''),cdsidHint:String(r.ManagerCDSID||'').slice(0,2)+'••••'},expired:expired,reviewable:String(r.Status)==='Pending Manager Approval'&&!expired};
}

function submitEVManagerDecision_(p){
  validateRequired_(p,['token','managerCDSID','decision']);
  const decision=String(p.decision||''),managerCDSID=normalizeCDSID_(p.managerCDSID);
  if(!['Approved','Denied'].includes(decision))throw new Error('Select Approve or Deny.');
  if(decision==='Denied'&&!String(p.comments||'').trim())throw new Error('Enter a reason when denying an EV charging access request.');
  const lock=LockService.getScriptLock();lock.waitLock(15000);
  let found,r,now;
  try{
    found=findEVRequestByToken_(p.token);r=found.obj;now=new Date();
    if(String(r.Status)!=='Pending Manager Approval')return{ok:true,request:publicEVRequest_(r),alreadyDecided:true};
    const expires=parseDateSafe_(r.ManagerReviewExpiresAt);if(expires&&expires<now)throw new Error('This manager review link has expired. The employee must submit a new request.');
    if(managerCDSID!==normalizeCDSID_(r.ManagerCDSID))throw new Error('The manager CDSID does not match this request.');
    updateObjectRow_(FE.SHEETS.EV_REQUESTS,found.row,{Status:decision,ManagerDecision:decision,ManagerDecisionAt:now,ManagerDecisionBy:String(r.ManagerName||''),ManagerDecisionCDSID:managerCDSID,ManagerComments:String(p.comments||'').trim().slice(0,2000),DecisionSource:'Manager Email Review',LastUpdatedAt:now});
  }finally{lock.releaseLock();}
  r=Object.assign({},r,{Status:decision,ManagerDecision:decision,ManagerDecisionAt:now,ManagerDecisionBy:String(r.ManagerName||''),ManagerDecisionCDSID:managerCDSID,ManagerComments:String(p.comments||'').trim().slice(0,2000),DecisionSource:'Manager Email Review'});
  logEVActivity_(r.RequestID,r.ConfirmationNumber,'MANAGER_'+decision.toUpperCase(),r.ManagerName,managerCDSID,r.ManagerEmail,String(r.ManagerComments||''));
  const actor={UserID:'',Username:managerCDSID,Role:'EV Manager Approver',FullName:r.ManagerName,Email:r.ManagerEmail};
  audit_(actor,'EV_CHARGING_MANAGER_'+decision.toUpperCase(),r.RequestID,r.ConfirmationNumber,'Success',r.ManagerName+' · '+r.FullName);
  const notified=notifyEVChargingDecision_(r),updated=findEVRequestById_(r.RequestID);
  updateObjectRow_(FE.SHEETS.EV_REQUESTS,updated.row,{DecisionNotificationSent:notified.employeeSent?'Yes':'No',LastUpdatedAt:new Date()});
  let facilities={requested:false,sent:false,status:'Not Applicable'};
  if(decision==='Approved'){facilities=notifyEVFacilitiesApproval_(r,actor);try{recordEVFacilitiesResult_(r,facilities,actor)}catch(err){facilities.trackingError=String(err&&err.message||err)}}
  return{ok:true,request:publicEVRequest_(r),notifications:notified,facilities:facilities};
}

function submitEVAdminDecision_(p,session){
  validateRequired_(p,['requestId','decision']);
  const decision=String(p.decision||''),comments=String(p.comments||'').trim().slice(0,2000);
  if(!['Approved','Denied'].includes(decision))throw new Error('Select Approve or Deny.');
  if(decision==='Denied'&&!comments)throw new Error('Enter a reason when denying an EV charging access request.');
  const lock=LockService.getScriptLock();lock.waitLock(15000);
  let found,r,now;
  try{
    found=findEVRequestById_(p.requestId);r=found.obj;now=new Date();
    if(String(r.Status)!=='Pending Manager Approval')throw new Error('This EV charging request has already been decided. Current status: '+String(r.Status||'Unknown')+'.');
    updateObjectRow_(FE.SHEETS.EV_REQUESTS,found.row,{Status:decision,ManagerDecision:decision,ManagerDecisionAt:now,ManagerDecisionBy:String(session.FullName||session.Username||''),ManagerDecisionCDSID:String(session.Username||''),ManagerComments:comments,DecisionSource:'VISTA Administration',LastUpdatedAt:now});
  }finally{lock.releaseLock()}
  r=Object.assign({},r,{Status:decision,ManagerDecision:decision,ManagerDecisionAt:now,ManagerDecisionBy:String(session.FullName||session.Username||''),ManagerDecisionCDSID:String(session.Username||''),ManagerComments:comments,DecisionSource:'VISTA Administration'});
  logEVActivity_(r.RequestID,r.ConfirmationNumber,'ADMIN_'+decision.toUpperCase(),session.FullName||session.Username,session.Username,session.Email,comments);
  audit_(session,'EV_CHARGING_ADMIN_'+decision.toUpperCase(),r.RequestID,r.ConfirmationNumber,'Success',r.FullName+' · '+r.LicensePlate);
  const notified=notifyEVChargingDecision_(r),updated=findEVRequestById_(r.RequestID);
  updateObjectRow_(FE.SHEETS.EV_REQUESTS,updated.row,{DecisionNotificationSent:notified.employeeSent?'Yes':'No',LastUpdatedAt:new Date()});
  let facilities={requested:false,sent:false,status:'Not Applicable'};
  if(decision==='Approved'){facilities=notifyEVFacilitiesApproval_(r,session);try{recordEVFacilitiesResult_(r,facilities,session)}catch(err){facilities.trackingError=String(err&&err.message||err)}}
  return{ok:true,request:publicAdminEVRequest_(Object.assign({},r,{FacilitiesNotificationSent:facilities.sent?'Yes':'No',FacilitiesNotificationStatus:facilities.status,FacilitiesNotificationRecipients:facilities.recipients||'',FacilitiesNotificationAt:facilities.sent?facilities.sentAt:'',FacilitiesNotificationError:[facilities.error,facilities.lookupError].filter(Boolean).join(' · '),OnboardingBadgeUID:facilities.badgeUid||'',OnboardingLookupStatus:facilities.lookupStatus||''})),notifications:notified,facilities:facilities};
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
function clearAcknowledgementsForVisit_(visitId){const sheet=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.ACKS);if(!sheet||sheet.getLastRow()<2)return;const values=sheet.getDataRange().getValues(),headers=values[0],visitCol=headers.indexOf('VisitID');if(visitCol<0)return;for(let i=values.length-1;i>=1;i--)if(String(values[i][visitCol]||'')===String(visitId))sheet.deleteRow(i+1)}

function findVisitorInvitation_(token){
  const raw=String(token||'').trim();if(raw.length<40)throw new Error('This visitor intake link is invalid.');
  const hash=sha256_(raw),rows=readObjects_(FE.SHEETS.VISITS),record=rows.find(r=>String(r.VisitorIntakeTokenHash||'')===hash);
  if(!record)throw new Error('This visitor intake link is invalid or no longer available.');
  const expires=parseDateSafe_(record.VisitorIntakeExpiresAt);
  if(expires&&expires<new Date())throw new Error('This visitor intake link has expired. Contact your Ford Energy sponsor for assistance.');
  if(String(record.VisitorIntakeStatus||'Pending')==='Completed'||String(record.AgreementCompletionStatus||'')==='Completed')throw new Error('This visitor intake has already been completed.');
  if(['Denied','Cancelled','Checked Out'].includes(String(record.Status||'')))throw new Error('This visitor request is no longer eligible for intake completion.');
  return{row:rows.indexOf(record)+2,obj:record};
}
function getVisitorInvitation_(token){
  const r=findVisitorInvitation_(token).obj;
  return{ok:true,invitation:{confirmationNumber:String(r.ConfirmationNumber||''),firstName:String(r.FirstName||''),middleName:String(r.MiddleName||''),lastName:String(r.LastName||''),email:String(r.Email||''),phone:String(r.Phone||''),company:String(r.Company||''),jobTitle:String(r.JobTitle||''),relationship:String(r.Relationship||''),street:String(r.Street||''),city:String(r.City||''),state:String(r.State||''),postalCode:String(r.PostalCode||''),country:String(r.Country||'United States'),emergencyName:String(r.EmergencyName||''),emergencyPhone:String(r.EmergencyPhone||''),sponsorId:String(r.SponsorID||''),sponsorName:String(r.SponsorName||''),sponsorEmail:String(r.SponsorEmail||''),department:String(r.Department||''),secondaryContact:String(r.SecondaryContact||''),reason:String(r.Reason||''),project:String(r.Project||''),visitorType:String(r.VisitorType||''),startDate:dateOnly_(r.StartDate),arrivalTime:timeOnly_(r.ArrivalTime),endDate:dateOnly_(r.EndDate),departureTime:timeOnly_(r.DepartureTime),accessScope:String(r.AccessScope||''),escortRequired:String(r.EscortRequired||''),lineTour:String(r.LineTour||''),specialItems:String(r.SpecialItems||''),driving:String(r.Driving||'No'),vehicleMake:String(r.VehicleMake||''),vehicleModel:String(r.VehicleModel||''),vehicleYear:String(r.VehicleYear||''),vehicleColor:String(r.VehicleColor||''),licensePlate:String(r.LicensePlate||''),plateState:String(r.PlateState||''),expiresAt:dateText_(r.VisitorIntakeExpiresAt)}};
}
function notifySponsorVisitorIntakeCompleted_(r){
  const result={sent:false,status:'No Sponsor Email',recipient:String(r.SponsorEmail||''),sentAt:'',error:''};
  if(!validEmailAddress_(r.SponsorEmail))return result;
  const portal=config_().SPONSOR_PORTAL_URL||'https://kyblueoval.github.io/Ford-Energy-VISTA/sponsor-portal/',period=[r.StartDate,r.ArrivalTime].filter(Boolean).join(' ')+' through '+[r.EndDate,r.DepartureTime].filter(Boolean).join(' '),vehicle=r.Driving==='Yes'?[r.VehicleYear,r.VehicleMake,r.VehicleModel,r.VehicleColor,r.LicensePlate,r.PlateState].filter(Boolean).join(' '):'Not driving';
  const body=`<p style="margin:0 0 16px">Hello ${html_(r.SponsorName||'Sponsor')},</p><p style="margin:0 0 20px"><strong>${html_(r.FullName)}</strong> completed the required VISTA visitor intake for the request below.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 20px"><tr><td style="padding:14px 16px;background:#e7f5ee;border-left:5px solid #1f8f57;border-radius:7px;color:#17663f"><strong>Intake complete:</strong> Visitor photograph, profile information, vehicle details, safety briefing, and seven acknowledgements are recorded.</td></tr></table>${emailDetailsTable_(r,period,vehicle)}${emailButton_(portal,'Review Completed Visitor Request')}`;
  try{MailApp.sendEmail({to:r.SponsorEmail,subject:`Visitor intake completed: ${r.FullName} (${r.ConfirmationNumber})`,htmlBody:brandedEmail_({title:'Visitor Intake Completed',preheader:`${r.FullName} completed visitor intake ${r.ConfirmationNumber}`,body:body})});result.sent=true;result.status='Sent';result.sentAt=new Date()}catch(err){result.status='Failed';result.error=String(err.message||err)}return result;
}
function sendVisitorIntakeInvitationEmail_(r,token){
  const result={sent:false,status:'No Visitor Email',recipient:String(r.Email||''),sentAt:'',error:''};if(!validEmailAddress_(r.Email))return result;
  const cfg=config_(),url=(cfg.PUBLIC_REGISTRATION_URL||'https://kyblueoval.github.io/Ford-Energy-VISTA/public-registration/')+'?invitation='+encodeURIComponent(token),period=[r.StartDate,r.ArrivalTime].filter(Boolean).join(' ')+' through '+[r.EndDate,r.DepartureTime].filter(Boolean).join(' '),vehicle=r.Driving==='Yes'?[r.VehicleYear,r.VehicleMake,r.VehicleModel,r.VehicleColor,r.LicensePlate,r.PlateState].filter(Boolean).join(' '):'Not driving',body=`<p style="margin:0 0 16px">Hello ${html_(r.FullName)},</p><p style="margin:0 0 20px">${html_(r.SponsorName||'Your Ford Energy sponsor')} created a visitor request for you. Complete the required visitor intake before arriving at Ford Energy.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 20px"><tr><td style="padding:15px 17px;background:#fff4dc;border-left:5px solid #ff7a00;border-radius:8px"><strong style="color:#684300">Required:</strong> Add your visitor photograph and remaining profile or vehicle information, watch the safety briefing, and complete all seven acknowledgements.</td></tr></table>${emailDetailsTable_(r,period,vehicle)}${emailButton_(url,'Complete Required Visitor Intake')}<p style="margin:20px 0 0;color:#516477">This secure link replaces any earlier invitation for this request and can be used only until intake is completed.</p>`;
  try{MailApp.sendEmail({to:r.Email,subject:`Action required: Complete visitor intake ${r.ConfirmationNumber}`,htmlBody:brandedEmail_({title:'Complete Your Visitor Intake',preheader:`Complete required visitor intake for ${r.ConfirmationNumber}`,body:body})});result.sent=true;result.status='Sent';result.sentAt=new Date()}catch(err){result.status='Failed';result.error=String(err.message||err)}return result;
}
function sendVisitorIntakeInvitationAuthorized_(p,session){
  validateRequired_(p,['visitId']);const found=requireSponsorOwnedVisit_(p.visitId,session),r=found.obj;if(String(r.SponsorSource||'')!=='VISTA Sponsor Portal')throw new Error('Visitor intake invitations are available only for requests created through the Sponsor Portal.');if(String(r.AgreementCompletionStatus||'')==='Completed')throw new Error('This visitor has already completed the required intake.');if(['Denied','Cancelled','Checked In','Checked Out'].includes(String(r.Status||'')))throw new Error('This visitor request is not eligible for an intake invitation.');
  const now=new Date(),token=Utilities.getUuid().replace(/-/g,'')+Utilities.getUuid().replace(/-/g,''),days=Math.max(1,Number(config_().VISITOR_INTAKE_INVITATION_DAYS||14)),visitEnd=parseDateSafe_([dateOnly_(r.EndDate),timeOnly_(r.DepartureTime)||'23:59:00'].join('T')),expiry=new Date(Math.max(now.getTime()+days*86400000,visitEnd?visitEnd.getTime()+86400000:0));updateObjectRow_(FE.SHEETS.VISITS,found.row,{VisitorIntakeTokenHash:sha256_(token),VisitorIntakeExpiresAt:expiry,VisitorIntakeStatus:'Pending',VisitorIntakeSentAt:'',LastUpdatedAt:now});
  const notice=sendVisitorIntakeInvitationEmail_(r,token);if(notice.sent)updateObjectRow_(FE.SHEETS.VISITS,found.row,{VisitorIntakeSentAt:notice.sentAt,LastUpdatedAt:new Date()});const detail=[notice.status,notice.recipient,notice.error].filter(Boolean).join(' · ');logActivity_(r.VisitID,notice.sent?'VISITOR_INTAKE_INVITATION_SENT':'VISITOR_INTAKE_INVITATION_FAILED',session.FullName||session.Username,'',detail);audit_(session,'VISITOR_INTAKE_INVITATION',r.VisitID,r.ConfirmationNumber,notice.sent?'Success':'Warning',detail);return{ok:true,sent:notice.sent,status:notice.status,recipient:notice.recipient,error:notice.error,message:notice.sent?'Visitor intake invitation sent.':'Visitor intake invitation could not be delivered: '+notice.status};
}
function completeSponsoredVisitIntake_(p){
  p=p||{};validateRequired_(p,['invitationToken','firstName','lastName','email','phone','company','acknowledgementName','acknowledgementDate']);if(!validEmailAddress_(p.email))throw new Error('Enter a valid visitor email address.');
  const required=FE.AGREEMENT_DEFINITIONS.map(x=>x.id),submitted=Array.isArray(p.agreements)?p.agreements:[];required.forEach(id=>{const a=submitted.find(x=>String(x.agreementId)===id);if(!a||!truthy_(a.checkboxAcknowledged)||a.completionStatus!=='Completed')throw new Error('All agreements and training sections must be completed. Missing: '+id)});if(!String(p.photoDataUrl||'').trim())throw new Error('A current visitor photograph is required.');
  const lock=LockService.getScriptLock();lock.waitLock(20000);let record,row,now=new Date(),saved;
  try{
    const found=findVisitorInvitation_(p.invitationToken);record=found.obj;row=found.row;const fullName=[p.firstName,p.middleName,p.lastName].filter(Boolean).join(' ');saved=savePhoto_(p.photoDataUrl,fullName,p.company,record.VisitID);
    const updates={FirstName:String(p.firstName).trim(),MiddleName:String(p.middleName||'').trim(),LastName:String(p.lastName).trim(),FullName:fullName,Email:String(p.email).trim().toLowerCase(),Phone:String(p.phone).trim(),Company:String(p.company).trim(),JobTitle:String(p.jobTitle||'').trim(),Relationship:String(p.relationship||'').trim(),Street:String(p.street||'').trim(),City:String(p.city||'').trim(),State:String(p.state||'').trim(),PostalCode:String(p.postalCode||'').trim(),Country:String(p.country||'').trim(),EmergencyName:String(p.emergencyName||'').trim(),EmergencyPhone:String(p.emergencyPhone||'').trim(),Driving:String(p.driving)==='Yes'?'Yes':'No',VehicleMake:String(p.vehicleMake||'').trim(),VehicleModel:String(p.vehicleModel||'').trim(),VehicleYear:String(p.vehicleYear||'').trim(),VehicleColor:String(p.vehicleColor||'').trim(),LicensePlate:String(p.licensePlate||'').trim(),PlateState:String(p.plateState||'').trim(),PhotoFileId:saved.id,PhotoFileName:saved.name,PhotoUrl:saved.url,AgreementVersion:String(p.agreementVersion||config_().AGREEMENT_VERSION||'2026.2'),AcknowledgementName:String(p.acknowledgementName).trim(),AcknowledgementDate:String(p.acknowledgementDate).trim(),AgreementTimestamp:now,AgreementCompletionCount:required.length,AgreementCompletionStatus:'Completed',SessionID:String(p.sessionId||''),ClientLanguage:String(p.clientLanguage||''),ClientTimeZone:String(p.clientTimeZone||''),UserAgent:String(p.userAgent||'').slice(0,500),ClientTimestamp:String(p.clientTimestamp||''),Referrer:String(p.referrer||''),AgreeSecurity:'Yes',AgreeBiometric:'Yes',AgreePrivacy:'Yes',AgreeSafety:'Yes',AgreeConduct:'Yes',AgreeTraining:'Yes',AgreeRestricted:'Yes',VisitorIntakeStatus:'Completed',VisitorIntakeCompletedAt:now,VisitorIntakeTokenHash:'',LastUpdatedAt:now};
    record=Object.assign({},record,updates);clearAcknowledgementsForVisit_(record.VisitID);saveAcknowledgements_(record,submitted,now);updateObjectRow_(FE.SHEETS.VISITS,row,updates);logActivity_(record.VisitID,'VISITOR_INTAKE_COMPLETED',record.FullName,'','Photo, profile, vehicle details, training, and acknowledgements '+required.length+'/'+required.length+' completed');audit_({UserID:'',Username:record.Email,FullName:record.FullName,Role:'Visitor'},'VISITOR_INTAKE_COMPLETED',record.VisitID,record.ConfirmationNumber,'Success','Sponsor-created request completed through secure invitation');
  }finally{lock.releaseLock()}
  const notice=notifySponsorVisitorIntakeCompleted_(record);updateObjectRow_(FE.SHEETS.VISITS,row,{VisitorIntakeCompletionNotificationStatus:notice.status,VisitorIntakeCompletionNotificationAt:notice.sent?notice.sentAt:'',VisitorIntakeCompletionNotificationError:notice.error||'',LastUpdatedAt:new Date()});logActivity_(record.VisitID,notice.sent?'SPONSOR_INTAKE_COMPLETION_EMAIL_SENT':'SPONSOR_INTAKE_COMPLETION_EMAIL_FAILED','VISTA','','Sponsor '+notice.status+(notice.recipient?' · '+notice.recipient:'')+(notice.error?' · '+notice.error:''));
  return{ok:true,visitId:record.VisitID,confirmationNumber:record.ConfirmationNumber,fullName:record.FullName,status:'Visitor Intake Completed – Pending Sponsor/Security Review',qrPayload:`FORD-ENERGY-VISTA|${record.ConfirmationNumber}|${record.VisitID}`,photoFileName:saved.name,notifications:{sponsorSent:notice.sent,visitorSent:true,securityConfigured:false,securitySent:false},intakeCompleted:true};
}

function listVisits_(p) {
  const rows=readObjects_(FE.SHEETS.VISITS), q=String(p.query||'').toLowerCase(), status=String(p.status||'');
  const visits=rows.filter(r=>!status||r.Status===status).filter(r=>!q||[r.FullName,r.ConfirmationNumber,r.SponsorName,r.Company,r.LicensePlate,r.BadgeUID,r.VisitID].join(' ').toLowerCase().includes(q)).sort((a,b)=>new Date(b.CreatedAt)-new Date(a.CreatedAt)).slice(0,500).map(publicVisit_);
  const today=Utilities.formatDate(new Date(),tz_(),'yyyy-MM-dd'), now=new Date();
  const kpis={expectedToday:rows.filter(r=>dateKey_(r.StartDate)===today&&!['Checked Out','Denied','Cancelled','No Show'].includes(r.Status)).length,onsite:rows.filter(r=>r.Status==='Checked In').length,checkedOutToday:rows.filter(r=>r.Status==='Checked Out'&&dateKey_(r.CheckOutTime)===today).length,overdue:rows.filter(r=>r.Status==='Checked In'&&r.EndDate&&new Date(`${dateKey_(r.EndDate)}T${timeOnly_(r.DepartureTime)||'23:59'}`)<now).length};
  return {ok:true,visits,kpis};
}
function listActiveOperations_(p,session){
  const now=new Date(),visits=readObjects_(FE.SHEETS.VISITS).filter(r=>String(r.Status)==='Checked In').map(r=>{
    const item=publicVisit_(r),checkIn=r.CheckInTime?new Date(r.CheckInTime):null;
    const endDate=dateKey_(r.EndDate),endTime=timeOnly_(r.DepartureTime)||'23:59';
    const expected=endDate?new Date(endDate+'T'+endTime):null;
    item.onsiteMinutes=checkIn&&!isNaN(checkIn)?Math.max(0,Math.floor((now-checkIn)/60000)):0;
    item.overdue=Boolean(expected&&!isNaN(expected)&&expected<now);
    item.expectedDeparture=dateTime_(expected);
    return item;
  }).sort((a,b)=>Number(b.overdue)-Number(a.overdue)||b.onsiteMinutes-a.onsiteMinutes);
  const badges=readObjects_(FE.SHEETS.BADGES).map(publicBadge_),exceptions=badges.filter(b=>['Lost','Broken'].includes(b.status));
  return{ok:true,generatedAt:dateTime_(now),visits:visits,exceptions:exceptions,summary:{onsite:visits.length,overdue:visits.filter(v=>v.overdue).length,badgesOut:badges.filter(b=>b.status==='Issued').length,badgeExceptions:exceptions.length}};
}

function getOperationalAnalytics_(p,session){
  const days=[7,30,90,365].includes(Number(p.days))?Number(p.days):30,now=new Date(),today=dateKey_(now),startDate=new Date(now.getTime()-(days-1)*86400000),startKey=dateKey_(startDate);
  const allVisits=readObjects_(FE.SHEETS.VISITS),visits=allVisits.filter(r=>{const key=dateKey_(r.StartDate||r.CreatedAt);return key>=startKey&&key<=today;});
  const statuses={Submitted:0,Approved:0,'Checked In':0,'Checked Out':0,Denied:0,'No Show':0,Other:0},daily={},sponsors={},hours={};
  for(let i=0;i<days;i++){const d=new Date(startDate.getTime()+i*86400000);daily[dateKey_(d)]=0;}
  visits.forEach(r=>{const status=String(r.Status||'Submitted'),key=dateKey_(r.StartDate||r.CreatedAt);if(Object.prototype.hasOwnProperty.call(statuses,status))statuses[status]++;else statuses.Other++;if(Object.prototype.hasOwnProperty.call(daily,key))daily[key]++;const sponsor=String(r.SponsorName||'Unassigned').trim()||'Unassigned';sponsors[sponsor]=(sponsors[sponsor]||0)+1;const hour=Number(String(timeOnly_(r.ArrivalTime)||'').slice(0,2));if(!isNaN(hour))hours[hour]=(hours[hour]||0)+1;});
  const approved=statuses.Approved+statuses['Checked In']+statuses['Checked Out'],decided=approved+statuses.Denied,durations=visits.map(r=>Number(r.ActualDurationMinutes||0)).filter(n=>n>0),avgDuration=durations.length?Math.round(durations.reduce((a,b)=>a+b,0)/durations.length):0;
  const peakHour=Object.keys(hours).sort((a,b)=>hours[b]-hours[a])[0],badges=readObjects_(FE.SHEETS.BADGES),badgeCounts={total:badges.length,available:0,issued:0,unavailable:0};badges.forEach(b=>{const s=String(b.Status||'Available');if(s==='Available')badgeCounts.available++;else if(s==='Issued')badgeCounts.issued++;else badgeCounts.unavailable++;});
  const handoffs=readObjects_(FE.SHEETS.HANDOFFS).filter(r=>{const key=dateKey_(r.CreatedAt);return key>=startKey&&key<=today;}),handoffCounts={total:handoffs.length,pending:0,acknowledged:0,resolved:0,escalated:0};let ackTotal=0,ackSamples=0,resolutionTotal=0,resolutionSamples=0;
  handoffs.forEach(h=>{const workflow=String(h.WorkflowStatus||'Pending');if(workflow==='Acknowledged')handoffCounts.acknowledged++;else if(workflow==='Resolved')handoffCounts.resolved++;else handoffCounts.pending++;if(String(h.EscalationLevel||'None')!=='None')handoffCounts.escalated++;const created=parseDateSafe_(h.CreatedAt),ack=parseDateSafe_(h.AcknowledgedAt),resolved=parseDateSafe_(h.ResolvedAt);if(created&&ack){ackTotal+=Math.max(0,(ack-created)/60000);ackSamples++;}if(created&&resolved){resolutionTotal+=Math.max(0,(resolved-created)/60000);resolutionSamples++;}});
  const topSponsors=Object.keys(sponsors).map(name=>({name:name,count:sponsors[name]})).sort((a,b)=>b.count-a.count||a.name.localeCompare(b.name)).slice(0,5),dailyVolume=Object.keys(daily).sort().map(date=>({date:date,count:daily[date]}));
  return{ok:true,generatedAt:dateTime_(now),range:{days:days,start:startKey,end:today},summary:{totalVisits:visits.length,approved:approved,denied:statuses.Denied,noShow:statuses['No Show'],checkedIn:statuses['Checked In'],checkedOut:statuses['Checked Out'],onsiteNow:allVisits.filter(r=>String(r.Status)==='Checked In').length,approvalRate:decided?Math.round(approved/decided*100):0,averageDurationMinutes:avgDuration,peakArrivalHour:peakHour===undefined?'—':String(peakHour).padStart(2,'0')+':00'},statuses:statuses,dailyVolume:dailyVolume,topSponsors:topSponsors,badges:badgeCounts,handoffs:Object.assign(handoffCounts,{averageAcknowledgementMinutes:ackSamples?Math.round(ackTotal/ackSamples):0,averageResolutionMinutes:resolutionSamples?Math.round(resolutionTotal/resolutionSamples):0})};
}

function reportRange_(p){const days=[7,30,90,365].includes(Number(p.days))?Number(p.days):30,now=new Date(),end=dateKey_(now),start=dateKey_(new Date(now.getTime()-(days-1)*86400000));return{days:days,start:start,end:end,generatedAt:dateTime_(now)};}
function inReportRange_(value,range){const key=dateKey_(value);return Boolean(key&&key>=range.start&&key<=range.end);}
function generateOperationalReport_(p,session){
  const type=String(p.reportType||'summary'),allowed=['summary','visitors','badges','handoffs','audit'];if(!allowed.includes(type))throw new Error('Select a valid VISTA report type.');
  const range=reportRange_(p),query=String(p.query||'').trim().toLowerCase(),limit=1000;let title='',columns=[],rows=[];
  if(type==='summary'){
    const data=getOperationalAnalytics_({days:range.days},session),s=data.summary,b=data.badges,h=data.handoffs;title='VISTA Operational Summary';columns=[{key:'category',label:'Category'},{key:'metric',label:'Metric'},{key:'value',label:'Value'}];rows=[
      {category:'Visitors',metric:'Total visits',value:s.totalVisits},{category:'Visitors',metric:'Approval rate',value:s.approvalRate+'%'},{category:'Visitors',metric:'Currently onsite',value:s.onsiteNow},{category:'Visitors',metric:'Average visit duration (minutes)',value:s.averageDurationMinutes},{category:'Visitors',metric:'Peak arrival hour',value:s.peakArrivalHour},{category:'Outcomes',metric:'Denied',value:s.denied},{category:'Outcomes',metric:'No show',value:s.noShow},{category:'Badges',metric:'Available',value:b.available},{category:'Badges',metric:'Issued',value:b.issued},{category:'Badges',metric:'Unavailable',value:b.unavailable},{category:'Handoffs',metric:'Pending',value:h.pending},{category:'Handoffs',metric:'Acknowledged',value:h.acknowledged},{category:'Handoffs',metric:'Resolved',value:h.resolved},{category:'Handoffs',metric:'Escalated',value:h.escalated},{category:'Handoffs',metric:'Average acknowledgement (minutes)',value:h.averageAcknowledgementMinutes},{category:'Handoffs',metric:'Average resolution (minutes)',value:h.averageResolutionMinutes}
    ];
  }else if(type==='visitors'){
    const badgeMap=readObjects_(FE.SHEETS.BADGES).reduce((map,b)=>(map[normalizeBadgeUid_(b.BadgeUID)]=String(b.BadgeNumber||''),map),{});title='Visitor Activity Report';columns=[{key:'date',label:'Visit Date'},{key:'visitor',label:'Visitor'},{key:'company',label:'Company'},{key:'sponsor',label:'Sponsor'},{key:'status',label:'Status'},{key:'badge',label:'Badge'},{key:'checkIn',label:'Check In'},{key:'checkOut',label:'Check Out'},{key:'duration',label:'Duration Minutes'}];rows=readObjects_(FE.SHEETS.VISITS).filter(r=>inReportRange_(r.StartDate||r.CreatedAt,range)).map(r=>({date:dateKey_(r.StartDate||r.CreatedAt),visitor:String(r.FullName||''),company:String(r.Company||''),sponsor:String(r.SponsorName||''),status:String(r.Status||''),badge:badgeMap[normalizeBadgeUid_(r.BadgeUID)]||String(r.BadgeUID||''),checkIn:dateText_(r.CheckInTime),checkOut:dateText_(r.CheckOutTime),duration:Number(r.ActualDurationMinutes||0)||''}));
  }else if(type==='badges'){
    title='Visitor Badge Inventory Report';columns=[{key:'number',label:'Badge Number'},{key:'uid',label:'Badge UID'},{key:'status',label:'Status'},{key:'visitId',label:'Current Visit ID'},{key:'issuedAt',label:'Issued At'},{key:'returnedAt',label:'Returned At'},{key:'notes',label:'Notes'}];rows=readObjects_(FE.SHEETS.BADGES).map(r=>({number:String(r.BadgeNumber||''),uid:String(r.BadgeUID||''),status:String(r.Status||''),visitId:String(r.CurrentVisitID||''),issuedAt:dateText_(r.IssuedAt),returnedAt:dateText_(r.ReturnedAt),notes:String(r.Notes||'')}));
  }else if(type==='handoffs'){
    title='Shift Handoff Accountability Report';columns=[{key:'createdAt',label:'Created At'},{key:'shift',label:'Shift / Post'},{key:'createdBy',label:'Created By'},{key:'accountability',label:'Accountability'},{key:'workflow',label:'Workflow'},{key:'assignedTo',label:'Assigned To'},{key:'escalation',label:'Escalation'},{key:'resolvedAt',label:'Resolved At'},{key:'notes',label:'Notes'}];rows=readObjects_(FE.SHEETS.HANDOFFS).filter(r=>inReportRange_(r.CreatedAt,range)).map(r=>({createdAt:dateText_(r.CreatedAt),shift:String(r.ShiftLabel||''),createdBy:String(r.CreatedBy||''),accountability:String(r.Status||''),workflow:String(r.WorkflowStatus||'Pending'),assignedTo:String(r.AssignedTo||''),escalation:String(r.EscalationLevel||'None'),resolvedAt:dateText_(r.ResolvedAt),notes:[r.Notes,r.EscalationNotes,r.ResolutionNotes].filter(Boolean).join(' | ')}));
  }else{
    title='VISTA Audit Report';columns=[{key:'timestamp',label:'Timestamp'},{key:'username',label:'Username'},{key:'role',label:'Role'},{key:'action',label:'Action'},{key:'visitId',label:'Visit ID'},{key:'result',label:'Result'},{key:'details',label:'Details'}];rows=readObjects_(FE.SHEETS.AUDIT).filter(r=>inReportRange_(r.Timestamp,range)).map(r=>({timestamp:dateText_(r.Timestamp),username:String(r.Username||''),role:String(r.Role||''),action:String(r.Action||''),visitId:String(r.VisitID||''),result:String(r.Result||''),details:String(r.Details||'')}));
  }
  if(query)rows=rows.filter(row=>Object.values(row).join(' ').toLowerCase().includes(query));rows=rows.sort((a,b)=>String(Object.values(b)[0]||'').localeCompare(String(Object.values(a)[0]||'')));const totalRows=rows.length,truncated=totalRows>limit;rows=rows.slice(0,limit);
  audit_(session,'REPORT_GENERATED','','','Success',type+' · '+range.days+' days · '+totalRows+' rows');return{ok:true,reportType:type,title:title,generatedAt:range.generatedAt,range:{days:range.days,start:range.start,end:range.end},columns:columns,rows:rows,totalRows:totalRows,truncated:truncated};
}
function recordReportExport_(p,session){const type=String(p.reportType||''),format=String(p.format||'').toUpperCase();if(!['summary','visitors','badges','handoffs','audit'].includes(type))throw new Error('Invalid report type.');if(!['CSV','PRINT'].includes(format))throw new Error('Invalid report export format.');audit_(session,'REPORT_EXPORTED','','','Success',type+' · '+format+' · '+Number(p.rowCount||0)+' rows');return{ok:true};}

function operationalAlertCandidates_(session){
  const live=listActiveOperations_({},session),alerts=[];
  live.visits.filter(v=>v.overdue).forEach(v=>alerts.push({type:'OVERDUE_VISITOR',severity:'High',title:'Visitor overdue for checkout',message:(v.fullName||'Visitor')+' remains onsite beyond '+(v.expectedDeparture||'the expected departure time')+'.',visitId:v.visitId,badgeUid:v.badgeUid,handoffId:'',key:'OVERDUE_VISITOR|'+v.visitId}));
  live.exceptions.forEach(b=>alerts.push({type:'BADGE_EXCEPTION',severity:b.status==='Lost'?'Critical':'High',title:'Visitor badge '+String(b.status||'exception').toLowerCase(),message:'Visitor Badge '+(b.badgeNumber||'Unnumbered')+' · '+b.badgeUid+(b.notes?' · '+b.notes:''),visitId:b.currentVisitId||'',badgeUid:b.badgeUid,handoffId:'',key:'BADGE_EXCEPTION|'+normalizeBadgeUid_(b.badgeUid)}));
  readObjects_(FE.SHEETS.HANDOFFS).filter(h=>String(h.WorkflowStatus||'Pending')!=='Resolved'&&String(h.EscalationLevel||'None')!=='None').forEach(h=>alerts.push({type:'HANDOFF_ESCALATION',severity:'High',title:'Shift handoff requires supervisor attention',message:(h.ShiftLabel||'Shift handoff')+(h.AssignedTo?' · Assigned to '+h.AssignedTo:'')+(h.EscalationNotes?' · '+h.EscalationNotes:''),visitId:'',badgeUid:'',handoffId:String(h.HandoffID||''),key:'HANDOFF_ESCALATION|'+String(h.HandoffID||'')}));
  return alerts;
}
function synchronizeOperationalNotifications_(session){
  const sheet=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.NOTIFICATIONS),existing=readObjects_(FE.SHEETS.NOTIFICATIONS),candidates=operationalAlertCandidates_(session),activeKeys=candidates.reduce((o,a)=>(o[a.key]=true,o),{}),now=new Date();
  candidates.forEach(a=>{const open=existing.find(n=>String(n.DeduplicationKey||'')===a.key&&['Open','Acknowledged'].includes(String(n.Status||'Open')));if(!open){const rec={NotificationID:'NTF-'+Utilities.getUuid().slice(0,12).toUpperCase(),CreatedAt:now,Type:a.type,Severity:a.severity,Title:a.title,Message:a.message,RelatedVisitID:a.visitId,RelatedBadgeUID:a.badgeUid,RelatedHandoffID:a.handoffId,Status:'Open',AcknowledgedAt:'',AcknowledgedByUserID:'',AcknowledgedBy:'',LastUpdatedAt:now,DeduplicationKey:a.key};appendObjectRow_(sheet,rec,FE.NOTIFICATION_HEADERS);}});
  if(sheet&&sheet.getLastRow()>1){const data=sheet.getDataRange().getValues(),headers=data[0],keyCol=headers.indexOf('DeduplicationKey'),statusCol=headers.indexOf('Status');for(let i=1;i<data.length;i++){const status=String(data[i][statusCol]||'Open'),key=String(data[i][keyCol]||'');if(['Open','Acknowledged'].includes(status)&&key&&!activeKeys[key])updateObjectRow_(FE.SHEETS.NOTIFICATIONS,i+1,{Status:'Cleared',LastUpdatedAt:now});}}
}
function notificationAcknowledgements_(){return readObjects_(FE.SHEETS.NOTIFICATION_ACKS);}
function publicOperationalNotification_(r,session,ackRows){const id=String(r.NotificationID||''),broadcast=String(r.Type||'')==='ADMIN_BROADCAST',status=String(r.Status||'Open'),userId=String(session&&session.UserID||''),acks=(ackRows||[]).filter(a=>String(a.NotificationID||'')===id),ownAck=acks.find(a=>String(a.UserID||'')===userId);return{notificationId:id,createdAt:dateText_(r.CreatedAt),createdBy:String(r.CreatedBy||''),effectiveAt:dateText_(r.EffectiveAt||r.CreatedAt),expiresAt:dateText_(r.ExpiresAt),type:String(r.Type||''),severity:String(r.Severity||'Medium'),title:String(r.Title||''),message:String(r.Message||''),visitId:String(r.RelatedVisitID||''),badgeUid:String(r.RelatedBadgeUID||''),handoffId:String(r.RelatedHandoffID||''),hasPhoto:Boolean(r.PhotoFileId),requiresAcknowledgement:!['Cleared','Archived'].includes(status),status:status,acknowledgedAt:ownAck?dateText_(ownAck.AcknowledgedAt):dateText_(r.AcknowledgedAt),acknowledgedBy:ownAck?String(ownAck.FullName||ownAck.Username||''):String(r.AcknowledgedBy||''),acknowledgedByCurrentUser:broadcast?Boolean(ownAck):status==='Acknowledged',acknowledgementCount:broadcast?acks.length:(status==='Acknowledged'?1:0)};}
function notificationIsVisible_(r,now,role){const status=String(r.Status||'Open');if(['Cleared','Archived'].includes(status))return false;if(String(r.Type||'')!=='ADMIN_BROADCAST')return true;const effective=parseDateSafe_(r.EffectiveAt),expires=parseDateSafe_(r.ExpiresAt),targets=String(r.TargetRoles||'').split('|').map(x=>x.trim().toLowerCase()).filter(Boolean);return (!targets.length||targets.includes(String(role||'').trim().toLowerCase()))&&(!effective||effective<=now)&&(!expires||expires>=now)&&status==='Active';}
function listOperationalNotifications_(p,session){synchronizeOperationalNotifications_(session);const now=new Date(),includeCleared=Boolean(p.includeCleared),limit=Math.min(100,Math.max(1,Number(p.limit||25))),acks=notificationAcknowledgements_(),source=readObjects_(FE.SHEETS.NOTIFICATIONS).filter(r=>includeCleared||notificationIsVisible_(r,now,session.Role)),rows=source.slice(-limit).reverse().map(r=>publicOperationalNotification_(r,session,acks));return{ok:true,generatedAt:dateTime_(now),notifications:rows,summary:{active:rows.filter(r=>!['Cleared','Archived'].includes(r.status)).length,critical:rows.filter(r=>!['Cleared','Archived'].includes(r.status)&&r.severity==='Critical').length,unacknowledged:rows.filter(r=>r.requiresAcknowledgement&&!r.acknowledgedByCurrentUser).length}};}
function findNotificationRow_(id){const sheet=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.NOTIFICATIONS),data=sheet.getDataRange().getValues(),headers=data[0],idx=headers.indexOf('NotificationID');for(let i=1;i<data.length;i++)if(String(data[i][idx])===String(id))return{row:i+1,obj:headers.reduce((o,k,j)=>(o[k]=data[i][j],o),{})};throw new Error('Operational notification was not found.');}
function acknowledgeOperationalNotification_(p,session){validateRequired_(p,['notificationId']);const found=findNotificationRow_(p.notificationId),status=String(found.obj.Status||'Open');if(['Cleared','Archived'].includes(status))throw new Error('This alert is no longer active.');const now=new Date(),by=String(session.FullName||session.Username||''),broadcast=String(found.obj.Type||'')==='ADMIN_BROADCAST';if(broadcast){const lock=LockService.getScriptLock();lock.waitLock(15000);try{const existing=notificationAcknowledgements_().find(a=>String(a.NotificationID||'')===String(found.obj.NotificationID||'')&&String(a.UserID||'')===String(session.UserID||''));if(!existing){const rec={AcknowledgementID:'NAK-'+Utilities.getUuid().slice(0,12).toUpperCase(),NotificationID:String(found.obj.NotificationID||''),UserID:String(session.UserID||''),Username:String(session.Username||''),FullName:by,Role:String(session.Role||''),AcknowledgedAt:now,UserAgent:String(p.userAgent||'').slice(0,500)};appendObjectRow_(SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.NOTIFICATION_ACKS),rec,FE.NOTIFICATION_ACK_HEADERS);}}finally{lock.releaseLock();}updateObjectRow_(FE.SHEETS.NOTIFICATIONS,found.row,{LastUpdatedAt:now});}else updateObjectRow_(FE.SHEETS.NOTIFICATIONS,found.row,{Status:'Acknowledged',AcknowledgedAt:now,AcknowledgedByUserID:String(session.UserID||''),AcknowledgedBy:by,LastUpdatedAt:now});audit_(session,'NOTIFICATION_ACKNOWLEDGED',String(found.obj.RelatedVisitID||''),'','Success',String(found.obj.NotificationID||'')+' · '+String(found.obj.Title||'')+' · '+by);return{ok:true,acknowledgedAt:dateText_(now),acknowledgedBy:by};}

function alertPhotoFolder_(){const cfg=config_(),id=String(cfg.INCIDENT_PHOTO_FOLDER_ID||cfg.USER_PHOTO_FOLDER_ID||cfg.PHOTO_FOLDER_ID||'').trim();return id?DriveApp.getFolderById(id):DriveApp.getRootFolder();}
function saveAlertPhoto_(dataUrl,notificationId){const m=String(dataUrl||'').match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,(.+)$/i);if(!m)throw new Error('Alert image must be a JPG, PNG, or WebP image.');const bytes=Utilities.base64Decode(m[2]);if(bytes.length>4000000)throw new Error('Alert image is too large after processing.');const ext=m[1].toLowerCase().includes('png')?'png':'jpg',fileName='VISTA-ALERT-'+safeFilePart_(notificationId)+'-'+Utilities.formatDate(new Date(),tz_(),'yyyyMMdd-HHmmss')+'-'+Utilities.getUuid().slice(0,8).toUpperCase()+'.'+ext,file=alertPhotoFolder_().createFile(Utilities.newBlob(bytes,m[1],fileName));return{fileId:file.getId(),fileName:fileName,url:'https://drive.google.com/file/d/'+file.getId()+'/view'};}
function createBroadcastNotification_(p,session){const title=String(p.title||'').trim(),message=String(p.message||'').trim(),severity=String(p.severity||'Medium'),effective=parseDateSafe_(p.effectiveAt)||new Date(),expires=parseDateSafe_(p.expiresAt);if(title.length<3)throw new Error('Enter an alert title with at least three characters.');if(message.length<10)throw new Error('Enter alert information with at least ten characters.');if(!['Info','Medium','High','Critical'].includes(severity))throw new Error('Select a valid alert priority.');if(expires&&expires<=effective)throw new Error('The expiration date must be after the effective date.');const now=new Date(),id='NTF-'+Utilities.getUuid().slice(0,12).toUpperCase(),rec={NotificationID:id,CreatedAt:now,CreatedByUserID:String(session.UserID||''),CreatedBy:String(session.FullName||session.Username||''),Type:'ADMIN_BROADCAST',Severity:severity,Title:title.slice(0,180),Message:message.slice(0,4000),EffectiveAt:effective,ExpiresAt:expires||'',RelatedVisitID:'',RelatedBadgeUID:'',RelatedHandoffID:'',PhotoFileId:'',PhotoFileName:'',PhotoUrl:'',TargetRoles:'Security Supervisor|Security|FrontDesk|Admin|Super Administrator',RequireAcknowledgement:'Yes',Status:'Active',AcknowledgedAt:'',AcknowledgedByUserID:'',AcknowledgedBy:'',LastUpdatedAt:now,DeduplicationKey:'ADMIN_BROADCAST|'+id};if(String(p.photoDataUrl||'').trim()){const photo=saveAlertPhoto_(p.photoDataUrl,id);rec.PhotoFileId=photo.fileId;rec.PhotoFileName=photo.fileName;rec.PhotoUrl=photo.url;}appendObjectRow_(SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.NOTIFICATIONS),rec,FE.NOTIFICATION_HEADERS);audit_(session,'ADMIN_ALERT_PUBLISHED','','','Success',id+' · '+severity+' · '+title);return{ok:true,notification:publicOperationalNotification_(rec,session,[]),message:'Alert published to Security Operations.'};}
function listAdminNotifications_(p,session){const limit=Math.min(100,Math.max(1,Number(p.limit||25))),acks=notificationAcknowledgements_(),rows=readObjects_(FE.SHEETS.NOTIFICATIONS).filter(r=>String(r.Type||'')==='ADMIN_BROADCAST').slice(-limit).reverse().map(r=>publicOperationalNotification_(r,session,acks));return{ok:true,notifications:rows};}
function archiveBroadcastNotification_(p,session){validateRequired_(p,['notificationId']);const found=findNotificationRow_(p.notificationId);if(String(found.obj.Type||'')!=='ADMIN_BROADCAST')throw new Error('Only Administration broadcast alerts can be archived here.');const now=new Date();updateObjectRow_(FE.SHEETS.NOTIFICATIONS,found.row,{Status:'Archived',LastUpdatedAt:now});audit_(session,'ADMIN_ALERT_ARCHIVED','','','Success',String(found.obj.NotificationID||'')+' · '+String(found.obj.Title||''));return{ok:true};}
function getNotificationPhoto_(p,session){validateRequired_(p,['notificationId']);const found=findNotificationRow_(p.notificationId),fileId=String(found.obj.PhotoFileId||'');if(!fileId)return{ok:true,hasPhoto:false};try{const file=DriveApp.getFileById(fileId),blob=file.getBlob(),mime=blob.getContentType()||'image/jpeg';return{ok:true,hasPhoto:true,dataUrl:'data:'+mime+';base64,'+Utilities.base64Encode(blob.getBytes()),fileName:String(found.obj.PhotoFileName||file.getName())};}catch(err){throw new Error('Alert image could not be loaded.');}}

function incidentPhotoFolder_(){const cfg=config_(),id=String(cfg.INCIDENT_PHOTO_FOLDER_ID||cfg.USER_PHOTO_FOLDER_ID||cfg.PHOTO_FOLDER_ID||'').trim();return id?DriveApp.getFolderById(id):DriveApp.getRootFolder();}
function saveIncidentPhoto_(dataUrl,incidentId){const m=String(dataUrl||'').match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,(.+)$/i);if(!m)throw new Error('Incident evidence must be a JPG, PNG, or WebP image.');const bytes=Utilities.base64Decode(m[2]);if(bytes.length>4000000)throw new Error('Incident photograph is too large after processing.');const ext=m[1].toLowerCase().includes('png')?'png':'jpg',fileName='VISTA-INCIDENT-'+safeFilePart_(incidentId)+'-'+Utilities.formatDate(new Date(),tz_(),'yyyyMMdd-HHmmss')+'-'+Utilities.getUuid().slice(0,8).toUpperCase()+'.'+ext,file=incidentPhotoFolder_().createFile(Utilities.newBlob(bytes,m[1],fileName));return{fileId:file.getId(),fileName:fileName,url:'https://drive.google.com/file/d/'+file.getId()+'/view'};}
function publicIncident_(r){return{incidentId:String(r.IncidentID||''),createdAt:dateText_(r.CreatedAt),reportedBy:String(r.ReportedBy||''),role:String(r.Role||''),category:String(r.Category||''),severity:String(r.Severity||''),location:String(r.Location||''),description:String(r.Description||''),visitId:String(r.RelatedVisitID||''),badgeUid:String(r.RelatedBadgeUID||''),hasPhoto:Boolean(r.PhotoFileId),status:String(r.Status||'Open'),assignedTo:String(r.AssignedTo||''),resolutionNotes:String(r.ResolutionNotes||''),resolvedAt:dateText_(r.ResolvedAt),resolvedBy:String(r.ResolvedBy||'')};}
function createIncident_(p,session){const category=String(p.category||'Other').trim(),severity=String(p.severity||'Medium').trim(),location=String(p.location||'').trim(),description=String(p.description||'').trim();if(description.length<10)throw new Error('Enter an incident description with at least ten characters.');if(!['Low','Medium','High','Critical'].includes(severity))throw new Error('Select a valid incident severity.');const now=new Date(),id='INC-'+Utilities.formatDate(now,tz_(),'yyyyMMdd')+'-'+Utilities.getUuid().slice(0,8).toUpperCase(),rec={IncidentID:id,CreatedAt:now,ReportedByUserID:String(session.UserID||''),ReportedBy:String(session.FullName||session.Username||''),Role:String(session.Role||''),Category:category.slice(0,80),Severity:severity,Location:location.slice(0,160),Description:description.slice(0,4000),RelatedVisitID:String(p.visitId||''),RelatedBadgeUID:String(p.badgeUid||''),PhotoFileId:'',PhotoFileName:'',PhotoUrl:'',Status:'Open',AssignedTo:String(p.assignedTo||'').slice(0,120),ResolutionNotes:'',ResolvedAt:'',ResolvedByUserID:'',ResolvedBy:'',LastUpdatedAt:now};if(String(p.photoDataUrl||'').trim()){const photo=saveIncidentPhoto_(p.photoDataUrl,id);rec.PhotoFileId=photo.fileId;rec.PhotoFileName=photo.fileName;rec.PhotoUrl=photo.url;}appendObjectRow_(SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.INCIDENTS),rec,FE.INCIDENT_HEADERS);audit_(session,'INCIDENT_REPORTED',rec.RelatedVisitID,'','Success',id+' · '+severity+' · '+category);return{ok:true,incident:publicIncident_(rec),message:'Incident '+id+' recorded.'};}
function listIncidents_(p,session){const limit=Math.min(100,Math.max(1,Number(p.limit||20))),status=String(p.status||'').trim(),rows=readObjects_(FE.SHEETS.INCIDENTS).filter(r=>!status||String(r.Status||'Open')===status).slice(-limit).reverse().map(publicIncident_);return{ok:true,incidents:rows,summary:{open:rows.filter(r=>r.status==='Open').length,critical:rows.filter(r=>r.status==='Open'&&r.severity==='Critical').length}};}
function findIncidentRow_(id){const sheet=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.INCIDENTS),data=sheet.getDataRange().getValues(),headers=data[0],idx=headers.indexOf('IncidentID');for(let i=1;i<data.length;i++)if(String(data[i][idx])===String(id))return{row:i+1,obj:headers.reduce((o,k,j)=>(o[k]=data[i][j],o),{})};throw new Error('Incident record was not found.');}
function resolveIncident_(p,session){validateRequired_(p,['incidentId']);const notes=String(p.resolutionNotes||'').trim();if(notes.length<5)throw new Error('Enter resolution notes with at least five characters.');const found=findIncidentRow_(p.incidentId),now=new Date(),by=String(session.FullName||session.Username||'');if(String(found.obj.Status)==='Resolved')throw new Error('This incident is already resolved.');updateObjectRow_(FE.SHEETS.INCIDENTS,found.row,{Status:'Resolved',ResolutionNotes:notes.slice(0,2000),ResolvedAt:now,ResolvedByUserID:String(session.UserID||''),ResolvedBy:by,LastUpdatedAt:now});audit_(session,'INCIDENT_RESOLVED',String(found.obj.RelatedVisitID||''),'','Success',String(found.obj.IncidentID||'')+' · '+notes.slice(0,180));return{ok:true};}
function getIncidentPhoto_(p,session){validateRequired_(p,['incidentId']);const found=findIncidentRow_(p.incidentId),fileId=String(found.obj.PhotoFileId||'');if(!fileId)return{ok:true,hasPhoto:false};try{const file=DriveApp.getFileById(fileId),blob=file.getBlob(),mime=blob.getContentType()||'image/jpeg';return{ok:true,hasPhoto:true,dataUrl:'data:'+mime+';base64,'+Utilities.base64Encode(blob.getBytes()),fileName:String(found.obj.PhotoFileName||file.getName())};}catch(err){throw new Error('Incident photograph could not be loaded.');}}

function createShiftHandoff_(p,session){
  const notes=String(p.notes||'').trim(),shiftLabel=String(p.shiftLabel||'Shift handoff').trim().slice(0,80);
  if(notes.length<5)throw new Error('Enter handoff notes with at least five characters.');
  const live=listActiveOperations_({},session),summary=live.summary;
  const snapshot={generatedAt:live.generatedAt,visitors:live.visits.map(v=>({visitId:v.visitId,fullName:v.fullName,company:v.company,sponsorName:v.sponsorName,badgeUid:v.badgeUid,badgeNumber:v.badgeNumber,onsiteMinutes:v.onsiteMinutes,overdue:v.overdue,expectedDeparture:v.expectedDeparture})),badgeExceptions:live.exceptions.map(b=>({badgeUid:b.badgeUid,badgeNumber:b.badgeNumber,status:b.status,notes:b.notes}))};
  const now=new Date(),record={HandoffID:'HND-'+Utilities.getUuid().slice(0,12).toUpperCase(),CreatedAt:now,CreatedByUserID:String(session.UserID||''),CreatedBy:String(session.FullName||session.Username||''),Role:String(session.Role||''),ShiftLabel:shiftLabel,Notes:notes,VisitorsOnsite:summary.onsite,OverdueVisitors:summary.overdue,BadgesOut:summary.badgesOut,BadgeExceptions:summary.badgeExceptions,Status:(summary.onsite||summary.overdue||summary.badgesOut||summary.badgeExceptions)?'Open Items':'Clear',WorkflowStatus:'Pending',AcknowledgedAt:'',AcknowledgedByUserID:'',AcknowledgedBy:'',AssignedTo:'',EscalationLevel:'None',EscalationNotes:'',ResolutionNotes:'',ResolvedAt:'',ResolvedByUserID:'',ResolvedBy:'',LastUpdatedAt:now,SnapshotJSON:JSON.stringify(snapshot)};
  const lock=LockService.getScriptLock();lock.waitLock(15000);
  try{appendObjectRow_(SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.HANDOFFS),record,FE.HANDOFF_HEADERS);}finally{lock.releaseLock();}
  audit_(session,'SHIFT_HANDOFF_CREATED','','','Success',record.HandoffID+' · '+record.Status+' · '+notes.slice(0,180));
  return{ok:true,handoff:publicShiftHandoff_(record)};
}
function listShiftHandoffs_(p,session){
  const limit=Math.min(25,Math.max(1,Number(p.limit||5)));
  const handoffs=readObjects_(FE.SHEETS.HANDOFFS).slice(-limit).reverse().map(publicShiftHandoff_);
  return{ok:true,handoffs:handoffs};
}
function findShiftHandoffRow_(handoffId){
  const sheet=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.HANDOFFS);if(!sheet||sheet.getLastRow()<2)throw new Error('Shift handoff record not found.');
  const data=sheet.getDataRange().getValues(),headers=data[0],idIndex=headers.indexOf('HandoffID');
  for(let i=1;i<data.length;i++)if(String(data[i][idIndex])===String(handoffId))return{sheet:sheet,row:i+1,obj:headers.reduce((o,k,j)=>(o[k]=data[i][j],o),{})};
  throw new Error('Shift handoff record not found. Refresh the handoff list and try again.');
}
function acknowledgeShiftHandoff_(p,session){
  validateRequired_(p,['handoffId']);const found=findShiftHandoffRow_(p.handoffId),workflow=String(found.obj.WorkflowStatus||'Pending');if(workflow==='Resolved')throw new Error('This shift handoff is already resolved.');
  const now=new Date(),by=String(session.FullName||session.Username||''),assigned=String(p.assignedTo||by).trim().slice(0,120);
  updateObjectRow_(FE.SHEETS.HANDOFFS,found.row,{WorkflowStatus:'Acknowledged',AcknowledgedAt:now,AcknowledgedByUserID:String(session.UserID||''),AcknowledgedBy:by,AssignedTo:assigned,LastUpdatedAt:now});
  audit_(session,'SHIFT_HANDOFF_ACKNOWLEDGED','','','Success',found.obj.HandoffID+' · Assigned to '+assigned);return{ok:true};
}
function resolveShiftHandoff_(p,session){
  validateRequired_(p,['handoffId']);const notes=String(p.resolutionNotes||'').trim();if(notes.length<5)throw new Error('Enter resolution notes with at least five characters.');
  const found=findShiftHandoffRow_(p.handoffId),workflow=String(found.obj.WorkflowStatus||'Pending');if(workflow==='Resolved')throw new Error('This shift handoff is already resolved.');if(workflow!=='Acknowledged')throw new Error('A shift handoff must be acknowledged before it can be resolved.');
  const now=new Date(),by=String(session.FullName||session.Username||'');updateObjectRow_(FE.SHEETS.HANDOFFS,found.row,{WorkflowStatus:'Resolved',ResolutionNotes:notes.slice(0,1000),ResolvedAt:now,ResolvedByUserID:String(session.UserID||''),ResolvedBy:by,LastUpdatedAt:now});
  audit_(session,'SHIFT_HANDOFF_RESOLVED','','','Success',found.obj.HandoffID+' · '+notes.slice(0,180));return{ok:true};
}
function escalateShiftHandoff_(p,session){
  validateRequired_(p,['handoffId']);const notes=String(p.escalationNotes||'').trim();if(notes.length<5)throw new Error('Enter an escalation reason with at least five characters.');
  const found=findShiftHandoffRow_(p.handoffId);if(String(found.obj.WorkflowStatus||'Pending')==='Resolved')throw new Error('A resolved shift handoff cannot be escalated.');
  const now=new Date(),assigned=String(p.assignedTo||found.obj.AssignedTo||'Security Supervisor').trim().slice(0,120);updateObjectRow_(FE.SHEETS.HANDOFFS,found.row,{EscalationLevel:'Supervisor Attention',EscalationNotes:notes.slice(0,1000),AssignedTo:assigned,LastUpdatedAt:now});
  audit_(session,'SHIFT_HANDOFF_ESCALATED','','','Success',found.obj.HandoffID+' · Assigned to '+assigned+' · '+notes.slice(0,180));return{ok:true};
}
function publicShiftHandoff_(r){const created=r.CreatedAt?new Date(r.CreatedAt):null,ageMinutes=created&&!isNaN(created)?Math.max(0,Math.floor((new Date()-created)/60000)):0;return{handoffId:String(r.HandoffID||''),createdAt:dateText_(r.CreatedAt),createdBy:String(r.CreatedBy||''),role:String(r.Role||''),shiftLabel:String(r.ShiftLabel||''),notes:String(r.Notes||''),visitorsOnsite:Number(r.VisitorsOnsite||0),overdueVisitors:Number(r.OverdueVisitors||0),badgesOut:Number(r.BadgesOut||0),badgeExceptions:Number(r.BadgeExceptions||0),status:String(r.Status||''),workflowStatus:String(r.WorkflowStatus||'Pending'),ageMinutes:ageMinutes,acknowledgedAt:dateText_(r.AcknowledgedAt),acknowledgedBy:String(r.AcknowledgedBy||''),assignedTo:String(r.AssignedTo||''),escalationLevel:String(r.EscalationLevel||'None'),escalationNotes:String(r.EscalationNotes||''),resolutionNotes:String(r.ResolutionNotes||''),resolvedAt:dateText_(r.ResolvedAt),resolvedBy:String(r.ResolvedBy||'')};}

function manualVisitorCheckInAuthorized_(p,session){
  requirePermission_(session,'manualVisitIntake');
  const lock=LockService.getScriptLock();
  if(!lock.tryLock(30000))throw new Error('Another visitor operation is being completed. Wait a moment and try again.');
  try{
    const visitor=(p&&p.visitor)||{},authorization=(p&&p.authorization)||{},authorizer=resolveManualVisitAuthorizer_(authorization,session);
    validateRequired_(visitor,['firstName','lastName','phone','company','sponsorName','sponsorEmail','department','reason','startDate','arrivalTime','endDate','departureTime','accessScope','badgeUid']);
    const visitorEmail=String(visitor.email||'').trim(),sponsorEmail=String(visitor.sponsorEmail||'').trim();
    if(visitorEmail&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(visitorEmail))throw new Error('Enter a valid visitor email address or leave it blank.');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sponsorEmail))throw new Error('Enter a valid sponsor email address.');
    const arrival=new Date(String(visitor.startDate)+'T'+String(visitor.arrivalTime)),departure=new Date(String(visitor.endDate)+'T'+String(visitor.departureTime));
    if(isNaN(arrival)||isNaN(departure)||departure<=arrival)throw new Error('Expected departure must be after the arrival date and time.');

    const ss=SpreadsheetApp.getActive(),sheet=ss.getSheetByName(FE.SHEETS.VISITS);if(!sheet)throw new Error('Run setupVista first.');
    const now=new Date(),visitId='VST-'+Utilities.formatDate(now,tz_(),'yyyyMMdd')+'-'+Utilities.getUuid().slice(0,8).toUpperCase(),confirmation='FE-'+Utilities.getUuid().replace(/-/g,'').slice(0,8).toUpperCase();
    const fullName=[visitor.firstName,visitor.middleName,visitor.lastName].filter(Boolean).join(' '),allowUnknown=truthy_(visitor.allowRegisterUnknownBadge);
    const badge=ensureBadgeAvailable_(visitor.badgeUid,visitId,{allowUnknown:allowUnknown,badgeNumber:visitor.badgeNumber||'',session:authorizer.user});
    let photoFileId='',photoFileName='',photoUrl='';
    if(String(visitor.photoDataUrl||'').trim()){const saved=savePhoto_(visitor.photoDataUrl,fullName,visitor.company,visitId);photoFileId=saved.id;photoFileName=saved.name;photoUrl=saved.url;}
    const record={VisitID:visitId,ConfirmationNumber:confirmation,CreatedAt:now,Status:'Approved',FirstName:visitor.firstName,MiddleName:visitor.middleName||'',LastName:visitor.lastName,FullName:fullName,Email:visitorEmail,Phone:visitor.phone,Company:visitor.company,JobTitle:visitor.jobTitle||'',Relationship:visitor.relationship||'Walk-In Visitor',Street:'',City:'',State:'',PostalCode:'',Country:visitor.country||'United States',EmergencyName:'',EmergencyPhone:'',SponsorID:'',SponsorSource:'Manual Security Intake',SponsorName:visitor.sponsorName,SponsorEmail:sponsorEmail,Department:visitor.department,SecondaryContact:'',Reason:visitor.reason,Project:visitor.project||'',VisitorType:visitor.visitorType||'Walk-In',StartDate:visitor.startDate,ArrivalTime:visitor.arrivalTime,EndDate:visitor.endDate,DepartureTime:visitor.departureTime,AccessScope:visitor.accessScope,EscortRequired:visitor.escortRequired||'',LineTour:visitor.lineTour||'No',SpecialItems:visitor.specialItems||'',Driving:visitor.driving||'No',VehicleMake:visitor.vehicleMake||'',VehicleModel:visitor.vehicleModel||'',VehicleYear:visitor.vehicleYear||'',VehicleColor:visitor.vehicleColor||'',LicensePlate:visitor.licensePlate||'',PlateState:visitor.plateState||'',PhotoFileId:photoFileId,PhotoFileName:photoFileName,PhotoUrl:photoUrl,AgreementVersion:config_().AGREEMENT_VERSION||'2026.2',AcknowledgementName:'',AcknowledgementDate:'',AgreementTimestamp:'',AgreementCompletionCount:0,AgreementCompletionStatus:'Manual Override - Not Collected',SessionID:'MANUAL-'+Utilities.getUuid().slice(0,12).toUpperCase(),ClientLanguage:visitor.clientLanguage||'',ClientTimeZone:visitor.clientTimeZone||'',UserAgent:visitor.userAgent||'',ClientTimestamp:visitor.clientTimestamp||'',Referrer:'Security Operations Manual Intake',AgreeSecurity:'No',AgreeBiometric:'No',AgreePrivacy:'No',AgreeSafety:'No',AgreeConduct:'No',AgreeTraining:'No',AgreeRestricted:'No',LastUpdatedAt:now};
    appendObjectRow_(sheet,record,FE.VISIT_HEADERS);
    const authorizationDetails='Authorized by '+String(authorizer.user.FullName||authorizer.user.Username)+' ('+String(authorizer.user.Role)+') via '+authorizer.method;
    logActivity_(visitId,'MANUAL_VISITOR_REGISTERED',session.FullName||session.Username,'',authorizationDetails+' · Confirmation '+confirmation);
    logActivity_(visitId,'MANUAL_OVERRIDE_APPROVED',authorizer.user.FullName||authorizer.user.Username,'',authorizationDetails+' · Agreements not collected');
    auditVisit_(session,'MANUAL_VISITOR_CREATED',visitId,'Success',authorizationDetails);
    auditVisit_(authorizer.user,'MANUAL_VISITOR_OVERRIDE_AUTHORIZED',visitId,'Success','Initiated by '+String(session.FullName||session.Username)+' ('+String(session.Role)+') · '+authorizer.method);
    const checkInPayload={visitId:visitId,badgeUid:visitor.badgeUid,badgeNumber:badge.badgeNumber||visitor.badgeNumber||'',allowRegisterUnknownBadge:false,officerName:session.FullName||session.Username,notes:['Manual walk-in registration',visitor.notes||''].filter(Boolean).join(' · '),idRetained:truthy_(visitor.idRetained),sponsorNotified:truthy_(visitor.sponsorNotified)};
    const checkIn=checkInVisit_(checkInPayload,authorizer.user),savedVisit=findVisitRow_(visitId).obj;
    auditVisit_(session,'MANUAL_VISITOR_CHECK_IN',visitId,'Success','Badge '+String(visitor.badgeUid)+' · '+authorizationDetails+' · Agreements not collected during manual override');
    return{ok:true,visit:publicVisit_(savedVisit),visitId:visitId,confirmationNumber:confirmation,authorizer:publicSessionUser_(authorizer.user),authorizationMethod:authorizer.method,badge:checkIn.badge,sponsorNotification:checkIn.sponsorNotification,message:'Manual visitor record created, authorized, and checked in.'};
  }catch(err){audit_(session,'MANUAL_VISITOR_CHECK_IN','','','Denied',String(err.message||err).slice(0,500));throw err;}
  finally{lock.releaseLock();}
}

function resolveManualVisitAuthorizer_(authorization,session){
  if(permissionsForRole_(session.Role).authorizeManualVisit)return{user:session,method:'CURRENT SESSION'};
  const method=String(authorization.method||'').trim().toUpperCase();let user;
  if(method==='BADGE'){
    validateRequired_(authorization,['badgeUid']);
    user=userForBadge_(normalizeBadgeUid_(authorization.badgeUid));
  }else if(method==='PIN'){
    validateRequired_(authorization,['username','pin']);
    const username=String(authorization.username).trim().toLowerCase(),row=findUserRow_(username);user=row.obj;
    const maxFailures=Math.max(3,Number(config_().AUTH_MAX_FAILED_LOGINS||5)),failures=Number(user.FailedLoginCount||0);
    if(failures>=maxFailures)throw new Error('The authorizing account is locked. Use an authorized badge or contact a VISTA administrator.');
    if(!user.PINHash||String(user.PINHash)!==pinHash_(username,authorization.pin)){
      const next=failures+1;updateObjectRow_(FE.SHEETS.USERS,row.row,{FailedLoginCount:next});audit_(user,'MANUAL_OVERRIDE_PIN','','','Denied','Invalid PIN; failed attempt '+next);
      throw new Error(next>=maxFailures?'The authorizing account was locked after repeated failed attempts.':'Supervisor authorization failed. Verify the username and PIN.');
    }
    updateObjectRow_(FE.SHEETS.USERS,row.row,{FailedLoginCount:0});
  }else throw new Error('A Security Supervisor, Admin, or Super Administrator must authorize this manual visitor check-in.');
  if(!truthyActive_(user.Active))throw new Error('The authorizing VISTA account is disabled.');
  if(!permissionsForRole_(user.Role).authorizeManualVisit)throw new Error('Authorization requires a Security Supervisor, Admin, or Super Administrator account.');
  return{user:user,method:method};
}

function checkInVisit_(p,session) {
  validateRequired_(p,['visitId','badgeUid','officerName']); const row=findVisitRow_(p.visitId), rec=row.obj;
  if(String(rec.Status)!=='Approved')throw new Error('Check-in prohibited: the reservation must be Approved before a badge UID can be assigned.');
  if(String(rec.SponsorSource||'')==='VISTA Sponsor Portal'&&String(rec.AgreementCompletionStatus||'')!=='Completed')throw new Error('Check-in prohibited: the visitor must complete the emailed intake, photograph, safety briefing, and acknowledgements first.');
  if(rec.Status==='Checked In')throw new Error('Visitor is already checked in.'); if(rec.Status==='Checked Out')throw new Error('Visitor is already checked out.');
  const badge=ensureBadgeAvailable_(p.badgeUid,p.visitId,{allowUnknown:Boolean(p.allowRegisterUnknownBadge),badgeNumber:p.badgeNumber||'',session:session}); const now=new Date();
  const notificationRequested=Boolean(p.sponsorNotified);
  updateVisitRow_(row.row,{Status:'Checked In',CheckInTime:now,BadgeUID:p.badgeUid,CheckInOfficer:p.officerName,SponsorNotified:'No',SponsorNotificationStatus:notificationRequested?'Pending':'Not Requested',SponsorNotifiedAt:'',SponsorNotificationEmail:String(rec.SponsorEmail||''),SponsorNotificationError:'',IDRetained:p.idRetained?'Yes':'No',LastUpdatedAt:now});
  assignBadge_(p.badgeUid,p.visitId,now);
  const checkedInVisit=Object.assign({},rec,{Status:'Checked In',CheckInTime:now,BadgeUID:p.badgeUid,CheckInOfficer:p.officerName});
  const sponsorNotification=notifySponsorVisitorArrival_(checkedInVisit,badge,now,p,session);
  updateVisitRow_(row.row,{SponsorNotified:sponsorNotification.sent?'Yes':'No',SponsorNotificationStatus:sponsorNotification.status,SponsorNotifiedAt:sponsorNotification.sent?sponsorNotification.sentAt:'',SponsorNotificationEmail:sponsorNotification.recipient||String(rec.SponsorEmail||''),SponsorNotificationError:sponsorNotification.error||'',LastUpdatedAt:new Date()});
  const checkInDetails=[badge.badgeNumber?'Visitor Badge '+badge.badgeNumber:'',p.notes||'','Sponsor email: '+sponsorNotification.status].filter(Boolean).join(' · ');
  logActivity_(p.visitId,'CHECK_IN',p.officerName,p.badgeUid,checkInDetails);
  if(sponsorNotification.sent)logActivity_(p.visitId,'SPONSOR_ARRIVAL_EMAIL_SENT',p.officerName,p.badgeUid,'Sent to '+sponsorNotification.recipient);
  else if(sponsorNotification.requested)logActivity_(p.visitId,sponsorNotification.status==='Disabled'?'SPONSOR_ARRIVAL_EMAIL_SKIPPED':'SPONSOR_ARRIVAL_EMAIL_FAILED',p.officerName,p.badgeUid,[sponsorNotification.status,sponsorNotification.recipient,sponsorNotification.error].filter(Boolean).join(' · '));
  return {ok:true,badge:badge,sponsorNotification:sponsorNotification};
}
function checkOutVisit_(p) {
  validateRequired_(p,['visitId','badgeUid','officerName']); const row=findVisitRow_(p.visitId), rec=row.obj;
  if(rec.Status!=='Checked In')throw new Error('Visitor is not currently checked in.'); if(normalizeBadgeUid_(rec.BadgeUID)!==normalizeBadgeUid_(p.badgeUid))throw new Error('Returned badge UID does not match the issued badge.');
  const now=new Date(), duration=Math.max(0,Math.round((now-new Date(rec.CheckInTime))/60000));
  updateVisitRow_(row.row,{Status:'Checked Out',CheckOutTime:now,CheckOutOfficer:p.officerName,IDReturned:p.idReturned?'Yes':'No',ActualDurationMinutes:duration,LastUpdatedAt:now});
  const condition=String(p.badgeCondition||'Available'),allowedConditions=['Available','Lost','Broken'];if(!allowedConditions.includes(condition))throw new Error('Select a valid returned-badge condition.');
  returnBadge_(p.badgeUid,now,condition,p.notes||''); logActivity_(p.visitId,'CHECK_OUT',p.officerName,p.badgeUid,['Badge condition '+condition,p.notes||''].filter(Boolean).join(' · ')); return {ok:true,durationMinutes:duration,badgeCondition:condition};
}
function updateVisitStatus_(p) { validateRequired_(p,['visitId','status']); const row=findVisitRow_(p.visitId),now=new Date(),details=[p.status,String(p.notes||'').trim()].filter(Boolean).join(' · ');updateVisitRow_(row.row,{Status:p.status,LastUpdatedAt:now});logActivity_(p.visitId,'STATUS_UPDATED',p.officerName||'Security','',details);return {ok:true}; }
function getVisitPhoto_(p) {
  validateRequired_(p,['visitId']);
  const rec=findVisitRow_(p.visitId).obj;
  try{
    const file=resolveVisitPhotoFile_(rec);
    if(!file)return{ok:true,hasPhoto:false,dataUrl:'',fileName:''};
    const blob=file.getBlob(),mime=blob.getContentType()||'image/jpeg';
    const ext=mime.indexOf('png')>=0?'png':mime.indexOf('webp')>=0?'webp':'jpg';
    const fileName=`${safeFilePart_(rec.FullName)||'Visitor'}-${safeFilePart_(rec.Company)||'Unknown Company'}.${ext}`;
    return{ok:true,hasPhoto:true,dataUrl:`data:${mime};base64,${Utilities.base64Encode(blob.getBytes())}`,fileName:fileName,mimeType:mime,sourceFileName:file.getName()};
  }catch(err){throw new Error('Visitor photograph could not be loaded. Confirm Apps Script can access the configured photo folder and that the record contains a valid PhotoFileId, PhotoUrl, or PhotoFileName.');}
}
function resolveVisitPhotoFile_(rec){
  const fileId=extractDriveFileId_(rec.PhotoFileId||rec.PhotoUrl||'');
  if(fileId)return DriveApp.getFileById(fileId);
  const fileName=String(rec.PhotoFileName||'').trim();
  if(!fileName)return null;
  const cfg=config_(),folder=cfg.PHOTO_FOLDER_ID?DriveApp.getFolderById(cfg.PHOTO_FOLDER_ID):DriveApp.getRootFolder();
  const files=folder.getFilesByName(fileName);
  return files.hasNext()?files.next():null;
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
function notifySponsorVisitorArrival_(visit,badge,checkedInAt,p,session){
  const requested=Boolean(p&&p.sponsorNotified),recipient=String(visit.SponsorEmail||'').trim(),cfg=config_();
  const result={requested:requested,sent:false,status:'Not Requested',recipient:recipient,sentAt:'',error:''};
  if(!requested)return result;
  if(!truthyActive_(cfg.SPONSOR_ARRIVAL_EMAILS)){result.status='Disabled';return result;}
  if(!recipient){result.status='No Sponsor Email';result.error='The visitor request does not contain a sponsor email address.';return result;}
  const location=String(cfg.CHECK_IN_LOCATION||'Main Security Front Desk').trim(),officer=String(p.officerName||session&&session.FullName||session&&session.Username||'Security Operations').trim();
  const badgeLabel=badge&&badge.badgeNumber?'Visitor Badge '+badge.badgeNumber:'Visitor badge';
  const rows=[
    ['Visitor',`${html_(visit.FullName)}<br><span style="color:#667587">${html_(visit.Company)}</span>`],
    ['Arrival location',html_(location)],
    ['Checked in',html_(dateTime_(checkedInAt))],
    ['Badge',`${html_(badgeLabel)}<br><span style="color:#667587">UID ${html_(visit.BadgeUID||'')}</span>`],
    ['Check-in officer',html_(officer)],
    ['Confirmation',`<strong style="color:#003478;font-size:17px">${html_(visit.ConfirmationNumber)}</strong>`]
  ];
  const details=`<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border:1px solid #dce6f0;border-radius:10px;border-collapse:separate;overflow:hidden">${rows.map((x,i)=>`<tr><td width="34%" valign="top" style="padding:11px 13px;background:${i%2===0?'#f6f9fc':'#ffffff'};border-bottom:${i===rows.length-1?'0':'1px solid #e2eaf2'};font-size:12px;line-height:18px;text-transform:uppercase;letter-spacing:.55px;font-weight:bold;color:#667587">${x[0]}</td><td valign="top" style="padding:11px 13px;background:${i%2===0?'#f6f9fc':'#ffffff'};border-bottom:${i===rows.length-1?'0':'1px solid #e2eaf2'};font-size:14px;line-height:20px;color:#16283d">${x[1]}</td></tr>`).join('')}</table>`;
  const body=`<p style="margin:0 0 16px">Hello ${html_(visit.SponsorName||'Sponsor')},</p><p style="margin:0 0 20px">Your guest <strong>${html_(visit.FullName)}</strong> has arrived and checked in at the ${html_(location)}.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 20px"><tr><td style="padding:14px 16px;background:#e7f5ee;border-left:5px solid #1f8f57;border-radius:7px"><strong style="color:#17663f">Guest status:</strong> Checked In · Please meet or receive your guest according to site escort requirements.</td></tr></table>${details}${emailButton_(cfg.SPONSOR_PORTAL_URL||'https://kyblueoval.github.io/Ford-Energy-VISTA/sponsor-portal/','Open My Sponsor Workspace')}<p style="margin:20px 0 0;color:#516477">If you are no longer the appropriate sponsor for this visit, contact the Main Security Front Desk.</p>`;
  const textBody=`Hello ${visit.SponsorName||'Sponsor'},\n\nYour guest ${visit.FullName} has arrived and checked in at the ${location}.\n\nChecked in: ${dateTime_(checkedInAt)}\nBadge: ${badgeLabel} (${visit.BadgeUID||'UID not available'})\nConfirmation: ${visit.ConfirmationNumber||''}\nCheck-in officer: ${officer}\n\nPlease meet or receive your guest according to site escort requirements.`;
  try{
    MailApp.sendEmail({to:recipient,subject:`Your guest has arrived: ${visit.FullName} (${visit.ConfirmationNumber})`,body:textBody,htmlBody:brandedEmail_({title:'Your Guest Has Arrived',kicker:'FORD ENERGY · VISTA SECURITY OPERATIONS',preheader:`${visit.FullName} checked in at ${location}`,body:body,footerNote:'This arrival notification and its delivery status are retained in the VISTA audit record.'})});
    result.sent=true;result.status='Sent';result.sentAt=new Date();return result;
  }catch(err){
    result.status='Failed';result.error=String(err&&err.message||err||'Unknown email delivery error').replace(/\s+/g,' ').slice(0,500);return result;
  }
}

function notifyVisitorSponsorDecision_(visit,status,notes,session){
  const recipient=String(visit.Email||'').trim(),result={requested:Boolean(recipient),sent:false,status:recipient?'Pending':'No Visitor Email',recipient:recipient,error:''};
  if(!recipient){result.error='The visitor request does not contain a visitor email address.';return result;}
  const approved=String(status)==='Approved',cancelled=String(status)==='Cancelled',decision=approved?'Approved':cancelled?'Cancelled':'Denied';
  const color=approved?'#17663f':cancelled?'#8a4b00':'#a42318',background=approved?'#e7f5ee':cancelled?'#fff4dc':'#fdeceb';
  const summary=approved?'Your sponsor approved this visitor request. Approval does not replace identity verification or Security check-in requirements.':cancelled?'This visitor request has been cancelled and is no longer valid for arrival.':'Your sponsor did not approve this visitor request. Do not travel to the site using this confirmation.';
  const note=String(notes||'').trim();
  const body=`<p style="margin:0 0 16px">Hello ${html_(visit.FullName||'Visitor')},</p><p style="margin:0 0 20px">The sponsor review for your Ford Energy visitor request is complete.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 20px"><tr><td style="padding:14px 16px;background:${background};border-left:5px solid ${color};border-radius:7px"><strong style="color:${color}">Decision: ${decision}</strong><br>${html_(summary)}</td></tr></table>${emailDetailsTable_(visit,`${dateOnly_(visit.StartDate)} ${timeOnly_(visit.ArrivalTime)} through ${dateOnly_(visit.EndDate)} ${timeOnly_(visit.DepartureTime)}`,[visit.VehicleYear,visit.VehicleMake,visit.VehicleModel,visit.LicensePlate].filter(Boolean).join(' ')||'Not provided')}${note?`<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:18px"><tr><td style="padding:13px 15px;background:#f3f8fd;border-radius:8px"><strong>Sponsor note</strong><br>${html_(note)}</td></tr></table>`:''}${approved?emailButton_(config_().VGS_NAVIGATION_URL,'Open Visitor Navigation'):''}`;
  const textBody=`Hello ${visit.FullName||'Visitor'},\n\nDecision: ${decision}\n${summary}\n\nConfirmation: ${visit.ConfirmationNumber||''}\nVisit: ${dateOnly_(visit.StartDate)} ${timeOnly_(visit.ArrivalTime)}\nSponsor: ${visit.SponsorName||session.FullName||session.Username||''}${note?'\nSponsor note: '+note:''}`;
  try{MailApp.sendEmail({to:recipient,subject:`Visitor request ${visit.ConfirmationNumber}: ${decision}`,body:textBody,htmlBody:brandedEmail_({title:`Visitor Request ${decision}`,kicker:'FORD ENERGY · VISTA SPONSOR REVIEW',preheader:`${visit.ConfirmationNumber} is ${decision.toLowerCase()}`,body:body,footerNote:'The sponsor decision and delivery outcome are retained in the VISTA audit record.'})});result.sent=true;result.status='Sent';return result}catch(err){result.status='Failed';result.error=String(err&&err.message||err||'Unknown email delivery error').replace(/\s+/g,' ').slice(0,500);return result;}
}
function evEmailDetails_(r){
  const rows=[['Employee',html_(r.FullName)],['CDSID',html_(r.CDSID)],['Department',html_(r.Department)],['Vehicle',html_([r.VehicleMake,r.VehicleModel].filter(Boolean).join(' '))],['License plate',html_([r.LicensePlate,r.PlateState].filter(Boolean).join(' · '))],['Policy version',html_(r.PolicyVersion)],['Confirmation',`<strong style="color:#003478;font-size:17px">${html_(r.ConfirmationNumber)}</strong>`]];
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border:1px solid #dce6f0;border-radius:10px;border-collapse:separate;overflow:hidden">${rows.map((x,i)=>`<tr><td width="34%" valign="top" style="padding:11px 13px;background:${i%2===0?'#f6f9fc':'#ffffff'};border-bottom:${i===rows.length-1?'0':'1px solid #e2eaf2'};font-size:12px;line-height:18px;text-transform:uppercase;letter-spacing:.55px;font-weight:bold;color:#667587">${x[0]}</td><td valign="top" style="padding:11px 13px;background:${i%2===0?'#f6f9fc':'#ffffff'};border-bottom:${i===rows.length-1?'0':'1px solid #e2eaf2'};font-size:14px;line-height:20px;color:#16283d">${x[1]}</td></tr>`).join('')}</table>`;
}
function notifyEVChargingSubmission_(r,rawToken){
  const cfg=config_(),base=String(cfg.EV_CHARGING_REQUEST_URL||'https://kyblueoval.github.io/Ford-Energy-VISTA/ev-charging-request/'),reviewUrl=base+(base.includes('?')?'&':'?')+'review='+encodeURIComponent(rawToken),details=evEmailDetails_(r),result={employeeSent:false,managerSent:false,operationsSent:false,operationsConfigured:Boolean(cfg.EV_NOTIFICATION_EMAIL),errors:[]};
  try{
    const body=`<p style="margin:0 0 16px">Hello ${html_(r.FullName)},</p><p style="margin:0 0 20px">Your Ford Energy BlueOval onsite EV charging access request has been received and sent to ${html_(r.ManagerName)} for approval.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 20px"><tr><td style="padding:14px 16px;background:#fff4dc;border-left:5px solid #ff7a00;border-radius:7px"><strong style="color:#684300">Current status:</strong> Pending Manager Approval</td></tr></table>${details}<p style="margin:20px 0 0">Keep confirmation number <strong style="color:#003478">${html_(r.ConfirmationNumber)}</strong>. Approval does not reserve a charger or grant access to restricted areas.</p>`;
    MailApp.sendEmail({to:r.Email,subject:`EV charging access request ${r.ConfirmationNumber} received`,htmlBody:brandedEmail_({title:'EV Charging Request Received',kicker:'FORD ENERGY · BLUEOVAL GLENDALE',preheader:`Request ${r.ConfirmationNumber} is pending manager approval`,body:body,footerNote:'This message was generated by the Ford Energy VISTA EV Charging Access workflow.'})});
    result.employeeSent=true;
  }catch(err){result.errors.push('Employee email: '+String(err.message||err));}
  try{
    const body=`<p style="margin:0 0 16px">Hello ${html_(r.ManagerName)},</p><p style="margin:0 0 20px">${html_(r.FullName)} identified you as their manager and requested onsite EV charging access for the vehicle below.</p>${details}<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:20px"><tr><td style="padding:14px 16px;background:#fff4dc;border-left:5px solid #ff7a00;border-radius:7px;color:#684300"><strong>Action required:</strong> Review the employee and vehicle information, confirm your manager CDSID, and approve or deny the request. This secure link expires on ${html_(dateOnly_(r.ManagerReviewExpiresAt))}.</td></tr></table>${emailButton_(reviewUrl,'Review EV Charging Request')}`;
    MailApp.sendEmail({to:r.ManagerEmail,subject:`Manager approval required: EV charging request ${r.ConfirmationNumber}`,htmlBody:brandedEmail_({title:'Manager Approval Required',kicker:'FORD ENERGY · BLUEOVAL GLENDALE',preheader:`Review EV charging request ${r.ConfirmationNumber} for ${r.FullName}`,body:body,footerNote:'Use the secure review link only if you are the manager identified in this request.'})});
    result.managerSent=true;
  }catch(err){result.errors.push('Manager email: '+String(err.message||err));}
  try{
    if(cfg.EV_NOTIFICATION_EMAIL){
      const body=`<p style="margin:0 0 20px">A new employee EV charging access request is pending manager approval.</p>${details}`;
      MailApp.sendEmail({to:cfg.EV_NOTIFICATION_EMAIL,subject:`Pending EV charging request ${r.ConfirmationNumber}: ${r.FullName}`,htmlBody:brandedEmail_({title:'New EV Charging Access Request',kicker:'FORD ENERGY · VISTA',preheader:`New request ${r.ConfirmationNumber}`,body:body})});
      result.operationsSent=true;
    }
  }catch(err){result.errors.push('Operations email: '+String(err.message||err));}
  if(result.errors.length)console.log('VISTA EV request notification errors: '+result.errors.join(' | '));
  return result;
}
function notifyEVChargingDecision_(r){
  const cfg=config_(),approved=String(r.ManagerDecision)==='Approved',details=evEmailDetails_(r),result={employeeSent:false,operationsSent:false,operationsConfigured:Boolean(cfg.EV_NOTIFICATION_EMAIL),errors:[]},statusColor=approved?'#18864b':'#b42318',statusBg=approved?'#dcfae6':'#fee4e2';
  try{
    const decisionBy=String(r.ManagerDecisionBy||r.ManagerName||'VISTA Administration'),decisionLabel=String(r.DecisionSource||'Manager Review');
    const body=`<p style="margin:0 0 16px">Hello ${html_(r.FullName)},</p><p style="margin:0 0 20px">Your Ford Energy BlueOval onsite EV charging access request has been <strong>${html_(String(r.ManagerDecision).toLowerCase())}</strong> by ${html_(decisionBy)}.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 20px"><tr><td style="padding:14px 16px;background:${statusBg};border-left:5px solid ${statusColor};border-radius:7px;color:${statusColor};font-size:17px;font-weight:bold">${html_(r.ManagerDecision)} · ${html_(decisionLabel)}</td></tr></table>${details}${r.ManagerComments?`<p style="margin:18px 0 0"><strong>Decision comments:</strong><br>${html_(r.ManagerComments)}</p>`:''}${approved?'<p style="margin:18px 0 0">Follow posted charging-space rules and site direction. Approval does not guarantee charger availability.</p>':''}`;
    MailApp.sendEmail({to:r.Email,subject:`EV charging request ${r.ConfirmationNumber}: ${r.ManagerDecision}`,htmlBody:brandedEmail_({title:'EV Charging Request '+r.ManagerDecision,kicker:'FORD ENERGY · BLUEOVAL GLENDALE',preheader:`Request ${r.ConfirmationNumber} was ${String(r.ManagerDecision).toLowerCase()}`,body:body,footerNote:'This decision and its timestamp are retained in the VISTA audit record.'})});
    result.employeeSent=true;
  }catch(err){result.errors.push('Employee decision email: '+String(err.message||err));}
  try{
    if(cfg.EV_NOTIFICATION_EMAIL){
      const body=`<p style="margin:0 0 20px">${html_(r.ManagerDecisionBy||r.ManagerName)} ${html_(String(r.ManagerDecision).toLowerCase())} this EV charging access request through ${html_(r.DecisionSource||'Manager Review')}.</p>${details}`;
      MailApp.sendEmail({to:cfg.EV_NOTIFICATION_EMAIL,subject:`EV charging request ${r.ConfirmationNumber}: ${r.ManagerDecision}`,htmlBody:brandedEmail_({title:'EV Charging Decision Recorded',body:body})});
      result.operationsSent=true;
    }
  }catch(err){result.errors.push('Operations decision email: '+String(err.message||err));}
  if(result.errors.length)console.log('VISTA EV decision notification errors: '+result.errors.join(' | '));
  return result;
}
function notifySubmission_(r,visitorIntakeToken){
  const cfg=config_(),reviewUrl=cfg.SPONSOR_PORTAL_URL||'https://kyblueoval.github.io/Ford-Energy-VISTA/sponsor-portal/',securityUrl=cfg.SECURITY_CONSOLE_URL||'',sponsorCreated=String(r.SponsorSource||'')==='VISTA Sponsor Portal',intakeUrl=sponsorCreated&&visitorIntakeToken?(cfg.PUBLIC_REGISTRATION_URL||'https://kyblueoval.github.io/Ford-Energy-VISTA/public-registration/')+'?invitation='+encodeURIComponent(visitorIntakeToken):'',result={sponsorSent:false,visitorSent:false,securitySent:false,securityConfigured:Boolean(cfg.NOTIFICATION_EMAIL),errors:[]};
  const visitPeriod=[r.StartDate,r.ArrivalTime].filter(Boolean).join(' ')+' through '+[r.EndDate,r.DepartureTime].filter(Boolean).join(' ');
  const vehicle=r.Driving==='Yes'?[r.VehicleYear,r.VehicleMake,r.VehicleModel,r.VehicleColor,r.LicensePlate,r.PlateState].filter(Boolean).join(' '):'Not driving';
  const details=emailDetailsTable_(r,visitPeriod,vehicle);
  try{
    if(r.SponsorEmail){
      const sponsorIntro=sponsorCreated?'A visitor request was created through the VISTA Sponsor Portal and assigned to you.':'A visitor identified you as the Ford Energy sponsor for the request below.';
      const sponsorBody=`<p style="margin:0 0 16px">Hello ${html_(r.SponsorName)},</p><p style="margin:0 0 20px">${html_(sponsorIntro)} Please review the visit details and coordinate with Security Operations.</p>${details}<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:20px"><tr><td style="padding:14px 16px;background:#fff4dc;border-left:5px solid #ff7a00;border-radius:7px;color:#684300;font-size:14px;line-height:20px"><strong>Action required:</strong> Submission does not authorize site access. Sponsor and Security review must be completed before check-in.</td></tr></table>${emailButton_(reviewUrl,'Review Visitor Request')}`;
      MailApp.sendEmail({to:r.SponsorEmail,subject:`Action requested: Visitor request ${r.ConfirmationNumber} for ${r.FullName}`,htmlBody:brandedEmail_({title:'Sponsor Approval Required',kicker:'FORD ENERGY · VISTA',preheader:`Review visitor request ${r.ConfirmationNumber} for ${r.FullName}`,body:sponsorBody})});
      result.sponsorSent=true;
    }
  }catch(err){result.errors.push('Sponsor email: '+String(err.message||err));}
  try{
    if(cfg.NOTIFICATION_EMAIL){
      const securityBody=`<p style="margin:0 0 20px">A new visitor registration has been submitted and is ready for review.</p>${details}${emailButton_(securityUrl,'Open VISTA Security Console')}`;
      MailApp.sendEmail({to:cfg.NOTIFICATION_EMAIL,subject:`VISTA visitor request ${r.ConfirmationNumber}: ${r.FullName}`,htmlBody:brandedEmail_({title:'New Visitor Registration',preheader:`New VISTA request ${r.ConfirmationNumber}`,body:securityBody})});
      result.securitySent=true;
    }
  }catch(err){result.errors.push('Security email: '+String(err.message||err));}
  try{
    if(r.Email){
      const arrival=html_(cfg.ARRIVAL_INSTRUCTIONS||'Proceed to the Main Security Building and bring a valid government-issued photo ID.');
      const parking=html_(cfg.PARKING_INSTRUCTIONS||'Use designated visitor parking.');
      const sourceNotice=sponsorCreated?'Your Ford Energy sponsor created this visitor request on your behalf. Visitor policy acknowledgement and Security verification are still required.':'Your Ford Energy visitor registration has been received.';
      const intakeCallout=intakeUrl?`<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:20px 0"><tr><td style="padding:15px 17px;background:#fff4dc;border-left:5px solid #ff7a00;border-radius:8px;font-size:14px;line-height:21px"><strong style="color:#684300">Required before arrival</strong><br>Complete your visitor profile, photograph, vehicle details, safety video, and all seven acknowledgements. This secure link updates the request your sponsor already created.</td></tr></table>${emailButton_(intakeUrl,'Complete Required Visitor Intake')}`:'';
      const visitorBody=`<p style="margin:0 0 16px">Hello ${html_(r.FullName)},</p><p style="margin:0 0 20px">${html_(sourceNotice)} Your request is currently pending sponsor and Security review.</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 20px"><tr><td style="padding:14px 16px;background:#eaf4ff;border-left:5px solid #0b67ad;border-radius:7px"><div style="font-size:12px;text-transform:uppercase;letter-spacing:.7px;font-weight:bold;color:#326288">Current status</div><div style="font-size:17px;line-height:24px;font-weight:bold;color:#003478;margin-top:3px">Submitted · Pending Review</div></td></tr></table>${details}${intakeCallout}<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:20px"><tr><td style="padding:15px 17px;background:#f3f8fd;border:1px solid #d7e6f3;border-radius:8px;font-size:14px;line-height:21px"><strong style="color:#003478">Arrival reminder</strong><br>${arrival}<br>${parking}</td></tr></table>${emailButton_(cfg.VGS_NAVIGATION_URL,'Open Visitor Navigation')}<p style="margin:20px 0 0">Keep confirmation number <strong style="color:#003478">${html_(r.ConfirmationNumber)}</strong> available for check-in.</p>`;
      MailApp.sendEmail({to:r.Email,subject:intakeUrl?`Action required: Complete visitor intake ${r.ConfirmationNumber}`:`Ford Energy visitor registration ${r.ConfirmationNumber}`,htmlBody:brandedEmail_({title:intakeUrl?'Complete Your Visitor Intake':'Registration Received',preheader:intakeUrl?`Complete required visitor intake for ${r.ConfirmationNumber}`:`Your Ford Energy visitor request ${r.ConfirmationNumber} was received`,body:visitorBody})});
      result.visitorSent=true;
    }
  }catch(err){result.errors.push('Visitor email: '+String(err.message||err));}
  if(result.errors.length)console.log('VISTA notification errors: '+result.errors.join(' | '));
  return result;
}
function ensureBadgeAvailable_(uid,visitId,options){const normalized=normalizeBadgeUid_(uid),opts=options||{},s=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.BADGES),rows=readObjects_(FE.SHEETS.BADGES),b=rows.find(x=>normalizeBadgeUid_(x.BadgeUID)===normalized);if(b&&String(b.Status)==='Issued'&&String(b.CurrentVisitID)!==String(visitId))throw new Error('Badge is already issued to another visitor.');if(b&&['Lost','Broken','Disabled'].includes(String(b.Status)))throw new Error('Badge '+(b.BadgeNumber||b.BadgeUID)+' is '+String(b.Status).toLowerCase()+' and cannot be issued.');if(!b){if(!opts.allowUnknown||!opts.session||!permissionsForRole_(opts.session.Role).registerUnknownBadge)throw new Error('This badge UID is not registered in VISTA. Ask a Security Supervisor or Administrator to register it before check-in.');const number=String(opts.badgeNumber||'').trim();if(!number)throw new Error('A visitor badge number is required when registering an unknown UID.');const duplicate=rows.find(x=>String(x.BadgeNumber||'').trim().toLowerCase()===number.toLowerCase());if(duplicate)throw new Error('Visitor Badge '+number+' is already assigned to another UID.');s.appendRow([uid,number,'Available','','','','Registered during supervised check-in']);audit_(opts.session,'BADGE_REGISTERED_AT_CHECK_IN',visitId,'','Success','Visitor Badge '+number+' · '+uid);return{badgeUid:String(uid),badgeNumber:number,status:'Available',registeredNow:true};}return publicBadge_(b);}
function assignBadge_(uid,visitId,now){upsertBadge_(uid,{Status:'Issued',CurrentVisitID:visitId,IssuedAt:now,ReturnedAt:''})}
function returnBadge_(uid,now,condition,notes){upsertBadge_(uid,{Status:condition||'Available',CurrentVisitID:'',ReturnedAt:now,Notes:String(notes||'')})}
function upsertBadge_(uid,updates){const s=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.BADGES),data=s.getDataRange().getValues(),headers=data[0],idx=headers.indexOf('BadgeUID'),normalized=normalizeBadgeUid_(uid);let row=-1;for(let i=1;i<data.length;i++)if(normalizeBadgeUid_(data[i][idx])===normalized){row=i+1;break}if(row<0){s.appendRow(FE.BADGE_HEADERS.map(h=>h==='BadgeUID'?uid:(updates[h]??'')));return}Object.entries(updates).forEach(([k,v])=>{const c=headers.indexOf(k);if(c>=0)s.getRange(row,c+1).setValue(v)})}
function publicBadge_(b){return{badgeUid:String(b.BadgeUID||''),badgeNumber:String(b.BadgeNumber||''),status:String(b.Status||'Available'),currentVisitId:String(b.CurrentVisitID||''),issuedAt:dateText_(b.IssuedAt),returnedAt:dateText_(b.ReturnedAt),notes:String(b.Notes||'')};}
function findBadgeRow_(uid){const normalized=normalizeBadgeUid_(uid),s=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.BADGES),data=s.getDataRange().getValues(),h=data[0],idx=h.indexOf('BadgeUID');for(let i=1;i<data.length;i++)if(normalizeBadgeUid_(data[i][idx])===normalized)return{row:i+1,obj:h.reduce((o,k,j)=>(o[k]=data[i][j],o),{})};throw new Error('Badge inventory record not found.');}
function listVistaBadges_(p){const query=String(p.query||'').trim().toLowerCase(),status=String(p.status||'').trim().toLowerCase();let badges=readObjects_(FE.SHEETS.BADGES).map(publicBadge_);if(query)badges=badges.filter(b=>[b.badgeUid,b.badgeNumber,b.status,b.currentVisitId,b.notes].join(' ').toLowerCase().includes(query));if(status)badges=badges.filter(b=>b.status.toLowerCase()===status);badges.sort((a,b)=>(a.badgeNumber||a.badgeUid).localeCompare(b.badgeNumber||b.badgeUid,undefined,{numeric:true}));return{ok:true,badges:badges,summary:{total:badges.length,available:badges.filter(b=>b.status==='Available').length,issued:badges.filter(b=>b.status==='Issued').length,unavailable:badges.filter(b=>['Lost','Broken','Disabled'].includes(b.status)).length}};}
function saveVistaBadge_(p,session){validateRequired_(p,['badgeUid','badgeNumber']);const uid=String(p.badgeUid).trim(),number=String(p.badgeNumber).trim(),normalized=normalizeBadgeUid_(uid),allowed=['Available','Lost','Broken','Disabled'];if(!normalized)throw new Error('Enter a valid badge UID.');const rows=readObjects_(FE.SHEETS.BADGES),existing=rows.find(b=>normalizeBadgeUid_(b.BadgeUID)===normalized),duplicateNumber=rows.find(b=>String(b.BadgeNumber||'').trim().toLowerCase()===number.toLowerCase()&&normalizeBadgeUid_(b.BadgeUID)!==normalized);if(duplicateNumber)throw new Error('Badge number '+number+' is already assigned to another UID.');if(existing&&String(existing.Status)==='Issued')throw new Error('An issued badge cannot be edited until it is returned.');const status=String(p.status||(existing&&existing.Status)||'Available');if(!allowed.includes(status))throw new Error('Select Available, Lost, Broken, or Disabled.');upsertBadge_(existing?existing.BadgeUID:uid,{BadgeNumber:number,Status:status,CurrentVisitID:'',Notes:String(p.notes||''),IssuedAt:existing?existing.IssuedAt||'':'',ReturnedAt:existing?existing.ReturnedAt||'':''});audit_(session,existing?'ADMIN_BADGE_UPDATED':'ADMIN_BADGE_CREATED','','','Success','Badge '+number+' · '+uid+' · '+status);return{ok:true,message:existing?'Badge updated.':'Badge added.',badge:publicBadge_({BadgeUID:uid,BadgeNumber:number,Status:status,Notes:p.notes||''})};}
function setVistaBadgeStatus_(p,session){validateRequired_(p,['badgeUid','status']);const status=String(p.status),allowed=['Available','Lost','Broken','Disabled'];if(!allowed.includes(status))throw new Error('Select Available, Lost, Broken, or Disabled.');const found=findBadgeRow_(p.badgeUid);if(String(found.obj.Status)==='Issued')throw new Error('An issued badge must be returned through Security Operations before its status can change.');updateObjectRow_(FE.SHEETS.BADGES,found.row,{Status:status,CurrentVisitID:'',Notes:String(p.notes||found.obj.Notes||'')});audit_(session,'ADMIN_BADGE_STATUS','','','Success','Badge '+(found.obj.BadgeNumber||found.obj.BadgeUID)+' → '+status);return{ok:true,message:'Badge status updated.'};}
function logActivity_(visitId,type,by,badge,details){SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.ACTIVITY).appendRow(['ACT-'+Utilities.getUuid().slice(0,12).toUpperCase(),visitId,type,new Date(),by||'',badge||'',details||''])}
function findVisitRow_(visitId){const s=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.VISITS),data=s.getDataRange().getValues(),h=data[0],idx=h.indexOf('VisitID');for(let i=1;i<data.length;i++)if(String(data[i][idx])===String(visitId))return{row:i+1,obj:h.reduce((o,k,j)=>(o[k]=data[i][j],o),{})};throw new Error('Visit record not found.')}
function updateVisitRow_(row,updates){const s=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.VISITS),h=s.getRange(1,1,1,s.getLastColumn()).getValues()[0];Object.entries(updates).forEach(([k,v])=>{const c=h.indexOf(k);if(c>=0)s.getRange(row,c+1).setValue(v)})}
function badgeNumberForUid_(uid){
  const wanted=normalizeBadgeUid_(uid);if(!wanted)return'';
  const badge=readObjects_(FE.SHEETS.BADGES).find(x=>normalizeBadgeUid_(x.BadgeUID)===wanted);
  return badge?String(badge.BadgeNumber||'').trim():'';
}
function publicVisit_(r){
  const photoFileId=String(r.PhotoFileId||'').trim();
  const photoFileName=String(r.PhotoFileName||'').trim();
  const photoUrl=String(r.PhotoUrl||'').trim();
  return{visitId:String(r.VisitID||''),confirmationNumber:String(r.ConfirmationNumber||''),fullName:String(r.FullName||''),email:String(r.Email||''),phone:String(r.Phone||''),company:String(r.Company||''),sponsorName:String(r.SponsorName||''),sponsorEmail:String(r.SponsorEmail||''),department:String(r.Department||''),reason:String(r.Reason||''),project:String(r.Project||''),visitorType:String(r.VisitorType||''),startDate:dateOnly_(r.StartDate),arrivalTime:timeOnly_(r.ArrivalTime),endDate:dateOnly_(r.EndDate),departureTime:timeOnly_(r.DepartureTime),accessScope:String(r.AccessScope||''),escortRequired:String(r.EscortRequired||''),lineTour:String(r.LineTour||''),specialItems:String(r.SpecialItems||''),driving:String(r.Driving||''),vehicleMake:String(r.VehicleMake||''),vehicleModel:String(r.VehicleModel||''),vehicleYear:String(r.VehicleYear||''),vehicleColor:String(r.VehicleColor||''),licensePlate:String(r.LicensePlate||''),plateState:String(r.PlateState||''),hasPhoto:Boolean(photoFileId||photoFileName||photoUrl),photoFileId,photoFileName,photoUrl,status:String(r.Status||''),agreementCompletionStatus:String(r.AgreementCompletionStatus||''),agreementCompletionCount:String(r.AgreementCompletionCount||''),visitorIntakeStatus:String(r.VisitorIntakeStatus||''),visitorIntakeCompletedAt:dateText_(r.VisitorIntakeCompletedAt),checkInTime:dateTime_(r.CheckInTime),checkOutTime:dateTime_(r.CheckOutTime),badgeUid:String(r.BadgeUID||''),badgeNumber:badgeNumberForUid_(r.BadgeUID),actualDurationMinutes:r.ActualDurationMinutes||''}
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

function setupVista(){
  const result=setupVisitorManagement();
  syncRosterUsers_();
  applyVista20ASecurityDefaults();
  return result+' Existing Config values were preserved. Review sponsor reminder/escalation, delegation, EV, Facilities email, and domain-enforcement Config values, then deploy a new web-app version.';
}

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
function unlockVistaUserAccount(username){
  const row=findUserRow_(String(username||'').trim().toLowerCase());
  updateObjectRow_(FE.SHEETS.USERS,row.row,{FailedLoginCount:0});
  audit_({UserID:'SYSTEM',Username:'APPS_SCRIPT_RECOVERY',Role:'System Recovery'},'ACCOUNT_UNLOCK','','','Success',String(row.obj.Username||username));
  return 'Account lock cleared for '+row.obj.Username+'. The existing PIN was not changed.';
}
function recoverSgrosse4Account(){return unlockVistaUserAccount('sgrosse4');}
function resetVistaUserPinAndUnlock(username,pin){
  const result=setVistaUserPin(username,pin);
  audit_({UserID:'SYSTEM',Username:'APPS_SCRIPT_RECOVERY',Role:'System Recovery'},'ACCOUNT_PIN_RESET_UNLOCK','','','Success',String(username||''));
  return result+' Account lock cleared.';
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
  let user;
  try{
    user=String(s.UserID||'').trim()?findUserById_(String(s.UserID).trim()).obj:findUserRow_(s.Username).obj;
  }catch(err){
    user=findUserRow_(s.Username).obj;
  }
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
  const none={viewVisits:false,viewPhoto:false,approve:false,deny:false,checkIn:false,checkOut:false,noShow:false,admin:false,manageUsers:false,manageConfig:false,viewAudit:false,viewAnalytics:false,viewBadges:false,manageBadges:false,registerUnknownBadge:false,reportIncident:false,manageIncidents:false,manualVisitIntake:false,authorizeManualVisit:false,sponsorPortal:false};
  if(r==='admin'||r==='super administrator'||r==='superadmin')return {viewVisits:true,viewPhoto:true,approve:true,deny:true,checkIn:true,checkOut:true,noShow:true,admin:true,manageUsers:true,manageConfig:true,viewAudit:true,viewAnalytics:true,viewBadges:true,manageBadges:true,registerUnknownBadge:true,reportIncident:true,manageIncidents:true,manualVisitIntake:true,authorizeManualVisit:true,sponsorPortal:true};
  if(r==='security supervisor')return {viewVisits:true,viewPhoto:true,approve:true,deny:true,checkIn:true,checkOut:true,noShow:true,admin:false,manageUsers:false,manageConfig:false,viewAudit:true,viewAnalytics:true,viewBadges:true,manageBadges:false,registerUnknownBadge:true,reportIncident:true,manageIncidents:true,manualVisitIntake:true,authorizeManualVisit:true,sponsorPortal:false};
  if(r==='security')return {viewVisits:true,viewPhoto:true,approve:false,deny:false,checkIn:true,checkOut:true,noShow:true,admin:false,manageUsers:false,manageConfig:false,viewAudit:true,viewAnalytics:false,viewBadges:true,manageBadges:false,registerUnknownBadge:false,reportIncident:true,manageIncidents:false,manualVisitIntake:false,authorizeManualVisit:false,sponsorPortal:false};
  if(r==='frontdesk')return {viewVisits:true,viewPhoto:true,approve:false,deny:false,checkIn:true,checkOut:true,noShow:true,admin:false,manageUsers:false,manageConfig:false,viewAudit:false,viewAnalytics:false,viewBadges:true,manageBadges:false,registerUnknownBadge:false,reportIncident:true,manageIncidents:false,manualVisitIntake:true,authorizeManualVisit:false,sponsorPortal:false};
  if(r==='sponsor'||r==='approver')return {viewVisits:true,viewPhoto:true,approve:true,deny:true,checkIn:false,checkOut:false,noShow:false,admin:false,manageUsers:false,manageConfig:false,viewAudit:false,viewAnalytics:false,viewBadges:false,manageBadges:false,registerUnknownBadge:false,reportIncident:false,manageIncidents:false,manualVisitIntake:false,authorizeManualVisit:false,sponsorPortal:true};
  return none;
}
function requirePermission_(session,key){if(!permissionsForRole_(session.Role)[key])throw new Error('Your '+session.Role+' role is not authorized to perform this action.');}
function publicSessionUser_(u){return{userId:String(u.UserID||''),employeeId:String(u.EmployeeID||''),fullName:String(u.FullName||u.Username||''),email:String(u.Email||''),department:String(u.Department||''),username:String(u.Username||''),role:String(u.Role||''),photoFileId:String(u.UserPhotoFileId||''),photoFileName:String(u.UserPhotoFileName||''),photoUrl:String(u.UserPhotoUrl||'')};}
function sponsorRole_(session){const role=String(session&&session.Role||'').trim().toLowerCase();return role==='sponsor'||role==='approver';}
function sponsorOversightRole_(session){const role=String(session&&session.Role||'').trim().toLowerCase();return role==='admin'||role==='super administrator'||role==='superadmin';}
function sponsorIdentityMatchesVisit_(visit,user){const email=String(user&&user.Email||'').trim().toLowerCase(),sponsorEmail=String(visit&&visit.SponsorEmail||'').trim().toLowerCase(),ids=[user&&user.EmployeeID,user&&user.Username].map(normalizeCDSID_).filter(Boolean),sponsorId=normalizeCDSID_(visit&&visit.SponsorID);return Boolean((email&&email===sponsorEmail)||(sponsorId&&ids.includes(sponsorId)));}
function activeSponsorDelegations_(now){const at=now||new Date();return readObjects_(FE.SHEETS.SPONSOR_DELEGATIONS).filter(r=>String(r.Status||'Active')==='Active').filter(r=>{const start=parseDateSafe_(r.StartAt),end=parseDateSafe_(r.EndAt);return start&&end&&start<=at&&end>=at;});}
function sponsorVisitAccess_(visit,session,delegations){
  if(sponsorOversightRole_(session))return{allowed:true,type:'Administrative Oversight',delegatedFrom:String(visit.SponsorName||visit.SponsorEmail||'Unassigned sponsor')};
  if(sponsorIdentityMatchesVisit_(visit,session))return{allowed:true,type:'Direct',delegatedFrom:''};
  const rows=delegations||activeSponsorDelegations_(new Date()),userId=String(session&&session.UserID||''),match=rows.find(r=>String(r.DelegateUserID||'')===userId&&sponsorIdentityMatchesVisit_(visit,{Email:r.SponsorEmail,EmployeeID:r.SponsorEmployeeID,Username:r.SponsorUsername}));
  return match?{allowed:true,type:'Delegated',delegatedFrom:String(match.SponsorName||match.SponsorEmail||'Sponsor'),delegationId:String(match.DelegationID||'')}:{allowed:false,type:'None',delegatedFrom:''};
}
function sponsorOwnsVisit_(visit,session){return sponsorVisitAccess_(visit,session).allowed;}
function requireSponsorOwnedVisit_(visitId,session){const row=findVisitRow_(visitId);if(!sponsorOwnsVisit_(row.obj,session))throw new Error('You may only access visitor requests assigned to your sponsor identity.');return row;}
function sponsorVisits_(p,session){const query=String(p&&p.query||'').trim().toLowerCase(),status=String(p&&p.status||'').trim(),delegations=activeSponsorDelegations_(new Date());return readObjects_(FE.SHEETS.VISITS).filter(r=>sponsorVisitAccess_(r,session,delegations).allowed).filter(r=>!status||String(r.Status)===status).filter(r=>!query||[r.FullName,r.ConfirmationNumber,r.Company,r.SponsorName,r.SponsorEmail,r.Reason,r.Project,r.LicensePlate,r.VisitID].join(' ').toLowerCase().includes(query)).sort((a,b)=>new Date(b.CreatedAt||0)-new Date(a.CreatedAt||0)).slice(0,500);}
function publicSponsorVisit_(row,session,delegations){const access=sponsorVisitAccess_(row,session,delegations);return Object.assign(publicVisit_(row),{sponsorAccess:access.type,delegatedFrom:access.delegatedFrom,delegationId:access.delegationId||''});}
function listVisitsForSession_(p,session){requirePermission_(session,'viewVisits');if(!sponsorRole_(session))return listVisits_(p);const delegations=activeSponsorDelegations_(new Date()),visits=sponsorVisits_(p,session).map(r=>publicSponsorVisit_(r,session,delegations)),today=dateKey_(new Date());return{ok:true,visits:visits,kpis:{expectedToday:visits.filter(v=>v.startDate===today&&['Approved','Submitted','Pending Review','Pending Sponsor Review'].includes(v.status)).length,onsite:visits.filter(v=>v.status==='Checked In').length,checkedOutToday:visits.filter(v=>v.status==='Checked Out'&&String(v.checkOutTime||'').startsWith(today)).length,overdue:0}};}
function listSponsorDashboard_(p,session){
  if(!sponsorRole_(session)&&!sponsorOversightRole_(session))throw new Error('The Sponsor & Approver Portal requires a Sponsor, Approver, Administrator, or Super Administrator VISTA account.');
  const now=new Date(),delegations=activeSponsorDelegations_(now),rows=sponsorVisits_(p,session),visits=rows.map(r=>publicSponsorVisit_(r,session,delegations)),today=dateKey_(now),pending=visits.filter(v=>['Submitted','Pending Review','Pending Sponsor Review'].includes(v.status)).length,approved=visits.filter(v=>v.status==='Approved'&&v.startDate>=today).length,onsite=visits.filter(v=>v.status==='Checked In').length,completed=visits.filter(v=>v.status==='Checked Out').length,incoming=delegations.filter(r=>String(r.DelegateUserID||'')===String(session.UserID||'')).length,outgoing=delegations.filter(r=>String(r.SponsorUserID||'')===String(session.UserID||'')).length;
  return{ok:true,generatedAt:dateTime_(now),oversight:sponsorOversightRole_(session),sponsor:{fullName:String(session.FullName||session.Username||''),email:String(session.Email||''),department:String(session.Department||''),role:String(session.Role||'')},summary:{pending:pending,approvedUpcoming:approved,onsite:onsite,completed:completed,total:visits.length,delegatedToMe:incoming,delegatedByMe:outgoing},visits:visits};
}
function activeSponsorUser_(userId){const found=findUserById_(userId),user=found.obj;if(!truthyActive_(user.Active)||!sponsorRole_(user))throw new Error('Select an active Sponsor or Approver VISTA account.');if(!String(user.Email||'').trim())throw new Error('Sponsor and Approver accounts require an email address.');return user;}
function publicSponsorDirectoryUser_(u){return{userId:String(u.UserID||''),fullName:String(u.FullName||u.Username||''),email:String(u.Email||''),employeeId:String(u.EmployeeID||''),department:String(u.Department||''),role:String(u.Role||'')};}
function publicSponsorDelegation_(r,now){const at=now||new Date(),start=parseDateSafe_(r.StartAt),end=parseDateSafe_(r.EndAt),stored=String(r.Status||'Active'),effective=stored!=='Active'?stored:start&&start>at?'Scheduled':end&&end<at?'Expired':'Active';return{delegationId:String(r.DelegationID||''),createdAt:dateText_(r.CreatedAt),sponsorUserId:String(r.SponsorUserID||''),sponsorName:String(r.SponsorName||''),sponsorEmail:String(r.SponsorEmail||''),delegateUserId:String(r.DelegateUserID||''),delegateName:String(r.DelegateName||''),delegateEmail:String(r.DelegateEmail||''),startAt:dateText_(r.StartAt),endAt:dateText_(r.EndAt),status:effective,storedStatus:stored,reason:String(r.Reason||''),createdBy:String(r.CreatedBy||''),cancelledAt:dateText_(r.CancelledAt),cancelledBy:String(r.CancelledBy||'')};}
function listSponsorDirectory_(p,session){const query=String(p.query||'').trim().toLowerCase(),rows=readObjects_(FE.SHEETS.USERS).filter(u=>truthyActive_(u.Active)&&sponsorRole_(u)&&String(u.UserID||'')!==String(session.UserID||'')).filter(u=>!query||[u.FullName,u.Email,u.EmployeeID,u.Department,u.Role].join(' ').toLowerCase().includes(query)).sort((a,b)=>String(a.FullName||'').localeCompare(String(b.FullName||''))).slice(0,250).map(publicSponsorDirectoryUser_);return{ok:true,users:rows};}
function listSponsorDelegations_(p,session){const now=new Date(),admin=sponsorOversightRole_(session),rows=readObjects_(FE.SHEETS.SPONSOR_DELEGATIONS).filter(r=>admin||String(r.SponsorUserID||'')===String(session.UserID||'')||String(r.DelegateUserID||'')===String(session.UserID||'')).sort((a,b)=>new Date(b.CreatedAt||0)-new Date(a.CreatedAt||0)).slice(0,250).map(r=>publicSponsorDelegation_(r,now));return{ok:true,generatedAt:dateTime_(now),oversight:admin,delegations:rows,summary:{activeOutgoing:admin?rows.filter(r=>r.status==='Active').length:rows.filter(r=>r.sponsorUserId===String(session.UserID||'')&&r.status==='Active').length,activeIncoming:admin?0:rows.filter(r=>r.delegateUserId===String(session.UserID||'')&&r.status==='Active').length,scheduled:rows.filter(r=>r.status==='Scheduled').length}};}
function createSponsoredVisitAuthorized_(p,session){
  p=p||{};
  validateRequired_(p,['firstName','lastName','email','phone','company','reason','startDate','arrivalTime','endDate','departureTime','accessScope']);
  if(!validEmailAddress_(p.email))throw new Error('Enter a valid visitor email address.');
  const oversight=sponsorOversightRole_(session),sponsor=oversight?activeSponsorUser_(String(p.sponsorUserId||'')):activeSponsorUser_(String(session.UserID||'')),repeatWeeks=Number(p.repeatWeeks||1);
  if(!Number.isInteger(repeatWeeks)||repeatWeeks<1||repeatWeeks>12)throw new Error('Recurring visit count must be a whole number from 1 through 12.');
  const initialStart=new Date(String(p.startDate)+'T'+String(p.arrivalTime)),initialEnd=new Date(String(p.endDate)+'T'+String(p.departureTime));
  if(isNaN(initialStart.getTime())||isNaN(initialEnd.getTime())||initialEnd<=initialStart)throw new Error('Enter a valid visit period with departure after arrival.');
  const lock=LockService.getScriptLock();lock.waitLock(15000);const createdRecords=[];
  try{
    for(let week=0;week<repeatWeeks;week++){
      const start=new Date(initialStart),end=new Date(initialEnd);start.setDate(start.getDate()+week*7);end.setDate(end.getDate()+week*7);
      const now=new Date(),visitId='VST-'+Utilities.formatDate(now,tz_(),'yyyyMMdd')+'-'+Utilities.getUuid().slice(0,8).toUpperCase(),confirmation='FE-'+Utilities.getUuid().replace(/-/g,'').slice(0,8).toUpperCase(),fullName=[p.firstName,p.middleName,p.lastName].filter(Boolean).join(' ');
      const record={VisitID:visitId,ConfirmationNumber:confirmation,CreatedAt:now,Status:'Submitted',FirstName:String(p.firstName).trim(),MiddleName:String(p.middleName||'').trim(),LastName:String(p.lastName).trim(),FullName:fullName,Email:String(p.email).trim(),Phone:String(p.phone).trim(),Company:String(p.company).trim(),JobTitle:String(p.jobTitle||'').trim(),SponsorID:String(sponsor.EmployeeID||sponsor.Username||''),SponsorSource:'VISTA Sponsor Portal',SponsorName:String(sponsor.FullName||sponsor.Username||''),SponsorEmail:String(sponsor.Email||''),Department:String(p.department||sponsor.Department||'').trim(),SecondaryContact:String(p.secondaryContact||'').trim(),Reason:String(p.reason).trim(),Project:String(p.project||'').trim(),VisitorType:String(p.visitorType||'Business Visitor').trim(),StartDate:dateOnly_(start),ArrivalTime:timeOnly_(start),EndDate:dateOnly_(end),DepartureTime:timeOnly_(end),AccessScope:String(p.accessScope).trim(),EscortRequired:String(p.escortRequired||'Sponsor or designated escort').trim(),SpecialItems:String(p.specialItems||'').trim(),Driving:String(p.driving)==='Yes'?'Yes':'No',VehicleMake:String(p.vehicleMake||'').trim(),VehicleModel:String(p.vehicleModel||'').trim(),VehicleYear:String(p.vehicleYear||'').trim(),VehicleColor:String(p.vehicleColor||'').trim(),LicensePlate:String(p.licensePlate||'').trim(),PlateState:String(p.plateState||'').trim(),AgreementVersion:String(config_().AGREEMENT_VERSION||'2026.2'),AgreementCompletionCount:0,AgreementCompletionStatus:'Pending Visitor Acknowledgement',AgreeSecurity:'No',AgreeBiometric:'No',AgreePrivacy:'No',AgreeSafety:'No',AgreeConduct:'No',AgreeTraining:'No',AgreeRestricted:'No',SessionID:'SPONSOR-'+String(session.UserID||''),UserAgent:String(p.userAgent||'').slice(0,500),ClientTimestamp:String(p.clientTimestamp||''),LastUpdatedAt:now};
      const intakeToken=Utilities.getUuid().replace(/-/g,'')+Utilities.getUuid().replace(/-/g,''),invitationDays=Math.max(1,Number(config_().VISITOR_INTAKE_INVITATION_DAYS||14)),visitExpiry=new Date(end.getTime()+86400000),configuredExpiry=new Date(now.getTime()+invitationDays*86400000),intakeExpiry=new Date(Math.max(visitExpiry.getTime(),configuredExpiry.getTime()));
      record.VisitorIntakeTokenHash=sha256_(intakeToken);record.VisitorIntakeExpiresAt=intakeExpiry;record.VisitorIntakeStatus='Pending';record.VisitorIntakeSentAt='';record._VisitorIntakeToken=intakeToken;
      appendObjectRow_(SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.VISITS),record,FE.VISIT_HEADERS);
      const creationDetails=[oversight?'Administrative oversight':'Sponsor self-service','Series '+(week+1)+' of '+repeatWeeks,'Agreements pending visitor acknowledgement'].join(' · ');
      logActivity_(visitId,'SPONSOR_VISIT_CREATED',session.FullName||session.Username,'',creationDetails);
      audit_(session,'SPONSOR_VISIT_CREATED',visitId,confirmation,'Success',record.SponsorName+' · '+fullName+' · '+dateOnly_(start)+(repeatWeeks>1?' · recurring series':''));
      createdRecords.push(record);
    }
  }finally{lock.releaseLock()}
  const delegations=activeSponsorDelegations_(new Date()),created=createdRecords.map(record=>{const notifications=notifySubmission_(record,record._VisitorIntakeToken);if(notifications.visitorSent){const found=findVisitRow_(record.VisitID);updateObjectRow_(FE.SHEETS.VISITS,found.row,{VisitorIntakeSentAt:new Date(),LastUpdatedAt:new Date()});record.VisitorIntakeSentAt=new Date()}delete record._VisitorIntakeToken;return{visit:publicSponsorVisit_(record,session,delegations),notifications:notifications}});
  return{ok:true,createdCount:created.length,created:created,message:created.length===1?'Visitor request created.':created.length+' recurring visitor requests created.'};
}
function saveSponsorDelegationAuthorized_(p,session){
  const admin=permissionsForRole_(session.Role).manageConfig;if(!admin&&!sponsorRole_(session))throw new Error('Only Sponsors, Approvers, and Administrators can manage sponsor coverage.');
  const sponsorUserId=admin?String(p.sponsorUserId||session.UserID||''):String(session.UserID||''),delegateUserId=String(p.delegateUserId||'');validateRequired_({sponsorUserId:sponsorUserId,delegateUserId:delegateUserId,startAt:p.startAt,endAt:p.endAt},['sponsorUserId','delegateUserId','startAt','endAt']);
  if(sponsorUserId===delegateUserId)throw new Error('A sponsor cannot delegate visitor approvals to the same account.');
  const sponsor=activeSponsorUser_(sponsorUserId),delegate=activeSponsorUser_(delegateUserId),start=parseDateSafe_(p.startAt),end=parseDateSafe_(p.endAt),maxDays=Math.max(1,Number(config_().SPONSOR_DELEGATION_MAX_DAYS||90));
  if(!start||!end||end<=start)throw new Error('Enter a valid coverage period with an end after the start.');if((end-start)/86400000>maxDays)throw new Error('Coverage cannot exceed '+maxDays+' days.');
  const overlap=readObjects_(FE.SHEETS.SPONSOR_DELEGATIONS).find(r=>String(r.Status||'Active')==='Active'&&String(r.SponsorUserID||'')===sponsorUserId&&String(r.DelegateUserID||'')===delegateUserId&&parseDateSafe_(r.StartAt)<end&&parseDateSafe_(r.EndAt)>start);if(overlap)throw new Error('An overlapping coverage assignment already exists for this delegate.');
  const now=new Date(),record={DelegationID:'DEL-'+Utilities.getUuid().slice(0,12).toUpperCase(),CreatedAt:now,SponsorUserID:sponsorUserId,SponsorEmployeeID:String(sponsor.EmployeeID||''),SponsorUsername:String(sponsor.Username||''),SponsorName:String(sponsor.FullName||sponsor.Username||''),SponsorEmail:String(sponsor.Email||''),DelegateUserID:delegateUserId,DelegateEmployeeID:String(delegate.EmployeeID||''),DelegateUsername:String(delegate.Username||''),DelegateName:String(delegate.FullName||delegate.Username||''),DelegateEmail:String(delegate.Email||''),StartAt:start,EndAt:end,Status:'Active',Reason:String(p.reason||'').trim(),CreatedByUserID:String(session.UserID||''),CreatedBy:String(session.FullName||session.Username||''),CancelledAt:'',CancelledByUserID:'',CancelledBy:'',LastUpdatedAt:now};
  appendObjectRow_(SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.SPONSOR_DELEGATIONS),record,FE.SPONSOR_DELEGATION_HEADERS);audit_(session,'SPONSOR_DELEGATION_CREATED','','','Success',record.SponsorName+' → '+record.DelegateName+' · '+dateText_(start)+' through '+dateText_(end));return{ok:true,message:'Sponsor coverage assignment created.',delegation:publicSponsorDelegation_(record,now)};
}
function cancelSponsorDelegationAuthorized_(p,session){validateRequired_(p,['delegationId']);const rows=readObjects_(FE.SHEETS.SPONSOR_DELEGATIONS),record=rows.find(r=>String(r.DelegationID||'')===String(p.delegationId));if(!record)throw new Error('Sponsor coverage assignment was not found.');const admin=permissionsForRole_(session.Role).manageConfig,participant=[record.SponsorUserID,record.DelegateUserID].map(String).includes(String(session.UserID||''));if(!admin&&!participant)throw new Error('You are not authorized to cancel this sponsor coverage assignment.');if(String(record.Status||'Active')!=='Active')throw new Error('This sponsor coverage assignment is already '+String(record.Status||'inactive').toLowerCase()+'.');const now=new Date();updateObjectRow_(FE.SHEETS.SPONSOR_DELEGATIONS,rows.indexOf(record)+2,{Status:'Cancelled',CancelledAt:now,CancelledByUserID:String(session.UserID||''),CancelledBy:String(session.FullName||session.Username||''),LastUpdatedAt:now});audit_(session,'SPONSOR_DELEGATION_CANCELLED','','','Success',String(record.SponsorName||'')+' → '+String(record.DelegateName||''));return{ok:true,message:'Sponsor coverage assignment cancelled.'};}
function pendingSponsorReviewRows_(now){const at=now||new Date(),reviewable=['Submitted','Pending Review','Pending Sponsor Review'];return readObjects_(FE.SHEETS.VISITS).filter(r=>reviewable.includes(String(r.Status||'Submitted'))).map(r=>Object.assign({},r,{_ageHours:Math.max(0,Math.floor((at-new Date(r.CreatedAt||at))/3600000))})).sort((a,b)=>b._ageHours-a._ageHours);}
function delegateEmailsForVisit_(visit,now){return activeSponsorDelegations_(now||new Date()).filter(r=>sponsorIdentityMatchesVisit_(visit,{Email:r.SponsorEmail,EmployeeID:r.SponsorEmployeeID,Username:r.SponsorUsername})).map(r=>String(r.DelegateEmail||'').trim().toLowerCase()).filter(validEmailAddress_);}
function reminderRecipientsForVisit_(visit,type,now){const cfg=config_(),base=[String(visit.SponsorEmail||'').trim().toLowerCase()].concat(delegateEmailsForVisit_(visit,now)),escalation=type==='Escalation'?facilitiesRecipients_(cfg.SPONSOR_ESCALATION_EMAILS).emails:[],all=[...new Set(base.concat(escalation).filter(validEmailAddress_))];return{all:all,sponsor:String(visit.SponsorEmail||'').trim().toLowerCase(),delegates:[...new Set(delegateEmailsForVisit_(visit,now))],escalation:escalation};}
function publicSponsorReminder_(r){return{reminderId:String(r.ReminderID||''),visitId:String(r.VisitID||''),confirmationNumber:String(r.ConfirmationNumber||''),reminderType:String(r.ReminderType||''),createdAt:dateText_(r.CreatedAt),requestAgeHours:Number(r.RequestAgeHours||0),sponsorEmail:String(r.SponsorEmail||''),delegateEmails:String(r.DelegateEmails||''),recipients:String(r.Recipients||''),deliveryStatus:String(r.DeliveryStatus||''),deliveryError:String(r.DeliveryError||''),initiatedBy:String(r.InitiatedBy||'')};}
function recordSponsorReminder_(visit,type,ageHours,recipients,status,error,actor,now){const record={ReminderID:'REM-'+Utilities.getUuid().slice(0,12).toUpperCase(),VisitID:String(visit.VisitID||''),ConfirmationNumber:String(visit.ConfirmationNumber||''),ReminderType:type,CreatedAt:now,RequestAgeHours:ageHours,SponsorEmail:recipients.sponsor,DelegateEmails:recipients.delegates.join(', '),Recipients:recipients.all.join(', '),DeliveryStatus:status,DeliveryError:String(error||'').slice(0,500),InitiatedByUserID:String(actor.UserID||''),InitiatedBy:String(actor.FullName||actor.Username||'VISTA Automation'),LastUpdatedAt:now};appendObjectRow_(SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.SPONSOR_REMINDERS),record,FE.SPONSOR_REMINDER_HEADERS);return record;}
function sendSponsorReviewReminder_(visit,type,actor,now){
  const at=now||new Date(),ageHours=Math.max(0,Math.floor((at-new Date(visit.CreatedAt||at))/3600000)),reminderType=type==='Escalation'?'Escalation':'Reminder',recipients=reminderRecipientsForVisit_(visit,reminderType,at),portal=config_().SPONSOR_PORTAL_URL||'https://kyblueoval.github.io/Ford-Energy-VISTA/sponsor-portal/';let status='No Recipients',error='The request does not have a valid sponsor, delegate, or escalation email address.';
  if(recipients.all.length){const urgency=reminderType==='Escalation'?'This request has exceeded the configured sponsor escalation threshold.':'This visitor request is still waiting for sponsor review.',body=`<p style="margin:0 0 16px">${html_(urgency)}</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #dce6f0;border-radius:10px;border-collapse:separate"><tr><td style="padding:12px;background:#f6f9fc;font-weight:bold">Visitor</td><td style="padding:12px">${html_(visit.FullName)}</td></tr><tr><td style="padding:12px;background:#f6f9fc;font-weight:bold">Sponsor</td><td style="padding:12px">${html_(visit.SponsorName||visit.SponsorEmail)}</td></tr><tr><td style="padding:12px;background:#f6f9fc;font-weight:bold">Visit</td><td style="padding:12px">${html_(dateOnly_(visit.StartDate)+' '+timeOnly_(visit.ArrivalTime))}</td></tr><tr><td style="padding:12px;background:#f6f9fc;font-weight:bold">Age</td><td style="padding:12px">${ageHours} hours pending</td></tr><tr><td style="padding:12px;background:#f6f9fc;font-weight:bold">Confirmation</td><td style="padding:12px"><strong>${html_(visit.ConfirmationNumber)}</strong></td></tr></table>${emailButton_(portal,'Open Sponsor Review Workspace')}`;try{MailApp.sendEmail({to:recipients.all.join(','),subject:`${reminderType}: Visitor approval required for ${visit.FullName} (${visit.ConfirmationNumber})`,body:`${reminderType}: ${visit.FullName} is awaiting sponsor review. Confirmation ${visit.ConfirmationNumber}. Pending ${ageHours} hours.`,htmlBody:brandedEmail_({title:reminderType==='Escalation'?'Sponsor Review Escalation':'Sponsor Review Reminder',kicker:'FORD ENERGY · VISTA APPROVAL GOVERNANCE',preheader:`${visit.FullName} is awaiting sponsor review`,body:body,footerNote:'Reminder delivery and the acting account are retained in the VISTA audit record.'})});status='Sent';error=''}catch(err){status='Failed';error=String(err&&err.message||err).replace(/\s+/g,' ').slice(0,500)}}
  const record=recordSponsorReminder_(visit,reminderType,ageHours,recipients,status,error,actor,at),event=reminderType==='Escalation'?'SPONSOR_REVIEW_ESCALATED':'SPONSOR_REVIEW_REMINDER';logActivity_(visit.VisitID,event,actor.FullName||actor.Username||'VISTA Automation','',[status,recipients.all.join(', '),ageHours+' hours pending',error].filter(Boolean).join(' · '));audit_(actor,event,visit.VisitID,visit.ConfirmationNumber,status==='Sent'?'Success':'Warning',[status,recipients.all.join(', '),error].filter(Boolean).join(' · '));return publicSponsorReminder_(record);
}
function latestSponsorReminderMap_(){return readObjects_(FE.SHEETS.SPONSOR_REMINDERS).reduce((map,r)=>{const key=String(r.VisitID||''),current=map[key];if(!current||new Date(r.CreatedAt||0)>new Date(current.CreatedAt||0))map[key]=r;return map;},{});}
function listSponsorGovernance_(p,session){const now=new Date(),cfg=config_(),reminderHours=Math.max(1,Number(cfg.SPONSOR_REMINDER_HOURS||24)),escalationHours=Math.max(reminderHours,Number(cfg.SPONSOR_ESCALATION_HOURS||48)),latest=latestSponsorReminderMap_(),pending=pendingSponsorReviewRows_(now).map(r=>{const last=latest[String(r.VisitID||'')];return{visitId:String(r.VisitID||''),confirmationNumber:String(r.ConfirmationNumber||''),fullName:String(r.FullName||''),company:String(r.Company||''),sponsorName:String(r.SponsorName||''),sponsorEmail:String(r.SponsorEmail||''),createdAt:dateText_(r.CreatedAt),startDate:dateOnly_(r.StartDate),arrivalTime:timeOnly_(r.ArrivalTime),ageHours:r._ageHours,level:r._ageHours>=escalationHours?'Escalation':r._ageHours>=reminderHours?'Reminder':'Within Target',lastReminder:last?publicSponsorReminder_(last):null};}),delegations=readObjects_(FE.SHEETS.SPONSOR_DELEGATIONS).sort((a,b)=>new Date(b.CreatedAt||0)-new Date(a.CreatedAt||0)).slice(0,250).map(r=>publicSponsorDelegation_(r,now)),directory=readObjects_(FE.SHEETS.USERS).filter(u=>truthyActive_(u.Active)&&sponsorRole_(u)).sort((a,b)=>String(a.FullName||'').localeCompare(String(b.FullName||''))).map(publicSponsorDirectoryUser_),recent=readObjects_(FE.SHEETS.SPONSOR_REMINDERS).slice(-100).reverse().map(publicSponsorReminder_);return{ok:true,generatedAt:dateTime_(now),settings:{enabled:['yes','true','1','on','enabled'].includes(String(cfg.SPONSOR_REMINDERS_ENABLED||'YES').toLowerCase()),reminderHours:reminderHours,escalationHours:escalationHours,cooldownHours:Math.max(1,Number(cfg.SPONSOR_REMINDER_COOLDOWN_HOURS||20)),escalationEmails:String(cfg.SPONSOR_ESCALATION_EMAILS||'')},summary:{pending:pending.length,reminderDue:pending.filter(r=>r.level==='Reminder').length,escalated:pending.filter(r=>r.level==='Escalation').length,activeDelegations:delegations.filter(r=>r.status==='Active').length},pending:pending,delegations:delegations,recentReminders:recent,directory:directory};}
function sendSponsorReviewReminderAuthorized_(p,session){validateRequired_(p,['visitId']);const visit=findVisitRow_(p.visitId).obj;if(!['Submitted','Pending Review','Pending Sponsor Review'].includes(String(visit.Status||'Submitted')))throw new Error('Only pending sponsor-review requests can receive reminders.');const cfg=config_(),age=Math.max(0,Math.floor((new Date()-new Date(visit.CreatedAt||new Date()))/3600000)),type=String(p.reminderType||'')==='Escalation'||age>=Math.max(1,Number(cfg.SPONSOR_ESCALATION_HOURS||48))?'Escalation':'Reminder';return{ok:true,reminder:sendSponsorReviewReminder_(visit,type,session,new Date()),message:type+' processed.'};}
function runSponsorReminderCycleUnlocked_(actor){const cfg=config_(),enabled=['yes','true','1','on','enabled'].includes(String(cfg.SPONSOR_REMINDERS_ENABLED||'YES').toLowerCase());if(!enabled)return{ok:true,enabled:false,processed:0,sent:0,failed:0,message:'Sponsor reminders are disabled in Config.'};const now=new Date(),reminderHours=Math.max(1,Number(cfg.SPONSOR_REMINDER_HOURS||24)),escalationHours=Math.max(reminderHours,Number(cfg.SPONSOR_ESCALATION_HOURS||48)),cooldown=Math.max(1,Number(cfg.SPONSOR_REMINDER_COOLDOWN_HOURS||20)),latest=latestSponsorReminderMap_(),results=[];pendingSponsorReviewRows_(now).filter(r=>r._ageHours>=reminderHours).slice(0,50).forEach(visit=>{const last=latest[String(visit.VisitID||'')],lastAt=last?parseDateSafe_(last.CreatedAt):null;if(lastAt&&(now-lastAt)/3600000<cooldown)return;const type=visit._ageHours>=escalationHours?'Escalation':'Reminder';results.push(sendSponsorReviewReminder_(visit,type,actor,now));});return{ok:true,enabled:true,processed:results.length,sent:results.filter(r=>r.deliveryStatus==='Sent').length,failed:results.filter(r=>r.deliveryStatus!=='Sent').length,results:results,message:results.length?'Sponsor reminder cycle complete.':'No sponsor reminders were due.'};}
function runSponsorReminderCycle_(actor){const lock=LockService.getScriptLock();if(!lock.tryLock(5000))return{ok:true,enabled:true,processed:0,sent:0,failed:0,message:'Another sponsor reminder cycle is already running.'};try{return runSponsorReminderCycleUnlocked_(actor)}finally{lock.releaseLock()}}
function runSponsorReminderCycleAuthorized_(p,session){const result=runSponsorReminderCycle_(session);audit_(session,'SPONSOR_REMINDER_CYCLE','','',result.failed?'Warning':'Success','Processed '+result.processed+' · Sent '+result.sent+' · Failed '+result.failed);return result;}
function processSponsorReviewReminders(){return runSponsorReminderCycle_({UserID:'SYSTEM',Username:'vista-automation',FullName:'VISTA Automation',Role:'System'});}
function installSponsorReviewReminderTrigger(){ScriptApp.getProjectTriggers().filter(t=>t.getHandlerFunction()==='processSponsorReviewReminders').forEach(t=>ScriptApp.deleteTrigger(t));ScriptApp.newTrigger('processSponsorReviewReminders').timeBased().everyHours(1).create();return 'Hourly VISTA sponsor-review reminder trigger installed.';}
function removeSponsorReviewReminderTrigger(){let removed=0;ScriptApp.getProjectTriggers().filter(t=>t.getHandlerFunction()==='processSponsorReviewReminders').forEach(t=>{ScriptApp.deleteTrigger(t);removed++});return removed+' sponsor-review reminder trigger(s) removed.';}
function getVisitPhotoAuthorized_(p,session){validateRequired_(p,['visitId']);if(sponsorRole_(session))requireSponsorOwnedVisit_(p.visitId,session);return getVisitPhoto_(p);}
function checkInVisitAuthorized_(p,session){
  requirePermission_(session,'checkIn');p.officerName=p.officerName||session.FullName||session.Username;
  const result=checkInVisit_(p,session),notice=result.sponsorNotification||{};
  auditVisit_(session,'CHECK_IN',p.visitId,'Success','Badge '+p.badgeUid+(result.badge&&result.badge.badgeNumber?' · Visitor Badge '+result.badge.badgeNumber:'')+' · Sponsor email '+String(notice.status||'Not Requested'));
  if(notice.sent)auditVisit_(session,'SPONSOR_ARRIVAL_EMAIL_SENT',p.visitId,'Success','Sent to '+notice.recipient);
  else if(notice.requested)auditVisit_(session,notice.status==='Disabled'?'SPONSOR_ARRIVAL_EMAIL_SKIPPED':'SPONSOR_ARRIVAL_EMAIL_FAILED',p.visitId,'Warning',[notice.status,notice.recipient,notice.error].filter(Boolean).join(' · ').slice(0,500));
  return result;
}
function checkOutVisitAuthorized_(p,session){requirePermission_(session,'checkOut');p.officerName=p.officerName||session.FullName||session.Username;const result=checkOutVisit_(p);auditVisit_(session,'CHECK_OUT',p.visitId,'Success','Badge '+p.badgeUid+' · Condition '+result.badgeCondition);return result;}
function updateVisitStatusAuthorized_(p,session){
  validateRequired_(p,['visitId','status']);
  const status=String(p.status),rec=findVisitRow_(p.visitId).obj,current=String(rec.Status||'Submitted');
  const reviewable=['Submitted','Pending Review','Pending Sponsor Review'];
  if(status==='Approved'){
    requirePermission_(session,'approve');
    if(!reviewable.includes(current))throw new Error('Only a submitted or pending reservation can be approved. Current status: '+current+'.');
    if(String(rec.SponsorSource||'')==='VISTA Sponsor Portal'&&String(rec.AgreementCompletionStatus||'')!=='Completed')throw new Error('This sponsor-created request cannot be approved until the visitor completes the emailed intake, photograph, safety briefing, and acknowledgements.');
    if(sponsorRole_(session)&&!sponsorOwnsVisit_(rec,session))throw new Error('Sponsors may only approve visits assigned to their own identity.');
  } else if(status==='Denied'||status==='Rejected'){
    requirePermission_(session,'deny');
    if(!reviewable.includes(current))throw new Error('Only a submitted or pending reservation can be denied. Current status: '+current+'.');
    if(sponsorRole_(session)&&!sponsorOwnsVisit_(rec,session))throw new Error('Sponsors may only deny visits assigned to their own identity.');
  } else if(status==='Cancelled'){
    requirePermission_(session,'approve');
    if(!['Submitted','Pending Review','Pending Sponsor Review','Approved'].includes(current))throw new Error('This reservation cannot be cancelled from status '+current+'.');
    if(sponsorRole_(session)&&!sponsorOwnsVisit_(rec,session))throw new Error('Sponsors may only cancel visits assigned to their own identity.');
  } else if(status==='No Show'){
    requirePermission_(session,'noShow');
    if(!['Submitted','Pending Review','Pending Sponsor Review','Approved'].includes(current))throw new Error('This reservation cannot be marked No Show from status '+current+'.');
  } else throw new Error('This status transition is not permitted through the Security Console.');
  p.officerName=p.officerName||session.FullName||session.Username;
  const result=updateVisitStatus_(p),note=String(p.notes||'').trim();let visitorNotification={requested:false,sent:false,status:'Not Requested',recipient:'',error:''};
  if(['Approved','Denied','Rejected','Cancelled'].includes(status))visitorNotification=notifyVisitorSponsorDecision_(rec,status==='Rejected'?'Denied':status,note,session);
  const detail=['From '+current,note?'Note: '+note:'','Visitor email: '+visitorNotification.status].filter(Boolean).join(' · ');auditVisit_(session,'STATUS_'+status.toUpperCase().replace(/\s+/g,'_'),p.visitId,'Success',detail);
  if(visitorNotification.sent){logActivity_(p.visitId,'VISITOR_DECISION_EMAIL_SENT',session.FullName||session.Username,'','Sent to '+visitorNotification.recipient+' · '+status);auditVisit_(session,'VISITOR_DECISION_EMAIL_SENT',p.visitId,'Success','Sent to '+visitorNotification.recipient+' · '+status);}
  else if(visitorNotification.requested){logActivity_(p.visitId,'VISITOR_DECISION_EMAIL_FAILED',session.FullName||session.Username,'',[visitorNotification.status,visitorNotification.error].filter(Boolean).join(' · '));auditVisit_(session,'VISITOR_DECISION_EMAIL_FAILED',p.visitId,'Warning',[visitorNotification.status,visitorNotification.error].filter(Boolean).join(' · '));}
  return Object.assign(result,{visitorNotification:visitorNotification});
}
function updateSponsoredVisitAuthorized_(p,session){
  validateRequired_(p,['visitId']);const row=requireSponsorOwnedVisit_(p.visitId,session),visit=row.obj,current=String(visit.Status||'Submitted');
  if(!['Submitted','Pending Review','Pending Sponsor Review','Approved'].includes(current))throw new Error('Visit details cannot be changed after check-in or final disposition.');
  const updates={},fields=['StartDate','ArrivalTime','EndDate','DepartureTime','AccessScope','EscortRequired','SpecialItems','SecondaryContact'];
  fields.forEach(key=>{const camel=key.charAt(0).toLowerCase()+key.slice(1);if(Object.prototype.hasOwnProperty.call(p,camel))updates[key]=String(p[camel]||'').trim();});
  const startDate=updates.StartDate||dateOnly_(visit.StartDate),arrival=updates.ArrivalTime||timeOnly_(visit.ArrivalTime),endDate=updates.EndDate||dateOnly_(visit.EndDate),departure=updates.DepartureTime||timeOnly_(visit.DepartureTime),start=new Date(startDate+'T'+arrival),end=new Date(endDate+'T'+departure);
  if(!startDate||!arrival||!endDate||!departure||isNaN(start.getTime())||isNaN(end.getTime())||end<=start)throw new Error('Enter a valid visit period with departure after arrival.');
  updates.LastUpdatedAt=new Date();updateVisitRow_(row.row,updates);const details=['Sponsor updated visit details',String(p.notes||'').trim()].filter(Boolean).join(' · ');logActivity_(p.visitId,'SPONSOR_VISIT_UPDATED',session.FullName||session.Username,'',details);auditVisit_(session,'SPONSOR_VISIT_UPDATED',p.visitId,'Success',details);return{ok:true,visit:publicVisit_(Object.assign({},visit,updates))};
}
function listVisitActivityAuthorized_(p,session){
  validateRequired_(p,['visitId']);
  const visit=findVisitRow_(p.visitId).obj;
  if(sponsorRole_(session)&&!sponsorOwnsVisit_(visit,session))throw new Error('You are not authorized to view this visitor activity.');
  const badgeUid=String(p.badgeUid||visit.BadgeUID||'').trim();
  let events=readObjects_(FE.SHEETS.ACTIVITY).filter(r=>String(r.VisitID||'')===String(p.visitId));
  if(badgeUid&&!sponsorRole_(session)){
    const related=readObjects_(FE.SHEETS.ACTIVITY).filter(r=>String(r.BadgeUID||'').trim()===badgeUid&&String(r.VisitID||'')!==String(p.visitId));
    events=events.concat(related);
  }
  events.sort((a,b)=>new Date(b.EventTime||0)-new Date(a.EventTime||0));
  return{ok:true,visitId:String(p.visitId),badgeUid:badgeUid,events:events.slice(0,100).map(r=>({activityId:String(r.ActivityID||''),visitId:String(r.VisitID||''),eventType:String(r.EventType||''),eventTime:dateText_(r.EventTime),performedBy:String(r.PerformedBy||''),badgeUid:String(r.BadgeUID||''),details:String(r.Details||''),currentVisit:String(r.VisitID||'')===String(p.visitId)}))};
}

function auditVisit_(session,action,visitId,result,details){let confirmation='';try{confirmation=findVisitRow_(visitId).obj.ConfirmationNumber||''}catch(e){}audit_(session,action,visitId,confirmation,result,details);}
function audit_(u,action,visitId,confirmation,result,details){const rec={AuditID:'AUD-'+Utilities.getUuid().slice(0,12).toUpperCase(),Timestamp:new Date(),UserID:u.UserID||'',Username:u.Username||'',Role:u.Role||'',Action:action,VisitID:visitId||'',ConfirmationNumber:confirmation||'',Result:result||'',Details:details||''};appendObjectRow_(SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.AUDIT),rec,FE.AUDIT_HEADERS);}


/* ===== VISTA 2.1A ADMINISTRATION API ===== */
function listVistaUsers_(p,session){
  const query=String(p.query||'').trim().toLowerCase();
  const role=String(p.role||'').trim().toLowerCase();
  const active=String(p.active||'').trim().toLowerCase();
  let rows=readObjects_(FE.SHEETS.USERS).map(publicAdminUser_);
  if(query)rows=rows.filter(u=>[u.userId,u.employeeId,u.fullName,u.email,u.username,u.department,u.company,u.badgeUid,u.role].join(' ').toLowerCase().includes(query));
  if(role)rows=rows.filter(u=>u.role.toLowerCase()===role);
  if(active)rows=rows.filter(u=>(u.active?'active':'disabled')===active);
  rows.sort((a,b)=>a.fullName.localeCompare(b.fullName));
  const maxFailedLogins=Math.max(3,Number(config_().AUTH_MAX_FAILED_LOGINS||5));
  return {ok:true,users:rows,summary:{total:rows.length,active:rows.filter(x=>x.active).length,admins:rows.filter(x=>isAdminRole_(x.role)).length,disabled:rows.filter(x=>!x.active).length,locked:rows.filter(x=>x.failedLoginCount>=maxFailedLogins).length,maxFailedLogins:maxFailedLogins}};
}
function publicAdminUser_(u){return{userId:String(u.UserID||''),employeeId:String(u.EmployeeID||''),fullName:String(u.FullName||''),email:String(u.Email||''),department:String(u.Department||''),company:String(u.Company||''),badgeUid:String(u.BadgeUID||''),username:String(u.Username||''),role:String(u.Role||''),approvalScope:String(u.ApprovalScope||''),active:truthyActive_(u.Active),createdAt:dateText_(u.CreatedAt),lastLoginAt:dateText_(u.LastLoginAt),failedLoginCount:Number(u.FailedLoginCount||0),notes:String(u.Notes||''),photoFileId:String(u.UserPhotoFileId||''),photoFileName:String(u.UserPhotoFileName||''),photoUrl:String(u.UserPhotoUrl||''),hasPhoto:Boolean(u.UserPhotoFileId||u.UserPhotoFileName)};}
function isAdminRole_(role){const r=String(role||'').trim().toLowerCase();return r==='admin'||r==='super administrator'||r==='superadmin';}
function normalizeVistaRole_(role){
  const value=String(role||'').trim(); const key=value.toLowerCase().replace(/[^a-z]/g,'');
  const roles={superadministrator:'Super Administrator',superadmin:'Super Administrator',admin:'Admin',securitysupervisor:'Security Supervisor',security:'Security',securityofficer:'Security',frontdesk:'FrontDesk',sponsor:'Sponsor',approver:'Approver',reporting:'Reporting',readonly:'Read Only'};
  if(!roles[key])throw new Error('Select a valid VISTA role.'); return roles[key];
}
function syncSponsorDirectoryFromUser_(user,previous){
  const sheet=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.SPONSORS);if(!sheet)return;
  const prior=previous||{},isSponsor=sponsorRole_(user),wasSponsor=sponsorRole_(prior),sponsorId=String(user.EmployeeID||user.Username||'').trim(),email=String(user.Email||'').trim().toLowerCase(),priorId=String(prior.EmployeeID||prior.Username||'').trim(),priorEmail=String(prior.Email||'').trim().toLowerCase(),rows=sheet.getDataRange().getValues(),headers=rows[0];let row=0,existing={};
  for(let i=1;i<rows.length;i++){const o=headers.reduce((a,k,j)=>(a[k]=rows[i][j],a),{}),id=String(o.SponsorID||'').trim(),mail=String(o.SponsorEmail||'').trim().toLowerCase();if((sponsorId&&id===sponsorId)||(email&&mail===email)||(priorId&&id===priorId)||(priorEmail&&mail===priorEmail)){row=i+1;existing=o;break}}
  if(isSponsor){const rec={SponsorID:sponsorId,SponsorName:String(user.FullName||user.Username||'').trim(),SponsorEmail:email,Department:String(user.Department||'').trim(),Active:truthyActive_(user.Active)?'Yes':'No',SearchKeywords:[user.FullName,user.Department,user.Company,user.EmployeeID,user.Username].filter(Boolean).join(', '),LastUpdatedAt:new Date()};if(row)updateObjectRow_(FE.SHEETS.SPONSORS,row,rec);else appendObjectRow_(sheet,rec,FE.SPONSOR_HEADERS);return}
  if(wasSponsor&&row)updateObjectRow_(FE.SHEETS.SPONSORS,row,{Active:'No',LastUpdatedAt:new Date()});
}
function saveVistaUser_(p,session){
  validateRequired_(p,['fullName','role']);
  const sheet=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.USERS); if(!sheet)throw new Error('Users sheet is unavailable.');
  const role=normalizeVistaRole_(p.role), username=String(p.username||p.email||p.employeeId||'').trim().toLowerCase();
  if((role==='Sponsor'||role==='Approver')&&!String(p.email||'').trim())throw new Error('Sponsor and Approver accounts require an email address that matches the visitor request sponsor email.');
  if(!username)throw new Error('Username, email, or employee ID is required.');
  const userId=String(p.userId||'').trim(); const rows=sheet.getDataRange().getValues(), headers=rows[0];
  let row=0, existing={};
  for(let i=1;i<rows.length;i++){
    const o=headers.reduce((a,k,j)=>(a[k]=rows[i][j],a),{});
    if(userId&&String(o.UserID||'').trim()===userId){row=i+1;existing=o;break;}
    if(!userId&&String(o.Username||'').trim().toLowerCase()===username){row=i+1;existing=o;break;}
  }
  if(userId&&!row)throw new Error('The selected VISTA user record no longer exists. Refresh the user list and try again.');
  for(let i=1;i<rows.length;i++){
    const o=headers.reduce((a,k,j)=>(a[k]=rows[i][j],a),{});
    if(String(o.Username||'').trim().toLowerCase()===username&&String(o.UserID||'').trim()!==String(userId||existing.UserID||''))throw new Error('That username is already assigned to another VISTA account.');
  }
  const rec={UserID:userId||existing.UserID||('USR-'+Utilities.getUuid().slice(0,10).toUpperCase()),EmployeeID:String(p.employeeId||''),FullName:String(p.fullName||'').trim(),Email:String(p.email||'').trim(),Department:String(p.department||''),Company:String(p.company||'Ford Energy'),BadgeUID:String(p.badgeUid||'').trim(),Username:username,PINHash:existing.PINHash||'',Role:role,ApprovalScope:String(p.approvalScope||(role==='Sponsor'||role==='Approver'?'OWN_SPONSORED_VISITS':'ALL')),Active:p.active===false?'No':'Yes',CreatedAt:existing.CreatedAt||new Date(),LastLoginAt:existing.LastLoginAt||'',FailedLoginCount:Number(existing.FailedLoginCount||0),Notes:String(p.notes||''),UserPhotoFileId:String(existing.UserPhotoFileId||''),UserPhotoFileName:String(existing.UserPhotoFileName||''),UserPhotoUrl:String(existing.UserPhotoUrl||'')};
  if(p.removePhoto===true){rec.UserPhotoFileId='';rec.UserPhotoFileName='';rec.UserPhotoUrl='';}
  if(String(p.photoDataUrl||'').trim()){const saved=saveVistaUserPhoto_(p.photoDataUrl,rec);rec.UserPhotoFileId=saved.fileId;rec.UserPhotoFileName=saved.fileName;rec.UserPhotoUrl=saved.url;}
  if(String(p.pin||'').trim())rec.PINHash=pinHash_(username,String(p.pin).trim());
  if(!rec.PINHash&&!row)throw new Error('A PIN is required for a new user.');
  if(row)updateObjectRow_(FE.SHEETS.USERS,row,rec);else appendObjectRow_(sheet,rec,FE.USER_HEADERS);syncSponsorDirectoryFromUser_(rec,existing);
  if(row&&String(rec.UserID||'')===String(session.UserID||''))updateSessionsForUser_(rec);
  audit_(session,row?'ADMIN_USER_UPDATE':'ADMIN_USER_CREATE','','','Success',rec.Username+' · '+rec.Role);
  return {ok:true,user:publicAdminUser_(rec),message:(row?'User updated.':'User created.')+(role==='Sponsor'||role==='Approver'?' Sponsor directory synchronized.':'')};
}

function userPhotoFolder_(){
  const cfg=config_(),id=String(cfg.USER_PHOTO_FOLDER_ID||cfg.PHOTO_FOLDER_ID||'').trim();
  return id?DriveApp.getFolderById(id):DriveApp.getRootFolder();
}
function saveVistaUserPhoto_(dataUrl,user){
  const m=String(dataUrl||'').match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,(.+)$/i);
  if(!m)throw new Error('Badge photo must be a JPG, PNG, or WebP image.');
  const bytes=Utilities.base64Decode(m[2]);
  if(bytes.length>2500000)throw new Error('Badge photo is too large after processing.');
  const ext=m[1].toLowerCase().includes('png')?'png':'jpg';
  const safe=String(user.EmployeeID||user.Username||user.UserID||'user').replace(/[^A-Za-z0-9_-]/g,'_');
  const fileName='VISTA-USER-'+safe+'-'+Utilities.formatDate(new Date(),tz_(),'yyyyMMdd-HHmmss')+'.'+ext;
  const file=userPhotoFolder_().createFile(Utilities.newBlob(bytes,m[1],fileName));
  return{fileId:file.getId(),fileName:fileName,url:'https://drive.google.com/file/d/'+file.getId()+'/view'};
}
function getUserPhotoAuthorized_(p,session){
  let target=session;
  const requested=String(p.userId||'').trim();
  if(requested&&requested!==String(session.UserID||'')){
    requirePermission_(session,'manageUsers');target=findUserById_(requested).obj;
  }
  const fileId=String(target.UserPhotoFileId||'').trim();
  if(!fileId)return{ok:true,hasPhoto:false};
  try{
    const file=DriveApp.getFileById(fileId),blob=file.getBlob(),mime=blob.getContentType()||'image/jpeg';
    return{ok:true,hasPhoto:true,dataUrl:'data:'+mime+';base64,'+Utilities.base64Encode(blob.getBytes()),fileName:String(target.UserPhotoFileName||file.getName())};
  }catch(err){return{ok:true,hasPhoto:false,error:'Stored user photo could not be read.'};}
}

function findUserById_(userId){const sheet=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.USERS),data=sheet.getDataRange().getValues(),h=data[0],idx=h.indexOf('UserID');for(let i=1;i<data.length;i++)if(String(data[i][idx])===String(userId))return{sheet:sheet,row:i+1,obj:h.reduce((o,k,j)=>(o[k]=data[i][j],o),{})};throw new Error('VISTA user was not found.');}
function updateSessionsForUser_(user){
  const sheet=SpreadsheetApp.getActive().getSheetByName(FE.SHEETS.SESSIONS);if(!sheet||sheet.getLastRow()<2)return;
  const data=sheet.getDataRange().getValues(),headers=data[0],idCol=headers.indexOf('UserID'),usernameCol=headers.indexOf('Username'),roleCol=headers.indexOf('Role');
  for(let i=1;i<data.length;i++)if(String(data[i][idCol]||'')===String(user.UserID||'')){
    if(usernameCol>=0)sheet.getRange(i+1,usernameCol+1).setValue(user.Username||'');
    if(roleCol>=0)sheet.getRange(i+1,roleCol+1).setValue(user.Role||'');
  }
}
function setVistaUserActive_(p,session){validateRequired_(p,['userId']);const found=findUserById_(p.userId);if(String(found.obj.UserID)===String(session.UserID)&&p.active===false)throw new Error('You cannot disable your own signed-in account.');const updated=Object.assign({},found.obj,{Active:p.active===false?'No':'Yes'});updateObjectRow_(FE.SHEETS.USERS,found.row,{Active:updated.Active});syncSponsorDirectoryFromUser_(updated,found.obj);audit_(session,p.active===false?'ADMIN_USER_DISABLE':'ADMIN_USER_ENABLE','','','Success',found.obj.Username);return{ok:true};}
function resetVistaUserPin_(p,session){validateRequired_(p,['userId','pin']);if(String(p.pin).length<4)throw new Error('PIN must contain at least four characters.');const found=findUserById_(p.userId),username=String(found.obj.Username||'').trim().toLowerCase();updateObjectRow_(FE.SHEETS.USERS,found.row,{PINHash:pinHash_(username,String(p.pin)),FailedLoginCount:0});audit_(session,'ADMIN_PIN_RESET','','','Success',username);return{ok:true};}
function unlockVistaUserAccountAuthorized_(p,session){validateRequired_(p,['userId']);const found=findUserById_(p.userId),username=String(found.obj.Username||'').trim().toLowerCase();updateObjectRow_(FE.SHEETS.USERS,found.row,{FailedLoginCount:0});audit_(session,'ADMIN_ACCOUNT_UNLOCK','','','Success',username);return{ok:true,message:'Account unlocked. The existing PIN was not changed.'};}
function deleteVistaUser_(p,session){validateRequired_(p,['userId']);const found=findUserById_(p.userId);if(String(found.obj.UserID)===String(session.UserID))throw new Error('You cannot delete your own signed-in account.');if(isAdminRole_(found.obj.Role)){const admins=readObjects_(FE.SHEETS.USERS).filter(u=>truthyActive_(u.Active)&&isAdminRole_(u.Role));if(admins.length<=1)throw new Error('The final active administrator cannot be deleted.');}syncSponsorDirectoryFromUser_(Object.assign({},found.obj,{Role:'Read Only',Active:'No'}),found.obj);found.sheet.deleteRow(found.row);audit_(session,'ADMIN_USER_DELETE','','','Success',found.obj.Username);return{ok:true};}
function listVistaAudit_(p,session){let rows=readObjects_(FE.SHEETS.AUDIT);const q=String(p.query||'').toLowerCase();if(q)rows=rows.filter(r=>Object.values(r).join(' ').toLowerCase().includes(q));rows=rows.slice(-Math.min(500,Math.max(25,Number(p.limit||100)))).reverse();return{ok:true,events:rows.map(r=>({auditId:String(r.AuditID||''),timestamp:dateText_(r.Timestamp),username:String(r.Username||''),role:String(r.Role||''),action:String(r.Action||''),result:String(r.Result||''),details:String(r.Details||'')}))};}
function dateText_(value){if(!value)return'';try{return Utilities.formatDate(new Date(value),tz_(),'yyyy-MM-dd HH:mm:ss')}catch(e){return String(value)}}

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
    for(let i=1;i<rows.length;i++)if(String(rows[i][0]).trim()===key){if(String(rows[i][1]||'').trim()==='')sheet.getRange(i+1,2).setValue(defaults[key]);found=true;break;}
    if(!found)sheet.appendRow([key,defaults[key]]);
  });
  cleanupExpiredVistaSessions();
  return 'VISTA security defaults verified without replacing configured values.';
}
