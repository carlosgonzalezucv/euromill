(function() {
  'use strict';

  angular
    .module('inspinia')
    .directive('pointsCloud', pointsCloud);

  pointsCloud.$inject = ['MainService'];
  function pointsCloud(MainService) {
    var directive = {
        bindToController: true, 
        controller: ['MainService', pointsCloudController],
        templateUrl: "/app/directives/points-cloud/points-cloud.html",
        controllerAs: 'vm',
        link: link,
        restrict: 'E',
        scope: {
          data: '=',
          cid: '@',
          vscale: '@',
          title: '@',
          details: '@?',
          className: '@?',
          axes: '@',
          dates: '='
        }
    };

    return directive;
    
    function link(scope, element, attrs) {
      scope.$watch("vm.axes", _render.bind(this, scope));
      scope.$watch("vm.mixed", _render.bind(this, scope));
      // scope.$watch("vm.showMeans", _render.bind(this, scope));
      // scope.$watch("vm.showLegend", _render.bind(this, scope));
      // scope.$watch("vm.histogram", _render.bind(this, scope));
    }
    function _render(scope) {
      if (!scope.vm.cid)
        return;
      var gd2 = $("#" + scope.vm.cid)[0];
      if (gd2 && gd2.data.length && scope.vm && scope.vm.data) {
        let { layout, options, graphData } = setScene(scope.vm, MainService);
        gd2.data = graphData;
        gd2.layout = layout;
        Plotly.redraw(gd2);
      }
    }
  }
  function getData (vm) {
    if (!vm.data) {
      return [{}];
    }
    let [x,y,z] = vm.axes.split(','), today = new Date(), 
      max = Math.max.apply([], vm.dates),
      min = Math.min.apply([], vm.dates);

    function _color(e) {
      return 255;//255-Math.floor(255/(max-min)*(e-min));
    }
    function _size(e) {
      return 1/(max-min)*(e-min);
    }
    let dataToPlot = [], 
      X = vm.data.map(e => e[x]),
      Y = vm.data.map(e => e[y]),
      Z = vm.data.map(e => e[z]),
      BisecX = new Array(50).fill(0).map((e,i) => i);

    if (x && y && z )
      dataToPlot.push({
        x: X,
        y: Y,
        z: Z,
        type: 'scatter3d',
        mode: 'markers',
        name: `x-y-z`,
        marker: {
          color: vm.dates.map(e => `rgb(${_color(e)},${0},${0})`),
          opacity: 1,//vm.dates.map(_size),
          size: 2
        }
      });
    if (x && y) {
      let data1 = {
          x: X,
          y: Y,
          type: 'mesh',
          mode: 'markers',
          name: `x${++x}-x${++y}`,
          marker: {
            color: vm.dates.map(e => `rgb(${_color(e)},${0},${0})`),
            opacity: 1//vm.dates.map(_size)
          }
        },
        data2 = {
          x: BisecX,
          y: BisecX,
          type: 'scatter',
          mode: 'lines',
          name: `y=x`,
          showlegend: false,
          opacity: 1
        }
      dataToPlot.push(data1, data2);
    }

    if (x && z) {
      let data1 = {
          x: X,
          y: Z,
          type: 'mesh',
          mode: 'markers',
          name: `x${x}-x${++z}`,
          xaxis: 'x',
          yaxis: !vm.mixed ? 'y' : 'y2',
          marker: {
            color: vm.dates.map(e => `rgb(${0},${_color(e)},${0})`),
            opacity: 1//vm.dates.map(_size)
          }
        },
      data2 = {
          x: BisecX,
          y: BisecX,
          xaxis: 'x',
          yaxis: !vm.mixed ? 'y' : 'y2',
          type: 'scatter',
          mode: 'lines',
          showlegend: false,
          opacity: 1
        };
      dataToPlot.push(data1);
      if (vm.mixed)
        dataToPlot.push(data2);
    }

    if (y && z) {
      dataToPlot.push({
        x: Y,
        y: Z,
        xaxis: !vm.mixed ? 'x' : 'x3',
        yaxis: !vm.mixed ? 'y' : 'y3',
        type: 'mesh',
        mode: 'markers',
        name: `x${y}-x${z}`,
        marker: {
          color: vm.dates.map(e => `rgb(${0},${0},${_color(e)})`),
          opacity: 1 //vm.dates.map(_size)
        }
      });
      if (vm.mixed) {
        dataToPlot.push({
          x: BisecX,
          y: BisecX,
          xaxis: !vm.mixed ? 'x' : 'x3',
          yaxis: !vm.mixed ? 'y' : 'y3',
          type: 'scatter',
          mode: 'lines',
          name: `y=x`,
          showlegend: false,
          opacity: 1
        });
      }
    }

    return dataToPlot;
  }
  
  function setScene(vm) {
    let [x,y,z] = vm.axes.split(','),
      layout = {	
        showlegend: vm.showLegend || true,
        margin: {
          l: 5,
          b: 30,
          r: 0,
          t: 0,
          p: 10
        },
        xaxis: {
          title: 'x' + (++x),
          domain: !z ? [0,1] : [0.48, 1],
          zeroline: false,
          range: [0,53]
        },
        yaxis: {
          title: 'x' + (++y),
          zeroline: false,
          domain: !z ? [0,1] : !vm.mixed ? [0, 1] : [0, .3],
          range: [0,53]
        },
        yaxis2: {
          title: 'x' + (++z),          
          domain: [0.32, .62],
          anchor: 'x',
          zeroline: false,
          range: [0,53]
        },
        xaxis3: {
          domain: [0.48, 1],
          zeroline: false,
          anchor: 'y3',
          range: [0,53]
        },
        yaxis3: {
          title: 'x' + z,
          domain: [.7, 1],
          anchor: 'x3',
          range: [0,53]
        },
        scene: {
          domain: {
            x: [0,.48],
            y: [0,1]
          },
          xaxis: {
            range: [0,50]
          },
          yaxis: {
            range: [0,50]
          },
          zaxis: {
            range: [0,50]
          }
        }
      },
      options = {
        scrollZoom: false,
        displayModeBar: false
      },
      graphData = getData(vm);      
    if (!vm.mixed) {
      layout.xaxis.range = layout.yaxis.range = [0,53];
    }
    return { layout, options, graphData };
  }
  /* @ngInject */
  function pointsCloudController (MainService) {
    let vm = this, containerId = 'points-cloud-container-' + vm.cid;
    
    vm.histogram = false;
    vm.showMeans = false;
    vm.showLegend = false;
    vm.updateGraph = updateGraph;
    vm.axesMask = vm.axes.split(',').map(e => ++e).join(',');

    setTimeout(initPlot, 100);
    function initPlot () {
      var WIDTH_IN_PERCENT_OF_PARENT = 98,
        HEIGHT_IN_PERCENT_OF_PARENT = 98,
        d3 = Plotly.d3,
        gd3 = d3.select('#' + containerId)
        .append('div')
        .style({
          width: 1 * WIDTH_IN_PERCENT_OF_PARENT + '%',
          'margin-left': (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + '%',  
          height: (vm.vscale || 1) * HEIGHT_IN_PERCENT_OF_PARENT + '%',
          'margin-top': 0+ 'vh'
        }),
        gd2 = gd3.node(),
        windowHandler = window.onresize,
        { layout, options, graphData } = setScene(vm,MainService);
      
      gd2.id = vm.cid;
      Plotly.plot(gd2, graphData, layout, options);

      window.onresize = function() {
        {windowHandler && windowHandler()}
        return gd2 && !isHidden(gd2) && Plotly.Plots.resize(gd2);
      };
      function isHidden(gd) {
        var display = window.getComputedStyle(gd).display;
        return !display || display === 'none';
      }
    }

    function updateGraph(selection, mixed) {
      vm.axes = selection.join(',');
      vm.mixed = mixed;
    }
  }
})();