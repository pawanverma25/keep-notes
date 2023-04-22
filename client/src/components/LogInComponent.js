import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { AiFillCloseCircle } from "react-icons/ai";
import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	updateProfile,
	sendPasswordResetEmail,
	signInWithPopup,
} from "firebase/auth";

const LogInComponent = ({ setLoginToggle, user }) => {
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [newUser, setNewUser] = useState(false);
	const [passVisible, setPassVisible] = useState(false);
	const [confPassVisible, setConfPassVisible] = useState(false);
	const [passReset, setPassReset] = useState(false);

	const createAccount = async () => {
		try {
			if (password !== confirmPassword) {
				setError("Provided password does not match with confirm password!");
				return;
			}
			await createUserWithEmailAndPassword(getAuth(), email, password);
			await updateProfile(getAuth().currentUser, {
				displayName: name,
			});
			setLoginToggle(false);
		} catch (e) {
			setError(e.message);
		}
	};

	const logInWithEmail = async () => {
		try {
			await signInWithEmailAndPassword(getAuth(), email, password);
			setLoginToggle(false);
		} catch (e) {
			setError("Wrong e-mail/password!!");
		}
	};

	const logInWithGoogle = async () => {
		try {
			await signInWithPopup(getAuth(), new GoogleAuthProvider());
			setLoginToggle(false);
		} catch (e) {
			setError("Something went wrong!!");
		}
	};

	return (
		<div className="backdrop-blur w-full h-screen z-10 absolute top-0 left-0 grid place-items-center">
			<div className="bg-[#97b1d0a4] shadow-lg rounded-lg w-[400px] p-8 backdrop-blur-md select-none border border-[#679cdc] z-50">
				<button
					className="absolute top-5 right-5 cursor-pointer hover:scale-125"
					onClick={() => setLoginToggle(false)}>
					<AiFillCloseCircle
						size={20}
						className=" bg-gray-400 text-gray-600 rounded-full hover:text-[#fba0a0] hover:bg-[#ff0000]"
					/>
				</button>
				<p
					tabIndex={0}
					aria-label="Login to your account"
					className="text-2xl font-extrabold leading-6 text-gray-800">
					{newUser ? "Create a new account" : "Login to your account"}
				</p>
				<p className="text-sm my-2 font-medium leading-none text-gray-700">
					{newUser ? "Already have account?" : "Don't have account?"}
					<span
						role="link"
						onClick={() => {
							setNewUser(!newUser);
							setError("");
						}}
						aria-label="Sign up here"
						className="text-sm ml-2 font-medium leading-none underline text-gray-800 cursor-pointer">
						{newUser ? "Log in here" : "Sign up here"}
					</span>
				</p>
				<button
					aria-label="Continue with google"
					className="focus:ring-2 focus:ring-offset-2  focus:ring-gray-900 focus:outline-none py-1 px-4 border rounded-lg border-gray-800 flex items-center w-full mt-10"
					onClick={logInWithGoogle}>
					<FcGoogle size={30} />
					<p className="text-base font-medium ml-4 text-gray-800">
						Continue with Google
					</p>
				</button>
				<div className="w-full flex items-center justify-between py-5">
					<hr className="w-full bg-gray-400" />
					<p className="text-base font-medium leading-4 px-2.5 text-gray-600">
						OR
					</p>
					<hr className="w-full bg-gray-400" />
				</div>
				{error && (
					<h1 className="bg-red-300 py-1 px-3 rounded-md text-red-700 border border-red-700 break-words overflow-hidden text-ellipsis">
						{error}
					</h1>
				)}
				{newUser && (
					<div className="mt-4">
						<label className="font-medium leading-none text-gray-800">
							Name
						</label>
						<input
							aria-label="enter your name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="select-text bg-gray-200 border rounded focus:outline-none font-medium leading-none text-gray-800 py-1 w-full pl-3 mt-2"
						/>
					</div>
				)}
				<div className="mt-4">
					<label className="font-medium leading-none text-gray-800">
						Email
					</label>
					<input
						aria-label="enter email adress"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="select-text bg-gray-200 border rounded focus:outline-none font-medium leading-none text-gray-800 py-1 w-full pl-3 mt-2"
					/>
				</div>
				<div className="mt-4  w-full">
					<label className="font-medium leading-none text-gray-800">
						Password
					</label>
					<div className="relative flex items-center justify-center">
						<input
							aria-label="enter Password"
							type={passVisible ? "text" : "password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="select-text bg-gray-200 border rounded focus:outline-none font-medium leading-none text-gray-800 py-1 w-full pl-3 mt-2"
						/>
						<button
							className="focus:outline-none absolute right-0 mt-2 mr-3 cursor-pointer text-[#71717A]"
							onClick={() => {
								setPassVisible(!passVisible);
							}}>
							{passVisible ? <RiEyeOffLine /> : <RiEyeLine />}
						</button>
					</div>
				</div>
				{newUser && (
					<div className="mt-4  w-full">
						<label className="font-medium leading-none text-gray-800">
							Confirm Password
						</label>
						<div className="relative flex items-center justify-center">
							<input
								aria-label="enter Password"
								type={confPassVisible ? "text" : "password"}
								className="select-text bg-gray-200 border rounded focus:outline-none font-medium leading-none text-gray-800 py-1 w-full pl-3 mt-2"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
							<button
								className="focus:outline-none absolute right-0 mt-2 mr-3 cursor-pointer text-[#71717A]"
								onClick={() => {
									setConfPassVisible(!confPassVisible);
								}}>
								{confPassVisible ? <RiEyeOffLine /> : <RiEyeLine />}
							</button>
						</div>
					</div>
				)}
				{passReset && (
					<p className="text-xs ml-auto">
						*password reset e-mail has been sent.
					</p>
				)}
				{!newUser && (
					<button
						type="submit"
						aria-label="submit"
						className="float-right text-sm font-semibold underline mb-5 pt-1"
						onClick={async () => {
							try {
								await sendPasswordResetEmail(getAuth(), email);
								setPassReset(true);
								setError(null);
							} catch (e) {
								setError(e.message);
							}
						}}>
						forgot password?
					</button>
				)}
				<div className="mt-8">
					<button
						type="submit"
						aria-label="submit"
						className="rounded-md text-sm font-semibold leading-none text-white focus:outline-none bg-[#4683ff] focus:ring-2 focus:ring-offset-2 focus:ring-[#4683ff] py-4 w-full"
						onClick={() => {
							if (newUser) createAccount();
							else logInWithEmail();
						}}>
						Submit
					</button>
				</div>
			</div>
		</div>
	);
};

export default LogInComponent;
