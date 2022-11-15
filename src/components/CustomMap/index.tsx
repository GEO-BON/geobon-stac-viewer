import React from "react";
import MapWrapper from "./MapWrapper";
import { CustomMapContainer } from "./custommapstyles";

/**
 *
 * @param props
 */
function CustomMap(props: any) {
  const { selectedLayerTiles } = props;

  /**
   * props for wrapper components
   */

  return (
    <CustomMapContainer>
      <MapWrapper {...props} />
    </CustomMapContainer>
  );
}

export default CustomMap;
