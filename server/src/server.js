import express from "express";
import { db, connectionToDB } from "./db.js";
import fs from "fs";
import admin from "firebase-admin";
import path from "path";
import "dotenv/config";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const credentials = JSON.parse(fs.readFileSync("./credentials.json"));

admin.initializeApp({
	credential: admin.credential.cert(credentials),
});

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../../client/build")));

app.use(async (req, res, next) => {
	const { authtoken } = req.headers;
	if (authtoken) {
		try {
			const { uid } = await admin.auth().verifyIdToken(authtoken);
			req.user = await admin.auth().getUser(uid);
		} catch (e) {
			return res.sendStatus(400);
		}
	}
	req.user = req.user || {};
	next();
});

const comp = (a, b) => {
	if (a.pinned === b.pinned) {
		return a.date < b.date ? 1 : -1;
	} else {
		return a.pinned < b.pinned ? 1 : -1;
	}
};

app.get(/^(?!\/api).+/, (req, res) => {
	res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

app.get("/api/", async (req, res) => {
	const userData = await db
		.collection("notes")
		.findOne({ email: req.user.email });
	if (userData) res.send(userData.notes.sort(comp));
	else {
		db.collection("notes").insertOne({
			email: req.user.email,
			name: req.user.displayName,
			notes: [],
		});
		res.send([]);
	}
	res.end();
});

app.put("/api/change/", async (req, res) => {
	const notes = req.body;
	await db.collection("notes").updateOne(
		{ email: req.user.email },
		{
			$set: { notes: notes },
		}
	);
	res.sendStatus(200);
	res.end();
});

app.use((req, res, next) => {
	if (req.user) next();
	else res.sendStatus(401);
});

app.get("/api/user/change", async (req, res) => {
	await db.collection("notes").updateOne(
		{ email: req.user.email },
		{
			$set: { name: req.user.displayName },
		}
	);
	res.end();
});

app.get("/api/user/del", async (req, res) => {
	await db.collection("notes").deleteOne({ email: req.user.email });
	res.end();
});

app.post("/", (req, res) => {
	components = req.body;
	res.status(200).send();
});

const PORT = process.env.PORT || 8000;

connectionToDB(() => {
	console.log("successfully connected to databases");
	app.listen(PORT, () => {
		console.log("server is listening on port " + PORT);
	});
});
