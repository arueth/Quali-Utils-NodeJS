import {AmChartsService} from "@amcharts/amcharts3-angular";
import {Component} from '@angular/core';
import {Http, Response} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-resource-reservation-gantt',
  templateUrl: './resource-reservation-gantt.component.html',
  styleUrls: ['./resource-reservation-gantt.component.css']
})
export class ResourceReservationGanttComponent {
  private chart: any;
  private chartHeight: number;
  private chartHeightMax = 1000;
  private dataSource: any;
  private resourceFilter = '';

  constructor(private AmCharts: AmChartsService, private http: Http) {
  }

  ngOnInit() {
    this.getData();

    this.chart = this.AmCharts.makeChart("gantt", {
      "type": "gantt",
      "theme": "dark",
      "marginRight": 70,
      "period": "hh",
      "dataDateFormat": "YYYY-MM-DD JJ:NN",
      "columnWidth": 0.5,
      "valueAxis": {
        "minimumDate": Date.now(),
        "type": "date"
      },
      "graph": {
        "lineAlpha": 1,
        "lineColor": "#000",
        "fillAlphas": 0.85,
        "balloonText": "<b>[[name]] ([[id]])</b><br/>owner: [[owner]]<br/>[[start]] - [[end]]"
      },
      "rotate": true,
      "categoryField": "category",
      "segmentsField": "segments",
      "startDateField": "start",
      "endDateField": "end",
      "valueScrollbar": {
        "autoGridCount": true,
        "backgroundColor": "#EFEFEF",
        "hideResizeGrips": true,
        "selectedBackgroundColor": "#000000"

      },
      "chartCursor": {
        "cursorColor": "#55bb76",
        "valueBalloonsEnabled": false,
        "cursorAlpha": 0,
        "valueLineAlpha": 1,
        "valueLineBalloonEnabled": true,
        "valueLineEnabled": true,
        "zoomable": false,
        "valueZoomable": true
      },
      "export": {
        "enabled": true,
        "libs": {
          "path": "/static/amcharts/plugins/export/libs/"
        }
      },
      "listeners": [{
        "event": "rollOverGraphItem",
        "method": this.rollOver
      }, {
        "event": "rollOutGraphItem",
        "method": this.rollOut
      }]
    });
  }

  ngOnDestroy() {
    this.AmCharts.destroyChart(this.chart);
  }

  getData() {
    this.http.get("/data/resource-gantt-reservations.json")
      .map(this.extractData)
      .catch(this.handleError)
      .subscribe(
        (data) => {
          this.dataSource = data;
          this.updateChartData(data);

          let loader = document.getElementById("loader");
          loader.parentElement.removeChild(loader);
        }
      );
  }

  private extractData(res: Response) {
    let json = res.json();

    return json || {};
  }

  private handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  rollOver = function (event: any) {
    var elements = event.item.columnGraphics.node.getElementsByTagName("path");
    for (var i = 0; i < elements.length; i++) {
      elements[i].setAttribute("stroke-width", 3);
    }
  };

  rollOut = function (event: any) {
    var elements = event.item.columnGraphics.node.getElementsByTagName("path");
    for (var i = 0; i < elements.length; i++) {
      elements[i].setAttribute("stroke-width", 1);
    }
  };

  refreshData() {
    if (this.dataSource) {
      let data = this.getFilteredData();

      console.log("data: " + JSON.stringify(data));

      this.updateChartData(data);
    }
  }

  private updateChartData(data) {
    let newChartHeight = 35 + (data.length * 75) + 35;

    if (newChartHeight > this.chartHeightMax) {
      newChartHeight = this.chartHeightMax;
    }

    this.chartHeight = newChartHeight;

    this.AmCharts.updateChart(this.chart, () => {
      this.chart.dataProvider = data;
      this.chart.validateData();
    });
  }

  containsAny(str, substrings) {
    for (var i = 0; i != substrings.length; i++) {
      var substring = substrings[i];
      if (str.indexOf(substring) != -1) {
        return true;
      }
    }

    return false;
  }

  getFilteredData() {
    var filteredData = [];
    var resourceSearch = null;

    if (!this.resourceFilter) {
      resourceSearch = ""
    }
    else {
      resourceSearch = this.resourceFilter;
    }

    resourceSearch = resourceSearch.toLowerCase().replace(/\s/g, '').split(',');
    for (var i = 0; i < this.dataSource.length; i++) {
      var dataPoint = this.dataSource[i];

      if (this.containsAny(dataPoint.category.toLowerCase(), resourceSearch)) {
        filteredData.push(dataPoint);
      }
    }

    return filteredData;
  }
}
