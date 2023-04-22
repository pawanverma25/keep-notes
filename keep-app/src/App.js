import { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { AddComponent } from "./components/AddComponent";
import ComponentInfo from "./components/ComponentInfo";
import LogInComponent from "./components/LogInComponent";
import Navbar from "./components/Navbar";
import useUser from "./hooks/useUser";
import UserProfileComponent from "./components/UserProfileComponent";

const comp = (a, b) => {
	if (a.pinned === b.pinned) {
		return a._id < b._id ? 1 : -1;
	} else {
		return a.pinned < b.pinned ? 1 : -1;
	}
};

const onComponentListChangeAsync = async (baseUrl, user, newComponentList) => {
	const token = await user.getIdToken();
	const headers = { authtoken: token };
	await axios.put(baseUrl + "change/", newComponentList, { headers });
};

const App = () => {
	const onComponentPin = (componentId, pinned) => {
		const newComponentList = componentList
			.map((component) => {
				if (component._id === componentId)
					return { ...component, pinned: !pinned };
				else return component;
			})
			.sort(comp);
		setComponentList(newComponentList);
		if (user) onComponentListChangeAsync(baseUrl, user, newComponentList);
	};
	const onComponentChange = (newComponent) => {
		const newComponentList = componentList
			.map((component) => {
				if (component._id === newComponent._id) return newComponent;
				else return component;
			})
			.sort(comp);
		setComponentList(newComponentList);
		if (user) onComponentListChangeAsync(baseUrl, user, newComponentList);
	};
	const onDeleteComponent = (componentId) => {
		const newComponentList = componentList
			.filter((component) => {
				return component._id !== componentId;
			})
			.sort(comp);
		setComponentList(newComponentList);
		if (user) onComponentListChangeAsync(baseUrl, user, newComponentList);
	};

	const baseUrl = "https://keep-notes-phi.vercel.app/api/";
	const [componentList, setComponentList] = useState([]);
	const { user, isLoading } = useUser(null);
	const [loginToggle, setLoginToggle] = useState(false);
	const [profileToggle, setProfileToggle] = useState(false);
	const [loadingData, setLodingData] = useState(false);

	useEffect(() => {
		const fetchComponentList = async () => {
			if (user) {
				const token = await user.getIdToken();
				const headers = { authtoken: token };
				setLodingData(true);
				let response = await axios.get(baseUrl, {
					headers,
				});
				setLodingData(false);
				setComponentList(response.data);
			}
		};
		fetchComponentList();
	}, [user]);

	return (
		<div className="flex flex-col min-h-screen">
			<Navbar
				setLoginToggle={setLoginToggle}
				user={user}
				isLoading={isLoading}
				setComponentList={setComponentList}
				setProfileToggle={setProfileToggle}
			/>
			<div className="container flex flex-col mx-auto px-5 mt-12 flex-1">
				<AddComponent
					onAddComponent={(newComponent) => {
						componentList.push(newComponent);
						const newComponentList = [...componentList].sort(comp);
						setComponentList(newComponentList);
						if (user)
							onComponentListChangeAsync(baseUrl, user, newComponentList);
					}}
				/>
				{(isLoading || loadingData) && (
					<div className="mx-auto mt-20">
						<AiOutlineLoading3Quarters
							size={50}
							className="rounded-full p-2 font-semibold bg-[#a4b1c0] animate-spin  text-[#408de6]"
						/>
					</div>
				)}
				{componentList.length === 0 && (
					<h1 className="p-10 mt-24 -z-10 text-4xl font-bold text-center text-[#78818c] fixed place-self-center">
						Note your way to succes with us!!
					</h1>
				)}
				{componentList.map((component) => {
					return (
						<ComponentInfo
							key={component._id}
							component={component}
							onComponentChange={onComponentChange}
							onDeleteComponent={onDeleteComponent}
							onComponentPin={onComponentPin}
						/>
					);
				})}
				{loginToggle && (
					<LogInComponent
						setLoginToggle={setLoginToggle}
						user={user}
					/>
				)}
				{profileToggle && (
					<UserProfileComponent
						setProfileToggle={setProfileToggle}
						setComponentList={setComponentList}
					/>
				)}
			</div>
		</div>
	);
};

export default App;
