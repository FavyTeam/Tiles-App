import { Component } from '@angular/core';
import { ContactService } from '../service/contact.service';
import { Contact } from '../model/contact.model';
import { UsersService } from '../service/users.service'
import {Observable} from 'rxjs';
import * as moment from 'moment';
import * as chartsData from '../app/ngxchart.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
	contacts : Contact;
	title = 'angular-tiles';

	lineChartMulti = [
		{
				"name": "Email Count",
				"series": []
		}
	];

	lineChartView: any[] = chartsData.lineChartView;
	lineChartShowXAxis = chartsData.lineChartShowXAxis;
	lineChartShowYAxis = chartsData.lineChartShowYAxis;
	lineChartGradient = chartsData.lineChartGradient;
	lineChartShowLegend = chartsData.lineChartShowLegend;
	lineChartShowXAxisLabel = chartsData.lineChartShowXAxisLabel;
	lineChartXAxisLabel = chartsData.lineChartXAxisLabel;
	lineChartShowYAxisLabel = chartsData.lineChartShowYAxisLabel;
	lineChartYAxisLabel = chartsData.lineChartYAxisLabel;
	lineChartColorScheme = chartsData.lineChartColorScheme;
	lineChartAutoScale = chartsData.lineChartAutoScale;
	lineChartLineInterpolation = chartsData.lineChartLineInterpolation;
	lineMaxYAxisTickLength = chartsData.lineMaxYAxisTickLength;
	linetrimYAxisTicks = chartsData.linetrimYAxisTicks;

	showLegend = "Overview of Email Growing on tiles app";

	constructor(
		private contactService: ContactService, 
		private userService : UsersService
	){}

  ngOnInit() {

		let totalContact = 0
		
		this.userService.getUsers().subscribe( e => {
			var keys = Object.keys(e.data);
			totalContact = keys.length-1

			this.contacts = new Contact()
			this.contacts.weekname = moment().format("YYYY-MM-DD")
			this.contacts.count_contact = totalContact
			this.contactService.createContacts(this.contacts.weekname, this.contacts.count_contact)

			this.contactService.getContacts().subscribe( e => {
				
				let dataSource = []

				e.forEach(item => {
					dataSource.push({
						"name" : new Date(item.weekname),
						"value" : item.count_contact,
					})
				})

				this.lineChartMulti[0].series = dataSource
				this.lineChartMulti = [...this.lineChartMulti]
			})

		})

		// if (moment().weekday() == 5){
		// today is friday
		// this.contactService.createContacts(this.contacts)
		// }

    }

	onSelect(event) {
		console.log(event);
	}

	dateTickFormatting(val: any): String {
		if (val instanceof Date) {
      var options = { year: '2-digit',
											month: '2-digit',
											day: '2-digit' 
										};
      //return (<Date>val).toLocaleString('de-DE', options);
      return (<Date>val).toLocaleString('en-US', options);
    }
	}

}
