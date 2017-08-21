'use strict';

describe('Service: factory', function () {

  // load the service's module
  beforeEach(module('materialShopApp'));

  // instantiate service
  var factory;
  beforeEach(inject(function (_factory_) {
    factory = _factory_;
  }));

  it('should do something', function () {
    expect(!!factory).toBe(true);
  });

});
