import {AmChartsService} from '@amcharts/amcharts3-angular';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Http, Response} from '@angular/http';
import {NgForm} from '@angular/forms'
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import {QualiUtilsService} from '../services/quali-utils.service';
import {ResourceFamily} from '../models/resource/resource-family.model';
import {ResourceModel} from '../models/resource/resource-model.model';

declare var moment: any;

@Component({
  selector: 'app-resource-reservation-gantt',
  templateUrl: './resource-reservation-gantt.component.html',
  styleUrls: ['./resource-reservation-gantt.component.css']
})
export class ResourceReservationGanttComponent implements OnDestroy, OnInit {
  @ViewChild('f') searchForm: NgForm;

  private chart: any;
  private chartDataLastUpdated: string;
  private chartHeight: number;
  private chartHeightMax = 975;
  private dataSource: any;
  private resourceFamiles: ResourceFamily[];
  private selectedResouceFamily: ResourceFamily;
  private selectedResouceModel: ResourceModel;


  constructor(private AmCharts: AmChartsService,
              private http: Http,
              private qualiUtilsService: QualiUtilsService) {
  }

  ngOnInit() {
    this.qualiUtilsService.listFamilies()
      .map((response: Response) => response.json())
      .subscribe(
        (response) => {
          this.resourceFamiles = [];
          response.forEach((family) => {
            let models: ResourceModel[] = [];

            family.models.forEach((model) => {
              models.push(new ResourceModel(model.id, model.family, model.name, model.description));
            });

            this.resourceFamiles.push(new ResourceFamily(family.id, family.name, family.description, models));
          });
          this.resourceFamiles.sort(function (a, b) {
            return a.name.localeCompare(b.name);
          });
        }
      );

    this.getData();

    this.chart = this.AmCharts.makeChart('gantt', {
      'type': 'gantt',
      'theme': 'dark',
      'marginRight': 70,
      'period': 'hh',
      'dataDateFormat': 'YYYY-MM-DD JJ:NN',
      'fontFamily': '"Helvetica Neue",Helvetica,Arial,sans-serif',
      'columnWidth': 0.5,
      'valueAxis': {
        'minimumDate': moment(),
        'type': 'date'
      },
      'graph': {
        'lineAlpha': 1,
        'lineColor': '#000',
        'fillAlphas': 0.85,
        'balloonText': '<b>[[name]] ([[id]])</b><br/>owner: [[owner]]<br/>[[start]] - [[end]]'
      },
      'rotate': true,
      'categoryField': 'category',
      'segmentsField': 'segments',
      'startDateField': 'start',
      'endDateField': 'end',
      'valueScrollbar': {
        'autoGridCount': true,
        'backgroundColor': '#EFEFEF',
        'hideResizeGrips': true,
        'selectedBackgroundColor': '#000000'

      },
      'chartCursor': {
        'cursorColor': '#55bb76',
        'valueBalloonsEnabled': false,
        'cursorAlpha': 0,
        'valueLineAlpha': 1,
        'valueLineBalloonEnabled': true,
        'valueLineEnabled': true,
        'zoomable': false,
        'valueZoomable': true
      },
      'export': {
        'enabled': true,
        'libs': {
          'path': '/static/amcharts/plugins/export/libs/'
        }
      },
      'listeners': [{
        'event': 'rollOverGraphItem',
        'method': this.rollOver
      }, {
        'event': 'rollOutGraphItem',
        'method': this.rollOut
      }]
    });

    this.updateChartData([]);
  }

  ngOnDestroy() {
    this.AmCharts.destroyChart(this.chart);
  }

  isPageLoading() {
    if (this.dataSource && this.resourceFamiles) {
      return false
    }

    return true;
  }

  getData() {
    this.http.get('/data/resource-gantt-reservations.json')
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
        }
      );
  }

  private processResponse(res: Response) {
    const json = res.json() || {};
    const lastModified = moment(res.headers.get('last-modified'));

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
    const elements = event.item.columnGraphics.node.getElementsByTagName('path');
    for (let i = 0; i < elements.length; i++) {
      elements[i].setAttribute('stroke-width', 3);
    }
  };

  rollOut = function (event: any) {
    const elements = event.item.columnGraphics.node.getElementsByTagName('path');
    for (let i = 0; i < elements.length; i++) {
      elements[i].setAttribute('stroke-width', 1);
    }
  };

  onClear() {
    this.searchForm.reset();
  }

  onResourceFamilyChange() {
    this.selectedResouceModel = undefined;
  }

  refreshData(form: NgForm) {
    const formValue = form.value;
    let resourceNameSearchArray: string[] = [];

    if (formValue.name) {
      resourceNameSearchArray = formValue.name.toLowerCase().replace(/\s/g, '').split(',');
      resourceNameSearchArray = resourceNameSearchArray.filter(function (elem, index, self) {
        return index === self.indexOf(elem) && elem !== '';
      });
    }

    const data = this.getFilteredData(resourceNameSearchArray, formValue.family, formValue.model);
    this.updateChartData(data);
  }

  private updateChartData(data) {
    if (data.length) {
      let newChartHeight = 70;
      let rowHeight = 900 / data.length;
      if (rowHeight > 75) {
        rowHeight = 75;
      } else if (rowHeight < 18) {
        rowHeight = 18;
      }
      newChartHeight += (data.length * rowHeight);

      this.chartHeight = newChartHeight;

      this.AmCharts.updateChart(this.chart, () => {
        this.chart.clearLabels();
        this.chart.valueScrollbar.enabled = true;
        this.chart.chartCursor.enabled = true;
        this.chart.dataProvider = data;
        this.chart.validateData();
      });
    } else {
      const dataPoint = {
        dummyValue: 0
      };

      dataPoint[this.chart.categoryField] = '';

      this.chartHeight = 110;

      this.AmCharts.updateChart(this.chart, () => {
        this.chart.dataProvider = [dataPoint];
        this.chart.addLabel(0, '50%', 'No Resources', 'center', 14, '#000000', 0, 1, true);
        this.chart.valueScrollbar.enabled = false;
        this.chart.chartCursor.enabled = false;
        this.chart.validateNow();
      });
    }
  }

  containsAny(str, substrings) {
    for (let i = 0; i !== substrings.length; i++) {
      const substring = substrings[i];
      if (str.indexOf(substring) !== -1) {
        return true;
      }
    }

    return false;
  }

  getFilteredData(nameSearchArray, resourceFamily, resourceModel) {
    let filteredData = [];

    for (let i = 0; i < this.dataSource.length; i++) {
      const dataPoint = this.dataSource[i];

      if (resourceFamily) {
        if (resourceModel) {
          if (dataPoint.family === resourceFamily.name && dataPoint.model === resourceModel.name) {
            filteredData.push(dataPoint);
          }
        } else {
          if (dataPoint.family === resourceFamily.name) {
            filteredData.push(dataPoint);
          }
        }

        if (nameSearchArray.length !== 0) {
          if (!this.containsAny(dataPoint.category.toLowerCase(), nameSearchArray)) {
            filteredData.pop();
          }
        }
      } else if (nameSearchArray.length !== 0) {
        if (this.containsAny(dataPoint.category.toLowerCase(), nameSearchArray)) {
          filteredData.push(dataPoint);
        }
      }
    }

    return filteredData;
  }
}
