import React from "react";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import {
  UL,
  Li,
  DownloadBtn,
  Popupcontainer,
  DownloadToolTipContainer,
  DownloadToolTip,
} from "../custommapstyles";

const CustomPopup = (props: any) => {
  const { g, translator = (text: string) => text, id = "" } = props;

  return (
    <Popupcontainer>
      <strong>{translator(g.name)}</strong>
      <UL>
        <Li>
          {`${translator("Observations")}: ${g.count_obs ? g.count_obs : 0} `}{" "}
        </Li>
        <Li>
          <Popupcontainer>
            {`${translator("Espèces")}: ${
              g.count_species ? g.count_species : 0
            } `}{" "}
          </Popupcontainer>

          <DownloadToolTipContainer id={`popuptooltipcontainer${id}`}>
            <DownloadBtn id={`downloadSpecies${id}`}>
              <CloudDownloadIcon id={`icondownload${id}`} />
            </DownloadBtn>
            <DownloadToolTip id={`popuptooltip${id}`}>
              {" "}
              {translator("Télécharger la liste d'espèces")}
            </DownloadToolTip>
          </DownloadToolTipContainer>
        </Li>
        <Li>
          {`${translator("Nombre d'espèces estimé")}: ${
            g.est_count_species ? g.est_count_species : 0
          } `}{" "}
        </Li>
      </UL>
    </Popupcontainer>
  );
};

export default CustomPopup;
