import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/runtimeClient";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ChevronRight, File, Folder, Save, RefreshCw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GitHubItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
  sha?: string;
}

export default function CodeEditor() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fileTree, setFileTree] = useState<GitHubItem[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadDirectory('');
    }
  }, [isAdmin]);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/");
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const loadDirectory = async (path: string) => {
    try {
      setLoadingFile(true);
      const { data, error } = await supabase.functions.invoke('github-api', {
        body: { action: 'getContents', path }
      });

      if (error) throw error;

      const items = Array.isArray(data) ? data : [data];
      setFileTree(items.filter((item: GitHubItem) => 
        !item.name.startsWith('.') && 
        item.name !== 'node_modules' &&
        item.name !== 'dist' &&
        item.name !== 'build'
      ));
      setCurrentPath(path);
    } catch (error) {
      console.error('Error loading directory:', error);
      toast.error('Failed to load directory');
    } finally {
      setLoadingFile(false);
    }
  };

  const loadFile = async (path: string) => {
    try {
      setLoadingFile(true);
      const { data, error } = await supabase.functions.invoke('github-api', {
        body: { action: 'getFile', path }
      });

      if (error) throw error;

      setFileContent(data.decodedContent || '');
      setOriginalContent(data.decodedContent || '');
      setSelectedFile(path);
      setCommitMessage(`Update ${path.split('/').pop()}`);
    } catch (error) {
      console.error('Error loading file:', error);
      toast.error('Failed to load file');
    } finally {
      setLoadingFile(false);
    }
  };

  const saveFile = async () => {
    if (!selectedFile || !commitMessage) {
      toast.error('Please enter a commit message');
      return;
    }

    try {
      setSaving(true);
      const { error } = await supabase.functions.invoke('github-api', {
        body: {
          action: 'updateFile',
          path: selectedFile,
          content: fileContent,
          message: commitMessage
        }
      });

      if (error) throw error;

      setOriginalContent(fileContent);
      toast.success('File saved and committed to GitHub!');
    } catch (error) {
      console.error('Error saving file:', error);
      toast.error('Failed to save file');
    } finally {
      setSaving(false);
    }
  };

  const handleItemClick = (item: GitHubItem) => {
    if (item.type === 'dir') {
      loadDirectory(item.path);
    } else {
      loadFile(item.path);
    }
  };

  const navigateUp = () => {
    const pathParts = currentPath.split('/');
    pathParts.pop();
    loadDirectory(pathParts.join('/'));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Verifying admin access...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  const hasUnsavedChanges = fileContent !== originalContent;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <main className="flex-1">
          <header className="h-16 border-b flex items-center px-6 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-2xl font-bold">Code Editor</h1>
          </header>

          <div className="p-6">
            <div className="grid grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
              {/* File Tree */}
              <div className="col-span-3 border rounded-lg bg-card p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Files</h2>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => loadDirectory(currentPath)}
                    disabled={loadingFile}
                  >
                    <RefreshCw className={`h-4 w-4 ${loadingFile ? 'animate-spin' : ''}`} />
                  </Button>
                </div>

                {currentPath && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={navigateUp}
                    className="w-full justify-start mb-2"
                  >
                    <ChevronRight className="h-4 w-4 rotate-180 mr-2" />
                    ..
                  </Button>
                )}

                <ScrollArea className="h-[calc(100%-4rem)]">
                  {fileTree.map((item) => (
                    <Button
                      key={item.path}
                      variant={selectedFile === item.path ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => handleItemClick(item)}
                      className="w-full justify-start mb-1"
                    >
                      {item.type === 'dir' ? (
                        <Folder className="h-4 w-4 mr-2" />
                      ) : (
                        <File className="h-4 w-4 mr-2" />
                      )}
                      {item.name}
                    </Button>
                  ))}
                </ScrollArea>
              </div>

              {/* Editor */}
              <div className="col-span-9 border rounded-lg bg-card p-4 flex flex-col">
                {selectedFile ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="font-semibold">{selectedFile}</h2>
                        {hasUnsavedChanges && (
                          <p className="text-sm text-orange-500">Unsaved changes</p>
                        )}
                      </div>
                      <Button
                        onClick={saveFile}
                        disabled={saving || !hasUnsavedChanges}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? 'Saving...' : 'Save & Commit'}
                      </Button>
                    </div>

                    <Input
                      placeholder="Commit message..."
                      value={commitMessage}
                      onChange={(e) => setCommitMessage(e.target.value)}
                      className="mb-4"
                    />

                    <Textarea
                      value={fileContent}
                      onChange={(e) => setFileContent(e.target.value)}
                      className="flex-1 font-mono text-sm"
                      placeholder="Select a file to edit..."
                    />
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Select a file from the tree to start editing
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
