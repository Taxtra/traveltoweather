import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import Lottie from "lottie-react";
import loadingAnimation from "../loading.json";

const LoadingCard = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots === "") return ".";
        if (prevDots === ".") return "..";
        if (prevDots === "..") return "...";
        return "";
      });
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="gap-3 items-center justify-center mt-72 flex">
      <Card className="w-[50rem] h-[26rem]">
        <CardHeader className="text-3xl flex justify-center">
          Suche die beste Stadt {dots}
        </CardHeader>
        <CardBody>
          <Lottie animationData={loadingAnimation} style={{ height: 300 }} />
        </CardBody>
      </Card>
    </div>
  );
};

export default LoadingCard;
