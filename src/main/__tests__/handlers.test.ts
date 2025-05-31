import { handlerFunction } from '../handlers';

describe('Handler Functions', () => {
	test('should return expected output for input A', () => {
		const result = handlerFunction('input A');
		expect(result).toBe('expected output A');
	});

	test('should return expected output for input B', () => {
		const result = handlerFunction('input B');
		expect(result).toBe('expected output B');
	});
});