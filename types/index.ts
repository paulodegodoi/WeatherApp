export type SearchApiObject = {
	country: string
	name: string // city
}

export type ForecastData = {
	location: {
		name: string
		country: string
	}
	current: {
		temp_c: number
		condition: {
			text: string
			code: number
		}
		humidity: number
		wind_kph: number
		wind_degree: number
	}
	forecast: {
		forecastday: {
			date: string
			day: {
				avgtemp_c: number
				avghumidity: number
				condition: {
					text: string
					code: number
				}
			}
			astro: {
				sunrise: string
			}
		}[]
	}
}

export type ApiParams = {
	cityName: string
	days?: number
}
