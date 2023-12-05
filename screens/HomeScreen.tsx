import { StatusBar } from "expo-status-bar"
import {
	Image,
	SafeAreaView,
	TextInput,
	TouchableOpacity,
	View,
	Text,
	ScrollView,
} from "react-native"
import { theme } from "../theme"

import { MagnifyingGlassIcon } from "react-native-heroicons/outline"
import { CalendarDaysIcon, MapPinIcon } from "react-native-heroicons/solid"
import { useCallback, useEffect, useState } from "react"

import { debounce } from "lodash"
import { fetchLocations, fetchWeatherForecast } from "../api/weather"
import { ApiParams, ForecastData, SearchApiObject } from "../types"
import { weatherImages } from "../constants"
import * as Progress from "react-native-progress"

export default function HomeScreen() {
	const [showSearch, setShowSearch] = useState(false)
	const [locations, setLocations] = useState<SearchApiObject[]>([])
	const [forecast, setForecast] = useState<ForecastData>(null)
	const [isLoading, setIsLoading] = useState(false)

	let location = forecast?.location
	let current = forecast?.current

	const handleLocation = (value: string) => {
		setShowSearch(false)
		setIsLoading(true)
		// fetch forecast
		if (value.length > 0) {
			const searchValue: ApiParams = {
				cityName: value,
				days: 7,
			}
			fetchWeatherForecast(searchValue).then((data) => {
				setForecast(data)
				setIsLoading(false)
			})
		}
	}

	const handleSearch = (value: string) => {
		// fetch locations
		if (value.length > 0) {
			const searchValue: ApiParams = {
				cityName: value,
			}
			fetchLocations(searchValue).then((data) => {
				setLocations(data)
			})
		}
	}

	useEffect(() => {
		fetchMyWeatherData()
	}, [])

	const fetchMyWeatherData = async () => {
		fetchWeatherForecast({
			cityName: "Milan",
			days: 7,
		}).then((data) => {
			setForecast(data)
		})
	}

	const handleTextDebounce = useCallback(debounce(handleSearch, 1200), [])

	return (
		<View className="flex-1 relative">
			<StatusBar style="light" />
			<Image
				blurRadius={70}
				source={require("../assets/images/bg.png")}
				className="absolute h-full w-full"
			/>
			<SafeAreaView className="flex flex-1">
				{/* search section */}
				<View style={{ height: "7%" }} className="mx-4 relative z-50">
					<View
						className="flex-row justify-end items-center rounded-full"
						style={{ backgroundColor: showSearch ? theme.bgWhite(0.2) : "transparent" }}
					>
						{showSearch ? (
							<TextInput
								onChangeText={handleTextDebounce}
								placeholder="Search city"
								placeholderTextColor={"lightgray"}
								className="pl-6 h-10 flex-1 text-base text-white"
							/>
						) : null}
						<TouchableOpacity
							onPress={() => setShowSearch(!showSearch)}
							style={{ backgroundColor: theme.bgWhite(0.3) }}
							className="rounded-full p-3 m-1"
						>
							<MagnifyingGlassIcon size={25} color="white" />
						</TouchableOpacity>
					</View>
					{locations.length > 0 && showSearch ? (
						<View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
							{locations.map((l, index) => {
								let showBorder = index + 1 != locations.length
								let borderClass = showBorder ? "border-b-2 border-b-gray-400" : ""
								return (
									<TouchableOpacity
										onPress={() => handleLocation(l.name)}
										key={l.name + index}
										className={
											"flex-row items-center border-0 p-3 px-4 mb-1 " +
											borderClass
										}
									>
										<MapPinIcon size={20} color="gray" />
										<Text className="text-black text-lg ml-2">
											{l.name}, {l.country}
										</Text>
									</TouchableOpacity>
								)
							})}
						</View>
					) : null}
				</View>

				{isLoading ? (
					<View className="flex-1 flex-row justify-center items-center">
						<Progress.CircleSnail thickness={10} size={140} color="#0bb3b2" />
					</View>
				) : (
					<View className="mx-4 flex justify-around flex-1 mb-2">
						{/* location */}
						{location ? (
							<>
								<Text className="text-white text-center text-2xl font-bold">
									{location.name} &nbsp;
									<Text className="text-lg font-semibold text-gray-300">
										{location.country}
									</Text>
								</Text>
							</>
						) : null}

						{/* weather image */}
						<View className="flex-row justify-center">
							<Image
								source={weatherImages[current?.condition.text]}
								className="w-52 h-52"
							/>
						</View>
						{/* degree celcius */}
						<View className="space-y-2">
							{current ? (
								<>
									<Text className="text-center font-bold text-white text-6xl ml-5">
										{current.temp_c}&#176;
									</Text>
									<Text className="text-center text-white text-xl tracking-widest">
										{current.condition.text}
									</Text>
								</>
							) : null}
						</View>
						{/* other stats */}
						<View className="flex-row justify-between mx-4">
							{current ? (
								<>
									<View className="flex-row space-x-2 items-center">
										<Image
											source={require("../assets/icons/wind.png")}
											className="h-6 w-6"
										/>
										<Text className="text-white font-semibold text-base">
											{current.wind_kph}Km/h
										</Text>
									</View>
									<View className="flex-row space-x-2 items-center">
										<Image
											source={require("../assets/icons/drop.png")}
											className="h-6 w-6"
										/>
										<Text className="text-white font-semibold text-base">
											{current.humidity}%
										</Text>
									</View>
									<View className="flex-row space-x-2 items-center">
										<Image
											source={require("../assets/icons/sun.png")}
											className="h-6 w-6"
										/>
										<Text className="text-white font-semibold text-base">
											{forecast?.forecast.forecastday[0].astro.sunrise}
										</Text>
									</View>
								</>
							) : null}
						</View>

						{/* forecast for next days */}
						{forecast ? (
							<View className="mb-2 space-y-3">
								<View className="flex-row items-center mx-5 space-x-2">
									<CalendarDaysIcon size={22} color="white" />
									<Text className="text-white text-base"> Daily forecast</Text>
								</View>
								<ScrollView
									horizontal
									contentContainerStyle={{ paddingHorizontal: 15 }}
									showsHorizontalScrollIndicator={false}
								>
									{forecast?.forecast?.forecastday?.map((item, index) => {
										let date = new Date(item.date)
										console.log(date)
										let options = { weekday: "long" as const }
										let dayName = date
											.toLocaleDateString("pt-BR", options)
											.split(",")[0]

										return (
											<View
												key={index}
												className="flex justify-center items-center w-24 rounded-3xl space-y-1 mr-4"
												style={{ backgroundColor: theme.bgWhite(0.15) }}
											>
												<Image
													source={
														weatherImages[item?.day?.condition?.text]
													}
													className="h-11 w-11"
												/>
												<Text className="text-white">{dayName}</Text>
												<Text className="text-white text-xl font-semibold">
													{item.day.avgtemp_c}&#176;
												</Text>
											</View>
										)
									})}
								</ScrollView>
							</View>
						) : null}
					</View>
				)}
			</SafeAreaView>
		</View>
	)
}
