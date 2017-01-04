import { lodash as _, angular, uaparser } from "../../../vendor";

export default /*@ngInject*/ function (config, StatisticsService, NgMap) {
  this.tab = "current";

  this.config = angular.copy(config);
  StatisticsService.config = config;

  // for past stats
  const now = new Date();
  this.endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  this.startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  this.startDate.setMonth(this.endDate.getMonth() - 1);
  this.calculatedData = [];

  NgMap.getMap().then((map) => {
    this.map = map;
    this.map.data.loadGeoJson(`${config.hostname}/api/*/${config.apikey}/listenersmap`);
  });

  this.primaryStream = _.find(config.streams, {
    primary: true,
  }).stream;

  this.listeners = {};

  this.setTab = (tab) => {
    this.tab = tab;
  };

  this.updateStats = () => {
    this.config.streams.forEach((entry) => {
      entry.failedLoading = false;
      entry.loadingStats = true;
      StatisticsService.getListeners(entry.stream)
        .then(listeners => {
          entry.loadingStats = false;
          this.listeners[entry.stream] = listeners;
        }, () => {
          entry.failedLoading = true;
          entry.loadingStats = false;
        });
    });

    if (this.map) {
      this.map.data.loadGeoJson(`${config.hostname}/api/*/${config.apikey}/listenersmap`);
    }
  };
  this.updateStats();

  this.lookUpStatistics = () => {
    let resolution = "day";
    if (this.endDate - this.startDate < (7.78 * Math.pow(10, 9))) { // 90 days
      resolution = "hour";
    }
    if (this.endDate - this.startDate < (1.73 * Math.pow(10, 8))) { // 48 hours
      resolution = "minute";
    }
    StatisticsService.getCalculatedInfo(resolution, this.startDate.toJSON(), this.endDate.toJSON()).then((data) => {
      this.calculatedData = data;
      this.createListenerChart();
      this.generateGeoSpreadChart();
      this.generateClientSpreadChart();
      this.generateReturningChart();
      this.generateTLH();
    });
  };
  this.lookUpStatistics();

  this.createListenerChart = () => {
    this.linechartSeries = ["Listeners"];
    this.linechartLabels = [];
    this.linechartData = [ [ ] ];
    for (let data of this.calculatedData) {
      this.linechartLabels.push(new Date(data.dateAdded).toLocaleString());
      this.linechartData[0].push(data.totalSessions);
    }
    this.linechartOptions = {
      scales: {
        yAxes: [
          {
            id: "y-axis-1",
            type: "linear",
            display: true,
            position: "left",
          },
        ],
      },
    };
  };

  this.generateGeoSpreadChart = () => {
    this.geoSpreadLabels = [];
    this.geoSpreadData = [];
    this.geoSpreadOptions = {
      legend: {
        display: true,
        position: "right",
      },
      animation: {
        animateScale: true,
      },
    };

    const countrySpread = {}; // {country: upCountedSpread}
    let count = 0;

    for (let data of this.calculatedData) {
      if (data.geoSpread.length > 0) {
        count++;
        for (let spread of data.geoSpread) {
          if (!countrySpread[spread.country]) {
            countrySpread[spread.country] = 0;
          }
          countrySpread[spread.country] += spread.percentage;
        }
      }
    }
    let otherCount = 0;
    for (let country in countrySpread) {
      if (countrySpread.hasOwnProperty(country)) {
        const amount = Math.round(countrySpread[country] / count * 100) / 100;
        if (amount < 2.5) {
          otherCount += amount;
        } else {
          this.geoSpreadLabels.push(country);
          this.geoSpreadData.push(amount);
        }
      }
    }
    if (otherCount !== 0) {
      this.geoSpreadLabels.push("Other");
      this.geoSpreadData.push(otherCount);
    }
  };

  this.generateClientSpreadChart = () => {
    this.clientSpreadLabels = [];
    this.clientSpreadData = [];
    this.clientSpreadOptions = {
      legend: {
        display: true,
        position: "right",
      },
      animation: {
        animateScale: true,
      },
    };

    const clientSpread = {}; // {client: upCountedSpread}
    let count = 0;

    for (let data of this.calculatedData) {
      if (data.clientSpread.length > 0) {
        count++;
        for (let spread of data.clientSpread) {
          const agentInfo = uaparser(spread.client);
          let agent = agentInfo.ua;
          if (agentInfo.browser.name) {
            agent = `${agentInfo.browser.name} ${agentInfo.browser.major}`;
            if (agentInfo.os.name) {
              agent += ` on ${agentInfo.os.name}`;
            }
          }
          if (!clientSpread[agent]) {
            clientSpread[agent] = 0;
          }
          clientSpread[agent] += spread.percentage;
        }
      }
    }
    let otherCount = 0;
    for (let client in clientSpread) {
      if (clientSpread.hasOwnProperty(client)) {
        const amount = Math.round(clientSpread[client] / count * 100) / 100;
        if (amount < 2.5) {
          otherCount += amount;
        } else {
          this.clientSpreadLabels.push(client);
          this.clientSpreadData.push(amount);
        }
      }
    }

    if (otherCount > 0) {
      this.clientSpreadLabels.push("Other");
      this.clientSpreadData.push(Math.round(otherCount * 100) / 100);
    }
  };

  this.generateReturningChart = () => {
    this.returningLabels = [];
    this.returningData = [];
    this.returningOptions = {
      legend: {
        display: true,
        position: "right",
      },
      animation: {
        animateScale: true,
      },
    };

    let totalSessions = 0;
    let totalReturning = 0;
    for (let data of this.calculatedData) {
      totalSessions += data.totalSessions;
      totalReturning += data.returningListeners;
    }

    this.returningLabels.push("New listeners");
    this.returningData.push(totalSessions - totalReturning);
    this.returningLabels.push("Returning listeners");
    this.returningData.push(totalReturning);

  };

  this.generateTLH = () => {
    let tlh = 0;
    for (let data of this.calculatedData) {
      tlh += data.tlh;
    }
    this.totalListeningHours = Math.round(tlh * 100) / 100;
  };

}
