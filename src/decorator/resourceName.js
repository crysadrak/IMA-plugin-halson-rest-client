
/**
 * Decorator for setting the static {@code resourceName} property of an entity
 * class, which specifies the name of the REST API resource to use with the
 * provided entity class.
 *
 * @param {string} resourceName The name of the REST API resource, as
 *        identified in the REST API's resource links map.
 * @return {function(function(
 *             new: AbstractHalsonEntity,
 *             restClient: HalsonRestClient,
 *             data: Object<string, *>
 *         ))} Callback that sets the resource name on the class provided to
 *         it.
 */
export default (resourceName) => {
	return (classConstructor) => {
		Object.defineProperty(classConstructor, 'resourceName', {
			value: resourceName
		});
	}
}
