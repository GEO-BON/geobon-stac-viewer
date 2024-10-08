import styled from "styled-components";
import { colors } from "../../../styles";
import { SideContainer } from "../sidebarstyle";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

export const SidebarFormContainer = styled(SideContainer)`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  padding: 0 30px;
  height: fit-content;
  margin-top: 35px;
`;

export const WrapperContainer = styled(SideContainer)`
  display: flex;
  flex-direction: column;
  padding: 0 1.8em;
`;

export const AccordionContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Spiner = styled.div`
  width: 100%;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.div`
  width: 100%;
  border-radius: 8px;
  padding: 0.5em 1em;
  background: #038c7c;
  color: ${colors.white};
  align-items: center;
  margin-bottom: 20px;
`;

export const MainTitle = styled.div`
  width: 100%;
  padding: 0.5em 0em 0em 0.2em;
  font-size: 1.2em;
  font-weight: 800;
  font-family: "Lato";
  text-shadow: 1px 1px 1px #6666669c;
  letter-spacing: 0.05em;
  color: ${colors.white};
`;

export const MainSubTitle = styled.div`
  width: 100%;
  padding: 0em 0.5em 1em 0.2em;
  font-size: 0.8em;
  font-weight: 400;
  font-family: "Lato";
  letter-spacing: 0.075em;
  color: #fffffff2;
`;

export const Item = styled(Paper)(() => ({
  backgroundColor: "#fff",
  padding: "8px",
  width: "100%",
  borderRadius: "8px !important",
}));

export const SelectorTitle = styled(Box)(() => ({
  padding: "8px",
  fontWeight: "bold",
  width: "100%",
  fontSize: "0.8em",
  color: colors.darkgray,
  fontFamily: "Lato",
}));
