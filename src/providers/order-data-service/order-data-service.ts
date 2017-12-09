
export class OrderDataServiceProvider {
  fromLoc: any;
  fromAddress: string = '';
  roadAddresses:  Array<any> = [];


  constructor() {
    console.log('Hello OrderDataServiceProvider Provider');
  }

  setFrom(loc, addr) {
  	this.fromLoc = loc;
  	this.fromAddress = addr;
  }

  setTo(loc, addr, ind) {
  	this.roadAddresses[ind-1].lat = loc.lat;
  	this.roadAddresses[ind-1].lon = loc.lon;
  	this.roadAddresses[ind-1].addr = addr;
  }
}
