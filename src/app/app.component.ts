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
	title = 'Number of contacts added this week';

	lineChartMulti = [
		{
				"name": "New contact added",
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
	yAxisTicks = []
	showLegend = "New leads";
	contact_nums = "0"

	constructor(
		private contactService: ContactService, 
		private userService : UsersService
	){}

  ngOnInit() {

		let totalContact = 0

		// Initialize Chart xAxis and yAxis
		let FirdayArray = []
		
		var friday = moment().startOf('week').day("Friday");

		// if (friday.date() > 7) friday.add(7,'d');
		var month = friday.month();
		var count = 4
		while(count > 0){
				FirdayArray.push(new Date(friday.toString()))
				friday.subtract(7,'d');
				count--
		}


		this.xAxisTicks = [...FirdayArray]

		this.userService.getUsers().subscribe( e => {
			var keys = Object.keys(e.data);
			totalContact = keys.length-1

			this.contacts = new Contact()
			this.contacts.weekname = moment().startOf('week').add('days', 5).format("YYYY-MM-DD") // current date => moment().format("YYYY-MM-DD")
			this.contacts.count_contact = totalContact
			this.contactService.createContacts(this.contacts.weekname, this.contacts.count_contact)

			this.contactService.getContacts().subscribe( e => {
					
				var dataSource = []

				FirdayArray.forEach(item => {
					dataSource.push({
						"name" : item,
						"value" : 0,
					})
				})

				let max_value = 0
				let first_count = 0 , prev_count = 0, first_diff = 0;
				var first_friday = dataSource[dataSource.length-1]

				e.forEach(item => {
					let cond1_current = moment(first_friday.name.toString()).format("YYYY-MM-DD")
					let cond2_prev = moment(first_friday.name.toString()).add('-1', 'week').day(5).format("YYYY-MM-DD")
					let cond3_item = item.weekname

					if (moment(cond3_item).valueOf() == moment(cond1_current).valueOf()){
						first_count = item.count_contact
					}

					if (moment(cond3_item).valueOf() == moment(cond2_prev).valueOf()){
						prev_count = item.count_contact
					}
				})

				first_diff = first_count - prev_count

				console.log("diff", first_diff)

				for (let i =0; i < dataSource.length; i++){
					var source = dataSource[i];
				
					e.forEach(item => {
						let cond1 = moment(source.name.toString()).format("YYYY-MM-DD")
						let cond2 = item.weekname

						if (max_value < item.count_contact) max_value = item.count_contact

						if (moment(cond1).valueOf() == moment(cond2).valueOf()){
							source.value = item.count_contact
							
						}
					})

					dataSource[i] = source;
				}

				// Y-Axis Setting
				let yAxis = []
				for (let i = 0; i < max_value/3; i++){
					yAxis.push(i*3)
				}

				this.yAxisTicks = [...yAxis]

				let diff = []
				
				for (let i = 1; i < dataSource.length; i++){
						diff.push(dataSource[i-1].value - dataSource[i].value)
				}
				diff.push(first_diff)

				for (let i = 0; i < dataSource.length; i++){
						dataSource[i].value = diff[i]
				}
				
				this.lineChartMulti[0].series = dataSource
				this.lineChartMulti = [...this.lineChartMulti]
			})

		})
		

    }

	onSelect(event) {
		// console.log(event);
		this.contact_nums = event.value
	}

	onActivate(event){
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
