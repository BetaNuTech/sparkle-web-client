import { FunctionComponent } from 'react';
import { MainLayout } from '../../../../common/MainLayout/index';
import PropertyEdit from '../../../../features/PropertyEdit/index';

interface Props {
  isOnline: boolean;
  toggleNavOpen?(): void;
  isStaging: boolean;
}

const Page: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  toggleNavOpen
}) => (
  <>
    <MainLayout>
      <PropertyEdit
        toggleNavOpen={toggleNavOpen}
        isOnline={isOnline}
        isStaging={isStaging}
      />
    </MainLayout>
  </>
);

export default Page;
