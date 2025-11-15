import { SignatureStyle } from "@/pages/dashboard/EmailSignatureGenerator";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface StyleCustomizerProps {
  style: SignatureStyle;
  onChange: (style: SignatureStyle) => void;
}

export const StyleCustomizer = ({ style, onChange }: StyleCustomizerProps) => {
  const handleChange = (field: keyof SignatureStyle, value: any) => {
    onChange({ ...style, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fontSize">Font Size</Label>
        <Select value={style.fontSize} onValueChange={(value) => handleChange('fontSize', value)}>
          <SelectTrigger id="fontSize">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fontFamily">Font Family</Label>
        <Select value={style.fontFamily} onValueChange={(value) => handleChange('fontFamily', value)}>
          <SelectTrigger id="fontFamily">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Helvetica">Helvetica</SelectItem>
            <SelectItem value="Georgia">Georgia</SelectItem>
            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            <SelectItem value="Verdana">Verdana</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="primaryColor">Primary Color (Name/Headings)</Label>
        <div className="flex gap-2">
          <input
            id="primaryColor"
            type="color"
            value={style.primaryColor}
            onChange={(e) => handleChange('primaryColor', e.target.value)}
            className="h-10 w-20 rounded border cursor-pointer"
          />
          <span className="text-sm text-muted-foreground self-center">{style.primaryColor}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="secondaryColor">Secondary Color (Details)</Label>
        <div className="flex gap-2">
          <input
            id="secondaryColor"
            type="color"
            value={style.secondaryColor}
            onChange={(e) => handleChange('secondaryColor', e.target.value)}
            className="h-10 w-20 rounded border cursor-pointer"
          />
          <span className="text-sm text-muted-foreground self-center">{style.secondaryColor}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="iconStyle">Social Icon Style</Label>
        <Select value={style.iconStyle} onValueChange={(value) => handleChange('iconStyle', value)}>
          <SelectTrigger id="iconStyle">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="color">Color</SelectItem>
            <SelectItem value="grayscale">Grayscale</SelectItem>
            <SelectItem value="outlined">Outlined</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="includePhoto">Include Photo</Label>
          <Switch
            id="includePhoto"
            checked={style.includePhoto}
            onCheckedChange={(checked) => handleChange('includePhoto', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="includeLogo">Include Logo</Label>
          <Switch
            id="includeLogo"
            checked={style.includeLogo}
            onCheckedChange={(checked) => handleChange('includeLogo', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="includeSocial">Include Social Icons</Label>
          <Switch
            id="includeSocial"
            checked={style.includeSocial}
            onCheckedChange={(checked) => handleChange('includeSocial', checked)}
          />
        </div>
      </div>
    </div>
  );
};