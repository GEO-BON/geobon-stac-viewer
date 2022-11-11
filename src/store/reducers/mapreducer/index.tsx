import { SETSEARCHSTATUS, SETGROUPSTATE } from "src/store/reducers/types";

/**
 * action interface
 */
interface Action<T> {
  /**
   * type of action
   */
  type: string;

  /**
   * content of the action payload
   */
  payload: T;
}

interface RootState<F> {
  features: F[];
  drawerOpen: boolean;
  mapZoom: number;
  mapBounds: any;
  legendData: any[];
  histogramData: any[];
  id: number;
  taxakeys: any;
}

const initialState: RootState<any> = {
  features: [],
  drawerOpen: true,
  mapZoom: 5,
  mapBounds: {
    _southWest: { lng: -140.88867187500003, lat: 35.24561909420681 },
    _northEast: { lng: -3.1640625000000004, lat: 68.23682 },
  },
  legendData: [],
  histogramData: [],
  id: 19,
  taxakeys: undefined,
};

const defaultAction = {
  type: "",
  payload: {},
};

/**
 * @param state state
 * @param action action
 * @returns object
 */
const mapReducer = (
  state = initialState,
  action: Action<any> = defaultAction
) => {
  const { type, payload } = action;
  switch (type) {
    case SETSEARCHSTATUS:
      return {
        ...state,
        fetching: payload.fetching,
      };
    case SETGROUPSTATE:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};

export default mapReducer;

/**
 *
 * @param {*} status status
 * @returns void
 */
export const updateFetchingStatus =
  (status: boolean) => async (dispatch: (action: Action<any>) => void) => {
    dispatch({
      type: SETSEARCHSTATUS,
      payload: { fetching: status },
    });
  };

/**
 *
 * @param state state
 * @returns void
 */
export const updateState =
  (state: any) => async (dispatch: (action: Action<any>) => void) => {
    dispatch({
      type: SETGROUPSTATE,
      payload: { ...state, fetching: false },
    });
  };
