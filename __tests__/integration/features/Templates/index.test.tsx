import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { act } from 'react-dom/test-utils';
import { admin } from '../../../../__mocks__/users';
import templatesApi from '../../../../common/services/api/templates';
import winLocation from '../../../../common/utils/winLocation';
import Templates from '../../../../features/Templates/index';
import {
  templateA,
  templateB,
  templateC
} from '../../../../__mocks__/templates';
import templateCategories from '../../../../__mocks__/templateCategories';
import currentUser from '../../../../common/utils/currentUser';
import errorReports from '../../../../common/services/api/errorReports';
import stubIntersectionObserver from '../../../helpers/stubIntersectionObserver';

describe('Integration | features | Templates', () => {
  afterEach(() => {
    sinon.restore();
  });
  beforeEach(() => {
    sinon.stub(winLocation, 'setHref');
    stubIntersectionObserver();
  });

  it('should request to create new template', async () => {
    const create = sinon.stub(templatesApi, 'createRecord').resolves();

    const props = {
      user: admin,
      templates: [templateA, templateB, templateC],
      templateCategories,
      sendNotification: sinon.spy(),
      isMobile: false,
      isOnline: true,
      forceVisible: true
    };
    render(<Templates {...props} />);

    await act(async () => {
      const addAction = screen.queryByTestId('header-add-template-action');
      fireEvent.click(addAction);
      await waitFor(() => create.called);
    });
    expect(create.called).toBeTruthy();
  });

  it('should request to copy template', async () => {
    const expected = templateA.id;
    const create = sinon.stub(templatesApi, 'createRecord').resolves();

    const props = {
      user: admin,
      templates: [templateA],
      templateCategories,
      sendNotification: sinon.spy(),
      isMobile: false,
      isOnline: true,
      forceVisible: true
    };
    render(<Templates {...props} />);

    await act(async () => {
      const copyAction = screen.queryAllByTestId(
        'template-item-dropdown-copy-action'
      );
      fireEvent.click(copyAction[0]);
      await waitFor(() => create.called);
    });
    const actual = create.getCall(0).args[0];
    expect(create.called).toBeTruthy();
    expect(actual).toEqual(expected);
  });

  test('should call send notification method and send error reports for API error response', async () => {
    const expected = true;
    const expectedErrorReport =
      'Error: features: DeficientItemEdit: hooks: useCreateTemplate: handleErrorResponse: Error: Something went wrong';
    const sendNotification = sinon.spy();
    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);
    const errorStub = sinon.stub(errorReports, 'send').callsFake(() => true);

    // Stub create response
    const create = sinon
      .stub(templatesApi, 'createRecord')
      .rejects(Error('Something went wrong'));

    const props = {
      user: admin,
      templates: [templateA, templateB, templateC],
      templateCategories,
      sendNotification,
      isMobile: false,
      isOnline: true,
      forceVisible: true
    };
    render(<Templates {...props} />);

    await act(async () => {
      const addAction = screen.queryByTestId('header-add-template-action');
      fireEvent.click(addAction);
      await waitFor(() => create.called);
    });
    const actual = sendNotification.called;
    const actualErrorReport = errorStub.getCall(0).args[0];
    expect(actual, 'sent user notification').toEqual(expected);
    expect(actualErrorReport.toString(), 'sent error reports').toEqual(
      expectedErrorReport
    );
  });
});
