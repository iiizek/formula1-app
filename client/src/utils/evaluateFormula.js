export function evaluateFormula(formula, api) {
	const cellRegex = /([A-Z]+)(\d+)/g;
	let result = formula.replace(cellRegex, (match, column, row) => {
		const rowNode = api.getDisplayedRowAtIndex(parseInt(row) - 1);
		return rowNode ? rowNode.data[column] || 0 : 0;
	});

	try {
		return new Function(`return ${result}`)();
	} catch (error) {
		console.error('Error evaluating formula:', error);
		return formula;
	}
}
