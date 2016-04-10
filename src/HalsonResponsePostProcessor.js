
import halson from 'halson';
import Response from 'ima-plugin-rest-client/src/Response';
import ResponsePostProcessor
		from 'ima-plugin-rest-client/src/ResponsePostProcessor';

/**
 * REST API response post-processor that decodes a HAL+JSON response body into
 * {@code HALSONResource} instance(s), and, if required, inlines the embedded
 * data.
 */
export default class HalsonResponsePostProcessor
		extends ResponsePostProcessor {
	/**
	 * @inheritdoc
	 * @override
	 */
	process(response) {
		let processedBody = halson(response.body);
		let resource = response.request.resource;
		
		if (resource.inlineEmbeds) {
			let embedNames = resource.inlineEmbeds;
			for (let embedName of embedNames) {
				let fieldName = embedName;
				if (fieldName.indexOf(':') > -1) {
					fieldName = fieldName.substring(
						fieldName.lastIndexOf(':') + 1
					);
				}
				if (embedName.slice(-2) === '[]') {
					processedBody[fieldName] = processedBody.getEmbeds(
						embedName
					);
				} else {
					processedBody[fieldName] = processedBody.getEmbed(
						embedName
					);
				}
			}
		}
		
		return Response(Object.assign({}, response, {
			body: halson(response.body)
		}));
	}
}
