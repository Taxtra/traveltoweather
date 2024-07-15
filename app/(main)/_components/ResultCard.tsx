import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/react";

const ResultCard = (props: any) => {
  return (
    <div className="gap-3 items-center justify-center mt-72 flex">
      <Card className="w-[50rem] h-[26rem]">
        <CardHeader className="text-3xl flex justify-center">
          Deine Reise Geht nach
        </CardHeader>
        <CardBody>
          <h1>
            {props.city},{props.country}
          </h1>
        </CardBody>
      </Card>
    </div>
  );
};

export default ResultCard;
