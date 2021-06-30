import firebase from 'firebase/app';
import Handlebars from 'handlebars';
import errorReports from '../api/errorReports';
import currentUser from '../../utils/currentUser';
import { userAgent } from '../../utils/browserSniffer';
import notificationModel from '../../models/notification';

const PREFIX = 'services: api: globalNotifications:';
const COLLECTION_NAME = 'notifications';
const IS_STAGING: boolean = process.env.NEXT_PUBLIC_STAGING === 'true';

// Is incognito model enabled
// True: prevent all notifications
// False: default behavior
let isIncognitoMode = false;
// eslint-disable-next-line
export const setIncognitoMode = (update): boolean =>
  (isIncognitoMode = Boolean(update));

// Write a global notification
export const send = async (
  firestore: firebase.firestore.Firestore | any, // any for testing purposes
  query: notificationModel,
  isStaging = IS_STAGING // for testing purposes
): Promise<notificationModel> => {
  const notification = JSON.parse(JSON.stringify(query)); // Clone

  // Set notification's creator from args or fb auth
  const creator = query.creator || currentUser.getId() || ''; // eslint-disable-line
  if (!creator) {
    throw Error(`${PREFIX} send: invoked without user session`);
  }
  notification.creator = creator;

  // Abandon when in incognito mode
  if (isIncognitoMode) {
    return Promise.resolve(notification);
  }

  // Prepend staging title prefix
  if (isStaging) {
    notification.title = `[STAGING] ${notification.title || ''}`;
  }

  // Add Optional User Agent
  try {
    notification.userAgent = userAgent;
  } catch (err) {} // eslint-disable-line no-empty

  // Write notification to Firestore
  return firestore
    .collection(COLLECTION_NAME)
    .add(notification)
    .then(() => notification)
    .catch((err) => {
      const wrappedErr = Error(
        `${PREFIX} send: failed to add firestore notification "${notification.title}": ${err}`
      );

      /* eslint-disable */
      console.error(wrappedErr);
      errorReports.send(wrappedErr);
      /* eslint-enable */

      return Promise.reject(wrappedErr);
    });
};

/* eslint-disable */
const templates = {
  //
  // Property Creation
  //
  'property-creation-summary': Handlebars.compile(
    '{{name}} created{{#if authorName}} by {{{authorName}}}{{/if}}'
  ),

  'property-creation-markdown-body': Handlebars.compile(`\`\`\`
{{#if name}}Name: {{{name}}}{{/if}}
{{#if addr1}}Addr1: {{{addr1}}}{{/if}}
{{#if addr2}}Addr2: {{{addr2}}}{{/if}}
{{#if city}}City: {{{city}}}{{/if}}
{{#if state}}State: {{{state}}}{{/if}}
{{#if zip}}zipcode: {{{zip}}}{{/if}}
{{#if teamName}}Team: {{{teamName}}}{{/if}}
{{#if code}}Cobalt Property Code: {{{code}}}{{/if}}
{{#if slackChannel}}Slack Channel: {{{slackChannel}}}{{/if}}
{{#if templateNames}}Templates: {{{templateNames}}}{{/if}}
{{#if bannerPhotoURL}}bannerPhotoURL: {{{bannerPhotoURL}}}{{/if}}
{{#if photoURL}}photoURL: {{{photoURL}}}{{/if}}
\`\`\`
*Created by*:{{#if authorName}} {{{authorName}}}{{/if}} ({{{authorEmail}}})`),

  //
  // Property Update
  //

  'property-update-summary': Handlebars.compile(
    '{{name}} updated{{#if authorName}} by {{{authorName}}}{{/if}}'
  ),

  'property-update-markdown-body': Handlebars.compile(`Previous Data:
\`\`\`
{{#if previousName}}Name: {{{previousName}}}{{/if}}
{{#if previousAddr1}}Addr1: {{{previousAddr1}}}{{/if}}
{{#if previousAddr2}}Addr2: {{{previousAddr2}}}{{/if}}
{{#if previousCity}}City: {{{previousCity}}}{{/if}}
{{#if previousState}}State: {{{previousState}}}{{/if}}
{{#if previousZip}}zipcode: {{{previousZip}}}{{/if}}
{{#if previousTeamName}}Team: {{{previousTeamName}}}{{/if}}
{{#if previousCode}}Cobalt Property Code: {{{previousCode}}}{{/if}}
{{#if previousSlackChannel}}Slack Channel: {{{previousSlackChannel}}}{{/if}}
{{#if previousTemplateNames}}Templates: {{{previousTemplateNames}}}{{/if}}
{{#if previousBannerPhotoURL}}bannerPhotoURL: {{{previousBannerPhotoURL}}}{{/if}}
{{#if previousPhotoURL}}photoURL: {{{previousPhotoURL}}}{{/if}}
\`\`\`
New Data:
\`\`\`
{{#if currentName}}Name: {{{currentName}}}{{/if}}
{{#if currentAddr1}}Addr1: {{{currentAddr1}}}{{/if}}
{{#if currentAddr2}}Addr2: {{{currentAddr2}}}{{/if}}
{{#if currentCity}}City: {{{currentCity}}}{{/if}}
{{#if currentState}}State: {{{currentState}}}{{/if}}
{{#if currentZip}}zipcode: {{{currentZip}}}{{/if}}
{{#if currentTeamName}}Team: {{{currentTeamName}}}{{/if}}
{{#if currentCode}}Cobalt Property Code: {{{currentCode}}}{{/if}}
{{#if currentSlackChannel}}Slack Channel: {{{currentSlackChannel}}}{{/if}}
{{#if currentTemplateNames}}Templates: {{{currentTemplateNames}}}{{/if}}
{{#if currentBannerPhotoURL}}bannerPhotoURL: {{{currentBannerPhotoURL}}}{{/if}}
{{#if currentPhotoURL}}photoURL: {{{currentPhotoURL}}}{{/if}}
\`\`\`

*Edited by*:{{#if authorName}} {{{authorName}}}{{/if}} ({{{authorEmail}}})`),

  //
  // Property Deletion
  //

  'property-delete-summary': Handlebars.compile(
    '{{{name}}} deleted{{#if authorName}} by {{{authorName}}}{{/if}}'
  ),

  'property-delete-markdown-body': Handlebars.compile(`\`{{{name}}} deleted\`
*Deleted by*:{{#if authorName}} {{{authorName}}}{{/if}} ({{{authorEmail}}})`),

  //
  // Template Creation
  //

  'template-creation-summary': Handlebars.compile(
    '{{{name}}} created{{#if authorName}} by {{{authorName}}}{{/if}}'
  ),

  'template-creation-markdown-body': Handlebars.compile(`\`\`\`
{{#if name}}Name: {{{name}}}{{/if}}
{{#if description}}Description: {{{description}}}{{/if}}
{{#if category}}Category: {{{category}}}{{/if}}
{{#if sectionsCount}}# of section(s): {{{sectionsCount}}}{{/if}}
{{#if itemsCount}}# of item(s): {{{itemsCount}}}{{/if}}
\`\`\`
*Created by*:{{#if authorName}} {{{authorName}}}{{/if}} ({{{authorEmail}}})`),

  //
  // Template Update
  //

  'template-update-summary': Handlebars.compile(
    '{{{name}}} updated{{#if authorName}} by {{{authorName}}}{{/if}}'
  ),

  'template-update-markdown-body': Handlebars.compile(`Previous Data:
\`\`\`
{{#if previousName}}Name: {{{previousName}}}{{/if}}
{{#if previousDescription}}Description: {{{previousDescription}}}{{/if}}
{{#if previousCategory}}Category: {{{previousCategory}}}{{/if}}
{{#if previousSectionsCount}}# of section(s): {{{previousSectionsCount}}}{{/if}}
{{#if previousItemsCount}}# of item(s): {{{previousItemsCount}}}{{/if}}
\`\`\`
New Data:
\`\`\`
{{#if currentName}}Name: {{{currentName}}}{{/if}}
{{#if currentDescription}}Description: {{{currentDescription}}}{{/if}}
{{#if currentCategory}}Category: {{{currentCategory}}}{{/if}}
{{#if currentSectionsCount}}# of section(s): {{{currentSectionsCount}}}{{/if}}
{{#if currentItemsCount}}# of item(s): {{{currentItemsCount}}}{{/if}}
\`\`\`
*Edited by*:{{#if authorName}} {{{authorName}}}{{/if}} ({{{authorEmail}}})`),

  //
  // Template Deletion
  //

  'template-delete-summary': Handlebars.compile(
    '{{{name}}} deleted{{#if authorName}} by {{{authorName}}}{{/if}}'
  ),

  'template-delete-markdown-body': Handlebars.compile(`\`{{{name}}} deleted\`
*Deleted by*:{{#if authorName}} {{{authorName}}}{{/if}} ({{{authorEmail}}})`),

  //
  // Trello Settings Change for Property
  //

  'property-trello-integration-update-summary': Handlebars.compile(
    'Trello Settings updated{{#if authorName}} by {{{authorName}}}{{/if}}'
  ),

  'property-trello-integration-update-markdown-body':
    Handlebars.compile(`*Trello Settings updated*

Previous Settings:
\`\`\`
Deficient Items, OPEN Board: {{{previousOpenBoard}}}
Deficient Items, OPEN List: {{{previousOpenList}}}
Deficient Items, CLOSED Board: {{{previousClosedBoard}}}
Deficient Items, CLOSED List: {{{previousClosedList}}}
\`\`\`
New Settings:
\`\`\`
Deficient Items, OPEN Board: {{{currentOpenBoard}}}
Deficient Items, OPEN List: {{{currentOpenList}}}
Deficient Items, CLOSED Board: {{{currentClosedBoard}}}
Deficient Items, CLOSED List: {{{currentClosedList}}}

\`\`\`
*Updated by*:{{#if authorName}} {{{authorName}}}{{/if}} ({{{authorEmail}}})`),

  //
  // Property Deficient Item - State Update
  //

  'deficient-item-state-change-summary': Handlebars.compile(
    'Deficient Item: {{{title}}} moved from {{{previousState}}} to {{{state}}}{{#if authorName}} by {{{authorName}}}{{/if}}'
  ),

  'deficient-item-state-change-markdown-body':
    Handlebars.compile(`Deficient Item moved{{#if previousState}} from *{{{previousState}}}*{{/if}}{{#if state}} to state *{{{state}}}*.{{/if}}

\`\`\`
{{#if title}}Title: {{{title}}}{{/if}}
{{#if section}}Section: {{{section}}}{{/if}}
{{#if subSection}}Sub-section: {{{subSection}}}{{/if}}
{{#if currentDeferredDateDay}}Deferred Due Date: {{{currentDeferredDateDay}}}{{else}}{{#if currentDueDateDay}}Due Date: {{{currentDueDateDay}}}{{/if}}{{/if}}
{{#if currentPlanToFix}}Plan to fix: {{{currentPlanToFix}}}{{/if}}
{{#if currentResponsibilityGroup}}Responsibility Group: {{{currentResponsibilityGroup}}}{{/if}}
\`\`\`{{#if currentProgressNote}}
\`\`\`
Progress Note{{#if progressNoteDateDay}} ({{{progressNoteDateDay}}}){{/if}}: {{{currentProgressNote}}}
\`\`\`{{/if}}{{#if currentCompleteNowReason}}
\`\`\`
Complete Now Reason: {{{currentCompleteNowReason}}}
\`\`\`{{/if}}{{#if currentReasonIncomplete}}
\`\`\`
Reason Incomplete: {{{currentReasonIncomplete}}}
\`\`\`{{/if}}
Deficient Item: {{{url}}}{{#if trelloUrl}}

Trello Card: {{{trelloUrl}}}{{/if}}

*Updated by*:{{#if authorName}} {{{authorName}}}{{/if}} ({{{authorEmail}}})`),

  //
  // Property Deficient Item - Non-State Update
  //

  'deficient-item-update-summary': Handlebars.compile(
    'Deficient Item: {{{title}}} updated{{#if authorName}} by {{{authorName}}}{{/if}}'
  ),

  'deficient-item-update-markdown-body':
    Handlebars.compile(`*Deficient Item Updated*

\`\`\`
{{#if title}}Title: {{{title}}}{{/if}}
{{#if section}}Section: {{{section}}}{{/if}}
{{#if subSection}}Sub-section: {{{subSection}}}{{/if}}
{{#if currentDeferredDateDay}}Deferred Due Date: {{{currentDeferredDateDay}}}{{else}}{{#if currentDueDateDay}}Due Date: {{{currentDueDateDay}}}{{/if}}{{/if}}
{{#if currentPlanToFix}}Plan to fix: {{{currentPlanToFix}}}{{/if}}
{{#if currentResponsibilityGroup}}Responsibility Group: {{{currentResponsibilityGroup}}}{{/if}}
\`\`\`{{#if currentProgressNote}}
\`\`\`
Progress Note{{#if progressNoteDateDay}} ({{{progressNoteDateDay}}}){{/if}}: {{{currentProgressNote}}}
\`\`\`{{/if}}{{#if currentCompleteNowReason}}
\`\`\`
Complete Now Reason: {{{currentCompleteNowReason}}}
\`\`\`{{/if}}{{#if currentReasonIncomplete}}
\`\`\`
Reason Incomplete: {{{currentReasonIncomplete}}}
\`\`\`{{/if}}
Deficient Item: {{{url}}}{{#if trelloUrl}}

Trello Card: {{{trelloUrl}}}{{/if}}

*Updated by*:{{#if authorName}} {{{authorName}}}{{/if}} ({{{authorEmail}}})`),

  //
  // Property Deficient Item - Progress Note
  //

  'deficient-item-progress-note-markdown-body':
    Handlebars.compile(`Progress Note just added to Deficient Item.

\`\`\`
{{#if title}}Title: {{{title}}}{{/if}}
{{#if section}}Section: {{{section}}}{{/if}}
{{#if subSection}}Sub-section: {{{subSection}}}{{/if}}
{{#if dueDateDay}}Due Date: {{{dueDateDay}}}{{/if}}
{{#if currentResponsibilityGroup}}Responsibility Group: {{{currentResponsibilityGroup}}}{{/if}}
{{#if currentPlanToFix}}Plan to fix: {{{currentPlanToFix}}}{{/if}}
\`\`\`{{#if progressNote}}
\`\`\`
{{{progressNote}}}
\`\`\`{{/if}}

*Added by*:{{#if authorName}} {{{authorName}}}{{/if}} ({{{authorEmail}}})`),

  //
  // Property Deficient Item - Trello Card Creation
  //

  'deficient-item-trello-card-create-summary': Handlebars.compile(
    'Trello card created for Deficient Item: {{{title}}}{{#if authorName}} by {{{authorName}}}{{/if}}'
  ),

  'deficient-item-trello-card-create-markdown-body':
    Handlebars.compile(`*Trello card created for deficient item.*

\`\`\`
{{#if title}}Title: {{{title}}}{{/if}}
{{#if section}}Section: {{{section}}}{{/if}}
{{#if subSection}}Sub-section: {{{subSection}}}{{/if}}
\`\`\`{{#if trelloCardURL}}

Trello Card: {{{trelloCardURL}}}{{/if}}

*Created by*:{{#if authorName}} {{{authorName}}}{{/if}} ({{{authorEmail}}})`),

  //
  // Template Category Creation
  //

  'template-category-created-summary': Handlebars.compile(
    '{{{name}}} created{{#if authorName}} by {{{authorName}}}{{/if}}'
  ),

  'template-category-created-markdown-body': Handlebars.compile(`\`\`\`
{{#if name}}Name: {{{name}}}{{/if}}
\`\`\`
*Created by*:{{#if authorName}} {{{authorName}}}{{/if}} ({{{authorEmail}}})`),

  //
  // Template Category Update
  //

  'template-category-update-summary': Handlebars.compile(
    '{{{previousName}}} updated to {{{name}}}{{#if authorName}} by {{{authorName}}}{{/if}}'
  ),

  'template-category-update-markdown-body': Handlebars.compile(`Previous Data:
\`\`\`
Name: {{{previousName}}}
\`\`\`
New Data:
\`\`\`
Name: {{{name}}}
\`\`\`
*Edited by*:{{#if authorName}} {{{authorName}}}{{/if}} ({{{authorEmail}}})`),

  //
  // Template Category Deletion
  //

  'template-category-delete-summary': Handlebars.compile(
    '{{{name}}} deleted{{#if authorName}} by {{{authorName}}}{{/if}}'
  ),

  'template-category-delete-markdown-body':
    Handlebars.compile(`\`{{{name}}} deleted\`
*Deleted by*:{{#if authorName}} {{{authorName}}}{{/if}} ({{{authorEmail}}})`),

  //
  // Team Creation
  //

  'team-created-summary': Handlebars.compile(
    '{{{name}}} created{{#if authorName}} by {{{authorName}}}{{/if}}'
  ),

  'team-created-markdown-body': Handlebars.compile(`\`\`\`
Name: {{{name}}}
\`\`\`
*Created by*:{{#if authorName}} {{{authorName}}}{{/if}} ({{{authorEmail}}})`),

  //
  // Team Update
  //

  'team-update-summary': Handlebars.compile(
    '{{{previousName}}} updated to {{{name}}}{{#if authorName}} by {{{authorName}}}{{/if}}'
  ),

  'team-update-markdown-body': Handlebars.compile(`Previous Data:
\`\`\`
Name: {{{previousName}}}
\`\`\`
New Data:
\`\`\`
Name: {{{name}}}
\`\`\`
*Edited by*:{{#if authorName}} {{{authorName}}}{{/if}} ({{{authorEmail}}})`),

  //
  // Team Deletion
  //

  'team-delete-summary': Handlebars.compile(
    'The team {{{name}}} deleted{{#if authorName}} by {{{authorName}}}{{/if}}'
  ),

  'team-delete-markdown-body': Handlebars.compile(`\`{{{name}}} deleted\`
*Deleted by*:{{#if authorName}} {{{authorName}}}{{/if}} ({{{authorEmail}}})`),

  //
  // Property Inspection Completion
  //

  'inspection-completion-summary': Handlebars.compile(
    '{{{completionDate}}} inspection completed by{{#if authorName}} {{{authorName}}}{{/if}} ({{{authorEmail}}}), using {{{templateName}}} template'
  ),

  'inspection-completion-markdown-body':
    Handlebars.compile(`*Inspection Completed*

\`\`\`
{{#if templateName}}Template: {{{templateName}}}{{/if}}
{{#if startDate}}Inspection Start Date: {{{startDate}}}{{/if}}
{{#if score}}Score: {{{score}}}{{/if}}
{{#if deficientItemCount}}# of deficient items: {{{deficientItemCount}}}{{/if}}
\`\`\`{{#if url}}

Inspection: {{{url}}}{{/if}}

*Completed by*: {{#if authorName}} {{{authorName}}}{{/if}} ({{{authorEmail}}})`),

  //
  // Property Inspection Deletion
  //

  'inspection-delete-summary': Handlebars.compile(
    '{{{currentDate}}} inspection deleted{{#if authorName}} by {{{authorName}}}{{/if}}'
  ),

  'inspection-delete-markdown-body': Handlebars.compile(`*Inspection Deletion*

\`Inspection created on {{{startDate}}}, with template: {{{templateName}}}\`

*Deleted by*:{{#if authorName}} {{{authorName}}}{{/if}} ({{{authorEmail}}})`),

  //
  // Property Inspection Reassignment
  //
  'inspection-reassign-summary': Handlebars.compile(
    '{{{currentDate}}} inspection moved{{#if authorName}} by {{{authorName}}}{{/if}}'
  ),

  'inspection-reassign-markdown-body': Handlebars.compile(`*Inspection Moved*

\`Inspection created on {{{startDate}}}, with template: {{{templateName}}} has moved to {{{propertyName}}}\`

*Moved by*:{{#if authorName}} {{{authorName}}}{{/if}} ({{{authorEmail}}})`),

  //
  // User Disabled
  //

  'user-disabled-summary': Handlebars.compile(
    'The account for {{{disabledEmail}}} disabled{{#if authorName}} by {{{authorName}}}{{/if}}'
  ),

  'user-disabled-markdown-body':
    Handlebars.compile(`\`The user account for{{#if disabledName}} {{{disabledName}}}{{/if}} ({{{disabledEmail}}}) disabled.\`
*Disabled by*:{{#if authorName}} {{{authorName}}}{{/if}} ({{{authorEmail}}})`),

  //
  // User Update
  //

  'user-update-summary': Handlebars.compile(
    'The account for {{{userEmail}}} was just updated by{{#if authorName}} by {{{authorName}}}{{/if}}'
  ),

  'user-update-markdown-body': Handlebars.compile(`Previous Data:
\`\`\`
{{#if previousName}}Name: {{{previousName}}}{{/if}}
{{#if previousAdmin}}Admin Access: {{{previousAdmin}}}{{/if}}
{{#if previousCorporate}}Corporate Access: {{{previousCorporate}}}{{/if}}
{{#if previousTeamCount}}Team Level Access Count: {{{previousTeamCount}}}{{/if}}
{{#if previousPropertyCount}}Property Level Access Count: {{{previousPropertyCount}}}{{/if}}
\`\`\`
New Data:
\`\`\`
{{#if currentName}}Name: {{{currentName}}}{{/if}}
{{#if currentAdmin}}Admin Access: {{{currentAdmin}}}{{/if}}
{{#if currentCorporate}}Corporate Access: {{{currentCorporate}}}{{/if}}
{{#if currentTeamCount}}Team Level Access Count: {{{currentTeamCount}}}{{/if}}
{{#if currentPropertyCount}}Property Level Access Count: {{{currentPropertyCount}}}{{/if}}
\`\`\`
*Edited by*:{{#if authorName}} {{{authorName}}}{{/if}} ({{{authorEmail}}})`),

  //
  // User Creation (New User Logged In)
  //

  'user-login-summary': Handlebars.compile(
    '{{{email}}} just signed in for the first time and needs access granted.'
  ),

  'user-login-markdown-body': Handlebars.compile(
    '@channel: `{{{email}}}` just signed in for the first time and needs access granted.'
  )
};
/* eslint-enable */

// Lookup Handlebars template and
// compile a result for a context
// eslint-disable-next-line
export const compileTemplate = (templateName: string, context: any) => {
  const template = templates[templateName];

  if (!template) {
    throw Error(`invalid template name: "${templateName}"`);
  }

  return template(context).replace(/^\s*$[\n\r]{1,}/gm, '');
};

export default { send, setIncognitoMode, compileTemplate };
