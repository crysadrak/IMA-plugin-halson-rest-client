
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
		let processedBody;
		if (response.body instanceof Array) {
			processedBody = response.body.map(entity => halson(entity));
		} else {
			processedBody = halson(response.body);
		}
		let resource = response.request.resource;
		
		let embedNames = resource.inlineEmbeds;
		if (embedNames) {
			let entities = response.body instanceof Array ?
					response.body : [response.body];
			for (let entity of entities) {
				this._processEntityEmbeds(entity, embedNames);
			}
		}
		
		return Response(Object.assign({}, response, {
			body: processedBody
		}));
	}

	/**
	 * Inlines the specified entities embedded within the provided entity into
	 * entity's fields.
	 * 
	 * The embed names may contain prefixes separated by a colon ({@code :})
	 * from the resource name. The prefixes will not be included in the names
	 * of the entity fields into which the embedded resources will be inlined.
	 * 
	 * The entity will be modified in-place.
	 *
	 * @private
	 * @param {HALSONResource} entity The pre-processed entity data with
	 *        embedded entities that should be inlined into the entity's
	 *        fields.
	 * @param {string[]} embedNames The names of the embeds to inline into the
	 *        entity's fields.
	 */
	_processEntityEmbeds(entity, embedNames) {
		for (let embedName of embedNames) {
			let fieldName = embedName;
			if (fieldName.indexOf(':') > -1) {
				let fieldNameStartIndex = fieldName.lastIndexOf(':') + 1;
				fieldName = fieldName.substring(fieldNameStartIndex);
			}
			let embedValue;
			if (embedName.slice(-2) === '[]') {
				embedValue = entity.getEmbeds(embedName);
			} else {
				embedValue = entity.getEmbed(embedName);
			}
			entity[fieldName] = embedValue;
		}
	}
}
