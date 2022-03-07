import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import Header from './index';

describe('Unit | Features | Template Edit | Steps Layout | Actions', () => {
  it('should render "Cancel" action only on first step', () => {
    const props = {
      currentStepIndex: 0,
      goToNextStep: sinon.spy(),
      goToPrevStep: sinon.spy(),
      isLastStep: false
    };
    render(<Header {...props} />);
    const cancelAction = screen.queryByTestId('StepsLayout-cancel');
    const PrevAction = screen.queryByTestId('StepsLayout-previous-step');
    expect(cancelAction, 'should render "Cancel" action').toBeTruthy();
    expect(PrevAction, 'should not render "Previous Step" action').toBeFalsy();
  });

  it('should render "Previous Step" action after first step in mobile view', () => {
    const props = {
      currentStepIndex: 1,
      goToNextStep: sinon.spy(),
      goToPrevStep: sinon.spy(),
      isLastStep: false
    };
    render(<Header {...props} />);
    const cancelAction = screen.queryByTestId('StepsLayout-cancel');
    const PrevAction = screen.queryByTestId('StepsLayout-previous-step');
    expect(cancelAction, 'should not render "Cancel" action').toBeFalsy();
    expect(PrevAction, 'should render "Previous Step" action').toBeTruthy();
  });

  it('should render "Next Step" action before the last step', () => {
    const props = {
      currentStepIndex: 1,
      goToNextStep: sinon.spy(),
      goToPrevStep: sinon.spy(),
      isLastStep: false
    };
    render(<Header {...props} />);
    const NextAction = screen.queryByTestId('StepsLayout-next-step');
    const SaveAction = screen.queryByTestId('StepsLayout-save');
    expect(SaveAction, 'should not render "Save" action').toBeFalsy();
    expect(NextAction, 'should render "Next Step" action').toBeTruthy();
  });

  it('should render "Next Step" action only on last step', () => {
    const props = {
      currentStepIndex: 2,
      goToNextStep: sinon.spy(),
      goToPrevStep: sinon.spy(),
      isLastStep: true
    };
    render(<Header {...props} />);
    const NextAction = screen.queryByTestId('StepsLayout-next-step');
    const SaveAction = screen.queryByTestId('StepsLayout-save');
    expect(SaveAction, 'should render "Save" action').toBeTruthy();
    expect(NextAction, 'should not render "Next Step" action').toBeFalsy();
  });
});
