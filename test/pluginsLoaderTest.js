var assert = require("assert");
var sinon = require("sinon");
var PluginsLoader = require("../lib/pluginsLoader");

var pluginsLoader;


describe("plugins", function() {
  beforeEach(function() {
    pluginsLoader = new PluginsLoader({}, {}, {});
  });

  describe("loadPlugin", function() {
    it("calls load", function() {
      var stub = sinon.stub(pluginsLoader, "require");
      stub.returns(function() {});

      pluginsLoader.loadPlugin({name: "test"});
      sinon.assert.calledOnce(stub);
    });

    it("returns plugin api and plugin config", function() {
      var stub = sinon.stub(pluginsLoader, "require");
      var plugin = function() {
        return {coolApi: function() {}};
      };
      stub.returns(plugin);
      var pluginConfig = {name: "test"};
      var result = pluginsLoader.loadPlugin(pluginConfig);

      assert(result.config === pluginConfig);
      assert(result.api.coolApi !== undefined);
    });

    it("calls plugin with server api", function() {
      var stub = sinon.stub(pluginsLoader, "require");
      var spy = sinon.spy();
      stub.returns(spy);

      var pluginConfig = {name: "test", config: {}};
      var server = {db: {}};
      pluginsLoader.loadPlugin(pluginConfig, server);

      sinon.assert.calledWith(spy, server, pluginConfig.config);
    });
  });

  describe("load", function() {
    it("return a map of all plugins", function() {
      var config = [
        {
          "name": "lists"
        },
        {
          "name": "other"
        }
      ];

      var stub = sinon.stub(pluginsLoader, "require");
      var plugin = function() {
        return {coolApi: function() {
        }};
      };
      stub.returns(plugin);

      var loadedPlugins = pluginsLoader.load(config);
      sinon.assert.calledTwice(stub);
      assert(loadedPlugins[0].config.name === "lists");
      assert(loadedPlugins[1].config.name === "other");
    });
  });
});