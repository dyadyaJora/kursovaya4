import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OrderDataServiceProvider } from '../../providers/order-data-service/order-data-service';
import * as $ from'jquery';

declare var ymaps: any;

@IonicPage()
@Component({
  selector: 'page-show-route',
  templateUrl: 'show-route.html',
})
export class ShowRoutePage {

  myMap: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public orderData: OrderDataServiceProvider) {
  	let _this = this;
  	ymaps.ready(init);

  	function init() {
  		_this.myMap = new ymaps.Map('route-map', {
  			center: [44.952093, 34.102473],
            zoom: 9,
            controls: ['zoomControl']
        });

  		let DistanceControlClass = function (options) {
            DistanceControlClass.superclass.constructor.call(this, options);
            this._$content = null;
            this._geocoderDeferred = null;
        };

        ymaps.util.augment(DistanceControlClass, ymaps.collection.Item, {
	        onAddToMap: function (map) {
	            DistanceControlClass.superclass.onAddToMap.call(this, map);
	            this._lastCenter = null;
	            this.getParent().getChildElement(this).then(this._onGetChildElement, this);
	        },

	        onRemoveFromMap: function (oldMap) {
	            this._lastCenter = null;
	            if (this._$content) {
	                this._$content.remove();
	                this._mapEventGroup.removeAll();
	            }
	            DistanceControlClass.superclass.onRemoveFromMap.call(this, oldMap);
	        },

	        _onGetChildElement: function (parentDomContainer) {
	        	let _content = _this.orderData.distance ? '<div>Расстояние: <b>' + (_this.orderData.distance/1000).toFixed(1) + ' км </b></div>' : 'Маршрут неопределен.';
	        	let _paths = [];
	        	console.log('aaaaaaaa');
	        	if (_this.orderData.distance) {
	        		let pathsCount = _this.orderData.yandexRoute.getActiveRoute().getPaths().getLength();
	        		_this.orderData.yandexRoute.getActiveRoute().getPaths().each((item, i) => {
	        			if (i + 1 > pathsCount) 
	        				return;
	        			
	        			_paths.push(item.properties._data.distance.text);
	        		});

	        		_content += _paths.join(' + ');
	        	}

	            // Создаем HTML-элемент с текстом.
	            this._$content = $('<div class="distanceControl">' + _content + '</div>').appendTo(parentDomContainer);
	            this._mapEventGroup = this.getMap().events.group();
	            // Запрашиваем данные после изменения положения карты.
	            this._mapEventGroup.add('boundschange', this._createRequest, this);
	            // Сразу же запрашиваем название места.
	            this._createRequest();
	        }
	    });

	    let distanceControl = new DistanceControlClass();
	    _this.myMap.controls.add(distanceControl, {
	        float: 'none',
	        position: {
	            top: 10,
	            left: 10
	        }
	    });

        if (_this.orderData.yandexRoute) {
        	_this.myMap.geoObjects.add(_this.orderData.yandexRoute);
        } else  {
        	let myPlacemark;
        	if (_this.orderData.fromLoc) {
        		myPlacemark = new ymaps.Placemark([_this.orderData.fromLoc.lat, _this.orderData.fromLoc.lon] , {
			        balloonContentHeader: "Откуда",
		            balloonContentBody: _this.orderData.fromAddress,
			    }, {
			        preset: 'islands#redDotIcon'
			    });

			    _this.myMap.geoObjects.add(myPlacemark);
			}

			_this.orderData.roadAddresses.forEach( item => {
				if (item.lat && item.lon) {
	        		myPlacemark = new ymaps.Placemark([item.lat, item.lon] , {
				        balloonContentHeader: "Куда",
			            balloonContentBody: item.addr,
				    }, {
				        preset: 'islands#redDotIcon'
				    });

				    _this.myMap.geoObjects.add(myPlacemark);
				}
			});
        }
  	}
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShowRoutePage');
  }

}
