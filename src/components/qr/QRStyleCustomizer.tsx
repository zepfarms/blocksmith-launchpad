import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { QRStyle } from "@/pages/dashboard/QRCodeGenerator";

interface QRStyleCustomizerProps {
  style: QRStyle;
  onChange: (style: QRStyle) => void;
}

export const QRStyleCustomizer = ({ style, onChange }: QRStyleCustomizerProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="size">Size: {style.size}px</Label>
        <Slider
          id="size"
          min={128}
          max={512}
          step={32}
          value={[style.size]}
          onValueChange={([value]) => onChange({ ...style, size: value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fgColor">Foreground Color</Label>
          <div className="flex gap-2">
            <Input
              id="fgColor"
              type="color"
              value={style.fgColor}
              onChange={(e) => onChange({ ...style, fgColor: e.target.value })}
              className="h-10 w-full cursor-pointer"
            />
            <Input
              type="text"
              value={style.fgColor}
              onChange={(e) => onChange({ ...style, fgColor: e.target.value })}
              className="h-10 w-24 font-mono text-xs"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bgColor">Background Color</Label>
          <div className="flex gap-2">
            <Input
              id="bgColor"
              type="color"
              value={style.bgColor}
              onChange={(e) => onChange({ ...style, bgColor: e.target.value })}
              className="h-10 w-full cursor-pointer"
            />
            <Input
              type="text"
              value={style.bgColor}
              onChange={(e) => onChange({ ...style, bgColor: e.target.value })}
              className="h-10 w-24 font-mono text-xs"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="level">Error Correction Level</Label>
        <Select
          value={style.level}
          onValueChange={(value: "L" | "M" | "Q" | "H") => onChange({ ...style, level: value })}
        >
          <SelectTrigger id="level">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="L">Low (7%)</SelectItem>
            <SelectItem value="M">Medium (15%)</SelectItem>
            <SelectItem value="Q">Quartile (25%)</SelectItem>
            <SelectItem value="H">High (30%)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Higher levels allow the QR code to be read even if partially damaged
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="margin">Include Margin</Label>
          <p className="text-xs text-muted-foreground">
            Add white space around the QR code
          </p>
        </div>
        <Switch
          id="margin"
          checked={style.includeMargin}
          onCheckedChange={(checked) => onChange({ ...style, includeMargin: checked })}
        />
      </div>
    </div>
  );
};

const Input = ({ className, ...props }: React.ComponentProps<"input">) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};
