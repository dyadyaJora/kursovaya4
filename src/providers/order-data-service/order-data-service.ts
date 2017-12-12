
export class OrderDataServiceProvider {
  fromLoc: any;
  fromAddress: string = '';
  roadAddresses:  Array<any> = [];
  yandexRoute: any;
  distance: number;


  readonly crimeaNord = 46.240364;
  readonly crimeaSouth = 44.377650;
  readonly crimeaWest = 32.479499;
  readonly crimeaEast = 36.651591;


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

  isFullRoute() : boolean {
  	return !!this.fromAddress && this.roadAddresses.every( item => {
  		return !!item.addr;
  	});
  }

  isCrimea(lat, lon, addr) : boolean {
  	return (addr.indexOf('Севастополь') !== -1 || addr.indexOf('Республика Крым') !== -1) 
  		&& lat > this.crimeaSouth && lat < this.crimeaNord && lon > this.crimeaWest && lon < this.crimeaEast;
  }

  isAllCrimea() : boolean {
  	let _this = this;
  	return this.isCrimea(this.fromLoc.lat, this.fromLoc.lon, this.fromAddress) && this.roadAddresses.every(item => {
  		return _this.isCrimea(item.lat, item.lon, item.addr);
  	});
  }

  clearAll() {
  	this.fromLoc = {};
  	this.fromAddress = '';
  	this.roadAddresses = [{addr: ''}];
  	this.yandexRoute = undefined;
  	this.distance = undefined;

  }
}
