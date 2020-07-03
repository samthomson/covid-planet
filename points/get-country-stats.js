
const axios = require('axios').default


const getStats = async () => {
	var requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};
  
	try {
		const summaryResp = await axios.get("https://api.covid19api.com/summary")
		
		const summary = summaryResp.data

		console.log('summary', summary)
		
		const uniqueCountries = summary.Countries.map(country => country.CountryCode)
		console.log(uniqueCountries)
		console.log(uniqueCountries.length)
	} catch (err) {
		console.log('err', err)
	}
}
	
	getStats()