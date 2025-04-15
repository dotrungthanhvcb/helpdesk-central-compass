
import React from "react";
import { useApp } from "@/contexts/AppContext";
import { Document } from "@/types/contracts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Image, FileSpreadsheet, File, Download, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

interface DocumentListProps {
  documents: Document[];
  onDelete?: () => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ documents, onDelete }) => {
  const { deleteDocument } = useApp();
  const { toast } = useToast();

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Chưa có tài liệu nào được tải lên
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài liệu này không?")) {
      try {
        deleteDocument(id);
        if (onDelete) {
          onDelete();
        }
        toast({
          title: "Xóa thành công",
          description: "Tài liệu đã được xóa thành công",
        });
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Không thể xóa tài liệu. Vui lòng thử lại sau.",
          variant: "destructive",
        });
      }
    }
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "docx":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "image":
        return <Image className="h-5 w-5 text-green-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch (type) {
      case "pdf":
        return "PDF";
      case "docx":
        return "Word Document";
      case "image":
        return "Hình ảnh";
      default:
        return "Khác";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Tên tài liệu</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Kích thước</TableHead>
            <TableHead>Ngày tải lên</TableHead>
            <TableHead>Người tải</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>{getDocumentIcon(doc.type)}</TableCell>
              <TableCell className="font-medium">{doc.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{getDocumentTypeLabel(doc.type)}</Badge>
              </TableCell>
              <TableCell>{formatFileSize(doc.size)}</TableCell>
              <TableCell>
                {format(new Date(doc.uploadedAt), "dd/MM/yyyy HH:mm", { locale: vi })}
              </TableCell>
              <TableCell>{doc.uploadedByName}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" asChild>
                    <a href={doc.url} target="_blank" rel="noopener noreferrer" download>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(doc.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DocumentList;
