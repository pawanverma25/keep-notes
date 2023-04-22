import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const useUser = (curUser) => {
	const [user, setUser] = useState(curUser);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
			setUser(user);
			setIsLoading(false);
		});

		return unsubscribe;
	}, []);

	return { user, isLoading };
};

export default useUser;
