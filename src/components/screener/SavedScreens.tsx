
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Save, Trash, Check } from "lucide-react";
import { ScreenerParams } from "@/lib/api/screener";

interface SavedScreensProps {
  currentFilters: ScreenerParams;
  onLoadTemplate: (filters: ScreenerParams) => void;
}

interface SavedTemplate {
  id: string;
  name: string;
  filters: ScreenerParams;
  createdAt: string;
}

export function SavedScreens({ currentFilters, onLoadTemplate }: SavedScreensProps) {
  const [templateName, setTemplateName] = useState("");
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>(() => {
    const saved = localStorage.getItem("screeningTemplates");
    return saved ? JSON.parse(saved) : [];
  });

  const saveTemplate = () => {
    if (!templateName.trim()) {
      toast.error("Please enter a name for your template");
      return;
    }

    const newTemplate: SavedTemplate = {
      id: Date.now().toString(),
      name: templateName,
      filters: { ...currentFilters },
      createdAt: new Date().toISOString(),
    };

    const updatedTemplates = [...savedTemplates, newTemplate];
    setSavedTemplates(updatedTemplates);
    localStorage.setItem("screeningTemplates", JSON.stringify(updatedTemplates));

    toast.success("Screening template saved");
    setTemplateName("");
  };

  const deleteTemplate = (id: string) => {
    const updatedTemplates = savedTemplates.filter(template => template.id !== id);
    setSavedTemplates(updatedTemplates);
    localStorage.setItem("screeningTemplates", JSON.stringify(updatedTemplates));
    toast.success("Template deleted");
  };

  const loadTemplate = (template: SavedTemplate) => {
    onLoadTemplate(template.filters);
    toast.success(`Loaded template: ${template.name}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Screens</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Save new template */}
          <div className="flex gap-2">
            <Input
              placeholder="Template name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
            <Button onClick={saveTemplate}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>

          {/* List of saved templates */}
          {savedTemplates.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No saved templates yet. Save your current filters to reuse them later.
            </p>
          ) : (
            <div className="space-y-2 mt-4">
              {savedTemplates.map((template) => (
                <div 
                  key={template.id} 
                  className="flex items-center justify-between p-2 border rounded-md"
                >
                  <span className="font-medium">{template.name}</span>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => loadTemplate(template)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-500 hover:text-red-700" 
                      onClick={() => deleteTemplate(template.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default SavedScreens;
