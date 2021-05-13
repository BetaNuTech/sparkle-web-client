import Head from 'next/head';
import { LoginForm } from '../../components/Login';

export default function Login() {
	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Login</title>
			</Head>
			<LoginForm />
		</>
	);
}
