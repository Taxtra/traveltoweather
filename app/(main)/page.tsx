"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardFooter,
  Image,
  Button,
  CardBody,
  CardHeader,
  Input,
} from "@nextui-org/react";
import LoadingCard from "./_components/LoadingCard";
import ResultCard from "./_components/ResultCard";
import Footer from "./_components/Footer";

interface City {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface WeatherData {
  daily: {
    time: Date[];
    temperature2mMax: number[];
    temperature2mMin: number[];
    rainSum: number[];
  };
}

export default function Home() {
  const [country100, setCountry100] = useState<City[]>([]);
  const [temperature, setTemperature] = useState("");
  const [allLatitude, setAllLatitude] = useState<string[]>([]);
  const [allongitude, setAllLongitude] = useState<string[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [avarageTemperature, setAvarageTemperature] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFinnished, setIsFinnished] = useState<boolean>(false);
  const [city, setCity] = useState<City | null>(null);

  let timer: NodeJS.Timeout | null = null;

  useEffect(() => {
    fetch("/data/globalCountry100.json")
      .then((response) => response.json())
      .then((data) => setCountry100(data));
  }, []);

  useEffect(() => {
    if (!country100) return;
    const setupCoordinates = () => {
      const latitudesArray = country100.map((city) => city.latitude);
      const longitudesArray = country100.map((city) => city.longitude);

      setAllLatitude(latitudesArray.map(String));
      setAllLongitude(longitudesArray.map(String));
    };

    // Setup-Koordinaten beim Laden der Komponente
    setupCoordinates();
  }, [country100]);

  useEffect(() => {
    if (avarageTemperature.length !== 0) {
      console.log(avarageTemperature);

      const findLocation = (
        allTemperatures: number[],
        searchedTemperature: number
      ): number => {
        let naechsterIndex = 0;
        let minimalerUnterschied = Math.abs(
          allTemperatures[0] - searchedTemperature
        );

        for (let i = 1; i < allTemperatures.length; i++) {
          const unterschied = Math.abs(
            allTemperatures[i] - searchedTemperature
          );
          if (unterschied < minimalerUnterschied) {
            minimalerUnterschied = unterschied;
            naechsterIndex = i;
          }
        }
        setIsFinnished(true);

        return naechsterIndex;
      };

      if (timer) {
        clearTimeout(timer);
      }
      setCity(
        country100[findLocation(avarageTemperature, Number(temperature))]
      );
    }
  }, [avarageTemperature]);

  const fetchWeather = async () => {
    try {
      const params = {
        latitude: allLatitude,
        longitude: allongitude,
        daily: ["temperature_2m_max", "temperature_2m_min", "rain_sum"],
        timezone: "Europe/Berlin",
      };
      const url = "https://api.open-meteo.com/v1/forecast";

      const responses = await fetch(
        url + "?" + new URLSearchParams(params as any)
      ).then((res) => res.json());

      // Helper function to form time ranges
      const range = (start: any, stop: any, step: any) =>
        Array.from(
          { length: (stop - start) / step },
          (_, i) => start + i * step
        );

      // Initialize arrays to store aggregate data
      const allAverageTemperatures = [];
      const allWeatherData = [];

      // Process each location/model in responses
      for (const response of responses) {
        const daily = response.daily;

        // Note: The order of weather variables in the URL query and the indices below need to match!
        const data = {
          daily: {
            time: range(
              Number(daily.time),
              Number(daily.timeEnd),
              daily.interval
            ).map((t) => new Date((t + 7200) * 1000)),
            temperature2mMax: daily.temperature_2m_max,
            temperature2mMin: daily.temperature_2m_min,
            rainSum: daily.rain_sum,
          },
        };

        // Compute average temperatures
        const durchschnitte = data.daily.temperature2mMax.map(
          (wert: any, index: any) =>
            (wert + data.daily.temperature2mMin[index]) / 2
        );

        const summe = durchschnitte.reduce(
          (acc: any, wert: any) => acc + wert,
          0
        );
        allAverageTemperatures.push(summe / durchschnitte.length);

        allWeatherData.push(data);
      }

      // Set the average temperatures and weather data for all locations/models
      setAvarageTemperature(allAverageTemperatures);
      setWeatherData(allWeatherData);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching weather data:", error);
    }
  };

  const handleSearch = () => {
    setIsLoading(true);
    // Start the timer when the search begins
    timer = setTimeout(() => {
      // This function will be called after the minimum load time
      console.log("Minimum load time elapsed");
      setIsLoading(false);
    }, 5000); // 5 seconds

    fetchWeather();
  };

  return (
    <>
      <main className="max-h-screen h-screen">
        <div className="flex justify-center pt-10 ">
          <Card className="w-[100rem] flex justify-center">
            <CardHeader></CardHeader>
            <CardBody>
              <h1 className="font-bold text-5xl text-center">
                {!isLoading &&
                  !isFinnished &&
                  " Gebe eine Temperatur an, die an deinem Reiseziel herrschen soll."}
                {isLoading &&
                  " Wir suchen für dich die beste Stadt, die deinen Kriterien entspricht."}
                {!isLoading && isFinnished && `Deine Reise geht nach: `}
              </h1>
            </CardBody>
            <CardFooter></CardFooter>
          </Card>
        </div>

        {!isLoading && !isFinnished && (
          <div className={`gap-3 items-center justify-center mt-72 flex`}>
            <Card className="w-[50rem] h-[26rem]">
              <CardHeader></CardHeader>
              <CardBody className="flex justify-center">
                <div className="flex justify-center">
                  <Image src="startpage.jpeg" width={500} height={500} />
                </div>
                <div className="flex">
                  <Input
                    placeholder={
                      "Welche Temperatur möchtest du haben?" +
                      (city?.city || "")
                    }
                    className="pt-5"
                    type="number"
                    max={100}
                    value={temperature}
                    onValueChange={setTemperature}
                  />
                  <div className="pt-5">
                    <Button onClick={handleSearch}>Suche</Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {isLoading && <LoadingCard />}
        {!isLoading && isFinnished && <ResultCard city={city} />}
      </main>
      <Footer />
    </>
  );
}
