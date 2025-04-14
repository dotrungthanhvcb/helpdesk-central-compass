
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  TicketCategory,
  TicketPriority,
  Ticket,
} from "@/types";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

const CreateTicket = () => {
  const { createTicket, user } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TicketCategory>('tech_setup');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [tags, setTags] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ thông tin tiêu đề và mô tả.",
        variant: "destructive",
      });
      return;
    }

    const newTicket: Omit<Ticket, "requester" | "id" | "createdAt" | "updatedAt"> = {
      title,
      description,
      category,
      status: "pending",
      priority,
      tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
    };

    createTicket(newTicket);
    toast({
      title: "Tạo thành công",
      description: "Ticket của bạn đã được tạo thành công.",
    });
    navigate("/tickets");
  };

  return (
    <div className="container py-6">
      <div className="flex items-center mb-6">
        <Link to="/tickets">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4 mr-1" /> Quay lại
          </Button>
        </Link>
        <h1 className="text-3xl font-bold ml-4">Tạo Ticket mới</h1>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Thông tin Ticket</CardTitle>
          <CardDescription>Nhập thông tin chi tiết cho ticket mới</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Tiêu đề</Label>
              <Input
                type="text"
                id="title"
                placeholder="Nhập tiêu đề ticket"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                placeholder="Nhập mô tả chi tiết"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Loại</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as TicketCategory)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech_setup">Tech Setup</SelectItem>
                  <SelectItem value="dev_issues">Dev Issues</SelectItem>
                  <SelectItem value="mentoring">Mentoring</SelectItem>
                  <SelectItem value="hr_matters">HR Matters</SelectItem>
                  <SelectItem value="env_setup">Env Setup</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Độ ưu tiên</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as TicketPriority)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn độ ưu tiên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Thấp</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="high">Cao</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tags">Tags (phân tách bằng dấu phẩy)</Label>
              <Input
                type="text"
                id="tags"
                placeholder="Ví dụ: bug, feature, question"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
            <Button type="submit">Tạo Ticket</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTicket;
