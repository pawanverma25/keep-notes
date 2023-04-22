import "../index.css";
import { HiOutlineDocumentText, HiUserCircle } from "react-icons/hi";
import { MdLogin } from "react-icons/md";
import { useState } from "react";
import { getAuth, signOut } from "firebase/auth";

const UserInfoComponent = ({
	user,
	setUserInfoToggle,
	setComponentList,
	setProfileToggle,
}) => {
	let [error, setError] = useState(null);
	return (
		<>
			<div
				onClick={() => setUserInfoToggle(false)}
				className="w-full h-screen z-10 absolute top-0 left-0"></div>
			<div
				className="z-30 my-4 text-base rounded-lg shadow bg-[#3f5b7b8b] right-7 absolute backdrop-blur"
				id="user-dropdown">
				<div className="px-4 py-3">
					<span className="block text-sm text-gray-900 dark:text-white">
						{user.displayName}
					</span>
					<span className="block text-sm font-medium text-gray-300 truncate">
						{user.email}
					</span>
				</div>
				<hr className="border-[#004ea2] mx-2 pt-2" />
				{error && (
					<h1 className="bg-red-300 text-xs mx-3 rounded-md text-red-700 border border-red-700 text-center">
						{error}
					</h1>
				)}
				<ul
					autoFocus
					onBlur={() => setUserInfoToggle(false)}
					className="py-2 list-none"
					aria-labelledby="user-menu-button">
					<li>
						<button
							className=" flex px-4 py-2 text-sm hover:bg-[#004ea2] text-gray-200 w-full text-left"
							onClick={() => setProfileToggle(true)}>
							{!user.emailVerified && (
								<span className="relative flex h-2 w-2 mr-2 my-auto">
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-200 opacity-75"></span>
									<span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
								</span>
							)}
							Profile
						</button>
					</li>
					<li>
						<button
							className="block px-4 py-2 text-sm hover:bg-[#004ea2] text-gray-200 w-full text-left"
							onClick={async () => {
								try {
									await signOut(getAuth());
									setUserInfoToggle(false);
									setComponentList([]);
								} catch (e) {
									setError("something went wrong!!");
								}
							}}>
							Sign out
						</button>
					</li>
				</ul>
			</div>
		</>
	);
};

const Navbar = ({
	setLoginToggle,
	user,
	isLoading,
	setComponentList,
	setProfileToggle,
}) => {
	let [userInfoToggle, setUserInfoToggle] = useState(false);

	return (
		<nav className="bg-[#76abe8] border-gray-200 px-2 sm:px-4 py-4 rounded-b-lg">
			<div className="flex justify-between mx-5">
				<a
					href="/"
					className="flex items-center">
					<HiOutlineDocumentText
						size={30}
						className="text-white mr-1"
					/>
					<h1 className="self-center text-2xl font-semibold text-white">
						Keep Notes
					</h1>
				</a>
				{user ? (
					<button
						type="button"
						className="rounded-full  focus:ring-4 focus:ring-[#408de6]"
						id="user-menu-button"
						disabled={isLoading}
						onClick={() => setUserInfoToggle(!userInfoToggle)}
						aria-expanded="false"
						data-dropdown-toggle="user-dropdown"
						data-dropdown-placement="bottom">
						{user.photoURL ? (
							<img
								src={user.photoURL}
								className="rounded-full h-8 w-8 border-2 border-gray-200"
								alt="user-profile"></img>
						) : (
							<HiUserCircle className="w-8 h-8 rounded-full text-white" />
						)}
					</button>
				) : (
					<button
						className="flex rounded-md p-1 px-1 group bg-gray-200 hover:scale-105 hover:bg-[#408de6] shadow-md font-semibold text-[#408de6] hover:text-white"
						onClick={() => {
							setLoginToggle(true);
							setUserInfoToggle(false);
						}}>
						Sign In
						<MdLogin className="w-6 h-6 ml-2 rounded-full group-hover:text-white text-[#408de6]" />
					</button>
				)}
			</div>
			{userInfoToggle && (
				<UserInfoComponent
					user={user}
					setUserInfoToggle={setUserInfoToggle}
					setComponentList={setComponentList}
					setProfileToggle={setProfileToggle}
				/>
			)}
		</nav>
	);
};

export default Navbar;
