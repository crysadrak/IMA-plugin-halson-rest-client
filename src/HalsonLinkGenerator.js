
import LinkGenerator from 'ima-plugin-rest-client/src/LinkGenerator';

const QUERY_PARAMETER_SEPARATOR = '&'; // the RFC allows & and ;

export default class HalsonLinkGenerator extends LinkGenerator {
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
		
		return this._processLinkTemplate(linkTemplate, linkParameters);
	}
	
	_processLinkTemplate(template, parameters) {
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
			link += LinkGenerator.encodeQuery(unusedParameters);
		}
		
		return link;
	}
}