
import React, { useState, useRef } from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DocumentType } from "@/types/contracts";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploaderProps {
  contractId: string;
  onUploadComplete?: () => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  contractId,
  onUploadComplete,
}) => {
  const { uploadDocument } = useApp();
  const { toast } = useToast();
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState<DocumentType>("pdf");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Auto-set document name if not provided
      if (!documentName) {
        setDocumentName(selectedFile.name.split('.')[0]);
      }
      
      // Auto-detect document type based on file extension
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileExt === 'pdf') {
        setDocumentType('pdf');
      } else if (fileExt === 'docx' || fileExt === 'doc') {
        setDocumentType('docx');
      } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExt || '')) {
        setDocumentType('image');
      } else {
        setDocumentType('other');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Thiếu tệp",
        description: "Vui lòng chọn tệp để tải lên",
        variant: "destructive",
      });
      return;
    }

    if (!documentName) {
      toast({
        title: "Thiếu tên tài liệu",
        description: "Vui lòng nhập tên cho tài liệu",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // In a real app, you'd upload to storage and get a URL back
      const fakeUrl = `https://example.com/files/${file.name}`;
      
      await uploadDocument({
        contractId,
        name: documentName,
        type: documentType,
        url: fakeUrl,
        size: file.size,
      }, file);

      setDocumentName("");
      setDocumentType("pdf");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (onUploadComplete) {
        onUploadComplete();
      }

      toast({
        title: "Tải lên thành công",
        description: "Tài liệu đã được tải lên thành công",
      });
    } catch (error) {
      toast({
        title: "Lỗi khi tải lên",
        description: "Không thể tải lên tài liệu. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-md bg-card">
      <h3 className="text-lg font-medium">Tải lên tài liệu</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="documentName">Tên tài liệu</Label>
          <Input
            id="documentName"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            placeholder="Nhập tên tài liệu"
          />
        </div>

        <div>
          <Label htmlFor="documentType">Loại tài liệu</Label>
          <Select value={documentType} onValueChange={(value) => setDocumentType(value as DocumentType)}>
            <SelectTrigger id="documentType">
              <SelectValue placeholder="Chọn loại tài liệu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="docx">Word Document</SelectItem>
              <SelectItem value="image">Hình ảnh</SelectItem>
              <SelectItem value="other">Khác</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="file">Chọn tệp</Label>
          <div className="flex items-center gap-2">
            <Input
              ref={fileInputRef}
              id="file"
              type="file"
              onChange={handleFileChange}
              className="flex-1"
            />
            {file && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={clearFile}
                className="h-10 w-10 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {file && (
            <p className="text-sm text-muted-foreground">
              {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleUpload}
          disabled={isUploading || !file}
          className="w-full sm:w-auto"
        >
          {isUploading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang tải lên...
            </span>
          ) : (
            <span className="flex items-center">
              <Upload className="mr-2 h-4 w-4" />
              Tải lên
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DocumentUploader;
