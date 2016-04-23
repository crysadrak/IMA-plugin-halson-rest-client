# IMA-plugin-halson-rest-client

HAL+JSON REST API client for IMA applications.

HAL specification:

http://stateless.co/hal_specification.html or
https://tools.ietf.org/html/draft-kelly-json-hal-07 (already expired).

This plugin does not fully implement the URI template RTC
(https://tools.ietf.org/html/rfc6570), only the `{var}` and `{var1,var2}`
notations are supported.

A full support of URI templates may be added in the future using the
`uri-template` npm module.
