/**
 *
 * @param {*} event
 * @param {*} style
 */
export const mouseoutForHexagones = (event: any, style: any) => {
  event.target.setStyle({
    fillOpacity: style.fillOpacity,
    weight: 1,
    color: "#cccccc",
  });
};

/**
 *
 * @param {*} event
 */
export const mouseoverForHexagones = (event: any) => {
  event.target.setStyle({
    fillOpacity: 1,
    weight: 4,
    color: "#ffffff",
  });
};
