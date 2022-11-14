/* eslint-disable no-return-assign */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-bitwise */
/* eslint-disable no-underscore-dangle */
/* eslint-disable radix */
/* eslint-disable no-nested-ternary */
import axios from "axios";
import { Parser } from "json2csv";
import _ from "underscore";

interface ITranslation {
  /**
   * text in frech
   */
  vernacular_fr: string;

  /**
   * text in english
   */
  vernacular_en: string;
}

/**
 *
 * @param {*} i18next i18next
 * @param {*} translations translations
 * @param {*} source source
 * @returns obj
 */
export const addTranslation = async (
  i18next: any,
  translations: any,
  source: any
) => {
  const resources: any = {
    en: { translation: {} },
    fr: { translation: {} },
  };

  if (source.length !== undefined) {
    source.map((item: ITranslation) => {
      const key: string = item["vernacular_fr"] || "";
      resources["en"]["translation"][key] = item["vernacular_en"];
      resources["fr"]["translation"][key] = item["vernacular_fr"];
      return item;
    });
  }

  resources.en.translation = {
    ...resources.en.translation,
    ...translations.en.translation,
  };
  resources.fr.translation = {
    ...resources.fr.translation,
    ...translations.fr.translation,
  };

  i18next.addResourceBundle(
    "en",
    "translation",
    resources.en.translation,
    true,
    true
  );
  i18next.addResourceBundle(
    "fr",
    "translation",
    resources.fr.translation,
    true,
    true
  );
  return resources;
};

/**
 * function used to make any custom request
 * @param {*} endpoint
 * @param {*} paramObj
 * @returns
 */
export const GetStac = async (endpoint: string, paramObj: any) => {
  let result;
  const base_url = "https://io.biodiversite-quebec.ca/stac" as string;
  try {
    result = await axios.get(`${base_url}${endpoint}`, {
      params: { ...paramObj },
    });
  } catch (error) {
    result = { data: null };
  }
  return result;
};

/**
 * function used to make any custom request
 * @param {*} endpoint
 * @param {*} paramObj
 * @returns
 */
export const GetCOGStats = async (link: any) => {
  let result;
  const base_url =
    `https://tiler.biodiversite-quebec.ca/cog/statistics?url=${link}` as string;
  try {
    result = await axios.get(`${base_url}`, {});
  } catch (error) {
    result = { data: null };
  }
  return result;
};
