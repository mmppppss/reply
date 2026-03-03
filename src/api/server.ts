// SERVER EXPRESS
import app from "./app";

const PORT = process.env.PORT || 3000;

export default async function startApi() {
	app.listen(PORT, () => {
		console.log(`Server running on http://localhost:${PORT}`);
	});
}
