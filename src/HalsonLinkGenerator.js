
import LinkGenerator from 'ima-plugin-rest-client/src/LinkGenerator';

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
 * URI generator for the HAL+JSON REST API client.
 */
export default class HalsonLinkGenerator extends LinkGenerator {
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
		let linkParameters = Object.assign({}, parameters, {
			[idParameterName]: id
		});
		
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
	 * The method does not fully implement the RFC 6570 (URI Templates), only
	 * the {@code {var}} and {@code {var1,var2}} notations are supported.
	 *
	 * Any parameters that were not used to replace a URI template placeholder
	 * will be added as query parameters to the end of the generated URI.
	 *
	 * @private
	 * @param {string} template URI template to process.
	 * @param {Object<string, (number|string|(number|string)[])>} parameters
	 *        Map of URI template's placeholder names to values.
	 * @param {string} apiRoot The URI to the REST API root.
	 * @return {string} Generated URI.
	 */
	_processURITemplate(template, parameters, apiRoot) {
		let link = template;
		let unusedParameters = Object.assign({}, parameters);
		
		while (link.indexOf('{') > -1) {
			let placeholderStart = link.indexOf('{');
			let placeholderEnd = link.indexOf('}', placeholderStart);
			if (placeholderEnd === -1) {
				throw new Error(`Invalid link template: ${template}`);
			}
			
			let placeholder = link.slice(placeholderStart, placeholderEnd + 1);
			let parameterNames = placeholder.slice(1, -1).split(',');
			let values = parameterNames.map((parameterName) => {
				delete unusedParameters[parameterName];
				return parameters[parameterName];
			});
			
			link = link.replace(placeholder, values);
		}
		
		if (Object.keys(unusedParameters).length) {
			link += (link.indexOf('?') > -1 ? QUERY_PARAMETER_SEPARATOR : '?');
			link += LinkGenerator.encodeQuery(
				unusedParameters,
				QUERY_PARAMETER_SEPARATOR
			);
		}

		if (link.substring(0, 1) === '/') {
			link = `${apiRoot}${link}`;
		}
		
		return link;
	}
}