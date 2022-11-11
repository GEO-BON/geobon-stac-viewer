import React from "react";
import { LeftContent } from "src/styles";
import Sidebar from "src/components/Sidebar";

/**
 *
 */
function LeftContentGroup(props: any) {
  return (
    <LeftContent>
      <Sidebar {...props} />
    </LeftContent>
  );
}

export default LeftContentGroup;
