import React from "react";
import { FaGoogle } from "react-icons/fa";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode"; // Assurez-vous que l'importation est correcte
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { getToken } from '../services/api.auth.token';
import { useForm } from 'react-hook-form';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { notifyError } from '../functions/toast';
import { useNavigate, Link } from 'react-router-dom';

import loginimagebg from "../assets/photos/Tiny_people_carrying_key_to_open_padlock-removebg-preview.png";
import { getUserInformation } from "../services/api.user";
import { createUser } from "../services/api.auth.user";

function LoginPage() {
	const { setUser } = useContext(UserContext);
	const { register, handleSubmit } = useForm();
	const navigate = useNavigate();

	const onSubmit = handleSubmit(async (data) => {
		try {
			const res = await getToken(data);
			localStorage.setItem('token', res.data.access);
			const decoded = jwtDecode(res.data.access);
			const currentTime = Date.now() / 1000;
			const timeRemaining = decoded.exp - currentTime;
			console.log(res);
			console.log(decoded);
			console.log(res.data);
			console.log(res.data.access);
			const result = await getUserInformation(decoded.user_id);
			setUser(result.data);
			setTimeout(() => {
				localStorage.removeItem('token');
				setUser(null);
				navigate('/login');
				window.location.reload()

			}, timeRemaining * 1000);
			navigate('/home');
		} catch (error) {
			if (error.response) {
				if (error.response.status === 401) {
					notifyError("Incorrect username or password");
				} else if (error.message) {
					notifyError(error.message);
				}
			} else if (error.request) {
				console.log(error.request);
			} else {
				notifyError(error.message);
			}
		}
	});

	const handleOAuthLogin = async (credentialResponse) => {
		const decoded = jwtDecode(credentialResponse.credential);
		console.log(decoded)
		const formData = {
			first_name: decoded.given_name,
			last_name: decoded.family_name,
			username: decoded.email.split('@')[0],
			email: decoded.email,
			password: decoded.email + decoded.email.split('@')[0],
			profile_picture: decoded.picture
		};

		try {
			/***Attempt to connect with Google information*/
			const res = await getToken({
				username: formData.username,
				password: formData.password
			});
			localStorage.setItem('token', res.data.access);
			const decoded = jwtDecode(res.data.access);
			const currentTime = Date.now() / 1000;
			const timeRemaining = decoded.exp - currentTime;
			console.log(decoded);
			const result = await getUserInformation(decoded.user_id);
			setUser({ ...result.data, profile_picture: formData.profile_picture });
			setTimeout(() => {
				localStorage.removeItem('token');
				setUser(null);
				navigate('/login');
				window.location.reload()
			}, timeRemaining * 1000);
			navigate('/home');
		} catch (loginError) {
			/**if it fails like it's the first time to connect with this  Google account it try to create a user in our api with this Google information
			 * after this it try to connect once again*/
			if (loginError.response && loginError.response.status === 401) {
				try {
					await createUser(formData).then(r => console.log('je vien de faire un poste create user'));
					const res = await getToken({
						username: formData.username,
						password: formData.password
					});
					localStorage.setItem('token', res.data.access);
					const decoded = jwtDecode(res.data.access);
					const currentTime = Date.now() / 1000;
					const timeRemaining = decoded.exp - currentTime;
					console.log(decoded);
					const result = await getUserInformation(decoded.user_id);
					setUser({ ...result.data, profile_picture: formData.profile_picture });
					setTimeout(() => {
						localStorage.removeItem('token');
						setUser(null);
						navigate('/login');
						window.location.reload()
					}, timeRemaining * 1000);
					navigate('/home');
				} catch (createUserError) {
					notifyError("Error creating user: " + createUserError.message);
				}
			} else {
				notifyError("Error logging in with Google: " + loginError.message);
			}
		}
	};

	return (
		<div className="flex flex-row flex-wrap items-center justify-center min-h-screen bg-gray-100 gap-3">
			<img src={loginimagebg} alt="Error" className="h-64" />
			<div className="flex items-center justify-center min-h-screen px-8 bg-gray-100 w-full max-w-lg">
				<div className="px-10 py-8 mt-4 text-left bg-white shadow-lg rounded-lg w-full">
					<h3 className="text-2xl font-bold text-center">Connectez-vous à votre compte</h3>
					<ToastContainer />
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="mt-4">
							<label className="block" htmlFor="username">Nom d'utilisateur</label>
							<input type="text" placeholder="Nom d'utilisateur"
								   id="username"
								   {...register('username', { required: true })}
								   className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
							/>
							<label className="block mt-4" htmlFor="password">Mot de passe</label>
							<input type="password" placeholder="Mot de passe"
								   id="password"
								   {...register('password', { required: true })}
								   className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
							/>
							<div className="mt-3">
								<p>
									<Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">Mot de passe oublié</Link>
								</p>
							</div>
							<button type="submit"
									className="w-full text-center py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">
								Connexion
							</button>
						</div>
					</form>
					<div className="text-center mt-3">
                        <span>Pas de compte?
                            <Link to="/register" className="w-full text-sm text-blue-600 hover:underline"> S'inscrire</Link>
                        </span>
					</div>
					<div className=" flex flex-row mt-6">
						<GoogleLogin className="w-full"
									 onSuccess={handleOAuthLogin}
									 onError={() => console.log('Login Failed')}
						>
							<button
								className="w-full flex items-center justify-center px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-700">
								<FaGoogle className="mr-2"/> Connexion avec Google
							</button>

						</GoogleLogin>

					</div>
				</div>
			</div>
		</div>
	);
}

export default LoginPage;
