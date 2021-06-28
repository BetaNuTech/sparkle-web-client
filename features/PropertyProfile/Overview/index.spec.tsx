import { render } from '@testing-library/react';
import { fullProperty } from '../../../__mocks__/properties';
import inspections from '../../../__mocks__/inspections';
import Overview from './index';

describe('Unit | Features | Properties | Profile | Overview', () => {
  it('matches prior snapshot', () => {
    const { container } = render(
      <Overview
        property={fullProperty}
        inspections={inspections}
        isYardiConfigured={false}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
