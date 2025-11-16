import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Quote, Code, Image as ImageIcon, Link as LinkIcon, Heading1, Heading2, Heading3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder = "Write your article..." }: RichTextEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setShowImageInput(false);
    }
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-muted/50 border-b border-border p-2 flex flex-wrap gap-1">
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('bold') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('italic') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          <Heading1 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('code') ? 'default' : 'ghost'}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setShowLinkInput(!showLinkInput)}
        >
          <LinkIcon className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setShowImageInput(!showImageInput)}
        >
          <ImageIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Link Input */}
      {showLinkInput && (
        <div className="bg-muted/30 border-b border-border p-3 flex gap-2">
          <Input
            placeholder="Enter URL..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addLink()}
          />
          <Button type="button" onClick={addLink}>Add Link</Button>
          <Button type="button" variant="outline" onClick={() => setShowLinkInput(false)}>Cancel</Button>
        </div>
      )}

      {/* Image Input */}
      {showImageInput && (
        <div className="bg-muted/30 border-b border-border p-3 flex gap-2">
          <Input
            placeholder="Enter image URL..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addImage()}
          />
          <Button type="button" onClick={addImage}>Add Image</Button>
          <Button type="button" variant="outline" onClick={() => setShowImageInput(false)}>Cancel</Button>
        </div>
      )}

      {/* Editor Content */}
      <EditorContent 
        editor={editor} 
        className="prose prose-invert max-w-none p-4 min-h-[400px] focus:outline-none"
      />
    </div>
  );
}