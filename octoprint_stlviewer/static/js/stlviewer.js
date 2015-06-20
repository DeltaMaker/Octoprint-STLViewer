$(function() {
    function stlviewerViewModel(parameters) {
        var self = this;

        self.loginState = parameters[0];
        self.settings = parameters[1];
		self.files = parameters[2].listHelper;
		
		self.FileList = ko.observable();
		self.RenderModes = ko.observableArray(['render as points','render as wireframe','render as flat','render as smooth']);
		
		self.setRenderMode = function() {
			var modes = document.getElementById('render_mode_list');
			switch(modes.selectedIndex) {
			case 0:
				viewer.setRenderMode('point');
				break;
			case 1:
				viewer.setRenderMode('wireframe');
				break;
			case 2:
				viewer.setRenderMode('flat');
				break;
			case 3:
				viewer.setRenderMode('smooth');
				break;
			default:
				viewer.setRenderMode('flat');
				break;
			}
			viewer.update();
		}	

		self.loadModel = function() {
			var models = $('#stlviewer_file_list');
			viewer.replaceSceneFromUrl('/downloads/files/local/' + models[models.selectedIndex].value);
			viewer.update();
		}		

        // This will get called before the stlviewerViewModel gets bound to the DOM, but after its depedencies have
        // already been initialized. It is especially guaranteed that this method gets called _after_ the settings
        // have been retrieved from the OctoPrint backend and thus the SettingsViewModel been properly populated.
        self.onBeforeBinding = function() {
			self.FileList(self.files.items());
			//console.log(self.files.items());
			var canvas = document.getElementById('cv');
			var viewer = new JSC3D.Viewer(canvas);
			var logoTimerID = 0;
			viewer.setParameter('SceneUrl', '/downloads/files/local/dragon.stl');
			viewer.setParameter('InitRotationX', 20);
			viewer.setParameter('InitRotationY', 20);
			viewer.setParameter('InitRotationZ', 0);
			viewer.setParameter('ModelColor', '#CAA618');
			viewer.setParameter('BackgroundColor1', '#000000');
			viewer.setParameter('BackgroundColor2', '#6A6AD4');
			viewer.setParameter('RenderMode', 'smooth');
			viewer.setParameter('ProgressBar', 'on');
			viewer.init();
			viewer.update();
        }
    }

    // This is how our plugin registers itself with the application, by adding some configuration information to
    // the global variable ADDITIONAL_VIEWMODELS
    ADDITIONAL_VIEWMODELS.push([
        // This is the constructor to call for instantiating the plugin
        stlviewerViewModel,

        // This is a list of dependencies to inject into the plugin, the order which you request here is the order
        // in which the dependencies will be injected into your view model upon instantiation via the parameters
        // argument
        ["loginStateViewModel", "settingsViewModel", "gcodeFilesViewModel"],

        // Finally, this is the list of all elements we want this view model to be bound to.
        [("#tab_plugin_stlviewer")]
    ]);
});
