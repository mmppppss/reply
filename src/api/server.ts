// SERVER EXPRESS
import app from "./app";

const PORT = process.env.PORT || 3000;
const HOST = process.env.API_HOST_v6 || "::";

export default async function startApi() {
	app.listen(Number(PORT), HOST, () => {
		console.log(`Server running on http://${HOST}:${PORT}`);
	});
}
