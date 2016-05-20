
import LinkGenerator from 'ima-plugin-rest-client/dist/LinkGenerator';
import uriTemplateParser from 'uri-template';

/**
 * The separator of query string's key-value pairs. While the W3C
 * recommendation
 * https://www.w3.org/TR/1999/REC-html401-19991224/appendix/notes.html#h-B.2.2
 * allows both ampersands {@code &} and semicolons {@code ;} to be used in
 * {@code application/x-www-form-urlencoded}-encoded query strings, some
 * servers support only the ampersands, so we'll use the ampersand to ensure
 * better compatibility with various server implementations.
 *
 * @type {string}
 */
const QUERY_PARAMETER_SEPARATOR = '&';

/**
 * Private field symbols.
 *
 * @type {Object<string, symbol>}
 */
const PRIVATE = Object.freeze({
	uriTemplates: Symbol('uriTemplates')
});

/**
 * URI generator for the HAL+JSON REST API client.
 */
export default class HalsonLinkGenerator extends LinkGenerator {
	/**
	 * Initializes the link generator.
	 */
	constructor() {
		super();

		/**
		 * Cache of parsed URI templates. The keys are the raw URI templates.
		 *
		 * @type {Map<string, {expand: function(Object<string, (number|string|(number|string)[])>): string}>}
		 */
		this[PRIVATE.uriTemplates] = new Map();

		Object.freeze(this);
	}

	/**
	 * @inheritdoc
	 * @override
	 */
	createLink(parentEntity, resource, id, parameters, serverConfiguration) {
		let linkName = resource.resourceName;
		let idParameterName = resource.idParameterName;

		let links;
		if (parentEntity) {
			links = parentEntity._links;
		} else {
			links = serverConfiguration.links;
		}

		if (!links[linkName]) {
			throw new Error('The link to the provided resource (' +
					`${resource} AKA ${linkName}) is not set. Fix the link ` +
					'provided by the server');
		}
		
		let linkTemplate = links[linkName];
		if (linkTemplate.href) {
			linkTemplate = linkTemplate.href;
		}
		let linkParameters = parameters;
		if (id !== null) {
			linkParameters = Object.assign({}, parameters, {
				[idParameterName]: id
			});
		}
		
		return this._processURITemplate(
			linkTemplate,
			linkParameters,
			serverConfiguration.apiRoot
		);
	}

	/**
	 * Processes the provided URI template by replacing the placeholders with
	 * the provided parameter values.
	 *
	 * @private
	 * @param {string} template URI template to process.
	 * @param {Object<string, (number|string|(number|string)[])>} parameters
	 *        Map of URI template's placeholder names to values.
	 * @param {string} apiRoot The URI to the REST API root.
	 * @return {string} Generated URI.
	 */
	_processURITemplate(template, parameters, apiRoot) {
		let parsedTemplate;
		if (this[PRIVATE.uriTemplates].has(template)) {
			parsedTemplate = this[PRIVATE.uriTemplates].get(template);
		} else {
			parsedTemplate = uriTemplateParser.parse(template);
			this[PRIVATE.uriTemplates].set(template, parsedTemplate);
		}

		let link = parsedTemplate.expand(parameters);
		let unusedParameters = this._getUnusedParameters(
			parsedTemplate,
			parameters
		);
		let unusedParameterNames = Object.keys(unusedParameters);
		if (unusedParameterNames.length) {
			link += (link.indexOf('?') > -1) ? QUERY_PARAMETER_SEPARATOR : '?';
			let pairs = [];
			for (let parameterName of unusedParameterNames) {
				let pair = [parameterName, unusedParameters[parameterName]];
				pairs.push(pair.map(encodeURIComponent).join('='));
			}
			link += pairs.join(QUERY_PARAMETER_SEPARATOR);
		}

		if (link.substring(0, 1) === '/') {
			link = `${apiRoot}${link}`;
		}
		
		return link;
	}
	
	_getUnusedParameters(parsedTemplate, parameters) {
		if (!parsedTemplate.expressions.length) {
			return parameters;
		}
		
		let unusedParameters = Object.assign({}, parameters);
		for (let expression of parsedTemplate.expressions) {
			for (let parameter of expression.params) {
				delete unusedParameters[parameter.name];
			}
		}
		
		return unusedParameters;
	}
}
