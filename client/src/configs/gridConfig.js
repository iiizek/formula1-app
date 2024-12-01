import { AG_GRID_LOCALE_RU } from './locale.ru';

function genCharArray(charA, charZ) {
	var a = [],
		i = charA.charCodeAt(0),
		j = charZ.charCodeAt(0);
	for (; i <= j; ++i) {
		a.push(String.fromCharCode(i));
	}
	return a;
}

export const columns = [
	{
		headerName: '',
		field: 'rowNum',
		width: 64,
		pinned: 'left',
		lockPosition: true,
		suppressMovable: true,
		cellClass: 'row-number-cell',
		valueGetter: (params) => params.node.rowIndex + 1,
		editable: false,
		suppressMenu: true,
		suppressNavigable: true,
	},
	...genCharArray('A', 'Z').map((col) => ({
		headerName: col,
		field: col,
		editable: true,
		width: 100,
		valueParser: (params) => {
			if (params.newValue && params.newValue.toString().startsWith('=')) {
				try {
					return eval(params.newValue.substring(1));
				} catch {
					return params.newValue;
				}
			}
			return params.newValue;
		},
	})),
];

export const initialRows = Array.from({ length: 101 }, (_, index) => {
	const row = { id: index + 1 };
	columns.forEach((col) => {
		row[col.field] = '';
	});
	return row;
});

export const gridOptions = {
	defaultColDef: {
		resizable: true,
	},
	rowSelection: 'multiple',
	enableRangeSelection: true,
	copyHeadersToClipboard: false,
	enableCellChangeFlash: true,
	localeText: AG_GRID_LOCALE_RU,
};
