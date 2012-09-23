Crafty.c("HTMLTemplate", {
	init: function(){
		this.addComponent("2D, DOM, Color, HTML");
		this.template = null;
		this.content = "";
	},
	/**
	 * Create the template function from a given string.  The templateString will likely be pulled from script tag in the DOM.
	 * @param {string} templateString The string which will be populated by the template.
	 */
	setTemplate: function(templateString) {
		this.template = _.template(templateString);
	},
	
	/**
	 * Populate the content via the template.  Does NOT update the DOM, simply rewrites the in-memory HTML string.
	 * @param {object} model An object literal used to populate the template.
	 */
	populateTemplate: function(model) {
		this.content = this.template(model);
	},
	
	/**
	 * Update the content of the entity's html node, using the template.
	 * @param {object} model An object literal used to populate the template.
	 */
	updateContent: function(model) {
		this.populateTemplate(model);
		this.replace(this.content);
	}
});
