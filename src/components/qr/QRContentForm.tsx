import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContentType } from "@/pages/dashboard/QRCodeGenerator";

interface QRContentFormProps {
  type: ContentType;
  businessName: string;
  onChange: (content: string) => void;
}

export const QRContentForm = ({ type, businessName, onChange }: QRContentFormProps) => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    // Generate content based on form data
    let content = "";

    switch (type) {
      case "url":
        content = formData.url || "";
        break;
      case "text":
        content = formData.text || "";
        break;
      case "vcard":
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${formData.name || ""}
ORG:${formData.company || businessName}
TEL:${formData.phone || ""}
EMAIL:${formData.email || ""}
URL:${formData.website || ""}
END:VCARD`;
        content = vcard;
        break;
      case "wifi":
        content = `WIFI:T:${formData.encryption || "WPA"};S:${formData.ssid || ""};P:${formData.password || ""};H:${formData.hidden === "true" ? "true" : ""};;`;
        break;
      case "email":
        content = `mailto:${formData.email || ""}?subject=${encodeURIComponent(formData.subject || "")}&body=${encodeURIComponent(formData.body || "")}`;
        break;
      case "sms":
        content = `sms:${formData.phone || ""}?body=${encodeURIComponent(formData.message || "")}`;
        break;
      case "phone":
        content = `tel:${formData.phone || ""}`;
        break;
    }

    onChange(content);
  }, [formData, type, businessName, onChange]);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  switch (type) {
    case "url":
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="url">Website URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={formData.url || ""}
              onChange={(e) => updateField("url", e.target.value)}
            />
          </div>
        </div>
      );

    case "text":
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="text">Text Content</Label>
            <Textarea
              id="text"
              placeholder="Enter any text..."
              value={formData.text || ""}
              onChange={(e) => updateField("text", e.target.value)}
              rows={5}
            />
          </div>
        </div>
      );

    case "vcard":
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={formData.name || ""}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              placeholder={businessName || "Company Name"}
              value={formData.company || businessName}
              onChange={(e) => updateField("company", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={formData.phone || ""}
              onChange={(e) => updateField("phone", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="contact@example.com"
              value={formData.email || ""}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              type="url"
              placeholder="https://example.com"
              value={formData.website || ""}
              onChange={(e) => updateField("website", e.target.value)}
            />
          </div>
        </div>
      );

    case "wifi":
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="ssid">Network Name (SSID)</Label>
            <Input
              id="ssid"
              placeholder="MyWiFiNetwork"
              value={formData.ssid || ""}
              onChange={(e) => updateField("ssid", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter WiFi password"
              value={formData.password || ""}
              onChange={(e) => updateField("password", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="encryption">Encryption</Label>
            <Select
              value={formData.encryption || "WPA"}
              onValueChange={(value) => updateField("encryption", value)}
            >
              <SelectTrigger id="encryption">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WPA">WPA/WPA2</SelectItem>
                <SelectItem value="WEP">WEP</SelectItem>
                <SelectItem value="nopass">None</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="hidden">Hidden Network</Label>
            <Select
              value={formData.hidden || "false"}
              onValueChange={(value) => updateField("hidden", value)}
            >
              <SelectTrigger id="hidden">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">No</SelectItem>
                <SelectItem value="true">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );

    case "email":
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="contact@example.com"
              value={formData.email || ""}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Email subject"
              value={formData.subject || ""}
              onChange={(e) => updateField("subject", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="body">Message</Label>
            <Textarea
              id="body"
              placeholder="Email message..."
              value={formData.body || ""}
              onChange={(e) => updateField("body", e.target.value)}
              rows={4}
            />
          </div>
        </div>
      );

    case "sms":
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={formData.phone || ""}
              onChange={(e) => updateField("phone", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="SMS message..."
              value={formData.message || ""}
              onChange={(e) => updateField("message", e.target.value)}
              rows={4}
            />
          </div>
        </div>
      );

    case "phone":
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={formData.phone || ""}
              onChange={(e) => updateField("phone", e.target.value)}
            />
          </div>
        </div>
      );

    default:
      return null;
  }
};
