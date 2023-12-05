import axios from "axios"
import { apiKey } from "../constants"
import { ApiParams } from "../types"

const forecastEndpoint = (params: ApiParams) =>
	`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`

const searchEndpoint = (params: ApiParams) =>
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
	console.log(forecastEndpoint(params))
	return apiCall(forecastEndpoint(params))
}

export const fetchLocations = (params: ApiParams) => {
	return apiCall(searchEndpoint(params))
}
