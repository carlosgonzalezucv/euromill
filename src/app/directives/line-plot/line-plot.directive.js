(function() {
  'use strict';

  angular
    .module('inspinia')
    .directive('linePlot', linePlot);

  linePlot.$inject = ['MainService'];
  function linePlot(MainService) {
    var directive = {
        bindToController: true, 
        controller: ['MainService', LinePlotController],
        templateUrl: "/app/directives/line-plot/line-plot.html",
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
        }
    };

    return directive;
    
    function link(scope, element, attrs) {
      scope.$watch("vm.data", _render.bind(this, scope));
      scope.$watch("vm.showMeans", _render.bind(this, scope));
      scope.$watch("vm.showLegend", _render.bind(this, scope));
      scope.$watch("vm.histogram", _render.bind(this, scope));
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
  function getData (vm, MainService) {
    if (!vm.data) {
      return [{}];
    }
    let graphs = [];
    if (!vm.histogram) {
      graphs.push({
        x: vm.data.map((e,i) => i+1),
        y: vm.data,
        mode: 'lines+markers',
        name: 'data'
      });
    } else if (vm.histogram) {
      let _histogram = MainService.getHistogram(vm.data, 50);
      graphs.push({
        y: _histogram,
        x: _histogram.map((e,i) => i),
        type: 'bar',
        orientation: 'v',
        name: 'hist',
        marker: {
          color: 'grey'
        }
      });
    }

    if (!vm.showMeans) {
      return graphs;
    }
    let evolution = MainService.computeMeanEvolution(vm.data);
    graphs.push({
      x: vm.data.map((e,i) => i+1),
      y: evolution.map(e => e.arith),
      mode: 'lines+markers',
      name: 'A'
    });
    graphs.push({
      x: vm.data.map((e,i) => i+1),
      y: evolution.map(e => e.geo),
      mode: 'lines+markers',
      name: 'G'
    });
    graphs.push({
      x: vm.data.map((e,i) => i+1),
      y: evolution.map(e => e.harmonic),
      mode: 'lines+markers',
      name: 'H'
    });
    return graphs;
  }
  
  function setScene(vm,MainService) {
    var layout = {	
        showlegend: vm.showLegend,
        margin: {
          l: 20,
          b: 20,
          r: 0,
          t: 0,
          p: 0
        }
      },    
      options = {
        scrollZoom: false,
        displayModeBar: false
      },
      graphData = getData(vm, MainService);      
    return { layout, options, graphData };
  }
  /* @ngInject */
  function LinePlotController (MainService) {
    let vm = this, containerId = 'line-plot-container-' + vm.cid;
    
    vm.histogram = false;
    vm.showMeans = false;
    vm.showLegend = false;
    vm.updateGraph = updateGraph;

    setTimeout(initPlot, 100);
    function initPlot () {
      var WIDTH_IN_PERCENT_OF_PARENT = 90,
        HEIGHT_IN_PERCENT_OF_PARENT = 90,
        d3 = Plotly.d3,
        gd3 = d3.select('#' + containerId)
        .append('div')
        .style({
          width: 1 * WIDTH_IN_PERCENT_OF_PARENT + '%',
          'margin-left': (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + '%',  
          height: (vm.vscale || .445) * HEIGHT_IN_PERCENT_OF_PARENT + 'vh',
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

    function updateGraph(_vm) {
      let { histogram, showMeans, showLegend } = _vm;
      vm.showMeans = showMeans;
      vm.showLegend = showLegend;
      vm.histogram = histogram;
    }
  }
})();