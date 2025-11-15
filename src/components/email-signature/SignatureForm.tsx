import { SignatureData } from "@/pages/dashboard/EmailSignatureGenerator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useRef } from "react";

interface SignatureFormProps {
  data: SignatureData;
  onChange: (data: SignatureData) => void;
  onImageUpload: (file: File, type: 'photo' | 'logo' | 'banner') => Promise<string | null>;
}

export const SignatureForm = ({ data, onChange, onImageUpload }: SignatureFormProps) => {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof SignatureData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleImageUpload = async (type: 'photo' | 'logo' | 'banner', file: File) => {
    const url = await onImageUpload(file, type);
    if (url) {
      onChange({ ...data, [`${type}Url`]: url });
    }
  };

  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="social">Social</TabsTrigger>
        <TabsTrigger value="branding">Branding</TabsTrigger>
      </TabsList>

      <TabsContent value="personal" className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={data.fullName}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="John Smith"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job Title *</Label>
          <Input
            id="jobTitle"
            value={data.jobTitle}
            onChange={(e) => handleChange('jobTitle', e.target.value)}
            placeholder="Product Manager"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company *</Label>
          <Input
            id="company"
            value={data.company}
            onChange={(e) => handleChange('company', e.target.value)}
            placeholder="Acari Ventures"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={data.department || ''}
            onChange={(e) => handleChange('department', e.target.value)}
            placeholder="Engineering"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="john@company.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobilePhone">Mobile Phone</Label>
          <Input
            id="mobilePhone"
            type="tel"
            value={data.mobilePhone || ''}
            onChange={(e) => handleChange('mobilePhone', e.target.value)}
            placeholder="+1 (555) 987-6543"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            value={data.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="https://company.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={data.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="123 Main St, City, State 12345"
          />
        </div>
      </TabsContent>

      <TabsContent value="social" className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn URL</Label>
          <Input
            id="linkedin"
            type="url"
            value={data.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="twitter">Twitter/X URL</Label>
          <Input
            id="twitter"
            type="url"
            value={data.twitter || ''}
            onChange={(e) => handleChange('twitter', e.target.value)}
            placeholder="https://twitter.com/username"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="facebook">Facebook URL</Label>
          <Input
            id="facebook"
            type="url"
            value={data.facebook || ''}
            onChange={(e) => handleChange('facebook', e.target.value)}
            placeholder="https://facebook.com/username"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram URL</Label>
          <Input
            id="instagram"
            type="url"
            value={data.instagram || ''}
            onChange={(e) => handleChange('instagram', e.target.value)}
            placeholder="https://instagram.com/username"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="github">GitHub URL</Label>
          <Input
            id="github"
            type="url"
            value={data.github || ''}
            onChange={(e) => handleChange('github', e.target.value)}
            placeholder="https://github.com/username"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="youtube">YouTube URL</Label>
          <Input
            id="youtube"
            type="url"
            value={data.youtube || ''}
            onChange={(e) => handleChange('youtube', e.target.value)}
            placeholder="https://youtube.com/@username"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline / Slogan</Label>
          <Input
            id="tagline"
            value={data.tagline || ''}
            onChange={(e) => handleChange('tagline', e.target.value)}
            placeholder="Building the future of startups"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="disclaimer">Disclaimer / Notice</Label>
          <Textarea
            id="disclaimer"
            value={data.disclaimer || ''}
            onChange={(e) => handleChange('disclaimer', e.target.value)}
            placeholder="This email and any attachments are confidential..."
            rows={3}
          />
        </div>
      </TabsContent>

      <TabsContent value="branding" className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label>Profile Photo</Label>
          <div className="flex items-center gap-2">
            <Input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload('photo', file);
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => photoInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Photo
            </Button>
            {data.photoUrl && (
              <img src={data.photoUrl} alt="Photo" className="h-10 w-10 rounded-full object-cover" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Company Logo</Label>
          <div className="flex items-center gap-2">
            <Input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload('logo', file);
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => logoInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Logo
            </Button>
            {data.logoUrl && (
              <img src={data.logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Banner Image (for Banner template)</Label>
          <div className="flex items-center gap-2">
            <Input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload('banner', file);
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => bannerInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Banner
            </Button>
          </div>
          {data.bannerUrl && (
            <img src={data.bannerUrl} alt="Banner" className="w-full h-20 object-cover rounded" />
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};