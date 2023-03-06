import React from "react";
import { RightContent } from "src/styles";
import CustomMap from "src/components/CustomMap";
import { Route, Routes } from "react-router-dom";

/**
 *
 * @param props properties
 * @returns component
 */
const RightContentGroup = (props: any) => {
  return (
    <RightContent style={{ width: "100vw" }}>
      <CustomMap {...props} />
    </RightContent>
  );
};

export default RightContentGroup;
