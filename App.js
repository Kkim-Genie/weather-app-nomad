import * as Location from "expo-location";
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';

const { width:SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "891739b92eb6b365a68b6df30efb1f8b";

export default function App() {
	const [city, setCity] = useState("Loading..");
	const [days, setDays] = useState([]);
	const [ok, setOk] = useState(true);
	const getWeather = async () => {
		const {granted} = await Location.requestForegroundPermissionsAsync();
		if(!granted){
			setOk(false);
		}
		const {
		  coords: { latitude, longitude },
		} = await Location.getCurrentPositionAsync({ accuracy: 5 });
		const location = await Location.reverseGeocodeAsync(
		  { latitude, longitude },
		  { useGoogleMaps: false }
		);
		setCity(location[0].region);
		const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
		const json = await response.json();
		setDays(json.list);
	};
	useEffect(() => {
		getWeather();
	}, []);
  return (
    <View style={styles.container}>
     	<View style={styles.city}>
        	<Text style={styles.cityName}>{city}</Text>
    	</View>
		<ScrollView pagingEnabled horizontal indicatorStyle={false} contentContainerStyle={styles.weather}>
			{days.length===0 ? (
				<View style={styles.day}>
					<ActivityIndicator color="white" style={{marginTop:10}} size="large" />
				</View>
			) : (
				days.map((day, index) => 
					<View key={index} style={styles.day}>
						<Text style={styles.dt}>{day.dt_txt}</Text>
						<Text style={styles.temp}>{parseFloat(day.main.temp).toFixed(1)}</Text>
						<Text style={styles.description}>{day.weather[0].main}</Text>
						<Text style={styles.tinyText}>{day.weather[0].description}</Text>
					</View>
				)
			)}
			
		</ScrollView>
    	<StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
	container:{
		flex:1, 
		backgroundColor: 'tomato'
	},
	city: {
		flex:1.2,
		justifyContent: 'center',
		alignItems: 'center',
	},
	cityName: {
		fontSize: 68,
		fontWeight: 500,
	},
	weather:{
	},
	day: {
		width: SCREEN_WIDTH,
		alignItems: 'center',
	},
	temp: {
		marginTop: 50,
		fontSize: 158,
	},
	description: {
		marginTop:-30,
		fontSize: 60,
	},
	tinyText: {
		fontSize:20,
	}
});
