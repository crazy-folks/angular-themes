angular.module('authService', [])

  // ===================================================
  // auth factory to login and get information
  // inject $http for communicating with the API
  // inject $q to return promise objects
  // inject AuthToken to manage tokens
  // ===================================================
  .factory('Auth', function ($http, $q, AuthToken, User, Socket) {

    // create auth factory object
    var authFactory = {};

    // log a user in
    authFactory.login = function (username, password) {

      // return the promise object and its data
      return $http.post('/api/authenticate', {
        username: username,
        password: password
      }).then(
        function (data) {		// Success callback
          // Emit user ID to notifications API
          User.getMe().success(function (data) {
            if (data) Socket.emit('msg:user', data[0]._id);
          });
          AuthToken.setToken(data.data.token);
          return data;
        }, function (err) {		// Failure callback
          return err;
        });
    };

    // log a user out by clearing the token
    authFactory.logout = function () {
      $http.get('/api/logout').then(function (data) {
        // clear the token
        AuthToken.setToken();
        window.location.href = '/';
      });

    };

    // check if a user is logged in
    // checks if there is a local token
    authFactory.isLoggedIn = function () {
      return AuthToken.getToken();
    };

    // get the logged in user
    authFactory.getUser = function () {
      if (AuthToken.getToken())
        return $http.get('/api/me');
      else
        return $q.reject({message: 'User has no token.'});
    };

    authFactory.getFullUser = function () {
      if (AuthToken.getToken())
        return $http.get('/api/my_id');
      else
        return $q.reject({message: 'User has no token.'});
    };

    authFactory.createSampleUser = function () {
      $http.post('/api/sample');
    };

    // return auth factory object
    return authFactory;

  })

  // ===================================================
  // factory for handling tokens
  // inject $window to store token client-side
  // ===================================================
  .factory('AuthToken', function ($window) {

    var authTokenFactory = {};

    // get the token out of local storage
    authTokenFactory.getToken = function () {
      return $window.localStorage.getItem('token');
    };

    // function to set token or clear token
    // if a token is passed, set the token
    // if there is no token, clear it from local storage
    authTokenFactory.setToken = function (token) {
      if (token)
        $window.localStorage.setItem('token', token);
      else
        $window.localStorage.removeItem('token');
    };

    return authTokenFactory;

  })

  // ===================================================
  // application configuration to integrate token into requests
  // ===================================================
  .factory('AuthInterceptor', function ($q, $location, AuthToken) {

    var interceptorFactory = {};

    // this will happen on all HTTP requests
    interceptorFactory.request = function (config) {

      // grab the token
      var token = AuthToken.getToken();

      // if the token exists, add it to the header as x-access-token
      if (token)
        config.headers['x-access-token'] = token;

      return config;
    };

    // happens on response errors
    interceptorFactory.responseError = function (response) {

      // if our server returns a 403 forbidden response
      if (response.status == 403 && $location != "/newUser") {
        AuthToken.setToken();
        // console.log("This is the output of location" + $location);
        window.location.href = '/';

      } else if (response.status == 401) {
        $location.path('/401');
      } else if (response.status == 404) {
        $location.path('/404');
      } else if (response.status == 409) {
        // Don't redirect on a 409 error code - do nothing

      } else {
        $location.path('/newUser');
      }

      // return the errors from the server as a promise
      return $q.reject(response);
    };

    return interceptorFactory;

  });