
import AbstractEntity from 'ima-plugin-rest-client/src/AbstractEntity';

/**
 * The base class for typed REST API HALSON entities. The resources in the REST
 * API will be identified by classes extending this one by the HALSON REST API
 * client.
 */
export default class AbstractHalsonEntity extends AbstractEntity {
	/**
	 * Initializes the entity using the provided data.
	 * 
	 * @param {HalsonRestClient} restClient REST API client.
	 * @param {Object<string, *>} data Entity data, which will be directly
	 *        assigned to the entity's fields.
	 * @param {?AbstractHalsonEntity=} parentEntity The entity within which the
	 *        resource containing this entity is located. Can be set to
	 *        {@code null} if this entity belongs to a top-level resource
	 *        without a parent.
	 */
	constructor(restClient, data, parentEntity = null) {
		super(restClient, data, parentEntity);
		
		if (!this._links) {
			this._links = {};
		}
		Object.defineProperty(this, '_links', {
			enumerable: false
		});
	}

	/**
	 * Returns the name of the embed within which the entities will most likely
	 * be embedded when listing the entities from their resource.
	 * 
	 * @return {string} The name of the embed within which the entities will
	 *         most likely be embedded when listing the entities from their
	 *         resource.
	 */
	static get embedName() {
		throw new Error('The embedName getter is abstract and must be ' +
				'overridden');
	}

	/**
	 * Returns the name of the ID parameter used in this entity's resource to
	 * identify individual entities.
	 * 
	 * @return {string} The name of the ID parameter used in this entity's
	 *         resource to identify individual entities.
	 */
	static get idParameterName() {
		throw new Error('The idParameterName getter is abstract and must be ' +
				'overridden');
	}

	/**
	 * Returns the names of the embedded resources that should be inlined into
	 * the entity's fields.
	 * 
	 * The embed names may contain prefixes separated by a colon ({@code :}) from
	 * the resource name. The prefixes will not be included in the names of the
	 * entity fields into which the embedded resources will be inlined.
	 * 
	 * @return {?string[]} The names of the embedded resources that should be
	 *         inlined into the entity's fields.
	 */
	static get inlineEmbeds() {
		throw null;
	}
}
