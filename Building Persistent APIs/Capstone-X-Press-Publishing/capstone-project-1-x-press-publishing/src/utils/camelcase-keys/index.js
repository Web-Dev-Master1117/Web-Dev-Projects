'use strict';
const mapObj = require('map-obj');
const camelCase = require('camelcase');

const has = (arr, key) => arr.some(x => typeof x === 'string' ? x === key : x.test(key));

module.exports = (input, opts) => {
	opts = Object.assign({
		deep: false
	}, opts);

	const exclude = opts.exclude;

	return mapObj(input, (key, val) => {
		if (!(exclude && has(exclude, key))) {
			const ret = camelCase(key);
			key = ret;
		}

		return [key, val];
	}, {deep: opts.deep});
};
