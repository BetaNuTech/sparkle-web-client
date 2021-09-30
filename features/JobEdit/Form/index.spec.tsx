/* eslint-disable @typescript-eslint/no-empty-function */
import sinon from 'sinon';
import {
  render as rtlRender,
  screen,
  fireEvent,
  act
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Context as ResponsiveContext } from 'react-responsive';
import {
  openImprovementJob,
  approvedImprovementJob,
  authorizedImprovementJob,
  completeImprovementJob,
  approvedMaintenanceJob,
  approvedExpeditedMaintenanceJob
} from '../../../__mocks__/jobs';
import { photoAttachment } from '../../../__mocks__/attachments';
import { fullProperty } from '../../../__mocks__/properties';
import bids, { approvedBid, openBid } from '../../../__mocks__/bids';
import { admin as user, noAccess } from '../../../__mocks__/users';
import breakpoints from '../../../config/breakpoints';
import jobsConfig from '../../../config/jobs';
import JobForm from './index';

function render(ui: any, options: any = {}) {
  sinon.restore();

  const contextWidth = options.contextWidth || breakpoints.desktop.minWidth;
  return rtlRender(
    <ResponsiveContext.Provider value={{ width: contextWidth }}>
      {ui}
    </ResponsiveContext.Provider>,
    options
  );
}

const apiState = {
  isLoading: false,
  statusCode: 0,
  response: {}
};

describe('Unit | Features | Job Edit | Form', () => {
  it('renders only mobile content for mobile devices', () => {
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      user,
      bids,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const desktopHeader = screen.queryByTestId('jobedit-header');
    const desktopForm = screen.queryByTestId('desktop-form');

    // Mobile footer form cancel button
    const mobileFormCancel = screen.queryByTestId('mobile-form-cancel');

    expect(desktopHeader).toBeNull();
    expect(desktopForm).toBeNull();
    expect(mobileFormCancel).toBeTruthy();
  });

  it('renders only desktop content for desktop devices', () => {
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      user,
      bids,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const desktopHeader = screen.queryByTestId('jobedit-header');
    const desktopForm = screen.queryByTestId('desktop-form');

    const mobileFormCancel = screen.queryByTestId('mobile-form-cancel');

    expect(mobileFormCancel).toBeNull();

    // Desktop controls
    expect(desktopHeader).toBeTruthy();
    expect(desktopForm).toBeTruthy();
  });

  it('renders submit button in header for desktop', () => {
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      user,
      bids,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const headerSubmitButton = screen.queryByTestId('jobedit-header-submit');

    // Check link is correct
    expect(headerSubmitButton).toBeTruthy();
  });

  it('renders cancel button that links to property jobs for desktop', () => {
    const expected = `/properties/${fullProperty.id}/jobs`;
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      user,
      bids,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const result = screen.queryByTestId('jobedit-header-cancel');
    const actual = result && result.getAttribute('href');
    expect(actual).toEqual(expected);
  });

  it('renders cancel button at bottom of form that links to property jobs for mobile', () => {
    const expected = `/properties/${fullProperty.id}/jobs`;
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      user,
      bids,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const result = screen.queryByTestId('mobile-form-cancel');
    const actual = result && result.getAttribute('href');
    expect(actual).toEqual(expected);
  });

  it('renders cancel button in header that links to property jobs for mobile', () => {
    const expected = `/properties/${fullProperty.id}/jobs`;
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      user,
      bids,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const result = screen.queryByTestId('dropdown-header-cancel');
    const resultLink = result && result.querySelector('a');
    const actual = resultLink && resultLink.getAttribute('href');
    expect(actual).toEqual(expected);
  });

  it('renders submit button below form', () => {
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      user,
      bids,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const headerSubmitButton = screen.queryByTestId('job-form-submit');

    // Check link is correct
    expect(headerSubmitButton).toBeTruthy();
  });

  it('should allow all job type options to be selected', () => {
    const expected = Object.keys(jobsConfig.types)
      .map((jt) => jobsConfig.types[jt])
      .join(' | ');
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      user,
      bids,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const selectJobType = screen.queryByTestId('job-form-type');
    const jobTypeOptions = selectJobType.querySelectorAll('option');
    const textContentList = [];

    // Push text content of options
    jobTypeOptions.forEach((o) => textContentList.push(o.textContent));

    const actual = textContentList.join(' | ');

    expect(actual).toEqual(expected);
  });

  it('should show title on top of form on mobile', () => {
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      user,
      bids,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const mobileTitle = screen.queryByTestId('job-form-title-mobile');

    expect(mobileTitle).toBeTruthy();
  });

  it('should not show state and next action on new form', () => {
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: true,
      user,
      bids,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const formEditState = screen.queryByTestId('job-form-edit-state');
    const formEditNextStatus = screen.queryByTestId('job-form-edit-nextstatus');

    expect(formEditState).toBeNull();
    expect(formEditNextStatus).toBeNull();
  });

  it('should show Approval word when job in open state', () => {
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      user,
      bids,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const formEditState = screen.queryByTestId('job-form-edit-state');
    const formEditNextStatus = screen.queryByTestId('job-form-edit-nextstatus');

    // Check if the elements are present
    expect(formEditState).toBeTruthy();
    expect(formEditNextStatus).toBeTruthy();

    const expectedState = 'Open';
    const expectedNextStatus = 'Approval';

    const actualState = formEditState.textContent;
    const actualNextStatus = formEditNextStatus.textContent;

    // Check the values are shown correctly
    expect(actualState).toEqual(expectedState);
    expect(actualNextStatus).toEqual(expectedNextStatus);
  });

  it('should show Authorization word when job in approved state', () => {
    const props = {
      job: approvedImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      user,
      bids,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const formEditState = screen.queryByTestId('job-form-edit-state');
    const formEditNextStatus = screen.queryByTestId('job-form-edit-nextstatus');

    // Check if the elements are present
    expect(formEditState).toBeTruthy();
    expect(formEditNextStatus).toBeTruthy();

    const expectedState = 'Approved';
    const expectedNextStatus = 'Authorization';

    const actualState = formEditState.textContent;
    const actualNextStatus = formEditNextStatus.textContent;

    // Check the values are shown correctly
    expect(actualState).toEqual(expectedState);
    expect(actualNextStatus).toEqual(expectedNextStatus);
  });

  it('should show Completed Bid word when job in authorized state', () => {
    const props = {
      job: authorizedImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      user,
      bids,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const formEditState = screen.queryByTestId('job-form-edit-state');
    const formEditNextStatus = screen.queryByTestId('job-form-edit-nextstatus');

    // Check if the elements are present
    expect(formEditState).toBeTruthy();
    expect(formEditNextStatus).toBeTruthy();

    const expectedState = 'Authorized';
    const expectedNextStatus = 'Completed Bid';

    const actualState = formEditState.textContent;
    const actualNextStatus = formEditNextStatus.textContent;

    // Check the values are shown correctly
    expect(actualState).toEqual(expectedState);
    expect(actualNextStatus).toEqual(expectedNextStatus);
  });

  it('should not show action required box when job in complete state', () => {
    const props = {
      job: completeImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      user,
      bids,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const formEditState = screen.queryByTestId('job-form-edit-state');
    const formEditNextStatus = screen.queryByTestId('job-form-edit-nextstatus');

    // Check if the elements are present
    expect(formEditState).toBeTruthy();

    // It should be null as we are not showing this
    expect(formEditNextStatus).toBeNull();

    const expectedState = 'Complete';

    const actualState = formEditState.textContent;

    // Check the values are shown correctly
    expect(actualState).toEqual(expectedState);
  });

  it('should not show submit button when job in complete state', () => {
    const props = {
      job: completeImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      user,
      bids,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const formSubmitBtn = screen.queryByTestId('job-form-submit');

    // It should be null as we are not showing this when job is complete
    expect(formSubmitBtn).toBeNull();
  });

  it('should restrict changing value of form when job state is complete', () => {
    const props = {
      job: completeImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      user,
      bids,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const formTitle = screen.queryByTestId('job-form-title');
    const formDescription = screen.queryByTestId('job-form-description');
    const formType = screen.queryByTestId('job-form-type');
    const formScope = screen.queryByTestId('job-form-scope');

    // It should be disabled when job is complete
    expect(formTitle.hasAttribute('disabled')).toBe(true);
    expect(formDescription.hasAttribute('disabled')).toBe(true);
    expect(formType.hasAttribute('disabled')).toBe(true);
    expect(formScope.hasAttribute('disabled')).toBe(true);
  });

  it('should show error message when authorized job has empty title, need, or scope', async () => {
    const props = {
      job: authorizedImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      uploadState: false,
      jobAttachments: [],
      setDeleteAttachmentPromptVisible: () => {},
      isDeleteAttachmentPromptVisible: false,
      confirmAttachmentDelete: () => Promise.resolve(),
      deleteAtachmentLoading: false,
      sendNotification: () => {},
      setDeleteTrelloCardPromptVisible: () => {},
      isDeleteTrelloCardPromptVisible: false,
      onFileChange: () => {},
      user,
      bids,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    await act(async () => {
      render(<JobForm {...props} />, {
        contextWidth: breakpoints.tablet.maxWidth
      });

      const formTitle = screen.queryByTestId('job-form-title');
      const formDescription = screen.queryByTestId(
        'job-form-description'
      ) as HTMLTextAreaElement;
      const formScope = screen.queryByTestId('job-form-scope');
      // Set empty value for need
      await fireEvent.change(formTitle, { target: { value: '' } });

      // Set empty value for need
      await fireEvent.change(formDescription, { target: { value: '' } });

      // Set empty value for scope
      await fireEvent.change(formScope, { target: { value: '' } });

      const [submit] = await screen.findAllByTestId('job-form-submit');
      await userEvent.click(submit);
    });

    const errorTitle = screen.queryByTestId('error-label-title');
    const errorNeed = screen.queryByTestId('error-label-need');
    const errorScope = screen.queryByTestId('error-label-scopeOfWork');

    // It should be true because error message will come as they are required
    expect(errorTitle).toBeTruthy();
    expect(errorNeed).toBeTruthy();
    expect(errorScope).toBeTruthy();
  });

  it('should show approve button when job is in open state and scope of work provided', () => {
    const job = JSON.parse(JSON.stringify(openImprovementJob));
    const props = {
      job,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      user,
      bids,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const btnApprove = screen.queryByTestId('job-form-approve');

    // Check if the elements are present
    expect(btnApprove).toBeTruthy();
  });

  it('should show authorize button when expedited job is approved and has only bid that is approved', () => {
    const props = {
      job: approvedExpeditedMaintenanceJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      user,
      bids: [{ ...approvedBid }],
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const btnAuthorize = screen.queryByTestId('job-form-authorize');

    // Check if the elements are present
    expect(btnAuthorize).toBeTruthy();
  });

  it('should show authorize button if job is approved & has 3 bids with one that is approved', () => {
    const props = {
      job: approvedImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      user,
      bids,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const btnAuthorize = screen.queryByTestId('job-form-authorize');

    // Check if the elements are present
    expect(btnAuthorize).toBeTruthy();
  });

  it('should not show expedite button if user is not admin', () => {
    const props = {
      job: approvedImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      user: { ...noAccess },
      bids,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: () => {}
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const btnExpedite = screen.queryByTestId('job-form-expedite');

    // Check if the button is not present
    expect(btnExpedite).toBeNull();
  });

  it('should request to transition job to approved when approve button selected', async () => {
    const putReq = sinon.spy();
    const expected = 'approved';
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      user: { ...noAccess },
      bids,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: putReq
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    await act(async () => {
      const btnApprove = screen.queryByTestId('job-form-approve');
      await userEvent.click(btnApprove);
    });

    // Send update request
    const result = putReq.called ? putReq.getCall(0).args[2] : {};
    const actual = result.state || '';
    expect(actual).toEqual(expected);
  });

  it('should request to transition job to authorized when authorize button selected', async () => {
    const putReq = sinon.spy();
    const expected = 'authorized';
    const props = {
      job: approvedImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      user: { ...noAccess },
      bids,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: putReq
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    await act(async () => {
      const btnAuthorize = screen.queryByTestId('job-form-authorize');
      await userEvent.click(btnAuthorize);
    });

    // Send update request
    const result = putReq.called ? putReq.getCall(0).args[2] : {};
    const actual = result.state || '';
    expect(actual).toEqual(expected);
  });

  it('should request to transition job to expedite when expedite button selected', async () => {
    const putReq = sinon.spy();
    const expected = 'expedite';
    const props = {
      job: approvedImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      user: { ...user },
      bids,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: putReq,
      onFileChange: () => {},
      uploadState: false,
      jobAttachments: [photoAttachment],
      setDeleteAttachmentPromptVisible: () => {},
      isDeleteAttachmentPromptVisible: false,
      confirmAttachmentDelete: () => Promise.resolve(),
      deleteAtachmentLoading: false,
      sendNotification: () => {},
      setDeleteTrelloCardPromptVisible: () => {},
      isDeleteTrelloCardPromptVisible: false
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    await act(async () => {
      const btnExpedite = screen.queryByTestId('job-form-expedite');
      await userEvent.click(btnExpedite);
    });

    // Send update request
    const result = putReq.called ? putReq.getCall(0).args[2] : {};
    const actual = result.authorizedRules || '';
    expect(actual).toEqual(expected);
  });

  it('should show add trello card button', async () => {
    const putReq = sinon.spy();
    const props = {
      job: approvedImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      user: { ...user },
      bids,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: putReq,
      onFileChange: () => {},
      uploadState: false,
      jobAttachments: [photoAttachment],
      setDeleteAttachmentPromptVisible: () => {},
      isDeleteAttachmentPromptVisible: false,
      confirmAttachmentDelete: () => Promise.resolve(),
      deleteAtachmentLoading: false,
      sendNotification: () => {},
      setDeleteTrelloCardPromptVisible: () => {},
      isDeleteTrelloCardPromptVisible: false
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const btnAddTrelloCard = screen.queryByTestId('add-trello-card-btn');
    expect(btnAddTrelloCard).toBeTruthy();
    const elTrelloCard = screen.queryByTestId('trello-card-pill');
    expect(elTrelloCard).toBeNull();
  });

  it('should show trello card if trello card url is there', async () => {
    const putReq = sinon.spy();
    const props = {
      job: approvedMaintenanceJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      user: { ...user },
      bids,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: putReq,
      onFileChange: () => {},
      uploadState: false,
      jobAttachments: [photoAttachment],
      setDeleteAttachmentPromptVisible: () => {},
      isDeleteAttachmentPromptVisible: false,
      confirmAttachmentDelete: () => Promise.resolve(),
      deleteAtachmentLoading: false,
      sendNotification: () => {},
      setDeleteTrelloCardPromptVisible: () => {},
      isDeleteTrelloCardPromptVisible: false
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const elTrelloCard = screen.queryByTestId('trello-card-pill');
    expect(elTrelloCard).toBeTruthy();
    const btnAddTrelloCard = screen.queryByTestId('add-trello-card-btn');
    expect(btnAddTrelloCard).toBeNull();
  });

  it('should show bid add if no bids are present', async () => {
    const putReq = sinon.spy();
    const props = {
      job: approvedMaintenanceJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      user: { ...user },
      bids: [],
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: putReq,
      onFileChange: () => {},
      uploadState: false,
      jobAttachments: [photoAttachment],
      setDeleteAttachmentPromptVisible: () => {},
      isDeleteAttachmentPromptVisible: false,
      confirmAttachmentDelete: () => Promise.resolve(),
      deleteAtachmentLoading: false,
      sendNotification: () => {},
      setDeleteTrelloCardPromptVisible: () => {},
      isDeleteTrelloCardPromptVisible: false
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const elAddBidCard = screen.queryByTestId('add-bid-card-btn');
    const elEditBidCard = screen.queryAllByTestId('bid-edit-card-pill');
    expect(elAddBidCard).toBeTruthy();
    expect(elEditBidCard.length).toEqual(0);
  });

  it('should show bid list cards if bids are present', async () => {
    const putReq = sinon.spy();
    const props = {
      job: approvedMaintenanceJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      user: { ...user },
      bids,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: putReq,
      onFileChange: () => {},
      uploadState: false,
      jobAttachments: [photoAttachment],
      setDeleteAttachmentPromptVisible: () => {},
      isDeleteAttachmentPromptVisible: false,
      confirmAttachmentDelete: () => Promise.resolve(),
      deleteAtachmentLoading: false,
      sendNotification: () => {},
      setDeleteTrelloCardPromptVisible: () => {},
      isDeleteTrelloCardPromptVisible: false
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const elAddBidCard = screen.queryByTestId('add-bid-card-btn');
    const elEditBidCard = screen.queryAllByTestId('bid-edit-card-pill');
    expect(elAddBidCard).toBeNull();
    expect(elEditBidCard.length).toEqual(bids.length);
  });

  it('for open jobs bids button has to be disabled', async () => {
    const putReq = sinon.spy();
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      user: { ...user },
      bids: [],
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: putReq,
      onFileChange: () => {},
      uploadState: false,
      jobAttachments: [photoAttachment],
      setDeleteAttachmentPromptVisible: () => {},
      isDeleteAttachmentPromptVisible: false,
      confirmAttachmentDelete: () => Promise.resolve(),
      deleteAtachmentLoading: false,
      sendNotification: () => {},
      setDeleteTrelloCardPromptVisible: () => {},
      isDeleteTrelloCardPromptVisible: false
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const elAddBidCard = screen.queryByTestId('add-bid-card-btn');
    const elAddBidCardDisabled = screen.queryByTestId(
      'add-bid-card-btn-disabled'
    );
    expect(elAddBidCard).toBeNull();
    expect(elAddBidCardDisabled).toBeTruthy();
  });

  it('should show bid required text if min bids requirement not met', async () => {
    const putReq = sinon.spy();
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      user: { ...user },
      bids: [approvedBid],
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: putReq,
      onFileChange: () => {},
      uploadState: false,
      jobAttachments: [photoAttachment],
      setDeleteAttachmentPromptVisible: () => {},
      isDeleteAttachmentPromptVisible: false,
      confirmAttachmentDelete: () => Promise.resolve(),
      deleteAtachmentLoading: false,
      sendNotification: () => {},
      setDeleteTrelloCardPromptVisible: () => {},
      onDeleteAttachment: () => {},
      currentAttachment: null,
      isDeleteTrelloCardPromptVisible: false
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const expected = '(+1 bid required)';

    const elBidRequired = screen.queryByTestId('bids-required');
    const elBidRequirementMet = screen.queryByTestId('bids-requirement-met');

    const actual = elBidRequired.textContent;

    expect(elBidRequirementMet).toBeNull();
    expect(elBidRequired).toBeTruthy();
    expect(actual).toEqual(expected);
  });

  it('should show bid requirement met text if min bids requirement met', async () => {
    const putReq = sinon.spy();
    const props = {
      job: openImprovementJob,
      property: fullProperty,
      apiState,
      isOnline: true,
      isStaging: true,
      isNewJob: false,
      user: { ...user },
      bids: [approvedBid, openBid],
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toggleNavOpen: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      postJobCreate: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      putJobUpdate: putReq,
      onFileChange: () => {},
      uploadState: false,
      jobAttachments: [photoAttachment],
      setDeleteAttachmentPromptVisible: () => {},
      isDeleteAttachmentPromptVisible: false,
      confirmAttachmentDelete: () => Promise.resolve(),
      deleteAtachmentLoading: false,
      sendNotification: () => {},
      setDeleteTrelloCardPromptVisible: () => {},
      onDeleteAttachment: () => {},
      currentAttachment: null,
      isDeleteTrelloCardPromptVisible: false
    };

    render(<JobForm {...props} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    const expected = 'Bid requirements met';

    const elBidRequired = screen.queryByTestId('bids-required');
    const [elBidRequirementMet] = screen.queryAllByTestId(
      'bids-requirement-met'
    );

    const actual = elBidRequirementMet.textContent;

    expect(elBidRequired).toBeNull();
    expect(elBidRequirementMet).toBeTruthy();
    expect(actual).toEqual(expected);
  });
});
