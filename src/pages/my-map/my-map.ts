import { Component, } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { OrderDataServiceProvider } from '../../providers/order-data-service/order-data-service';
import * as $ from'jquery';

declare var ymaps: any;
 
@IonicPage()
@Component({
  selector: 'page-my-map',
  templateUrl: 'my-map.html',
})
export class MyMapPage {
	X: number;
	loc: any;
	address: string;
	header: string = '';
 
  constructor(public navCtrl: NavController, public navParams: NavParams, public orderData: OrderDataServiceProvider, public toast: ToastController) {
  	
  	ymaps.ready(init);
  	var _this = this;
  	this.header = this.navParams.data.point ? 'Куда ' + this.navParams.data.point : 'Откуда';

    function init(){ 
	  	var myMap, element, dragger, draggerEventsGroup; 
	  	var CustomControlClass = function (options) {
            CustomControlClass.superclass.constructor.call(this, options);
            this._$content = null;
            this._geocoderDeferred = null;
        };

        myMap = new ymaps.Map('my-map', {
            center: [_this.navParams.data.lat, _this.navParams.data.lon],
            zoom: 9
        });
        element = document.getElementById('marker'),
	    dragger = new ymaps.util.Dragger({
	        autoStartElement: element
	    }),
	    draggerEventsGroup = dragger.events.group();
        
	    ymaps.util.augment(CustomControlClass, ymaps.collection.Item, {
	        onAddToMap: function (map) {
	            CustomControlClass.superclass.onAddToMap.call(this, map);
	            this._lastCenter = null;
	            this.getParent().getChildElement(this).then(this._onGetChildElement, this);
	        },

	        onRemoveFromMap: function (oldMap) {
	            this._lastCenter = null;
	            if (this._$content) {
	                this._$content.remove();
	                this._mapEventGroup.removeAll();
	            }
	            CustomControlClass.superclass.onRemoveFromMap.call(this, oldMap);
	        }, 

	        _onGetChildElement: function (parentDomContainer) {
	            this._$content = $('<div class="customControl"><span class="customControl__address"></span> <span class="customControl__loc"></span></div>').appendTo(parentDomContainer);
	            this._mapEventGroup = this.getMap().events.group();

	            this._mapEventGroup.add('boundschange', this._createRequest, this);

	            this._createRequest();
	        },

	        _createRequest: function() {
	            var lastCenter = this._lastCenter = this.getMap().getCenter().join(',');

	            ymaps.geocode(this._lastCenter, {

	                json: true,

	                results: 1
	            }).then(function (result) {

	                    if (lastCenter == this._lastCenter) {
	                        this._onServerResponse(result);
	                    }
	                }, this);
	        },

	        _onServerResponse: function (result) {

	            var members = result.GeoObjectCollection.featureMember,
	                geoObjectData = (members && members.length) ? members[0].GeoObject : null;
	            if (geoObjectData) {
	            	_this.loc = {
	            		lat: +myMap.getCenter()[0].toFixed(6),
	            		lon: +myMap.getCenter()[1].toFixed(6)
	            	};
	            	//geoObjectData.Point.pos.split(' ')[1]
	            	_this.address = geoObjectData.metaDataProperty.GeocoderMetaData.Address.formatted;
	                this._$content.find('.customControl__address').text(_this.address);
	                this._$content.find('.customControl__loc').text(_this.loc.lat + '\u00A0' + _this.loc.lon);
	            }
	        }
	    });

	    var customControl = new CustomControlClass();
	    myMap.controls.add(customControl, {
	        float: 'none',
	        position: {
	            bottom: 40,
	        }
	    });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyMapPage');
  }

  chooseLoc() {
  	if (!this.address || !this.loc) {
  		let t = this.toast.create({
		    message: 'Ошибка при выборе локации. Проверьте интернет соединение и попробуйте еще раз',
		    duration: 3000,
		    position: 'bottom'
		  });

	  	t.present();
  	} else {
	  	if (!this.navParams.data.point)
	  		this.orderData.setFrom(this.loc, this.address);
	  	else
	  		this.orderData.setTo(this.loc, this.address, this.navParams.data.point);

  	}
  	this.navCtrl.pop();
  }

}
