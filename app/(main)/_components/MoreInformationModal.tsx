import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Image,
  Divider,
} from "@nextui-org/react";
import { Accordion, AccordionItem } from "@nextui-org/react";

const MoreInformationModal = (props: any) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [cityInformation, setCityInformation] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [avarageTemperature, setAvarageTemperature] = useState<number>(0);
  const [rainSum, setRainSum] = useState<number>(0);

  useEffect(() => {
    fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${props.city.city}&language=de&count=1`
    )
      .then((response) => response.json())
      .then((data) => setCityInformation(data));
  }, [props.city]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const params = {
          latitude: String(props.city.latitude),
          longitude: String(props.city.longitude),
          daily: ["temperature_2m_max", "temperature_2m_min", "rain_sum"],
          timezone: "Europe/Berlin",
        };
        const url = "https://api.open-meteo.com/v1/forecast";

        const responses = await fetch(
          url + "?" + new URLSearchParams(params as any)
        ).then((res) => res.json());

        console.log(responses, "respones");

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

        const response = responses;

        const daily = response.daily;

        // Note: The order of weather variables in the URL query and the indices below need to match!
        const data = {
          daily: {
            time: daily.time,
            temperature2mMax: daily.temperature_2m_max,
            temperature2mMin: daily.temperature_2m_min,
            rainSum: daily.rain_sum,
          },
        };

        allWeatherData.push(data);

        const durchschnitte = data.daily.temperature2mMax.map(
          (wert: any, index: any) =>
            (wert + data.daily.temperature2mMin[index]) / 2
        );

        const summe = durchschnitte.reduce(
          (acc: any, wert: any) => acc + wert,
          0
        );
        setAvarageTemperature(summe / durchschnitte.length);
        setRainSum(
          data.daily.rainSum.reduce(
            (accumulator: number, currentValue: number) =>
              accumulator + currentValue,
            0
          )
        );

        console.log(allWeatherData, "allWeatherData");
        // Set the average temperatures and weather data for all locations/models
        setWeatherData(allWeatherData);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, [props.city]);

  useEffect(() => {
    console.log(weatherData, "weatherData");
  }, [weatherData]);

  const convertDate = (date: string) => {
    if (!date) return "FEHLER";
    let dateParts = date.split("-");

    let tag = dateParts[2];
    let monat = dateParts[1];
    return `${tag}.${monat}`;
  };

  const getWeatherString = (date: number) => {
    const max = weatherData[0]["daily"]["temperature2mMax"][date];
    const min = weatherData[0]["daily"]["temperature2mMin"][date];
    const rain = weatherData[0]["daily"]["rainSum"][date];
    const avg = (max + min) / 2;
    //`Max: ${max}°C, Min: ${min}°C, Regen: ${rain}mm`

    return (
      <div>
        <p>☀Maximale Temperatur: {max.toFixed(2)}°C</p>
        <p className="mt-2">🌤 Minimale Temperatur: {min.toFixed(2)}°C</p>
        <p className="mt-2">😎 Durchscnitts Temperatur: {avg.toFixed(2)}°C</p>
        <p className="mt-2">🌧 Regen: {rain.toFixed(2)}mm</p>
      </div>
    );
  };

  return (
    <>
      <Button onPress={onOpen} className="w-full  mx-5">
        Weitere Infos
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {props.city.city}, {props.city.country}
              </ModalHeader>
              <ModalBody>
                <p className="flex">
                  <img
                    src={`https://open-meteo.com/images/country-flags/${cityInformation.results[0].country_code}.svg`}
                    alt="Flag"
                    style={{
                      width: "20px",
                      height: "auto",
                      marginRight: "10px",
                    }}
                  />
                  {cityInformation.results[0].name} ist eine Stadt in{" "}
                  {props.city.country}
                </p>
                <p>
                  👨‍👩‍👧‍👦 {cityInformation.results[0].population} Menschen leben in{" "}
                  {cityInformation.results[0].name}
                </p>
                <h1 className="flex justify-center font-bold text-2xl">
                  Wetter
                </h1>
                <p>
                  ☀ {avarageTemperature.toFixed(2)}&deg;C ist die
                  Durchschnittstemperatur der nächsten 7 Tage
                </p>
                <p>🌧 {rainSum.toFixed(2)}mm Regen wird es geben</p>
                <Accordion>
                  <AccordionItem
                    key="1"
                    aria-label={`Wetter am ${convertDate(
                      weatherData[0]["daily"]["time"][0]
                    )}`}
                    title={`Wetter am ${convertDate(
                      weatherData[0]["daily"]["time"][0]
                    )}`}
                  >
                    {getWeatherString(0)}
                  </AccordionItem>
                  <AccordionItem
                    key="2"
                    aria-label={`Wetter am ${convertDate(
                      weatherData[0]["daily"]["time"][1]
                    )}`}
                    title={`Wetter am ${convertDate(
                      weatherData[0]["daily"]["time"][1]
                    )}`}
                  >
                    {getWeatherString(1)}
                  </AccordionItem>
                  <AccordionItem
                    key="3"
                    aria-label={`Wetter am ${convertDate(
                      weatherData[0]["daily"]["time"][2]
                    )}`}
                    title={`Wetter am ${convertDate(
                      weatherData[0]["daily"]["time"][2]
                    )}`}
                  >
                    {getWeatherString(2)}
                  </AccordionItem>
                  <AccordionItem
                    key="4"
                    aria-label={`Wetter am ${convertDate(
                      weatherData[0]["daily"]["time"][3]
                    )}`}
                    title={`Wetter am ${convertDate(
                      weatherData[0]["daily"]["time"][3]
                    )}`}
                  >
                    {getWeatherString(3)}
                  </AccordionItem>
                  <AccordionItem
                    key="5"
                    aria-label={`Wetter am ${convertDate(
                      weatherData[0]["daily"]["time"][4]
                    )}`}
                    title={`Wetter am ${convertDate(
                      weatherData[0]["daily"]["time"][4]
                    )}`}
                  >
                    {getWeatherString(4)}
                  </AccordionItem>
                  <AccordionItem
                    key="6"
                    aria-label={`Wetter am ${convertDate(
                      weatherData[0]["daily"]["time"][5]
                    )}`}
                    title={`Wetter am ${convertDate(
                      weatherData[0]["daily"]["time"][5]
                    )}`}
                  >
                    {getWeatherString(5)}
                  </AccordionItem>
                  <AccordionItem
                    key="7"
                    aria-label={`Wetter am ${convertDate(
                      weatherData[0]["daily"]["time"][6]
                    )}`}
                    title={`Wetter am ${convertDate(
                      weatherData[0]["daily"]["time"][6]
                    )}`}
                  >
                    {getWeatherString(6)}
                  </AccordionItem>
                </Accordion>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default MoreInformationModal;
