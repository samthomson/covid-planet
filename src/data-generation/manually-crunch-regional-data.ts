import { requestUSStateData } from "./util/corona-data"

const main = async () => {
	const data = await requestUSStateData();
	console.log(data)
}

main()