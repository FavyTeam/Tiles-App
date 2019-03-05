import { Component } from '@angular/core';
import * as CanvasJS from './canvasjs.min';

import { ContactService } from '../service/contact.service';
import { Contact } from '../model/contact.model';

import { UsersService } from '../service/users.service'
import {Observable} from 'rxjs';
import * as moment from 'moment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
	contacts : Contact;

	title = 'angular-tiles';

	constructor(
		private contactService: ContactService, 
		private userService : UsersService
	){ 

	}

  ngOnInit() {

		let totalContact
		
		this.userService.getUsers().subscribe( e => {
			var keys = Object.keys(e.data);
			totalContact = keys.length-1

			this.contacts = new Contact()
				this.contacts.weekname = moment().format("YYYY-MM-DD")
			this.contacts.count_contact = totalContact

			this.contactService.getContacts().subscribe( e => {
				
				let dataSource = []

				e.forEach(item => {
					console.log ("item => ",  item.count_contact)
					dataSource.push({
						"y" : item.count_contact,
						"x" : new Date(moment(item.weekname).toString()),
					})
				})

				console.log(dataSource)
				let chart = new CanvasJS.Chart("chartContainer",{
					zoomEnabled: true,
					panEnabled: true,
					animationEnabled: true,
					axisX:{
						title:"Weekly Tags",
						labelFontSize : 12,
						interval : 1,
						intervalType : "day"
					},
					axisY:{
						title:"Number of Contact",
						interval : 3,
						labelFontSize : 12,
					},
					title:{
						text: "Overview of Email Growing on tiles app"
					},
					data: [{
						type: "line",
						dataPoints : dataSource,
						// xValueFormatString:"Year ####",
					}]
				});
				chart.render();

			})

		})

		// console.log("current date => " , moment().format("YYYY-MM-DD"))
		// if (moment().weekday() == 5){
		// today is friday
		// this.contactService.createContacts(this.contacts)
		// }

		
		
		
    }

}
