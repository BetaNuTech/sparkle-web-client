import { FunctionComponent } from 'react';
import Header from '../../common/Login/Header';
import Footer from '../../common/Login/Footer';
import Container from '../../common/Login/Container';
import IOSLink from '../../common/Login/IOSLink';

interface Props {
  isStaging?: boolean;
}

const LoginForm: FunctionComponent<Props> = ({ isStaging }) => (
  <>
    <Container>
      <Header isStaging={isStaging} />

      <IOSLink />
      <Footer
        hideVersion={true} // eslint-disable-line react/jsx-boolean-value
      />
    </Container>
  </>
);

export default LoginForm;
