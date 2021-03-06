/* @flow */
import markers from '../../data.json';
import moment from 'moment';

type State = {
  initialState: ?number,
}

type Action = Object;

const initialState = {
    currentSelected: null,
};

export const select = (marker: Object) => ({
  type: 'SELECT',
  marker,
})

export const openingStatus = epicerie => {
  const date = moment();
  const currentHour = date.hours();
  let checkingHoursOfPrevDay = false;
  if (currentHour < 6) {
    date.subtract(1, 'day');
    checkingHoursOfPrevDay = true;
  }
  const currentDay = date.format('dddd').slice(0, 3).toLowerCase();
  if (typeof epicerie.hours == "undefined" || !epicerie.hours[currentDay + '_close']) {
    return {
      color: "grey",
      text: "Horaire non disponible..."
    };
  }
  const closingHour = parseInt(epicerie.hours[currentDay + '_close'].slice(0, 2), 10);
  if (
       (checkingHoursOfPrevDay && currentHour > closingHour)
    || (!checkingHoursOfPrevDay && currentHour < closingHour)
  ) {
    return {
      color: '#fa3e3e',
      text: 'Actuellement fermé',
    };
  }
  return {
    color: '#42b72a',
    text: "Ouvert jusqu'à " + epicerie.hours[currentDay + '_close']
  };
}


function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

const findNearestIndex = (lat: number, long: number): number => {
  const distances = markers.map(({ coords }) => getDistanceFromLatLonInKm(lat, long, coords.latitude, coords.longitude));
  const min = Math.min(...distances);
  return distances.indexOf(min);
};

const INITIAL_LATITUDE = 48.853;
const INITIAL_LONGITUDE = 2.35;

export default function epiceries(state: State = initialState, action: Action) {
    switch (action.type) {
      case 'SET_LOCATION_ERROR':
          return {...state, 'currentSelected': findNearestIndex(INITIAL_LATITUDE, INITIAL_LONGITUDE) };
        case 'SET_INITIAL_LOCATION':
          return {...state, 'currentSelected': findNearestIndex(action.location.latitude, action.location.longitude)  };
        case 'SELECT':
          return {...state, 'currentSelected': action.marker };
        default:
            return state;
    }
}
