import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ALL_COLUMNS, getDefaultColumns } from "./column-config";

interface ColumnCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  visibleColumns: string[];
  onColumnsChange: (columns: string[]) => void;
}

const ColumnCustomizerModal = ({
  isOpen,
  onClose,
  visibleColumns,
  onColumnsChange,
}: ColumnCustomizerModalProps) => {
  const visibleSet = new Set(visibleColumns);

  const handleToggle = (columnId: string, checked: boolean) => {
    if (checked) {
      onColumnsChange([...visibleColumns, columnId]);
    } else {
      onColumnsChange(visibleColumns.filter((id) => id !== columnId));
    }
  };

  const handleResetDefaults = () => {
    onColumnsChange(getDefaultColumns());
  };

  return (
    <Modal title="Customize Columns" closeModal={onClose} isOpen={isOpen}>
      <div className="p-4 space-y-4">
        <div className="space-y-3">
          {ALL_COLUMNS.map((col) => (
            <div
              key={col.id}
              className="flex items-center justify-between py-1"
            >
              <label
                htmlFor={`col-toggle-${col.id}`}
                className="text-sm text-gray-700 cursor-pointer"
              >
                {col.label}
              </label>
              <Switch
                id={`col-toggle-${col.id}`}
                checked={visibleSet.has(col.id)}
                onCheckedChange={(checked) => handleToggle(col.id, checked)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2 border-t">
          <Button variant="outline" size="sm" onClick={handleResetDefaults}>
            Default
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ColumnCustomizerModal;
