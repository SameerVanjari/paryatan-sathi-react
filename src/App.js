import React, {useState, useEffect} from 'react';
import { CssBaseline, Grid } from '@material-ui/core';

import { getPlacesData, getWeatherData } from './api';

import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';

function App() {
    const [places, setPlaces] = useState([]);
    const [weatherData, setWeatherData] = useState([]);
    const [childClicked, setChildClicked] = useState(null);
    const [filteredPlaces, setFilteredPlaces] = useState([]);

    const [coordinates,setCoordinates] = useState({});
    const [bounds,setBounds] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [rating, setRating] = useState('');
    const [type, setType] = useState('restaurants');

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({coords : { latitude, longitude } }) => {
            setCoordinates({ lat: latitude, lng: longitude })
        })
    }, []);

    useEffect(() => {
        const filteredPlaces = places.filter((place) => place.rating > rating);

        setFilteredPlaces(filteredPlaces);
    },[rating]);

    useEffect(() => {
        if(bounds.sw && bounds.ne){
            setIsLoading(true);

            getWeatherData(coordinates.lat, coordinates.lng)
                .then((data) => setWeatherData(data));

            getPlacesData(type, bounds.sw , bounds.ne)
                .then((data) => {
                    // filter the places that are empty and take space
                    setPlaces(data?.filter((place) => place.name && place.num_reviews > 0 ));
                    setFilteredPlaces([]);
                    setIsLoading(false);
                })
        }
    }, [type, bounds]);


    return (
       <>
            <CssBaseline />
            <Header setCoordinates={setCoordinates} />
            <Grid container spacing={3} style={{width: "100%"}}>
                <Grid item xs={12} md={4}>
                    <List 
                        places={filteredPlaces.length ? filteredPlaces : places} 
                        childClicked={childClicked}
                        isLoading={isLoading}
                        type={type}
                        setType={setType}
                        rating={rating}
                        setRating={setRating}
                    />
                </Grid>
                <Grid item xs={12} md={8}>
                    <Map 
                        setBounds={setBounds}
                        setCoordinates={setCoordinates}
                        coordinates={coordinates} 
                        places={filteredPlaces.length ? filteredPlaces : places}
                        setChildClicked={setChildClicked}
                        weatherData={weatherData}
                        />
                </Grid>
            </Grid>
       </>
    )
}

export default App;
