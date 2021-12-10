(function () {

  angular.module('inspinia')
    .constant('config', config);
  
  function config () {
    let env = "euromill.herokuapp.com"; //window.location.hostname;
    return {
      url: {
        "euromill.herokuapp.com": "https://ancient-river-66765.herokuapp.com",
        localhost: "http://localhost:8081"
      }[env]
    }
  }
})();