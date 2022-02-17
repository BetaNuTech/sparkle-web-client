import { render, screen } from '@testing-library/react';
import createDeficientItem from '../../../../__tests__/helpers/createDeficientItem';
import ResponsibilityGroupPill from './index';

describe('Unit | Common | Deficient Item Edit Form | fields | Responsibility Group Pill', () => {
  it('it hides responsibility group pill when item does not have current responsibility group', () => {
    render(
      <ResponsibilityGroupPill
        deficientItem={createDeficientItem({
          state: 'pending'
        })}
        isVisible={false} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const responsibilityGroupPillSection = screen.queryByTestId(
      'responsibility-group-pill'
    );
    expect(responsibilityGroupPillSection).toBeFalsy();
  });

  it('it should render current responsibility group', () => {
    const expected = 'Site Level, In-House';
    render(
      <ResponsibilityGroupPill
        deficientItem={createDeficientItem({
          state: 'pending',
          currentResponsibilityGroup: 'site_level_in-house'
        })}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const responsibilityGroupTextEl = screen.queryByTestId(
      'responsibility-group-pill-text'
    );
    expect(responsibilityGroupTextEl).toHaveTextContent(expected);
  });
});
