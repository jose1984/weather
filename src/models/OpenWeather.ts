
//eslint-disable-next-line
declare interface Coord {
    lon: number;
    lat: number;
}

declare interface Weather {
    id: number;
    main: string;
    description: string;
    icon: string;
}

declare interface Main {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
}

declare interface Wind {
    speed: number;
    deg: number;
}

declare interface Clouds {
    all: number;
}

declare interface Sys {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
}

export interface OpenWeather {
    coord: Coord;
    weather: Weather[];
    base: string;
    main: Main;
    visibility: number;
    wind: Wind;
    clouds: Clouds;
    dt: number;
    sys: Sys;
    timezone: number;
    id: number;
    name: string;
    cod: number;
}

