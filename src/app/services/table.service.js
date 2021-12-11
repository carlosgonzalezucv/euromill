(function () {
  "use strict";

  angular.module("inspinia").service("TableService", TableService);

  TableService.$inject = [];
  function TableService() {
    //this.getResults = getResults;

    this.compressData = compressData;

    function compressData(data) {
      let guia = [1, 2, 3, 4, 5, 6, 7, 8, 0];
      let aux = 0;
      let preprocessData = [].concat.apply(
        [],
        data.map((e) => e.results)
      );
      let result = [];
      let block = [];

      console.log("data", data);

      while (preprocessData.length > 0) {
        let elemIndex = preprocessData.findIndex((e) => e % 9 === aux);

        block.push(preprocessData[elemIndex]);

        if(block.length === guia.length) {
          result.push({
            results: block,
            date: new Date()
          });
          block = [];
        }

        preprocessData.splice(elemIndex, 1);
        aux += 1;
        aux = aux % guia.length;
      }

      console.log(result)

      return result;


    }
  }
})();
