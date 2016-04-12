
/**
 * Decorator for settings the static {@code inlineResponseBody} flag on an
 * entity class, which modifies the results of calls to the rest client's APIs
 * and the entity's APIs to return the resolved entities instead of a response
 * object.
 * 
 * @param {function(
 *            new: AbstractHalsonEntity,
 *            restClient: HalsonRestClient,
 *            data: Object<string, *>
 *        )} classConstructor The entity class.
 */
export default (classConstructor) => {
	Object.defineProperty(classConstructor, 'inlineResponseBody', {
		value: true
	});
};
