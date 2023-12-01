import axios from "axios"
import { apiKey } from "../constants"

type ApiParams = {
	cityName: string
}

const forecastEndpoint = (params: ApiParams) =>
	`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${params.cityName}&aqi=no`

const searchEndpoint = (params) =>
	`http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`

const apiCall = async (endpoint: string) => {
	const options = {
		method: "Get",
		url: endpoint,
	}

	try {
		const response = await axios.request(options)
		return response.data
	} catch (error) {
		console.log("error: ", error)
		return null
	}
}

export const fetchWeatherForecast = (params: ApiParams) => {
	return apiCall(forecastEndpoint(params))
}

export const fetchLocations = (params: ApiParams) => {
	return apiCall(searchEndpoint(params))
}
