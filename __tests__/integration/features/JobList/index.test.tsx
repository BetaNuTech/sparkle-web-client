import sinon from 'sinon';
import { render as rtlRender, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Context as ResponsiveContext } from 'react-responsive';
import { FirebaseAppProvider } from 'reactfire';
import { ToastContainer } from 'react-toastify';
import { admin as user } from '../../../../__mocks__/users';
import { fullProperty } from '../../../../__mocks__/properties';
import mockJobs, {
  openImprovementJob,
  openMaintenanceJob,
  openMaintenanceExpeditedJob,
  approvedImprovementJob,
  approvedMaintenanceJob,
  authorizedImprovementJob,
  authorizedMaintenanceJob,
  completeImprovementJob,
  completeMaintenanceJob
} from '../../../../__mocks__/jobs';
import JobList from '../../../../features/JobList';
import { activeJobSortFilter } from '../../../../features/JobList/utils/jobSorting';
import propertiesApi, {
  propertyResult
} from '../../../../common/services/firestore/properties';
import jobsApi, {
  jobCollectionResult
} from '../../../../common/services/firestore/jobs';

import breakpoints from '../../../../config/breakpoints';
import firebaseConfig from '../../../../config/firebase';
import utilDate from '../../../../common/utils/date';
import utilString from '../../../../common/utils/string';

function render(ui: any, options: any = {}) {
  sinon.restore();
  // Stub all properties requests
  const propertyPayload: propertyResult = {
    status: options.propertyStatus || 'success',
    error: options.propertyError || null,
    data: options.property || fullProperty
  };
  sinon.stub(propertiesApi, 'findRecord').returns(propertyPayload);

  // Stub all property jobs
  const jobsPayload: jobCollectionResult = {
    status: options.jobsStatus || 'success',
    error: options.jobsError || null,
    data: options.jobs || mockJobs
  };
  sinon.stub(jobsApi, 'queryByProperty').returns(jobsPayload);

  const contextWidth = options.contextWidth || breakpoints.desktop.minWidth;
  return rtlRender(
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <ResponsiveContext.Provider value={{ width: contextWidth }}>
        {ui}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
        />
      </ResponsiveContext.Provider>
    </FirebaseAppProvider>,
    options
  );
}

describe('Integration | Features | Job List', () => {
  it('renders only mobile content for mobile devices', () => {
    render(<JobList user={user} propertyId="property-1" />, {
      contextWidth: breakpoints.tablet.maxWidth
    });
    const desktopHeader = screen.queryByTestId('joblist-header');
    const desktopGrid = screen.queryByTestId('joblist-grid-main');

    const mobileHeader = screen.queryByTestId('mobile-joblist-header');
    const mobileJobSection = screen.queryByTestId('job-sections-main-mobile');

    expect(desktopHeader).toBeNull();
    expect(desktopGrid).toBeNull();

    expect(mobileHeader).toBeTruthy();
    expect(mobileJobSection).toBeTruthy();
  });

  it('renders only desktop content for desktop devices', () => {
    render(<JobList user={user} propertyId="property-1" />, {
      contextWidth: breakpoints.desktop.minWidth
    });
    const desktopHeader = screen.queryByTestId('joblist-header');
    const desktopGrid = screen.queryByTestId('joblist-grid-main');

    const mobileHeader = screen.queryByTestId('mobile-joblist-header');
    const mobileJobSection = screen.queryByTestId('job-sections-main-mobile');

    expect(desktopHeader).toBeTruthy();
    expect(desktopGrid).toBeTruthy();

    // Should be null as it is desktop
    expect(mobileHeader).toBeNull();
    expect(mobileJobSection).toBeNull();
  });

  it('should sort default by title on desktop', () => {
    const expected =
      // eslint-disable-next-line max-len
      'Open: Install Playground Equipement,Sidewalk repair,Swimming pool cleaning | Action Required: Replace leasing office tiling,Solar roof fitting | Authorized to Start: Security camera installation,Water Tank cleaning | Completed: Electrical checkup,Wifi Installation';
    render(<JobList user={user} propertyId="property-1" />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    // Get all sections in table
    const sections = screen.queryAllByTestId('job-section-main');

    const sectionTexts = [];

    // Loop to get all section text content and row test values by test id
    sections.forEach((s) => {
      const sectionTitle = s.querySelector('[data-testid="job-section-title"]');

      const titles = s.querySelectorAll('[data-testid="grid-row-job-title"]');

      const texts = [];
      titles.forEach((t) => texts.push(t.textContent));

      // Push section title and all title text
      sectionTexts.push(`${sectionTitle.textContent}: ${texts.join(',')}`);
    });

    const actual = sectionTexts.join(' | ');

    expect(actual).toEqual(expected);
  });

  it('should sort title by descending on desktop', async () => {
    const expected =
      // eslint-disable-next-line max-len
      'Open: Swimming pool cleaning | Action Required: Solar roof fitting | Authorized to Start: Water Tank cleaning | Completed: Wifi Installation';
    render(<JobList user={user} propertyId="property-1" />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    // Header sort button
    const titleButton = screen.queryByTestId('grid-head-job-title');

    await userEvent.click(titleButton);

    // Get all sections in table
    const sections = screen.queryAllByTestId('job-section-main');

    const sectionTexts = [];
    // Loop to get all section text content and row test values by test id
    sections.forEach((s) => {
      const sectionTitle = s.querySelector('[data-testid="job-section-title"]');

      const titles = s.querySelectorAll('[data-testid="grid-row-job-title"]');

      const texts = [];

      // Push first element in test
      titles.forEach((t, idx) => idx === 0 && texts.push(t.textContent));

      // Push section title and all title text
      sectionTexts.push(`${sectionTitle.textContent}: ${texts.join(',')}`);
    });

    const actual = sectionTexts.join(' | ');

    expect(actual).toEqual(expected);
  });

  it('should sort created at by desc on desktop', async () => {
    const expected = [
      `Open: ${utilDate.toUserDateTimeDisplay(
        openMaintenanceExpeditedJob.createdAt
      )}`,
      `Action Required: ${utilDate.toUserDateTimeDisplay(
        approvedMaintenanceJob.createdAt
      )}`,
      `Authorized to Start: ${utilDate.toUserDateTimeDisplay(
        authorizedMaintenanceJob.createdAt
      )}`,
      `Completed: ${utilDate.toUserDateTimeDisplay(
        completeMaintenanceJob.createdAt
      )}`
    ].join(' | ');
    render(<JobList user={user} propertyId="property-1" />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    // Header sort button
    const titleButton = screen.queryByTestId('grid-head-job-created');

    await userEvent.click(titleButton);

    // Get all sections in table
    const sections = screen.queryAllByTestId('job-section-main');

    const sectionTexts = [];
    // Loop to get all section text content and row test values by test id
    sections.forEach((s) => {
      const sectionTitle = s.querySelector('[data-testid="job-section-title"]');

      const titles = s.querySelectorAll('[data-testid="grid-row-job-created"]');

      const texts = [];

      // Push first element in test
      titles.forEach((t, idx) => idx === 0 && texts.push(t.textContent));

      // Push section title and all title text
      sectionTexts.push(`${sectionTitle.textContent}: ${texts.join(',')}`);
    });

    const actual = sectionTexts.join(' | ');

    expect(actual).toEqual(expected);
  });

  it('should sort created at by asc on desktop', async () => {
    const expected = [
      `Open: ${utilDate.toUserDateTimeDisplay(openImprovementJob.createdAt)}`,
      `Action Required: ${utilDate.toUserDateTimeDisplay(
        approvedImprovementJob.createdAt
      )}`,
      `Authorized to Start: ${utilDate.toUserDateTimeDisplay(
        authorizedImprovementJob.createdAt
      )}`,
      `Completed: ${utilDate.toUserDateTimeDisplay(
        completeImprovementJob.createdAt
      )}`
    ].join(' | ');
    render(<JobList user={user} propertyId="property-1" />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    // Header sort button
    const titleButton = screen.queryByTestId('grid-head-job-created');

    // Twice to change the sort order to ascending
    await userEvent.click(titleButton);
    await userEvent.click(titleButton);

    // Get all sections in table
    const sections = screen.queryAllByTestId('job-section-main');

    const sectionTexts = [];
    // Loop to get all section text content and row test values by test id
    sections.forEach((s) => {
      const sectionTitle = s.querySelector('[data-testid="job-section-title"]');

      const titles = s.querySelectorAll('[data-testid="grid-row-job-created"]');

      const texts = [];

      // Push first element in test
      titles.forEach((t, idx) => idx === 0 && texts.push(t.textContent));

      // Push section title and all title text
      sectionTexts.push(`${sectionTitle.textContent}: ${texts.join(',')}`);
    });

    const actual = sectionTexts.join(' | ');

    expect(actual).toEqual(expected);
  });

  it('should sort updated at by desc on desktop', async () => {
    const expected = [
      `Open: ${utilDate.toUserDateTimeDisplay(
        openMaintenanceExpeditedJob.updatedAt
      )}`,
      `Action Required: ${utilDate.toUserDateTimeDisplay(
        approvedMaintenanceJob.updatedAt
      )}`,
      `Authorized to Start: ${utilDate.toUserDateTimeDisplay(
        authorizedMaintenanceJob.updatedAt
      )}`,
      `Completed: ${utilDate.toUserDateTimeDisplay(
        completeMaintenanceJob.updatedAt
      )}`
    ].join(' | ');
    render(<JobList user={user} propertyId="property-1" />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    // Header sort button
    const titleButton = screen.queryByTestId('grid-head-job-updated');

    await userEvent.click(titleButton);

    // Get all sections in table
    const sections = screen.queryAllByTestId('job-section-main');

    const sectionTexts = [];
    // Loop to get all section text content and row test values by test id
    sections.forEach((s) => {
      const sectionTitle = s.querySelector('[data-testid="job-section-title"]');

      const titles = s.querySelectorAll('[data-testid="grid-row-job-updated"]');

      const texts = [];

      // Push first element in test
      titles.forEach((t, idx) => idx === 0 && texts.push(t.textContent));

      // Push section title and all title text
      sectionTexts.push(`${sectionTitle.textContent}: ${texts.join(',')}`);
    });

    const actual = sectionTexts.join(' | ');

    expect(actual).toEqual(expected);
  });

  it('should sort updated at by asc on desktop', async () => {
    const expected = [
      `Open: ${utilDate.toUserDateTimeDisplay(openImprovementJob.updatedAt)}`,
      `Action Required: ${utilDate.toUserDateTimeDisplay(
        approvedImprovementJob.updatedAt
      )}`,
      `Authorized to Start: ${utilDate.toUserDateTimeDisplay(
        authorizedImprovementJob.updatedAt
      )}`,
      `Completed: ${utilDate.toUserDateTimeDisplay(
        completeImprovementJob.updatedAt
      )}`
    ].join(' | ');
    render(<JobList user={user} propertyId="property-1" />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    // Header sort button
    const titleButton = screen.queryByTestId('grid-head-job-updated');

    // Twice to change the sort order to ascending
    await userEvent.click(titleButton);
    await userEvent.click(titleButton);

    // Get all sections in table
    const sections = screen.queryAllByTestId('job-section-main');

    const sectionTexts = [];
    // Loop to get all section text content and row test values by test id
    sections.forEach((s) => {
      const sectionTitle = s.querySelector('[data-testid="job-section-title"]');

      const titles = s.querySelectorAll('[data-testid="grid-row-job-updated"]');

      const texts = [];

      // Push first element in test
      titles.forEach((t, idx) => idx === 0 && texts.push(t.textContent));

      // Push section title and all title text
      sectionTexts.push(`${sectionTitle.textContent}: ${texts.join(',')}`);
    });

    const actual = sectionTexts.join(' | ');

    expect(actual).toEqual(expected);
  });

  it('should sort type by desc on desktop', async () => {
    const expected = [
      `Open: ${utilString.titleize(openMaintenanceExpeditedJob.type)}`,
      `Action Required: ${utilString.titleize(approvedMaintenanceJob.type)}`,
      `Authorized to Start: ${utilString.titleize(
        authorizedMaintenanceJob.type
      )}`,
      `Completed: ${utilString.titleize(completeMaintenanceJob.type)}`
    ].join(' | ');
    render(<JobList user={user} propertyId="property-1" />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    // Header sort button
    const titleButton = screen.queryByTestId('grid-head-job-type');

    await userEvent.click(titleButton);

    // Get all sections in table
    const sections = screen.queryAllByTestId('job-section-main');

    const sectionTexts = [];
    // Loop to get all section text content and row test values by test id
    sections.forEach((s) => {
      const sectionTitle = s.querySelector('[data-testid="job-section-title"]');

      const titles = s.querySelectorAll('[data-testid="grid-row-job-type"]');

      const texts = [];

      // Push first element in test
      titles.forEach((t, idx) => idx === 0 && texts.push(t.textContent));

      // Push section title and all title text
      sectionTexts.push(`${sectionTitle.textContent}: ${texts.join(',')}`);
    });

    const actual = sectionTexts.join(' | ');

    expect(actual).toEqual(expected);
  });

  it('should sort type by asc on desktop', async () => {
    const expected = [
      `Open: ${utilString.titleize(openImprovementJob.type)}`,
      `Action Required: ${utilString.titleize(approvedImprovementJob.type)}`,
      `Authorized to Start: ${utilString.titleize(
        authorizedImprovementJob.type
      )}`,
      `Completed: ${utilString.titleize(completeImprovementJob.type)}`
    ].join(' | ');
    render(<JobList user={user} propertyId="property-1" />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    // Header sort button
    const titleButton = screen.queryByTestId('grid-head-job-type');

    // Twice to change the sort order to ascending
    await userEvent.click(titleButton);
    await userEvent.click(titleButton);

    // Get all sections in table
    const sections = screen.queryAllByTestId('job-section-main');

    const sectionTexts = [];
    // Loop to get all section text content and row test values by test id
    sections.forEach((s) => {
      const sectionTitle = s.querySelector('[data-testid="job-section-title"]');

      const titles = s.querySelectorAll('[data-testid="grid-row-job-type"]');

      const texts = [];

      // Push first element in test
      titles.forEach((t, idx) => idx === 0 && texts.push(t.textContent));

      // Push section title and all title text
      sectionTexts.push(`${sectionTitle.textContent}: ${texts.join(',')}`);
    });

    const actual = sectionTexts.join(' | ');

    expect(actual).toEqual(expected);
  });

  it('should sort default by title on mobile', () => {
    const expected =
      // eslint-disable-next-line max-len
      'Open: Install Playground Equipement,Sidewalk repair,Swimming pool cleaning | Action Required: Replace leasing office tiling,Solar roof fitting | Authorized to Start: Security camera installation,Water Tank cleaning | Completed: Electrical checkup,Wifi Installation';
    render(<JobList user={user} propertyId="property-1" />, {
      contextWidth: breakpoints.mobile.maxWidth
    });

    // Get all sections in table
    const sections = screen.queryAllByTestId('job-section-main');

    const sectionTexts = [];

    // Loop to get all section text content and row test values by test id
    sections.forEach((s) => {
      const sectionTitle = s.querySelector('[data-testid="job-section-title"]');

      const titles = s.querySelectorAll('[data-testid="mobile-row-job-title"]');

      const texts = [];
      titles.forEach((t) => texts.push(t.textContent));

      // Push section title and all title text
      sectionTexts.push(`${sectionTitle.textContent}: ${texts.join(',')}`);
    });

    const actual = sectionTexts.join(' | ');

    expect(actual).toEqual(expected);

    // Check if sort text changes
    const sortTextEl = screen.getByTestId('mobile-sort-text');

    expect(sortTextEl.textContent).toEqual(
      `Sorted by ${activeJobSortFilter('title')}`
    );
  });

  it('should sort by updated at in desc on mobile', async () => {
    const expected = [
      `Open: ${utilDate.toUserDateTimeDisplay(
        openMaintenanceExpeditedJob.updatedAt
      )}`,
      `Action Required: ${utilDate.toUserDateTimeDisplay(
        approvedMaintenanceJob.updatedAt
      )}`,
      `Authorized to Start: ${utilDate.toUserDateTimeDisplay(
        authorizedMaintenanceJob.updatedAt
      )}`,
      `Completed: ${utilDate.toUserDateTimeDisplay(
        completeMaintenanceJob.updatedAt
      )}`
    ].join(' | ');
    render(<JobList user={user} propertyId="property-1" />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    // Header sort button
    const titleButton = screen.queryByTestId('mobile-header-sort');

    await userEvent.click(titleButton);

    // Get all sections in table
    const sections = screen.queryAllByTestId('job-section-main');

    const sectionTexts = [];
    // Loop to get all section text content and row test values by test id
    sections.forEach((s) => {
      const sectionTitle = s.querySelector('[data-testid="job-section-title"]');

      const titles = s.querySelectorAll(
        '[data-testid="mobile-row-job-updated"]'
      );

      const texts = [];

      // Push first element in test
      titles.forEach((t, idx) => idx === 0 && texts.push(t.textContent));

      // Push section title and all title text
      sectionTexts.push(`${sectionTitle.textContent}: ${texts.join(',')}`);
    });

    const actual = sectionTexts.join(' | ');

    expect(actual).toEqual(expected);

    // Check if sort text changes
    const sortTextEl = screen.getByTestId('mobile-sort-text');

    expect(sortTextEl.textContent).toEqual(
      `Sorted by ${activeJobSortFilter('updatedAt')}`
    );
  });

  it('should sort by updated at in desc on mobile', async () => {
    const expected = [
      `Open: ${utilDate.toUserDateTimeDisplay(
        openMaintenanceExpeditedJob.createdAt
      )}`,
      `Action Required: ${utilDate.toUserDateTimeDisplay(
        approvedMaintenanceJob.createdAt
      )}`,
      `Authorized to Start: ${utilDate.toUserDateTimeDisplay(
        authorizedMaintenanceJob.createdAt
      )}`,
      `Completed: ${utilDate.toUserDateTimeDisplay(
        completeMaintenanceJob.createdAt
      )}`
    ].join(' | ');
    render(<JobList user={user} propertyId="property-1" />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    // Header sort button
    const titleButton = screen.queryByTestId('mobile-header-sort');

    // Twice to reach at created at sort by
    await userEvent.click(titleButton);
    await userEvent.click(titleButton);

    // Get all sections in table
    const sections = screen.queryAllByTestId('job-section-main');

    const sectionTexts = [];
    // Loop to get all section text content and row test values by test id
    sections.forEach((s) => {
      const sectionTitle = s.querySelector('[data-testid="job-section-title"]');

      const titles = s.querySelectorAll(
        '[data-testid="mobile-row-job-created"]'
      );

      const texts = [];

      // Push first element in test
      titles.forEach((t, idx) => idx === 0 && texts.push(t.textContent));

      // Push section title and all title text
      sectionTexts.push(`${sectionTitle.textContent}: ${texts.join(',')}`);
    });

    const actual = sectionTexts.join(' | ');

    expect(actual).toEqual(expected);

    // Check if sort text changes
    const sortTextEl = screen.getByTestId('mobile-sort-text');

    expect(sortTextEl.textContent).toEqual(
      `Sorted by ${activeJobSortFilter('createdAt')}`
    );
  });

  it('should sort by type in asc on mobile', async () => {
    const expected = [
      `Open: ${utilString.titleize(openImprovementJob.type)}`,
      `Action Required: ${utilString.titleize(approvedImprovementJob.type)}`,
      `Authorized to Start: ${utilString.titleize(
        authorizedImprovementJob.type
      )}`,
      `Completed: ${utilString.titleize(completeImprovementJob.type)}`
    ].join(' | ');
    render(<JobList user={user} propertyId="property-1" />, {
      contextWidth: breakpoints.tablet.maxWidth
    });

    // Header sort button
    const titleButton = screen.queryByTestId('mobile-header-sort');

    // Thrice to reach at created at sort by
    await userEvent.click(titleButton);
    await userEvent.click(titleButton);
    await userEvent.click(titleButton);

    // Get all sections in table
    const sections = screen.queryAllByTestId('job-section-main');

    const sectionTexts = [];
    // Loop to get all section text content and row test values by test id
    sections.forEach((s) => {
      const sectionTitle = s.querySelector('[data-testid="job-section-title"]');

      const titles = s.querySelectorAll(
        '[data-testid="mobile-row-job-type"]'
      );

      const texts = [];

      // Push first element in test
      titles.forEach((t, idx) => idx === 0 && texts.push(t.textContent));

      // Push section title and all title text
      sectionTexts.push(`${sectionTitle.textContent}: ${texts.join(',')}`);
    });

    const actual = sectionTexts.join(' | ');

    expect(actual).toEqual(expected);

    // Check if sort text changes
    const sortTextEl = screen.getByTestId('mobile-sort-text');

    expect(sortTextEl.textContent).toEqual(
      `Sorted by ${activeJobSortFilter('type')}`
    );
  });
});
