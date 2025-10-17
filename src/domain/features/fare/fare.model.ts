export interface Fare {
  requestId: string;
  originLatitude: number;
  originLongitude: number;
  destinationLatitude: number;
  destinationLongitude: number;
  datetime: Date;
  distanceInKm: number;
  price: number;
}
