import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import Header from './index';

describe('Unit | Features | Template Edit | Header', () => {
  it('should render "Cancel" action only on first step in mobile view', () => {
    const props = {
      isOnline: true,
      isStaging: true,
      isMobile: true,
      currentStepIndex: 0,
      goToNextStep: sinon.spy(),
      goToPrevStep: sinon.spy(),
      isLastStep: false,
      templateName: 'Template 1'
    };
    render(<Header {...props} />);
    const cancelAction = screen.queryByTestId('templateEdit-header-cancel');
    const BackAction = screen.queryByTestId('templateEdit-header-back');
    expect(cancelAction, 'should render "Cancel" action').toBeTruthy();
    expect(BackAction, 'should not render "Back" action').toBeFalsy();
  });

  it('should render "Back" action after the first step in mobile view', () => {
    const props = {
      isOnline: true,
      isStaging: true,
      isMobile: true,
      currentStepIndex: 1,
      goToNextStep: sinon.spy(),
      goToPrevStep: sinon.spy(),
      isLastStep: false,
      templateName: 'Template 1'
    };
    render(<Header {...props} />);
    const cancelAction = screen.queryByTestId('templateEdit-header-cancel');
    const BackAction = screen.queryByTestId('templateEdit-header-back');
    expect(cancelAction, 'should not render "Cancel" action').toBeFalsy();
    expect(BackAction, 'should render "Back" action').toBeTruthy();
  });

  it('should render "Next" action before the last step', () => {
    const props = {
      isOnline: true,
      isStaging: true,
      isMobile: true,
      currentStepIndex: 1,
      goToNextStep: sinon.spy(),
      goToPrevStep: sinon.spy(),
      isLastStep: false,
      templateName: 'Template 1'
    };
    render(<Header {...props} />);
    const NextAction = screen.queryByTestId('templateEdit-header-next');
    const SaveAction = screen.queryByTestId('templateEdit-header-save');
    expect(SaveAction, 'should not render "Save" action').toBeFalsy();
    expect(NextAction, 'should render "Next" action').toBeTruthy();
  });

  it('should render "Save" action only on last step', () => {
    const props = {
      isOnline: true,
      isStaging: true,
      isMobile: true,
      currentStepIndex: 2,
      goToNextStep: sinon.spy(),
      goToPrevStep: sinon.spy(),
      isLastStep: true,
      templateName: 'Template 1'
    };
    render(<Header {...props} />);
    const NextAction = screen.queryByTestId('templateEdit-header-next');
    const SaveAction = screen.queryByTestId('templateEdit-header-save');
    expect(SaveAction, 'should render "Save" action').toBeTruthy();
    expect(NextAction, 'should not render "Next" action').toBeFalsy();
  });
});
