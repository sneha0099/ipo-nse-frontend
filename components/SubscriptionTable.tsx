interface SubscriptionRecord {
  id: string;
  symbol: string;
  category: string;
  offered: string;
  applied: string;
  demand: string | null;
  times: string;
  serialNumber: string;
  createdAt: string;

  [key: string]: unknown;
}

interface SubscriptionTableProps {
  data: SubscriptionRecord[];
}

const formatNumber = (value: string | null): string => {
  if (!value) return '--';
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  return num.toLocaleString('en-IN');
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
};

const isMainCategory = (serialNumber: string): boolean => {
  return /^[1-5-]$/.test(serialNumber.trim());
};

const getIndentLevel = (serialNumber: string): number => {
  const serial = serialNumber.trim();
  if (/^[1-5-]$/.test(serial)) return 0; // Main categories (1, 2, 3, etc.)
  if (/^\d+\.\d+$/.test(serial)) return 1; // Level 2 (2.1, 2.2)
  if (/^\d+\([a-z]\)$/.test(serial)) return 1; // Level 2 (1(a), 3(a))
  if (/^\d+\.\d+\([a-z]\)$/.test(serial)) return 2; // Level 3 (2.1(a), 2.2(a))
  return 1; // Default
};

const isBold = (serialNumber: string): boolean => {
  const serial = serialNumber.trim();
  return /^[1-5-]$/.test(serial) || /^\d+\.\d+$/.test(serial);
};

const sortBySerialNumber = (data: SubscriptionRecord[]): SubscriptionRecord[] => {
  return [...data].sort((a, b) => {
    const serialA = (a.serialNumber || '').trim();
    const serialB = (b.serialNumber || '').trim();

    if (serialA === '-') return 1;
    if (serialB === '-') return -1;

    if (!serialA) return 1;
    if (!serialB) return -1;

    return serialA.localeCompare(serialB, undefined, { numeric: true, sensitivity: 'base' });
  });
};

export default function SubscriptionTable({ data }: SubscriptionTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No subscription data available
      </div>
    );
  }

  const sortedData = sortBySerialNumber(data);

  return (
    <div className="overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 border-b whitespace-nowrap w-20">
              NO.
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b whitespace-nowrap">
              Category
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b whitespace-nowrap">
              Offered
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b whitespace-nowrap">
              Applied
            </th>
            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b whitespace-nowrap">
              Times
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedData.map((record) => {
            const isMain = isMainCategory(record.serialNumber);
            const shouldBeBold = isBold(record.serialNumber);
            const indentLevel = getIndentLevel(record.serialNumber);
            const indentClass = indentLevel === 2 ? 'pl-12' : indentLevel === 1 ? 'pl-8' : 'pl-4';
            
            return (
              <tr 
                key={record.id} 
                className={`hover:bg-gray-50 transition-colors ${isMain ? 'bg-gray-50' : ''}`}
              >
                <td className={`px-3 py-3 text-sm ${shouldBeBold ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                  {record.serialNumber}
                </td>
                <td className={`py-3 text-sm ${shouldBeBold ? 'font-bold text-gray-900' : 'font-medium text-gray-700'} ${indentClass}`}>
                  {record.category}
                </td>
                <td className={`px-4 py-3 text-sm text-right ${shouldBeBold ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                  {formatNumber(record.offered)}
                </td>
                <td className={`px-4 py-3 text-sm text-right ${shouldBeBold ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                  {formatNumber(record.applied)}
                </td>
                <td className={`px-4 py-3 text-sm text-right font-semibold ${shouldBeBold ? 'text-gray-900' : 'text-gray-700'}`}>
                  {(() => {
                    const timesValue = parseFloat(record.times);
                    return timesValue === 0 || !timesValue ? '--' : `${record.times}x`;
                  })()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
