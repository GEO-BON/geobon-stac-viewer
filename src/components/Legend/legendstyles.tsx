import styled from "styled-components";
import { colors } from "src/styles";

export const LegendContainer = styled.div`
  display: inline-block;
  margin: 2.5em 2em;
  padding: 1.5em;
  border-radius: 10px;
  justify-content: left;
  line-height: 18px;
  color: #555;
  z-index: 1000;
  font: 12px/1.5 Helvetica Neue, Arial, Helvetica, sans-serif;
  font-size: 12px;
  background: ${colors.white};
`;

export const LegendItemContainer = styled.div`
  display: flex;
  justify-content: left;
  background: transparent;
  gap: 0.5em;
`;

export const LegendItemColorBox = styled.div`
  min-width: 20px;
  min-height: 20px;
`;

export const LegendItemText = styled.div`
  flex-grow: 1;
  text-align: center;
  white-space: nowrap;
  font-size: 1em;
  padding-left: 0.5em;
  padding-right: 0.5em;
`;
