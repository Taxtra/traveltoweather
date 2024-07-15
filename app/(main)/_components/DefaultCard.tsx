import React from "react";

const defaultCard = () => {
  return (
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
                "Welche Temperatur möchtest du haben?" + (city?.city || "")
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
  );
};

export default defaultCard;
