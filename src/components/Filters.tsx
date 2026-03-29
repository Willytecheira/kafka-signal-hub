import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  symbolFilter: string;
  actionFilter: string;
  onSymbolChange: (v: string) => void;
  onActionChange: (v: string) => void;
}

export function Filters({ symbolFilter, actionFilter, onSymbolChange, onActionChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        placeholder="Filtrar symbol..."
        value={symbolFilter}
        onChange={(e) => onSymbolChange(e.target.value)}
        className="h-9 w-48 border-border/50 bg-secondary text-sm placeholder:text-muted-foreground"
      />
      <Select value={actionFilter} onValueChange={onActionChange}>
        <SelectTrigger className="h-9 w-36 border-border/50 bg-secondary text-sm">
          <SelectValue placeholder="Action" />
        </SelectTrigger>
        <SelectContent className="border-border/50 bg-popover">
          <SelectItem value="all">Todas</SelectItem>
          <SelectItem value="BUY">BUY</SelectItem>
          <SelectItem value="SELL">SELL</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
