define('shpe-web3/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'shpe-web3/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  var App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('shpe-web3/components/bs-modal', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    actions: {
      ok: function () {
        this.$(".modal").modal("hide");
        this.sendAction("ok");
      }
    },
    show: (function () {
      this.$(".modal").modal().on("hidden.bs.modal", (function () {
        this.sendAction("close");
      }).bind(this));
    }).on("didInsertElement")
  });

});
define('shpe-web3/controllers/events-modal', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].ObjectController.extend({});

});
define('shpe-web3/initializers/app-version', ['exports', 'shpe-web3/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;

  exports['default'] = {
    name: "App Version",
    initialize: function (container, application) {
      var appName = classify(application.toString());
      Ember['default'].libraries.register(appName, config['default'].APP.version);
    }
  };

});
define('shpe-web3/initializers/export-application-global', ['exports', 'ember', 'shpe-web3/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal && !window[classifiedName]) {
      window[classifiedName] = application;
    }
  };

  exports['default'] = {
    name: "export-application-global",

    initialize: initialize
  };

});
define('shpe-web3/router', ['exports', 'ember', 'shpe-web3/config/environment'], function (exports, Ember, config) {

	'use strict';

	var Router = Ember['default'].Router.extend({
		location: config['default'].locationType
	});

	Router.map(function () {
		this.route("about");
		this.route("officers");
		this.route("resources");
		this.route("sponsors");
		this.route("events");
	});

	exports['default'] = Router;

});
define('shpe-web3/routes/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    actions: {
      showModal: function (name, model) {
        this.render(name, {
          into: "application",
          outlet: "modal",
          model: model
        });
      },
      removeModal: function () {
        this.disconnectOutlet({
          outlet: "modal",
          parentView: "application"
        });
      }
    }
  });

});
define('shpe-web3/routes/events', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({
		model: function () {
			Ember['default'].$.ajaxSetup({ cache: true });
			return Ember['default'].$.getScript("http://connect.facebook.net/en_US/sdk.js").then(function () {
				FB.init({
					appId: "1444766602469564",
					xfbml: true,
					version: "v2.1"
				});
				var group = new Ember['default'].RSVP.Promise(function (resolve) {
					FB.api("/2212755659/events", {
						access_token: "CAAUiAfAfoLwBAEFSXh0uatjd3NccK32elasKjSctQ7jEyAeiyR2O3lxZCein0wcVxWkpjME7oP0nnOLmRuCXEX1C2rknqtT1bQpn0GvKmWSbX2jJZAdqEfWa4PoqZBdrqk7yMZAYNyd1NwrFWDtMEfzmFuDiuL0DHn6s37bjkotBSMiTMPq16ZBgnCrnGHEYUVLFtFugohHXWzRTBLsWd",
						limit: "9",
						fields: new Array("cover", "description", "location", "start_time", "end_time", "name", "id")
					}, function (response) {
						if (response && !response.error) {
							var events = {
								upcoming: [],
								past: []
							};
							for (var i = 0; i < response.data.length; i++) {
								var e = response.data[i];
								if (new Date(e.start_time).getTime() >= new Date().getTime()) {
									e.href = "#" + e.id;
									events.upcoming.push(e);
								} else if (new Date(e.start_time).getTime() > new Date("9/21/2014").getTime()) {
									e.href = "#" + e.id;
									events.past.push(e);
								}
							}
							resolve(events);
						}
					});
				});
				var board = new Ember['default'].RSVP.Promise(function (resolve) {
					FB.api("/657185204349084/events", {
						access_token: "CAAUiAfAfoLwBAEFSXh0uatjd3NccK32elasKjSctQ7jEyAeiyR2O3lxZCein0wcVxWkpjME7oP0nnOLmRuCXEX1C2rknqtT1bQpn0GvKmWSbX2jJZAdqEfWa4PoqZBdrqk7yMZAYNyd1NwrFWDtMEfzmFuDiuL0DHn6s37bjkotBSMiTMPq16ZBgnCrnGHEYUVLFtFugohHXWzRTBLsWd"
					}, function (response) {
						if (response && !response.error) {
							var events = {
								upcoming: []
							};
							for (var i = 0; i < response.data.length; i++) {
								response.data[i].href = "#" + response.data[i].id;
								events.upcoming.push(response.data[i]);
							}
							resolve(events);
						}
					});
				});

				return Ember['default'].RSVP.Promise.all([group, board]).then(function (res) {
					var obj = {
						upcoming: res[0].upcoming.concat(res[1].upcoming),
						past: res[0].past
					};
					return obj;
				});
			});
		}
	});

});
define('shpe-web3/routes/officers', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({
		model: function () {
			return {
				officers: [{ name: "Wendy Vivar", position: "President", img: "assets/officers/wendy.jpg", email: "wvivar@ucsd.edu", year: "Senior", major: "Computer Science" }, { name: "Alejandro Buitimea", position: "VP External", img: "assets/officers/alejandro.jpg", email: "a1buitime@ucsd.edu", year: "Junior", major: "Computer Engineering" }, { name: "Jonathan Bravo", position: "VP Internal", img: "assets/officers/jonathan.jpg", email: "j2bravo@ucsd.edu", year: "Senior", major: "Mechanical Engineering" }, { name: "Isaac Jaime", position: "Secretary", img: "assets/officers/isaac.jpg", email: "fjaime@ucsd.edu", year: "Junior", major: "Computer Science" }, { name: "Alexes Macedo", position: "Finance Chair", img: "assets/officers/alexes.jpg", email: "a1macedo@ucsd.edu", year: "Junior", major: "Computer Engineering" }, { name: "Isabel Jauregui", position: "Outreach Chair", img: "assets/officers/isabel.jpg", email: "ijauregu@ucsd.edu", year: "Junior", major: "Aerospace Engineering" }, { name: "Anthony Millican", position: "Academic Chair", img: "assets/officers/anthony.jpg", email: "amillica@ucsd.edu", year: "Senior", major: "Aerospace Engineering" }, { name: "Ivan Torres", position: "Logan Representative", img: "assets/officers/ivan.jpg", email: "ivtorres@ucsd.edu", year: "Junior", major: "Mechanical Engineering" }, { name: "Roman Aguilera", position: "Logan Representative", img: "assets/officers/roman.jpg", email: "roaguile@ucsd.edu", year: "Junior", major: "Electrical Engineering" }, { name: "Marcos Valencia", position: "Communications Chair", img: "assets/officers/marcos.jpg", email: "mavalenc@ucsd.edu", year: "Senior", major: "Mechanical Engineering" },
				//{name: "TBD", position: "SHPE Jr. Representative", img: "assets/default.jpg"},
				{ name: "Roberto Reyes", position: "Webmaster", img: "assets/officers/roberto.jpg", email: "r9reyes@ucsd.edu", year: "Junior", major: "Computer Engineering" }]
			};
		}
	});

});
define('shpe-web3/routes/resources', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({
		model: function () {
			return {
				documents: [{ name: "SHPE Points Key", src: "assets/resources/SHPE_points_FA14_key.pdf" }, { name: "SHPE Points Sheet", src: "assets/resources/SHPE_points_FA14.pdf" }, { name: "SHPE at UCSD Bylaws", src: "assets/resources/shpe_ucsd_bylaws.pdf" }],
				links: [{ name: "SHPE Inc.", src: "http://national.shpe.org/index.php" }, { name: "SHPE Foundation", src: "http://shpefoundation.org/" }, { name: "Join Now", src: "http://shpe.org/index.php/membership-system" }]
			};
		}
	});

});
define('shpe-web3/routes/sponsors', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({
		model: function () {
			return {
				sponsors: [{ img: "assets/sponsors/jacobs.png", bg: "#666" }, { img: "assets/sponsors/idea.png", bg: "#666" }, { img: "assets/sponsors/tesc.png", bg: "#666" }, { img: "assets/sponsors/spaces.jpeg", bg: "#fff" }, { img: "assets/sponsors/spawar.gif", bg: "#666" },
				//{img: "assets/sponsors/facebook.png", bg: "#666"},
				{ img: "assets/sponsors/visa.png", bg: "#fff" }, { img: "assets/sponsors/shpe.jpg", bg: "#fff" }]
			};
		}
	});

});
define('shpe-web3/templates/about', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("<div class=\"row\">\n	<div class=\"col-md-6\">\n		<div class=\"panel panel-default\">\n			<div class=\"panel-heading\">SHPE Inc./SHPE Foundation Mission</div>\n			<div class=\"panel-body\">The Society of Hispanic Professional Engineers changes lives by empowering the Hispanic community to realize its fullest potential and to impact the world through STEM awareness, access, support and development.</div>\n		</div>\n	</div>\n	<div class=\"col-md-6\">\n		<div class=\"panel panel-default\">\n			<div class=\"panel-heading\">SHPE Inc./SHPE Foundation Vision</div>\n			<div class=\"panel-body\"> SHPE's vision is a world where Hispanics are highly valued and influenced as the leading innovators, scientists, mathematicians, and engineers.</div>\n		</div>\n	</div>\n</div>\n<div class=\"row\">\n	<div class=\"col-md-12\">\n		<div class=\"panel panel-default\">\n			<div class=\"panel-heading\">SHPE@UCSD</div>\n			<div class=\"panel-body\">SHPE at UCSD was established in 1986. The purpose was originally to create a medium in which the small population of Hispanic/Latino students studying engineering at the university could network with other Hispanic engineers in the area. It was soon apparent that networking was just one of the many benefits that SHPE would provide to students. The role of the chapter has evolved to where it currently serves as a way for students to receive tips and encouragement for academic and professional success.\n\n			SHPE @ UCSD has a history of collaborating with other organizations at UCSD. The chapter worked very closely with what used to be the MESA program at UCSD. Although the MESA program no longer exists at UCSD, the chapter is affiliated with the umbrella organization Triton Engineering Student Council (TESC). Additionally, our SHPE chapter also works with UCSD's Academic Enrichment Programs (AEP), which includes programs such as the California Alliance for Minority Participation (CAMP) and the McNair Program. Very recently SHPE has become an annual sponsor to AEP’s “Comienza con un Sueño” High School Conference, dedicated to provide college application and financial aid workshops to first generation students and their parents. In the past year we have also begun collaborating with UCSD’s NSBE chapter to provide help to San Diego homeless students in their pursuit of attending college. Our chapter is one of very few engineering student organizations at UCSD that does outreach to schools in socioeconomically disadvantaged areas of San Diego.\n\n			SHPE @ UCSD has taken a very active role in giving back to the San Diego community. In 1999, the chapter began to do outreach at an elementary school in the Barrio Logan area of San Diego. After ten years, students from UCSD still participate in Logan Elementary on a bi-monthly basis. We have established our own High School Conference, focused on encouraging underprivileged students to not only receive a college education but to also pursue a degree in the STEM fields. Through it all, SHPE UCSD has continuously provided professional and leadership development to our members such as our annual Professional Development Day consisting of workshops, resume critiques, and mock interviews done by company representatives and recruiters.</div>\n		</div>\n	</div>\n</div>\n<div class=\"row\">\n	<div class=\"col-md-12\">\n		<div class=\"panel panel-default\">\n			<div class=\"panel-heading\">Miscellaneous</div>\n			<div class=\"panel-body\">\n				GBMs are typically held Thursdays at 7pm of weeks 2,4,6,8. You can join SHPE@UCSD on Facebook <a href=\"https://www.facebook.com/groups/SHPEUCSD/\" target=\"_blank\">here</a>.\n			</div>\n		</div>\n	</div>\n</div>");
    
  });

});
define('shpe-web3/templates/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var stack1, helper, options;
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "index", options) : helperMissing.call(depth0, "link-to", "index", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    else { data.buffer.push(''); }
    }
  function program2(depth0,data) {
    
    
    data.buffer.push("Home");
    }

  function program4(depth0,data) {
    
    var stack1, helper, options;
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "about", options) : helperMissing.call(depth0, "link-to", "about", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    else { data.buffer.push(''); }
    }
  function program5(depth0,data) {
    
    
    data.buffer.push("About");
    }

  function program7(depth0,data) {
    
    var stack1, helper, options;
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "events", options) : helperMissing.call(depth0, "link-to", "events", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    else { data.buffer.push(''); }
    }
  function program8(depth0,data) {
    
    
    data.buffer.push("Events");
    }

  function program10(depth0,data) {
    
    var stack1, helper, options;
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "officers", options) : helperMissing.call(depth0, "link-to", "officers", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    else { data.buffer.push(''); }
    }
  function program11(depth0,data) {
    
    
    data.buffer.push("Officers");
    }

  function program13(depth0,data) {
    
    var stack1, helper, options;
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(14, program14, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "resources", options) : helperMissing.call(depth0, "link-to", "resources", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    else { data.buffer.push(''); }
    }
  function program14(depth0,data) {
    
    
    data.buffer.push("Resources");
    }

  function program16(depth0,data) {
    
    var stack1, helper, options;
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(17, program17, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "sponsors", options) : helperMissing.call(depth0, "link-to", "sponsors", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    else { data.buffer.push(''); }
    }
  function program17(depth0,data) {
    
    
    data.buffer.push("Sponsors");
    }

    data.buffer.push("<!-- Fixed navbar -->\n<nav class=\"navbar navbar-default navbar-fixed-top\">\n  <div class=\"container\">\n    <div class=\"navbar-header\">\n      <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#navbar\" aria-expanded=\"false\" aria-controls=\"navbar\">\n        <span class=\"sr-only\">Toggle navigation</span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n      </button>\n      <a class=\"navbar-brand\" href=\"#\">SHPE@UCSD</a>\n    </div>\n    <div id=\"navbar\" class=\"navbar-collapse collapse\">\n      <ul class=\"nav navbar-nav navbar-right\">\n      	");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'tagName': ("li"),
      'href': (false)
    },hashTypes:{'tagName': "STRING",'href': "BOOLEAN"},hashContexts:{'tagName': depth0,'href': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "index", options) : helperMissing.call(depth0, "link-to", "index", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      	");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'tagName': ("li"),
      'href': (false)
    },hashTypes:{'tagName': "STRING",'href': "BOOLEAN"},hashContexts:{'tagName': depth0,'href': depth0},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "about", options) : helperMissing.call(depth0, "link-to", "about", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      	");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'tagName': ("li"),
      'href': (false)
    },hashTypes:{'tagName': "STRING",'href': "BOOLEAN"},hashContexts:{'tagName': depth0,'href': depth0},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "events", options) : helperMissing.call(depth0, "link-to", "events", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      	");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'tagName': ("li"),
      'href': (false)
    },hashTypes:{'tagName': "STRING",'href': "BOOLEAN"},hashContexts:{'tagName': depth0,'href': depth0},inverse:self.noop,fn:self.program(10, program10, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "officers", options) : helperMissing.call(depth0, "link-to", "officers", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      	");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'tagName': ("li"),
      'href': (false)
    },hashTypes:{'tagName': "STRING",'href': "BOOLEAN"},hashContexts:{'tagName': depth0,'href': depth0},inverse:self.noop,fn:self.program(13, program13, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "resources", options) : helperMissing.call(depth0, "link-to", "resources", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      	");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'tagName': ("li"),
      'href': (false)
    },hashTypes:{'tagName': "STRING",'href': "BOOLEAN"},hashContexts:{'tagName': depth0,'href': depth0},inverse:self.noop,fn:self.program(16, program16, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "sponsors", options) : helperMissing.call(depth0, "link-to", "sponsors", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      </ul>\n    </div><!--/.nav-collapse -->\n  </div>\n</nav>\n\n<div class=\"container\">\n  ");
    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</div> <!-- /container -->\n\n");
    data.buffer.push(escapeExpression((helper = helpers.outlet || (depth0 && depth0.outlet),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "modal", options) : helperMissing.call(depth0, "outlet", "modal", options))));
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('shpe-web3/templates/components/bs-modal', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"modal fade\">\n  <div class=\"modal-dialog\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n        <h4 class=\"modal-title\">");
    stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</h4>\n      </div>\n      <div class=\"modal-body\">\n        ");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      </div>\n      <div class=\"modal-footer\">\n        <button type=\"button\" class=\"btn btn-primary\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "ok", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">OK</button>\n      </div>\n    </div>\n  </div>\n</div>");
    return buffer;
    
  });

});
define('shpe-web3/templates/events-modal', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n  <p>");
    stack1 = helpers._triageMustache.call(depth0, "location", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</p>\n  <p>");
    stack1 = helpers._triageMustache.call(depth0, "start_time", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" - ");
    stack1 = helpers._triageMustache.call(depth0, "end_time", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</p>\n  <p>");
    stack1 = helpers._triageMustache.call(depth0, "description", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</p>\n");
    return buffer;
    }

    stack1 = (helper = helpers['bs-modal'] || (depth0 && depth0['bs-modal']),options={hash:{
      'title': ("name"),
      'ok': ("save"),
      'close': ("removeModal")
    },hashTypes:{'title': "ID",'ok': "STRING",'close': "STRING"},hashContexts:{'title': depth0,'ok': depth0,'close': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "bs-modal", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    else { data.buffer.push(''); }
    
  });

});
define('shpe-web3/templates/events', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    <div class=\"col-sm-6 col-md-4\">\n      <div class=\"thumbnail\">\n        <div class=\"thumb-container ev\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "showModal", "events-modal", "", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0,depth0],types:["STRING","STRING","ID"],data:data})));
    data.buffer.push(">\n          <div class=\"thumb-dummy\"></div>\n          <div class=\"thumb-overlay\">\n            <div class=\"thumb-content\">\n              <h3>");
    stack1 = helpers._triageMustache.call(depth0, "name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</h3>\n              <p>");
    stack1 = helpers._triageMustache.call(depth0, "start_time", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</p>\n              <p>");
    stack1 = helpers._triageMustache.call(depth0, "location", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</p>\n            </div>\n          </div>\n          <div class=\"thumb-bg\" style=\"background: url(");
    data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "cover.source", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push(") no-repeat center center;\">\n          </div>\n        </div>\n      </div>\n    </div>\n  ");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    <div class=\"col-sm-6 col-md-4\">\n      <div class=\"thumbnail\">\n        <div class=\"thumb-container ev\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "showModal", "events-modal", "", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0,depth0],types:["STRING","STRING","ID"],data:data})));
    data.buffer.push(">\n          <div class=\"thumb-dummy\"></div>\n          <div class=\"thumb-overlay\">\n            <div class=\"thumb-content\">\n              <h3>");
    stack1 = helpers._triageMustache.call(depth0, "name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</h3>\n              <p>");
    stack1 = helpers._triageMustache.call(depth0, "start_time", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</p>\n              <p>");
    stack1 = helpers._triageMustache.call(depth0, "location", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</p>\n            </div>\n          </div>\n          <div class=\"thumb-bg past\" style=\"background: url(");
    data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "cover.source", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push(") no-repeat center center;\">\n          </div>\n        </div>\n      </div>\n    </div>\n  ");
    return buffer;
    }

    data.buffer.push("<div class=\"row\" style=\"text-align:center\">\n  ");
    stack1 = helpers.each.call(depth0, "upcoming", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  ");
    stack1 = helpers.each.call(depth0, "past", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</div>");
    return buffer;
    
  });

});
define('shpe-web3/templates/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("  <!-- Main component for a primary marketing message or call to action -->\n  <div class=\"jumbotron\">\n  	<img src=\"assets/shpe_logo.png\">\n  </div>");
    
  });

});
define('shpe-web3/templates/officers', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    <div class=\"col-sm-6 col-md-4\">\n      <div class=\"thumbnail\">\n        <div class=\"thumb-container\">\n          <div class=\"thumb-dummy-off\"></div>\n          <div class=\"thumb-overlay-off\">\n            <div class=\"thumb-content-off\">\n              <h3>");
    stack1 = helpers._triageMustache.call(depth0, "name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</h3>\n              <p>");
    stack1 = helpers._triageMustache.call(depth0, "position", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</p>\n              <p>");
    stack1 = helpers._triageMustache.call(depth0, "major", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</p>\n              <p>");
    stack1 = helpers._triageMustache.call(depth0, "year", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</p>\n              <p>");
    stack1 = helpers._triageMustache.call(depth0, "email", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</p>\n            </div>\n          </div>\n          <div class=\"thumb-bg-off\" style=\"background: url(");
    data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "img", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push(") no-repeat;\">\n          </div>\n        </div>\n      </div>\n    </div>\n  ");
    return buffer;
    }

    data.buffer.push("<div class=\"row\">\n  ");
    stack1 = helpers.each.call(depth0, "officers", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</div>");
    return buffer;
    
  });

});
define('shpe-web3/templates/resources', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n					<li><a target=\"_blank\" ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'href': ("src")
    },hashTypes:{'href': "ID"},hashContexts:{'href': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">");
    stack1 = helpers._triageMustache.call(depth0, "name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</a></li>\n				");
    return buffer;
    }

    data.buffer.push("<div class=\"row\">\n	<div class=\"col-md-12\">\n		<div class=\"panel panel-default\">\n			<div class=\"panel-heading\">Documents</div>\n			<div class=\"panel-body\">\n				<ul>\n				");
    stack1 = helpers.each.call(depth0, "documents", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n				</ul>\n			</div>\n		</div>\n	</div>\n</div>\n<div class=\"row\">\n	<div class=\"col-md-12\">\n		<div class=\"panel panel-default\">\n			<div class=\"panel-heading\">Links</div>\n			<div class=\"panel-body\">\n				<ul>\n				");
    stack1 = helpers.each.call(depth0, "links", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n				</ul>\n			</div>\n		</div>\n	</div>\n</div>");
    return buffer;
    
  });

});
define('shpe-web3/templates/sponsors', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '';
    data.buffer.push("\n    <div class=\"col-sm-6 col-md-4\">\n      <div class=\"thumbnail\">\n        <div class=\"thumb-container\">\n          <div class=\"thumb-dummy\"></div>\n\n          <div class=\"thumb-bg-sp\" style=\"background: ");
    data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "bg", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push(" url(");
    data.buffer.push(escapeExpression(helpers.unbound.call(depth0, "img", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push(") no-repeat center center;\">\n          </div>\n        </div>\n      </div>\n    </div>\n  ");
    return buffer;
    }

    data.buffer.push("\n<div class=\"row\">\n  ");
    stack1 = helpers.each.call(depth0, "sponsors", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</div>\n");
    return buffer;
    
  });

});
define('shpe-web3/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('shpe-web3/tests/components/bs-modal.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/bs-modal.js should pass jshint', function() { 
    ok(true, 'components/bs-modal.js should pass jshint.'); 
  });

});
define('shpe-web3/tests/controllers/events-modal.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/events-modal.js should pass jshint', function() { 
    ok(true, 'controllers/events-modal.js should pass jshint.'); 
  });

});
define('shpe-web3/tests/helpers/resolver', ['exports', 'ember/resolver', 'shpe-web3/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('shpe-web3/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('shpe-web3/tests/helpers/start-app', ['exports', 'ember', 'shpe-web3/app', 'shpe-web3/router', 'shpe-web3/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('shpe-web3/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('shpe-web3/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(true, 'router.js should pass jshint.'); 
  });

});
define('shpe-web3/tests/routes/application.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/application.js should pass jshint', function() { 
    ok(true, 'routes/application.js should pass jshint.'); 
  });

});
define('shpe-web3/tests/routes/events.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/events.js should pass jshint', function() { 
    ok(false, 'routes/events.js should pass jshint.\nroutes/events.js: line 7, col 13, \'FB\' is not defined.\nroutes/events.js: line 13, col 17, \'FB\' is not defined.\nroutes/events.js: line 43, col 17, \'FB\' is not defined.\n\n3 errors'); 
  });

});
define('shpe-web3/tests/routes/officers.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/officers.js should pass jshint', function() { 
    ok(true, 'routes/officers.js should pass jshint.'); 
  });

});
define('shpe-web3/tests/routes/resources.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/resources.js should pass jshint', function() { 
    ok(true, 'routes/resources.js should pass jshint.'); 
  });

});
define('shpe-web3/tests/routes/sponsors.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/sponsors.js should pass jshint', function() { 
    ok(true, 'routes/sponsors.js should pass jshint.'); 
  });

});
define('shpe-web3/tests/test-helper', ['shpe-web3/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('shpe-web3/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
/* jshint ignore:start */

define('shpe-web3/config/environment', ['ember'], function(Ember) {
  var prefix = 'shpe-web3';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("shpe-web3/tests/test-helper");
} else {
  require("shpe-web3/app")["default"].create({"name":"shpe-web3","version":"0.0.0.7ec1a061"});
}

/* jshint ignore:end */
//# sourceMappingURL=shpe-web3.map