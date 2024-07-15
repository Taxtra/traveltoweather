import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  CardFooter,
  Button,
  Link,
} from "@nextui-org/react";
import MoreInformationModal from "./MoreInformationModal";
import ConfettiExplosion from "react-confetti-explosion";

const ResultCard = (props: any) => {
  const [picture, setPicture] = useState<string | null>(null);
  const [isExploding, setIsExploding] = React.useState(true);
  useEffect(() => {
    const fetchData = async () => {
      if (typeof props.city.city !== "string") return;
      try {
        const res = await fetch(`/api/picture?q=${props.city.city}`, {
          cache: "no-store",
        });

        const picture = await res.json();
        return picture;
      } catch (err) {
        console.error(err);
      }
    };

    const fetchAndSetPicture = async () => {
      setPicture(await fetchData());
    };

    fetchAndSetPicture();
  }, [props.city.city]);

  return (
    <div className="gap-3 items-center justify-center mt-72 flex">
      <ConfettiExplosion />
      <Card className="w-[50rem] h-[26rem]">
        <CardHeader className="text-3xl flex justify-center">
          {props.city.city}, {props.city.country}
        </CardHeader>
        <CardBody className="flex justify-center overflow-hidden">
          <div className="flex justify-center">
            <Image
              src={picture ?? ""}
              style={{ maxHeight: "300px", width: "auto" }}
              className="flex justify-center"
            />
          </div>
        </CardBody>
        <CardFooter className="flex w-full">
          <Link
            href={`https://www.google.de/search?q=Fl%C3%BCge+nach+${props.city.city}`}
            isExternal
            className="w-full mx-5"
          >
            <Button color="primary" className="w-full mx-5">
              Flug buchen
            </Button>
          </Link>

          <MoreInformationModal city={props.city} />
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResultCard;
