import { render, screen } from '@testing-library/react';
import SelectionIcon from './index';

describe('Unit | Features | Deficient Items | List | Selection Icon', () => {
  it('should render icon based on main input type and main input selection', () => {
    const props = {
      itemMainInputType: 'TwoActions_checkmarkX',
      itemMainInputSelection: 0
    };

    const tests = [
      {
        itemMainInputType: 'TwoActions_checkmarkX',
        itemMainInputSelection: 0,
        selector: 'checkmark-simple-icon',
        message: 'should render CheckmarkSimpleIcon'
      },
      {
        itemMainInputType: 'TwoActions_checkmarkX',
        itemMainInputSelection: 1,
        selector: 'cancel-simple-icon',
        message: 'should render CancelSimpleIcon'
      },
      {
        itemMainInputType: 'TwoActions_thumbs',
        itemMainInputSelection: 0,
        selector: 'thumbsup-simple-icon',
        message: 'should render ThumbsUpSimpleIcon'
      },
      {
        itemMainInputType: 'TwoActions_thumbs',
        itemMainInputSelection: 1,
        selector: 'thumbsdown-simple-icon',
        message: 'should render ThumbsDownSimpleIcon'
      },
      {
        itemMainInputType: 'ThreeActions_checkmarkExclamationX',
        itemMainInputSelection: 0,
        selector: 'checkmark-simple-icon',
        message: 'should render CheckmarkSimpleIcon'
      },
      {
        itemMainInputType: 'ThreeActions_checkmarkExclamationX',
        itemMainInputSelection: 1,
        selector: 'caution-simple-icon',
        message: 'should render CautionSimpleIcon'
      },
      {
        itemMainInputType: 'ThreeActions_checkmarkExclamationX',
        itemMainInputSelection: 2,
        selector: 'cancel-simple-icon',
        message: 'should render CancelSimpleIcon'
      },
      {
        itemMainInputType: 'ThreeActions_ABC',
        itemMainInputSelection: 0,
        selector: 'a-simple-icon',
        message: 'should render ASimpleIcon'
      },
      {
        itemMainInputType: 'ThreeActions_ABC',
        itemMainInputSelection: 1,
        selector: 'b-simple-icon',
        message: 'should render BSimpleIcon'
      },
      {
        itemMainInputType: 'ThreeActions_ABC',
        itemMainInputSelection: 2,
        selector: 'c-simple-icon',
        message: 'should render CSimpleIcon'
      },
      {
        itemMainInputType: 'FiveActions_oneToFive',
        itemMainInputSelection: 0,
        selector: 'one-simple-icon',
        message: 'should render OneSimpleIcon'
      },
      {
        itemMainInputType: 'FiveActions_oneToFive',
        itemMainInputSelection: 1,
        selector: 'two-simple-icon',
        message: 'should render TwoSimpleIcon'
      },
      {
        itemMainInputType: 'FiveActions_oneToFive',
        itemMainInputSelection: 2,
        selector: 'three-simple-icon',
        message: 'should render ThreeSimpleIcon'
      },
      {
        itemMainInputType: 'FiveActions_oneToFive',
        itemMainInputSelection: 3,
        selector: 'four-simple-icon',
        message: 'should render FourSimpleIcon'
      },
      {
        itemMainInputType: 'FiveActions_oneToFive',
        itemMainInputSelection: 4,
        selector: 'five-simple-icon',
        message: 'should render FiveSimpleIcon'
      }
    ];

    const { rerender } = render(<SelectionIcon {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { itemMainInputType, itemMainInputSelection, selector, message } =
        test;
      const componentProps = {
        itemMainInputType,
        itemMainInputSelection
      };
      rerender(<SelectionIcon {...componentProps} />);
      const icon = screen.queryByTestId(selector);
      expect(icon, message).toBeTruthy();
    }
  });
});
