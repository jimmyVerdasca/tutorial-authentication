const { expect } = require('chai');

describe('String', function () {
	it('should transform name', function () {
		const name = 'paulnta'
			.replace('au', 'o')
			.replace('n', 'en');
		expect(name).to.equal('polenta');
	});

	it('will fail', function () {
		expect('1' + '1').to.equal('2');
	});
});