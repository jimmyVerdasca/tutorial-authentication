const { expect } = require('chai');

describe('String', function () {
	it('should replace some characters', function () {
		const name = 'paulnta'
			.replace('au', 'o')
			.replace('n', 'en');
		expect(name).to.equal('polenta');
	});

	it('will fail', function () {
		expect('1' + '1').to.equal('2');
		// AssertionError [ERR_ASSERTION]: '11' == '2'
	});
});