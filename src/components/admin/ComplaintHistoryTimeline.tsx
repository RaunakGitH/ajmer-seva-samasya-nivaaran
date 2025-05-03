
import { format } from "date-fns";
import { Clock } from "lucide-react";

interface ComplaintHistoryItem {
  id: string;
  created_at: string;
  previous_status: string | null;
  new_status: string;
  remarks: string | null;
  updated_by: string | null;
}

interface ComplaintHistoryTimelineProps {
  historyItems: ComplaintHistoryItem[];
}

export const ComplaintHistoryTimeline = ({ historyItems }: ComplaintHistoryTimelineProps) => {
  if (!historyItems || historyItems.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No status updates found
      </div>
    );
  }

  // Sort history items by date (newest first)
  const sortedItems = [...historyItems].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-amber-500";
      case "In Progress": return "bg-blue-500";
      case "Resolved": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {sortedItems.map((item, itemIdx) => (
          <li key={item.id}>
            <div className="relative pb-8">
              {itemIdx !== sortedItems.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={`${
                      getStatusColor(item.new_status)
                    } h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white`}
                  >
                    <Clock className="h-4 w-4 text-white" />
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500">
                      Status changed to{' '}
                      <span className="font-medium text-gray-900">
                        {item.new_status}
                      </span>
                      {item.previous_status && (
                        <> from <span className="font-medium">{item.previous_status}</span></>
                      )}
                    </p>
                  </div>
                  <div className="mt-1">
                    <p className="text-xs text-gray-500">
                      {format(new Date(item.created_at), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                  {item.remarks && (
                    <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded-md">
                      {item.remarks}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
