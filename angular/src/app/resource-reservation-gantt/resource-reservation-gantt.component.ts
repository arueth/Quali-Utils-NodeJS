import {AmChartsService} from "@amcharts/amcharts3-angular";
import {Component} from '@angular/core';
import {Http, Response} from '@angular/http';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

declare var moment: any;

@Component({
  selector: 'app-resource-reservation-gantt',
  templateUrl: './resource-reservation-gantt.component.html',
  styleUrls: ['./resource-reservation-gantt.component.css']
})
export class ResourceReservationGanttComponent {
  private dataLoaded = false;
  private chart: any;
  private chartDataLastUpdated: any;
  private chartHeight: number;
  private chartHeightMax = 975;
  private currentResourceSearch = '';
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
        "minimumDate": moment(),
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
      .map(this.processResponse)
      .catch(this.handleError)
      .subscribe(
        (response) => {
          this.dataSource = response.data;

          this.dataSource.forEach(function (resource) {
            resource.segments.forEach(function (segment) {
              segment.end = moment(segment.end).format('YYYY-MM-DD HH:mm');
              segment.start = moment(segment.start).format('YYYY-MM-DD HH:mm');
            });
          });

          this.chartDataLastUpdated = response.lastModified;
          this.updateChartData(response.data);
        }
      );
  }

  private processResponse(res: Response) {
    let json = res.json() || {};
    let lastModified = moment(res.headers.get('last-modified'));

    return {
      data: json,
      lastModified: lastModified
    }
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
    var resourceSearchArray = this.resourceFilter.toLowerCase().replace(/\s/g, '').split(',');
    resourceSearchArray = resourceSearchArray.filter(function (elem, index, self) {
      return index == self.indexOf(elem) && elem != '';
    });

    var newResourceSearch = resourceSearchArray.join(',');
    if (this.dataSource && this.currentResourceSearch != newResourceSearch) {
      this.currentResourceSearch = newResourceSearch;
      this.dataLoaded = false;

      let data = this.getFilteredData();
      this.updateChartData(data);
    }

    this.resourceFilter = newResourceSearch;
  }

  private updateChartData(data) {
    let newChartHeight = 70;

    let rowHeight = 900 / data.length;
    if (rowHeight > 75) {
      rowHeight = 75;
    }
    else if (rowHeight < 18) {
      rowHeight = 18;
    }
    newChartHeight += (data.length * rowHeight);

    this.chartHeight = newChartHeight;

    this.AmCharts.updateChart(this.chart, () => {
      this.chart.dataProvider = data;
      this.chart.validateData();
    });

    this.dataLoaded = true;
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

    if (!this.resourceFilter) {
      return this.dataSource
    }

    for (var i = 0; i < this.dataSource.length; i++) {
      var dataPoint = this.dataSource[i];

      if (this.containsAny(dataPoint.category.toLowerCase(), this.resourceFilter.split(','))) {
        filteredData.push(dataPoint);
      }
    }

    return filteredData;
  }
}
