interface IPODetailsTableProps {
  data: {
    id?: string;
    symbol?: string;
    issueSize?: string;
    issuePeriod?: string;
    issueType?: string;
    priceRange?: string;
    faceValue?: string;
    discount?: string;
    cutOffTime?: string;
    minInvestment?: string | null;
    lastUpdated?: string | null;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: unknown;
  };
}

const formatFieldName = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
};

export default function IPODetailsTable({ data }: IPODetailsTableProps) {
  const displayFields = [
    'symbol',
    'issueSize',
    'issuePeriod',
    'issueType',
    'priceRange',
    'faceValue',
    'discount',
    'cutOffTime',
    'minInvestment',
    'lastUpdated',
  ];

  return (
    <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
              Field
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
              Value
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {displayFields
            .filter((field) => {
              const value = data[field];
              return value !== null && value !== undefined && value !== '';
            })
            .map((field) => (
              <tr key={field} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {formatFieldName(field)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 whitespace-pre-wrap">
                  {formatValue(data[field])}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
