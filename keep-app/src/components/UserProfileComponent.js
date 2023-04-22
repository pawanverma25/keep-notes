import { AiFillCloseCircle } from "react-icons/ai";
import { RiEyeOffLine, RiEyeLine } from "react-icons/ri";
import { HiUserCircle } from "react-icons/hi";
import axios from "axios";
import { GoUnverified, GoVerified } from "react-icons/go";
import { useEffect, useState } from "react";
import {
	getAuth,
	sendEmailVerification,
	updateProfile,
	signInWithEmailAndPassword,
	deleteUser,
	updatePassword,
	signInWithPopup,
	GoogleAuthProvider,
} from "firebase/auth";

const UserProfileComponent = ({ setProfileToggle, setComponentList }) => {
	const auth = getAuth();
	const user = auth.currentUser;
	const [name, setName] = useState(user.displayName);
	const [vTxt, setVTxt] = useState(false);
	const [change, setChange] = useState(false);
	const [changePass, setChangePass] = useState(false);
	const [curPassword, setCurPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confPassword, setConfPassword] = useState("");
	const [error, setError] = useState(null);
	const [message, setMessage] = useState(null);
	const [delUser, setDelUser] = useState(false);
	const [curPassVisible, setCurPassVisible] = useState(false);
	const [newPassVisible, setNewPassVisible] = useState(false);
	const [confPassVisible, setConfPassVisible] = useState(false);

	const submitChanges = async () => {
		try {
			await updateProfile(getAuth().currentUser, {
				displayName: name,
			});
			const token = await user.getIdToken();
			const headers = { authtoken: token };
			await axios.get("https://localhost:8000/api/userchange/", {
				headers,
			});

			if (changePass) {
				await signInWithEmailAndPassword(auth, user.email, curPassword);
				await updatePassword(user, newPassword);
				setChangePass(false);
			}
			setMessage("Updation Successful!!");
			setChange(false);
		} catch (e) {
			setError("Something went wrong!!");
		}
	};

	useEffect(() => {
		if (error) {
			setTimeout(() => {
				setError(null);
			}, 5000);
		}
		if (error) {
			setTimeout(() => {
				setMessage(null);
			}, 5000);
		}
	}, [error, message]);

	return (
		<div className="backdrop-blur w-full h-screen z-40 top-0 left-0 fixed grid place-items-center">
			<div className="bg-[#b4bfcc] shadow-lg rounded-lg lg:w-[700px] md:w-[600px] sm:w-[500px] p-8 backdrop-blur-md select-none border border-[#679cdc] z-50">
				<button
					className="absolute top-5 right-5 cursor-pointer hover:scale-125"
					onClick={() => setProfileToggle(false)}>
					<AiFillCloseCircle
						size={20}
						className=" bg-gray-400 text-gray-600 rounded-full hover:text-[#fba0a0] hover:bg-[#ff0000]"
					/>
				</button>
				{user.photoURL ? (
					<img
						src={user.photoURL}
						className="mx-auto rounded-full h-20 w-20 my-5 border-4 border-gray-300"
						alt="user-profile"></img>
				) : (
					<HiUserCircle
						size={60}
						className="mx-auto text-white"
					/>
				)}
				<h1 className=" text-center my-3 text-2xl font-semibold">
					Greetings {user.displayName}!!
				</h1>
				{error && (
					<h1 className="bg-red-300 text-center py-1 px-3 rounded-md text-red-700 border border-red-700 break-words overflow-hidden text-ellipsis">
						{error}
					</h1>
				)}
				{message && (
					<h1 className="bg-[#b8daf1] text-center py-1 px-3 rounded-md text-sky-900 border border-sky-900 break-words overflow-hidden text-ellipsis">
						{message}
					</h1>
				)}
				<table className="items-center bg-transparent w-full border-collapse ">
					<colgroup>
						<col
							span="1"
							className="w-[35%]"
						/>
						<col
							span="1"
							className="w-[65%]"
						/>
					</colgroup>
					<tbody>
						<tr>
							<th className="font-medium text-gray-800 align-middle whitespace-nowrap text-left pr-2">
								Name
							</th>
							<td>
								<input
									className="my-2 select-text bg-gray-200 border rounded focus:outline-none font-medium text-gray-800 w-full px-1 mt-2"
									value={name}
									onChange={(e) => {
										setName(e.target.value);
										setChange(true);
									}}></input>
							</td>
						</tr>
						<tr>
							<th className="font-medium text-gray-800 align-middle whitespace-nowrap text-left pr-2">
								Joined
							</th>
							<td>
								<div className="my-2 select-text bg-gray-300 rounded focus:outline-none font-medium text-gray-800 w-full px-1 mt-2">
									{Date(user.reloadUserInfo.createdAt).substring(4, 15)}
								</div>
							</td>
						</tr>
						<tr>
							<th className="font-medium text-gray-800 align-text-top  whitespace-nowrap text-left pr-2">
								Email
							</th>
							<td className="flex flex-col items-end">
								<div className="flex w-full">
									<div className="flex flex-1 items-center my-2 select-text bg-gray-300 rounded focus:outline-none font-medium text-gray-800 w-full px-1 mt-2">
										{user.email}
										{user.emailVerified ? (
											<GoVerified className="text-green-500 ml-1" />
										) : (
											<GoUnverified className="text-red-500 ml-1" />
										)}
									</div>
									{!user.emailVerified && (
										<button
											className="my-2 ml-2 rounded-md text-sm font-semibold leading-none text-white focus:outline-none bg-[#4683ff] focus:ring-2 focus:ring-offset-2 focus:ring-[#4683ff] px-2 hover:scale-105"
											onClick={async () => {
												try {
													await sendEmailVerification(getAuth().currentUser);
													setVTxt(true);
												} catch (e) {
													setError("Something went wrong!!");
												}
											}}>
											verify
										</button>
									)}
								</div>
								{vTxt && (
									<p className=" text-xs">
										*verification e-mail has been sent.
									</p>
								)}

								{user.providerData[0].providerId === "password" && (
									<button
										type="submit"
										aria-label="submit"
										className="text-sm font-semibold underline"
										onClick={() => {
											setDelUser(false);
											setChangePass(!changePass);
											setChange(!changePass);
										}}>
										change password?
									</button>
								)}
							</td>
						</tr>
						{(changePass ||
							(delUser &&
								user.providerData[0].providerId !== "google.com")) && (
							<tr>
								<th className="font-medium text-gray-800 align-middle whitespace-nowrap text-left pr-2">
									Current Password
								</th>
								<td className="relative flex items-center justify-center">
									<input
										aria-label="enter Password"
										type={curPassVisible ? "text" : "password"}
										value={curPassword}
										onChange={(e) => setCurPassword(e.target.value)}
										className="my-2 select-text bg-gray-200 border rounded focus:outline-none font-medium text-gray-800 w-full px-1 mt-2"
									/>
									<button
										className="focus:outline-none absolute right-0 mr-3 cursor-pointer text-[#71717A]"
										onClick={() => {
											setCurPassVisible(!curPassVisible);
										}}>
										{curPassVisible ? <RiEyeOffLine /> : <RiEyeLine />}
									</button>
								</td>
							</tr>
						)}
						{changePass && (
							<>
								<tr>
									<th className="font-medium text-gray-800 align-middle whitespace-nowrap text-left pr-2">
										New Password
									</th>
									<td className="relative flex items-center justify-center">
										<input
											aria-label="enter Password"
											type={newPassVisible ? "text" : "password"}
											value={newPassword}
											onChange={(e) => setNewPassword(e.target.value)}
											className="my-2 select-text bg-gray-200 border rounded focus:outline-none font-medium text-gray-800 w-full px-1 mt-2"
										/>
										<button
											className="focus:outline-none absolute right-0 mr-3 cursor-pointer text-[#71717A]"
											onClick={() => {
												setNewPassVisible(!newPassVisible);
											}}>
											{newPassVisible ? <RiEyeOffLine /> : <RiEyeLine />}
										</button>
									</td>
								</tr>
								<tr>
									<th className="font-medium text-gray-800 align-middle whitespace-nowrap text-left pr-2">
										Confirm Password
									</th>
									<td className="relative flex items-center justify-center">
										<input
											aria-label="enter Password"
											type={confPassVisible ? "text" : "password"}
											value={confPassword}
											onChange={(e) => setConfPassword(e.target.value)}
											className="my-2 select-text bg-gray-200 border rounded focus:outline-none font-medium text-gray-800 w-full px-1 mt-2"
										/>
										<button
											className="absolute right-0 mr-3 cursor-pointer text-[#71717A]"
											onClick={() => {
												setConfPassVisible(!confPassVisible);
											}}>
											{confPassVisible ? <RiEyeOffLine /> : <RiEyeLine />}
										</button>
									</td>
								</tr>
							</>
						)}
					</tbody>
				</table>
				<button
					type="submit"
					aria-label="submit"
					className="px-4 mt-5 rounded-md text-sm font-semibold leading-none focus:outline-none bg-[#fba0a0] text-[#ff0000] hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-[#ff0000] py-2"
					onClick={async () => {
						try {
							if (user.providerData[0].providerId !== "google.com") {
								if (!delUser) {
									setDelUser(true);
									setCurPassword("");
									setChangePass(false);
									setChange(false);
									return;
								}
								await signInWithEmailAndPassword(
									getAuth(),
									user.email,
									curPassword
								);
							} else {
								await signInWithPopup(auth, new GoogleAuthProvider());
							}
							const token = await user.getIdToken();
							const headers = { authtoken: token };
							await axios.get("http://localhost:8000/api/userdel", {
								headers,
							});
							await deleteUser(user);
							setProfileToggle(false);
							setComponentList([]);
						} catch (e) {
							setError("Something went wrong!!");
						}
					}}>
					Delete Account
				</button>
				{change && (
					<button
						type="submit"
						aria-label="submit"
						className="float-right px-4 mt-5 rounded-md text-sm font-semibold leading-none text-white focus:outline-none bg-[#4683ff] hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-[#4683ff] py-2"
						onClick={submitChanges}>
						Update
					</button>
				)}
			</div>
		</div>
	);
};

export default UserProfileComponent;
