import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";

const ResultCard = (props: any) => {
  const [picture, setPicture] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      if (typeof props.city !== "string") return;
      try {
        const res = await fetch(`/api/picture?q=${props.city}`, {
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
  }, [props.city]);

  return (
    <div className="gap-3 items-center justify-center mt-72 flex">
      <Card className="w-[50rem] h-[26rem]">
        <CardHeader className="text-3xl flex justify-center">
          {props.city}, {props.country}
        </CardHeader>
        <CardBody className="flex justify-center">
          <div className="flex justify-center">
            <Image
              src={picture ?? ""}
              style={{ maxHeight: "300px", width: "auto" }}
              className="flex justify-center"
            />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ResultCard;
