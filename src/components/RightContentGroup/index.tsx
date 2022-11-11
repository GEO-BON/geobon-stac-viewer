import React from "react";
import { useSelector } from "react-redux";
import { RightContent } from "src/styles";
import CustomMap from "src/components/CustomMap";
import { BQDrawer } from "bq-react-lib";

/**
 *
 * @param props properties
 * @returns component
 */
const RightContentGroup = (props: any) => {
  const generalState = useSelector((state: any) => state.reducerState);
  const { currentLayerTiles } = props;

  /**
   *
   */
  const customMapProps = {
    currentLayerTiles,
  };

  return (
    <RightContent style={{ width: "100vw" }}>
      <CustomMap {...customMapProps} />
    </RightContent>
  );
};

export default RightContentGroup;
