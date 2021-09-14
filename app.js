const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const MongoClient = require("mongodb").MongoClient;
const connectionString = process.env.CONNECTION_STRING;
MongoClient.connect(connectionString, { useUnifiedTopology: true })
	.then((client) => {
		console.log("Connected to DB");
		const db = client.db("task1");
		//console.log(db);
		const quotesCollection = db.collection("submissions");
		//console.log(quotesCollection);
		app.post("/submit_form", (req, res) => {
			//console.log(req.body);
			quotesCollection
				.insertOne(req.body)
				.then((result) => {
					//console.log(result);
					return res.redirect("/");
				})
				.catch((error) => console.error(error));
		});

		app.get("/", (req, res) => {
			quotesCollection
				.find()
				.toArray()
				.then((names) => {
					//console.log(names);
					return res.render("index.ejs", { arr: names });
				})
				.catch((error) => console.error(error));
			const cursor = db.collection("submissions").find();
			//console.log(cursor);
			// ...
		});
	})
	.catch((error) => console.error(error));

app.listen(process.env.PORT, function () {
	console.log("listening on,", process.env.PORT);
});
