import { Component } from '@angular/core';
import { ContactService } from '../service/contact.service';
import { Contact } from '../model/contact.model';
import { UsersService } from '../service/users.service'
import {Observable} from 'rxjs';
import * as moment from 'moment';
// import * as weekdaysin from 'moment-weekdaysin';
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
	xAxisTicks = []

	showLegend = "Overview of Email Growing on tiles app";

	constructor(
		private contactService: ContactService, 
		private userService : UsersService
	){}

  ngOnInit() {

		let totalContact = 0

		// Initialize Chart xAxis and yAxis
		let FirdayArray = []
		
		var friday = moment().startOf('month').day("Friday");

		console.log("start date => ", friday)

		if (friday.date() > 7) friday.add(7,'d');
		var month = friday.month();
		while(month === friday.month()){
				FirdayArray.push(new Date(friday.toString()))
				friday.add(7,'d');
		}

		console.log("output => ", FirdayArray)
		this.xAxisTicks = [...FirdayArray]

		
		this.userService.getUsers().subscribe( e => {
			var keys = Object.keys(e.data);
			totalContact = keys.length-1

			if (moment().weekday() == 5){

				this.contacts = new Contact()
				this.contacts.weekname = moment().format("YYYY-MM-DD")
				this.contacts.count_contact = totalContact

				// console.log(totalContact)
				// console.log(this.contacts.weekname)

				this.contactService.createContacts(this.contacts.weekname, this.contacts.count_contact)
			}

			this.contactService.getContacts().subscribe( e => {
					
				let dataSource = []

				FirdayArray.forEach(item => {
					dataSource.push({
						"name" : item,
						"value" : 0,
					})
				})

				e.forEach(item => {
					dataSource.forEach(source => {
						let mdate = source.name
						// console.log(mdate.toLocaleString())
						let cond1 = moment(source.name.toString()).format("YYYY-MM-DD")
						let cond2 = item.weekname
						// console.log(" moment value => ", cond1)
						// console.log(" item value => ", cond2)
						// console.log(" moment value 1 => ", moment(cond1).valueOf())
						// console.log(" item value 1 => ", moment(cond2).valueOf())
						if (moment(cond1).valueOf() == moment(cond2).valueOf()){
							source.value = item.count_contact
						}
					})
				})

				this.lineChartMulti[0].series = dataSource
				this.lineChartMulti = [...this.lineChartMulti]
			})

		})

    }

	onSelect(event) {
		console.log(event);
	}

	dateTickFormatting(val: any): String {
		if (val instanceof Date) {
      var options = { 
											month: '2-digit',
											day: '2-digit' 
										};
      
      return (<Date>val).toLocaleString('en-US', options);
    }
	}

}
